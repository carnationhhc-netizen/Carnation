import { createClient } from '@supabase/supabase-js'
import sgMail from '@sendgrid/mail'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { name, email, phone, zip, quizAnswers } = req.body

    // Validate required fields
    if (!name || !phone || !zip) {
      return res.status(400).json({ error: 'Missing required fields: name, phone, zip' })
    }

    // Extract quiz answers
    const situation = quizAnswers?.situation || null
    const insurance = quizAnswers?.insurance || null
    const timeline = quizAnswers?.timeline || null
    const county = quizAnswers?.location || null

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

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Failed to save lead', details: error.message })
    }

    // Format quiz answers for email
    const quizDisplay = `
      <strong>Care Situation:</strong> ${situation?.replace(/_/g, ' ') || 'Not specified'}<br>
      <strong>Insurance/Payment:</strong> ${insurance?.replace(/_/g, ' ') || 'Not specified'}<br>
      <strong>Timeline:</strong> ${timeline?.replace(/_/g, ' ') || 'Not specified'}<br>
      <strong>County:</strong> ${county?.replace(/_/g, ' ') || 'Not specified'}
    `

    // Send email to info@carnationhhc.com
    const msg = {
      to: 'info@carnationhhc.com',
      from: process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL,
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
            ${quizDisplay}
          </div>
          
          <h3 style="color: #333; margin-top: 20px;">Action Items</h3>
          <ul style="color: #666;">
            <li>Call ${phone} within 2 hours to confirm care needs</li>
            <li>Verify insurance coverage if needed</li>
            <li>Schedule in-home assessment</li>
          </ul>
          
          <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">
            Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} (PST)<br>
            Source: Landing Page (https://carnation-ten.vercel.app)
          </p>
        </div>
      `
    }

    await sgMail.send(msg)

    // Send confirmation email to lead
    const confirmMsg = {
      to: email || 'noreply@carnationhhc.com',
      from: process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL,
      subject: 'Thank You for Your Inquiry - Carnation Home Health Care',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">Thank You for Your Interest!</h2>
          
          <p>Hi ${name},</p>
          
          <p>We've received your inquiry about our home health care services. Our care team will contact you within <strong>2 hours</strong> at <strong>${phone}</strong> to discuss your needs and get you started.</p>
          
          <h3 style="color: #333;">In the meantime:</h3>
          <ul style="color: #666;">
            <li>Have your insurance card handy (if applicable)</li>
            <li>Prepare a list of current medications</li>
            <li>Think about your care goals and preferences</li>
          </ul>
          
          <h3 style="color: #333;">Need help sooner?</h3>
          <p style="font-size: 16px; margin: 15px 0;">
            <strong>Call us anytime:</strong> <a href="tel:+13107740247" style="color: #1e40af; text-decoration: none; font-weight: bold;">(310) 774-0247</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #666; font-size: 13px;">
            <strong>Carnation Home Health Care</strong><br>
            Serving Orange, Los Angeles, Riverside & Ventura Counties<br>
            Email: <a href="mailto:info@carnationhhc.com" style="color: #1e40af; text-decoration: none;">info@carnationhhc.com</a><br>
            Phone: <a href="tel:+13107740247" style="color: #1e40af; text-decoration: none;">(310) 774-0247</a><br>
            Fax: (844) 714-7311<br><br>
            Medicare Certified | Licensed Home Health Agency
          </p>
        </div>
      `
    }

    // Only send confirmation if email was provided
    if (email) {
      await sgMail.send(confirmMsg)
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Lead submitted successfully. Our team will contact you within 2 hours.',
      data 
    })

  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Internal server error', details: error.message })
  }
}
