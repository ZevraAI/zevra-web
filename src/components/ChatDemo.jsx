import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send } from 'lucide-react';

const DEMOS = [
  {
    industry: 'Operations',
    question: 'Which departments exceeded their budget this quarter?',
    answer: '<strong>3 of 6 departments</strong> exceeded quarterly budget. Sales leads at <strong>$2.4M</strong> — 18% above target. Engineering is the highest risk at 24% over.',
    headers: ['Department', 'Budget', 'Actual', 'Variance'],
    rows: [
      ['Sales',       '$2.0M', '$2.4M', { val: '+18%', up: true  }],
      ['Engineering', '$1.8M', '$2.2M', { val: '+24%', up: true  }],
      ['Marketing',   '$1.2M', '$1.1M', { val: '−4%',  up: false }],
      ['Operations',  '$0.9M', '$0.8M', { val: '−8%',  up: false }],
    ],
  },
  {
    industry: 'Healthcare',
    question: 'Show patients waiting over 48 hours for discharge approval.',
    answer: '<strong>14 patients</strong> are waiting over 48 hours. Ward C has the highest concentration — 6 patients pending specialist sign-off, averaging <strong>61 hours</strong>.',
    headers: ['Ward', 'Patients', 'Avg Wait', 'Blocker'],
    rows: [
      ['Ward C', '6', '61 hrs', { val: 'Specialist', up: false }],
      ['Ward A', '4', '54 hrs', { val: 'Paperwork',  up: false }],
      ['Ward F', '3', '49 hrs', { val: 'Insurance',  up: false }],
      ['Ward B', '1', '48 hrs', { val: 'Ready',      up: true  }],
    ],
  },
  {
    industry: 'Hospitality',
    question: 'Which properties had the lowest occupancy last weekend?',
    answer: '<strong>2 properties</strong> fell below the 65% threshold. Riverside Inn at 51% is critical — weekend RevPAR dropped <strong>22%</strong> vs the prior period.',
    headers: ['Property', 'Occupancy', 'RevPAR', 'vs Prior'],
    rows: [
      ['Riverside Inn', '51%', '$89',  { val: '−22%', up: false }],
      ['Harbor View',   '58%', '$112', { val: '−14%', up: false }],
      ['City Central',  '81%', '$198', { val: '+8%',  up: true  }],
      ['Airport Stay',  '76%', '$134', { val: '+3%',  up: true  }],
    ],
  },
];

const TYPE_SPEED = 36;

// ── DemoContent ────────────────────────────────────────────────────────────────
// Mounted fresh for each demo via key={demoIdx}. Owns all its timers and cleans
// them up on unmount — prevents stale callbacks leaking into the next demo.
function DemoContent({ demo, onDone }) {
  const [typedText,   setTypedText]   = useState('');
  const [phase,       setPhase]       = useState('typing'); // typing|thinking|answer
  const [visibleRows, setVisibleRows] = useState([]);
  const timers = useRef([]);

  // Register a timeout and track its ID so we can cancel all on unmount.
  const schedule = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timers.current.push(id);
  };

  // Cancel every pending timer when this demo is torn down.
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Typewriter on mount.
  useEffect(() => {
    let i = 0;
    const tick = () => {
      setTypedText(demo.question.slice(0, i));
      if (i <= demo.question.length) {
        i++;
        schedule(tick, TYPE_SPEED);
      } else {
        schedule(() => setPhase('thinking'), 400);
      }
    };
    schedule(tick, 300);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Phase transitions.
  useEffect(() => {
    if (phase === 'thinking') {
      schedule(() => setPhase('answer'), 1600);
    }
    if (phase === 'answer') {
      // Stagger each row in independently.
      demo.rows.forEach((_, idx) =>
        schedule(() => setVisibleRows(prev => [...prev, idx]), 300 + idx * 150),
      );
      // After all rows + reading time, tell the parent to advance.
      schedule(onDone, 300 + demo.rows.length * 150 + 3000);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-4 space-y-4 min-h-[300px]">
      {/* User message */}
      {typedText && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <div className="bg-emerald-brand text-white text-[13px] leading-relaxed px-4 py-2.5 rounded-[14px] rounded-br-sm max-w-[88%]">
            {typedText}
            {phase === 'typing' && (
              <span className="inline-block w-0.5 h-3.5 bg-white/70 ml-0.5 align-text-bottom animate-blink" />
            )}
          </div>
        </motion.div>
      )}

      {/* Bot response */}
      {(phase === 'thinking' || phase === 'answer') && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2.5"
        >
          <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-emerald-brand to-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
            <Bot size={13} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            {phase === 'thinking' && (
              <div className="flex gap-1.5 pt-2">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-thinking"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            )}

            {phase === 'answer' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <p
                  className="text-[12.5px] text-zinc-300 leading-relaxed mb-3"
                  dangerouslySetInnerHTML={{ __html: demo.answer }}
                />
                <div className="rounded-xl overflow-hidden border border-white/[0.08] text-[11.5px]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {demo.headers.map(h => (
                          <th key={h} className="bg-emerald-brand/80 text-white/90 font-semibold px-3 py-2 text-left tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {demo.rows.map((row, ri) =>
                        visibleRows.includes(ri) ? (
                          <motion.tr
                            key={ri}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.22 }}
                            className={ri % 2 === 0 ? 'bg-white/[0.02]' : ''}
                          >
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-3 py-1.5 border-t border-white/[0.05] text-zinc-400">
                                {typeof cell === 'object' ? (
                                  <span className={cell.up ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                                    {cell.val}
                                  </span>
                                ) : cell}
                              </td>
                            ))}
                          </motion.tr>
                        ) : null,
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── ChatDemo shell ─────────────────────────────────────────────────────────────
export default function ChatDemo() {
  const [demoIdx, setDemoIdx] = useState(0);
  const demo = DEMOS[demoIdx];
  const nextDemo = () => setDemoIdx(prev => (prev + 1) % DEMOS.length);

  return (
    <div className="w-full max-w-[500px] rounded-2xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-2xl shadow-black/60 ring-1 ring-emerald-500/10">
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#161b22] border-b border-white/[0.07]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="flex-1 text-center text-[12px] font-medium text-zinc-500">Zevra</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={demo.industry}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full tracking-wider uppercase"
          >
            {demo.industry}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Chat body — keyed so React fully remounts DemoContent on every demo change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={demoIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <DemoContent demo={demo} onDone={nextDemo} />
        </motion.div>
      </AnimatePresence>

      {/* Input bar */}
      <div className="px-4 py-3 border-t border-white/[0.07] flex items-center gap-2.5">
        <div className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-zinc-600 select-none">
          Ask a follow-up question…
        </div>
        <div className="w-8 h-8 bg-emerald-brand rounded-lg flex items-center justify-center shrink-0">
          <Send size={12} className="text-white" />
        </div>
      </div>
    </div>
  );
}
