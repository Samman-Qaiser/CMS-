export const categoriesData = [
  {
    id: 1,
    name: "Backend",
    slug: "backend",
    description: "Server side logic and database management",
    count: 5,
  },
  {
    id: 2,
    name: "Design",
    slug: "design",
    description: "UI/UX principles, Graphics, and Branding",
    count: 3,
  },
  {
    id: 3,
    name: "Frontend",
    slug: "frontend",
    description: "ReactJS, Tailwind CSS, and Motion UI",
    count: 12,
  },
  {
    id: 4,
    name: "News",
    slug: "news",
    description: "Latest industry updates and company news",
    count: 8,
  },
  {
    id: 5,
    name: "Tutorials",
    slug: "tutorials",
    description: "Step-by-step technical guides and how-tos",
    count: 20,
  },
  {
    id: 6,
    name: "Mobile",
    slug: "mobile",
    description: "React Native and Flutter application development",
    count: 2,
  },
  {
    id: 7,
    name: "SEO",
    slug: "seo",
    description: "Search engine optimization and digital marketing",
    count: 4,
  },
  {
    id: 8,
    name: "Security",
    slug: "security",
    description: "Web security best practices and protocols",
    count: 1,
  },
];

export const tagsData = [
  {
    id: 1,
    name: "yoga",
    slug: "yoga",
    createdAt: "Dec. 23, 2022, 12:21 p.m.",
  },
  {
    id: 2,
    name: "macos",
    slug: "macos",
    createdAt: "Dec. 23, 2022, 12:16 p.m.",
  },
  {
    id: 3,
    name: "cybercrime",
    slug: "cybercrime",
    createdAt: "Dec. 23, 2022, 12:07 p.m.",
  },
  {
    id: 4,
    name: "encrypted",
    slug: "encrypted",
    createdAt: "Dec. 23, 2022, 12:05 p.m.",
  },
  {
    id: 5,
    name: "encrypted password",
    slug: "encrypted-password",
    createdAt: "Dec. 23, 2022, 12:05 p.m.",
  },
  {
    id: 6,
    name: "php",
    slug: "php",
    createdAt: "Dec. 6, 2022, 10:25 a.m.",
  },
  {
    id: 7,
    name: "react",
    slug: "react",
    createdAt: "Dec. 6, 2022, 10:41 a.m.",
  },
  {
    id: 8,
    name: "python",
    slug: "python",
    createdAt: "Dec. 6, 2022, 10:25 a.m.",
  },
  {
    id: 9,
    name: "django",
    slug: "django",
    createdAt: "Dec. 6, 2022, 10:27 a.m.",
  },
  {
    id: 10,
    name: "js",
    slug: "js",
    createdAt: "Dec. 6, 2022, 10:42 a.m.",
  },
  {
    id: 11,
    name: "react js",
    slug: "react-js",
    createdAt: "Dec. 6, 2022, 10:42 a.m.",
  },
  {
    id: 12,
    name: "wordpress",
    slug: "wordpress",
    createdAt: "Dec. 6, 2022, 10:37 a.m.",
  },
  {
    id: 13,
    name: "wp",
    slug: "wp",
    createdAt: "Dec. 6, 2022, 10:37 a.m.",
  },
];

export const allBlogs = [
  {
    id: 1,
    title: "We Heard You Wanted to Add SS... Support to Your Workflow",
    slug: "we-heard-you-wanted-to-add-ss-support",
    status: "Published",
    visibility: "Private",
    publishOn: "Dec. 3, 2022",
    createdAt: "Dec. 6, 2022, 10:37 a.m.",
    updatedAt: "May 10, 2026, 1:22 p.m.",
    url: "/blog/ss-update",
    author: "w3@manager",
    categories: ["Backend", "Frontend"],
    tags: ["workflow", "automation", "ss-support"],
    videoUrl: "https://www.youtube.com/embed/example1",
    excerpt: "Exploring the new support features requested by our power users.",
    seo: {
      blogTitle: "We Heard You Wanted to Add SS... Support to Your Workflow",
      metaKeywords: "admin@example.com",
      metaDescription:
        "Detailed guide on adding SS support to modern development workflows.",
    },
    content: `
      Adding SS support has been one of the most requested features this year. 
      By integrating this into your daily routine, you can significantly reduce boilerplate code.
      
      We have focused on making the transition as seamless as possible for existing teams.
      The implementation involves a simple configuration update in your root directory.
    `,
  },
  {
    id: 2,
    title: "Black Friday: All of Our Deals Are Now Live!",
    slug: "black-friday-deals-now-live",
    status: "Published",
    visibility: "Public",
    publishOn: "Dec. 4, 2022",
    createdAt: "Dec. 6, 2022, 10:38 a.m.",
    updatedAt: "May 11, 2026, 2:21 a.m.",
    url: "/blog/black-friday",
    author: "admin@example.com",
    categories: ["News", "Shop"],
    tags: ["deals", "black-friday", "sale"],
    videoUrl: "",
    excerpt:
      "Check out the massive discounts available on all our premium plugins.",
    seo: {
      blogTitle: "Black Friday: All of Our Deals Are Now Live!",
      metaKeywords: "discounts, plugins, sale",
      metaDescription:
        "Don't miss out on our biggest sale of the year with up to 50% off.",
    },
    content: `
      Our Black Friday event is finally here! This year, we are offering record-breaking discounts.
      Whether you are looking for UI kits or backend services, everything is on sale.
      
      Make sure to grab your licenses before the timer runs out on Monday night.
    `,
  },
  {
    id: 3,
    title:
      "React.js Lifecycle — Initialization, Mounting, Updating, and Unmounting",
    slug: "reactjs-lifecycle-initialization-mounting-updating-and-unmounting",
    status: "Published",
    visibility: "Public",
    publishOn: "Dec. 5, 2022",
    createdAt: "Dec. 6, 2022, 10:42 a.m.",
    updatedAt: "May 10, 2026, 8:04 a.m.",
    url: "/blog/react-lifecycle",
    author: "w3@manager",
    categories: ["Frontend", "Design"],
    tags: ["react", "react js", "js"],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    excerpt:
      "Ideally, the lifecycle of React.js is split into four core stages",
    seo: {
      blogTitle:
        "React.js Lifecycle — Initialization, Mounting, Updating, and Unmounting",
      metaKeywords: "admin@example.com",
      metaDescription:
        "An extensive guide on how React components rise and give birth to others in a loop format.",
    },
    content: `
      The React.js lifecycle is an extensive tool that can be used to design a memorable experience on the web. It is one of the most robust avenues in the development word to allow us to create UI-oriented applications.
      
      These apps can be launched on the web for the greater audience to consume as well. While React.js is being updated regularly, the core functionality follows a lifecycle route.
      
      React.js components rise and give birth to others in a loop format. This makes the entire process that much more efficient and lean.
      
      Ideally, the lifecycle of React.js is split into four core stages.
    `,
  },
  {
    id: 4,
    title: "LastPass Admits to Severe Data Breach: What You Need to Know",
    slug: "lastpass-admits-to-severe-data-breach",
    status: "Published",
    visibility: "Public",
    publishOn: "Dec. 23, 2022",
    createdAt: "Dec. 23, 2022, 12:05 p.m.",
    updatedAt: "May 9, 2026, 4:52 p.m.",
    url: "/blog/lastpass-breach",
    author: "security_expert",
    categories: ["News", "Backend"],
    tags: ["security", "lastpass", "breach"],
    videoUrl: "",
    excerpt:
      "LastPass recently disclosed a security incident involving customer vault data.",
    seo: {
      blogTitle: "LastPass Data Breach Information 2022",
      metaKeywords: "security, passwords, lastpass",
      metaDescription:
        "Essential steps to take if your data was compromised in the LastPass breach.",
    },
    content: `
      Security is a top priority for any digital service. Recently, LastPass reported a breach.
      Hackers gained access to some customer information including encrypted vaults.
      
      We recommend all users update their master passwords and enable Multi-Factor Authentication.
    `,
  },
  {
    id: 5,
    title: "Microsoft Details Gatekeeper Bypass and Security Vulnerabilities",
    slug: "microsoft-details-gatekeeper-bypass",
    status: "Published",
    visibility: "Public",
    publishOn: "Oct. 11, 2022",
    createdAt: "Dec. 23, 2022, 12:16 p.m.",
    updatedAt: "May 10, 2026, 3:42 a.m.",
    url: "/blog/microsoft-gatekeeper",
    author: "w3@manager",
    categories: ["Backend", "News"],
    tags: ["microsoft", "security", "bypass"],
    videoUrl: "",
    excerpt: "New details emerge on how macOS Gatekeeper could be bypassed.",
    seo: {
      blogTitle: "Microsoft Security Report: Gatekeeper Bypass",
      metaKeywords: "admin@example.com",
      metaDescription:
        "A technical breakdown of the Gatekeeper vulnerability found by Microsoft researchers.",
    },
    content: `
      Microsoft researchers recently uncovered a flaw in macOS. This flaw allowed apps to run without proper notarization.
      The issue has since been patched, but it highlights the importance of system-level security layers.
    `,
  },
  {
    id: 6,
    title: "WHY YOU SHOULD START PRACTICING CLEAN CODE TODAY",
    slug: "why-you-should-start-practicing-clean-code",
    status: "Published",
    visibility: "Public",
    publishOn: "Oct. 5, 2022",
    createdAt: "Dec. 23, 2022, 12:21 p.m.",
    updatedAt: "May 11, 2026, 7:44 a.m.",
    url: "/blog/practice-coding",
    author: "clean_coder",
    categories: ["Frontend", "Backend", "Design"],
    tags: ["coding", "best-practices", "clean-code"],
    videoUrl: "https://www.youtube.com/embed/example2",
    excerpt:
      "Writing code is easy, writing code that others can read is the real challenge.",
    seo: {
      blogTitle: "Mastering Clean Code Principles",
      metaKeywords: "programming, clean code, architecture",
      metaDescription:
        "Learn why clean code is the foundation of every successful software project.",
    },
    content: `
      Clean code is not just about aesthetics. it is about maintainability.
      When you write clean code, you are being kind to your future self and your teammates.
      
      Follow principles like DRY (Don't Repeat Yourself) and SOLID to keep your codebase healthy.
    `,
  },
  {
    id: 7,
    title: "Setting up a Scalable Management Information System",
    slug: "setting-up-scalable-mis",
    status: "Published",
    visibility: "Public",
    publishOn: "Sept. 14, 2024",
    createdAt: "Sept. 14, 2024, 11:35 p.m.",
    updatedAt: "May 8, 2026, 9:16 p.m.",
    url: "/blog/test-post",
    author: "w3@manager",
    categories: ["Backend", "News"],
    tags: ["MIS", "Dashboard", "System"],
    videoUrl: "",
    excerpt:
      "A deep dive into building systems that grow with your organization.",
    seo: {
      blogTitle: "Building Scalable MIS with React",
      metaKeywords: "MIS, software engineering, scaling",
      metaDescription:
        "Step-by-step guide to setting up a Management Information System.",
    },
    content: `
      Management Information Systems (MIS) are the backbone of modern organizations.
      This post covers the architecture needed to handle high data loads while maintaining performance.
    `,
  },
];
