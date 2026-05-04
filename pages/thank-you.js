import Head from 'next/head';
import { Fraunces, Inter } from 'next/font/google';
import {
  Phone, Mail, ClipboardCheck,
  ShieldCheck, Award, Clock, CheckCircle2,
} from 'lucide-react';
import styles from '../styles/ThankYou.module.css';
import * as gtag from '../lib/gtag';

const fraunces = Fraunces({ subsets: ['latin'], weight: ['400', '600', '700'] });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });

export default function ThankYou() {
  return (
    <div className={`${styles.page} ${inter.className}`}>
      <Head>
        <title>Thank You | Carnation Home Health Care</title>
        <meta
          name="description"
          content="Thank you for reaching out. A care coordinator will call you within 2 hours."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
      </Head>

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>Carnation Home Health</div>
          <a href="tel:3107740247" className={styles.headerPhone}
            onClick={() => gtag.event('phone_click', { location: 'thankyou_header' })}>
            <Phone size={15} aria-hidden="true" />
            (310) 774-0247
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>

          {/* Hero image */}
          <div className={styles.imageWrap}>
            <img
              src="https://images.unsplash.com/photo-1758691463582-11aea602cd4a?w=720&q=80&auto=format&fit=crop"
              alt="A smiling doctor in a white coat with stethoscope"
              className={styles.heroImg}
              width={720}
              height={280}
            />
          </div>

          {/* Headline */}
          <div className={styles.heroText}>
            <div className={styles.checkBadge} aria-hidden="true">
              <CheckCircle2 size={36} color="#E8826B" strokeWidth={1.75} />
            </div>
            <h1 className={`${styles.headline} ${fraunces.className}`}>
              You&rsquo;re in good hands.
            </h1>
            <p className={styles.subhead}>
              We&rsquo;ve received your request. A Carnation care coordinator will call
              you within <strong>2&nbsp;hours</strong> to talk through your needs &mdash;
              no pressure, no obligation.
            </p>
          </div>

          {/* 3-step timeline */}
          <section aria-label="What happens next">
            <h2 className={`${styles.sectionTitle} ${fraunces.className}`}>
              What happens next
            </h2>
            <ol className={styles.steps}>
              <li className={styles.step}>
                <div className={styles.stepIcon} aria-hidden="true">
                  <Phone size={20} color="#E8826B" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className={styles.stepTitle}>We call you</h3>
                  <p className={styles.stepBody}>
                    A care coordinator will reach out within 2 hours to learn about
                    your loved one&rsquo;s situation and answer your questions.
                  </p>
                </div>
              </li>
              <li className={styles.step}>
                <div className={styles.stepIcon} aria-hidden="true">
                  <ClipboardCheck size={20} color="#E8826B" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className={styles.stepTitle}>Free in-home assessment</h3>
                  <p className={styles.stepBody}>
                    We&rsquo;ll schedule a no-cost visit at a time that works for your
                    family to fully understand care needs and goals.
                  </p>
                </div>
              </li>
              <li className={styles.step}>
                <div className={styles.stepIcon} aria-hidden="true">
                  <Mail size={20} color="#E8826B" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className={styles.stepTitle}>Your care plan arrives</h3>
                  <p className={styles.stepBody}>
                    We&rsquo;ll send a personalized care plan and help you navigate
                    insurance, Medicare, and scheduling &mdash; all at your pace.
                  </p>
                </div>
              </li>
            </ol>
          </section>

          {/* Tap-to-call card */}
          <section className={styles.callCard} aria-label="Call us">
            <p className={styles.callLabel}>Need to reach us sooner?</p>
            <a href="tel:3107740247" className={styles.callBtn}
              onClick={() => gtag.event('phone_click', { location: 'thankyou_cta' })}>
              <Phone size={20} aria-hidden="true" />
              Call (310) 774-0247
            </a>
            <p className={styles.callNote}>Care coordinators available Mon&ndash;Sun</p>
          </section>

          {/* Trust row */}
          <ul className={styles.trustRow} aria-label="Credentials and certifications">
            <li className={styles.trustItem}>
              <ShieldCheck size={17} color="#E8826B" aria-hidden="true" />
              Licensed in California
            </li>
            <li className={styles.trustItem}>
              <Award size={17} color="#E8826B" aria-hidden="true" />
              Bonded &amp; Insured
            </li>
            <li className={styles.trustItem}>
              <Clock size={17} color="#E8826B" aria-hidden="true" />
              Available 24/7
            </li>
            <li className={styles.trustItem}>
              <CheckCircle2 size={17} color="#E8826B" aria-hidden="true" />
              CDPH Certified
            </li>
          </ul>

        </div>
      </main>

      <footer className={styles.footer}>
        <p>
          &copy; {new Date().getFullYear()} Carnation Home Health Care &middot;{' '}
          <a href="mailto:info@carnationhhc.com">info@carnationhhc.com</a>
        </p>
      </footer>
    </div>
  );
}
