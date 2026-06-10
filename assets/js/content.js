/* =============================================================================
   EFGH CAPABILITY AUDIT — CONTENT & CONFIGURATION FILE
   =============================================================================

   👋  THIS IS YOUR EDITING PLATFORM.

   Everything a visitor reads, every capability we match against, the
   methodology, the scoring, the lead form — it all lives in THIS one file.
   You should (almost) never need to touch the other files.

   HOW TO EDIT SAFELY
   ------------------
   • Text always lives between "double quotes". Change the words, keep the quotes.
       "title": "Old text"   ->   "title": "New text"
   • Every item in a list ends with a comma ,  Keep the commas.
   • To add a new item to a list, copy an existing { ... } block, paste it,
     and edit the values. Mind the commas between blocks.
   • Don't rename the words on the LEFT of the colon (the "keys") — only edit
     the values on the RIGHT.
   • When in doubt, edit one thing, save, and refresh the page to check it.

   THE 5 THINGS YOU'LL EDIT MOST
   -----------------------------
   1. SETTINGS  → paste your Formspree link so leads reach your inbox.
   2. CAPABILITIES → add/remove what EFGH offers + the keywords that match it.
   3. QUESTIONS → the quick questions visitors answer before results.
   4. METHODOLOGY → explain how the audit decides what fits.
   5. LEAD FORM → the wording of the pop-up that captures leads.

   ============================================================================= */

const EFGH_AUDIT = {

  /* ===========================================================================
     1. SETTINGS  —  the few technical knobs. Edit the values in quotes.
     =========================================================================== */
  settings: {
    // The company this audit is for.
    companyName: "EFGH",
    companyTagline: "Value Creation through the Finternet",
    companyUrl: "https://efgh.xyz",

    // ⭐ PASTE YOUR FORMSPREE (or Getform) ENDPOINT HERE so leads reach you.
    //    1. Sign up free at https://formspree.io
    //    2. Create a form, copy its endpoint (looks like the example below)
    //    3. Replace the placeholder below with your real endpoint.
    //    Until you do this, the form will run in "demo mode" (no email sent).
    leadEndpoint: "https://formspree.io/f/YOUR_FORM_ID",

    // How the audit reads a visitor's website. These are public CORS proxies
    // that let the browser fetch another site. The tool tries them in order
    // and quietly falls back to the answers-only analysis if all fail.
    corsProxies: [
      "https://api.allorigins.win/raw?url=",
      "https://corsproxy.io/?url="
    ],

    // After results appear, wait this many seconds, then auto-open the lead
    // pop-up once. Set to 0 to disable auto-open (visitors can still click the
    // "Talk to our team" button). Recommended: 6.
    leadPopupDelaySeconds: 6,

    // Time (in seconds) before we give up trying to read a slow website.
    fetchTimeoutSeconds: 12
  },

  /* ===========================================================================
     2. HERO  —  the top of the page where visitors paste their link.
     =========================================================================== */
  hero: {
    eyebrow: "Free Capability Audit",
    title: "See how EFGH can grow your business",
    subtitle: "Just paste your website link. In seconds we'll show you which EFGH capabilities — embedded insurance, payments, SME financing and more — best fit your business.",
    urlLabel: "Your website",
    urlPlaceholder: "yourcompany.com",
    submitButton: "Run my free audit",
    disclaimer: "No sign-up needed to see your results. Takes about 20 seconds."
  },

  /* ===========================================================================
     3. QUESTIONS  —  OPTIONAL quick questions asked alongside the URL.
     ---------------------------------------------------------------------------
     Currently OFF: visitors simply paste their link and the audit scores them
     purely from scanning their website. The list below is empty, so no
     questions are shown.

     WANT TO TURN QUESTIONS BACK ON? Add question blocks into this list. Each
     answer can carry "tags" that connect to a capability's "matchTags" further
     down, nudging that capability's score up. Example of one question:

       {
         id: "businessType",
         label: "What best describes your business?",
         helper: "Pick the closest match.",
         options: [
           { label: "E-commerce / marketplace", tags: ["ecommerce", "marketplace"] },
           { label: "Financial services",       tags: ["fintech", "payments"] }
         ]
       }
     =========================================================================== */
  questions: [],

  /* ===========================================================================
     4. CAPABILITIES  —  what EFGH offers. This is the core of the audit.
     ---------------------------------------------------------------------------
     For each capability:
       • name / tagline / description / benefits  → what the visitor reads.
       • icon        → a single emoji shown on the card. Change freely.
       • keywords    → words we look for on the visitor's website. A match here
                       boosts the score. Use lowercase. Add as many as you like.
       • matchTags   → connect to the QUESTION answer tags above. Overlap boosts
                       the score.
       • cta         → the wording of the button on the result card.

     To add a capability: copy one whole { ... } block, paste it before the
     closing ] of this list, and edit the values.
     =========================================================================== */
  capabilities: [
    {
      id: "embedded-insurance",
      name: "Embedded Insurance",
      icon: "🛡️",
      tagline: "Turn everyday journeys into protection",
      description: "Embed tailored insurance and protection directly into your product or checkout — covering individuals, SMEs and communities at scale, without becoming an insurer yourself.",
      benefits: [
        "Add a new, recurring revenue line at checkout or in-app",
        "Increase customer trust and lifetime value with built-in cover",
        "Launch fast with EFGH's digital insurance middleware"
      ],
      keywords: ["insurance", "insure", "protection", "protect", "cover", "coverage", "claim", "policy", "warranty", "premium", "underwrite", "health", "life insurance", "travel insurance", "device", "risk"],
      matchTags: ["embedded", "sells-products", "ecommerce", "marketplace", "travel", "mobility", "logistics", "b2c", "serves-smes"],
      cta: "Explore embedded insurance"
    },
    {
      id: "payments-wallets",
      name: "Payments & Wallets",
      icon: "💳",
      tagline: "Move money across fiat and crypto",
      description: "Power global settlements through stablecoins, cards and traditional rails, with localised wallets that bridge fiat and crypto — plus built-in rewards, loyalty and yield.",
      benefits: [
        "Accept and settle payments across borders and currencies",
        "Offer branded wallets with loyalty, rewards and yield",
        "Reduce settlement cost and time with stablecoin rails"
      ],
      keywords: ["payment", "payments", "checkout", "wallet", "transfer", "remittance", "cross-border", "settlement", "card", "crypto", "stablecoin", "payout", "billing", "subscription", "top-up", "e-wallet", "ewallet", "currency", "fx", "merchant"],
      matchTags: ["payments", "wallet", "ecommerce", "marketplace", "cross-border", "consumers", "b2c"],
      cta: "Explore payments & wallets"
    },
    {
      id: "smesure",
      name: "SMEsure™ for SMEs",
      icon: "🏪",
      tagline: "One platform to run, fund and protect an SME",
      description: "A single platform for small and medium businesses to manage operations, unlock financing and access protection — powered by ConnectSure™ and GAT™.",
      benefits: [
        "Give your SME customers operations, financing and cover in one place",
        "Unlock embedded lending and working capital",
        "Deepen engagement and reduce churn across your SME base"
      ],
      keywords: ["sme", "smes", "msme", "small business", "small businesses", "merchant", "vendor", "supplier", "financing", "loan", "loans", "credit", "working capital", "invoice", "invoicing", "business account", "payroll", "bookkeeping"],
      matchTags: ["serves-smes", "financing", "lending", "b2b", "platform"],
      cta: "Explore SMEsure™"
    },
    {
      id: "lead-distribution",
      name: "Lead Generation & Distribution",
      icon: "📈",
      tagline: "White-label platforms and intelligent conversion",
      description: "Drive lead generation and distribution through white-label platforms, chatbots and intelligent conversion tools — turning traffic into qualified, converted customers.",
      benefits: [
        "Launch white-label journeys to acquire and convert faster",
        "Use chatbots and smart tooling to lift conversion",
        "Distribute financial products to new audiences at scale"
      ],
      keywords: ["lead", "leads", "conversion", "convert", "funnel", "distribution", "partner", "affiliate", "chatbot", "acquisition", "onboarding", "sign up", "signup", "campaign", "growth", "marketing"],
      matchTags: ["distribution", "growth", "b2c", "platform", "marketplace", "consumers"],
      cta: "Explore lead & distribution tools"
    },
    {
      id: "ai-risk",
      name: "AI & Risk Management",
      icon: "🤖",
      tagline: "Fraud monitoring, onboarding and automation",
      description: "Apply AI across connected financial platforms for fraud monitoring, faster onboarding, automation and risk management — keeping growth safe and compliant.",
      benefits: [
        "Detect and reduce fraud in real time",
        "Automate KYC and onboarding to cut friction",
        "Stay compliant as you scale into new markets"
      ],
      keywords: ["fraud", "kyc", "aml", "risk", "compliance", "verification", "verify", "identity", "onboarding", "automation", "ai", "machine learning", "security", "monitoring", "regulated", "regulation"],
      matchTags: ["risk", "regulated", "fintech", "financial-services", "enterprise"],
      cta: "Explore AI & risk tools"
    },
    {
      id: "inclusion-wallet",
      name: "Inclusive Digital Wallet",
      icon: "🌍",
      tagline: "Simple, secure finance for the underserved",
      description: "A simple, secure wallet for digital finance — no complicated seed phrases — helping people who've been excluded from financial services save, borrow and send money safely.",
      benefits: [
        "Reach underbanked customers in Asia and Africa",
        "Offer save, borrow and send without crypto complexity",
        "Build trust through accessible, inclusive design"
      ],
      keywords: ["unbanked", "underbanked", "financial inclusion", "inclusion", "savings", "save", "microfinance", "community", "emerging market", "rural", "africa", "asia", "gig", "underserved"],
      matchTags: ["underserved", "emerging-markets", "inclusion", "consumers", "b2c"],
      cta: "Explore inclusive finance"
    }
  ],

  /* ===========================================================================
     5. SCORING  —  how the numbers turn into "Strong fit" labels.
     ---------------------------------------------------------------------------
     You rarely need to touch this. The score (0–100) for each capability is
     built from website keyword matches and overlapping question tags. The
     thresholds below decide the label. Lower the numbers to be more generous.
     =========================================================================== */
  scoring: {
    strongFitThreshold: 60,   // score >= this  → "Strong fit"
    potentialFitThreshold: 30, // score >= this → "Worth exploring"
    // below potentialFitThreshold → "Lower priority" (still shown, de-emphasised)

    // Relative weight of each signal. Keep these positive numbers.
    weights: {
      keywordMatch: 12,       // points per distinct keyword found on the site
      keywordMatchCap: 60,    // max points keywords alone can contribute
      tagMatch: 16,           // points per overlapping question tag
      baseFloor: 8            // small base so nothing sits at a flat zero
    }
  },

  /* ===========================================================================
     6. RESULTS PAGE  —  wording around the results.
     =========================================================================== */
  results: {
    headingPrefix: "Here's how EFGH can help",
    headingFallback: "Here's how EFGH can help your business",
    subtitle: "Based on your website and answers, these capabilities are the strongest fit. The closer the match, the more impact we expect.",
    couldNotReadSiteNote: "We couldn't fully read your website automatically. Talk to our team for a tailored review of how EFGH can help.",
    labels: {
      strong: "Strong fit",
      potential: "Worth exploring",
      low: "Lower priority"
    },
    matchMeterLabel: "Fit",
    primaryCta: "Talk to our team",
    secondaryCta: "Run another audit"
  },

  /* ===========================================================================
     7. METHODOLOGY  —  how the audit works (builds trust).
     =========================================================================== */
  methodology: {
    title: "How we score your fit",
    intro: "This audit is a fast, directional guide — not a formal assessment. Here's exactly how it reaches its conclusions, so you know what's behind the numbers.",
    steps: [
      {
        title: "We read your website",
        body: "We fetch your homepage and scan its text — headings, descriptions and copy — for signals about what your business does and who it serves."
      },
      {
        title: "We match against EFGH capabilities",
        body: "Each EFGH capability has a profile of relevant keywords and business signals. We compare your website to every capability's profile."
      },
      {
        title: "We score and rank the fit",
        body: "Each capability gets a fit score from the keyword matches found on your site. We rank them so the strongest opportunities surface first."
      }
    ],
    disclaimer: "Results are indicative and generated automatically. For a tailored plan, speak with the EFGH team."
  },

  /* ===========================================================================
     8. LEAD FORM  —  the pop-up that captures leads after results.
     ---------------------------------------------------------------------------
     "requestTypes" is the dropdown list. Add or remove options freely.
     =========================================================================== */
  leadForm: {
    title: "Let's turn this into a plan",
    subtitle: "Share a few details and our team will reach out with how EFGH can help your business specifically.",
    fields: {
      name: { label: "Your name", placeholder: "Jane Tan" },
      email: { label: "Your work email", placeholder: "jane@yourcompany.com" },
      phone: { label: "Your contact number", placeholder: "+65 1234 5678" },
      requestType: { label: "Type of request" },
      message: { label: "Your message", placeholder: "Tell us a little about your business and what you'd like to achieve…", maxLength: 1000 }
    },
    requestTypes: [
      "General enquiry",
      "Embedded insurance",
      "Payments & wallets",
      "SME platform / financing",
      "Lead generation & distribution",
      "AI & risk management",
      "Partnership",
      "Other"
    ],
    submitButton: "Submit",
    submittingButton: "Sending…",
    successTitle: "Thank you — we've got it.",
    successBody: "Our team will be in touch shortly. In the meantime, feel free to explore your results.",
    consentText: "By submitting, you agree EFGH may contact you about your enquiry.",
    errorMessage: "Something went wrong sending your details. Please try again, or email us directly."
  },

  /* ===========================================================================
     9. FOOTER
     =========================================================================== */
  footer: {
    note: "This capability audit is a free tool by EFGH (Embed Financial Group Holdings).",
    links: [
      { label: "Visit efgh.xyz", url: "https://efgh.xyz" },
      { label: "About EFGH", url: "https://efgh.xyz/about-us" },
      { label: "Our solutions", url: "https://efgh.xyz/embedded-insurance/fintech-and-financial-services" }
    ],
    copyright: "© EFGH. All rights reserved."
  }
};

// Make the config available to the rest of the app. (Don't edit this line.)
if (typeof window !== "undefined") { window.EFGH_AUDIT = EFGH_AUDIT; }
