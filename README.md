# <div align="center">Pizzaria Delicia da Bahia</div>

<div align="center"><img src="https://i.ibb.co/93rsyR7/home.png" alt="home" border="0"></div>

<div align="center">
    <a href="https://www.pizzariadeliciadabahia.com/">
        <img src="https://img.shields.io/badge/preview-vercel-a.svg?style=for-the-badge">
    </a>
    <a href="https://github.com/anthonyvictor/backend-site-pdb">
        <img src="https://img.shields.io/badge/backend-github-blue.svg?style=for-the-badge">
    </a>
    <a href="https://www.figma.com/file/NvP58fWAUspNTvx5mLnoPC/Site---Pizzaria-Delicia-da-Bahia?node-id=11%3A25&t=88RvIRhdUBlI4v9O-1">
        <img src="https://img.shields.io/badge/prototype-figma-red.svg?style=for-the-badge">
    </a>
</div>
<div align="center">
     <a>
        <img src="https://img.shields.io/github/package-json/license/anthonyvictor/pizzariadeliciadabahia">
    </a>
     <a>
        <img src="https://img.shields.io/github/package-json/v/anthonyvictor/pizzariadeliciadabahia">
    </a>
    <a>
        <img src="https://img.shields.io/badge/node-22-yellow.svg">
    </a>
    <a>
        <img src="https://img.shields.io/badge/next-12.1.6-yellow.svg">
    </a>
    <a href="https://github.com/anthonyvictor/pizzariadeliciadabahia">
        <img src="https://img.shields.io/badge/status-active-success.svg">
    </a>
    <a href="https://github.com/anthonyvictor/pizzariadeliciadabahia/issues">
        <img src="https://img.shields.io/github/issues/anthonyvictor/pizzariadeliciadabahia">
    </a>
    <a href="https://github.com/anthonyvictor/pizzariadeliciadabahia/pulls">
        <img src="https://img.shields.io/github/issues-pr/anthonyvictor/pizzariadeliciadabahia">
    </a>
</div>

### Introduction
Pizzaria Delicia da Bahia's website developed with `Next.js`

### Getting Started
1 - Clone the project, and install the dependencies.
```bash
git clone https://github.com/anthonyvictor/frontend-website-pdb.git
npm install || yarn 
```
2 - Rename the `.env.example` file to `.env`.
3 - Add variables to `.env` file:

```
# This variable set the backend url 
NEXT_PUBLIC_API_URL="http:localhost:5000"

# This variable set the whatsapp number 
NEXT_PUBLIC_WHATSAPP="+5510987654321"

```
3 - Run the following command
```bash
cd frontend
npm run dev || yarn dev
```
### Routes

`Static`
```
├─/home
|─/cardapio (With revalidation)
├─/localizacao
└─/sobre
```

`Single Page`
```
├─/pedido
| ├───/lanche
| ├───/pizza
| |   ├───/tamanho
| |   └───/sabores
| ├───/bebida
| ├───/itens
| ├───/informacoes-adicionais
| ├───/pagamento
| └───/confirmacao
└─────────────────
```
### Tags
`next.js` `styled-components` `react.js` `uuid`