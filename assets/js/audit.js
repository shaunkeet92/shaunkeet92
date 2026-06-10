/* =============================================================================
   EFGH CAPABILITY AUDIT — AUDIT ENGINE
   -----------------------------------------------------------------------------
   This is the "brain". It reads the visitor's website, combines it with their
   answers, and scores each EFGH capability defined in content.js.

   You normally won't edit this file. To change WHAT is matched or the scoring,
   edit the "capabilities" and "scoring" sections of content.js instead.
   ============================================================================= */

(function () {
  "use strict";

  const CFG = window.EFGH_AUDIT;

  /* --- Normalise a user-typed URL into something fetchable ----------------- */
  function normaliseUrl(raw) {
    let url = (raw || "").trim();
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    try {
      const u = new URL(url);
      // Must have a dot in the host (basic sanity check), e.g. example.com
      if (!/\.[a-z]{2,}$/i.test(u.hostname)) return null;
      return u.href;
    } catch (e) {
      return null;
    }
  }

  /* --- Fetch the website's text via the CORS proxies (best effort) --------- */
  async function fetchSiteText(url) {
    const proxies = CFG.settings.corsProxies || [];
    const timeoutMs = (CFG.settings.fetchTimeoutSeconds || 12) * 1000;

    for (const proxy of proxies) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(proxy + encodeURIComponent(url), { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) continue;
        const html = await res.text();
        if (html && html.length > 200) return extractText(html);
      } catch (e) {
        /* try the next proxy */
      }
    }
    return null; // couldn't read the site — analysis falls back to answers only
  }

  /* --- Turn raw HTML into clean, lowercase, searchable text ---------------- */
  function extractText(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    // Pull the highest-signal text: title, meta description, headings, body.
    const parts = [];
    if (doc.title) parts.push(doc.title);
    const metaDesc = doc.querySelector('meta[name="description"]');
    if (metaDesc) parts.push(metaDesc.getAttribute("content") || "");
    const metaKeys = doc.querySelector('meta[name="keywords"]');
    if (metaKeys) parts.push(metaKeys.getAttribute("content") || "");
    doc.querySelectorAll("script, style, noscript").forEach((n) => n.remove());
    const body = doc.body ? doc.body.innerText || doc.body.textContent || "" : "";
    parts.push(body);
    return parts.join(" ").toLowerCase().replace(/\s+/g, " ");
  }

  /* --- Collect all tags from the visitor's answers ------------------------- */
  function collectAnswerTags(answers) {
    const tags = new Set();
    CFG.questions.forEach((q) => {
      const chosenLabel = answers[q.id];
      if (!chosenLabel) return;
      const opt = q.options.find((o) => o.label === chosenLabel);
      if (opt && opt.tags) opt.tags.forEach((t) => tags.add(t));
    });
    return tags;
  }

  /* --- Score one capability ------------------------------------------------ */
  function scoreCapability(cap, siteText, answerTags) {
    const w = CFG.scoring.weights;

    // 1. Keyword signal from the website text.
    let keywordHits = 0;
    const matchedKeywords = [];
    if (siteText) {
      (cap.keywords || []).forEach((kw) => {
        if (siteText.indexOf(kw.toLowerCase()) !== -1) {
          keywordHits++;
          matchedKeywords.push(kw);
        }
      });
    }
    const keywordScore = Math.min(keywordHits * w.keywordMatch, w.keywordMatchCap);

    // 2. Tag overlap from the visitor's answers.
    let tagHits = 0;
    (cap.matchTags || []).forEach((t) => { if (answerTags.has(t)) tagHits++; });
    const tagScore = tagHits * w.tagMatch;

    // 3. Combine, add a small base, clamp to 0–100.
    let score = w.baseFloor + keywordScore + tagScore;
    score = Math.max(0, Math.min(100, Math.round(score)));

    return { keywordHits, tagHits, matchedKeywords, score };
  }

  /* --- Classify a score into a fit label ----------------------------------- */
  function classify(score) {
    const s = CFG.scoring;
    if (score >= s.strongFitThreshold) return "strong";
    if (score >= s.potentialFitThreshold) return "potential";
    return "low";
  }

  /* --- Run the full audit -------------------------------------------------- */
  async function run(rawUrl, answers) {
    const url = normaliseUrl(rawUrl);
    const siteText = await fetchSiteText(url);
    const answerTags = collectAnswerTags(answers);

    const scored = CFG.capabilities.map((cap) => {
      const detail = scoreCapability(cap, siteText, answerTags);
      return Object.assign({}, cap, detail, { fit: classify(detail.score) });
    });

    // Sort strongest first.
    scored.sort((a, b) => b.score - a.score);

    return {
      url: url,
      siteRead: !!siteText,         // did we manage to read the website?
      capabilities: scored
    };
  }

  // Expose the engine.
  window.EFGHAuditEngine = { run: run, normaliseUrl: normaliseUrl };
})();
