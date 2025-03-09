import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { calculatePricesForOperators } from '@/lib/price-calculator';
import { sendPriceEmails } from '@/lib/email-sender';

export const dynamic = 'force-dynamic';

/**
 * API route to calculate daily prices and send emails to operators
 */
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // 1. Get today's rack prices
    const { data: rackPrices, error: rackPricesError } = await supabase
      .from('rack_prices')
      .select(`
        id, date, location_id, fuel_type_id, base_price, created_at,
        fuel_type:fuel_types(id, name)
      `)
      .eq('date', today);
      
    if (rackPricesError) {
      return NextResponse.json(
        { error: 'Failed to fetch rack prices', details: rackPricesError },
        { status: 500 }
      );
    }
    
    if (rackPrices.length === 0) {
      return NextResponse.json(
        { error: `No rack prices found for ${today}` },
        { status: 404 }
      );
    }
    
    // 2. Get all operators with their locations
    const { data: operators, error: operatorsError } = await supabase
      .from('operators')
      .select(`
        id, first_name, last_name, email, location_id, discount,
        location:locations(id, name, province_id)
      `)
      .not('location_id', 'is', null);
      
    if (operatorsError) {
      return NextResponse.json(
        { error: 'Failed to fetch operators', details: operatorsError },
        { status: 500 }
      );
    }
    
    if (operators.length === 0) {
      return NextResponse.json(
        { error: 'No operators found' },
        { status: 404 }
      );
    }
    
    // 3. Get tax rates for all provinces and fuel types
    const { data: taxRates, error: taxRatesError } = await supabase
      .from('tax_rates')
      .select(`
        id, province_id, fuel_type_id, carbon_tax, provincial_road_tax, federal_excise_tax,
        fuel_type:fuel_types(id, name)
      `);
      
    if (taxRatesError) {
      return NextResponse.json(
        { error: 'Failed to fetch tax rates', details: taxRatesError },
        { status: 500 }
      );
    }
    
    // 4. Calculate prices for all operators
    const calculationResults = calculatePricesForOperators(
      operators as any, 
      rackPrices as any, 
      taxRates as any
    );
    
    // 5. Send emails with calculated prices
    const emailResults = await sendPriceEmails(calculationResults);
    
    return NextResponse.json({
      success: true,
      date: today,
      operatorsProcessed: calculationResults.length,
      emailsSent: calculationResults.length - emailResults.errors.length,
      emailErrors: emailResults.errors,
    });
  } catch (error) {
    console.error('Error in daily-prices API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to calculate and send daily prices', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
