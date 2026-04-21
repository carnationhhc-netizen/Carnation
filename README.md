# Carnation Home Health Care - Landing Page

A modern, responsive landing page for lead capture built with Next.js, Supabase, and SendGrid.

## Features

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Lead capture form with validation
- ✅ Supabase database integration for lead storage
- ✅ SendGrid email integration for notifications
- ✅ Auto-confirmation emails to leads
- ✅ Admin notifications to info@carnationhhc.com
- ✅ Fast performance with Next.js

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account
- SendGrid account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/carnationhhc-netizen/Carnation.git
cd carnation-landing-page
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SENDGRID_API_KEY=your_sendgrid_api_key
NEXT_PUBLIC_SENDGRID_FROM_EMAIL=info@carnationhhc.com
```

4. Create Supabase table:
```sql
CREATE TABLE leads (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  zip TEXT NOT NULL,
  interested TEXT,
  source TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

5. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the GitHub repository
4. Add environment variables in Vercel settings
5. Deploy!

The site will be live automatically on every push to main.

## API Endpoints

### POST /api/submit-lead

Submits a new lead form.

**Request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(310) 555-0123",
  "zip": "90210",
  "interested": "skilled_nursing"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead submitted successfully",
  "data": { ... }
}
```

## Support

For issues or questions, contact: info@carnationhhc.com

## License

© 2026 Carnation Home Health Care. All rights reserved.
