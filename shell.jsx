// shell.jsx — TopBar, SideNav, shared layout primitives

const ICON = (name) => `design-system/assets/icons/${name}.svg`;

function Icon({ name, size = 18, invert = false, style = {} }) {
  return (
    <img
      src={ICON(name)}
      alt=""
      width={size}
      height={size}
      style={{ filter: invert ? 'invert(1)' : 'none', ...style }}
    />
  );
}

function Avatar({ person, size = 'md', style = {} }) {
  const klass = `avatar ${size}`;
  return (
    <div className={klass} style={{ background: person.color, ...style }}>
      {person.initials}
    </div>
  );
}

function Badge({ tone = 'neutral', dot = false, children }) {
  return (
    <span className={`badge ${tone}`}>
      {dot && <span className="dot"></span>}
      {children}
    </span>
  );
}

function Button({ variant = 'primary', icon, size, onClick, children, disabled, style = {} }) {
  const cls = ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : ''].join(' ');
  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={style}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
    </button>
  );
}

function Segmented({ value, options, onChange }) {
  return (
    <div className="segmented">
      {options.map(opt => (
        <button
          key={opt.value}
          className={value === opt.value ? 'active' : ''}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function TopBar({ persona }) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="mark">N</div>
        <div>
          <div className="name">Northwind</div>
        </div>
        <div className="topbar-divider"></div>
        <div className="product">Onboard</div>
      </div>
      <div className="topbar-search">
        <Icon name="Search" size={16} invert style={{ opacity: .7 }} />
        <input placeholder="Search tasks, people, documents…" />
        <span className="kbd">⌘K</span>
      </div>
      <div className="topbar-right">
        <button className="topbar-icon" title="Help">
          <Icon name="Help" />
        </button>
        <button className="topbar-icon" title="Notifications">
          <Icon name="Notification" />
          <span className="dot"></span>
        </button>
        <div className="topbar-user" title="Account">
          <div className="avatar" style={{ background: persona.color, width: 32, height: 32, fontSize: 12 }}>
            {persona.initials}
          </div>
          <div className="who">
            {persona.firstName}
            <small>Day {persona.dayOf90} of 90</small>
          </div>
        </div>
      </div>
    </header>
  );
}

function SideNav({ active, onNavigate, completion, taskCounts, aiEnabled }) {
  const items = [
    { id: 'home',      label: 'Home',         icon: 'Home' },
    { id: 'journey',   label: 'My journey',   icon: 'Rocket' },
    { id: 'tasks',     label: 'Tasks',        icon: 'Check',     count: taskCounts.open },
    { id: 'team',      label: 'My team',      icon: 'Chats' },
    { id: 'documents', label: 'Documents',    icon: 'Edit',      count: taskCounts.pendingDocs },
    { id: 'equipment', label: 'Equipment & access', icon: 'Lightning' },
  ];
  const aiItem = { id: 'ai', label: 'Ask Northwind AI', icon: 'Ai', ai: true };

  return (
    <nav className="sidenav">
      <div className="sidenav-section">For you</div>
      <div className="sidenav-list">
        {items.map(it => (
          <button key={it.id}
            className={`sidenav-item ${active === it.id ? 'active' : ''}`}
            onClick={() => onNavigate(it.id)}
          >
            <Icon name={it.icon} />
            <span>{it.label}</span>
            {it.count > 0 && <span className="count">{it.count}</span>}
          </button>
        ))}
      </div>

      {aiEnabled && (
        <>
          <div className="sidenav-section">AI</div>
          <div className="sidenav-list">
            <button
              className={`sidenav-item ${active === aiItem.id ? 'active' : ''}`}
              onClick={() => onNavigate(aiItem.id)}
            >
              <Icon name={aiItem.icon} />
              <span>{aiItem.label}</span>
              <span className="ai-dot"></span>
            </button>
          </div>
        </>
      )}

      <div className="sidenav-progress">
        <div className="label">Overall progress</div>
        <div className="pct">{completion}<span className="of">%</span></div>
        <div className="bar"><div style={{ width: `${completion}%` }}></div></div>
      </div>
    </nav>
  );
}

function PageHeader({ title, sub, actions }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {actions && <div className="row" style={{ gap: 8 }}>{actions}</div>}
    </div>
  );
}

// Animated SVG progress ring
function ProgressRing({ value, size = 120, stroke = 10, color = 'var(--exo-palette-coral-50)', track = 'rgba(255,255,255,.18)', label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke}/>
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transform: 'rotate(-90deg)', transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 800ms cubic-bezier(.62,.28,.23,.99)'
          }}
        />
      </svg>
      <div className="center">
        <div className="num">{value}%</div>
        {label && <div className="lbl">{label}</div>}
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Avatar, Badge, Button, Segmented, TopBar, SideNav, PageHeader, ProgressRing, ICON });
