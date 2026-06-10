/* =============================================================================
   EFGH CAPABILITY AUDIT — APP / UI
   -----------------------------------------------------------------------------
   Wires the content from content.js into the page, runs the flow, and handles
   the lead pop-up. You normally won't edit this file — all wording lives in
   content.js.
   ============================================================================= */

(function () {
  "use strict";

  const CFG = window.EFGH_AUDIT;
  const $ = (id) => document.getElementById(id);
  const answers = {}; // visitor's chosen answers, keyed by question id

  /* =========================================================================
     INITIAL RENDER — paint all text from content.js into the page.
     ========================================================================= */
  function render() {
    // Brand + nav
    $("brandMark").textContent = CFG.settings.companyName;
    document.title = "Free Capability Audit | " + CFG.settings.companyName;
    $("navCta").href = CFG.settings.companyUrl;

    // Hero
    $("heroEyebrow").textContent = CFG.hero.eyebrow;
    $("heroTitle").textContent = CFG.hero.title;
    $("heroSubtitle").textContent = CFG.hero.subtitle;
    $("urlLabel").textContent = CFG.hero.urlLabel;
    $("urlInput").placeholder = CFG.hero.urlPlaceholder;
    $("submitBtn").textContent = CFG.hero.submitButton;
    $("heroDisclaimer").textContent = CFG.hero.disclaimer;

    renderQuestions();
    renderMethodology();
    renderModalText();
    renderFooter();
    checkDemoMode();
  }

  function renderQuestions() {
    const wrap = $("questionsBlock");
    wrap.innerHTML = "";
    // No questions configured? Hide the whole block (and its divider).
    if (!CFG.questions || CFG.questions.length === 0) {
      wrap.classList.add("hidden");
      return;
    }
    wrap.classList.remove("hidden");
    CFG.questions.forEach((q) => {
      const block = document.createElement("div");
      block.className = "q-block";
      const label = document.createElement("label");
      label.className = "field-label";
      label.textContent = q.label;
      block.appendChild(label);
      if (q.helper) {
        const helper = document.createElement("div");
        helper.className = "field-helper";
        helper.textContent = q.helper;
        block.appendChild(helper);
      }
      const opts = document.createElement("div");
      opts.className = "q-options";
      q.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "q-option";
        btn.textContent = opt.label;
        btn.addEventListener("click", () => {
          answers[q.id] = opt.label;
          opts.querySelectorAll(".q-option").forEach((b) => b.classList.remove("selected"));
          btn.classList.add("selected");
        });
        opts.appendChild(btn);
      });
      block.appendChild(opts);
      wrap.appendChild(block);
    });
  }

  function renderMethodology() {
    $("methodTitle").textContent = CFG.methodology.title;
    $("methodIntro").textContent = CFG.methodology.intro;
    $("methodDisclaimer").textContent = CFG.methodology.disclaimer;
    const grid = $("methodGrid");
    grid.innerHTML = "";
    CFG.methodology.steps.forEach((step, i) => {
      const el = document.createElement("div");
      el.className = "method-step";
      el.innerHTML =
        '<div class="method-num">' + (i + 1) + "</div>" +
        "<h3></h3><p></p>";
      el.querySelector("h3").textContent = step.title;
      el.querySelector("p").textContent = step.body;
      grid.appendChild(el);
    });
  }

  function renderFooter() {
    $("footerNote").textContent = CFG.footer.note;
    $("footerCopy").textContent = CFG.footer.copyright;
    const links = $("footerLinks");
    links.innerHTML = "";
    CFG.footer.links.forEach((l) => {
      const a = document.createElement("a");
      a.href = l.url; a.textContent = l.label; a.target = "_blank"; a.rel = "noopener";
      links.appendChild(a);
    });
  }

  /* =========================================================================
     DEMO MODE — warn (subtly) if the Formspree endpoint hasn't been set.
     ========================================================================= */
  function isDemoMode() {
    const ep = CFG.settings.leadEndpoint || "";
    return !ep || ep.indexOf("YOUR_FORM_ID") !== -1 || !/^https?:\/\//.test(ep);
  }
  function checkDemoMode() {
    if (isDemoMode()) $("demoBanner").classList.remove("hidden");
  }

  /* =========================================================================
     FLOW: submit → loading → results
     ========================================================================= */
  function setupAuditForm() {
    $("auditForm").addEventListener("submit", function (e) {
      e.preventDefault();
      const url = $("urlInput").value;
      if (!window.EFGHAuditEngine.normaliseUrl(url)) {
        $("urlInput").classList.add("error");
        $("urlError").classList.add("show");
        return;
      }
      $("urlInput").classList.remove("error");
      $("urlError").classList.remove("show");
      startAnalysis(url);
    });
    $("urlInput").addEventListener("input", function () {
      $("urlInput").classList.remove("error");
      $("urlError").classList.remove("show");
    });
  }

  async function startAnalysis(url) {
    $("heroSection").classList.add("hidden");
    $("resultsSection").classList.add("hidden");
    $("loaderSection").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Animate the loader steps for a sense of progress.
    const steps = [
      "Reading your website…",
      "Matching EFGH capabilities…",
      "Scoring your fit…"
    ];
    renderLoaderSteps(steps);
    const stepTimers = animateSteps(steps.length);

    // Run the actual audit (kick it off in parallel with the animation).
    let result;
    try {
      result = await window.EFGHAuditEngine.run(url, answers);
    } catch (e) {
      result = { url: url, siteRead: false, capabilities: [] };
    }

    // Ensure the loader is visible for at least a moment for credibility.
    await delay(Math.max(0, 2600 - (Date.now() - stepTimers.start)));
    stepTimers.finish();

    showResults(result);
  }

  function renderLoaderSteps(steps) {
    const ul = $("loaderSteps");
    ul.innerHTML = "";
    steps.forEach((s) => {
      const li = document.createElement("li");
      li.innerHTML = '<span class="dot"></span><span></span>';
      li.querySelector("span:last-child").textContent = s;
      ul.appendChild(li);
    });
  }

  function animateSteps(count) {
    const items = $("loaderSteps").querySelectorAll("li");
    const start = Date.now();
    let i = 0;
    const tick = () => {
      if (i > 0 && items[i - 1]) { items[i - 1].classList.remove("active"); items[i - 1].classList.add("done"); }
      if (items[i]) items[i].classList.add("active");
      i++;
    };
    tick();
    const interval = setInterval(() => { if (i < count) tick(); else clearInterval(interval); }, 650);
    return {
      start: start,
      finish: () => { clearInterval(interval); items.forEach((it) => { it.classList.remove("active"); it.classList.add("done"); }); }
    };
  }

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  /* =========================================================================
     RESULTS
     ========================================================================= */
  function showResults(result) {
    $("loaderSection").classList.add("hidden");
    $("resultsSection").classList.remove("hidden");

    // Heading (use the site's host if we read it, else the fallback).
    let heading = CFG.results.headingFallback;
    try {
      const host = new URL(result.url).hostname.replace(/^www\./, "");
      heading = CFG.results.headingPrefix + " " + host;
    } catch (e) { /* keep fallback */ }
    $("resultsHeading").textContent = heading;
    $("resultsSubtitle").textContent = CFG.results.subtitle;

    // "Couldn't read site" note.
    const note = $("resultsNote");
    if (!result.siteRead) {
      note.textContent = CFG.results.couldNotReadSiteNote;
      note.classList.remove("hidden");
    } else {
      note.classList.add("hidden");
    }

    // Buttons.
    $("talkBtn").textContent = CFG.results.primaryCta;
    $("restartBtn").textContent = CFG.results.secondaryCta;

    renderCapabilityCards(result.capabilities);

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Auto-open the lead pop-up once after a short delay.
    const d = CFG.settings.leadPopupDelaySeconds;
    if (d && d > 0 && !leadAlreadySubmitted) {
      clearTimeout(autoOpenTimer);
      autoOpenTimer = setTimeout(() => { if (!modalEverOpened) openModal(); }, d * 1000);
    }
  }

  function renderCapabilityCards(caps) {
    const grid = $("capGrid");
    grid.innerHTML = "";
    const labels = CFG.results.labels;
    caps.forEach((cap) => {
      const card = document.createElement("div");
      card.className = "cap-card is-" + cap.fit;

      const badgeClass = cap.fit === "strong" ? "badge-strong" : cap.fit === "potential" ? "badge-potential" : "badge-low";
      const badgeText = cap.fit === "strong" ? labels.strong : cap.fit === "potential" ? labels.potential : labels.low;

      const benefits = (cap.benefits || []).map((b) => "<li></li>").join("");

      card.innerHTML =
        '<div class="cap-top">' +
          '<div>' +
            '<div class="cap-icon">' + (cap.icon || "") + "</div>" +
            '<div class="cap-name"></div>' +
            '<div class="cap-tagline"></div>' +
          "</div>" +
          '<span class="badge ' + badgeClass + '"></span>' +
        "</div>" +
        '<p class="cap-desc"></p>' +
        '<ul class="cap-benefits">' + benefits + "</ul>" +
        '<div class="meter">' +
          '<div class="meter-top"><span>' + CFG.results.matchMeterLabel + '</span><span class="meter-pct"></span></div>' +
          '<div class="meter-bar"><div class="meter-fill"></div></div>' +
        "</div>" +
        '<button class="btn btn-tertiary cap-cta"></button>';

      card.querySelector(".cap-name").textContent = cap.name;
      card.querySelector(".cap-tagline").textContent = cap.tagline || "";
      card.querySelector(".badge").textContent = badgeText;
      card.querySelector(".cap-desc").textContent = cap.description;
      card.querySelector(".meter-pct").textContent = cap.score + "%";
      const benefitEls = card.querySelectorAll(".cap-benefits li");
      (cap.benefits || []).forEach((b, i) => { if (benefitEls[i]) benefitEls[i].textContent = b; });
      const ctaBtn = card.querySelector(".cap-cta");
      ctaBtn.textContent = cap.cta || CFG.results.primaryCta;
      ctaBtn.addEventListener("click", () => openModal(cap));

      grid.appendChild(card);
      // Animate the meter after it's in the DOM.
      requestAnimationFrame(() => {
        setTimeout(() => { card.querySelector(".meter-fill").style.width = cap.score + "%"; }, 100);
      });
    });
  }

  function setupResultsActions() {
    $("talkBtn").addEventListener("click", () => openModal());
    $("restartBtn").addEventListener("click", () => {
      $("resultsSection").classList.add("hidden");
      $("heroSection").classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================================================================
     LEAD MODAL
     ========================================================================= */
  let modalEverOpened = false;
  let leadAlreadySubmitted = false;
  let autoOpenTimer = null;

  function renderModalText() {
    const f = CFG.leadForm;
    $("modalTitle").textContent = f.title;
    $("modalSubtitle").textContent = f.subtitle;
    $("lblName").textContent = f.fields.name.label;
    $("leadName").placeholder = f.fields.name.placeholder;
    $("lblEmail").textContent = f.fields.email.label;
    $("leadEmail").placeholder = f.fields.email.placeholder;
    $("lblPhone").textContent = f.fields.phone.label;
    $("leadPhone").placeholder = f.fields.phone.placeholder;
    $("lblRequest").textContent = f.fields.requestType.label;
    $("lblMessage").textContent = f.fields.message.label;
    $("leadMessage").placeholder = f.fields.message.placeholder;
    $("leadMessage").maxLength = f.fields.message.maxLength;
    $("consentText").textContent = f.consentText;
    $("leadSubmit").textContent = f.submitButton;
    $("successTitle").textContent = f.successTitle;
    $("successBody").textContent = f.successBody;
    $("formErrorBanner").textContent = f.errorMessage;

    // Request-type dropdown.
    const sel = $("leadRequest");
    sel.innerHTML = "";
    f.requestTypes.forEach((t) => {
      const o = document.createElement("option");
      o.value = t; o.textContent = t; sel.appendChild(o);
    });

    // Char counter initial state.
    updateCharCounter();
  }

  function openModal(preselectCap) {
    modalEverOpened = true;
    clearTimeout(autoOpenTimer);
    // If opened from a specific capability card, preselect the closest request type.
    if (preselectCap && preselectCap.name) {
      const sel = $("leadRequest");
      const match = Array.from(sel.options).find((o) =>
        o.value.toLowerCase().indexOf(preselectCap.name.toLowerCase().split(" ")[0]) !== -1);
      // Map capability id to a sensible request type where possible.
      const map = {
        "embedded-insurance": "Embedded insurance",
        "payments-wallets": "Payments & wallets",
        "smesure": "SME platform / financing",
        "lead-distribution": "Lead generation & distribution",
        "ai-risk": "AI & risk management"
      };
      const wanted = map[preselectCap.id];
      const opt = wanted && Array.from(sel.options).find((o) => o.value === wanted);
      if (opt) sel.value = opt.value;
      else if (match) sel.value = match.value;
    }
    $("leadModal").classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => $("leadName").focus(), 150);
  }

  function closeModal() {
    $("leadModal").classList.remove("open");
    document.body.style.overflow = "";
  }

  function setupModal() {
    $("modalClose").addEventListener("click", closeModal);
    $("successClose").addEventListener("click", closeModal);
    $("leadModal").addEventListener("click", (e) => { if (e.target === $("leadModal")) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

    // Character counter.
    $("leadMessage").addEventListener("input", updateCharCounter);

    // Validation.
    setupFieldClear("leadName", "errName");
    setupFieldClear("leadEmail", "errEmail");
    setupFieldClear("leadPhone", "errPhone");
    setupFieldClear("leadMessage", "errMessage");

    $("leadForm").addEventListener("submit", handleLeadSubmit);
  }

  function setupFieldClear(inputId, errId) {
    $(inputId).addEventListener("input", () => {
      $(inputId).classList.remove("error");
      $(errId).classList.remove("show");
    });
  }

  function updateCharCounter() {
    const max = CFG.leadForm.fields.message.maxLength;
    const len = $("leadMessage").value.length;
    const counter = $("charCounter");
    counter.textContent = len + "/" + max;
    counter.classList.toggle("limit", len >= max);
  }

  /* --- Validation + submission to Formspree -------------------------------- */
  function handleLeadSubmit(e) {
    e.preventDefault();
    let ok = true;

    const name = $("leadName").value.trim();
    const email = $("leadEmail").value.trim();
    const phone = $("leadPhone").value.trim();
    const message = $("leadMessage").value.trim();

    if (!name) ok = markError("leadName", "errName") && false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ok = markError("leadEmail", "errEmail") && false;
    if (!phone) ok = markError("leadPhone", "errPhone") && false;
    if (!message) ok = markError("leadMessage", "errMessage") && false;

    if (!ok) return;

    submitLead({
      name: name,
      email: email,
      phone: phone,
      requestType: $("leadRequest").value,
      message: message,
      website: $("urlInput").value.trim(),
      source: "EFGH Capability Audit"
    });
  }

  function markError(inputId, errId) {
    $(inputId).classList.add("error");
    $(errId).classList.add("show");
    return true;
  }

  async function submitLead(data) {
    const btn = $("leadSubmit");
    const banner = $("formErrorBanner");
    banner.classList.remove("show");
    btn.disabled = true;
    btn.textContent = CFG.leadForm.submittingButton;

    try {
      if (isDemoMode()) {
        // No endpoint configured yet — store locally and simulate success.
        const saved = JSON.parse(localStorage.getItem("efgh_demo_leads") || "[]");
        saved.push(Object.assign({ at: new Date().toISOString() }, data));
        localStorage.setItem("efgh_demo_leads", JSON.stringify(saved));
        await delay(600);
      } else {
        const res = await fetch(CFG.settings.leadEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Bad response");
      }
      leadAlreadySubmitted = true;
      showSuccess();
    } catch (err) {
      banner.classList.add("show");
    } finally {
      btn.disabled = false;
      btn.textContent = CFG.leadForm.submitButton;
    }
  }

  function showSuccess() {
    $("modalFormView").classList.add("hidden");
    $("modalSuccessView").classList.remove("hidden");
  }

  /* =========================================================================
     BOOT
     ========================================================================= */
  document.addEventListener("DOMContentLoaded", function () {
    render();
    setupAuditForm();
    setupResultsActions();
    setupModal();
  });
})();
