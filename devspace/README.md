# DevSpace

Painel React/Vite conectado ao GitHub, mantendo a direção visual Paper Studio escolhida pelo usuário.

## Funcionalidades

- Login e cadastro por e-mail com Netlify Identity. O link “Esqueci minha senha” envia a recuperação por e-mail; a confirmação e a troca da senha retornam ao DevSpace. Os projetos continuam guardados localmente no navegador e separados por conta, sem sincronização entre dispositivos.
- Sincroniza repositórios públicos de `grazypoffo-maker` ao abrir e a cada 2 minutos enquanto a aba está visível. Percorre todas as páginas (limite explícito: 2.000 repositórios). Erros não removem os projetos existentes.
- Conecta token GitHub pessoal na memória da aba; não persiste token, não inclui token no código e não imprime credenciais. Tokens são enviados diretamente ao GitHub; o agente recebe o token no servidor apenas para validar a identidade via GitHub, sem repassá-lo à OpenAI.
- Cria repositório público e envia arquivos/pasta em um commit, preservando o README inicial e sem force push. Requer token pessoal autorizado. Até 80 arquivos, 2 MB/arquivo e 10 MB total. Filtra dependências, builds, `.env` e chaves por nome. O usuário precisa revisar o conteúdo para remover segredos embutidos no código.
- Lê árvore, metadados, README/manifests e arquivos do último commit. Mostra nomes e alterações reais, sem confundir um commit com trabalho acontecendo ao vivo.
- Gera prompt autossuficiente, editável e copiável com contexto, objetivo e roteiro de melhorias. Não usa IA nem exige API para essa função; não afirma ter analisado o conteúdo completo do código.
- Projetos com arquivos entram em andamento; vazios entram em planejamento. Status e tarefas manuais são preservados na sincronização. Conclusão é manual.
- Dados do painel ficam em localStorage do dispositivo; exporta backup JSON. Não há sincronização entre dispositivos nem banco de dados nesta versão.
- Agente Hugging Face com respostas em streaming, contexto dos projetos/tarefas e histórico em memória. Não lê arquivos sozinho, não executa código e não escreve no GitHub. Conta autorizada pelo ID imutável GitHub, restrição de origem, limites de tamanho e rate limit Netlify.
- Conversa por voz: o navegador grava o microfone, o Hugging Face transcreve e a resposta pode ser narrada pelo ElevenLabs. O app pede permissão do microfone no toque do usuário e envia gravações curtas ao provedor para transcrição.
- PWA instalável no iPhone pela opção Safari → Compartilhar → Adicionar à Tela de Início, com ícone DevSpace e shell básico disponível offline. No Android, Chrome pode oferecer instalação. Os dados seguem locais por dispositivo.
- Login com Google preparado pelo Netlify Identity; o botão só ativa quando Google estiver habilitado em Identity → Registration → External providers.

## Executar e validar

```sh
npm install
npm run dev
npm run build
npm run test:sites
node --test tests/integrations.test.mjs
```

Build gera `dist/client` e os artefatos Sites originais. O agente é uma Netlify Function: Vite sozinho não emula `/api/agent`.

## Publicação no Netlify

Repositório: `grazypoffo-maker/diverso`, branch `devspace-paper-studio`, diretório base `devspace`, comando `npm run build`, publish `dist/client`. O `netlify.toml` na raiz do repositório declara a base. Os arquivos da função ficam em `devspace/netlify/functions`, fora do publish. `.netlify` é ignorado no Git.

O site existente foi publicado manualmente; para publicar também a Function, vincule esse repositório/branch no Netlify ou use Netlify CLI autenticado. Upload apenas do `dist/client` publica a interface e integração GitHub no navegador, mas não instala o agente no servidor.

## Configuração do agente

Configure estes valores em variáveis secretas do Netlify, nunca no código:

- `HUGGINGFACE_API_KEY`: token novo do Hugging Face com permissão **Inference Providers**.
- `HUGGINGFACE_MODEL`: identificador do modelo de chat disponível para sua conta.
- `HUGGINGFACE_STT_MODEL` (opcional): modelo de transcrição; padrão `openai/whisper-large-v3-turbo`.
- `ELEVENLABS_API_KEY`: chave nova com acesso **Text to Speech**.
- `ELEVENLABS_VOICE_ID`: ID de uma voz habilitada na sua conta.
- `ELEVENLABS_MODEL` (opcional): padrão `eleven_multilingual_v2`.

Chat e transcrição usam Hugging Face no servidor; narração usa o endpoint de streaming de Text to Speech do ElevenLabs. As chaves não chegam ao navegador. O agente informa quando alguma configuração estiver ausente.

`DEVSPACE_OWNER_ID` pode substituir `277391915`, proprietário atual. O agente verifica esse ID consultando `/user` no GitHub a cada chamada. Reimplante após alterar variáveis.

Não coloque credenciais em `netlify.toml`, código frontend, arquivos ou mensagens no chat. A assinatura ChatGPT não é uma chave API nem fornece créditos API ao aplicativo.

## Instalação e autenticação

Para instalar no iPhone, abra o endereço publicado no Safari, toque em Compartilhar e selecione Adicionar à Tela de Início. A Google Play Store não distribui apps para iPhone; a versão PWA não exige publicação em loja. Login com Google requer que o provedor seja configurado no painel Netlify. O plano Free atual do projeto usa o e-mail padrão de recuperação; modelos visuais de e-mail personalizados pelo Netlify Identity dependem de plano compatível ou de uma configuração de autenticação/e-mail externa.

## Referências do projeto

- Figma: https://www.figma.com/design/llr5Aobl38rGB1reW3lrV6?node-id=3-2
- Planejamento: https://app.notion.com/p/4173a750298c8126b687ec1f958fc655
