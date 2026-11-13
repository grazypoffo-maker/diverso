# Grazy Poffo Doceria
Site estático em português no GitHub Pages. Cinco páginas: início, doces, coleções, história e encomendas. Sem build.

## Fontes de conteúdo
- Cardápio: https://instadelivery.com.br/grazipoffodoceria
- Logo e registros da família e de coleções: uploads do Canva da proprietária, utilizados com sua autorização.
- Fotos do catálogo: cardápio público da doceria; foto do copo: upload da proprietária.
- Telefone conferido no cardápio: +55 47 99941-1138.

Não há sincronização automática de estoque ou preços. O site encaminha ao cardápio oficial para os valores e a compra. As fotos sazonais não representam disponibilidade atual. Algumas fotos do Canva foram fornecidas pela integração apenas em miniatura.

Efeito glass com desfoque e fallback opaco, redução de movimento, links reais e descrições acessíveis. Links antigos do Diverso redirecionam às novas páginas.

## Atualização da apresentação
Página inicial canônica: `inicio.html`, com cópia em `index.html`. Links versionados para evitar a página anterior no cache. Apresentação de três momentos guiados pela rolagem, com opção de pular e versão estática para redução de movimento. Logo de 500px obtida do cardápio oficial. Miniaturas do Canva mantidas no tamanho fornecido, sem ampliação artificial.

## Natal 2026
Tema rosa/marrom/dourado com árvore, rena e gorro em SVG. O menu sazonal está em `natal.html`; o catálogo diário ficou no menu Mais. Produtos e descrições identificáveis dos menus Canva DAHautP2Piw e DAHauk-FEPc. Sem preços, datas ou campos de template não confirmados. MP4 local com controles, playsinline, preload=none, poster e legendas WebVTT logo depois do scroll. Sem autoplay nem dependência do Google Drive para reproduzir.

## Refinamentos aprovados — campanha v2
Abertura compacta (sem narrativa longa), menu móvel em uma linha com áreas de toque de 44px+, WhatsApp direto no cabeçalho, fontes locais WOFF2 (~142 KB), cores de texto com mais contraste, entradas suaves sem capturar a rolagem e respeito a redução de movimento. Botão flutuante oculto no celular e durante a visualização do vídeo, evitando cobrir conteúdo. Política CSP restringe scripts, mídias, fontes e imagens à própria origem; páginas não processam pagamentos. `python scripts/version-assets.py` gera versões de CSS e JS por hash de conteúdo antes da publicação.

Vídeo de campanha `assets/video/natal-campanha-v2.mp4`: 27,7s, 1080×1920/60fps, nova voz sintética de narração e segunda voz nas respostas, transições de 400ms, efeitos de passagem e legendas sincronizadas. Sem fotos. A resolução original de parte das fotos dos produtos continua limitada aos arquivos disponibilizados pelo Canva; não houve reconstrução artificial dos doces.
