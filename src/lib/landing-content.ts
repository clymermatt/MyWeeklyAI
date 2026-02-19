export interface LandingPage {
  slug: string;
  type: "role" | "industry";
  label: string;
  meta: {
    title: string;
    description: string;
  };
  hero: {
    headline: string;
    subheadline: string;
  };
  painPoints: {
    title: string;
    description: string;
  }[];
  solution: {
    title: string;
    description: string;
  }[];
  whatYouGet: string[];
  cta: string;
}

const landingPages: Record<string, LandingPage> = {
  // ─── ROLES ──────────────────────────────────────────────

  "software-engineers": {
    slug: "software-engineers",
    type: "role",
    label: "Software Engineers",
    meta: {
      title: "AI News for Software Engineers | My Weekly AI",
      description:
        "A weekly AI brief built for software engineers. Copilot updates, new coding agents, framework integrations — filtered for what you ship.",
    },
    hero: {
      headline: "AI is changing how you ship code — keep up without the noise",
      subheadline:
        "Copilot, Cursor, Devin, CodeWhisperer — new tools drop weekly. Get a brief that cuts through hype and tells you what actually matters for your stack.",
    },
    painPoints: [
      {
        title: "Too many AI coding tools to evaluate",
        description:
          "Every week there's a new code assistant, agent framework, or IDE plugin. You don't have time to try them all — you need someone to filter the signal.",
      },
      {
        title: "Generic newsletters waste your time",
        description:
          "You don't need another article about ChatGPT prompts for marketers. You need to know if the new Copilot workspace feature actually works for TypeScript monorepos.",
      },
      {
        title: "Hard to know what's production-ready",
        description:
          "Demos are impressive but production is different. You need context on what real teams are shipping with these tools, not just Twitter hype.",
      },
    ],
    solution: [
      {
        title: "Stack-aware filtering",
        description:
          "Tell us your languages, frameworks, and tools. We surface AI news that's relevant to your actual development workflow.",
      },
      {
        title: "Code-first coverage",
        description:
          "We prioritize coding agents, developer tools, API updates, and framework integrations — not enterprise sales announcements.",
      },
      {
        title: "What to Test this week",
        description:
          "Actionable experiments you can try in your codebase — like testing a new AI refactoring tool on a real PR.",
      },
    ],
    whatYouGet: [
      "AI coding tool updates filtered for your stack",
      "New agent frameworks and when they're worth trying",
      "API changes from OpenAI, Anthropic, Google that affect your integrations",
      "Real team case studies, not just product launches",
      "Weekly experiments to try in your actual codebase",
    ],
    cta: "Get AI news that speaks your language",
  },

  "product-managers": {
    slug: "product-managers",
    type: "role",
    label: "Product Managers",
    meta: {
      title: "AI News for Product Managers | My Weekly AI",
      description:
        "Weekly AI brief for PMs. New features to build, competitive moves to watch, and AI capabilities to add to your roadmap.",
    },
    hero: {
      headline: "Your roadmap needs AI context — not another hype cycle",
      subheadline:
        "Stakeholders are asking about AI features. Competitors are shipping them. Get a weekly brief that helps you make informed product decisions.",
    },
    painPoints: [
      {
        title: "Stakeholders asking questions you can't answer",
        description:
          "Your CEO read an article about AI agents and wants to know your AI strategy. You need enough context to have informed conversations.",
      },
      {
        title: "Competitors shipping AI features fast",
        description:
          "Every week a competitor adds 'AI-powered' something. You need to know what's real and what's a wrapper on ChatGPT.",
      },
      {
        title: "Hard to prioritize AI on the roadmap",
        description:
          "Should you build AI search? An AI assistant? Auto-categorization? You need to understand what's feasible and what users actually want.",
      },
    ],
    solution: [
      {
        title: "Product-lens filtering",
        description:
          "We surface AI news through a product management lens — capabilities to evaluate, competitive signals, and user expectation shifts.",
      },
      {
        title: "Roadmap-relevant insights",
        description:
          "Each brief highlights what's becoming table-stakes, what's differentiated, and what's still too early to bet on.",
      },
      {
        title: "Stakeholder-ready context",
        description:
          "Walk into meetings with clear, concise takes on AI trends — no jargon, just product implications.",
      },
    ],
    whatYouGet: [
      "AI capabilities maturing from novelty to table-stakes",
      "Competitive intelligence on who's shipping what",
      "Framework for evaluating 'should we build this?'",
      "User expectation shifts driven by AI products",
      "Weekly talking points for stakeholder conversations",
    ],
    cta: "Get AI insights for your roadmap",
  },

  "ux-designers": {
    slug: "ux-designers",
    type: "role",
    label: "UX Designers",
    meta: {
      title: "AI News for UX Designers | My Weekly AI",
      description:
        "Weekly AI brief for UX/product designers. New design tools, AI interaction patterns, and how AI is reshaping user expectations.",
    },
    hero: {
      headline: "AI is reshaping every interface — design with context, not fear",
      subheadline:
        "AI copilots, conversational UIs, generative design tools — the field is moving fast. Get a brief that helps you design with these capabilities, not against them.",
    },
    painPoints: [
      {
        title: "New AI design tools every week",
        description:
          "Figma AI, Galileo, Uizard, Relume — tools keep launching. You need to know which ones actually improve your workflow vs. which are demos.",
      },
      {
        title: "AI interaction patterns are still being invented",
        description:
          "How do you design for an AI that sometimes hallucinates? Where does the chatbot end and the UI begin? The patterns aren't settled yet.",
      },
      {
        title: "Stakeholders want 'AI-powered' everything",
        description:
          "Every feature request now includes 'can we add AI to this?' You need to separate useful AI from feature bloat.",
      },
    ],
    solution: [
      {
        title: "Design-focused AI coverage",
        description:
          "We track AI design tools, interaction patterns, and UX research on how users actually interact with AI features.",
      },
      {
        title: "Pattern library updates",
        description:
          "Emerging patterns for AI UX — from inline suggestions to conversational interfaces — with real examples.",
      },
      {
        title: "Tool evaluations that matter",
        description:
          "Which AI design tools are ready for production workflows and which are still experimental.",
      },
    ],
    whatYouGet: [
      "AI design tool updates and honest evaluations",
      "Emerging interaction patterns for AI features",
      "UX research on user trust, control, and AI expectations",
      "Case studies of well-designed AI interfaces",
      "Weekly experiments to try in your design workflow",
    ],
    cta: "Get AI news designed for designers",
  },

  "data-scientists": {
    slug: "data-scientists",
    type: "role",
    label: "Data Scientists",
    meta: {
      title: "AI News for Data Scientists | My Weekly AI",
      description:
        "Weekly AI brief for data scientists and ML engineers. Model releases, benchmarks, tooling updates, and research worth reading.",
    },
    hero: {
      headline: "New models drop weekly — know which ones matter for your work",
      subheadline:
        "Arxiv papers, model releases, benchmark wars, framework updates. Get a curated brief that saves you hours of reading for the research that actually affects your pipelines.",
    },
    painPoints: [
      {
        title: "Arxiv firehose is overwhelming",
        description:
          "Hundreds of papers a week. You can't read them all, and most aren't relevant to your specific domain or approach.",
      },
      {
        title: "Model benchmarks are noisy",
        description:
          "Every new model claims SOTA on something. You need to know what actually performs better in practice, not just on cherry-picked evals.",
      },
      {
        title: "Tooling landscape keeps shifting",
        description:
          "PyTorch vs. JAX, vLLM vs. TGI, LangChain vs. LlamaIndex — the ecosystem changes fast and choosing wrong costs weeks.",
      },
    ],
    solution: [
      {
        title: "Research-grade filtering",
        description:
          "We filter by your focus areas — NLP, CV, RL, tabular, etc. — so you only see papers and models relevant to your work.",
      },
      {
        title: "Practical model comparisons",
        description:
          "Not just benchmark scores but real-world performance notes, cost considerations, and deployment readiness.",
      },
      {
        title: "Tooling that ships",
        description:
          "Framework updates, new libraries, and infrastructure changes that affect your training and inference pipelines.",
      },
    ],
    whatYouGet: [
      "Key paper summaries filtered for your research domain",
      "Model releases with practical performance context",
      "Framework and tooling updates that affect your stack",
      "Dataset releases and benchmark methodology analysis",
      "Weekly experiments worth running on your data",
    ],
    cta: "Get research that matters to your models",
  },

  "engineering-managers": {
    slug: "engineering-managers",
    type: "role",
    label: "Engineering Managers",
    meta: {
      title: "AI News for Engineering Managers | My Weekly AI",
      description:
        "Weekly AI brief for EMs. Team productivity tools, hiring shifts, adoption strategies, and what your engineers are asking about.",
    },
    hero: {
      headline: "Your team is using AI tools — manage the shift intentionally",
      subheadline:
        "Engineers are adopting Copilot, Claude, and AI agents whether you have a policy or not. Get a brief that helps you lead the transition instead of reacting to it.",
    },
    painPoints: [
      {
        title: "Shadow AI adoption on your team",
        description:
          "Engineers are using AI tools you haven't evaluated. You need to know what's out there so you can set sensible policies, not blanket bans.",
      },
      {
        title: "Productivity claims are hard to verify",
        description:
          "Vendors say '40% faster coding.' Your team says 'it's helpful sometimes.' You need real data on what tools actually move the needle.",
      },
      {
        title: "Hiring and skill requirements are shifting",
        description:
          "Should you hire for AI skills? Prompt engineering? Or just hire strong engineers and let them learn? The landscape is unclear.",
      },
    ],
    solution: [
      {
        title: "Team-level AI intelligence",
        description:
          "We cover AI tools, policies, and practices from a team management perspective — not just individual productivity.",
      },
      {
        title: "Adoption playbooks",
        description:
          "How other engineering orgs are rolling out AI tools, measuring impact, and handling security concerns.",
      },
      {
        title: "The question your team will ask next",
        description:
          "Stay one step ahead of what your engineers are reading about and wanting to try.",
      },
    ],
    whatYouGet: [
      "AI tool evaluations from a team adoption perspective",
      "Productivity data from real engineering orgs",
      "Security and compliance considerations for AI tools",
      "Hiring and skill development implications",
      "Weekly talking points for team standups and planning",
    ],
    cta: "Lead your team's AI adoption",
  },

  "cto-vp-engineering": {
    slug: "cto-vp-engineering",
    type: "role",
    label: "CTOs & VPs of Engineering",
    meta: {
      title: "AI News for CTOs & Engineering Leaders | My Weekly AI",
      description:
        "Weekly AI brief for engineering executives. Strategic bets, build-vs-buy decisions, and the AI moves your competitors are making.",
    },
    hero: {
      headline: "AI strategy decisions land on your desk — make them with context",
      subheadline:
        "Build or buy? Which models to bet on? How to restructure teams around AI? Get a weekly brief that gives you the strategic context to decide.",
    },
    painPoints: [
      {
        title: "Board and CEO want an AI strategy",
        description:
          "You're expected to have a clear AI roadmap, but the landscape changes every month. You need a continuously updated view.",
      },
      {
        title: "Build vs. buy is harder than ever",
        description:
          "Open source models improve monthly, API prices keep dropping, and every vendor is adding AI. The calculus shifts constantly.",
      },
      {
        title: "Competitive pressure to ship AI features",
        description:
          "Your competitors are announcing AI capabilities. You need to know what's real, what's vaporware, and where to invest.",
      },
    ],
    solution: [
      {
        title: "Executive-level synthesis",
        description:
          "We distill technical AI developments into strategic implications — not implementation details, but decision context.",
      },
      {
        title: "Competitive intelligence",
        description:
          "What your peers and competitors are building, buying, and betting on — sourced from launches, partnerships, and hiring signals.",
      },
      {
        title: "Investment-grade context",
        description:
          "Model cost trends, capability trajectories, and vendor lock-in risks to inform your technical strategy.",
      },
    ],
    whatYouGet: [
      "Strategic AI moves by major tech companies and competitors",
      "Build-vs-buy analysis for common AI capabilities",
      "Model cost and capability trend analysis",
      "Org design patterns for AI-forward engineering teams",
      "Weekly executive summary for board and leadership conversations",
    ],
    cta: "Get strategic AI intelligence",
  },

  "ceo-founders": {
    slug: "ceo-founders",
    type: "role",
    label: "CEOs & Founders",
    meta: {
      title: "AI News for CEOs & Founders | My Weekly AI",
      description:
        "Weekly AI brief for startup and company leaders. Market shifts, funding signals, competitive moves, and AI opportunities for your business.",
    },
    hero: {
      headline: "AI is restructuring your market — see it clearly",
      subheadline:
        "Your investors ask about AI. Your team wants AI tools. Your competitors ship AI features. Get a 5-minute weekly brief that gives you the context to lead.",
    },
    painPoints: [
      {
        title: "AI is changing your competitive landscape",
        description:
          "New entrants are using AI to undercut incumbents. You need to understand which parts of your market are being disrupted and how.",
      },
      {
        title: "Everyone has AI opinions, few have context",
        description:
          "Your board, team, and advisors all have different takes on AI. You need your own informed perspective to make decisions.",
      },
      {
        title: "The opportunity cost of ignoring AI is growing",
        description:
          "Every month you wait, competitors and startups get further ahead. But moving too fast on the wrong bet wastes resources.",
      },
    ],
    solution: [
      {
        title: "CEO-level AI briefing",
        description:
          "We translate technical AI developments into business implications — market shifts, new capabilities, and competitive signals.",
      },
      {
        title: "Industry-specific filtering",
        description:
          "AI news filtered for your specific industry and company stage, not generic tech coverage.",
      },
      {
        title: "Decision-ready insights",
        description:
          "Clear enough to act on, concise enough to read over coffee Sunday morning.",
      },
    ],
    whatYouGet: [
      "AI market shifts relevant to your industry",
      "Competitive moves and new AI-native entrants",
      "Funding and partnership signals in AI",
      "Capability milestones that unlock new business models",
      "Weekly executive summary for board and investor conversations",
    ],
    cta: "Get the AI brief built for founders",
  },

  "marketing-managers": {
    slug: "marketing-managers",
    type: "role",
    label: "Marketing Managers",
    meta: {
      title: "AI News for Marketing Managers | My Weekly AI",
      description:
        "Weekly AI brief for marketers. New AI tools for content, ads, analytics — filtered for what actually improves campaigns.",
    },
    hero: {
      headline: "AI marketing tools are multiplying — know which ones deliver",
      subheadline:
        "Jasper, Writer, Copy.ai, plus AI features in every ad platform. Get a weekly brief that cuts through vendor noise and tells you what actually improves campaign performance.",
    },
    painPoints: [
      {
        title: "Every tool is 'AI-powered' now",
        description:
          "Your martech stack vendors all added AI features overnight. You need to know which ones are worth learning and which are checkbox features.",
      },
      {
        title: "Content creation is being disrupted",
        description:
          "AI can write copy, generate images, produce video. You need to understand where it helps vs. where it hurts your brand.",
      },
      {
        title: "Competitors are moving faster",
        description:
          "Other marketing teams are using AI for personalization, testing, and content at scale. You need to keep pace without wasting budget.",
      },
    ],
    solution: [
      {
        title: "Marketing-specific AI filtering",
        description:
          "We cover AI tools and techniques through a marketing lens — campaign performance, content quality, and ROI.",
      },
      {
        title: "Tool comparisons that matter",
        description:
          "Head-to-head looks at AI marketing tools based on real usage, not vendor claims.",
      },
      {
        title: "Tactical experiments",
        description:
          "Weekly AI experiments you can run on real campaigns — A/B test an AI-written subject line, try AI ad creative, etc.",
      },
    ],
    whatYouGet: [
      "AI marketing tool launches and updates",
      "Platform AI feature releases (Google, Meta, LinkedIn)",
      "Content generation quality comparisons",
      "Campaign optimization techniques using AI",
      "Weekly experiments to try on real campaigns",
    ],
    cta: "Get AI news that improves your campaigns",
  },

  "content-strategists": {
    slug: "content-strategists",
    type: "role",
    label: "Content Strategists",
    meta: {
      title: "AI News for Content Strategists | My Weekly AI",
      description:
        "Weekly AI brief for content strategists. AI writing tools, SEO shifts from AI search, and how content strategy is evolving.",
    },
    hero: {
      headline: "AI is rewriting the rules of content — stay ahead of the shift",
      subheadline:
        "AI-generated content is flooding the web. AI search is changing discovery. Your content strategy needs to evolve. Get a weekly brief that tracks what matters.",
    },
    painPoints: [
      {
        title: "AI search is changing content discovery",
        description:
          "Google AI Overviews, Perplexity, ChatGPT search — the way people find content is shifting. Your SEO strategy needs to adapt.",
      },
      {
        title: "AI content quality bar is rising",
        description:
          "Generic AI content is commoditized. You need to understand where AI helps your process and where human strategy is the differentiator.",
      },
      {
        title: "Editorial workflows are being rebuilt",
        description:
          "AI can draft, edit, optimize, and repurpose content. You need to redesign workflows without losing quality or voice.",
      },
    ],
    solution: [
      {
        title: "Content-first AI coverage",
        description:
          "We track AI's impact on content strategy, SEO, editorial workflows, and audience engagement.",
      },
      {
        title: "Search landscape monitoring",
        description:
          "How AI search products are changing content discovery, citations, and traffic patterns.",
      },
      {
        title: "Workflow experiments",
        description:
          "Practical ways to integrate AI into your editorial process without sacrificing quality.",
      },
    ],
    whatYouGet: [
      "AI search product updates and SEO implications",
      "AI writing tool comparisons for editorial teams",
      "Content strategy shifts driven by AI capabilities",
      "Workflow automation opportunities for content teams",
      "Weekly experiments to test in your content pipeline",
    ],
    cta: "Get AI news for content strategy",
  },

  "sales-revenue": {
    slug: "sales-revenue",
    type: "role",
    label: "Sales & Revenue Leaders",
    meta: {
      title: "AI News for Sales Teams | My Weekly AI",
      description:
        "Weekly AI brief for sales and revenue professionals. AI sales tools, prospecting automation, and competitive intelligence.",
    },
    hero: {
      headline: "AI is changing how deals get done — sell smarter, not harder",
      subheadline:
        "AI SDRs, automated prospecting, call intelligence, deal scoring — the sales tech stack is being rebuilt. Get a brief that helps you stay competitive.",
    },
    painPoints: [
      {
        title: "AI SDR tools are flooding the market",
        description:
          "Every week there's a new AI tool claiming to automate prospecting. You need to know which ones actually book meetings vs. burn your domain.",
      },
      {
        title: "Buyers are using AI too",
        description:
          "Your prospects are using AI to research, compare, and evaluate vendors. The sales process is changing on both sides.",
      },
      {
        title: "CRM vendors are adding AI features fast",
        description:
          "Salesforce Einstein, HubSpot AI, Gong insights — your existing tools are changing. You need to know what's worth adopting.",
      },
    ],
    solution: [
      {
        title: "Revenue-focused filtering",
        description:
          "We cover AI through a sales and revenue lens — pipeline impact, deal velocity, and rep productivity.",
      },
      {
        title: "Tool-by-tool analysis",
        description:
          "Honest assessments of AI sales tools based on real pipeline data, not case studies from the vendor.",
      },
      {
        title: "Competitive edge insights",
        description:
          "What your competitors' sales teams are using and how buyers' expectations are shifting.",
      },
    ],
    whatYouGet: [
      "AI sales tool launches and honest evaluations",
      "CRM AI feature updates (Salesforce, HubSpot, etc.)",
      "Buyer behavior shifts driven by AI",
      "Prospecting and outreach automation techniques",
      "Weekly experiments to try in your sales workflow",
    ],
    cta: "Get AI news that closes deals",
  },

  "devops-engineers": {
    slug: "devops-engineers",
    type: "role",
    label: "DevOps Engineers",
    meta: {
      title: "AI News for DevOps Engineers | My Weekly AI",
      description:
        "Weekly AI brief for DevOps and platform engineers. AI ops tools, infrastructure automation, and incident management with AI.",
    },
    hero: {
      headline: "AI is automating infrastructure — run ops with context",
      subheadline:
        "AI-powered incident response, infrastructure as code generation, automated runbooks — DevOps is being transformed. Get a brief on what's production-ready.",
    },
    painPoints: [
      {
        title: "AI ops tools are hard to evaluate",
        description:
          "Every observability and infrastructure vendor added AI features. You need to know which ones actually reduce toil vs. which add noise.",
      },
      {
        title: "Security implications of AI in the pipeline",
        description:
          "AI-generated code, AI-assisted deployments, AI agents with production access — the attack surface is growing. You need to stay ahead of risks.",
      },
      {
        title: "LLM infrastructure is a new domain",
        description:
          "Your team may be asked to run model inference, manage GPU clusters, or deploy AI services. The tooling is young and evolving fast.",
      },
    ],
    solution: [
      {
        title: "Ops-focused AI coverage",
        description:
          "We filter AI news for infrastructure, reliability, deployment, and security — the things that keep production running.",
      },
      {
        title: "Production-readiness assessments",
        description:
          "We flag what's ready for production workloads vs. what's still in 'cool demo' territory.",
      },
      {
        title: "Infrastructure experiments",
        description:
          "Safe AI experiments to try in staging — AI-generated Terraform, automated incident summaries, etc.",
      },
    ],
    whatYouGet: [
      "AI ops tool updates (Datadog, PagerDuty, etc. AI features)",
      "Infrastructure-as-code AI generation tools",
      "LLM serving and inference infrastructure news",
      "Security advisories for AI in the deployment pipeline",
      "Weekly experiments safe to try in staging environments",
    ],
    cta: "Get AI news for your infrastructure",
  },

  "research-scientists": {
    slug: "research-scientists",
    type: "role",
    label: "Research Scientists",
    meta: {
      title: "AI News for Research Scientists | My Weekly AI",
      description:
        "Weekly AI brief for researchers. Key papers, methodology advances, reproducibility notes, and what's moving your field forward.",
    },
    hero: {
      headline: "Hundreds of papers a week — read the ones that matter",
      subheadline:
        "Arxiv alone publishes thousands of AI papers monthly. Get a curated brief that surfaces the methodological advances and results relevant to your research area.",
    },
    painPoints: [
      {
        title: "Keeping up with the literature is a full-time job",
        description:
          "The publication rate in AI has exploded. Even in your niche, there are more papers than you can track. Important work gets missed.",
      },
      {
        title: "Reproducibility is hard to assess from abstracts",
        description:
          "You need context on whether a paper's claims hold up — community reactions, reproduction attempts, and code availability.",
      },
      {
        title: "Industry and academia are diverging",
        description:
          "Compute-intensive papers from big labs set benchmarks you can't replicate. You need to know what's feasible at your scale.",
      },
    ],
    solution: [
      {
        title: "Research-domain filtering",
        description:
          "Filtered by your specific subfield — NLP, CV, RL, neuro-symbolic, etc. — so you see what's relevant, not everything.",
      },
      {
        title: "Beyond abstracts",
        description:
          "Community reactions, reproduction attempts, and practical significance context for key papers.",
      },
      {
        title: "Methodology and tooling updates",
        description:
          "New training techniques, evaluation frameworks, and research tooling worth integrating into your workflow.",
      },
    ],
    whatYouGet: [
      "Key paper summaries filtered for your research area",
      "Community reactions and reproduction notes",
      "New datasets, benchmarks, and evaluation methods",
      "Research tooling and framework updates",
      "Weekly pointers to papers worth reading in full",
    ],
    cta: "Get the research brief that saves you hours",
  },

  "business-analysts": {
    slug: "business-analysts",
    type: "role",
    label: "Business Analysts",
    meta: {
      title: "AI News for Business Analysts | My Weekly AI",
      description:
        "Weekly AI brief for business analysts. AI analytics tools, data automation, and how AI is changing business intelligence workflows.",
    },
    hero: {
      headline: "AI is automating analysis — evolve your toolkit",
      subheadline:
        "Natural language queries, automated dashboards, AI-generated insights — BI is transforming. Get a brief that helps you stay ahead of the tools.",
    },
    painPoints: [
      {
        title: "Every BI tool added an AI chatbot",
        description:
          "Tableau, Power BI, Looker — they all have AI features now. You need to know which ones actually produce reliable analysis.",
      },
      {
        title: "Stakeholders expect faster insights",
        description:
          "AI is raising expectations for turnaround time. You need to know which parts of your workflow AI can genuinely accelerate.",
      },
      {
        title: "Data quality issues hit AI harder",
        description:
          "AI tools amplify data quality problems. You need to understand guardrails and validation when AI generates business insights.",
      },
    ],
    solution: [
      {
        title: "Analyst-focused AI filtering",
        description:
          "We cover AI through a business analysis lens — data tools, reporting automation, and insight generation.",
      },
      {
        title: "Tool-by-tool assessment",
        description:
          "Honest looks at AI BI features — what works, what hallucinates, and where human judgment is still essential.",
      },
      {
        title: "Workflow integration",
        description:
          "Practical ways to add AI to your analysis workflow without compromising data integrity.",
      },
    ],
    whatYouGet: [
      "BI platform AI feature updates and evaluations",
      "AI data analysis tools and honest reviews",
      "Automation opportunities in reporting workflows",
      "Data quality and AI guardrail best practices",
      "Weekly experiments to try with your datasets",
    ],
    cta: "Get AI news for better analysis",
  },

  "project-managers": {
    slug: "project-managers",
    type: "role",
    label: "Project Managers",
    meta: {
      title: "AI News for Project Managers | My Weekly AI",
      description:
        "Weekly AI brief for project managers. AI project tools, automation workflows, and how AI is changing project delivery.",
    },
    hero: {
      headline: "AI is changing project delivery — manage with better tools",
      subheadline:
        "AI-generated status updates, automated risk detection, intelligent scheduling. Get a brief on AI tools that actually reduce project management overhead.",
    },
    painPoints: [
      {
        title: "PM tools are racing to add AI",
        description:
          "Asana, Monday, Jira, Linear — every tool has AI features now. You need to know which ones save time vs. which create more work.",
      },
      {
        title: "AI is changing team workflows",
        description:
          "Your team members are using AI tools that affect timelines, quality, and process. You need to understand the impact on delivery.",
      },
      {
        title: "Automating the right things",
        description:
          "AI can automate status reports, risk flags, and resource planning. But automating the wrong things creates blind spots.",
      },
    ],
    solution: [
      {
        title: "PM-focused AI coverage",
        description:
          "We filter AI news for project delivery — tools, process improvements, and team productivity patterns.",
      },
      {
        title: "Tool integration insights",
        description:
          "How AI features in your PM tools actually work in practice, from teams using them daily.",
      },
      {
        title: "Process experiments",
        description:
          "Low-risk AI experiments to try in your project workflow — AI standup summaries, automated risk flagging, etc.",
      },
    ],
    whatYouGet: [
      "PM tool AI feature launches and real-world reviews",
      "Team productivity patterns with AI adoption",
      "Automation workflows for common PM tasks",
      "Risk management and AI-assisted planning tools",
      "Weekly experiments for your project workflow",
    ],
    cta: "Get AI news for project delivery",
  },

  "customer-success": {
    slug: "customer-success",
    type: "role",
    label: "Customer Success",
    meta: {
      title: "AI News for Customer Success | My Weekly AI",
      description:
        "Weekly AI brief for CS teams. AI support tools, churn prediction, and how to use AI to improve customer outcomes.",
    },
    hero: {
      headline: "AI is transforming customer success — retain more, scale better",
      subheadline:
        "AI chatbots, churn prediction, automated health scoring, AI-assisted onboarding. Get a brief on the tools and techniques that actually improve retention.",
    },
    painPoints: [
      {
        title: "AI chatbots can help or hurt CX",
        description:
          "Bad AI support destroys trust. Good AI support scales your team. You need to know the difference before deploying.",
      },
      {
        title: "Churn signals are getting more complex",
        description:
          "AI can analyze usage patterns, support tickets, and engagement data to predict churn. But most tools overpromise on accuracy.",
      },
      {
        title: "Scaling without losing the human touch",
        description:
          "Automation is necessary for growth but customers still want relationships. AI needs to augment, not replace, your team.",
      },
    ],
    solution: [
      {
        title: "CS-focused AI filtering",
        description:
          "We cover AI through a customer success lens — retention, engagement, support quality, and scalability.",
      },
      {
        title: "Tool evaluations from CS teams",
        description:
          "How AI support and success tools perform in practice — CSAT impact, resolution rates, and customer feedback.",
      },
      {
        title: "Implementation playbooks",
        description:
          "Practical guides for adding AI to your CS workflow without damaging customer relationships.",
      },
    ],
    whatYouGet: [
      "AI support tool launches and real CSAT data",
      "Churn prediction and health scoring AI tools",
      "Automation workflows for onboarding and engagement",
      "Case studies of CS teams using AI effectively",
      "Weekly experiments to try with your customer base",
    ],
    cta: "Get AI news for customer success",
  },

  "solutions-architects": {
    slug: "solutions-architects",
    type: "role",
    label: "Solutions Architects",
    meta: {
      title: "AI News for Solutions Architects | My Weekly AI",
      description:
        "Weekly AI brief for solutions architects. AI integration patterns, model serving architectures, and reference designs for AI systems.",
    },
    hero: {
      headline: "AI systems need architecture — design them with current context",
      subheadline:
        "RAG pipelines, model routing, agent orchestration, vector databases — AI architecture patterns are evolving weekly. Get a brief that keeps your designs current.",
    },
    painPoints: [
      {
        title: "AI architecture patterns change fast",
        description:
          "Six months ago everyone built RAG. Now it's agentic workflows. The reference architectures keep shifting and your designs need to keep up.",
      },
      {
        title: "Model selection affects entire system design",
        description:
          "Choosing between cloud APIs, open source models, and fine-tuned variants has cascading effects on architecture, cost, and latency.",
      },
      {
        title: "Integration complexity is growing",
        description:
          "Connecting LLMs to enterprise data, existing APIs, and business logic requires new patterns that aren't in any textbook yet.",
      },
    ],
    solution: [
      {
        title: "Architecture-focused coverage",
        description:
          "We cover AI from a systems design perspective — integration patterns, infrastructure choices, and scalability considerations.",
      },
      {
        title: "Reference design updates",
        description:
          "Evolving reference architectures for RAG, agents, model serving, and AI-enhanced applications.",
      },
      {
        title: "Vendor-neutral analysis",
        description:
          "Honest comparisons of cloud AI services, vector databases, and orchestration frameworks.",
      },
    ],
    whatYouGet: [
      "AI architecture pattern evolution and best practices",
      "Cloud AI service updates (AWS, Azure, GCP)",
      "Vector database and retrieval infrastructure comparisons",
      "Agent orchestration and workflow design patterns",
      "Weekly reference designs to evaluate for your systems",
    ],
    cta: "Get AI architecture intelligence",
  },

  consultants: {
    slug: "consultants",
    type: "role",
    label: "Consultants",
    meta: {
      title: "AI News for Consultants | My Weekly AI",
      description:
        "Weekly AI brief for consultants and advisors. Client-relevant AI trends, industry disruption patterns, and AI adoption frameworks.",
    },
    hero: {
      headline: "Your clients are asking about AI — have the answers ready",
      subheadline:
        "Every client meeting now includes AI questions. Get a weekly brief that gives you cross-industry AI intelligence to advise with confidence.",
    },
    painPoints: [
      {
        title: "Clients expect AI expertise from you",
        description:
          "Whether you're a strategy, tech, or management consultant, clients expect you to have an informed AI perspective for their specific industry.",
      },
      {
        title: "Each client is in a different industry",
        description:
          "AI impacts healthcare differently than fintech. You need cross-industry coverage deep enough to be credible with each client.",
      },
      {
        title: "AI recommendations have career risk",
        description:
          "Recommending the wrong AI strategy can damage your reputation. You need well-sourced, current intelligence to back your advice.",
      },
    ],
    solution: [
      {
        title: "Cross-industry AI intelligence",
        description:
          "We cover AI's impact across industries so you can advise clients in any sector with current, relevant insights.",
      },
      {
        title: "Framework-ready insights",
        description:
          "AI trends and developments packaged in ways that fit into consulting frameworks and client deliverables.",
      },
      {
        title: "Source-backed analysis",
        description:
          "Every insight comes with context and sources so you can trace claims and build credible client materials.",
      },
    ],
    whatYouGet: [
      "Cross-industry AI adoption trends and patterns",
      "AI vendor landscape shifts and competitive dynamics",
      "Frameworks for client AI strategy conversations",
      "Case studies of AI adoption across industries",
      "Weekly insights to weave into client deliverables",
    ],
    cta: "Get AI intelligence for your clients",
  },

  "students-researchers": {
    slug: "students-researchers",
    type: "role",
    label: "Students & Researchers",
    meta: {
      title: "AI News for Students & Researchers | My Weekly AI",
      description:
        "Weekly AI brief for students and academic researchers. Key developments, learning resources, and career-relevant AI trends.",
    },
    hero: {
      headline: "Learn AI from what's happening, not just textbooks",
      subheadline:
        "The field moves faster than any curriculum. Get a weekly brief that connects real-world AI developments to what you're studying and building.",
    },
    painPoints: [
      {
        title: "Curriculum lags behind the field",
        description:
          "By the time a technique is in a textbook, it might already be outdated. You need to supplement coursework with current developments.",
      },
      {
        title: "Hard to know what skills matter for jobs",
        description:
          "The job market for AI roles is shifting. You need to understand which skills employers actually value vs. what's trendy on Twitter.",
      },
      {
        title: "Research topics move under your feet",
        description:
          "A research area can go from hot to solved (or abandoned) in months. You need to stay current on where your field is heading.",
      },
    ],
    solution: [
      {
        title: "Learning-oriented filtering",
        description:
          "We highlight developments with learning value — new techniques, open datasets, and accessible implementations.",
      },
      {
        title: "Career-relevant signals",
        description:
          "Hiring trends, in-demand skills, and what companies are actually building with AI.",
      },
      {
        title: "Research landscape updates",
        description:
          "Where the field is heading, which subfields are growing, and where there's opportunity for novel contributions.",
      },
    ],
    whatYouGet: [
      "Key AI developments with learning context",
      "Open-source projects and datasets worth exploring",
      "Career-relevant skill and hiring trend signals",
      "Research direction updates for your focus area",
      "Weekly experiments to try for hands-on learning",
    ],
    cta: "Get the AI brief for learners and builders",
  },

  // ─── INDUSTRIES ─────────────────────────────────────────

  "saas-software": {
    slug: "saas-software",
    type: "industry",
    label: "SaaS & Software",
    meta: {
      title: "AI News for SaaS & Software Companies | My Weekly AI",
      description:
        "Weekly AI brief for SaaS teams. AI features your competitors are shipping, pricing shifts, and build-vs-buy decisions for AI capabilities.",
    },
    hero: {
      headline: "Every SaaS product is adding AI — ship the features that matter",
      subheadline:
        "AI copilots, intelligent search, auto-categorization, predictive analytics — AI features are becoming table-stakes in SaaS. Get a brief on what to build and what to buy.",
    },
    painPoints: [
      {
        title: "Competitors are shipping AI features fast",
        description:
          "Your competitive set is adding AI capabilities every sprint. You need to know what's real product innovation vs. what's an API wrapper.",
      },
      {
        title: "Build vs. buy decisions are constant",
        description:
          "Build your own AI features, use an API, or embed a vendor? The cost-benefit calculus changes monthly as models improve and prices drop.",
      },
      {
        title: "Customer expectations are shifting",
        description:
          "Users now expect AI-powered search, suggestions, and automation. What was delightful last year is table-stakes this year.",
      },
    ],
    solution: [
      {
        title: "SaaS-specific AI coverage",
        description:
          "We track AI feature launches across SaaS, pricing model shifts, and which capabilities are becoming customer expectations.",
      },
      {
        title: "Build-vs-buy intelligence",
        description:
          "Model API pricing, open-source alternatives, and embedded AI vendor comparisons to inform your build decisions.",
      },
      {
        title: "Feature inspiration",
        description:
          "AI features shipping in SaaS products outside your category that could inspire your roadmap.",
      },
    ],
    whatYouGet: [
      "AI feature launches across the SaaS landscape",
      "Model API pricing changes and cost optimization",
      "Build-vs-buy analysis for common AI capabilities",
      "Customer expectation shifts for AI in software",
      "Weekly product ideas inspired by AI-native SaaS",
    ],
    cta: "Get AI news for your SaaS product",
  },

  fintech: {
    slug: "fintech",
    type: "industry",
    label: "Fintech & Financial Services",
    meta: {
      title: "AI News for Fintech | My Weekly AI",
      description:
        "Weekly AI brief for fintech. Fraud detection advances, AI regulation updates, algorithmic trading, and AI compliance tools.",
    },
    hero: {
      headline: "AI in finance is accelerating — navigate regulation and opportunity",
      subheadline:
        "Fraud detection, algorithmic underwriting, AI compliance, robo-advisors — fintech AI is moving fast. Get a brief that covers innovation and regulation together.",
    },
    painPoints: [
      {
        title: "Regulation is trying to catch up with AI",
        description:
          "AI in financial decisions faces increasing regulatory scrutiny. You need to track both opportunities and compliance requirements.",
      },
      {
        title: "Fraud patterns evolve with AI on both sides",
        description:
          "Fraudsters use AI too. Detection models need constant updating, and you need to know what's working across the industry.",
      },
      {
        title: "Model explainability is a compliance requirement",
        description:
          "Black-box AI decisions aren't acceptable in finance. You need to track explainability techniques and regulatory expectations.",
      },
    ],
    solution: [
      {
        title: "Fintech-specific AI filtering",
        description:
          "We cover AI through a financial services lens — fraud, compliance, underwriting, trading, and payments.",
      },
      {
        title: "Regulation tracking",
        description:
          "AI regulation updates from SEC, CFPB, EU AI Act, and other bodies that affect financial AI deployments.",
      },
      {
        title: "Industry benchmarks",
        description:
          "What leading fintechs are deploying, ROI data from AI implementations, and vendor evaluations.",
      },
    ],
    whatYouGet: [
      "AI regulation updates affecting financial services",
      "Fraud detection and prevention AI advances",
      "Model explainability and compliance tooling",
      "Fintech AI vendor evaluations and comparisons",
      "Weekly insights from AI deployments in finance",
    ],
    cta: "Get AI news for fintech",
  },

  healthcare: {
    slug: "healthcare",
    type: "industry",
    label: "Healthcare & Life Sciences",
    meta: {
      title: "AI News for Healthcare | My Weekly AI",
      description:
        "Weekly AI brief for healthcare. Clinical AI approvals, diagnostic tools, drug discovery advances, and healthcare AI regulation.",
    },
    hero: {
      headline: "AI in healthcare is going from research to clinical practice",
      subheadline:
        "FDA-approved AI diagnostics, drug discovery breakthroughs, clinical workflow automation — healthcare AI is moving from papers to patients. Get the brief.",
    },
    painPoints: [
      {
        title: "Regulatory approval is a moving target",
        description:
          "FDA is still figuring out AI medical device regulation. You need to track approvals, guidelines, and enforcement trends.",
      },
      {
        title: "Clinical validation takes years, hype takes minutes",
        description:
          "AI health startups announce breakthroughs weekly. You need to distinguish validated clinical tools from impressive demos.",
      },
      {
        title: "Patient data and AI create privacy tensions",
        description:
          "Training AI on health data raises HIPAA and consent questions. The rules are evolving and non-compliance is expensive.",
      },
    ],
    solution: [
      {
        title: "Healthcare-specific AI filtering",
        description:
          "We cover AI through a clinical and life sciences lens — diagnostics, drug discovery, clinical workflows, and regulation.",
      },
      {
        title: "Regulatory tracking",
        description:
          "FDA approvals, WHO guidelines, and international health AI regulations that affect your work.",
      },
      {
        title: "Evidence-based coverage",
        description:
          "We distinguish peer-reviewed results from press releases and flag validation status for every clinical AI development.",
      },
    ],
    whatYouGet: [
      "FDA AI medical device approvals and guideline updates",
      "Drug discovery AI breakthroughs and clinical trials",
      "Clinical workflow automation tools and outcomes",
      "Health data privacy and AI compliance updates",
      "Weekly developments in healthcare AI research",
    ],
    cta: "Get AI news for healthcare",
  },

  "ecommerce-retail": {
    slug: "ecommerce-retail",
    type: "industry",
    label: "E-commerce & Retail",
    meta: {
      title: "AI News for E-commerce & Retail | My Weekly AI",
      description:
        "Weekly AI brief for e-commerce and retail. AI personalization, visual search, inventory optimization, and customer experience.",
    },
    hero: {
      headline: "AI is reshaping every part of retail — from search to supply chain",
      subheadline:
        "AI-powered product recommendations, visual search, dynamic pricing, demand forecasting. Get a weekly brief on the AI tools that move conversion and margin.",
    },
    painPoints: [
      {
        title: "Amazon keeps raising the AI bar",
        description:
          "Amazon's AI capabilities in search, recommendations, and logistics set customer expectations. You need to keep pace or differentiate.",
      },
      {
        title: "Personalization tools are converging",
        description:
          "Every e-commerce platform now has AI personalization. You need to know what actually improves conversion vs. what's vendor marketing.",
      },
      {
        title: "Supply chain and demand forecasting are critical",
        description:
          "AI-powered inventory management can save millions or cause stockouts. The tools are improving but require careful evaluation.",
      },
    ],
    solution: [
      {
        title: "Retail-specific AI filtering",
        description:
          "We cover AI through a retail lens — conversion, personalization, supply chain, pricing, and customer experience.",
      },
      {
        title: "Platform and vendor tracking",
        description:
          "AI feature updates from Shopify, BigCommerce, and major retail tech vendors.",
      },
      {
        title: "Revenue-focused insights",
        description:
          "AI implementations with real conversion, AOV, and margin impact data from retail deployments.",
      },
    ],
    whatYouGet: [
      "AI personalization and recommendation engine updates",
      "Visual search and product discovery innovations",
      "Demand forecasting and inventory AI tools",
      "E-commerce platform AI feature releases",
      "Weekly AI experiments for your store or catalog",
    ],
    cta: "Get AI news for retail",
  },

  "education-edtech": {
    slug: "education-edtech",
    type: "industry",
    label: "Education & EdTech",
    meta: {
      title: "AI News for Education & EdTech | My Weekly AI",
      description:
        "Weekly AI brief for education. AI tutoring tools, academic integrity debates, adaptive learning platforms, and EdTech AI policy.",
    },
    hero: {
      headline: "AI is rewriting education — teach and build with context",
      subheadline:
        "AI tutors, automated grading, adaptive learning, academic integrity challenges. Whether you teach or build EdTech, get a brief on what's shaping the field.",
    },
    painPoints: [
      {
        title: "Academic integrity is being redefined",
        description:
          "Students are using AI for everything from essays to problem sets. Institutions are scrambling to set policies. The debate is far from settled.",
      },
      {
        title: "AI tutoring products vary wildly in quality",
        description:
          "Khan Academy's Khanmigo, Duolingo Max, and dozens of startups all offer AI tutoring. Pedagogical quality varies enormously.",
      },
      {
        title: "Institutional adoption is slow and cautious",
        description:
          "Schools and universities move carefully with new technology. You need to understand both what's possible and what's practical for adoption.",
      },
    ],
    solution: [
      {
        title: "Education-specific filtering",
        description:
          "We cover AI through an education and learning lens — pedagogy, tools, policy, and institutional adoption.",
      },
      {
        title: "Policy and debate tracking",
        description:
          "Academic integrity policies, institutional AI guidelines, and evolving debates around AI in education.",
      },
      {
        title: "EdTech product analysis",
        description:
          "Honest evaluations of AI education products — learning outcomes, student engagement, and pedagogical soundness.",
      },
    ],
    whatYouGet: [
      "AI education tool launches and pedagogical reviews",
      "Academic integrity policy updates and debates",
      "Adaptive learning and AI tutoring research",
      "Institutional AI adoption case studies",
      "Weekly developments in AI-powered learning",
    ],
    cta: "Get AI news for education",
  },

  "media-entertainment": {
    slug: "media-entertainment",
    type: "industry",
    label: "Media & Entertainment",
    meta: {
      title: "AI News for Media & Entertainment | My Weekly AI",
      description:
        "Weekly AI brief for media. AI content generation, copyright battles, streaming algorithms, and the future of creative production.",
    },
    hero: {
      headline: "AI is disrupting every layer of media — create with clarity",
      subheadline:
        "AI-generated video, music, and images. Copyright lawsuits. Algorithm-driven distribution. Get a brief that covers the creative opportunity and the legal landscape.",
    },
    painPoints: [
      {
        title: "Copyright and IP battles are escalating",
        description:
          "NYT vs. OpenAI, artists vs. image generators, music labels vs. AI — the legal landscape is shifting and affects your content strategy.",
      },
      {
        title: "AI production tools are improving exponentially",
        description:
          "Sora, Runway, Udio — AI can now generate high-quality video, music, and images. The production economics are changing fast.",
      },
      {
        title: "Distribution algorithms are AI-driven",
        description:
          "Recommendation algorithms on every platform use AI to surface content. Understanding them is key to audience reach.",
      },
    ],
    solution: [
      {
        title: "Media-specific AI filtering",
        description:
          "We cover AI through a media and entertainment lens — creation tools, distribution, rights, and audience engagement.",
      },
      {
        title: "Legal landscape tracking",
        description:
          "Copyright cases, licensing developments, and regulatory actions that affect AI-generated content.",
      },
      {
        title: "Creative tool evaluations",
        description:
          "Honest assessments of AI creation tools — quality, control, limitations, and production-readiness.",
      },
    ],
    whatYouGet: [
      "AI content generation tool releases and quality updates",
      "Copyright and IP legal developments",
      "Distribution algorithm changes and implications",
      "Production cost and workflow impact analysis",
      "Weekly creative AI experiments to try",
    ],
    cta: "Get AI news for media",
  },

  "marketing-advertising": {
    slug: "marketing-advertising",
    type: "industry",
    label: "Marketing & Advertising",
    meta: {
      title: "AI News for Marketing & Advertising | My Weekly AI",
      description:
        "Weekly AI brief for the marketing industry. Ad platform AI updates, creative automation, measurement changes, and martech AI tools.",
    },
    hero: {
      headline: "AI is rebuilding the marketing stack — invest in what works",
      subheadline:
        "Performance Max, AI creative, predictive audiences, automated bidding — every marketing channel now runs on AI. Get a brief on what's actually improving ROAS.",
    },
    painPoints: [
      {
        title: "Ad platforms are black-boxing with AI",
        description:
          "Google Performance Max, Meta Advantage+ — platforms are pushing AI-driven campaigns that give you less control. You need to understand what's happening inside.",
      },
      {
        title: "Martech vendors all added AI overnight",
        description:
          "Every tool in your stack now has AI features. Separating meaningful capability from feature-checkbox marketing is exhausting.",
      },
      {
        title: "Creative production is being automated",
        description:
          "AI can generate ad copy, images, and video variations at scale. Quality and brand consistency are the open questions.",
      },
    ],
    solution: [
      {
        title: "Marketing-industry filtering",
        description:
          "We cover AI from a marketing industry perspective — ad tech, creative tools, measurement, and customer data platforms.",
      },
      {
        title: "Platform-specific updates",
        description:
          "AI changes in Google, Meta, TikTok, LinkedIn, and other ad platforms with performance impact context.",
      },
      {
        title: "Performance data",
        description:
          "AI marketing tool evaluations with real ROAS, CPA, and efficiency data from actual campaigns.",
      },
    ],
    whatYouGet: [
      "Ad platform AI feature launches and performance data",
      "Martech AI tool evaluations and comparisons",
      "AI creative generation quality and brand safety",
      "Measurement and attribution changes from AI",
      "Weekly AI experiments for your marketing campaigns",
    ],
    cta: "Get AI news for the marketing industry",
  },

  consulting: {
    slug: "consulting",
    type: "industry",
    label: "Consulting & Professional Services",
    meta: {
      title: "AI News for Consulting Firms | My Weekly AI",
      description:
        "Weekly AI brief for consulting. AI strategy frameworks, client industry disruption, and AI's impact on professional services delivery.",
    },
    hero: {
      headline: "AI is disrupting consulting — and making it more valuable",
      subheadline:
        "AI automates analysis but clients need more strategic guidance than ever. Get a brief on how AI is changing both client industries and consulting delivery.",
    },
    painPoints: [
      {
        title: "Clients expect AI in your deliverables",
        description:
          "Clients want AI-powered analysis, AI strategy recommendations, and AI-enhanced presentations. Your delivery model needs to evolve.",
      },
      {
        title: "AI is disrupting your clients' industries",
        description:
          "Every client industry is being reshaped by AI. You need cross-industry intelligence to advise credibly.",
      },
      {
        title: "Junior analyst work is being automated",
        description:
          "AI can do research, data analysis, and slide creation. The consulting pyramid model is under pressure.",
      },
    ],
    solution: [
      {
        title: "Consulting-industry filtering",
        description:
          "We cover AI's impact on professional services delivery and the industries consulting firms serve.",
      },
      {
        title: "Cross-industry intelligence",
        description:
          "AI disruption patterns across industries, giving you the breadth to advise clients in any sector.",
      },
      {
        title: "Delivery model insights",
        description:
          "How leading firms are integrating AI into their delivery model, from analysis to client engagement.",
      },
    ],
    whatYouGet: [
      "AI disruption patterns across client industries",
      "Consulting firm AI adoption and delivery model changes",
      "AI strategy frameworks for client engagements",
      "Cross-industry AI vendor and tool landscape",
      "Weekly insights to strengthen client conversations",
    ],
    cta: "Get AI news for consulting",
  },

  manufacturing: {
    slug: "manufacturing",
    type: "industry",
    label: "Manufacturing & Industrial",
    meta: {
      title: "AI News for Manufacturing | My Weekly AI",
      description:
        "Weekly AI brief for manufacturing. Predictive maintenance, quality inspection AI, supply chain optimization, and industrial automation.",
    },
    hero: {
      headline: "AI on the factory floor is going from pilot to production",
      subheadline:
        "Predictive maintenance, visual quality inspection, supply chain optimization, digital twins. Get a brief on the AI applications that actually reduce downtime and improve yield.",
    },
    painPoints: [
      {
        title: "Pilot-to-production gap is wide",
        description:
          "Many manufacturers have AI pilots that never scale. You need to understand what makes AI deployments succeed in industrial environments.",
      },
      {
        title: "OT and IT convergence is messy",
        description:
          "Connecting factory floor data to AI models requires bridging operational and information technology. The integration challenges are unique.",
      },
      {
        title: "ROI is hard to measure",
        description:
          "AI in manufacturing promises reduced downtime and improved yield, but measuring ROI against legacy processes is complex.",
      },
    ],
    solution: [
      {
        title: "Manufacturing-specific filtering",
        description:
          "We cover AI through an industrial lens — predictive maintenance, quality, supply chain, and production optimization.",
      },
      {
        title: "Deployment case studies",
        description:
          "Real manufacturing AI deployments with ROI data, implementation timelines, and lessons learned.",
      },
      {
        title: "Vendor landscape",
        description:
          "Industrial AI platform comparisons — Siemens, Rockwell, PTC, and startups — with capability and integration analysis.",
      },
    ],
    whatYouGet: [
      "Predictive maintenance AI advances and case studies",
      "Visual quality inspection and defect detection tools",
      "Supply chain optimization AI developments",
      "Industrial AI platform updates and comparisons",
      "Weekly insights from manufacturing AI deployments",
    ],
    cta: "Get AI news for manufacturing",
  },

  "real-estate-proptech": {
    slug: "real-estate-proptech",
    type: "industry",
    label: "Real Estate & PropTech",
    meta: {
      title: "AI News for Real Estate & PropTech | My Weekly AI",
      description:
        "Weekly AI brief for real estate. AI valuations, property tech tools, market prediction models, and automated property management.",
    },
    hero: {
      headline: "AI is transforming property — from valuation to management",
      subheadline:
        "Automated valuations, AI-powered property search, predictive market analytics, smart building management. Get a brief on the PropTech AI tools driving the industry.",
    },
    painPoints: [
      {
        title: "AI valuation models are getting better — and more competitive",
        description:
          "Zillow, Redfin, and startups are all improving AI valuations. If you're in the business, you need to track accuracy and methodology.",
      },
      {
        title: "Property management is being automated",
        description:
          "AI chatbots for tenants, predictive maintenance for buildings, automated lease analysis — the operations side is changing fast.",
      },
      {
        title: "Market prediction tools overpromise",
        description:
          "AI market forecasting sounds great but accuracy varies enormously. You need to know which tools are worth the subscription.",
      },
    ],
    solution: [
      {
        title: "Real estate-specific filtering",
        description:
          "We cover AI through a property and real estate lens — valuations, transactions, management, and market analytics.",
      },
      {
        title: "PropTech vendor tracking",
        description:
          "AI-powered PropTech tools evaluated for accuracy, integration, and actual business impact.",
      },
      {
        title: "Market intelligence",
        description:
          "How AI is changing property search, transactions, and market dynamics.",
      },
    ],
    whatYouGet: [
      "AI valuation and pricing model developments",
      "PropTech AI tool launches and evaluations",
      "Property management automation advances",
      "Market prediction AI accuracy and methodology",
      "Weekly insights from AI in real estate",
    ],
    cta: "Get AI news for real estate",
  },

  "legal-legaltech": {
    slug: "legal-legaltech",
    type: "industry",
    label: "Legal & LegalTech",
    meta: {
      title: "AI News for Legal Professionals | My Weekly AI",
      description:
        "Weekly AI brief for legal. Contract analysis AI, legal research tools, court rulings on AI, and the future of legal practice.",
    },
    hero: {
      headline: "AI is changing legal practice — from research to review",
      subheadline:
        "Contract analysis, legal research, document review, AI-generated filings — the profession is being transformed. Get a brief on what's reliable and what's risky.",
    },
    painPoints: [
      {
        title: "AI hallucinations have real consequences in law",
        description:
          "Lawyers have been sanctioned for citing AI-generated fake cases. You need to know which AI tools are reliable enough for legal work.",
      },
      {
        title: "Legal research tools are multiplying",
        description:
          "Westlaw AI, LexisNexis AI, Harvey, CoCounsel — every legal research platform has AI now. Accuracy and citation quality vary.",
      },
      {
        title: "Courts are setting AI precedents",
        description:
          "Judges are ruling on AI usage in filings, AI evidence, and AI-generated content. These rulings affect practice immediately.",
      },
    ],
    solution: [
      {
        title: "Legal-specific AI filtering",
        description:
          "We cover AI through a legal practice lens — research tools, document analysis, court rulings, and regulatory developments.",
      },
      {
        title: "Reliability assessments",
        description:
          "Accuracy evaluations of legal AI tools with citation verification and hallucination rate data.",
      },
      {
        title: "Judicial and regulatory tracking",
        description:
          "Court rulings on AI in legal proceedings and bar association guidelines on AI usage.",
      },
    ],
    whatYouGet: [
      "Legal AI tool launches and accuracy evaluations",
      "Court rulings and bar guidelines on AI usage",
      "Contract analysis and document review AI updates",
      "Legal research AI tool comparisons",
      "Weekly developments in AI and the law",
    ],
    cta: "Get AI news for legal",
  },

  government: {
    slug: "government",
    type: "industry",
    label: "Government & Public Sector",
    meta: {
      title: "AI News for Government | My Weekly AI",
      description:
        "Weekly AI brief for government. AI policy, procurement, public service automation, and responsible AI in the public sector.",
    },
    hero: {
      headline: "AI in government is moving from policy to practice",
      subheadline:
        "Executive orders, procurement frameworks, automated public services, responsible AI requirements. Get a brief that covers both the policy and the practice.",
    },
    painPoints: [
      {
        title: "AI policy is fragmented and evolving",
        description:
          "Federal, state, and international AI policies are all moving at different speeds. Keeping up with requirements is a full-time job.",
      },
      {
        title: "Procurement for AI is unlike traditional IT",
        description:
          "AI procurement requires evaluating model performance, bias, and ongoing monitoring — processes most government procurement isn't built for.",
      },
      {
        title: "Responsible AI isn't optional in government",
        description:
          "Government AI deployments face scrutiny on fairness, transparency, and accountability. The standards are higher than the private sector.",
      },
    ],
    solution: [
      {
        title: "Government-specific filtering",
        description:
          "We cover AI through a public sector lens — policy, procurement, service delivery, and responsible AI.",
      },
      {
        title: "Policy tracking",
        description:
          "Executive orders, legislation, agency guidelines, and international AI policy developments.",
      },
      {
        title: "Implementation case studies",
        description:
          "Government AI deployments with outcomes, lessons learned, and procurement approaches.",
      },
    ],
    whatYouGet: [
      "AI policy and executive order updates",
      "Government AI procurement frameworks and guidance",
      "Public service automation case studies",
      "Responsible AI requirements and evaluation tools",
      "Weekly developments in government AI",
    ],
    cta: "Get AI news for government",
  },

  nonprofit: {
    slug: "nonprofit",
    type: "industry",
    label: "Nonprofit & Social Impact",
    meta: {
      title: "AI News for Nonprofits | My Weekly AI",
      description:
        "Weekly AI brief for nonprofits. AI for social good, grant opportunities, fundraising tools, and responsible AI in the social sector.",
    },
    hero: {
      headline: "AI can amplify your impact — if you use it right",
      subheadline:
        "AI-powered fundraising, program evaluation, grant writing, and beneficiary services. Get a brief on AI tools and funding available for the social sector.",
    },
    painPoints: [
      {
        title: "Limited budget for AI exploration",
        description:
          "Nonprofits can't experiment freely with expensive AI tools. You need to know what's free, discounted, or grant-funded for the sector.",
      },
      {
        title: "Ethical considerations are heightened",
        description:
          "AI deployed for vulnerable populations requires extra care around bias, consent, and unintended consequences.",
      },
      {
        title: "Capacity to adopt new technology is low",
        description:
          "Small teams, tight budgets, and urgent mission work leave little room for technology exploration. You need curated, actionable information.",
      },
    ],
    solution: [
      {
        title: "Nonprofit-specific filtering",
        description:
          "We cover AI through a social sector lens — fundraising, programs, operations, and AI-for-good initiatives.",
      },
      {
        title: "Resource-conscious coverage",
        description:
          "We highlight free tools, nonprofit discounts, and grant-funded AI programs available to your organization.",
      },
      {
        title: "Ethical AI guidance",
        description:
          "Responsible AI frameworks and considerations specific to working with communities and vulnerable populations.",
      },
    ],
    whatYouGet: [
      "Free and discounted AI tools for nonprofits",
      "AI grant and funding opportunities",
      "Fundraising and donor engagement AI tools",
      "Responsible AI frameworks for social impact",
      "Weekly AI-for-good developments and case studies",
    ],
    cta: "Get AI news for nonprofits",
  },

  cybersecurity: {
    slug: "cybersecurity",
    type: "industry",
    label: "Cybersecurity",
    meta: {
      title: "AI News for Cybersecurity | My Weekly AI",
      description:
        "Weekly AI brief for cybersecurity. AI threat detection, adversarial AI attacks, security tooling, and AI-powered defense strategies.",
    },
    hero: {
      headline: "AI is the biggest shift in security since the cloud — stay ahead",
      subheadline:
        "AI-powered threats, AI-assisted defense, LLM vulnerabilities, deepfake attacks. Get a brief that covers both sides of AI in security.",
    },
    painPoints: [
      {
        title: "Attackers are using AI too",
        description:
          "AI-generated phishing, deepfake social engineering, automated vulnerability discovery — the threat landscape is evolving with AI. You need to track offensive AI capabilities.",
      },
      {
        title: "Every security vendor added AI",
        description:
          "CrowdStrike, Palo Alto, Fortinet — every vendor has AI features. Separating real detection improvement from marketing is critical.",
      },
      {
        title: "LLM and AI systems are new attack surfaces",
        description:
          "Prompt injection, data exfiltration, model poisoning — securing AI systems requires new knowledge and new tools.",
      },
    ],
    solution: [
      {
        title: "Security-specific AI filtering",
        description:
          "We cover AI through a cybersecurity lens — threats, defenses, vulnerabilities, and compliance.",
      },
      {
        title: "Threat intelligence",
        description:
          "AI-powered attack techniques, vulnerability disclosures in AI systems, and emerging threat patterns.",
      },
      {
        title: "Defense tooling evaluations",
        description:
          "Honest assessments of AI security tools — detection rates, false positive impact, and integration complexity.",
      },
    ],
    whatYouGet: [
      "AI-powered threat techniques and advisories",
      "Security vendor AI feature evaluations",
      "LLM and AI system vulnerability disclosures",
      "AI compliance and governance frameworks",
      "Weekly threat intelligence from the AI security landscape",
    ],
    cta: "Get AI news for cybersecurity",
  },

  gaming: {
    slug: "gaming",
    type: "industry",
    label: "Gaming",
    meta: {
      title: "AI News for Gaming | My Weekly AI",
      description:
        "Weekly AI brief for gaming. AI NPCs, procedural generation, game testing, and how AI is changing game development and player experience.",
    },
    hero: {
      headline: "AI is changing how games are built and played — level up your knowledge",
      subheadline:
        "AI NPCs with memory, procedural world generation, AI game testing, dynamic difficulty. Get a brief on the AI tools and techniques reshaping game development.",
    },
    painPoints: [
      {
        title: "AI NPCs are the next big player expectation",
        description:
          "Players are starting to expect NPCs that can hold conversations and react dynamically. The technology is emerging but the design patterns aren't settled.",
      },
      {
        title: "AI art and content generation are contentious",
        description:
          "AI-generated game assets save production time but face community backlash. You need to navigate the technical capability and the cultural sensitivity.",
      },
      {
        title: "Development pipelines are being AI-augmented",
        description:
          "AI-assisted level design, testing, balancing, and QA are becoming viable. Understanding what's ready for production vs. what's experimental matters.",
      },
    ],
    solution: [
      {
        title: "Gaming-specific AI filtering",
        description:
          "We cover AI through a game development and player experience lens — tools, techniques, and community response.",
      },
      {
        title: "Development tool evaluations",
        description:
          "AI tools for game development — from asset generation to testing — evaluated for production-readiness.",
      },
      {
        title: "Player experience insights",
        description:
          "How AI features affect player engagement, retention, and community sentiment.",
      },
    ],
    whatYouGet: [
      "AI NPC and dynamic content technology updates",
      "Game development AI tool evaluations",
      "Procedural generation and AI art advances",
      "AI game testing and QA automation tools",
      "Weekly AI experiments for your game development pipeline",
    ],
    cta: "Get AI news for gaming",
  },

  telecommunications: {
    slug: "telecommunications",
    type: "industry",
    label: "Telecommunications",
    meta: {
      title: "AI News for Telecommunications | My Weekly AI",
      description:
        "Weekly AI brief for telecom. Network optimization AI, customer service automation, 5G and AI convergence, and telecom-specific AI applications.",
    },
    hero: {
      headline: "AI is optimizing every layer of the network — operate with intelligence",
      subheadline:
        "Network optimization, predictive maintenance, customer service AI, fraud detection. Get a brief on AI applications that reduce churn and improve network performance.",
    },
    painPoints: [
      {
        title: "Network complexity is outpacing human operators",
        description:
          "5G, edge computing, and network slicing create optimization challenges that require AI. The tools are maturing but evaluation is complex.",
      },
      {
        title: "Customer service costs are unsustainable",
        description:
          "AI chatbots and virtual agents promise cost reduction, but customer satisfaction is the real metric. You need tools that do both.",
      },
      {
        title: "Legacy infrastructure meets AI",
        description:
          "Deploying AI on telecom infrastructure that spans decades of technology is a unique integration challenge.",
      },
    ],
    solution: [
      {
        title: "Telecom-specific AI filtering",
        description:
          "We cover AI through a telecommunications lens — network ops, customer experience, and infrastructure.",
      },
      {
        title: "Network AI evaluations",
        description:
          "AI tools for network optimization, anomaly detection, and capacity planning from vendors like Nokia, Ericsson, and startups.",
      },
      {
        title: "Customer experience intelligence",
        description:
          "AI customer service deployments with real NPS and cost impact data from telecom operators.",
      },
    ],
    whatYouGet: [
      "Network optimization AI advances and vendor updates",
      "Customer service AI deployments and satisfaction data",
      "5G and edge AI convergence developments",
      "Telecom fraud detection AI tools",
      "Weekly insights from telecom AI implementations",
    ],
    cta: "Get AI news for telecom",
  },

  "energy-cleantech": {
    slug: "energy-cleantech",
    type: "industry",
    label: "Energy & CleanTech",
    meta: {
      title: "AI News for Energy & CleanTech | My Weekly AI",
      description:
        "Weekly AI brief for energy. Grid optimization AI, predictive maintenance, clean energy forecasting, and climate tech AI applications.",
    },
    hero: {
      headline: "AI is accelerating the energy transition — power your decisions",
      subheadline:
        "Grid optimization, renewable forecasting, carbon tracking, predictive maintenance. Get a brief on the AI applications driving energy efficiency and clean energy.",
    },
    painPoints: [
      {
        title: "Grid management is becoming AI-dependent",
        description:
          "Renewable intermittency, distributed generation, and EV charging create grid complexity that requires AI-powered optimization.",
      },
      {
        title: "Climate reporting now requires AI tools",
        description:
          "ESG reporting, carbon tracking, and climate risk assessment increasingly rely on AI. The tool landscape is fragmented.",
      },
      {
        title: "Asset maintenance at scale needs prediction",
        description:
          "Wind turbines, solar panels, pipelines — AI-powered predictive maintenance can save millions, but model accuracy varies by asset type.",
      },
    ],
    solution: [
      {
        title: "Energy-specific AI filtering",
        description:
          "We cover AI through an energy and climate lens — grid, renewables, efficiency, and carbon management.",
      },
      {
        title: "CleanTech AI tracking",
        description:
          "AI applications in clean energy, carbon capture, climate modeling, and sustainability reporting.",
      },
      {
        title: "Operational AI insights",
        description:
          "Predictive maintenance, grid optimization, and energy trading AI with real performance data.",
      },
    ],
    whatYouGet: [
      "Grid optimization and energy management AI updates",
      "Renewable energy forecasting and AI tools",
      "Carbon tracking and ESG reporting AI developments",
      "Predictive maintenance AI for energy assets",
      "Weekly insights from AI in the energy transition",
    ],
    cta: "Get AI news for energy",
  },

  "transportation-logistics": {
    slug: "transportation-logistics",
    type: "industry",
    label: "Transportation & Logistics",
    meta: {
      title: "AI News for Transportation & Logistics | My Weekly AI",
      description:
        "Weekly AI brief for transportation and logistics. Autonomous vehicles, route optimization, warehouse automation, and supply chain AI.",
    },
    hero: {
      headline: "AI is optimizing every mile — from warehouse to last mile delivery",
      subheadline:
        "Autonomous vehicles, route optimization, warehouse robotics, demand forecasting. Get a brief on the AI transforming how things move.",
    },
    painPoints: [
      {
        title: "Autonomous vehicle timelines keep shifting",
        description:
          "Self-driving trucks, delivery robots, autonomous taxis — the timelines are unclear and the regulatory landscape is complex. You need honest progress tracking.",
      },
      {
        title: "Route and fleet optimization is table-stakes",
        description:
          "AI-powered routing is no longer a competitive advantage — it's a requirement. You need to know what's leading edge vs. what's commodity.",
      },
      {
        title: "Warehouse automation is accelerating",
        description:
          "AI-powered picking, packing, and inventory management are transforming warehouses. The ROI varies enormously by operation type.",
      },
    ],
    solution: [
      {
        title: "Logistics-specific AI filtering",
        description:
          "We cover AI through a transportation and logistics lens — routing, warehousing, fleet management, and supply chain.",
      },
      {
        title: "Autonomous vehicle tracking",
        description:
          "Honest progress updates on autonomous vehicles — regulatory milestones, deployment data, and technology readiness.",
      },
      {
        title: "Operations AI insights",
        description:
          "Warehouse, fleet, and supply chain AI deployments with real efficiency and cost impact data.",
      },
    ],
    whatYouGet: [
      "Autonomous vehicle progress and regulatory updates",
      "Route and fleet optimization AI advances",
      "Warehouse automation and robotics AI tools",
      "Supply chain prediction and visibility AI",
      "Weekly insights from AI in logistics operations",
    ],
    cta: "Get AI news for logistics",
  },
};

export const allSlugs = Object.keys(landingPages);

export function getLandingPage(slug: string): LandingPage | undefined {
  return landingPages[slug];
}

export default landingPages;
