import { InferenceClient } from '@huggingface/inference';

const env = key => { try { return Netlify.env.get(key); } catch { return process.env[key]; } };
const reply = (error, status) => Response.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });

async function verifyOwner(req) {
  if (req.headers.get('origin') !== new URL(req.url).origin) return reply('Origem não permitida.', 403);
  const authorization = req.headers.get('authorization') || '';
  if (!/^Bearer [A-Za-z0-9_]+$/.test(authorization)) return reply('Conecte o GitHub para usar o microfone.', 401);
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
    const apiKey = env('HUGGINGFACE_API_KEY');
    if (!apiKey) return reply('Configure HUGGINGFACE_API_KEY como segredo no Netlify.', 503);
    const contentType = (req.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/mpeg', 'audio/mp4a-latm'].includes(contentType)) return reply('Formato de áudio não suportado neste navegador.', 415);
    const audio = new Uint8Array(await req.arrayBuffer());
    if (!audio.length) return reply('A gravação está vazia. Tente falar novamente.', 400);
    if (audio.length > 8 * 1024 * 1024) return reply('Gravação muito longa. Tente uma mensagem de até 60 segundos.', 413);
    const model = env('HUGGINGFACE_STT_MODEL') || 'openai/whisper-large-v3-turbo';
    if (!/^[A-Za-z0-9._/-]{1,160}$/.test(model)) return reply('HUGGINGFACE_STT_MODEL inválido.', 500);
    const client = new InferenceClient(apiKey, { provider: 'auto', signal: AbortSignal.timeout(90000) });
    const result = await client.automaticSpeechRecognition({ model, data: audio });
    if (typeof result.text !== 'string' || !result.text.trim()) return reply('Não consegui entender a gravação. Tente falar mais perto do microfone.', 422);
    return Response.json({ text: result.text.trim() }, { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    return reply('Falha ao transcrever. Confira sua conexão e tente uma gravação mais curta.', 502);
  }
}

export const config = { path: '/api/transcribe', method: 'POST', rateLimit: { action: 'rate_limit', aggregateBy: ['ip', 'domain'], windowSize: 60, windowLimit: 6 } };

