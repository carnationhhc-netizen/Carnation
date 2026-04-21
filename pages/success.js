import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from '../styles/Success.module.css'

export default function Success() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(8)

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 8000)

    const countdownTimer = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(countdownTimer)
    }
  }, [router])

  const handleReturnHome = () => {
    router.push('/')
  }

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
            <button onClick={handleReturnHome} className={styles.button}>
              Return to Home Now
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
