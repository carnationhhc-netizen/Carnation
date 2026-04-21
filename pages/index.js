import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [quizStep, setQuizStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [showForm, setShowForm] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zip: '',
    interested: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const quizQuestions = [
    {
      id: 'situation',
      question: "What brings you here today?",
      answers: [
        { text: "Recovering from surgery or hospital stay", value: "post_surgical" },
        { text: "Managing a chronic condition", value: "chronic" },
        { text: "Need help with daily activities", value: "personal_care" },
        { text: "Physical therapy or rehabilitation", value: "therapy" },
        { text: "Not sure — just exploring options", value: "other" }
      ]
    },
    {
      id: 'insurance',
      question: "How will you be paying for care?",
      answers: [
        { text: "Medicare", value: "medicare" },
        { text: "Private insurance", value: "private" },
        { text: "Out of pocket / Self-pay", value: "self_pay" },
        { text: "Medicaid", value: "medicaid" },
        { text: "Not sure yet", value: "unsure" }
      ]
    },
    {
      id: 'timeline',
      question: "When do you need care?",
      answers: [
        { text: "As soon as possible (this week)", value: "urgent" },
        { text: "Within the next 1-2 weeks", value: "soon" },
        { text: "Next month or later", value: "later" },
        { text: "Just gathering information", value: "research" }
      ]
    },
    {
      id: 'location',
      question: "What county are you in?",
      answers: [
        { text: "Los Angeles County", value: "la" },
        { text: "Orange County", value: "orange" },
        { text: "Riverside County", value: "riverside" },
        { text: "Ventura County", value: "ventura" },
        { text: "Not sure / Other", value: "other_county" }
      ]
    }
  ]

  const handleQuizAnswer = (value) => {
    const currentQuestion = quizQuestions[quizStep]
    setQuizAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
    
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1)
    } else {
      setShowForm(true)
    }
  }

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
        body: JSON.stringify({
          ...formData,
          quizAnswers
        })
      })

      const result = await response.json()

      if (response.ok) {
        setMessage('✅ Thank you! A care coordinator will call you within 2 hours.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          zip: '',
          interested: ''
        })
        setTimeout(() => {
          setShowForm(false)
          setQuizStep(0)
          setQuizAnswers({})
        }, 3000)
      } else {
        setMessage('❌ Error submitting form. Please try again or call (310) 774-0247.')
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('❌ Error submitting form. Please call (310) 774-0247.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Carnation Home Health Care | In-Home Care in Southern California</title>
        <meta name="description" content="Professional home health care in Southern California. Skilled nursing, therapy, and personal care services." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.container}>
        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.navContainer}>
            <div className={styles.logo}>🏥 Carnation</div>
            <div className={styles.navLinks}>
              <a href="#services">Services</a>
              <a href="#why-us">Why Us</a>
              <a href="tel:+13107740247" className={styles.phoneBtn}>📞 (310) 774-0247</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1>In the moments that matter most, you are not alone.</h1>
              <p className={styles.heroSubtitle}>High-quality in-home care that keeps you where you want to be — with the people you love.</p>
              <div className={styles.trustBadges}>
                <span className={styles.badge}>✓ Medicare Certified</span>
                <span className={styles.badge}>✓ Licensed Professionals</span>
                <span className={styles.badge}>✓ 24/7 Support</span>
              </div>
            </div>

          </div>
        </section>

        {/* Quiz Section */}
        {!showForm ? (
          <section className={styles.quizSection}>
            <div className={styles.quizContainer}>
              <h2>Let's Find the Right Care for You</h2>
              <p className={styles.quizSubtitle}>Just 3 quick questions to help us understand your needs</p>
              
              <div className={styles.quizBox}>
                <div className={styles.quizProgress}>
                  <div className={styles.progressBar} style={{width: `${((quizStep + 1) / quizQuestions.length) * 100}%`}}></div>
                </div>
                <p className={styles.quizCounter}>Question {quizStep + 1} of {quizQuestions.length}</p>
                
                <h3>{quizQuestions[quizStep].question}</h3>
                
                <div className={styles.quizAnswers}>
                  {quizQuestions[quizStep].answers.map((answer) => (
                    <button
                      key={answer.value}
                      className={styles.quizButton}
                      onClick={() => handleQuizAnswer(answer.value)}
                    >
                      {answer.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : (
          /* Contact Form Section */
          <section className={styles.formSection}>
            <div className={styles.formContainer}>
              <div className={styles.formHeader}>
                <h2>Get Started Today</h2>
                <p>Just a few more details and we'll connect you with a care coordinator</p>
              </div>

              {message && (
                <div className={styles.messageBox}>
                  {message}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroupRow}>
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
                </div>

                <div className={styles.formGroupRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
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

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Submitting...' : 'Get Care Coordinator Call (Within 2 Hours)'}
                </button>

                <p className={styles.privacyNote}>
                  ✓ Your information is secure and confidential<br/>
                  ✓ We'll call you within 2 hours during business hours
                </p>
              </form>

              <button 
                className={styles.backButton}
                onClick={() => {
                  setShowForm(false)
                  setQuizStep(Math.max(0, quizStep - 1))
                }}
              >
                ← Back to Quiz
              </button>
            </div>
          </section>
        )}

        {/* Services Section */}
        <section id="services" className={styles.services}>
          <div className={styles.servicesContainer}>
            <h2>Our Services</h2>
            <p className={styles.sectionSubtitle}>Comprehensive care tailored to your needs</p>
            
            <div className={styles.servicesGrid}>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>🏥</div>
                <h3>Skilled Nursing</h3>
                <p>Wound care, medication management, and medical monitoring by licensed RNs.</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>🏃</div>
                <h3>Physical Therapy</h3>
                <p>Restore strength, balance, and mobility after injury or surgery.</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>💊</div>
                <h3>Chronic Disease Management</h3>
                <p>Ongoing support for diabetes, heart disease, COPD, and more.</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>🔄</div>
                <h3>Post-Acute Recovery</h3>
                <p>Transitional care following hospital discharge or surgery.</p>
              </div>
              <div className={styles.serviceCard}>
                <div className={styles.serviceIcon}>🤝</div>
                <h3>Personal Care</h3>
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
                <h3>2 Hour</h3>
                <p>Response Time</p>
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
                    <p>Your goals drive every decision we make.</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.checkmark}>✓</span>
                  <div>
                    <h4>Expert Clinical Team</h4>
                    <p>Licensed RNs and therapists with years of experience.</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.checkmark}>✓</span>
                  <div>
                    <h4>2-Hour Response</h4>
                    <p>We get back to you within 2 hours of your inquiry.</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.checkmark}>✓</span>
                  <div>
                    <h4>Same-Day Scheduling</h4>
                    <p>Get care started same day or next day when urgent.</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.checkmark}>✓</span>
                  <div>
                    <h4>Insurance & Medicare</h4>
                    <p>We handle all billing and insurance verification.</p>
                  </div>
                </div>
                <div className={styles.benefit}>
                  <span className={styles.checkmark}>✓</span>
                  <div>
                    <h4>Compassionate Care</h4>
                    <p>People who genuinely care about your health.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.finalCta}>
          <div className={styles.ctaContainer}>
            <h2>Don't Wait. Get Care Today.</h2>
            <p>Call our care coordinators anytime. We're here to help.</p>
            <div className={styles.ctaButtons}>
              <a href="tel:+13107740247" className={styles.ctaPhone}>
                📞 (310) 774-0247
              </a>
              <button 
                className={styles.ctaPrimary}
                onClick={() => {
                  setShowForm(false)
                  setQuizStep(0)
                  setQuizAnswers({})
                  window.scrollTo({top: 0, behavior: 'smooth'})
                }}
              >
                Start the Quiz
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerContainer}>
            <div className={styles.footerContent}>
              <h4>Carnation Home Health Care</h4>
              <p>Professional in-home care for seniors and adults in Southern California.</p>
              <p><strong>Service Area:</strong> Orange, Los Angeles, Riverside & Ventura Counties</p>
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
