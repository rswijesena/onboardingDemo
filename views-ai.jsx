// views-ai.jsx — Ask Northwind AI (full chat surface)

function AskAIView({ persona, seed, clearSeed }) {
  const [active, setActive] = React.useState('new');
  const [messages, setMessages] = React.useState([]);
  const [draft, setDraft] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const feedRef = React.useRef(null);

  // When user clicks a suggestion from elsewhere, seed the chat
  React.useEffect(() => {
    if (seed) {
      handleSend(seed);
      clearSeed && clearSeed();
    }
    // eslint-disable-next-line
  }, [seed]);

  React.useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [messages, thinking]);

  function loadConv(c) {
    setActive(c.id);
    setMessages(c.messages);
  }

  function newConv() {
    setActive('new');
    setMessages([]);
  }

  function handleSend(text) {
    const value = (text ?? draft).trim();
    if (!value) return;
    const next = [...messages, { who: 'user', text: value }];
    setMessages(next);
    setDraft('');
    setThinking(true);
    setActive('new');

    // Fake AI: pull a canned answer if it matches, else use claude
    const cannedKey = Object.keys(CANNED).find(k => value.toLowerCase().includes(k));
    if (cannedKey) {
      setTimeout(() => {
        setMessages([...next, CANNED[cannedKey]]);
        setThinking(false);
      }, 850);
      return;
    }

    // Use Claude
    (async () => {
      try {
        const reply = await window.claude.complete(
          `You are Northwind AI, an onboarding assistant for new hire ${persona.name}, a ${persona.title} on the ${persona.team} team, who started May 11, 2026. ` +
          `Their manager is ${persona.manager}, their onboarding buddy is ${persona.buddy}. ` +
          `Northwind Labs is a fictional enterprise SaaS company. Be concise, warm, and direct. ` +
          `Format your reply in 2-4 short sentences or a short bulleted list. Reference Northwind policies plausibly. ` +
          `Question: ${value}`
        );
        setMessages([...next, { who: 'ai', text: reply }]);
      } catch (e) {
        setMessages([...next, { who: 'ai', text: 'Sorry, I had trouble answering that — try rephrasing or check the Employee Handbook.' }]);
      } finally {
        setThinking(false);
      }
    })();
  }

  const showWelcome = messages.length === 0 && !thinking;
  const currentTitle = active === 'new'
    ? 'New conversation'
    : AI_CONVERSATIONS.find(c => c.id === active)?.title;

  return (
    <>
      <PageHeader
        title="Ask Northwind AI"
        sub="Policies, people, processes — anything you'd ask a helpful coworker."
      />

      <div className="chat-shell">
        <aside className="chat-aside">
          <Button variant="ai" icon="Plus" onClick={newConv} style={{ marginBottom: 8 }}>New conversation</Button>
          <h4>Recent</h4>
          {AI_CONVERSATIONS.map(c => (
            <button key={c.id}
              className={`conv ${active === c.id ? 'active' : ''}`}
              onClick={() => loadConv(c)}
            >
              {c.title}
              <small>{c.when}</small>
            </button>
          ))}
        </aside>

        <div className="chat-main">
          <div className="chat-head">
            <div className="glyph"><Icon name="Ai" /></div>
            <div className="title">
              {currentTitle}
              <small>Northwind AI · grounded in your handbook, team docs, and calendar</small>
            </div>
          </div>

          <div className="chat-feed" ref={feedRef}>
            {showWelcome && <WelcomePanel persona={persona} onAsk={handleSend} />}
            {messages.map((m, i) => (
              <ChatMessage key={i} m={m} persona={persona} />
            ))}
            {thinking && <ThinkingBubble />}
          </div>

          {messages.length > 0 && (
            <div className="chat-suggestions">
              <span className="chip" onClick={() => handleSend('Summarize this')}>Summarize this</span>
              <span className="chip" onClick={() => handleSend('What should I do next?')}>What should I do next?</span>
              <span className="chip" onClick={() => handleSend('Who else should I ask about this?')}>Who else can help?</span>
            </div>
          )}

          <form className="chat-composer" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <textarea
              placeholder="Ask anything about onboarding, policies, or your team…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
            />
            <button type="submit" className="send" title="Send">
              <Icon name="Send" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

function ChatMessage({ m, persona }) {
  const isUser = m.who === 'user';
  return (
    <div className={`chat-msg ${isUser ? 'user' : 'ai'}`}>
      <div className="who" style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
        {!isUser && <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--exo-color-surface-ai-action)', display: 'inline-grid', placeItems: 'center' }}>
          <Icon name="Ai" size={10} invert />
        </span>}
        {isUser ? `${persona.firstName} · you` : 'Northwind AI'}
      </div>
      <div className="bubble">
        <Markdown text={m.text} />
        {m.list && (
          <ul>
            {m.list.map((li, i) => <li key={i}><Markdown text={li} inline /></li>)}
          </ul>
        )}
        {m.citations && (
          <div className="citations">
            {m.citations.map((c, i) => (
              <span key={i} className="citation">
                <Icon name="Bookmark" size={10} />
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Markdown({ text, inline = false }) {
  // Very light markdown — just **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  const rendered = parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
  if (inline) return <>{rendered}</>;
  // Wrap in <p> if not already
  return <p>{rendered}</p>;
}

function ThinkingBubble() {
  return (
    <div className="chat-msg ai">
      <div className="who" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--exo-color-surface-ai-action)', display: 'inline-grid', placeItems: 'center' }}>
          <Icon name="Ai" size={10} invert />
        </span>
        Northwind AI
      </div>
      <div className="bubble" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <Dot delay={0} /><Dot delay={150} /><Dot delay={300} />
      </div>
    </div>
  );
}

function Dot({ delay }) {
  return (
    <>
      <style>{`@keyframes ai-dot{0%,80%,100%{opacity:.2;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}`}</style>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: 'var(--exo-color-surface-ai-action)',
        animation: `ai-dot 1.2s ${delay}ms infinite ease-in-out`,
      }}></span>
    </>
  );
}

function WelcomePanel({ persona, onAsk }) {
  const sections = [
    { title: 'Policies & benefits', prompts: [
      'How does PTO work here?',
      'What’s included in our health benefits?',
      'When are paychecks issued?',
    ]},
    { title: 'My team & calendar', prompts: [
      'Who should I meet this week?',
      'What’s on my calendar today?',
      'When is my next 1:1 with Priya?',
    ]},
    { title: 'Getting set up', prompts: [
      'How do I install the dev environment?',
      'Where do I find the Platform Foundations runbook?',
      'What’s our security training requirement?',
    ]},
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--exo-color-surface-ai-action)', display: 'grid', placeItems: 'center' }}>
          <Icon name="Ai" size={26} invert />
        </div>
        <div>
          <h2 style={{ font: '300 22px var(--exo-font-brand)', margin: 0, color: 'var(--exo-color-font)' }}>
            Hi {persona.firstName} — what would you like to know?
          </h2>
          <div style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)' }}>
            I can answer questions grounded in your handbook, team docs, calendar, and Slack.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
        {sections.map((s, i) => (
          <div key={i} style={{
            border: '1px solid var(--exo-palette-periwinkle-20)',
            background: 'var(--exo-palette-periwinkle-10)',
            borderRadius: 10, padding: '14px 16px',
          }}>
            <div style={{ font: '700 11px var(--exo-font-family)', textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--exo-palette-periwinkle-70)', marginBottom: 10 }}>
              {s.title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {s.prompts.map((p, j) => (
                <button key={j} onClick={() => onAsk(p)} style={{
                  textAlign: 'left',
                  background: 'rgba(255,255,255,.7)',
                  border: '1px solid transparent',
                  borderRadius: 6,
                  padding: '8px 10px',
                  font: '13px var(--exo-font-family)',
                  color: 'var(--exo-color-font)',
                  cursor: 'pointer',
                }}>{p}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Fast-path canned answers so the chat feels alive without waiting on Claude
const CANNED = {
  'pto': {
    who: 'ai',
    text: 'Northwind uses **flexible PTO** — no accrual cap, no countdown. You request time off in Workday and it routes to Priya for approval. A few specifics:',
    list: [
      'No formal minimum, but People Ops encourages at least **15 days per year**.',
      'Sick days are separate and unlimited.',
      'Company-wide shutdowns: the week of July 4 and Dec 22 – Jan 1.',
      'You can take time during your first 90 days — give Priya 2 weeks’ notice when possible.',
    ],
    citations: ['Employee Handbook §4.2', 'People Ops · PTO FAQ'],
  },
  'pfr': {
    who: 'ai',
    text: '**PFR** = *Platform Foundations Review*. It’s the weekly Friday meeting (11am ET) where Foundations walks through what shipped, what’s blocked, and what’s next. As a new PM you don’t need to present — but it’s the fastest way to see how the org actually works.',
    citations: ['Confluence · PFR runbook'],
  },
  'calendar': {
    who: 'ai',
    text: 'Here’s what’s on your calendar this week:',
    list: [
      'Tue · 10:00 — Security training (Module 3)',
      'Wed · 14:00 — Weekly 1:1 with Priya',
      'Thu · 16:00 — Buddy check-in with Diego',
      'Fri · 11:00 — Platform Foundations Review (PFR)',
    ],
    citations: ['Google Calendar'],
  },
  'draft': {
    who: 'ai',
    text: 'Here’s a draft for #platform-foundations — tweak the personality bits:',
    list: [
      'Hi team 👋 — I’m Alex, joining as a senior PM. Coming from a connectors background. Excited to dig in with you all. Will reach out for 1:1 intros over the next two weeks. Until then — happy to chat about books, climbing, or terrible product metaphors.',
    ],
    citations: ['Northwind voice guide'],
  },
};

Object.assign(window, { AskAIView });
