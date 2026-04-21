import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

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

    return res.status(200).json({ 
      success: true, 
      message: 'Lead submitted successfully. Our team will contact you within 2 hours.',
      data 
    })

  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    })
  }
}
