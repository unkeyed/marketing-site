export const dynamic = 'force-static';

export function GET() {
  return Response.json(
    {
      linkset: [
        {
          anchor: 'https://www.unkey.com/.well-known/api-catalog',
          item: [{ href: 'https://api.unkey.com' }],
        },
        {
          anchor: 'https://api.unkey.com',
          'service-desc': [
            { href: 'https://api.unkey.com/openapi.json', type: 'application/json' },
          ],
          'service-doc': [
            { href: 'https://www.unkey.com/docs/platform/api/overview', type: 'text/html' },
          ],
          status: [{ href: 'https://status.unkey.com', type: 'text/html' }],
        },
      ],
    },
    {
      headers: {
        'Content-Type':
          'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
        Link: '<https://www.unkey.com/.well-known/api-catalog>; rel="api-catalog"',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
}
