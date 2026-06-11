import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  try {
    const stations = await sql`
      SELECT id, name, address, latitude, longitude, status, "pricePerKwh", "powerKw", type
      FROM stations
      ORDER BY name
    `;
    return NextResponse.json({ stations });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
