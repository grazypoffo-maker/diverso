# DevSpace — Paper Studio

Protótipo React/Vite de organização de projetos, tarefas e links de repositórios. Visual escolhido: proposta 2 do Product Design.

- Figma: https://www.figma.com/design/llr5Aobl38rGB1reW3lrV6?node-id=3-2
- Planejamento: https://app.notion.com/p/4173a750298c8126b687ec1f958fc655

## Executar

```sh
npm install
npm run dev
```

Compilar: `npm run build`. Saída estática: `dist/client`. Testes de empacotamento: `npm run test:sites`.

## Recursos

Cadastro, edição e remoção de projetos; status e próxima tarefa; abas Projetos, Tarefas e Links; conclusão de tarefas; links GitHub; layout responsivo. Ícones Phosphor.

## Limites e validação

Dados de demonstração apenas em memória; recarregar restaura os exemplos. Sem autenticação, banco ou sincronização automática. Nomes de projetos são fictícios; dois links de exemplo usam repositórios reais da conta.

Build passou. Quatro testes de empacotamento passaram. QA visual e testes de interação bloqueados porque a prévia do ambiente retorna erro de conexão upstream. Não é uma entrega validada para produção. Consulte design-qa.md.
