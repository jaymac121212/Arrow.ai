import nodemailer from 'nodemailer';
import { PriceCalculationResult } from './price-calculator';
import { createServerSupabaseClient } from './supabase';

/**
 * Send price emails to operators and log the results
 */
export const sendPriceEmails = async (
  calculationResults: PriceCalculationResult[]
): Promise<{ success: boolean; errors: any[] }> {
  const errors: any[] = [];

  // Create email transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const supabase = createServerSupabaseClient();
  
  // Send email to each operator
  for (const result of calculationResults) {
    try {
      // Format the email content
      const emailContent = formatEmailContent(result);
      
      // Send the email
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: result.operatorEmail,
        subject: `Daily Fuel Prices - ${new Date().toLocaleDateString()}`,
        html: emailContent,
      });
      
      // Log successful email
      await supabase.from('email_logs').insert({
        operator_id: result.operatorId,
        status: 'sent',
        price_data: result.prices,
      });
    } catch (error) {
      // Log error in database
      await supabase.from('email_logs').insert({
        operator_id: result.operatorId,
        status: 'error',
        error_message: error instanceof Error ? error.message : String(error),
        price_data: result.prices,
      });
      
      errors.push({
        operatorId: result.operatorId,
        operatorEmail: result.operatorEmail,
        error,
      });
    }
  }
  
  return {
    success: errors.length === 0,
    errors,
  };
};

/**
 * Format the email content as HTML
 */
const formatEmailContent = (result: PriceCalculationResult): string => {
  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const priceRows = result.prices.map(price => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${price.fuelTypeName}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${price.finalPrice.toFixed(4)}</td>
    </tr>
  `).join('');
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Daily Fuel Prices</h2>
      <p>Hello ${result.operatorName},</p>
      <p>Here are your fuel prices for ${date} at ${result.location}:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd; background-color: #f2f2f2;">Fuel Type</th>
            <th style="padding: 8px; text-align: right; border: 1px solid #ddd; background-color: #f2f2f2;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${priceRows}
        </tbody>
      </table>
      
      <p style="margin-top: 20px;">These prices have been calculated based on today's rack prices with your specific discount applied.</p>
      
      <p>Thank you,<br>Fuel Price Automation System</p>
    </div>
  `;
};
