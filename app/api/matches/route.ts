export async function GET() {
  try {
    const res = await fetch(
      "https://api.football-data.org/v4/matches",
      {
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_API_KEY!
        }
      }
    );

    const data = await res.json();

    return Response.json(data);

  } catch (err) {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}