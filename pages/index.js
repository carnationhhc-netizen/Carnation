import { useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zip: '',
    interested: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        setMessage('✅ Thank you! Your inquiry has been submitted. Our team will contact you shortly.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          zip: '',
          interested: ''
        })
      } else {
        setMessage('❌ Error submitting form. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('❌ Error submitting form. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logo}>🏥 Carnation Home Health Care</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1>Compassionate Care Tailored to Your Needs</h1>
          <p className={styles.subheading}>Professional Home Health Services for Seniors in Southern California</p>
          <p className={styles.ctaText}>Personalized Care • Licensed RNs & Therapists • (310) 774-0247</p>
        </div>
      </section>

      {/* Main Content */}
      <section>
        <div className={styles.contentContainer}>
          <div className={styles.contentLeft}>
            <h2>About Carnation Home Health</h2>
            <p>Whether you are managing a chronic condition or recovering from illness, injury, surgery, or hospitalization, our expert teams of nurses and therapists collaborate with you, your family, and your healthcare providers to develop a personalized care plan.</p>
            
            <p>We provide the skilled care, education, and tools necessary to help you regain your independence and live a healthier, happier life.</p>
            
            <div className={styles.benefits}>
              <h3>Our Services Include:</h3>
              <ul>
                <li>Skilled Nursing Care</li>
                <li>Physical, Occupational & Speech Therapy</li>
                <li>Wound Care & Infusion Therapy</li>
                <li>Chronic Disease Management</li>
                <li>Post-Surgical Recovery Support</li>
                <li>24/7 Emergency Support</li>
              </ul>
            </div>

            <div className={styles.benefits}>
              <h3>Whole-Person Health Approach:</h3>
              <ul>
                <li>Physical wellness support</li>
                <li>Emotional wellbeing care</li>
                <li>Social connection & support</li>
                <li>Personalized care plans</li>
                <li>Your goals at the center</li>
                <li>Professional, compassionate team</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className={styles.formSection}>
            <h2>Get in Touch Today</h2>
            <p className={styles.formSubtitle}>Tell us about your care needs and we'll help you get started</p>
            
            {message && (
              <div className={styles.message}>
                {message}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="zip">Zip Code *</label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="interested">What type of care are you interested in?</label>
                <select
                  id="interested"
                  name="interested"
                  value={formData.interested}
                  onChange={handleChange}
                >
                  <option value="">-- Select an option --</option>
                  <option value="skilled_nursing">Skilled Nursing Care</option>
                  <option value="therapy">Physical/Occupational/Speech Therapy</option>
                  <option value="post_surgical">Post-Surgical Recovery</option>
                  <option value="chronic">Chronic Disease Management</option>
                  <option value="wound">Wound Care & Infusion</option>
                  <option value="other">Other/Not Sure</option>
                </select>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Inquiry'}
              </button>

              <div className={styles.trustBadge}>
                <strong>✓ Privacy Protected</strong> — Your information is secure. All inquiries sent to info@carnationhhc.com
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2>How It Works</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📞</div>
              <h3>1. Reach Out</h3>
              <p>Contact us with your care needs. We'll connect you with a care coordinator to discuss your situation.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👩‍⚕️</div>
              <h3>2. Personalized Assessment</h3>
              <p>Our expert team evaluates your health needs and creates a customized care plan tailored to you.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>❤️</div>
              <h3>3. Quality Care Begins</h3>
              <p>Start receiving professional, compassionate in-home care from our licensed nurses and therapists.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsContainer}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <h3>500+</h3>
              <p>Patients Served</p>
            </div>
            <div className={styles.statItem}>
              <h3>4.8★</h3>
              <p>Patient Satisfaction</p>
            </div>
            <div className={styles.statItem}>
              <h3>24/7</h3>
              <p>Emergency Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2>Ready to Get Started?</h2>
          <p>Let us help you regain your independence and live a healthier, happier life.</p>
          <p>
            <strong>Call us:</strong> (310) 774-0247 | <strong>Email:</strong> info@carnationhhc.com
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <p>&copy; 2026 Carnation Home Health Care. All rights reserved.</p>
          <p className={styles.contactInfo}>
            Serving Orange, Los Angeles, Riverside & Ventura Counties
          </p>
          <p style={{marginTop: '20px', fontSize: '12px', opacity: '0.7'}}>
            <a href="#" style={{color: '#ffd700', textDecoration: 'none'}}>Privacy Policy</a> | 
            <a href="#" style={{color: '#ffd700', textDecoration: 'none'}}> Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
