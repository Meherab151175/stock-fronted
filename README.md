# Stock Market Dashboard (Frontend)

A modern stock market dashboard built with **TypeScript**, **React**, **Vite**, and **TanStack Query**.  
Live: [https://stock-fronted.vercel.app/](https://stock-fronted.vercel.app/)

## Features

- ⚡ Fast Vite + React + TypeScript setup
- 🎨 Dark & Light theme support (with system preference)
- 📊 Interactive charts and tables
- 🔍 Search, filter, and pagination
- 🔄 Real-time data fetching with [TanStack Query](https://tanstack.com/query/latest)
- 🧑‍💻 Clean, modular code structure
- 🦾 Type-safe API integration

## Demo

- **Frontend:** [https://stock-fronted.vercel.app/](https://stock-fronted.vercel.app/)
- **Frontend Repo:** [https://github.com/Meherab151175/stock-fronted.git](https://github.com/Meherab151175/stock-fronted.git)
- **Backend SQL API:** [https://stock-backend-07c7.onrender.com](https://stock-backend-07c7.onrender.com)
- **Backend JSON API:** [https://stock-backend-1-b49x.onrender.com](https://stock-backend-1-b49x.onrender.com)

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/Meherab151175/stock-fronted.git
cd stock-fronted
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Edit the `.env` file if needed:

```
VITE_API_URL_SQL=https://stock-backend-07c7.onrender.com
VITE_API_URL_JSON=https://stock-backend-1-b49x.onrender.com
```

### 4. Run the development server

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build
- `npm run lint` — Lint the codebase

## Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Sonner](https://sonner.emilkowal.ski/) (toast notifications)
- [Radix UI](https://www.radix-ui.com/) (primitives)

## API Endpoints

- **SQL API:** `${VITE_API_URL_SQL}`
- **JSON API:** `${VITE_API_URL_JSON}`

Set the desired API in `.env` and restart the dev server.

## Project Structure

```
.
├── src/
│   ├── components/      # UI components
│   ├── lib/             # Utilities and hooks
│   ├── pages/           # Page components
│   ├── services/        # API service modules
│   └── assets/          # Static assets
├── public/
├── index.html
├── package.json
├── vite.config.ts
└── ...
```

## License

MIT

---

> Built with ❤️ by [Meherab151175](https://github.com/Meherab151175)
