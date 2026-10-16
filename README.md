# Description

This repo is a generalized/template version of an ecommerce site I have been building. It has a placeholder REST API and backend with some typical endpoints you might find on this kind of site. 

<img width="1920" height="1080" alt="site" src="https://github.com/user-attachments/assets/bff24d69-fec7-41bd-9d8f-fb8260a49c60" />
*<sub>A short demonstration of part of site (may take some time to load).</sub>*

## Getting started

```
cd faithful-mass
npm install
cp .env.example .env   # then fill in the values
npm run dev
```

The dev server runs at `http://localhost:4321`.

## Placeholder REST API

Mock endpoints live under `faithful-mass/src/pages/api/v1/` and serve fake data from `src/lib/mock-data.ts`. Types shared with the pages are in `src/lib/api-types.ts`.

| Method | Path                      | Description                              |
| :----- | :------------------------ | :--------------------------------------- |
| GET    | `/api/v1/health`          | Liveness check                           |
| GET    | `/api/v1/products`        | List products                            |
| GET    | `/api/v1/products/:slug`  | One product, or a 404 error              |
| POST   | `/api/v1/orders`          | Validate and echo back a fake order (nothing is stored) |

Success bodies are `{ "data": ... }`; errors are `{ "error": { "code", "message" } }`. The `/products` and `/products/:slug` pages fetch from these endpoints in the browser. Replace `mock-data.ts` (or the imports in the route handlers) with a real data source when the backend is ready.

## Customizing the template

* Replace the placeholder name, logo (`src/assets/Logo.svg`), and images (`src/assets/Product_*.png`).
* Edit page copy in `src/pages/`. The product page is `src/pages/product.astro`.
* Update the footer links and copyright notice in `src/components/Footer.astro`.
* Set the sender address in `src/pages/api/contact.ts` and the environment variables listed in `.env.example`.
