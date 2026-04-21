import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Success.module.css'

export default function Success() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <>
      <Head>
        <title>Thank You - Carnation Home Health Care</title>
        <meta name="description" content="Your inquiry has been received. Our team will contact you shortly." />
      </Head>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.checkmark}>✓</div>
          
          <h1>Thank You!</h1>
          
          <p className={styles.message}>
            Your inquiry has been received. Our care team will contact you within <strong>2 hours</strong>.
          </p>

          <div className={styles.details}>
            <h2>What's Next?</h2>
            <ul>
              <li>📞 Look for a call from our care coordinator</li>
              <li>📧 Check your email for confirmation details</li>
              <li>💬 Have your insurance card handy if available</li>
            </ul>
          </div>

          <div className={styles.contact}>
            <h2>Need Help Sooner?</h2>
            <p>Call us anytime at:</p>
            <a href="tel:+13107740247" className={styles.phoneLink}>
              (310) 774-0247
            </a>
          </div>

          <div className={styles.redirect}>
            <p>Returning to home page in <strong>{countdown}</strong> seconds...</p>
            <button onClick={() => router.push('/')} className={styles.button}>
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
