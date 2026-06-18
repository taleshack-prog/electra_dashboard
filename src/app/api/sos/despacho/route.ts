import { NextResponse, NextRequest } from 'next/server';
import { neon } from '@neondatabase/serverless';
import Anthropic from '@anthropic-ai/sdk';

const sql = neon(process.env.DATABASE_URL!);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

// Haversine — distância em km
function distancia(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export async function POST(req: NextRequest) {
  const { sosId } = await req.json();
  try {
    // Busca o pedido SOS
    const sos = await sql`SELECT * FROM sos_requests WHERE id=${sosId} AND status='pending' LIMIT 1`;
    if (sos.length === 0) return NextResponse.json({ error: 'SOS não encontrado ou já atendido' }, { status: 404, headers: CORS });

    const pedido = sos[0];

    // Busca resgatistas disponíveis com localização
    const drivers = await sql`SELECT * FROM sos_drivers WHERE "isAvailable"=true AND status='aprovado' AND latitude IS NOT NULL AND longitude IS NOT NULL`;

    if (drivers.length === 0) return NextResponse.json({ error: 'Nenhum resgatista disponível' }, { status: 503, headers: CORS });

    // Ordena por distância (Haversine)
    const ordenados = drivers
      .map((d: any) => ({ ...d, dist: distancia(pedido.latitude, pedido.longitude, d.latitude, d.longitude) }))
      .sort((a: any, b: any) => a.dist - b.dist);

    // IA decide qual resgatista despachar
    const resumo = ordenados.slice(0,5).map((d: any) => 
      `ID:${d.id} Nome:${d.name} Dist:${d.dist.toFixed(1)}km Rating:${d.rating||4.5} Jobs:${d.totalJobs||0}`
    ).join('\n');

    const iaResp = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: `Pedido SOS urgência:${pedido.urgencyLevel} em ${pedido.address}. Resgatistas disponíveis:\n${resumo}\nResponde APENAS com o ID do melhor resgatista para despachar, sem mais nada.`
      }]
    });

    const driverIdIA = (iaResp.content[0] as any).text.trim().replace('ID:', '');
    const escolhido = ordenados.find((d: any) => d.id === driverIdIA) || ordenados[0];

    // Actualiza SOS com resgatista escolhido
    await sql`UPDATE sos_requests SET "assignedDriverId"=${escolhido.id}, "updatedAt"=NOW() WHERE id=${sosId}`;

    return NextResponse.json({ 
      ok: true, 
      driverId: escolhido.id,
      driverName: escolhido.name,
      distancia: escolhido.dist.toFixed(1),
      eta: Math.ceil(escolhido.dist / 0.5) // ~30km/h em cidade
    }, { headers: CORS });

  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS });
  }
}
