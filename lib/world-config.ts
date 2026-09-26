export type SkillCluster = {
  id: string;
  name: string;
  description: string;
  tools: string[];
};
export type Milestone = {
  id: string;
  year: string;
  title: string;
  organization: string;
  rank: string;
  description: string;
};
export type WorldConfig = {
  about: string[];
  education: string;
  skills: SkillCluster[];
  achievements: Milestone[];
  leadership: { title: string; description: string }[];
  links: { github: string; resume: string };
  impact: { value: string; label: string }[];
};
export const worldDefaults: WorldConfig = {
  about: [
    "I am an Information Systems graduate from Universitas Indonesia, working across product management, business intelligence, and operational systems.",
    "My experience spans logistics at Shopee, CRM and learning platforms at Unilever, cybersecurity products at Digiserve, and digital ecosystems at Bukalapak. Each role has taught me to connect business needs with the details that make a product usable.",
    "I use AI throughout discovery, analysis, documentation, and validation. The goal stays human: give teams clearer information and fewer unnecessary steps.",
  ],
  education:
    "Universitas Indonesia · Information Systems · 2022–2026 · GPA 3.51",
  skills: [
    {
      id: "product",
      name: "Product Management",
      description:
        "From discovery to delivery: frame the problem, define the decision, and validate the outcome.",
      tools: [
        "Discovery",
        "PRDs",
        "Acceptance criteria",
        "UAT",
        "Agile Scrum",
        "Jira",
        "Confluence",
      ],
    },
    {
      id: "ai",
      name: "AI & Automation",
      description: "Human judgment at the centre of practical AI workflows.",
      tools: [
        "LLM workflows",
        "Prompt design",
        "AI-assisted analysis",
        "Chatbot discovery",
      ],
    },
    {
      id: "systems",
      name: "System Design",
      description:
        "Connect operational processes, business rules, and the teams that depend on them.",
      tools: ["Workflow mapping", "Business rules", "CRM", "LMS", "Figma"],
    },
    {
      id: "data",
      name: "Data & Analytics",
      description: "Turn complex information into a clear next action.",
      tools: [
        "SQL",
        "PostgreSQL",
        "Power BI",
        "Python",
        "Pandas",
        "KPI design",
      ],
    },
    {
      id: "business",
      name: "Business Strategy",
      description:
        "Connect customer needs to business models and measurable outcomes.",
      tools: [
        "Market discovery",
        "Business models",
        "Go-to-market",
        "Stakeholder alignment",
      ],
    },
    {
      id: "technology",
      name: "Technology",
      description:
        "An engineering foundation that makes collaboration with builders more effective.",
      tools: ["HTML", "CSS", "JavaScript", "PHP", "Laravel", "Git"],
    },
  ],
  achievements: [
    {
      id: "ideas",
      year: "2025",
      title: "IDEAS Business Plan Competition",
      organization: "Universitas Gadjah Mada · International",
      rank: "Champion",
      description:
        "Moelung: a digital platform connecting waste pickers, collection points, and traceable recycling flows.",
    },
    {
      id: "yew",
      year: "2024",
      title: "Young Entrepreneur Week",
      organization: "UIN Syarif Hidayatullah Jakarta · National",
      rank: "Champion",
      description:
        "SafeIN: a smart card and app concept designed to help prevent the loss of personal valuables.",
    },
    {
      id: "vivace",
      year: "2024",
      title: "Vivace Innovazione",
      organization: "Universitas Lambung Mangkurat · National",
      rank: "Runner-up",
      description:
        "FOODY: an integrated food planning and waste prevention concept for the food and beverage industry.",
    },
  ],
  leadership: [
    {
      title: "VPIC, Business-IT Case Competition · COMPFEST 2024",
      description:
        "Collaborated with XL Axiata on competition cases, supervised four divisions, and connected participants with judges, mentors, and sponsors.",
    },
    {
      title: "Head of Science & Student Development · BEM Fasilkom UI",
      description:
        "Organized business-plan and career-development activities, supporting student creativity, competition readiness, and scholarship awareness.",
    },
  ],
  links: { github: "", resume: "/documents/resanda-resume.pdf" },
  impact: [
    { value: "30%", label: "fewer operational issues" },
    { value: "~50%", label: "less manual allocation effort" },
    { value: "40–60%", label: "faster business reporting" },
    { value: "95%", label: "critical UAT scenario coverage" },
  ],
};
