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

## Banner de montagem
A abertura não contém mais a história/foto de família. `cake-scroll` apresenta uma montagem ilustrada em SVG controlada por rolagem passiva e interpolação via requestAnimationFrame. Cinco etapas: chocotone, abertura, recheio, cobertura e decoração. Botões permitem pular diretamente entre etapas, e o vídeo continua logo em seguida. Sem imagens geradas nem demonstração de receita real. Em redução de movimento ou tela muito baixa, a ilustração é estática e as etapas podem ser selecionadas. Navegação, cards e controles receberam ajustes adicionais de toque e breakpoints móveis.
