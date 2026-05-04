import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import q from '../styles/Quiz.module.css';

/* ── Quiz config ─────────────────────────────────── */
const QUIZ = [
  {
    id: 'situation',
    question: 'Who needs care?',
    type: 'choice',
    options: [
      { label: 'Myself',                         value: 'self' },
      { label: 'A parent or family member',       value: 'family_member' },
      { label: "I'm a caregiver or physician",    value: 'professional' },
    ],
  },
  {
    id: 'insurance',
    question: 'How will care be paid for?',
    type: 'choice',
    options: [
      { label: 'Medicare',                        value: 'medicare' },
      { label: 'Private insurance',               value: 'private_insurance' },
      { label: 'Private pay (out of pocket)',     value: 'private_pay' },
      { label: "Not sure yet",                    value: 'not_sure' },
    ],
  },
  {
    id: 'timeline',
    question: 'How soon is care needed?',
    type: 'choice',
    options: [
      { label: 'Right away (within 24 hours)',   value: 'immediately' },
      { label: 'Within a week',                  value: 'within_week' },
      { label: 'Within a month',                 value: 'within_month' },
      { label: 'Just exploring options',          value: 'exploring' },
    ],
  },
  {
    id: 'zip',
    question: 'What ZIP code is care needed in?',
    type: 'zip',
  },
  {
    id: 'contact',
    question: 'How should we reach you?',
    type: 'contact',
  },
  {
    id: 'schedule',
    question: 'When should we call you?',
    type: 'schedule',
  },
];

const DAYS  = ['Today', 'Tomorrow', 'Later this week'];
const TIMES = [
  { label: 'Morning',   sub: '8 am – 12 pm', value: 'morning'   },
  { label: 'Afternoon', sub: '12 pm – 5 pm',  value: 'afternoon' },
  { label: 'Evening',   sub: '5 pm – 7 pm',   value: 'evening'   },
];

/* ── Page ────────────────────────────────────────── */
export default function Home() {
  const router = useRouter();

  const [step,       setStep]      = useState(0);
  const [answers,    setAnswers]   = useState({});
  const [zip,        setZip]       = useState('');
  const [contact,    setContact]   = useState({ name: '', phone: '', email: '' });
  const [schedule,   setSchedule]  = useState({ day: '', time: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]     = useState('');

  const current  = QUIZ[step];
  const progress = Math.round((step / QUIZ.length) * 100);

  const next = ()           => setStep(s => s + 1);
  const back = ()           => { setStep(s => s - 1); setError(''); };
  const pick = (id, value)  => { setAnswers(a => ({ ...a, [id]: value })); next(); };

  const onZip = (e) => {
    e.preventDefault();
    if (zip.length >= 5) { setAnswers(a => ({ ...a, zip })); next(); }
  };

  const onContact = (e) => {
    e.preventDefault();
    if (contact.name && contact.phone) next();
  };

  const onSchedule = async (e) => {
    e.preventDefault();
    if (!schedule.day || !schedule.time) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/submit-lead', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:  contact.name,
          phone: contact.phone,
          email: contact.email,
          zip,
          quizAnswers: {
            situation:    answers.situation,
            insurance:    answers.insurance,
            timeline:     answers.timeline,
            location:     zip,
            scheduleDay:  schedule.day,
            scheduleTime: schedule.time,
          },
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Something went wrong. Please call us directly.');
      }
      router.push('/thank-you');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <Head>
        <title>Carnation Home Health Care | Compassionate In-Home Care</title>
        <meta name="description" content="Carnation Home Health Care provides skilled nursing, therapy, and personal care in the comfort of your home. Call 310-774-0247 for a free consultation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>Carnation Home Health</div>
          <a href="tel:3107740247" className={styles.headerPhone}>
            Call (310) 774-0247
          </a>
        </div>
      </header>

      {/* ── Quiz hero ── */}
      <section className={q.section}>
        <div className={q.wrap}>

          <div className={q.intro}>
            <span className={q.badge}>Medicare Certified · Licensed in California</span>
            <h1>Find the right care in 60&nbsp;seconds</h1>
            <p>A few quick questions, then a care coordinator calls you within 2&nbsp;hours — free, no&nbsp;obligation.</p>
          </div>

          <div className={q.card}>
            {/* Progress bar */}
            <div className={q.track}>
              <div className={q.fill} style={{ width: `${progress}%` }} />
            </div>
            <p className={q.stepLabel}>Step {step + 1} of {QUIZ.length}</p>

            {/* Multiple choice */}
            {current.type === 'choice' && (
              <>
                <h2 className={q.question}>{current.question}</h2>
                <ul className={q.options}>
                  {current.options.map(o => (
                    <li key={o.value}>
                      <button
                        className={`${q.option} ${answers[current.id] === o.value ? q.optionActive : ''}`}
                        onClick={() => pick(current.id, o.value)}
                      >
                        {o.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* ZIP input */}
            {current.type === 'zip' && (
              <form onSubmit={onZip}>
                <h2 className={q.question}>{current.question}</h2>
                <input
                  className={q.input}
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="e.g. 90210"
                  value={zip}
                  onChange={e => setZip(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
                <button className={q.continueBtn} disabled={zip.length < 5}>
                  Continue →
                </button>
              </form>
            )}

            {/* Contact info */}
            {current.type === 'contact' && (
              <form onSubmit={onContact}>
                <h2 className={q.question}>{current.question}</h2>
                <input
                  className={q.input}
                  type="text"
                  placeholder="Full name *"
                  value={contact.name}
                  onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
                  required
                  autoFocus
                />
                <input
                  className={q.input}
                  type="tel"
                  placeholder="Phone number *"
                  value={contact.phone}
                  onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                  required
                />
                <input
                  className={q.input}
                  type="email"
                  placeholder="Email address *"
                  value={contact.email}
                  onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
                  required
                />
                <button
                  className={q.continueBtn}
                  disabled={!contact.name || !contact.phone || !contact.email}
                >
                  Continue →
                </button>
              </form>
            )}

            {/* Schedule */}
            {current.type === 'schedule' && (
              <form onSubmit={onSchedule}>
                <h2 className={q.question}>{current.question}</h2>

                <p className={q.chipLabel}>Best day to call</p>
                <div className={q.chips}>
                  {DAYS.map(d => (
                    <button
                      type="button"
                      key={d}
                      className={`${q.chip} ${schedule.day === d ? q.chipActive : ''}`}
                      onClick={() => setSchedule(s => ({ ...s, day: d }))}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <p className={q.chipLabel}>Best time to call</p>
                <div className={q.chips}>
                  {TIMES.map(t => (
                    <button
                      type="button"
                      key={t.value}
                      className={`${q.chip} ${schedule.time === t.value ? q.chipActive : ''}`}
                      onClick={() => setSchedule(s => ({ ...s, time: t.value }))}
                    >
                      <strong>{t.label}</strong>
                      <span>{t.sub}</span>
                    </button>
                  ))}
                </div>

                {error && <p className={q.error}>{error}</p>}

                <button
                  className={q.submitBtn}
                  disabled={submitting || !schedule.day || !schedule.time}
                >
                  {submitting ? 'Submitting…' : 'Schedule My Call →'}
                </button>
              </form>
            )}

            {step > 0 && (
              <button className={q.back} onClick={back}>← Back</button>
            )}
          </div>

          <p className={q.privacy}>
            🔒 Your information is private and only used to contact you about care.
          </p>
        </div>
      </section>

      {/* ── Services ── */}
      <section className={styles.services}>
        <div className={styles.container}>
          <h2>Our Home Health Services</h2>
          <div className={styles.serviceGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🩺</div>
              <h3>Skilled Nursing</h3>
              <p>Wound care, medication management, injections, and chronic condition monitoring by licensed RNs and LVNs.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🏃</div>
              <h3>Physical Therapy</h3>
              <p>Recover strength, balance, and mobility after surgery, injury, or illness with personalized therapy plans.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>✋</div>
              <h3>Occupational Therapy</h3>
              <p>Regain independence in daily activities like bathing, dressing, and cooking with expert guidance.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🗣️</div>
              <h3>Speech Therapy</h3>
              <p>Support for speech, swallowing, and cognitive-communication challenges from licensed speech-language pathologists.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>💬</div>
              <h3>Medical Social Work</h3>
              <p>Guidance on community resources, care planning, and emotional support for patients and families.</p>
            </div>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🤝</div>
              <h3>Home Health Aide</h3>
              <p>Personal care assistance with bathing, grooming, and daily activities under nursing supervision.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section className={styles.trustBar}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <strong>Medicare Certified</strong>
              <span>Accredited &amp; compliant</span>
            </div>
            <div className={styles.trustItem}>
              <strong>Licensed in California</strong>
              <span>Serving Los Angeles County</span>
            </div>
            <div className={styles.trustItem}>
              <strong>2-Hour Response</strong>
              <span>Fast care coordination</span>
            </div>
            <div className={styles.trustItem}>
              <strong>7 Days a Week</strong>
              <span>Here when you need us</span>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerInner}>
            <div>
              <strong style={{ color: '#fff' }}>Carnation Home Health Care</strong>
              <br />
              Medicare Certified · Licensed in California
              <br />
              <a href="tel:3107740247">(310) 774-0247</a>
              {' · '}
              <a href="mailto:info@carnationhhc.com">info@carnationhhc.com</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            &copy; {new Date().getFullYear()} Carnation Home Health Care. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
