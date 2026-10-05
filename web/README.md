# ihiring.ai redesign (Next.js 16 + Tailwind v4)

    npm install
    npm run dev      # http://localhost:3000
    npm run build && npm start

Content lives in `content/site.config.json` (scraped from the original site) and `lib/site.ts`.

## To fill in before launch
- `lib/site.ts` -> `customers[]`: real, permissioned customer logos (strip shows placeholders until then)
- `NEXT_PUBLIC_LOGIN_URL`: app login URL
- `DEMO_WEBHOOK_URL`: where demo requests are delivered (otherwise they are only logged)
- `NEXT_PUBLIC_SITE_URL`: production domain
