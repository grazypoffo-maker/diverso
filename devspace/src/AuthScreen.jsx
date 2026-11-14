import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Code, EnvelopeSimple, LockKey, Sparkle, GoogleLogo } from '@phosphor-icons/react';
import {
  getIdentitySettings,
  getIdentityUser,
  googleLoginIdentity,
  loginIdentity,
  requestIdentityPasswordRecovery,
  signupIdentity,
  updateIdentityUser,
} from './identity';
import { PwaInstall } from './PwaInstall';

export function AuthScreen({ onAuthenticated, initialError = '', initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);
  const [notice, setNotice] = useState(initialMode === 'reset' ? 'Crie uma nova senha para sua conta.' : '');
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    getIdentitySettings().then(settings => { if (active) setGoogleEnabled(Boolean(settings.providers?.google)); }).catch(() => {});
    return () => { active = false; };
  }, []);

  function switchMode(next) {
    setMode(next);
    setError('');
    setNotice('');
    setPassword('');
    setConfirmation('');
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (mode === 'forgot') {
        await requestIdentityPasswordRecovery(email.trim());
        setNotice('Se esse endereço estiver cadastrado, você receberá um e-mail com o link para trocar a senha.');
      } else if (mode === 'reset') {
        if (password.length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.');
        if (password !== confirmation) throw new Error('As senhas não coincidem.');
        const user = await updateIdentityUser({ password });
        onAuthenticated(user);
      } else if (mode === 'signup') {
        if (password.length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.');
        if (password !== confirmation) throw new Error('As senhas não coincidem.');
        await signupIdentity(email.trim(), password);
        const user = await getIdentityUser();
        if (user) onAuthenticated(user);
        else {
          setMode('login');
          setNotice('Conta criada. Confira seu e-mail para confirmar o cadastro e depois entre.');
        }
      } else {
        const user = await loginIdentity(email.trim(), password);
        onAuthenticated(user);
      }
    } catch (e) {
      setError(e.message || 'Não foi possível concluir. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  function enterWithGoogle() {
    if (!googleEnabled) {
      setError('O acesso com Google ainda precisa ser ativado em Netlify → Identity → Registration → External providers.');
      return;
    }
    googleLoginIdentity();
  }

  const title = mode === 'forgot' ? 'Recuperar senha' : mode === 'reset' ? 'Crie uma nova senha' : mode === 'signup' ? 'Crie sua conta' : 'Entre no DevSpace';
  const description = mode === 'forgot'
    ? 'Enviaremos um link de recuperação para o e-mail da sua conta.'
    : mode === 'reset'
      ? 'Escolha uma senha nova com pelo menos 8 caracteres.'
      : mode === 'signup'
        ? 'Organize seus projetos em uma conta protegida por e-mail.'
        : 'Acesse seus projetos e continue de onde parou.';

  return <main className="auth-page">
    <section className="auth-card" aria-labelledby="auth-title">
      <a className="auth-brand" href="/" aria-label="DevSpace"><span className="auth-mark"><Code size={25}/></span><span>DevSpace<span className="brand-slash"> /</span></span></a>
      <div className="auth-heading"><span className="auth-kicker"><Sparkle size={16}/> SEU ESPAÇO DE CRIAÇÃO</span><h1 id="auth-title">{title}</h1><p>{description}</p></div>
      {mode === 'login' && <><button className="google-login" type="button" onClick={enterWithGoogle}><GoogleLogo size={20} weight="bold"/> Entrar com Google</button><div className="auth-divider"><span>ou entre com e-mail</span></div></>}
      <form className="auth-form" onSubmit={submit}>
        {mode !== 'reset' && <label>E-mail<div className="auth-input-wrap"><EnvelopeSimple size={20}/><input autoComplete="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@exemplo.com"/></div></label>}
        {mode !== 'forgot' && <label>{mode === 'reset' ? 'Nova senha' : 'Senha'}<div className="auth-input-wrap"><LockKey size={20}/><input autoComplete={mode === 'signup' || mode === 'reset' ? 'new-password' : 'current-password'} type="password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Pelo menos 8 caracteres"/></div></label>}
        {(mode === 'signup' || mode === 'reset') && <label>Confirme a senha<div className="auth-input-wrap"><LockKey size={20}/><input autoComplete="new-password" type="password" minLength={8} required value={confirmation} onChange={e=>setConfirmation(e.target.value)} placeholder="Digite a senha novamente"/></div></label>}
        {mode === 'login' && <button className="auth-text-button auth-forgot" type="button" onClick={()=>switchMode('forgot')}>Esqueci minha senha</button>}
        {error && <p className="auth-error" role="alert">{error}</p>}
        {notice && <p className="auth-notice" role="status">{notice}</p>}
        <button className="auth-submit" type="submit" disabled={busy}>{busy?'Aguarde…':mode==='forgot'?'Enviar link de recuperação':mode==='reset'?'Salvar nova senha':mode==='signup'?'Criar conta':'Entrar'}<ArrowRight size={19}/></button>
      </form>
      {mode !== 'reset' && mode !== 'forgot' && <p className="auth-switch">{mode === 'signup' ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'} <button className="auth-text-button" onClick={()=>switchMode(mode==='signup'?'login':'signup')}>{mode==='signup'?'Entrar':'Criar conta'}</button></p>}
      {(mode === 'forgot' || mode === 'reset') && <button className="auth-back" onClick={()=>switchMode('login')}><ArrowLeft size={18}/> Voltar para entrar</button>}
      <p className="auth-footnote">Seus projetos ficam salvos neste navegador e nesta conta.</p>
      <PwaInstall />
    </section>
  </main>;
}
