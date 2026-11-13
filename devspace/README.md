# DevSpace

Painel React/Vite conectado ao GitHub, mantendo a direção visual Paper Studio escolhida pelo usuário.

## Funcionalidades

- Sincroniza repositórios públicos de `grazypoffo-maker` ao abrir e a cada 2 minutos enquanto a aba está visível. Percorre todas as páginas (limite explícito: 2.000 repositórios). Erros não removem os projetos existentes.
- Conecta token GitHub pessoal na memória da aba; não persiste token, não inclui token no código e não imprime credenciais. Tokens são enviados diretamente ao GitHub; o agente recebe o token no servidor apenas para validar a identidade via GitHub, sem repassá-lo à OpenAI.
- Cria repositório público e envia arquivos/pasta em um commit, preservando o README inicial e sem force push. Requer token pessoal autorizado. Até 80 arquivos, 2 MB/arquivo e 10 MB total. Filtra dependências, builds, `.env` e chaves por nome. O usuário precisa revisar o conteúdo para remover segredos embutidos no código.
- Lê árvore, metadados, README/manifests e arquivos do último commit. Mostra nomes e alterações reais, sem confundir um commit com trabalho acontecendo ao vivo.
- Gera prompt autossuficiente, editável e copiável com contexto, objetivo e roteiro de melhorias. Não usa IA nem exige API para essa função; não afirma ter analisado o conteúdo completo do código.
- Projetos com arquivos entram em andamento; vazios entram em planejamento. Status e tarefas manuais são preservados na sincronização. Conclusão é manual.
- Dados do painel ficam em localStorage do dispositivo; exporta backup JSON. Não há sincronização entre dispositivos nem banco de dados nesta versão.
- Agente OpenAI com respostas em streaming, contexto dos projetos/tarefas e histórico em memória. Não lê arquivos sozinho, não executa código e não escreve no GitHub. Conta autorizada pelo ID imutável GitHub, restrição de origem, limites de tamanho e rate limit Netlify.

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

O acesso à OpenAI exige `OPENAI_API_KEY` via Netlify AI Gateway (se o plano e a equipe tiverem o recurso ativado) ou chave própria em variável secreta com escopo Functions. `OPENAI_BASE_URL` é consumida pelo SDK. `OPENAI_MODEL` pode selecionar um modelo disponível; quando omitida, a função consulta a lista do provedor e procura um modelo GPT menor. O agente devolve erro claro quando não está configurado.

`DEVSPACE_OWNER_ID` pode substituir `277391915`, proprietário atual. O agente verifica esse ID consultando `/user` no GitHub a cada chamada. Reimplante após alterar variáveis.

Não coloque credenciais em `netlify.toml`, código frontend, arquivos ou mensagens no chat. A assinatura ChatGPT não é uma chave API nem fornece créditos API ao aplicativo.

## Referências do projeto

- Figma: https://www.figma.com/design/llr5Aobl38rGB1reW3lrV6?node-id=3-2
- Planejamento: https://app.notion.com/p/4173a750298c8126b687ec1f958fc655
