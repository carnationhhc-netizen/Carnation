import { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '../styles/ThankYou.module.css'

export default function ThankYou() {
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          window.location.href = '/'
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head>
        <title>Thank You - Carnation Home Health Care</title>
        <meta name="description" content="Your inquiry has been received." />
      </Head>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.checkmark}>✓</div>
          
          <h1>Thank You!</h1>
          
          <p className={styles.message}>
            Your inquiry has been received. Our care team will contact you within <strong>2 hours</strong>.
          </p>

          <div className={styles.details}>
            <h3>What's Next?</h3>
            <ul>
              <li>📞 Look for a call from our care coordinator</li>
              <li>📧 Check your email for confirmation</li>
              <li>💬 Have your insurance card handy</li>
            </ul>
          </div>

          <div className={styles.contact}>
            <p>Need help sooner? Call us:</p>
            <a href="tel:+13107740247" className={styles.phone}>
              (310) 774-0247
            </a>
          </div>

          <p className={styles.redirect}>
            Returning to home in {countdown} seconds...
          </p>
          
          <a href="/" className={styles.button}>
            Return to Home
          </a>
        </div>
      </div>
    </>
  )
}
