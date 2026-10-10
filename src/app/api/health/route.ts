import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (db) {
      await db.execute(sql`select 1`);
    }
    return Response.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (error) {
    return Response.json({ status: "error", error: String(error) }, { status: 500 });
  }
}
