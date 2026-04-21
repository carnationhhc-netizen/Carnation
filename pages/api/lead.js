// pages/api/lead.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, zip, message } = req.body || {};

  if (!name || !phone || !email || !zip) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const lead = {
    name: String(name).trim(),
    phone: String(phone).trim(),
    email: String(email).trim().toLowerCase(),
    zip: String(zip).trim(),
    message: message ? String(message).trim() : '',
    created_at: new Date().toISOString(),
  };

  // 1) Save to Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supaRes = await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(lead),
      });

      if (!supaRes.ok) {
        const txt = await supaRes.text();
        console.error('Supabase insert failed:', supaRes.status, txt);
      }
    }
  } catch (err) {
    console.error('Supabase error:', err);
  }

  // 2) Send email via SendGrid
  try {
    const sgKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.NEXT_PUBLIC_SENDGRID_FROM_EMAIL || 'info@carnationhhc.com';

    if (sgKey) {
      const emailBody = {
        personalizations: [{
          to: [{ email: 'info@carnationhhc.com' }],
          subject: `New Lead: ${lead.name} (${lead.zip})`,
        }],
        from: { email: fromEmail, name: 'Carnation Home Health' },
        reply_to: { email: lead.email, name: lead.name },
        content: [{
          type: 'text/plain',
          value:
            `New consultation request from carnationhhc.com\n\n` +
            `Name:    ${lead.name}\n` +
            `Phone:   ${lead.phone}\n` +
            `Email:   ${lead.email}\n` +
            `ZIP:     ${lead.zip}\n` +
            `Message: ${lead.message || '(none)'}\n\n` +
            `Submitted: ${lead.created_at}\n` +
            `Please contact within 2 hours.`,
        }],
      };

      const sgRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sgKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailBody),
      });

      if (!sgRes.ok) {
        const txt = await sgRes.text();
        console.error('SendGrid send failed:', sgRes.status, txt);
      }
    }
  } catch (err) {
    console.error('SendGrid error:', err);
  }

  return res.status(200).json({ ok: true });
}
