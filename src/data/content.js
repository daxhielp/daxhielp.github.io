export const LINKS = {
  github: 'https://github.com/daxhielp',
  linkedin: 'https://www.linkedin.com/in/daxhielp',
  email: 'daxperugorria@gmail.com',
};

export const PAGES = ['home', 'about', 'work', 'thoughts', 'contact'];

// Site-wide text rule: every word is either ALL CAPS or all lowercase.
export const LABELS = {
  home: 'intro',
  about: 'about',
  work: 'work',
  thoughts: 'thoughts',
  contact: 'contact',
};

// Frequency ratio (X : Y) that each page tunes the Lissajous figure to.
export const RATIOS = {
  home: [1, 1],
  about: [1, 2],
  work: [3, 2],
  thoughts: [3, 4],
  contact: [5, 4],
};

// Scope channel color (--c1..--c4) for each page. Home uses the Color! accent.
export const CHANNEL = { about: 1, work: 2, thoughts: 3, contact: 4 };

// Corner placement, in reading order.
export const CORNERS = [
  { key: 'about', pos: 'tl' },
  { key: 'work', pos: 'tr' },
  { key: 'thoughts', pos: 'bl' },
  { key: 'contact', pos: 'br' },
];

// description: array of paragraphs (a plain string also works).
export const PROJECTS = [
  {
    slug: 'qumixer-py',
    title: 'qumixer-py',
    short: 'qumixer-py',
    type: 'audio tooling',
    year: '2026',
    description: [
      'a python library for controlling allen & heath qu-series mixers over their MIDI-over-TCP protocol, built as the base for agentic mixing and training tools.',
      'i implemented the protocol from the vendor\'s published reference, then corrected it against real hardware where the reference was off: a claude agent ran test scripts on the mixer, compared the results with the reference, and wrote a report for a second agent to fix from.',
      'it has matching sync and async APIs, a tiered parameter registry, a fake console emulator with golden-vector fixtures for testing without the mixer, and CLI tools to probe, monitor and record/replay.',
    ],
    tech: ['python', 'asyncio', 'MIDI-over-TCP', 'protocol implementation', 'hardware testing', 'AI agents'],
  },
  {
    slug: 'recommendation-engine',
    title: 'datahack 2026: skip-prediction model',
    short: 'datahack',
    type: 'machine learning',
    year: '2026',
    description: [
      'a team of 4 at datahack 2026, the in-person ML hackathon run by MLDS at UT austin. the task: given sequential listening sessions, predict whether a user skips the next track the recommender serves.',
      'i co-designed the data pipeline and the session tokenization (user attributes, track tokens clustered from audio features, and context like skip history), explored the data, and ran our first baselines, xgboost and then an LSTM.',
      'a teammate built the causal transformer, which reached 87.07% validation accuracy; our submitted transformer + lightgbm ensemble scored 86.50% against an 83.77% starter baseline. we placed 1st of 5 finalist teams on the organizers\' performance score.',
    ],
    tech: ['python', 'lightgbm', 'scikit-learn', 'xgboost', 'LSTM', 'data pipelines', 'tokenization'],
  },
  {
    slug: 'vibedungeon',
    title: 'vibedungeon',
    short: 'vibedungeon',
    type: 'agentic system',
    year: '2026',
    description: [
      'a solo-built python CLI dungeon crawler where the game engine handles the map, combat and items, and an LLM agent layer writes the prose and extends the game as you play.',
      'six specialized agents (narrator, NPC, encounter, ability, enemy flavor, skill check) share one base agent that handles the tool loop, token limits, retries and fallbacks. tool-call arguments are checked against hard numeric ranges and allowlists, and a rejected call goes back to the model as an error so it can correct itself.',
      'i designed every system; most of the code was written with AI tools. provider-agnostic through the openai SDK, running on groq\'s llama-3.3-70b.',
    ],
    tech: ['python', 'rich', 'pydantic', 'openai SDK', 'groq', 'pytest', 'agent design'],
    github: 'https://github.com/daxhielp/vibeDungeon',
  },
  {
    slug: 'voicesense',
    title: 'voicesense',
    short: 'voicesense',
    type: 'machine learning',
    year: '2026',
    description: [
      'a full-stack speech emotion recognition app. record your voice in the browser and get a real-time emotion prediction from a CNN trained on the RAVDESS dataset across 8 emotions.',
      'features a real-time canvas waveform visualizer, an animated probability breakdown, and end-to-end docker deployment on render and vercel.',
    ],
    tech: ['python', 'fastapi', 'react', 'typescript', 'ONNX', 'librosa', 'docker', 'framer motion'],
    github: 'https://github.com/daxhielp/voicesense',
    link: 'https://voicesense-beryl.vercel.app/',
  },
  {
    slug: 'audioprint',
    title: 'audioprint',
    short: 'audioprint',
    type: 'signal processing',
    year: '2026',
    description: [
      'a from-scratch python implementation of the shazam-style audio fingerprinting algorithm. identifies songs from short audio clips using STFT spectrograms, spectral peak extraction, and combinatorial hash matching.',
      'it also has a speed-invariant mode that handles slowed or reverbed audio at 0.5× to 1.25× playback speed.',
    ],
    tech: ['python', 'fastapi', 'react', 'sqlite', 'numpy', 'scipy', 'docker'],
    github: 'https://github.com/daxhielp/audioprint',
  },
  {
    slug: 'kalshi',
    title: 'kalshi arbitrage bot',
    short: 'kalshi bot',
    type: 'fintech',
    year: '2026',
    description: ['a python-based arbitrage engine that integrates with the kalshi API to scan prediction markets and algorithmically detect risk-free "bundle long" and "bundle short" opportunities.'],
    tech: ['python', 'REST', 'market analysis', 'algorithms'],
    github: 'https://github.com/daxhielp/karbot',
  },
  {
    slug: 'fake-news-detector',
    title: 'fake news detector',
    short: 'fake news',
    type: 'machine learning',
    year: '2025',
    description: ['an ML-powered engine that reads and performs sentiment analysis to identify whether a news article is fake or not.'],
    tech: ['python', 'NLP', 'fastapi', 'react', 'ML'],
    github: 'https://github.com/daxhielp/fake-or-not',
    link: 'https://fake-or-not-6rcp.vercel.app/',
  },
  {
    slug: 'kwii',
    title: 'kwii',
    short: 'kwii',
    type: 'programming language design',
    year: '2025',
    description: ['an interpreted programming language built from scratch on top of java with a recursive descent parser, abstract syntax tree evaluator, and runtime environment.'],
    tech: ['java', 'programming languages', 'AST', 'data structures'],
    github: 'https://github.com/daxhielp/kwii-main',
  },
];

export const EXPERIENCE = [
  {
    slug: 'project-advance-austin',
    title: 'project management & data engineering',
    short: 'analytics',
    type: 'experience',
    year: '2026',
    period: 'august 2026 – current',
    org: 'project advance austin',
    description: [
      'data engineering and geospatial analytics for the women\'s storybook project of texas, a nonprofit that connects incarcerated mothers with their children through recorded books, on a 5-person student team.',
      'i\'m migrating the organization\'s fragmented access and excel records into a single consolidated database, deduplicating and normalizing them so the data can be updated year over year instead of rebuilt by hand. on top of it i\'m building a tableau geospatial map of 2025 program data: children by county and state, mothers by prison facility, and the distance between them.',
      'next, we\'re building a react/typescript site with a node.js/express and postgresql backend that embeds the map and links from the nonprofit\'s site.',
    ],
    tech: ['tableau', 'geospatial analytics', 'microsoft access', 'data cleaning', 'database migration', 'react', 'typescript', 'node.js'],
  },
  {
    slug: 'spanish-first-av',
    title: 'subdirector',
    short: 'AV',
    type: 'experience',
    year: '2026',
    period: 'july 2026 – current',
    org: 'austin spanish first AV',
    description: [
      'direct a 10+ member technical team that runs audio and video for 400+ weekly attendees.',
      'redesigned the audio and live-streaming setup, growing online viewership by 50%.',
    ],
    tech: ['live audio', 'live streaming', 'team leadership'],
  },
  {
    slug: 'course-instructor',
    title: 'course instructor',
    short: 'instructor',
    type: 'experience',
    year: '2026',
    period: 'june 2026 – july 2026',
    org: 'code2college',
    description: ['instructed 24+ students over an 18-session curriculum on SDE fundamentals, including python programming, OOP, error handling, and data management, achieving 95% average attendance and 97% average quiz scores.'],
    tech: ['teaching', 'python', 'OOP', 'error handling', 'data management'],
  },
  {
    slug: 'freelance-developer',
    title: 'freelance web developer',
    short: 'freelance',
    type: 'experience',
    year: '2026',
    period: 'february 2026 – may 2026',
    org: 'getfertilizerwiser',
    description: [
      'built a next.js/react site for a nonprofit client, with a token-driven tailwind design system and a reusable component library that keeps 7 client-facing pages visually consistent without a CMS.',
      'structured the client\'s content into typed data models, used formspree for forms and cloudinary for media, and shipped it to production on vercel.',
    ],
    tech: ['next.js', 'react', 'tailwind CSS', 'formspree', 'cloudinary', 'vercel'],
  },
];

// Everything on the Work page: roles and projects share one list and one detail layout.
export const WORK = [
  ...EXPERIENCE.map((e) => ({ ...e, kind: 'role' })),
  ...PROJECTS.map((p) => ({ ...p, kind: 'project' })),
];

// Thoughts: short posts. Add entries here; newest first.
// { slug: 'url-safe-id', title: 'post title', date: '2026-11-11', summary: 'one line for the list.', body: [...] }
// body items: a string = paragraph (supports [text](url) links and `inline code`),
// or { type: 'code', lang: 'js', code: '...' } = code block.
// reminder: every word is ALL CAPS or all lowercase.
export const THOUGHTS = [
  {
    slug: 'hello-world',
    title: 'hi, world.',
    date: '2026-11-11',
    summary: 'about the revamped portfolio...',
    body: [
      'so, new portfolio. the old one did its job, but it was too generic and lacked a characteristic design. i wanted something that looked a little more like me, so i came up with this revamped layout!',
      'the first thing that caught your eye was probably the squiggle in the background. that’s a [lissajous](https://en.wikipedia.org/wiki/Lissajous_curve) figure, the pattern old-school oscilloscopes can draw in xy mode. feed one sine wave to the horizontal axis and another to the vertical, and the beam ends up drawing knots like these.',
      'the shape entirely depends on the relationships between the two waves. if their frequencies match (1:1) you get a plain loop, and other ratios give you more complicated knots.',
      '     ',
      'here’s basically the whole idea:',
      {
        type: 'code',
        lang: 'js',
        code: `const x = Math.sin(a * t + phase);\nconst y = Math.sin(b * t);`,
      },
      'each page has its own ratio: 1:1 at home, 1:2 for about, 3:2 for work, 3:4 for thoughts, and 5:4 for contact. hover over a corner and the scope retunes to that page before you even click. each page also gets its own channel color, the way a real scope colors each input.',
      'it’s also drawn in ASCII instead of a smooth line, because i like it when things look a little lo-fi.',
      'you can also play with it. move your cursor and the beam gets repelled by it. hold the mouse down and it pulls in the beam toward you. click to send out a little shockwave and scroll to zoom. when a page is open, the beam wraps around the card instead of running through it.',
      'if you’re curious about the math, [the wikipedia page](https://en.wikipedia.org/wiki/Lissajous_curve) is a good rabbit hole. otherwise, poke around, hit "color" on the home page a few times, and enjoy. more posts coming soon',
      '...probably'
    ],
  },
];
