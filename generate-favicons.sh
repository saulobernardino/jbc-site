#!/usr/bin/env bash
set -euo pipefail

# Gera PNGs e favicon.ico a partir de favicon.svg
# Uso: ./generate-favicons.sh

SVG="favicon.svg"
if [ ! -f "$SVG" ]; then
  echo "Arquivo $SVG não encontrado na raiz. Coloque seu favicon.svg na raiz e execute novamente." >&2
  exit 1
fi

# Detectar ferramenta disponível
if command -v magick >/dev/null 2>&1; then
  CONVERT="magick"
elif command -v convert >/dev/null 2>&1; then
  CONVERT="convert"
elif command -v rsvg-convert >/dev/null 2>&1; then
  CONVERT="rsvg-convert"
else
  echo "Nenhuma ferramenta de conversão encontrada (ImageMagick ou rsvg-convert). Instale uma e rode novamente." >&2
  exit 1
fi

echo "Usando: $CONVERT"

# Gerar PNGs
if [ "$CONVERT" = "rsvg-convert" ]; then
  rsvg-convert -w 16 -h 16 -o favicon-16x16.png $SVG
  rsvg-convert -w 32 -h 32 -o favicon-32x32.png $SVG
  rsvg-convert -w 180 -h 180 -o apple-touch-icon.png $SVG
  rsvg-convert -w 192 -h 192 -o icon-192x192.png $SVG
  rsvg-convert -w 512 -h 512 -o icon-512x512.png $SVG
else
  $CONVERT $SVG -background none -resize 16x16 favicon-16x16.png
  $CONVERT $SVG -background none -resize 32x32 favicon-32x32.png
  $CONVERT $SVG -background none -resize 180x180 apple-touch-icon.png
  $CONVERT $SVG -background none -resize 192x192 icon-192x192.png
  $CONVERT $SVG -background none -resize 512x512 icon-512x512.png
fi

# Gerar favicon.ico (múltiplos tamanhos dentro do .ico)
if command -v png-to-ico >/dev/null 2>&1; then
  png-to-ico favicon-16x16.png favicon-32x32.png > favicon.ico
elif command -v magick >/dev/null 2>&1; then
  magick convert favicon-16x16.png favicon-32x32.png favicon.ico
elif command -v convert >/dev/null 2>&1; then
  convert favicon-16x16.png favicon-32x32.png favicon.ico
else
  echo "Aviso: não foi possível gerar favicon.ico automaticamente (png-to-ico/ImageMagick ausente)." >&2
fi

echo "Arquivos gerados: favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, icon-192x192.png, icon-512x512.png, favicon.ico (se disponível)."

exit 0
