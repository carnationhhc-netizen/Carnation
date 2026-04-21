import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zip: '',
    interested: '',
    userType: 'patient'
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
        setMessage('✅ Thank you! Your inquiry has been received. Our care team will contact you within 24 hours.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          zip: '',
          interested: '',
          userType: 'patient'
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
    <>
      <Head>
        <title>Carnation Home Health Care | Compassionate In-Home Care</title>
        <meta name="description" content="Professional home health care in Southern California. Skilled nursing, therapy, and personal care services." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.container}>
        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.navContainer}>
            <div className={styles.logo}>Carnation</div>
            <div className={styles.navLinks}>
              <a href="#services">Services</a>
              <a href="#why-us">Why Us</a>
              <a href="#contact">Contact</a>
              <a href="#physician" className={styles.physicianLink}>For Physicians</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1>In the moments that matter most, you are not alone.</h1>
              <p className={styles.heroSubtitle}>High-quality in-home care that keeps you where you want to be — with the people you love.</p>
              <div className={styles.heroButtons}>
                <button className={styles.primaryBtn} onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}>
                  Get Care Today
                </button>
                <button className={styles.secondaryBtn} onClick={() => document.getElementById('physician-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  Physician Referrals
                </button>
              </div>
              <div className={styles.trustBadges}>
                <span className={styles.badge}>✓ Medicare Certified</span>
                <span className={styles.badge}>✓ Licensed Professionals</span>
                <span className={styles.badge}>✓ 24/7 Support</span>
              </div>
            </div>
            <div className={styles.heroImage}>
              <div className={styles.imagePlaceholder}>
                [Professional home care image]
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className={styles.services}>
          <div className={styles.servicesContainer}>
            <h2>Our Services</h2>
            <p className={styles.sectionSubtitle}>Comprehensive care tailored to your needs</p>
            
            <div className={styles.servicesGrid}>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>🏥</div>
                <h3>Skilled Nursing Care</h3>
                <p>Expert wound care, medication management, and medical monitoring in your home.</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>🏃</div>
                <h3>Rehabilitation Therapy</h3>
                <p>Physical, occupational, and speech therapy to restore mobility and independence.</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>💊</div>
                <h3>Chronic Disease Management</h3>
                <p>Ongoing support for diabetes, heart disease, COPD, and other chronic conditions.</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>🔄</div>
                <h3>Post-Acute Recovery</h3>
                <p>Transitional care following hospital discharge or surgery.</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>🤝</div>
                <h3>Personal Care Services</h3>
                <p>Assistance with daily living activities and personal care needs.</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>🌙</div>
                <h3>24/7 Emergency Support</h3>
                <p>Always available when you need us, day or night.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Carnation Section */}
        <section id="why-us" className={styles.whyUs}>
          <div className={styles.whyUsContainer}>
            <h2>Why Choose Carnation</h2>
            
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <h3>500+</h3>
                <p>Patients Cared For</p>
              </div>
              <div className={styles.statCard}>
                <h3>4.8★</h3>
                <p>Patient Satisfaction</p>
              </div>
              <div className={styles.statCard}>
                <h3>24/7</h3>
                <p>Emergency Support</p>
              </div>
              <div className={styles.statCard}>
                <h3>99%</h3>
                <p>Insurance Accepted</p>
              </div>
            </div>

            <div className={styles.benefitsSection}>
              <h3>What Sets Us Apart</h3>
              <div className={styles.benefitsGrid}>
                <div className={styles.benefit}>
                  <span className={styles.checkmark}>✓</span>
                  <div>
                    <h4>Patient-Centered Care</h4>
                    <p>Your goals and comfort drive every decision we make.</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.checkmark}>✓</span>
                  <div>
                    <h4>Expert Clinical Team</h4>
                    <p>Licensed RNs, therapists, and care coordinators with years of experience.</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.checkmark}>✓</span>
                  <div>
                    <h4>Seamless Coordination</h4>
                    <p>We work directly with your physicians to ensure continuity of care.</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.checkmark}>✓</span>
                  <div>
                    <h4>Same-Day Scheduling</h4>
                    <p>Get care started as soon as you need it — often same day or next day.</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.checkmark}>✓</span>
                  <div>
                    <h4>Insurance & Medicare</h4>
                    <p>In-network with major insurers. We handle all billing and verification.</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.checkmark}>✓</span>
                  <div>
                    <h4>Compassionate Professionals</h4>
                    <p>People who genuinely care about your health and independence.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Inquiry Form Section */}
        <section id="inquiry-form" className={styles.inquirySection}>
          <div className={styles.inquiryContainer}>
            <div className={styles.inquiryContent}>
              <h2>Ready to Get Started?</h2>
              <p>Tell us about your care needs and we'll connect you with a care coordinator who can help.</p>

              {message && (
                <div className={styles.messageBox}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formTabs}>
                  <label className={styles.radioGroup}>
                    <input
                      type="radio"
                      name="userType"
                      value="patient"
                      checked={formData.userType === 'patient'}
                      onChange={handleChange}
                    />
                    <span>I'm a Patient/Family</span>
                  </label>
                  <label className={styles.radioGroup}>
                    <input
                      type="radio"
                      name="userType"
                      value="physician"
                      checked={formData.userType === 'physician'}
                      onChange={handleChange}
                    />
                    <span>I'm a Physician</span>
                  </label>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
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
                      placeholder="john@example.com"
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
                      placeholder="(310) 555-0123"
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
                      placeholder="90210"
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="interested">What type of care are you interested in?</label>
                  <select
                    id="interested"
                    name="interested"
                    value={formData.interested}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">-- Select an option --</option>
                    <option value="skilled_nursing">Skilled Nursing Care</option>
                    <option value="therapy">Rehabilitation Therapy</option>
                    <option value="post_surgical">Post-Surgical Recovery</option>
                    <option value="chronic">Chronic Disease Management</option>
                    <option value="personal_care">Personal Care Services</option>
                    <option value="other">Other/Not Sure</option>
                  </select>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Submitting...' : 'Request Care Information'}
                </button>

                <p className={styles.privacyNote}>
                  Your information is secure and confidential. We'll respond within 24 hours.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Physician Section */}
        <section id="physician-section" className={styles.physicianSection}>
          <div className={styles.physicianContainer}>
            <h2>For Physicians & Healthcare Providers</h2>
            <p className={styles.sectionSubtitle}>Seamless referral partnership for your patients' home care needs</p>

            <div className={styles.physicianBenefits}>
              <div className={styles.physicianCard}>
                <h3>Why Refer to Carnation</h3>
                <ul>
                  <li>✓ Seamless referral process — one order, we handle the rest</li>
                  <li>✓ Real-time updates on patient progress</li>
                  <li>✓ Reduces hospital readmissions</li>
                  <li>✓ Improves patient compliance</li>
                  <li>✓ Integrated EMR compatibility</li>
                  <li>✓ Medicare certified and fully compliant</li>
                </ul>
                <a href="#inquiry-form" className={styles.physicianBtn}>
                  Learn More / Set Up Referrals
                </a>
              </div>

              <div className={styles.physicianCard}>
                <h3>Quick Contact</h3>
                <p><strong>Referral Line:</strong> (310) 774-0247</p>
                <p><strong>Fax:</strong> (844) 714-7311</p>
                <p><strong>Email:</strong> info@carnationhhc.com</p>
                <p style={{marginTop: '20px', fontSize: '14px', color: '#666'}}>
                  Available Monday-Friday, 8am-6pm PST
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.finalCta}>
          <div className={styles.ctaContainer}>
            <h2>Don't Wait. Get Care Today.</h2>
            <p>Whether you're recovering from surgery, managing a chronic condition, or need support at home, we're here to help.</p>
            <div className={styles.ctaButtons}>
              <button className={styles.primaryBtn} onClick={() => document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Request Care
              </button>
              <a href="tel:+13107740247" className={styles.phoneBtn}>
                Call (310) 774-0247
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContainer}>
            <div className={styles.footerContent}>
              <h4>Carnation Home Health Care</h4>
              <p>Compassionate, professional in-home care for seniors and adults.</p>
              <p><strong>Serving:</strong> Orange, Los Angeles, Riverside & Ventura Counties</p>
            </div>
            <div className={styles.footerContact}>
              <p><strong>Phone:</strong> (310) 774-0247</p>
              <p><strong>Email:</strong> info@carnationhhc.com</p>
              <p><strong>Fax:</strong> (844) 714-7311</p>
            </div>
            <div className={styles.footerLegal}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Accessibility</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2026 Carnation Home Health Care. All rights reserved. Medicare Certified | Licensed Home Health Agency</p>
          </div>
        </footer>
      </div>
    </>
  )
}
