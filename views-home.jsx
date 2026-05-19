// views-home.jsx — Home / Overview dashboard

function statusIconFor(status) {
  if (status === 'done')     return { name: 'Success',    tone: 'success' };
  if (status === 'progress') return { name: 'InProgress', tone: 'info'    };
  if (status === 'blocked')  return { name: 'Warning',    tone: 'warning' };
  return { name: 'Check', tone: 'neutral' };
}

function HomeView({ persona, tasks, completion, onNavigate, onToggleTask, aiEnabled, onAskAI }) {
  // Today/this week tasks: anything not done, sorted by stage
  const stageOrder = ['day1','week1','d30','d60','d90'];
  const upcoming = tasks
    .filter(t => t.status !== 'done')
    .slice(0, 4);

  const stageCounts = STAGES.map(s => {
    const list = tasks.filter(t => t.stage === s.id);
    const done = list.filter(t => t.status === 'done').length;
    return { ...s, done, total: list.length };
  });

  const greetingHour = 9; // morning copy
  const greeting = 'Good morning';

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div>
          <div className="greet">{greeting} · Day {persona.dayOf90} of 90</div>
          <h2>Welcome, <strong>{persona.firstName}</strong>.<br/>You’re settling in.</h2>
          <p className="tagline">
            You’ve completed your first week essentials. This week, finish security training and meet the rest of your immediate team.
          </p>
          <div className="actions">
            <Button variant="primary" icon="Rocket" onClick={() => onNavigate('journey')}>Continue your journey</Button>
            <Button variant="secondary" icon="Calendar" onClick={() => onNavigate('tasks')}>See this week’s plan</Button>
          </div>
        </div>
        <div className="hero-progress">
          <ProgressRing value={completion} size={160} stroke={12} color="#ff7c66" track="rgba(255,255,255,.18)" label="Complete" />
        </div>
      </section>

      {/* Stats strip */}
      <div className="grid grid-3" style={{ marginBottom: 20 }}>
        <div className="stat-tile">
          <div className="label">This week</div>
          <div className="value"><strong>4</strong><span style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)', marginLeft: 8 }}>tasks open</span></div>
          <div className="sub">2 in progress · 2 not started</div>
        </div>
        <div className="stat-tile">
          <div className="label">Next milestone</div>
          <div className="value"><strong>30</strong><span style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)', marginLeft: 8 }}>days</span></div>
          <div className="sub">June 10 · 30-day check-in with Priya</div>
        </div>
        <div className="stat-tile">
          <div className="label">People to meet</div>
          <div className="value"><strong>2</strong><span style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)', marginLeft: 8 }}>of 5 left</span></div>
          <div className="sub">Yuki (Thu) · Hadi (not booked)</div>
        </div>
      </div>

      {/* Main columns */}
      <div className="grid grid-asym">
        <div className="grid" style={{ gap: 20 }}>
          {/* Today */}
          <div className="card">
            <div className="card-head">
              <h2 className="card-title">This week · {persona.dayOf90 < 8 ? 'first week' : 'in flight'}</h2>
              <a className="card-link" onClick={() => onNavigate('tasks')}>
                See all tasks <Icon name="RightCaret" size={14} />
              </a>
            </div>
            {upcoming.map(t => (
              <div key={t.id} className={`task-row ${t.status === 'done' ? 'done' : ''}`} onClick={() => onToggleTask(t.id)}>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={t.status === 'done'}
                  onChange={(e) => { e.stopPropagation(); onToggleTask(t.id); }}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="body">
                  <div className="title">{t.title}</div>
                  <div className="meta">
                    <Badge tone={CATEGORIES[t.cat].tone} dot>{CATEGORIES[t.cat].label}</Badge>
                    <span>Due {t.due}</span>
                    <span className="sep"></span>
                    <span>{t.est}</span>
                    {t.status === 'progress' && <Badge tone="info" dot>In progress</Badge>}
                  </div>
                </div>
                <Icon name="RightCaret" size={16} style={{ opacity: .4, marginTop: 6 }} />
              </div>
            ))}
          </div>

          {/* 30/60/90 strip */}
          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Your 30 · 60 · 90 plan</h2>
              <a className="card-link" onClick={() => onNavigate('journey')}>
                Open journey <Icon name="RightCaret" size={14} />
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
              {stageCounts.map((s, i) => {
                const pct = s.total ? Math.round(s.done / s.total * 100) : 0;
                const current = persona.dayOf90 >= s.dayStart && persona.dayOf90 <= s.dayEnd;
                const past = persona.dayOf90 > s.dayEnd;
                return (
                  <div key={s.id} style={{
                    padding: 12,
                    borderRadius: 8,
                    background: current ? 'var(--exo-palette-coral-10)' : 'var(--exo-palette-gray-10)',
                    border: current ? '1px solid var(--exo-palette-coral-40)' : '1px solid transparent',
                  }}>
                    <div style={{ font: '700 10px var(--exo-font-family)', textTransform: 'uppercase', letterSpacing: '.08em', color: current ? 'var(--exo-palette-coral-70)' : 'var(--exo-palette-gray-60)' }}>
                      {s.label}
                    </div>
                    <div style={{ font: '300 24px/1.1 var(--exo-font-brand)', color: current || past ? 'var(--exo-palette-brand)' : 'var(--exo-palette-gray-40)', marginTop: 4 }}>
                      {s.done}<span style={{ font: '400 13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)' }}>/{s.total}</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--exo-palette-gray-20)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: current ? 'var(--exo-palette-coral-50)' : 'var(--exo-palette-green-60)', borderRadius: 2 }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="grid" style={{ gap: 20 }}>
          {aiEnabled && (
            <div className="ai-card">
              <div className="ai-header">
                <div className="ai-glyph"><Icon name="Ai" /></div>
                <div className="ai-name">Northwind AI<small>Your onboarding co-pilot</small></div>
              </div>
              <p style={{ font: '13px/1.5 var(--exo-font-family)', color: 'var(--exo-palette-gray-70)', margin: '0 0 12px' }}>
                Ask anything — policy, people, where to find things.
              </p>
              <div className="prompt-suggestions">
                {AI_PROMPTS.map((p, i) => (
                  <button key={i} className="prompt" onClick={() => onAskAI(p.text)}>
                    <Icon name={p.icon} size={14} style={{ opacity: .6 }} />
                    {p.text}
                    <Icon name="RightCaret" size={12} style={{ opacity: .6 }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Manager + buddy */}
          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Your people</h2>
              <a className="card-link" onClick={() => onNavigate('team')}>
                See team <Icon name="RightCaret" size={14} />
              </a>
            </div>
            <div className="person" style={{ paddingBottom: 14, borderBottom: '1px solid var(--exo-color-border-secondary)' }}>
              <Avatar person={TEAM.manager} size="lg" />
              <div className="info">
                <div className="name">{TEAM.manager.name}</div>
                <div className="role">Manager · {TEAM.manager.role}</div>
                <div className="meta" style={{ font: '12px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)', marginTop: 8 }}>
                  <Icon name="Calendar" size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {TEAM.manager.next}
                </div>
              </div>
            </div>
            <div className="person" style={{ paddingTop: 14 }}>
              <Avatar person={TEAM.buddy} size="lg" />
              <div className="info">
                <div className="name">{TEAM.buddy.name}</div>
                <div className="role">Onboarding buddy · {TEAM.buddy.role}</div>
                <div className="meta" style={{ font: '12px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)', marginTop: 8 }}>
                  <Icon name="Calendar" size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  {TEAM.buddy.next}
                </div>
              </div>
            </div>
          </div>

          {/* Pending docs */}
          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Needs your signature</h2>
              <a className="card-link" onClick={() => onNavigate('documents')}>
                All docs <Icon name="RightCaret" size={14} />
              </a>
            </div>
            {DOCUMENTS.filter(d => d.status === 'pending' || d.status === 'in_progress').slice(0, 3).map(d => (
              <div key={d.id} className="task-row" style={{ padding: '10px 0' }}>
                <div className="doc-icon" style={{ width: 32, height: 38, fontSize: 8 }}>{d.ext}</div>
                <div className="body">
                  <div className="title" style={{ fontSize: 13 }}>{d.name}</div>
                  <div className="meta" style={{ fontSize: 12 }}>
                    {d.status === 'pending' && <Badge tone="warning" dot>Awaiting signature</Badge>}
                    {d.status === 'in_progress' && <Badge tone="info" dot>In progress</Badge>}
                  </div>
                </div>
                <button className="btn btn-secondary btn-sm">{d.action}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { HomeView });
