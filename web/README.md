# ihiring.ai redesign (Next.js 16 + Tailwind v4)

    npm install
    npm run dev      # http://localhost:3000
    npm run build && npm start

Content lives in `content/site.config.json` (scraped from the original site) and `lib/site.ts`.

## To fill in before launch
- `lib/site.ts` -> `customers[]`: real, permissioned customer logos (strip shows placeholders until then)
- `NEXT_PUBLIC_LOGIN_URL`: app login URL
- `RESEND_API_KEY`: required. Demo requests are emailed to aaniketh@cloudbers.com through Resend. Without it the form shows a retry/email fallback instead of claiming the request was received. Optional: `DEMO_MAIL_TO` (recipient) and `DEMO_MAIL_FROM` (sender, needs a domain verified in Resend).
- `NEXT_PUBLIC_SITE_URL`: production domain
