import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import { createServerSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface RackPriceCSVRow {
  Date: string;
  Location: string;
  'Fuel Type': string;
  Price: string;
  [key: string]: string;
}

/**
 * API route to fetch rack prices from Petro-Canada CSV and store in database
 */
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    // Fetch CSV from source URL
    const csvUrl = process.env.RACK_PRICES_URL;
    if (!csvUrl) {
      return NextResponse.json(
        { error: 'RACK_PRICES_URL environment variable not set' },
        { status: 500 }
      );
    }
    
    const response = await fetch(csvUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch rack prices CSV: ${response.statusText}` },
        { status: 500 }
      );
    }
    
    const csvText = await response.text();
    
    // Parse CSV
    const { data, errors } = Papa.parse<RackPriceCSVRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep as strings for now for parsing safety
    });
    
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Error parsing CSV', details: errors },
        { status: 500 }
      );
    }
    
    // Process the data and insert into database
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    let insertedCount = 0;
    const errors2: any[] = [];
    
    for (const row of data) {
      try {
        // Get location ID from name
        const { data: locationData } = await supabase
          .from('locations')
          .select('id')
          .eq('name', row.Location)
          .single();
          
        if (!locationData?.id) {
          errors2.push(`Location not found: ${row.Location}`);
          continue;
        }
        
        // Get fuel type ID from name
        const { data: fuelTypeData } = await supabase
          .from('fuel_types')
          .select('id')
          .eq('name', row['Fuel Type'])
          .single();
          
        if (!fuelTypeData?.id) {
          errors2.push(`Fuel type not found: ${row['Fuel Type']}`);
          continue;
        }
        
        // Parse price (convert from string to number)
        const basePrice = parseFloat(row.Price);
        if (isNaN(basePrice)) {
          errors2.push(`Invalid price format: ${row.Price}`);
          continue;
        }
        
        // Insert into rack_prices table
        const { error } = await supabase.from('rack_prices').upsert({
          date: today,
          location_id: locationData.id,
          fuel_type_id: fuelTypeData.id,
          base_price: basePrice,
        }, {
          onConflict: 'date,location_id,fuel_type_id',
        });
        
        if (error) {
          errors2.push(`Database error: ${error.message}`);
          continue;
        }
        
        insertedCount++;
      } catch (error) {
        errors2.push(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      date: today,
      totalRows: data.length,
      inserted: insertedCount,
      errors: errors2,
    });
  } catch (error) {
    console.error('Error in fetch-prices API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch and process rack prices', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
