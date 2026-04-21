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
    const { name, email, phone, zip, interested } = req.body

    // Validate required fields
    if (!name || !email || !phone || !zip) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name,
          email,
          phone,
          zip,
          interested,
          created_at: new Date().toISOString(),
          source: 'landing_page'
        }
      ])

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Failed to save lead' })
    }

    // Send email to info@carnationhhc.com
    const msg = {
      to: 'info@carnationhhc.com',
      from: process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL,
      subject: `New Lead: ${name} - Carnation Home Health Care`,
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Zip Code:</strong> ${zip}</p>
        <p><strong>Interested In:</strong> ${interested || 'Not specified'}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p>Please follow up with this lead as soon as possible.</p>
      `
    }

    await sgMail.send(msg)

    // Send confirmation email to lead
    const confirmMsg = {
      to: email,
      from: process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL,
      subject: 'Thank You for Your Inquiry - Carnation Home Health Care',
      html: `
        <h2>Thank You for Your Interest!</h2>
        <p>Hi ${name},</p>
        <p>We've received your inquiry about our home health care services. Our team will contact you shortly at ${phone} to discuss your care needs.</p>
        <p>In the meantime, feel free to call us at <strong>(310) 774-0247</strong> if you have any questions.</p>
        <br>
        <p>Best regards,<br>
        <strong>Carnation Home Health Care</strong><br>
        Serving Orange, Los Angeles, Riverside & Ventura Counties<br>
        Email: info@carnationhhc.com<br>
        Phone: (310) 774-0247</p>
      `
    }

    await sgMail.send(confirmMsg)

    return res.status(200).json({ 
      success: true, 
      message: 'Lead submitted successfully',
      data 
    })

  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
