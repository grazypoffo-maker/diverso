import React, { useState, useEffect } from 'react';
import { DownloadSimple, X } from '@phosphor-icons/react';

export function PwaInstall() {
  const [open, setOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = event => { event.preventDefault(); setInstallPrompt(event); };
    const onInstalled = () => { setInstalled(true); setInstallPrompt(null); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) setInstalled(true);
    return () => { window.removeEventListener('beforeinstallprompt', onPrompt); window.removeEventListener('appinstalled', onInstalled); };
  }, []);

  async function install() {
    if (!installPrompt) { setOpen(true); return; }
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  if (installed) return <p className="pwa-installed">DevSpace já está instalado neste dispositivo.</p>;
  return <>
    <button className="pwa-install-button" type="button" onClick={install}><DownloadSimple size={18}/> Instalar no celular</button>
    {open && <div className="pwa-dialog-backdrop" onClick={() => setOpen(false)}><section className="pwa-dialog" role="dialog" aria-modal="true" aria-labelledby="pwa-title" onClick={e => e.stopPropagation()}>
      <button className="pwa-dialog-close" onClick={() => setOpen(false)} aria-label="Fechar"><X size={21}/></button>
      <div className="pwa-dialog-icon"><DownloadSimple size={25}/></div><h2 id="pwa-title">Leve o DevSpace para a tela inicial</h2>
      <p>No iPhone, abra este site no <strong>Safari</strong>, toque em <strong>Compartilhar</strong> e escolha <strong>Adicionar à Tela de Início</strong>.</p>
      <p className="pwa-dialog-note">No Android, abra pelo Chrome e toque em “Instalar app” ou “Adicionar à tela inicial”.</p>
      <button className="auth-submit" onClick={() => setOpen(false)}>Entendi</button>
    </section></div>}
  </>;
}
