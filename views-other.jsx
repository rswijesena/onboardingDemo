// views-other.jsx — Tasks, Team, Documents, Equipment & access

// ─── Tasks ─────────────────────────────────────────────────────────────────
function TasksView({ tasks, onToggleTask }) {
  const [filter, setFilter] = React.useState('open');   // all | open | done
  const [catFilter, setCatFilter] = React.useState('all');

  let visible = tasks;
  if (filter === 'open') visible = visible.filter(t => t.status !== 'done');
  if (filter === 'done') visible = visible.filter(t => t.status === 'done');
  if (catFilter !== 'all') visible = visible.filter(t => t.cat === catFilter);

  // group by stage
  const grouped = STAGES.map(s => ({
    stage: s,
    list: visible.filter(t => t.stage === s.id),
  })).filter(g => g.list.length > 0);

  return (
    <>
      <PageHeader
        title="Tasks"
        sub={`${tasks.filter(t => t.status !== 'done').length} open · ${tasks.filter(t => t.status === 'done').length} complete`}
      />

      {/* Filter bar */}
      <div className="card" style={{ padding: 14, marginBottom: 16, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'open', label: 'Open' },
            { value: 'done', label: 'Done' },
            { value: 'all',  label: 'All'  },
          ]}
        />
        <div style={{ width: 1, height: 24, background: 'var(--exo-color-border)' }}></div>
        <div className="row" style={{ gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => setCatFilter('all')}
            className={`btn btn-${catFilter === 'all' ? 'primary' : 'tertiary'} btn-sm`}
            style={catFilter === 'all' ? {} : { background: 'var(--exo-palette-gray-10)' }}
          >All categories</button>
          {Object.entries(CATEGORIES).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setCatFilter(key)}
              style={{
                background: catFilter === key ? `var(--exo-palette-${meta.tone === 'coral' ? 'coral-10' : meta.tone === 'ai' ? 'periwinkle-10' : meta.tone === 'info' ? 'blue-10' : meta.tone === 'success' ? 'green-10' : meta.tone === 'warning' ? 'yellow-20' : 'gray-20'})` : 'transparent',
                border: '1px solid var(--exo-color-border)',
                padding: '4px 12px', borderRadius: 16, cursor: 'pointer',
                font: '600 12px var(--exo-font-family)',
                color: 'var(--exo-color-font)',
              }}
            >{meta.label}</button>
          ))}
        </div>
      </div>

      {grouped.length === 0 && (
        <div className="card empty">
          <h3>You’re all caught up</h3>
          <p>No tasks match these filters.</p>
        </div>
      )}

      {grouped.map(g => (
        <div key={g.stage.id} className="card" style={{ padding: '20px 24px', marginBottom: 14 }}>
          <div className="card-head">
            <h2 className="card-title">{g.stage.label} <span style={{ color: 'var(--exo-palette-gray-60)', fontWeight: 400 }}>· {g.stage.range}</span></h2>
            <span style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)' }}>{g.list.length} task{g.list.length === 1 ? '' : 's'}</span>
          </div>
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
                <div style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)', margin: '4px 0' }}>{t.desc}</div>
                <div className="meta">
                  <Badge tone={CATEGORIES[t.cat].tone} dot>{CATEGORIES[t.cat].label}</Badge>
                  <span>Due {t.due}</span>
                  <span className="sep"></span>
                  <span>{t.est}</span>
                  {t.status === 'progress' && <Badge tone="info" dot>In progress</Badge>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

// ─── Team ──────────────────────────────────────────────────────────────────
function TeamView({ onAskAI }) {
  return (
    <>
      <PageHeader
        title="My team"
        sub="The people you’ll work with — manager, buddy, immediate teammates, and skip-level."
      />

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        {/* Manager */}
        <div className="card">
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <Avatar person={TEAM.manager} size="xl" />
            <div style={{ flex: 1 }}>
              <Badge tone="success" dot>Manager</Badge>
              <h3 style={{ font: '600 18px var(--exo-font-family)', margin: '8px 0 2px', color: 'var(--exo-color-font)' }}>
                {TEAM.manager.name} <span style={{ font: '400 13px var(--exo-font-family)', color: 'var(--exo-palette-gray-50)' }}>{TEAM.manager.pronouns}</span>
              </h3>
              <div style={{ font: '14px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)', marginBottom: 4 }}>{TEAM.manager.role}</div>
              <div style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)' }}>{TEAM.manager.location}</div>
            </div>
          </div>
          <p className="bio" style={{ font: '13px/1.55 var(--exo-font-family)', color: 'var(--exo-palette-gray-70)', marginTop: 14 }}>
            {TEAM.manager.bio}
          </p>
          <div className="divider"></div>
          <div className="row space">
            <div style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)' }}>
              <Icon name="Calendar" size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Next 1:1 — <strong style={{ color: 'var(--exo-color-font)' }}>{TEAM.manager.next}</strong>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <Button variant="tertiary" icon="Chats" size="sm">Message</Button>
              <Button variant="secondary" icon="Calendar" size="sm">Schedule</Button>
            </div>
          </div>
        </div>

        {/* Buddy */}
        <div className="card">
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <Avatar person={TEAM.buddy} size="xl" />
            <div style={{ flex: 1 }}>
              <Badge tone="coral" dot>Onboarding buddy</Badge>
              <h3 style={{ font: '600 18px var(--exo-font-family)', margin: '8px 0 2px', color: 'var(--exo-color-font)' }}>
                {TEAM.buddy.name} <span style={{ font: '400 13px var(--exo-font-family)', color: 'var(--exo-palette-gray-50)' }}>{TEAM.buddy.pronouns}</span>
              </h3>
              <div style={{ font: '14px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)', marginBottom: 4 }}>{TEAM.buddy.role}</div>
              <div style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)' }}>{TEAM.buddy.location}</div>
            </div>
          </div>
          <p className="bio" style={{ font: '13px/1.55 var(--exo-font-family)', color: 'var(--exo-palette-gray-70)', marginTop: 14 }}>
            {TEAM.buddy.bio}
          </p>
          <div className="divider"></div>
          <div className="row space">
            <div style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)' }}>
              <Icon name="Calendar" size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Next chat — <strong style={{ color: 'var(--exo-color-font)' }}>{TEAM.buddy.next}</strong>
            </div>
            <div className="row" style={{ gap: 6 }}>
              <Button variant="tertiary" icon="Chats" size="sm">Message</Button>
              <Button variant="secondary" icon="Calendar" size="sm">Schedule</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Immediate team */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-head">
          <h2 className="card-title">Immediate team · Platform Foundations</h2>
          <span style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)' }}>
            3 of 5 met
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {TEAM.immediate.map((p, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: 14,
              border: '1px solid var(--exo-color-border-secondary)', borderRadius: 10,
              alignItems: 'flex-start',
            }}>
              <Avatar person={p} size="lg" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '600 14px var(--exo-font-family)', color: 'var(--exo-color-font)' }}>
                  {p.name} <span style={{ font: '400 11px var(--exo-font-family)', color: 'var(--exo-palette-gray-50)' }}>{p.pronouns}</span>
                </div>
                <div style={{ font: '12px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)', marginBottom: 8 }}>{p.role}</div>
                {p.status === 'met'       && <Badge tone="success" dot>Met</Badge>}
                {p.status === 'scheduled' && <Badge tone="info" dot>Booked for Thu</Badge>}
                {p.status === 'todo'      && <Badge tone="warning" dot>Schedule intro</Badge>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skip-level */}
      <div className="card">
        <div className="card-head">
          <h2 className="card-title">Skip-level</h2>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <Avatar person={TEAM.skipLevel} size="lg" />
          <div style={{ flex: 1 }}>
            <div style={{ font: '600 14px var(--exo-font-family)', color: 'var(--exo-color-font)' }}>
              {TEAM.skipLevel.name} <span style={{ font: '400 12px var(--exo-font-family)', color: 'var(--exo-palette-gray-50)' }}>{TEAM.skipLevel.pronouns}</span>
            </div>
            <div style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)' }}>{TEAM.skipLevel.role}</div>
            <p className="bio" style={{ font: '13px/1.55 var(--exo-font-family)', color: 'var(--exo-palette-gray-70)', margin: '8px 0 0' }}>
              {TEAM.skipLevel.bio}
            </p>
          </div>
          <Button variant="secondary" icon="Calendar" size="sm">Book office hours</Button>
        </div>
      </div>
    </>
  );
}

// ─── Documents ─────────────────────────────────────────────────────────────
function DocumentsView() {
  const [filter, setFilter] = React.useState('all');
  let visible = DOCUMENTS;
  if (filter === 'pending') visible = DOCUMENTS.filter(d => d.status === 'pending' || d.status === 'in_progress');
  if (filter === 'complete') visible = DOCUMENTS.filter(d => d.status === 'signed' || d.status === 'read' || d.status === 'ack');

  const statusBadge = (s) => {
    if (s === 'signed')     return <Badge tone="success" dot>Signed</Badge>;
    if (s === 'read')       return <Badge tone="success" dot>Read</Badge>;
    if (s === 'ack')        return <Badge tone="success" dot>Acknowledged</Badge>;
    if (s === 'in_progress')return <Badge tone="info" dot>In progress</Badge>;
    if (s === 'pending')    return <Badge tone="warning" dot>Awaiting signature</Badge>;
    return <Badge>—</Badge>;
  };

  return (
    <>
      <PageHeader
        title="Documents"
        sub="Everything you’ve signed, read, or still need to address."
        actions={
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all',      label: 'All' },
              { value: 'pending',  label: 'Pending' },
              { value: 'complete', label: 'Complete' },
            ]}
          />
        }
      />

      <div className="card" style={{ padding: 20 }}>
        {visible.map(d => (
          <div key={d.id} className="doc-row">
            <div className="doc-icon">{d.ext}</div>
            <div className="doc-body">
              <div className="doc-name">{d.name}</div>
              <div className="doc-meta">
                {statusBadge(d.status)}
                <span className="sep"></span>
                <span>{STAGES.find(s => s.id === d.stage).label}</span>
                <span className="sep"></span>
                <span>{d.size}</span>
              </div>
            </div>
            <Button
              variant={d.status === 'pending' || d.status === 'in_progress' ? 'primary' : 'secondary'}
              size="sm"
              icon={d.action === 'Sign' ? 'Edit' : d.action === 'Download' ? 'Download' : 'RightCaret'}
            >
              {d.action}
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Equipment & access ───────────────────────────────────────────────────
function EquipmentView() {
  const statusBadge = (s) => {
    if (s === 'delivered')  return <Badge tone="success" dot>Delivered</Badge>;
    if (s === 'in_transit') return <Badge tone="info" dot>In transit</Badge>;
    if (s === 'requested')  return <Badge tone="warning" dot>Requested</Badge>;
  };

  return (
    <>
      <PageHeader
        title="Equipment & access"
        sub="Your gear and system access. Anything wrong? Open a ticket with IT."
        actions={<Button variant="secondary" icon="Plus" size="sm">Request something</Button>}
      />

      <div className="grid grid-2">
        {/* Equipment */}
        <div className="card" style={{ padding: 20 }}>
          <div className="card-head">
            <h2 className="card-title">Equipment</h2>
            <span style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)' }}>
              4 delivered · 2 pending
            </span>
          </div>
          {EQUIPMENT.map((e, i) => (
            <div key={i} className="task-row" style={{ padding: '12px 4px' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'var(--exo-palette-gray-10)',
                border: '1px solid var(--exo-color-border-secondary)',
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <Icon name="Lightning" size={16} />
              </div>
              <div className="body">
                <div className="title" style={{ fontSize: 13 }}>{e.name}</div>
                <div className="meta" style={{ fontSize: 12 }}>
                  {statusBadge(e.status)}
                  <span style={{ color: 'var(--exo-palette-gray-60)' }}>{e.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Access */}
        <div className="card" style={{ padding: 20 }}>
          <div className="card-head">
            <h2 className="card-title">System access</h2>
            <span style={{ font: '13px var(--exo-font-family)', color: 'var(--exo-palette-gray-60)' }}>
              4 granted · 2 pending
            </span>
          </div>
          {ACCESS.map((a, i) => (
            <div key={i} className="task-row" style={{ padding: '12px 4px' }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: a.granted ? 'var(--exo-palette-green-10)' : 'var(--exo-palette-yellow-20)',
                display: 'grid', placeItems: 'center', flexShrink: 0,
              }}>
                <Icon name={a.granted ? 'Success' : 'InProgress'} size={16} />
              </div>
              <div className="body">
                <div className="title" style={{ fontSize: 13 }}>{a.name}</div>
                <div className="meta" style={{ fontSize: 12 }}>
                  {a.granted ? <Badge tone="success" dot>Active</Badge> : <Badge tone="warning" dot>Pending</Badge>}
                  <span style={{ color: 'var(--exo-palette-gray-60)' }}>{a.note}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { TasksView, TeamView, DocumentsView, EquipmentView });
