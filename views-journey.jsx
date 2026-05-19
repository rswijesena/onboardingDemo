// views-journey.jsx — My journey: timeline / roadmap / checklist views

function JourneyView({ persona, tasks, metaphor, setMetaphor, onToggleTask }) {
  return (
    <>
      <PageHeader
        title="My journey"
        sub={`Your first 90 days at Northwind. Currently in your first week — Day ${persona.dayOf90} of 90.`}
        actions={
          <Segmented
            value={metaphor}
            onChange={setMetaphor}
            options={[
              { value: 'timeline', label: 'Timeline' },
              { value: 'roadmap',  label: 'Roadmap'  },
              { value: 'checklist', label: 'Checklist' },
            ]}
          />
        }
      />
      {metaphor === 'timeline'  && <TimelineView persona={persona} tasks={tasks} onToggleTask={onToggleTask} />}
      {metaphor === 'roadmap'   && <RoadmapView  persona={persona} tasks={tasks} onToggleTask={onToggleTask} />}
      {metaphor === 'checklist' && <ChecklistView persona={persona} tasks={tasks} onToggleTask={onToggleTask} />}
    </>
  );
}

// ─── Timeline (horizontal track) ───────────────────────────────────────────
function TimelineView({ persona, tasks, onToggleTask }) {
  const [focusedStage, setFocusedStage] = React.useState('week1');
  // each stage is positioned along a fictitious 0..1 axis
  // pre=0, day1=0.13, week1=0.27, d30=0.45, d60=0.7, d90=0.93
  const positions = { pre: 4, day1: 16, week1: 30, d30: 50, d60: 73, d90: 94 };
  // current position based on day count
  const nowPct = (() => {
    if (persona.dayOf90 <= 0) return positions.pre;
    if (persona.dayOf90 === 1) return positions.day1;
    if (persona.dayOf90 <= 7) return positions.week1;
    if (persona.dayOf90 <= 30) return positions.d30;
    if (persona.dayOf90 <= 60) return positions.d60;
    return positions.d90;
  })();

  const stageProgress = (stageId) => {
    const list = tasks.filter(t => t.stage === stageId);
    const done = list.filter(t => t.status === 'done').length;
    return { done, total: list.length, pct: list.length ? Math.round(done/list.length*100) : 0 };
  };

  const focusedTasks = tasks.filter(t => t.stage === focusedStage);
  const focusedStageMeta = STAGES.find(s => s.id === focusedStage);

  return (
    <div className="timeline">
      <div className="timeline-track">
        <div className="fill" style={{ width: `${nowPct}%` }}></div>
        <div className="timeline-now" style={{ left: `${nowPct}%` }}>You are here · Day {persona.dayOf90}</div>
        {STAGES.map(s => {
          const sp = stageProgress(s.id);
          const isDone = sp.done === sp.total;
          const isCurrent = persona.dayOf90 >= s.dayStart && persona.dayOf90 <= s.dayEnd;
          const klass = `timeline-stop ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`;
          return (
            <div
              key={s.id}
              className={klass}
              style={{ left: `${positions[s.id]}%` }}
              onClick={() => setFocusedStage(s.id)}
            >
              <div className="node"></div>
              <div className="lbl">{s.label}</div>
              <div className="when">{s.range}</div>
            </div>
          );
        })}
      </div>

      <div className="timeline-details">
        <div className="row space" style={{ marginBottom: 16, marginTop: 32 }}>
          <div>
            <div style={{ font: '600 11px var(--exo-font-family)', textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--exo-palette-coral-60)', marginBottom: 4 }}>
              {focusedStageMeta.label} · {focusedStageMeta.range}
            </div>
            <h3 style={{ font: '300 22px var(--exo-font-brand)', margin: 0, color: 'var(--exo-color-font)' }}>
              {stageBlurb(focusedStage)}
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ font: '700 28px/1 var(--exo-font-family)', color: 'var(--exo-palette-brand)' }}>
              {stageProgress(focusedStage).done}<span style={{ font: '400 14px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)' }}> / {stageProgress(focusedStage).total}</span>
            </div>
            <div style={{ font: '12px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)', marginTop: 2 }}>
              tasks complete
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {focusedTasks.map(t => (
            <TaskCard key={t.id} task={t} onToggle={() => onToggleTask(t.id)} compact />
          ))}
        </div>
      </div>
    </div>
  );
}

function stageBlurb(stageId) {
  return {
    pre:   'Get the paperwork out of the way before you start',
    day1:  'Show up, get set up, meet the people you’ll work with',
    week1: 'Settle in. Finish foundational training and team intros',
    d30:   'Find your footing and own your first small thing',
    d60:   'Go deeper — lead, write, and ship',
    d90:   'Close out ramp-up, set your H2 plan',
  }[stageId];
}

// Generic task card for roadmap + timeline
function TaskCard({ task, onToggle, compact = false }) {
  const cat = CATEGORIES[task.cat];
  const cls = `roadmap-card ${task.status === 'done' ? 'done' : ''}`;
  return (
    <div className={cls} onClick={onToggle}>
      <input
        type="checkbox"
        className="checkbox"
        checked={task.status === 'done'}
        onChange={(e) => { e.stopPropagation(); onToggle(); }}
        onClick={(e) => e.stopPropagation()}
      />
      <div className="body-text">
        <div className="title">{task.title}</div>
        {!compact && <div className="desc">{task.desc}</div>}
        <div className="meta">
          <Badge tone={cat.tone} dot>{cat.label}</Badge>
          <span className="sep" style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--exo-palette-gray-40)' }}></span>
          <span>Due {task.due}</span>
          {task.est !== 'varies' && (
            <>
              <span className="sep" style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--exo-palette-gray-40)' }}></span>
              <span>{task.est}</span>
            </>
          )}
          {task.status === 'progress' && <Badge tone="info" dot>In progress</Badge>}
        </div>
      </div>
    </div>
  );
}

// ─── Roadmap (vertical stages) ─────────────────────────────────────────────
function RoadmapView({ persona, tasks, onToggleTask }) {
  return (
    <div className="roadmap">
      {STAGES.map(s => {
        const list = tasks.filter(t => t.stage === s.id);
        const done = list.filter(t => t.status === 'done').length;
        const pct = list.length ? Math.round(done/list.length*100) : 0;
        const locked = persona.dayOf90 < s.dayStart - 5; // future stages with low visibility
        const isCurrent = persona.dayOf90 >= s.dayStart && persona.dayOf90 <= s.dayEnd;
        return (
          <div key={s.id} className={`roadmap-stage ${locked ? 'locked' : ''}`}>
            <div className="marker">
              <div className="day">{s.range}</div>
              <div className="title">{s.label}</div>
              <div className="sub">{stageBlurb(s.id)}</div>
              <div className="status-line">
                <span className="bar"><div style={{ width: `${pct}%` }}></div></span>
                <span style={{ color: 'var(--exo-palette-gray-60)' }}>
                  {done} of {list.length}
                </span>
                {isCurrent && <Badge tone="coral" dot>Current</Badge>}
              </div>
            </div>
            <div className="body">
              {list.map(t => <TaskCard key={t.id} task={t} onToggle={() => onToggleTask(t.id)} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Checklist (grouped by category) ───────────────────────────────────────
function ChecklistView({ persona, tasks, onToggleTask }) {
  // Group by category
  const groups = Object.entries(CATEGORIES).map(([key, meta]) => {
    const list = tasks.filter(t => t.cat === key);
    return { key, meta, list };
  }).filter(g => g.list.length > 0);

  return (
    <div className="card" style={{ padding: '24px 28px' }}>
      {groups.map(g => {
        const done = g.list.filter(t => t.status === 'done').length;
        return (
          <div key={g.key} className="checklist-group">
            <h3>
              <Badge tone={g.meta.tone} dot>{g.meta.label}</Badge>
              <span className="count">{done} / {g.list.length}</span>
            </h3>
            <div>
              {g.list.map(t => (
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
                      <span>{STAGES.find(s => s.id === t.stage).label}</span>
                      <span className="sep"></span>
                      <span>Due {t.due}</span>
                      <span className="sep"></span>
                      <span>{t.est}</span>
                      {t.status === 'progress' && <Badge tone="info" dot>In progress</Badge>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { JourneyView, TaskCard });
