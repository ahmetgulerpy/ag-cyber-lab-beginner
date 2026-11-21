export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ ok: true, app: "ag-cyber-lab-module-09" });
}
