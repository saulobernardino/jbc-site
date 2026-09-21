# Site institucional da JBC Contabilidade

Site estático em HTML, CSS e JavaScript — sem build, sem dependências.
Publicação: subir o conteúdo desta pasta para a raiz de `jbccontabil.com.br`.

## Estrutura

```
index.html  sobre.html  servicos.html  links.html  faq.html  contato.html

css/
  base.css         Reset, design tokens e acessibilidade
  layout.css       Navegação, rodapé, container, seções
  components.css   Botões, hero, CTA, acordeão, animações
  pages/           Estilos específicos de cada página

js/
  main.js          Menu mobile + animações de entrada (todas as páginas)
  accordion.js     Acordeão do FAQ e da página de Links úteis
  contato.js       Botão de copiar e-mail

images/            Fotos e fundos (cada .jpg/.png tem um .webp ao lado)
design/            Design Playbook 2026 — a referência de marca
```

A pasta `estrategia/` existe localmente mas fica fora do repositório
(ver `.gitignore`): é material interno e o site é público.

## Ao mexer em CSS ou JavaScript

Os arquivos são carregados com `?v=N` no final. **Suba esse número em todas as
páginas** ao alterar qualquer arquivo de `css/` ou `js/` — sem isso, quem já
visitou o site continua recebendo os arquivos antigos do cache do navegador.

```bash
grep -rl '?v=' *.html | xargs sed -i '' 's/?v=3/?v=4/g'
```

## Pré-visualizar antes de publicar

```bash
node .server.js
```

Abre em http://localhost:4173.

## Imagens

Cada foto tem uma versão `.webp` servida via `<picture>`, com o `.jpg`/`.png`
como reserva. Ao trocar uma imagem, gere as duas versões e mantenha os
atributos `width` e `height` no HTML — eles evitam que o layout "pule"
enquanto a página carrega.

## Ícones do navegador

Gerados a partir de `favicon.svg`. Para regerar depois de mudar o SVG, use
`generate-favicons.sh` (precisa de ImageMagick ou rsvg-convert instalado).
