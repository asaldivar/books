I wanted to take this code challenge as an opportunity to work with some newer technologies so I made a full-stack application that is hosted, [books-psi-two.vercel.app](https://books-psi-two.vercel.app/).

## Getting Started

Define a `.env` file in the root

define a db url environment variable: `DATABASE_URL=<url>``

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## If I had more time I would have:
- Written integration and e2e tests using `jest`, `react-testing-library``, `cypress`` and API tests using `supertest``
- Would have moved my basic API input validation to a middleware that could be reused on the POST and PUT endpoints
- Added rate limiting to the API
- Optimized the FE state management in various ways. Some of it is boo boo but didn't seem necessary to address for the purpose of the code challenge. Added debouncing, finish the UI aspect of pagination, and other things.