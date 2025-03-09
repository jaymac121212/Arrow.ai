# Fuel Price Automation System

This application automates the generation and distribution of daily fuel prices for gas station operators. It fetches rack prices, calculates individual prices based on tax rates and operator discounts, and emails the results.

## Tech Stack

- **Frontend**: Next.js 15.x, React 19.x
- **UI Components**: ShadCN UI (Radix UI + Tailwind)
- **State Management**: Zustand
- **Backend**: Supabase
- **Testing**: Jest and React Testing Library
- **Package Manager**: pnpm
- **Deployment**: Vercel

## Features

1. **Daily Rack Price Fetching**
   - Fetches rack prices from Petro-Canada CSV file
   - Scheduled daily at 5:00 AM EST/EDT
   - Stores prices in Supabase database

2. **Price Calculation**
   - Calculates prices using the formula: Final Price = Base Rack Price + Carbon Tax + Provincial Road Tax + Federal Excise Tax - Operator Discount
   - Applies operator-specific discounts
   - Rounds prices to 4 decimal places

3. **Email Distribution**
   - Sends personalized emails to operators with their daily prices
   - Uses Nodemailer with SMTP
   - Logs email sending status

4. **Admin Interface**
   - Secure dashboard to manage operators
   - Edit tax rates by province and fuel type
   - View email logs and troubleshoot delivery issues

## Setup Instructions

1. **Install Dependencies**

```bash
pnpm install
```

2. **Environment Variables**

Copy `.env.example` to `.env.local` and fill in the required values:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-email-password
EMAIL_FROM=fuel-prices@yourdomain.com

# App Config
RACK_PRICES_URL=https://www.petro-canada.ca/en/business/rack-prices.csv
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Setup Supabase**

Run the SQL script in `supabase/schema.sql` to create the database schema. You can do this through the Supabase SQL editor.

4. **Run Development Server**

```bash
pnpm dev
```

5. **Running Tests**

```bash
pnpm test
```

## Deployment

This application is designed to be deployed on Vercel:

1. Push to a Git repository
2. Import the repository in Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy

The `vercel.json` file includes the cron job configuration that will automatically trigger price fetching and email distribution.

## Architecture

### Database Schema

- **`provinces`**: `id`, `name` (e.g., "Ontario")
- **`locations`**: `id`, `name` (e.g., "Toronto, ON"), `province_id`
- **`fuel_types`**: `id`, `name` (e.g., "REG 87")
- **`tax_rates`**: `id`, `province_id`, `fuel_type_id`, `carbon_tax`, `provincial_road_tax`, `federal_excise_tax`
- **`operators`**: `id`, `first_name`, `last_name`, `email`, `location_id`, `discount`
- **`rack_prices`**: `id`, `date`, `location_id`, `fuel_type_id`, `base_price`
- **`email_logs`**: `id`, `operator_id`, `sent_at`, `status`, `error_message`

### API Routes

- **/api/fetch-prices**: Fetches rack prices from Petro-Canada CSV
- **/api/daily-prices**: Calculates and emails prices to operators

### Scheduled Tasks

- **Rack Price Fetching**: Daily at 5:00 AM EST/EDT (10:00 AM UTC)
- **Price Calculation & Emailing**: Daily at 5:15 AM EST/EDT (10:15 AM UTC)

## License

This project is licensed under the MIT License.
