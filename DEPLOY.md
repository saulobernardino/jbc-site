# Publicação

O site é servido pelo **GitHub Pages** a partir da branch `main`, no domínio
`jbccontabil.com.br`. O arquivo `CNAME` na raiz é o que amarra o domínio ao
repositório — não apague.

Repositório: https://github.com/saulobernardino/jbc-site

## Publicar uma alteração

```bash
git add -A && git commit -m "descrição da mudança" && git push
```

O Pages reconstrói sozinho em um ou dois minutos.

Ao mexer em `css/` ou `js/`, suba o número da versão nos links das 6 páginas,
senão quem já visitou o site continua recebendo os arquivos antigos do cache:

```bash
grep -rl '?v=' *.html | xargs sed -i '' 's/?v=3/?v=4/g'
```

## DNS na KingHost (feito uma vez)

A KingHost continua com o **registro do domínio e o e-mail**. Só os registros
de endereço do site mudam.

**Não altere os registros MX nem o TXT de SPF** — são eles que mantêm o
`contato@jbccontabil.com.br` funcionando:

```
MX   5   mx-vip-01.kinghost.net
MX   5   mx-vip-02.kinghost.net
TXT      v=spf1 include:_spf.kinghost.net -all
```

### Remover

O registro A do domínio raiz que aponta para a KingHost:

```
A    @     177.12.168.143
```

E o CNAME de `www`, que hoje aponta para `web-ded-208110a.kinghost.net`.

### Adicionar

Quatro registros A no domínio raiz (`@`):

```
A    @     185.199.108.153
A    @     185.199.109.153
A    @     185.199.110.153
A    @     185.199.111.153
```

Opcionalmente, os quatro AAAA equivalentes, para IPv6:

```
AAAA @     2606:50c0:8000::153
AAAA @     2606:50c0:8001::153
AAAA @     2606:50c0:8002::153
AAAA @     2606:50c0:8003::153
```

E um CNAME para `www`:

```
CNAME  www   saulobernardino.github.io
```

### Depois de propagar

A propagação leva de alguns minutos a algumas horas. Para conferir:

```bash
dig +short jbccontabil.com.br A
```

Quando devolver os IPs `185.199.*`, o GitHub emite o certificado de HTTPS
automaticamente (leva mais alguns minutos). Assim que ele existir, ative o
**Enforce HTTPS** em Settings → Pages do repositório, para que quem digitar
`http://` seja redirecionado para `https://`.
