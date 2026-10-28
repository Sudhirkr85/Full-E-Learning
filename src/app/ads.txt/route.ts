export const dynamic = "force-static";

export function GET() {
  return new Response("google.com, pub-8160370419154141, DIRECT, f08c47fec0942fa0\n", {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
