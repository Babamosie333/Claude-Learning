# Claude Learning — one-shot Vercel deployment

# Vikram Singh
This project deploys as **one single Vercel project** — static frontend pages
plus the `/api` serverless functions together, no separate backend hosting needed.

## Preview:
<a href=img src="/assets/splash.jpg" >Claude Learning</a>

## Whatsapp Channel Links:
<a href="https://whatsapp.com/channel/0029Vb8shLnGU3BLZe88jH2s"> Claude-Learning</a>

<a href="https://whatsapp.com/channel/0029Vb7niwn3QxS34O0zOw1Y"> Claude-Learning</a>

## What I could and couldn't verify
I built and syntax-checked every file, but I could not actually deploy this or run it
against real Clerk/MongoDB/Groq accounts — this environment can't reach those live
services. Please test the steps at the bottom after deploying.

## 1. Push this folder to a GitHub repo
```
git init
git add .
git commit -m "Claude Learning site"
git remote add origin https://github.com/Babamosie333/<your-repo>.git
git push -u origin main
```

## 2. Import into Vercel
- Go to vercel.com → New Project → import that GitHub repo.
- Vercel auto-detects `/api/*.js` files as serverless functions and serves the
  root HTML/JS/asset files as static content. No build command needed.

## 3. Set environment variables
In Vercel → Project → Settings → Environment Variables, add (see `.env.example`):
- `MONGODB_URI` — your MongoDB Atlas connection string
- `CLERK_SECRET_KEY` — from your Clerk dashboard
- `GROQ_API_KEY` — from console.groq.com

## 4. Set your Clerk publishable key in the frontend
In **both** `index.html` and `test.html`, find:
```html
data-clerk-publishable-key="YOUR_CLERK_PUBLISHABLE_KEY"
```
and replace it with your real Clerk publishable key (safe to expose — it's public by design).

## 5. Deploy
Click Deploy in Vercel, or just push to `main` if auto-deploy is on.
Your whole site — pages + API — will be live at one `*.vercel.app` URL (or your
custom domain), with no separate frontend/backend deployment step.

## File map
- `index.html`, `test.html`, `result.html`, `certificate.html`, `verify.html` — the site
- `questions.js` — the 75-question bank
- `baba-ai.js` — the chat widget (face that tracks your mouse), calls `/api/chat`
- `api/auth/sync.js`, `api/auth/me.js` — Clerk + MongoDB user sync
- `api/certificates/index.js` — save a passed test as a certificate
- `api/certificates/mine.js` — the logged-in user's certificate history
- `api/certificates/verify/[certId].js` — public certificate lookup (used by verify.html and QR codes)
- `api/chat/index.js` — Groq-powered Baba AI replies
- `lib/db.js` — cached MongoDB connection (serverless-safe)
- `lib/models/User.js`, `lib/models/Certificate.js` — Mongoose schemas

## Please test after deploying (I was not able to)
1. Visit the live URL, sign in via Clerk, confirm the personalized home view appears
   with your name/email and a MongoDB `User` document is created.
2. Take the test while signed in, pass it, confirm a `Certificate` document is created
   and shows up on your home page.
3. Copy that certificate's ID (or scan its QR) and check `verify.html` shows it as valid.
4. Open Baba AI (bottom-left face), send a message, confirm it replies using Groq.
5. Fail the test on purpose (score under 45/75) and confirm no certificate is created.
