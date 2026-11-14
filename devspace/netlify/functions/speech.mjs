const env = key => { try { return Netlify.env.get(key); } catch { return process.env[key]; } };
const reply = (error, status) => Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });

async function verifyOwner(req) {
  if (req.headers.get('origin') !== new URL(req.url).origin) return reply('Origem não permitida.', 403);
  const authorization = req.headers.get('authorization') || '';
  if (!/^Bearer [A-Za-z0-9_]+$/.test(authorization)) return reply('Conecte o GitHub para ouvir a resposta.', 401);
  const response = await fetch('https://api.github.com/user', {
    headers: { Authorization: authorization, Accept: 'application/vnd.github+json' },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) return reply('Token GitHub inválido ou expirado.', 401);
  const user = await response.json();
  if (String(user.id) !== (env('DEVSPACE_OWNER_ID') || '277391915')) return reply('O agente está disponível apenas para o proprietário deste DevSpace.', 403);
  return null;
}

export default async function (req) {
  if (req.method !== 'POST') return reply('Use POST.', 405);
  try {
    const authError = await verifyOwner(req);
    if (authError) return authError;
    const apiKey = env('ELEVENLABS_API_KEY');
    const voiceId = env('ELEVENLABS_VOICE_ID');
    if (!apiKey) return reply('Configure ELEVENLABS_API_KEY como segredo no Netlify.', 503);
    if (!voiceId || !/^[A-Za-z0-9_-]{5,80}$/.test(voiceId)) return reply('Configure ELEVENLABS_VOICE_ID no Netlify com o ID de uma voz da sua conta.', 503);
    const bodyText = await req.text();
    if (bodyText.length > 16000) return reply('Texto muito longo para narrar. Peça uma resposta menor.', 413);
    let body;
    try { body = JSON.parse(bodyText); } catch { return reply('Pedido inválido.', 400); }
    if (typeof body.text !== 'string' || !body.text.trim()) return reply('Não há texto para narrar.', 400);
    const upstream = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}/stream`, {
      method: 'POST',
      headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text: body.text.slice(0, 3500), model_id: env('ELEVENLABS_MODEL') || 'eleven_multilingual_v2', voice_settings: { stability: 0.45, similarity_boost: 0.75 } }),
      signal: AbortSignal.timeout(60000),
    });
    if (!upstream.ok) return reply('Não foi possível gerar a voz. Confira os créditos, permissões Text to Speech e o ID da voz no ElevenLabs.', 502);
    return new Response(upstream.body, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    return reply('Falha ao gerar a voz. Tente novamente.', 502);
  }
}

export const config = { path: '/api/speech', method: 'POST', rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowSize: 60, windowLimit: 10 } };
