import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    zip: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Please call us.');
      }

      setSubmitted(true);
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
        <meta
          name="description"
          content="Carnation Home Health Care provides skilled nursing, therapy, and personal care in the comfort of your home. Call 310-774-0247 for a free consultation."
        />
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

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Medicare Certified · Licensed in California</span>
          <h1>Compassionate Home Health Care, When You Need It Most</h1>
          <p className={styles.heroSub}>
            Skilled nursing, therapy, and personal care delivered in the comfort of your home.
            A care coordinator will call you back within 2 hours.
          </p>
          <a href="#contact" className={styles.heroBtn}>
            Request a Free Consultation
          </a>
          <div className={styles.heroBadges}>
            <span>✓ Free In-Home Assessment</span>
            <span>✓ Accepts Medicare</span>
            <span>✓ Available 7 Days a Week</span>
          </div>
        </div>
      </section>

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

      <section className={styles.trustBar}>
        <div className={styles.container}>
          <div className={styles.trustGrid}>
            <div className={styles.trustItem}>
              <strong>Medicare Certified</strong>
              <span>Accredited & compliant</span>
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

      <section id="contact" className={styles.contact}>
        <div className={styles.container}>
          <div className={styles.contactWrap}>
            <div className={styles.contactLeft}>
              <h2>Request a Free Consultation</h2>
              <p>
                Tell us a little about the person who needs care. A care coordinator will call
                you back within 2 hours to discuss your needs and next steps — no obligation.
              </p>
              <div className={styles.contactDetails}>
                <div>📞 <a href="tel:3107740247">(310) 774-0247</a></div>
                <div>✉️ <a href="mailto:info@carnationhhc.com">info@carnationhhc.com</a></div>
                <div>🕐 Mon–Sun, care coordinators on call</div>
              </div>
            </div>

            <div>
              {submitted ? (
                <div className={styles.thankYou}>
                  <div className={styles.thankYouIcon}>✓</div>
                  <h3>Thank you!</h3>
                  <p>We've received your request and a care coordinator will call you within 2 hours.</p>
                  <p>Need to reach us sooner? <a href="tel:3107740247">Call (310) 774-0247</a></p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <input type="text" name="name" placeholder="Full Name *" value={form.name} onChange={handleChange} required />
                  <input type="tel" name="phone" placeholder="Phone Number *" value={form.phone} onChange={handleChange} required />
                  <input type="email" name="email" placeholder="Email *" value={form.email} onChange={handleChange} required />
                  <input type="text" name="zip" placeholder="ZIP Code *" value={form.zip} onChange={handleChange} required />
                  <textarea name="message" placeholder="Tell us briefly about the care needed (optional)" rows={4} value={form.message} onChange={handleChange} />
                  <button type="submit" className={styles.submitBtn} disabled={submitting}>
                    {submitting ? 'Sending...' : 'Request Consultation'}
                  </button>
                  {error && (
                    <p style={{ color: '#dc2626', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>
                  )}
                  <p className={styles.formNote}>Your information is kept private and only used to contact you about care.</p>
                </form>
              )}
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
              <a href="tel:3107740247">(310) 774-0247</a> · <a href="mailto:info@carnationhhc.com">info@carnationhhc.com</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            © {new Date().getFullYear()} Carnation Home Health Care. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
