// data.jsx — sample content for the new-hire portal

const PERSONAS = {
  alex: {
    id: 'alex',
    name: 'Alex Chen',
    firstName: 'Alex',
    pronouns: 'they/them',
    title: 'Senior Product Manager, Platform',
    team: 'Platform Foundations',
    startDate: 'May 11, 2026',
    dayOf90: 7,
    initials: 'AC',
    color: '#ff7c66',
    manager: 'Priya Ramanathan',
    buddy: 'Diego Velasco',
    email: 'alex.chen@northwindlabs.com',
    location: 'Boston, MA',
  },
  jordan: {
    id: 'jordan',
    name: 'Jordan Park',
    firstName: 'Jordan',
    pronouns: 'she/her',
    title: 'Software Engineer II, Runtime',
    team: 'Runtime Infrastructure',
    startDate: 'May 11, 2026',
    dayOf90: 7,
    initials: 'JP',
    color: '#4b4fe2',
    manager: 'Karim Najjar',
    buddy: 'Sara Okonkwo',
    email: 'jordan.park@northwindlabs.com',
    location: 'Remote · PST',
  },
  sam: {
    id: 'sam',
    name: 'Sam Rivera',
    firstName: 'Sam',
    pronouns: 'he/him',
    title: 'Account Executive, West',
    team: 'Enterprise Sales',
    startDate: 'May 11, 2026',
    dayOf90: 7,
    initials: 'SR',
    color: '#0ec38b',
    manager: 'Tomás Pereira',
    buddy: 'Lina Holm',
    email: 'sam.rivera@northwindlabs.com',
    location: 'San Francisco, CA',
  },
};

// Stages map roughly to a 90-day onboarding journey
const STAGES = [
  { id: 'pre',     label: 'Pre-boarding',    range: 'Before Day 1', dayStart: -7, dayEnd: 0 },
  { id: 'day1',    label: 'Day 1',           range: 'May 11',       dayStart: 1,  dayEnd: 1 },
  { id: 'week1',   label: 'First week',      range: 'May 11 – 15',  dayStart: 2,  dayEnd: 7 },
  { id: 'd30',     label: '30 days',         range: 'By June 10',   dayStart: 8,  dayEnd: 30 },
  { id: 'd60',     label: '60 days',         range: 'By July 10',   dayStart: 31, dayEnd: 60 },
  { id: 'd90',     label: '90 days',         range: 'By August 9',  dayStart: 61, dayEnd: 90 },
];

const CATEGORIES = {
  paperwork:   { label: 'Paperwork',     tone: 'neutral' },
  it:          { label: 'IT & equipment', tone: 'info' },
  compliance:  { label: 'Compliance',    tone: 'warning' },
  team:        { label: 'Team & buddy',  tone: 'coral' },
  training:    { label: 'Training',      tone: 'info' },
  manager:     { label: 'Manager 1:1',   tone: 'success' },
  product:     { label: 'Product',       tone: 'ai' },
};

// 26 tasks across the 6 stages — enough to feel real
const TASKS = [
  // Pre-boarding (all done)
  { id: 't01', stage: 'pre',   cat: 'paperwork', title: 'Sign offer letter & NDA',                  due: 'Apr 28', est: '10 min', status: 'done',     desc: 'DocuSign packet — countersigned by People Ops.' },
  { id: 't02', stage: 'pre',   cat: 'paperwork', title: 'Complete I-9 employment verification',     due: 'May 4',  est: '15 min', status: 'done',     desc: 'Bring two forms of ID — physical inspection on Day 1.' },
  { id: 't03', stage: 'pre',   cat: 'paperwork', title: 'Set up direct deposit & tax forms',        due: 'May 6',  est: '12 min', status: 'done',     desc: 'W-4 + state tax + bank routing in Workday.' },
  { id: 't04', stage: 'pre',   cat: 'it',        title: 'Confirm equipment shipping address',       due: 'May 4',  est: '2 min',  status: 'done',     desc: 'M3 Max MacBook Pro 16″, Studio Display, peripherals kit.' },
  { id: 't05', stage: 'pre',   cat: 'it',        title: 'Choose laptop & accessory preferences',    due: 'May 5',  est: '5 min',  status: 'done',     desc: 'Selected MacBook Pro 16″ · 36GB · external keyboard.' },

  // Day 1 (mix done / in progress)
  { id: 't06', stage: 'day1',  cat: 'it',        title: 'Activate your @northwindlabs.com account', due: 'May 11', est: '10 min', status: 'done',     desc: 'Set password, enable SSO, register MFA device.' },
  { id: 't07', stage: 'day1',  cat: 'team',      title: 'Welcome session with People Ops',         due: 'May 11', est: '45 min', status: 'done',     desc: 'Recorded session covering benefits, holidays, ERGs.' },
  { id: 't08', stage: 'day1',  cat: 'manager',   title: 'First 1:1 with Priya (manager)',          due: 'May 11', est: '60 min', status: 'done',     desc: 'Intro, working style, expectations for the first 30 days.' },
  { id: 't09', stage: 'day1',  cat: 'team',      title: 'Coffee with Diego (your onboarding buddy)', due: 'May 11', est: '30 min', status: 'done',   desc: 'Diego will be your go-to for the first 30 days.' },
  { id: 't10', stage: 'day1',  cat: 'compliance', title: 'Acknowledge Code of Conduct',            due: 'May 11', est: '15 min', status: 'done',     desc: 'Required reading + electronic acknowledgment.' },

  // First week — some in flight
  { id: 't11', stage: 'week1', cat: 'compliance', title: 'Complete security awareness training',    due: 'May 15', est: '40 min', status: 'progress', desc: 'Phishing, password hygiene, data classification. 60% complete.' },
  { id: 't12', stage: 'week1', cat: 'compliance', title: 'Data privacy & GDPR essentials',         due: 'May 18', est: '25 min', status: 'todo',     desc: 'Required for anyone with customer data access.' },
  { id: 't13', stage: 'week1', cat: 'it',        title: 'Install dev environment & VPN',          due: 'May 13', est: '60 min', status: 'progress', desc: 'Brew bundle, IDE, repos cloned. VPN cert pending.' },
  { id: 't14', stage: 'week1', cat: 'team',      title: 'Meet your immediate team (5 intros)',     due: 'May 16', est: 'varies', status: 'progress', desc: '3 of 5 booked — Maya, Liam, Theo. 2 to schedule.' },
  { id: 't15', stage: 'week1', cat: 'training',  title: 'Platform Foundations onboarding course',  due: 'May 18', est: '3 hrs',  status: 'todo',     desc: 'Self-paced. Quizzes at end of each module.' },
  { id: 't16', stage: 'week1', cat: 'manager',   title: 'Weekly 1:1 (recurring Wed 2pm)',          due: 'May 14', est: '30 min', status: 'todo',     desc: 'On your calendar — recurring through year 1.' },
  { id: 't17', stage: 'week1', cat: 'product',   title: 'Shadow a customer call',                  due: 'May 19', est: '45 min', status: 'todo',     desc: 'Solutions Eng has 2 calls open this week.' },

  // 30 days
  { id: 't18', stage: 'd30',   cat: 'training',  title: 'Pass Platform Foundations certification', due: 'Jun 10', est: '90 min', status: 'todo',     desc: 'Required for PR review access.' },
  { id: 't19', stage: 'd30',   cat: 'team',      title: 'Skip-level intro with Mei Wong (VP)',     due: 'Jun 5',  est: '30 min', status: 'todo',     desc: 'Casual coffee chat — no agenda.' },
  { id: 't20', stage: 'd30',   cat: 'manager',   title: '30-day check-in with Priya',              due: 'Jun 10', est: '60 min', status: 'todo',     desc: 'Reflection on first month + adjust goals.' },
  { id: 't21', stage: 'd30',   cat: 'product',   title: 'Own your first small initiative',         due: 'Jun 10', est: 'varies', status: 'todo',     desc: 'Priya will scope this together with you in Week 3.' },

  // 60 days
  { id: 't22', stage: 'd60',   cat: 'training',  title: 'Cross-team architecture deep-dive',       due: 'Jul 1',  est: '4 hrs',  status: 'todo',     desc: '2 sessions led by Staff Eng — recorded for reference.' },
  { id: 't23', stage: 'd60',   cat: 'manager',   title: '60-day review',                           due: 'Jul 10', est: '60 min', status: 'todo',     desc: 'Mid-point check — formal feedback both directions.' },
  { id: 't24', stage: 'd60',   cat: 'product',   title: 'Lead a customer interview',               due: 'Jul 8',  est: '60 min', status: 'todo',     desc: 'UX Research will pair with you for your first one.' },

  // 90 days
  { id: 't25', stage: 'd90',   cat: 'manager',   title: '90-day review & ramp-up plan close-out',  due: 'Aug 9',  est: '90 min', status: 'todo',     desc: 'Confirm role expectations, set H2 OKRs.' },
  { id: 't26', stage: 'd90',   cat: 'product',   title: 'Present your first PRD to the team',     due: 'Aug 5',  est: '45 min', status: 'todo',     desc: 'Async-first. Live walkthrough at Platform Review.' },
];

const TEAM = {
  manager: {
    initials: 'PR', color: '#4b4fe2',
    name: 'Priya Ramanathan', pronouns: 'she/her',
    role: 'Director of Product, Platform',
    bio: '8 years at Northwind. Was an engineer before moving to product — speaks both languages. Direct, async-first, allergic to status meetings.',
    location: 'Boston, MA',
    next: 'Wed, May 14 · 2:00 pm — Weekly 1:1',
  },
  buddy: {
    initials: 'DV', color: '#ff7c66',
    name: 'Diego Velasco', pronouns: 'he/him',
    role: 'Senior Product Manager, Platform',
    bio: 'Joined 14 months ago, remembers what onboarding feels like. Owns the connector graph initiative. Will be your go-to for "is this normal?" questions.',
    location: 'Mexico City, MX',
    next: 'Thu, May 13 · 4:00 pm — Buddy check-in',
  },
  immediate: [
    { initials: 'MS', color: '#0085f0', name: 'Maya Schwartz',  pronouns: 'she/her', role: 'Staff PM, Connectors',         status: 'met'      },
    { initials: 'LO', color: '#00a972', name: 'Liam O\u2019Donnell', pronouns: 'he/him',  role: 'Senior PM, Workflows',     status: 'met'      },
    { initials: 'TK', color: '#a03291', name: 'Theo Kowalski',  pronouns: 'they/them', role: 'PM II, Identity & Access',  status: 'met'      },
    { initials: 'YR', color: '#ec9932', name: 'Yuki Robinson',  pronouns: 'she/her', role: 'PM II, Observability',         status: 'scheduled' },
    { initials: 'HB', color: '#127b87', name: 'Hadi Boutros',   pronouns: 'he/him',  role: 'PM I, Onboarding Surface',     status: 'todo'      },
  ],
  skipLevel: {
    initials: 'MW', color: '#072b55', name: 'Mei Wong', pronouns: 'she/her',
    role: 'VP of Product',
    bio: 'Joined Northwind from a small data infra startup. Holds office hours every other Friday — open invite.',
  },
};

const DOCUMENTS = [
  { id: 'd1', name: 'Employee Handbook 2026',           ext: 'PDF',  size: '4.2 MB', status: 'read',     stage: 'pre',   action: 'View' },
  { id: 'd2', name: 'Offer Letter & NDA',               ext: 'PDF',  size: '180 KB', status: 'signed',   stage: 'pre',   action: 'Download' },
  { id: 'd3', name: 'I-9 Employment Eligibility',        ext: 'PDF',  size: '92 KB',  status: 'signed',   stage: 'pre',   action: 'Download' },
  { id: 'd4', name: 'W-4 Federal Tax Withholding',      ext: 'PDF',  size: '110 KB', status: 'signed',   stage: 'pre',   action: 'Download' },
  { id: 'd5', name: 'Direct Deposit Authorization',     ext: 'PDF',  size: '76 KB',  status: 'signed',   stage: 'pre',   action: 'Download' },
  { id: 'd6', name: 'Code of Conduct 2026',             ext: 'PDF',  size: '1.1 MB', status: 'ack',      stage: 'day1',  action: 'View' },
  { id: 'd7', name: 'Acceptable Use Policy',            ext: 'PDF',  size: '420 KB', status: 'pending',  stage: 'week1', action: 'Sign' },
  { id: 'd8', name: 'IP Assignment Addendum',           ext: 'PDF',  size: '150 KB', status: 'pending',  stage: 'week1', action: 'Sign' },
  { id: 'd9', name: 'Benefits enrollment elections',    ext: 'PDF',  size: '—',      status: 'in_progress', stage: 'week1', action: 'Continue' },
  { id: 'd10', name: 'Equipment receipt — MacBook Pro', ext: 'PDF',  size: '88 KB',  status: 'signed',   stage: 'day1',  action: 'Download' },
];

const EQUIPMENT = [
  { name: 'MacBook Pro 16″ · M3 Max',         status: 'delivered',  detail: 'Delivered May 9' },
  { name: 'Apple Studio Display',              status: 'delivered',  detail: 'Delivered May 9' },
  { name: 'Magic Keyboard with Touch ID',      status: 'delivered',  detail: 'Delivered May 9' },
  { name: 'Logitech MX Master 3S',             status: 'delivered',  detail: 'Delivered May 9' },
  { name: 'Northwind swag kit',                status: 'in_transit', detail: 'UPS · arrives May 20' },
  { name: 'YubiKey 5C × 2',                    status: 'requested',  detail: 'Ships after Security training' },
];

const ACCESS = [
  { name: 'Okta SSO',                  granted: true,  note: 'Activated May 11' },
  { name: 'GitHub Enterprise',         granted: true,  note: 'Read across all orgs · write to platform-* repos' },
  { name: 'Jira & Confluence',         granted: true,  note: 'Full access to Platform space' },
  { name: 'Slack',                     granted: true,  note: 'Auto-joined 12 channels' },
  { name: 'Looker (analytics)',        granted: false, note: 'Pending — Diego will request after training' },
  { name: 'Production console',        granted: false, note: 'Granted at Day 30 after certification' },
];

// AI chat history — Boomi AI persona is rebranded "Northwind AI" for this kit
const AI_PROMPTS = [
  { icon: 'Calendar',  text: 'What\u2019s on my calendar this week?' },
  { icon: 'Help',      text: 'What does PFR mean?' },
  { icon: 'Chats',     text: 'Draft an intro message to my team' },
  { icon: 'Bookmark',  text: 'How does our PTO policy work?' },
];

const AI_CONVERSATIONS = [
  {
    id: 'c1', title: 'PTO policy basics', when: 'Today · 9:42 am',
    messages: [
      { who: 'user', text: 'How does PTO actually work here? Is there an accrual or do I just take it?' },
      { who: 'ai',   text: 'Northwind uses a **flexible PTO** policy — no accrual cap, no countdown. You request time off in Workday and it routes to Priya for approval. A few specifics:',
        list: ['No formal minimum, but the People team encourages **at least 15 days** per year.', 'Sick days are separate and unlimited.', '**Company-wide shutdowns**: the week of July 4 and Dec 22 – Jan 1.', 'You can take time during your first 90 days — let Priya know with 2 weeks\u2019 notice when possible.'],
        citations: ['Employee Handbook §4.2', 'People Ops · PTO FAQ'] },
    ]
  },
  {
    id: 'c2', title: 'Intro to platform team', when: 'Yesterday',
    messages: [
      { who: 'user', text: 'Can you draft a short intro message I can post in #platform-foundations?' },
      { who: 'ai',   text: 'Here\u2019s a draft — tweak the personality bits to your liking:',
        list: ['Hi team 👋 — I\u2019m Alex, joining Platform Foundations as a senior PM. Coming from a connector & integrations background; spent the last few years at a smaller iPaaS startup before this. Excited to dig into the work Diego, Maya, and Liam have been building. Will be reaching out for 1:1 intros over the next two weeks. Until then — happy to chat about books, climbing, or terrible product management metaphors.'],
        citations: ['Northwind voice guide'] },
    ]
  },
  {
    id: 'c3', title: 'What is PFR?', when: '2 days ago',
    messages: [
      { who: 'user', text: 'What does PFR mean? I keep seeing it in Slack.' },
      { who: 'ai',   text: '**PFR** = *Platform Foundations Review*. It\u2019s the weekly Friday meeting (Fridays 11am ET) where the Foundations group walks through what shipped, what\u2019s blocked, and what\u2019s coming next week. It\u2019s informal — people demo, complain, and ask for help. As a new PM you don\u2019t need to present, but it\u2019s the fastest way to see how the org actually works.',
        citations: ['Confluence · PFR runbook'] },
    ]
  },
];

Object.assign(window, { PERSONAS, STAGES, CATEGORIES, TASKS, TEAM, DOCUMENTS, EQUIPMENT, ACCESS, AI_PROMPTS, AI_CONVERSATIONS });
