# ✏️ Editing Guide — your audit, your words

This audit is designed to **evolve**. As EFGH's capabilities grow and you learn
what resonates, you'll want to tweak the wording, add capabilities, and refine
how the matching works. Almost everything you'll ever change lives in **one
file**:

```
assets/js/content.js
```

You don't need to be a developer. This guide walks you through the common edits.

---

## The golden rules

1. **Only change the text inside "double quotes".** Keep the quotes.
   - ✅ `"title": "See how EFGH can help"`  →  `"title": "Discover EFGH for you"`
   - ❌ Don't rename the word before the colon (`title`).
2. **Keep the commas.** Each line and each `{ ... }` block usually ends in a `,`.
3. **Edit one thing, save, refresh** the page to see the change.
4. If something breaks (a blank page), you probably removed a quote, comma, or
   bracket — undo your last change.

> 💡 Tip: edit in a code editor like [VS Code](https://code.visualstudio.com/).
> It highlights mistakes (a missing comma turns red) before you even save.

---

## 1. Send leads to your inbox

Find this near the top, in `settings`:

```js
leadEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
```

Replace it with your real [Formspree](https://formspree.io) endpoint. Done.

---

## 2. Change the headline & intro

In the `hero` section:

```js
hero: {
  eyebrow: "Free Capability Audit",
  title: "See how EFGH can grow your business",
  subtitle: "Paste your website and answer two quick questions…",
  ...
}
```

Just rewrite the text in quotes.

---

## 3. Add, remove or edit a capability

Capabilities are the heart of the audit. Each one looks like this:

```js
{
  id: "embedded-insurance",          // a unique short id, lowercase-with-dashes
  name: "Embedded Insurance",        // shown as the card title
  icon: "🛡️",                        // any emoji
  tagline: "Turn everyday journeys into protection",
  description: "Embed tailored insurance…",
  benefits: [
    "Add a new, recurring revenue line at checkout",
    "Increase customer trust and lifetime value",
    "Launch fast with EFGH's middleware"
  ],
  keywords: ["insurance", "insure", "protection", "claim", "policy"],
  matchTags: ["embedded", "sells-products", "ecommerce"],
  cta: "Explore embedded insurance"
}
```

- **`keywords`** — lowercase words we look for on the visitor's website. More
  relevant keywords = better matching. Add industry terms your customers use.
- **`matchTags`** — these connect to the answers in the quick questions (see
  next section). If a visitor's answer carries a tag listed here, this
  capability scores higher.

**To add a capability:** copy a whole `{ ... }` block (from `{` to `}`), paste
it just before the closing `]` of the `capabilities` list, add a comma after the
previous block, and edit the values.

**To remove one:** delete its `{ ... }` block (and the trailing comma).

---

## 4. Change the quick questions

In `questions`. Each answer carries `tags` that boost capabilities:

```js
{
  label: "E-commerce / online marketplace",
  tags: ["ecommerce", "marketplace", "sells-products"]
}
```

Make sure the tags you use here also appear in the `matchTags` of the
capabilities you want that answer to favour. Tags are just lowercase labels you
invent — keep them consistent between questions and capabilities.

---

## 5. Tune the methodology text

The `methodology` section is the "How we score your fit" explainer shown lower
on the page. Edit the `title`, `intro`, the four `steps`, and the `disclaimer`.

---

## 6. Make matching stricter or more generous

In `scoring`:

```js
scoring: {
  strongFitThreshold: 60,    // score needed to show "Strong fit"
  potentialFitThreshold: 30, // score needed to show "Worth exploring"
  weights: {
    keywordMatch: 12,        // points per keyword found on the site
    keywordMatchCap: 60,     // most that keywords alone can score
    tagMatch: 16,            // points per matching answer tag
    baseFloor: 8             // small starting score for everything
  }
}
```

- Want more "Strong fit" badges? **Lower** `strongFitThreshold`.
- Want keywords to matter more? **Raise** `keywordMatch`.

---

## 7. Edit the lead form & request types

In `leadForm`. Change field labels, the success message, and the dropdown
options:

```js
requestTypes: [
  "General enquiry",
  "Embedded insurance",
  "Payments & wallets",
  ...
]
```

The message box's 0/1000 counter is controlled by:

```js
message: { ..., maxLength: 1000 }
```

---

## When in doubt

- Changed something and the page went blank? Undo your last edit and refresh.
- Need a new section or design change (not just text)? That's in `index.html` /
  `styles.css` — ask a developer, or open an issue.

That's it — happy editing. 🎉
