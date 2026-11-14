import React, { useEffect, useRef, useState } from 'react';
import { Microphone, PaperPlaneTilt, Sparkle, SpeakerHigh, Stop, X } from '@phosphor-icons/react';

export function Assistant({ projects, token, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [voiceReplies, setVoiceReplies] = useState(false);
  const [error, setError] = useState('');
  const [audio, setAudio] = useState(null);
  const end = useRef(null);
  const abort = useRef(null);
  const recorder = useRef(null);
  const micStream = useRef(null);
  const audioUrl = useRef(null);
  const stopTimer = useRef(null);

  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [messages, audio]);
  useEffect(() => () => {
    abort.current?.abort();
    if (stopTimer.current) clearTimeout(stopTimer.current);
    micStream.current?.getTracks().forEach(track => track.stop());
    if (audioUrl.current) URL.revokeObjectURL(audioUrl.current);
  }, []);

  async function playSpeech(text, messageId) {
    if (!token || !text) return;
    setError('');
    try {
      const response = await fetch('/api/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: text.slice(0, 3500) }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'A voz ainda não está configurada no servidor.');
      }
      const blob = await response.blob();
      if (audioUrl.current) URL.revokeObjectURL(audioUrl.current);
      const url = URL.createObjectURL(blob);
      audioUrl.current = url;
      setAudio({ url, messageId });
      const player = new Audio(url);
      player.play().catch(() => {});
    } catch (e) { setError(e.message || 'Não foi possível gerar a voz.'); }
  }

  async function sendText(rawText, speakResponse = voiceReplies) {
    const content = rawText.trim();
    if (busy || !content) return;
    const history = [...messages, { role: 'user', content }].slice(-12);
    setInput('');
    setError('');
    setMessages(history);
    setBusy(true);
    abort.current = new AbortController();
    const messageId = `${Date.now()}-${Math.random()}`;
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        signal: abort.current.signal,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          messages: history,
          context: projects.slice(0, 30).map(p => ({ name: p.name, repo: p.repo, status: p.status, task: p.task, language: p.language })),
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'O agente ainda não está disponível neste ambiente.');
      }
      setMessages([...history, { role: 'assistant', content: '', id: messageId }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: 'assistant', content: answer, id: messageId }]);
      }
      answer += decoder.decode();
      setMessages([...history, { role: 'assistant', content: answer, id: messageId }]);
      if (speakResponse && answer.trim()) await playSpeech(answer, messageId);
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message || 'Não foi possível responder agora.');
    } finally { setBusy(false); }
  }

  async function transcribe(blob) {
    setTranscribing(true);
    setError('');
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': (blob.type || 'audio/webm').split(';')[0], Authorization: `Bearer ${token}` },
        body: blob,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Não foi possível transcrever.');
      }
      const data = await response.json();
      if (!data.text?.trim()) throw new Error('Não consegui entender a gravação. Tente falar mais perto do microfone.');
      setTranscribing(false);
      setVoiceReplies(true);
      await sendText(data.text, true);
    } catch (e) {
      setError(e.message || 'Não foi possível transcrever o áudio.');
      setTranscribing(false);
    }
  }

  async function startRecording() {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError('Este navegador não oferece gravação de áudio. Atualize o Safari ou use o microfone do teclado.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream.current = stream;
      const options = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus']
        .find(type => MediaRecorder.isTypeSupported(type));
      const currentRecorder = options ? new MediaRecorder(stream, { mimeType: options }) : new MediaRecorder(stream);
      const chunks = [];
      currentRecorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      currentRecorder.onstop = () => {
        if (stopTimer.current) clearTimeout(stopTimer.current);
        stream.getTracks().forEach(track => track.stop());
        micStream.current = null;
        recorder.current = null;
        setRecording(false);
        const clip = new Blob(chunks, { type: currentRecorder.mimeType || 'audio/webm' });
        void transcribe(clip);
      };
      recorder.current = currentRecorder;
      currentRecorder.start();
      setRecording(true);
      stopTimer.current = setTimeout(() => {
        if (currentRecorder.state === 'recording') currentRecorder.stop();
      }, 60000);
    } catch {
      setError('Permita o uso do microfone nas configurações do Safari e tente novamente.');
    }
  }

  function toggleRecording() {
    if (recording && recorder.current?.state === 'recording') recorder.current.stop();
    else void startRecording();
  }

  return <div className="agent-backdrop">
    <aside className="agent-panel" role="dialog" aria-modal="true" aria-label="Agente DevSpace" onKeyDown={e => { if (e.key === 'Escape') onClose(); }}>
      <div className="modal-top"><h2><Sparkle size={24}/> Seu agente</h2><button onClick={onClose} aria-label="Fechar agente"><X size={24}/></button></div>
      <p className="muted">Converse por texto ou voz. O agente usa os projetos e tarefas deste painel; arquivos só entram no contexto se você colar trechos.</p>
      <div className="messages" role="log" aria-live="polite">
        {!messages.length && <div className="agent-empty"><Sparkle size={36}/><h3>Vamos construir algo?</h3><p>Escreva ou toque no microfone para começar.</p>{['O que devo priorizar nos meus projetos?','Como organizar melhor minhas próximas tarefas?'].map(t => <button key={t} onClick={() => setInput(t)}>{t}</button>)}</div>}
        {messages.map((message, index) => <div key={message.id || index} className={'message ' + message.role}>
          <small>{message.role === 'user' ? 'Você' : 'DevSpace · Hugging Face'}</small>
          <div>{message.content || 'Pensando…'}</div>
          {message.role === 'assistant' && message.content && <div className="voice-message-actions">
            <button type="button" className="voice-play-button" onClick={() => void playSpeech(message.content, message.id)}><SpeakerHigh size={17}/> Ouvir</button>
            {audio?.messageId === message.id && <audio controls playsInline src={audio.url} aria-label="Áudio da resposta"/>}
          </div>}
        </div>)}
        <div ref={end}/>
      </div>
      {error && <p role="alert" className="error">{error}</p>}
      {!token && <p className="hint">Conecte seu GitHub em Integrações para conversar com o agente.</p>}
      {(recording || transcribing) && <p className="voice-status" role="status">{recording ? 'Gravando… toque em parar quando terminar.' : 'Transcrevendo seu áudio…'}</p>}
      <form onSubmit={e => { e.preventDefault(); void sendText(input); }} className="agent-form">
        <label className="sr-only" htmlFor="agent-input">Mensagem para o agente</label>
        <textarea id="agent-input" autoFocus={window.matchMedia('(min-width:721px)').matches} value={input} onChange={e => setInput(e.target.value)} placeholder="Escreva ou fale uma mensagem…" maxLength={12000} rows={3}/>
        <div className="agent-voice-controls">
          <button type="button" className={'voice-control-button microphone-button' + (recording ? ' recording' : '')} onClick={toggleRecording} disabled={!token || busy || transcribing} aria-label={recording ? 'Parar gravação' : 'Gravar mensagem'} title={recording ? 'Parar gravação' : 'Gravar mensagem'}>
            {recording ? <Stop size={21} weight="fill"/> : <Microphone size={21}/>}<span>{recording ? 'Parar' : 'Microfone'}</span>
          </button>
          <button type="button" className={'voice-control-button' + (voiceReplies ? ' selected' : '')} onClick={() => setVoiceReplies(value => !value)} aria-pressed={voiceReplies} title="Ler respostas em voz alta"><SpeakerHigh size={20}/><span>{voiceReplies ? 'Voz ativada' : 'Ativar voz'}</span></button>
          <button className="primary" disabled={busy || transcribing || !token || !input.trim()}><PaperPlaneTilt size={20}/>{busy ? 'Respondendo…' : 'Enviar'}</button>
        </div>
      </form>
      <small className="muted">O áudio é enviado ao Hugging Face para transcrição. As respostas em voz são geradas pelo ElevenLabs. As chaves ficam no servidor.</small>
    </aside>
  </div>;
}
