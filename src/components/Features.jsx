import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  MessageSquareText, Network, BellRing, CalendarClock,
  Paperclip, Layers, Bot, Table2, BarChart3, FileText,
  Workflow, Shield, Package,
} from 'lucide-react';

const FEATURES = [
  {
    icon: MessageSquareText,
    label: 'Natural Language Q&A',
    title: 'Ask anything. Get answers instantly.',
    desc: 'Type a question the way you\'d ask a colleague. Zevra translates natural language into precise SQL, queries your live databases, and returns a structured answer with full data tables — in seconds.',
    bullets: ['Live database queries, not cached data', 'Follow-up questions with conversation context', 'Exports to CSV, Excel, PDF, or Markdown'],
    mock: <NLQMock />,
  },
  {
    icon: Workflow,
    label: 'Multi-step Reasoning',
    title: 'Investigate like an analyst, not a query.',
    desc: 'Complex questions require more than one query. Zevra runs a ReAct-style investigation — each step queries real data, evaluates what it found, and decides what to query next. The reasoning trace shows exactly how the answer was built.',
    bullets: [
      'Up to 6 adaptive steps — each informed by actual results',
      'Cross-source joins when the answer spans multiple databases',
      'Live reasoning trace: every step, SQL, and decision visible',
    ],
    mock: <ReasoningMock />,
  },
  {
    icon: Shield,
    label: 'Advanced Governance',
    title: 'Enterprise controls, built in.',
    desc: 'Column masking, row-level security, and data contracts protect sensitive data before it ever reaches the user. Compliance teams get an immutable audit log of every query run — who asked, what SQL ran, and which columns were masked.',
    bullets: [
      'Column policies: mask, hash, redact, or exclude PII',
      'Row-level filters resolved per-user at query time',
      'Immutable audit log with every query, user, and SQL executed',
    ],
    mock: <GovernanceMock />,
  },
  {
    icon: Network,
    label: 'Knowledge Graph',
    title: 'See how your data connects.',
    desc: 'Zevra auto-discovers relationships between your business entities by reading foreign keys and column heuristics. Explore entities visually, find JOIN paths between any two tables, and copy production-ready SQL instantly.',
    bullets: ['Auto-discovery from FK constraints', 'Visual entity explorer with column detail', 'JOIN path finder with generated SQL'],
    mock: <GraphMock />,
  },
  {
    icon: BellRing,
    label: 'Proactive Alerts',
    title: 'Know before it becomes a problem.',
    desc: 'Define thresholds on any metric. When your data deviates from the baseline, Zevra notifies your team via Slack or email — with context, root cause hints, and a direct link to investigate further.',
    bullets: ['AI-composed alert messages', 'Slack and email delivery', 'Cooldown periods to prevent alert fatigue'],
    mock: <AlertMock />,
  },
  {
    icon: CalendarClock,
    label: 'Scheduled Reports',
    title: 'Intelligence delivered on a schedule.',
    desc: 'Turn any investigation into a recurring report. Schedule it daily, weekly, or monthly. Results arrive in your inbox or Slack channel formatted as a professional multi-section report with tables and insights.',
    bullets: ['Pin any conversation as a scheduled report', 'Email and Slack delivery', 'Rich HTML reports with data tables'],
    mock: <ReportMock />,
  },
  {
    icon: Paperclip,
    label: 'File & Image Analysis',
    title: 'Upload anything. Get intelligence.',
    desc: 'Attach spreadsheets, PDFs, images, or CSVs to any question. Zevra extracts the content, cross-references it against your live database, and tells you what matches, what\'s missing, and what\'s different.',
    bullets: ['CSV, Excel, PDF, DOCX, images up to 20 MB', 'GPT-4o Vision for images and screenshots', 'Cross-reference file data against live database'],
    mock: <FileMock />,
  },
  {
    icon: Layers,
    label: 'Semantic Layer & Learning',
    title: 'A semantic layer that learns.',
    desc: 'Map technical column names to business terms — and let Zevra build from there. Every successful query is analysed to extract business term definitions. Corrections feed back into future answers. The longer you use Zevra, the more precisely it speaks your language.',
    bullets: [
      'Business term and entity mapping',
      'Auto-learns SQL patterns from every successful query',
      'Corrections and positive feedback improve future answers',
    ],
    mock: <SemanticMock />,
  },
  {
    icon: Package,
    label: 'Industry Packs',
    title: 'Ready to go on day one.',
    desc: 'Industry packs give every new account a complete semantic layer for their domain — pre-built entities, vocabulary, KPI definitions, and example questions — without any manual configuration. Zevra recommends the right pack automatically after scanning your schema.',
    bullets: [
      '5 packs: Healthcare, Hospitality, Logistics, Retail, Finance',
      'Entities, vocabulary, KPIs, and alert templates pre-configured',
      'Auto-recommended from your discovered schema on day one',
    ],
    mock: <PacksMock />,
  },
];

// ── Mock components ────────────────────────────────────────────────────────────

function NLQMock() {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <div className="bg-emerald-brand text-white text-[12.5px] px-4 py-2.5 rounded-[14px] rounded-br-sm max-w-[85%] leading-relaxed">
          Which regions had revenue below target last month?
        </div>
      </div>
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-emerald-brand/80 flex items-center justify-center shrink-0">
          <Bot size={12} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] text-zinc-300 mb-2.5 leading-relaxed">
            <strong className="text-white">2 regions</strong> missed target. East is the largest gap at −14%, driven by 3 underperforming accounts.
          </p>
          <div className="rounded-lg overflow-hidden border border-white/[0.08] text-[11px]">
            <table className="w-full border-collapse">
              <thead><tr>
                {['Region','Revenue','Target','Gap'].map(h=><th key={h} className="bg-emerald-brand/60 text-white/80 px-2.5 py-1.5 text-left font-semibold">{h}</th>)}
              </tr></thead>
              <tbody>
                {[['East','$1.2M','$1.4M','−14%'],['South','$1.7M','$1.9M','−11%'],['North','$2.4M','$2.1M','+14%']].map((r,i)=>(
                  <tr key={i} className={i%2===0?'bg-white/[0.02]':''}>
                    {r.map((c,ci)=>(
                      <td key={ci} className={`px-2.5 py-1.5 border-t border-white/[0.05] ${ci===3?(c.startsWith('−')?'text-red-400':'text-emerald-400')+' font-semibold':'text-zinc-400'}`}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReasoningMock() {
  const steps = [
    { no: 1, desc: 'Revenue by month — all regions', rows: 12, decision: 'Need more data', note: 'March confirmed −12%', status: 'amber' },
    { no: 2, desc: 'March breakdown by product category', rows: 8, decision: 'Need more data', note: 'Electronics −34%', status: 'amber' },
    { no: 3, desc: 'Electronics returns by region in March', rows: 6, decision: 'Sufficient', note: '', status: 'emerald' },
  ];
  return (
    <div className="space-y-2.5">
      {steps.map((s) => (
        <div key={s.no} className="flex items-start gap-2.5">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black ${
            s.status === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            {s.no}
          </div>
          <div className="flex-1 min-w-0 bg-white/[0.03] rounded-lg px-2.5 py-2 border border-white/[0.05]">
            <p className="text-[12px] text-zinc-300 mb-0.5">{s.desc}</p>
            <div className="flex items-center gap-2 text-[10.5px]">
              <span className="text-zinc-600">{s.rows} rows</span>
              <span className={`font-semibold ${s.status === 'emerald' ? 'text-emerald-400' : 'text-amber-400'}`}>
                → {s.decision}
              </span>
              {s.note && <span className="text-zinc-600">({s.note})</span>}
            </div>
          </div>
        </div>
      ))}
      <div className="bg-emerald-500/[0.07] border border-emerald-500/20 rounded-lg px-3 py-2.5 mt-1">
        <p className="text-[12px] text-emerald-300 leading-snug">
          <strong className="text-emerald-200">March revenue dropped 12%</strong> — driven by a 3× spike in Electronics returns concentrated in the Northeast region.
        </p>
      </div>
    </div>
  );
}

function GovernanceMock() {
  const policies = [
    { col: 'email',        type: 'HASH',     applies: 'All users' },
    { col: 'phone_number', type: 'PARTIAL',  applies: 'All users' },
    { col: 'salary',       type: 'EXCLUDE',  applies: 'Non-HR' },
    { col: 'ssn',          type: 'CONSTANT', applies: 'All users' },
  ];
  const typeColors = {
    HASH:     'text-amber-400 bg-amber-400/10 border-amber-400/20',
    PARTIAL:  'text-orange-400 bg-orange-400/10 border-orange-400/20',
    EXCLUDE:  'text-red-400 bg-red-400/10 border-red-400/20',
    CONSTANT: 'text-zinc-400 bg-white/[0.06] border-white/[0.08]',
  };
  return (
    <div className="space-y-2">
      <div className="text-[10.5px] text-zinc-600 font-semibold uppercase tracking-wider px-1 mb-1">
        Column Policies — customers table
      </div>
      {policies.map(p => (
        <div key={p.col} className="flex items-center gap-3 bg-white/[0.03] rounded-lg px-3 py-2 border border-white/[0.05]">
          <span className="font-mono text-[11.5px] text-zinc-300 flex-1">{p.col}</span>
          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${typeColors[p.type]}`}>{p.type}</span>
          <span className="text-[10.5px] text-zinc-600 text-right w-16 shrink-0">{p.applies}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-600">
        <span className="text-emerald-400 font-semibold">4 policies active</span>
        <span>·</span>
        <span>All queries logged to audit trail</span>
      </div>
    </div>
  );
}

function GraphMock() {
  const nodes = [
    { label: 'Customer', x: '10%', y: '10%', color: 'bg-violet-500/20 border-violet-400/30 text-violet-300' },
    { label: 'Order', x: '55%', y: '5%', color: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' },
    { label: 'Product', x: '78%', y: '45%', color: 'bg-sky-500/20 border-sky-400/30 text-sky-300' },
    { label: 'Invoice', x: '40%', y: '60%', color: 'bg-amber-500/20 border-amber-400/30 text-amber-300' },
    { label: 'Region', x: '8%', y: '60%', color: 'bg-rose-500/20 border-rose-400/30 text-rose-300' },
  ];
  return (
    <div className="relative h-44 select-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 180">
        <line x1="80" y1="28" x2="230" y2="18" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="4 3"/>
        <line x1="230" y1="18" x2="330" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="4 3"/>
        <line x1="230" y1="18" x2="170" y2="115" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="4 3"/>
        <line x1="80" y1="28" x2="40" y2="115" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="4 3"/>
        <line x1="170" y1="115" x2="330" y2="90" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 3"/>
      </svg>
      {nodes.map(n => (
        <div key={n.label} className={`absolute px-3 py-1.5 rounded-lg border text-[11px] font-semibold ${n.color} -translate-x-1/2 -translate-y-1/2`}
          style={{ left: n.x, top: n.y }}>
          {n.label}
        </div>
      ))}
    </div>
  );
}

function AlertMock() {
  return (
    <div className="space-y-2.5">
      {[
        { sev: 'HIGH', color: 'border-red-400/40 bg-red-400/5', dot: 'bg-red-400', title: 'Revenue below threshold', msg: 'North region Q4 revenue dropped 18% below the 7-day moving average.', time: '2 min ago' },
        { sev: 'MED', color: 'border-amber-400/40 bg-amber-400/5', dot: 'bg-amber-400', title: 'Unusual activity detected', msg: 'Transaction volume spiked 3.2× above baseline in the last hour.', time: '14 min ago' },
      ].map(a => (
        <div key={a.title} className={`rounded-xl border ${a.color} p-3`}>
          <div className="flex items-start gap-2.5">
            <span className={`w-2 h-2 rounded-full ${a.dot} mt-1 shrink-0 animate-pulse`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-[12px] font-bold text-white">{a.title}</span>
                <span className="text-[10px] text-zinc-600 shrink-0">{a.time}</span>
              </div>
              <p className="text-[11.5px] text-zinc-400 leading-snug">{a.msg}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportMock() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1">
        <span className="font-semibold text-zinc-300">Weekly Operations Report</span>
        <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">Active</span>
      </div>
      {[
        { q: 'Which regions exceeded targets this week?', icon: BarChart3 },
        { q: 'Show top 10 accounts by revenue.', icon: Table2 },
        { q: 'Summarise any anomalies vs last week.', icon: FileText },
      ].map(({ q, icon: Icon }, i) => (
        <div key={i} className="flex items-center gap-2.5 bg-white/[0.04] rounded-lg px-3 py-2">
          <Icon size={12} className="text-zinc-500 shrink-0" />
          <span className="text-[12px] text-zinc-400">{q}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-600">
        <CalendarClock size={11} />
        <span>Every Monday at 08:00 · Email + Slack</span>
      </div>
    </div>
  );
}

function FileMock() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 bg-violet-500/10 border border-violet-400/20 rounded-xl px-3 py-2.5">
        <span className="text-lg">📊</span>
        <div>
          <p className="text-[12px] font-semibold text-violet-300">Q3_reconciliation.xlsx</p>
          <p className="text-[10.5px] text-zinc-500">847 rows · 12 columns extracted</p>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="bg-emerald-brand text-white text-[12px] px-3.5 py-2 rounded-[12px] rounded-br-sm max-w-[90%]">
          Which of these transactions don't exist in our system?
        </div>
      </div>
      <div className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-md bg-emerald-brand/80 flex items-center justify-center shrink-0 mt-0.5">
          <Bot size={11} className="text-white" />
        </div>
        <p className="text-[12px] text-zinc-300 leading-relaxed">
          <strong className="text-white">23 transactions</strong> from the file were not found in the database. 814 matched successfully. Possible causes: date range mismatch or pending import.
        </p>
      </div>
    </div>
  );
}

function SemanticMock() {
  const learned = [
    { term: 'late shipment', sql: "status = 'DELAYED' AND eta < NOW()", confidence: 91, count: 23 },
    { term: 'active customer', sql: "last_order_date > NOW() - INTERVAL '90 days'", confidence: 84, count: 11 },
  ];
  return (
    <div className="space-y-3">
      <div className="text-[10.5px] text-zinc-600 font-semibold uppercase tracking-wider px-0.5">
        Auto-learned from queries
      </div>
      {learned.map(l => (
        <div key={l.term} className="bg-white/[0.04] rounded-xl border border-white/[0.07] p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[12.5px] font-bold text-zinc-200">"{l.term}"</span>
            <span className="text-[10px] text-zinc-500">used {l.count}×</span>
          </div>
          <span className="font-mono text-[10.5px] text-emerald-400/80 break-all leading-relaxed">{l.sql}</span>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500/60 rounded-full" style={{ width: `${l.confidence}%` }} />
            </div>
            <span className="text-[10px] text-zinc-500 shrink-0">{l.confidence}% confidence</span>
          </div>
        </div>
      ))}
      <p className="text-[11px] text-zinc-600 text-center">Corrections feed back into future answers</p>
    </div>
  );
}

function PacksMock() {
  const packs = [
    { name: 'Healthcare', coverage: 82, entities: 8, vocab: 34, recommended: true },
    { name: 'Hospitality', coverage: 41, entities: 4, vocab: 18, recommended: false },
  ];
  return (
    <div className="space-y-3">
      <div className="text-[10.5px] text-zinc-600 font-semibold uppercase tracking-wider px-0.5">
        Detected from your schema
      </div>
      {packs.map(p => (
        <div key={p.name} className={`rounded-xl border p-3 ${p.recommended ? 'border-emerald-500/30 bg-emerald-500/[0.05]' : 'border-white/[0.07] bg-white/[0.02]'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-bold text-zinc-200">{p.name} Pack</span>
            {p.recommended && (
              <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                Recommended
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500/70 rounded-full" style={{ width: `${p.coverage}%` }} />
            </div>
            <span className="text-[10.5px] text-zinc-500 shrink-0">{p.coverage}% match</span>
          </div>
          <div className="flex gap-3 text-[10.5px] text-zinc-600">
            <span>{p.entities} entities</span>
            <span>·</span>
            <span>{p.vocab} vocab terms</span>
          </div>
        </div>
      ))}
      <p className="text-[11px] text-zinc-600 text-center">Apply in one click — entities and vocab configured instantly</p>
    </div>
  );
}

// ── Features section ───────────────────────────────────────────────────────────

export default function Features() {
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="features" className="section-pad bg-[#080A0F]">
      <div className="container-pad">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-14"
        >
          <span className="eyebrow">Platform Features</span>
          <h2 className="text-[38px] lg:text-[48px] font-black tracking-tight leading-[1.06] text-white mb-4">
            Everything your team needs<br />to stay ahead.
          </h2>
          <p className="text-[17px] text-zinc-400 leading-relaxed">
            One platform. Every operational intelligence capability your enterprise needs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-10 items-start">
          {/* Tabs */}
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:sticky lg:top-24">
            {FEATURES.map((f, i) => (
              <button
                key={f.label}
                onClick={() => setActive(i)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left shrink-0 transition-all duration-200 ${
                  active === i
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active === i ? 'bg-emerald-500/15' : 'bg-white/[0.05]'}`}>
                  <f.icon size={15} className={active === i ? 'text-emerald-400' : 'text-zinc-500'} />
                </div>
                <span className="text-[13px] font-semibold whitespace-nowrap">{f.label}</span>
              </button>
            ))}
          </div>

          {/* Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="glass-card p-8"
            >
              <h3 className="text-[26px] font-black tracking-tight text-white mb-3">
                {FEATURES[active].title}
              </h3>
              <p className="text-[15px] text-zinc-400 leading-relaxed mb-6 max-w-lg">
                {FEATURES[active].desc}
              </p>
              <ul className="space-y-2 mb-8">
                {FEATURES[active].bullets.map(b => (
                  <li key={b} className="flex items-center gap-2.5 text-[13.5px] text-zinc-300">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              {/* Feature mockup */}
              <div className="bg-[#0d1117] rounded-xl border border-white/[0.07] p-5">
                {FEATURES[active].mock}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
