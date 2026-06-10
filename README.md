# EFGH Capability Audit

A free, embeddable **website-audit lead magnet** for [EFGH](https://efgh.xyz).
A visitor pastes their website link, answers two or three quick questions, and
instantly sees which EFGH capabilities — embedded insurance, payments & wallets,
SME financing, lead generation, AI & risk, inclusive finance — best fit their
business. After the results appear, a pop-up invites them to submit a lead.

Built as a **zero-build static site** (plain HTML, CSS and JavaScript) so it can
be hosted anywhere — GitHub Pages, Netlify, Vercel, an S3 bucket, or dropped
into an existing site.

---

## ✏️ The one file you'll edit: `assets/js/content.js`

Everything a visitor reads — copy, capabilities, the matching keywords, the
methodology, the scoring, and the lead form — lives in **`assets/js/content.js`**.
It is heavily commented and written for non-developers. See
[`EDITING-GUIDE.md`](EDITING-GUIDE.md) for a friendly walkthrough.

You should rarely need to touch the other files.

| File | What it is | Edit it? |
|------|------------|----------|
| `assets/js/content.js` | **All text, capabilities, methodology, scoring, form** | ✅ Yes — this is your platform |
| `index.html` | Page structure | Rarely |
| `assets/css/styles.css` | EFGH design system (colours, type, spacing) | Rarely |
| `assets/js/audit.js` | The scoring engine | No |
| `assets/js/app.js` | UI wiring | No |

---

## 🚀 Getting leads into your inbox (2 minutes)

1. Create a free form at **[formspree.io](https://formspree.io)** (or Getform).
2. Copy your form endpoint (looks like `https://formspree.io/f/abcдwxyz`).
3. Open `assets/js/content.js`, find `leadEndpoint`, and paste it in:

   ```js
   leadEndpoint: "https://formspree.io/f/your-real-id",
   ```

Until you do this, the tool runs in **demo mode** — the form still works and
saves submissions in the browser, but no email is sent. A small yellow banner
reminds you while in demo mode.

---

## ▶️ Running / previewing locally

It's a static site, so any static server works:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

## 🌐 Deploying

- **GitHub Pages:** push to your repo, then enable Pages on the branch root.
- **Netlify / Vercel:** drag-and-drop the folder, or connect the repo. No build
  command needed; publish directory is the project root.

---

## How it works

1. **Reads the site** — fetches the visitor's homepage (via a public CORS proxy)
   and scans its text for signals.
2. **Reads the answers** — the quick questions tag the business type, customers
   and priorities.
3. **Matches & scores** — each capability in `content.js` has keywords and
   business tags; the engine scores fit 0–100 and ranks them.
4. **Captures the lead** — a pop-up collects name, work email, contact number,
   request type and a message (with a live 0/1000 counter) and posts it to your
   form endpoint.

Scoring thresholds and weights are all tunable in the `scoring` section of
`content.js`.
