// app.jsx — root of the Northwind Onboard portal

const { useState, useEffect, useMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "persona": "alex",
  "metaphor": "roadmap",
  "ai": true,
  "dark": false,
  "density": "regular"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // app routing
  const [route, setRoute] = useState('home');

  // AI seed for cross-view prompt clicks
  const [aiSeed, setAiSeed] = useState(null);

  // Mutable task state — start from data.jsx, persist toggles locally
  const [taskOverrides, setTaskOverrides] = useState({});
  const baseTasks = TASKS;
  const tasks = useMemo(() => baseTasks.map(t0 => {
    const o = taskOverrides[t0.id];
    return o ? { ...t0, status: o } : t0;
  }), [baseTasks, taskOverrides]);

  // Reset task overrides when persona changes (different employees have different progress)
  // For simplicity we keep the same task list across personas.

  const persona = PERSONAS[t.persona] || PERSONAS.alex;
  const completion = useMemo(() => {
    const done = tasks.filter(x => x.status === 'done').length;
    return Math.round(done / tasks.length * 100);
  }, [tasks]);

  const taskCounts = {
    open: tasks.filter(x => x.status !== 'done').length,
    pendingDocs: DOCUMENTS.filter(d => d.status === 'pending' || d.status === 'in_progress').length,
  };

  function toggleTask(id) {
    setTaskOverrides(o => {
      const cur = o[id] ?? tasks.find(t => t.id === id).status;
      const next = cur === 'done' ? 'todo' : 'done';
      return { ...o, [id]: next };
    });
    // Toast
    const t0 = tasks.find(x => x.id === id);
    const willBeDone = (t0.status !== 'done');
    showToast(willBeDone ? `Marked "${t0.title}" done` : `Reopened "${t0.title}"`, willBeDone ? 'Success' : 'InProgress');
  }

  function askAI(prompt) {
    setAiSeed(prompt);
    setRoute('ai');
  }

  const appClass = ['app', t.dark ? 'dark' : '', t.density === 'compact' ? 'compact' : ''].join(' ').trim();

  return (
    <div className={appClass}>
      <TopBar persona={persona} />
      <div className="app-body">
        <SideNav
          active={route}
          onNavigate={setRoute}
          completion={completion}
          taskCounts={taskCounts}
          aiEnabled={t.ai}
        />
        <main className="main">
          <div className="main-inner" data-screen-label={`01 ${routeLabel(route)}`}>
            {route === 'home'      && <HomeView      persona={persona} tasks={tasks} completion={completion} onNavigate={setRoute} onToggleTask={toggleTask} aiEnabled={t.ai} onAskAI={askAI} />}
            {route === 'journey'   && <JourneyView   persona={persona} tasks={tasks} metaphor={t.metaphor} setMetaphor={(v) => setTweak('metaphor', v)} onToggleTask={toggleTask} />}
            {route === 'tasks'     && <TasksView     tasks={tasks} onToggleTask={toggleTask} />}
            {route === 'team'      && <TeamView      onAskAI={askAI} />}
            {route === 'documents' && <DocumentsView />}
            {route === 'equipment' && <EquipmentView />}
            {route === 'ai'        && t.ai && <AskAIView persona={persona} seed={aiSeed} clearSeed={() => setAiSeed(null)} />}
            {route === 'ai'        && !t.ai && <AIDisabled onTurnOn={() => setTweak('ai', true)} />}
          </div>
        </main>
      </div>

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Who's signed in" />
        <TweakSelect
          label="Persona"
          value={t.persona}
          options={[
            { value: 'alex',   label: 'Alex Chen · Senior PM' },
            { value: 'jordan', label: 'Jordan Park · Engineer' },
            { value: 'sam',    label: 'Sam Rivera · Sales AE' },
          ]}
          onChange={(v) => setTweak('persona', v)}
        />

        <TweakSection label="Journey view" />
        <TweakRadio
          label="Default metaphor"
          value={t.metaphor}
          options={['timeline', 'roadmap', 'checklist']}
          onChange={(v) => setTweak('metaphor', v)}
        />

        <TweakSection label="AI buddy" />
        <TweakToggle
          label="Northwind AI"
          value={t.ai}
          onChange={(v) => setTweak('ai', v)}
        />

        <TweakSection label="Display" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['regular', 'compact']}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakToggle
          label="Dark mode"
          value={t.dark}
          onChange={(v) => setTweak('dark', v)}
        />
      </TweaksPanel>

      <ToastHost />
    </div>
  );
}

function routeLabel(r) {
  return {
    home: 'Home', journey: 'My Journey', tasks: 'Tasks',
    team: 'My Team', documents: 'Documents', equipment: 'Equipment & Access', ai: 'Ask AI'
  }[r] || r;
}

function AIDisabled({ onTurnOn }) {
  return (
    <div className="card empty">
      <h3>Northwind AI is turned off</h3>
      <p>Enable it from the Tweaks panel to ask onboarding questions in chat.</p>
      <div style={{ marginTop: 16 }}>
        <Button variant="ai" icon="Ai" onClick={onTurnOn}>Turn on Northwind AI</Button>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────
let toastSetter = null;
function showToast(msg, icon = 'Check') {
  toastSetter?.({ msg, icon, key: Date.now() });
}
function ToastHost() {
  const [t, setT] = useState(null);
  React.useEffect(() => { toastSetter = setT; return () => { toastSetter = null; }; }, []);
  React.useEffect(() => {
    if (!t) return;
    const id = setTimeout(() => setT(null), 2400);
    return () => clearTimeout(id);
  }, [t]);
  if (!t) return null;
  return (
    <div className="toast" key={t.key}>
      <Icon name={t.icon} />
      {t.msg}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
