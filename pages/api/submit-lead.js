import { createClient } from '@supabase/supabase-js'
import sgMail from '@sendgrid/mail'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, phone, zip, quizAnswers } = req.body

    console.log('Received data:', { name, email, phone, zip, quizAnswers })

    // Validate required fields
    if (!name || !phone || !zip) {
      console.log('Validation failed: missing name, phone, or zip')
      return res.status(400).json({ 
        error: 'Missing required fields: name, phone, zip',
        received: { name, phone, zip }
      })
    }

    // Extract quiz answers
    const situation = quizAnswers?.situation || null
    const insurance = quizAnswers?.insurance || null
    const timeline = quizAnswers?.timeline || null
    const county = quizAnswers?.location || null

    console.log('Attempting to insert into Supabase...')

    // Save to Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name,
          email: email || null,
          phone,
          zip,
          situation,
          insurance,
          timeline,
          county,
          source: 'landing_page'
        }
      ])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ 
        error: 'Failed to save lead to database',
        details: error.message,
        code: error.code
      })
    }

    console.log('Successfully inserted lead:', data)

    // Try to send emails (but don't fail if they don't send)
    let emailsSent = false
    let emailError = null

    try {
      if (!process.env.SENDGRID_API_KEY) {
        console.warn('SENDGRID_API_KEY not set, skipping emails')
      } else {
        // Send email to info@carnationhhc.com
        const msg = {
          to: 'info@carnationhhc.com',
          from: 'info@carnationhhc.com',
          subject: `🔴 NEW LEAD: ${name} - ${phone}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e40af;">New Lead Submission</h2>
              
              <h3 style="color: #333; margin-top: 20px;">Contact Information</h3>
              <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0;"><strong>Phone:</strong> ${phone}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${email || 'Not provided'}</p>
              <p style="margin: 8px 0;"><strong>Zip Code:</strong> ${zip}</p>
              
              <h3 style="color: #333; margin-top: 20px;">Care Needs & Background</h3>
              <div style="background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
                <p style="margin: 8px 0;"><strong>Care Situation:</strong> ${situation?.replace(/_/g, ' ') || 'Not specified'}</p>
                <p style="margin: 8px 0;"><strong>Insurance/Payment:</strong> ${insurance?.replace(/_/g, ' ') || 'Not specified'}</p>
                <p style="margin: 8px 0;"><strong>Timeline:</strong> ${timeline?.replace(/_/g, ' ') || 'Not specified'}</p>
                <p style="margin: 8px 0;"><strong>County:</strong> ${county?.replace(/_/g, ' ') || 'Not specified'}</p>
              </div>
              
              <h3 style="color: #333; margin-top: 20px;">Action Items</h3>
              <ul style="color: #666;">
                <li>Call ${phone} within 2 hours to confirm care needs</li>
                <li>Verify insurance coverage if needed</li>
                <li>Schedule in-home assessment</li>
              </ul>
              
              <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
                Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} (PST)<br>
                Source: Landing Page
              </p>
            </div>
          `
        }

        console.log('Sending email to info@carnationhhc.com...')
        await sgMail.send(msg)
        console.log('Email sent to info@carnationhhc.com')
        emailsSent = true

        // Send confirmation email to lead if email provided
        if (email) {
          const confirmMsg = {
            to: email,
            from: 'info@carnationhhc.com',
            subject: 'Thank You for Your Inquiry - Carnation Home Health Care',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #1e40af;">Thank You for Your Interest!</h2>
                
                <p>Hi ${name},</p>
                
                <p>We've received your inquiry about our home health care services. Our care team will contact you within <strong>2 hours</strong> at <strong>${phone}</strong> to discuss your needs and get you started.</p>
                
                <p>In the meantime, feel free to call us at <strong>(310) 774-0247</strong> if you have any questions.</p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                
                <p style="color: #666; font-size: 13px;">
                  <strong>Carnation Home Health Care</strong><br>
                  Email: <a href="mailto:info@carnationhhc.com" style="color: #1e40af; text-decoration: none;">info@carnationhhc.com</a><br>
                  Phone: <a href="tel:+13107740247" style="color: #1e40af; text-decoration: none;">(310) 774-0247</a><br>
                  Medicare Certified | Licensed Home Health Agency
                </p>
              </div>
            `
          }

          console.log(`Sending confirmation email to ${email}...`)
          await sgMail.send(confirmMsg)
          console.log(`Confirmation email sent to ${email}`)
        }
      }
    } catch (emailErr) {
      console.error('Email sending error:', emailErr.message)
      emailError = emailErr.message
      // Don't fail the whole request if emails don't send
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Lead submitted successfully. Our team will contact you within 2 hours.',
      data,
      emailsSent,
      emailError
    })

  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    })
  }
}
