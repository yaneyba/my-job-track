// CORS utility for Cloudflare Workers

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

export function handleCors(request: Request): Response {
  const origin = request.headers.get('Origin');
  
  // In production, you might want to restrict origins
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://myjobtrack.app',
    'https://www.myjobtrack.app'
  ];

  const responseHeaders = {
    ...corsHeaders,
    'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : '*'
  };

  return new Response(null, {
    status: 200,
    headers: responseHeaders
  });
}

export function addCorsHeaders(response: Response, origin?: string): Response {
  const headers = new Headers(response.headers);
  
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
