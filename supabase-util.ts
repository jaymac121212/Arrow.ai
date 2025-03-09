import { createClient } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      provinces: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
      };
      locations: {
        Row: {
          id: number;
          name: string;
          province_id: number;
        };
        Insert: {
          id?: number;
          name: string;
          province_id: number;
        };
        Update: {
          id?: number;
          name?: string;
          province_id?: number;
        };
      };
      fuel_types: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
      };
      tax_rates: {
        Row: {
          id: number;
          province_id: number;
          fuel_type_id: number;
          carbon_tax: number;
          provincial_road_tax: number;
          federal_excise_tax: number;
        };
        Insert: {
          id?: number;
          province_id: number;
          fuel_type_id: number;
          carbon_tax: number;
          provincial_road_tax: number;
          federal_excise_tax: number;
        };
        Update: {
          id?: number;
          province_id?: number;
          fuel_type_id?: number;
          carbon_tax?: number;
          provincial_road_tax?: number;
          federal_excise_tax?: number;
        };
      };
      operators: {
        Row: {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
          location_id: number | null;
          discount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          first_name: string;
          last_name: string;
          email: string;
          location_id?: number | null;
          discount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          first_name?: string;
          last_name?: string;
          email?: string;
          location_id?: number | null;
          discount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      rack_prices: {
        Row: {
          id: number;
          date: string;
          location_id: number;
          fuel_type_id: number;
          base_price: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          date: string;
          location_id: number;
          fuel_type_id: number;
          base_price: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          date?: string;
          location_id?: number;
          fuel_type_id?: number;
          base_price?: number;
          created_at?: string;
        };
      };
      email_logs: {
        Row: {
          id: number;
          operator_id: number;
          sent_at: string;
          status: string;
          error_message: string | null;
          price_data: any | null;
        };
        Insert: {
          id?: number;
          operator_id: number;
          sent_at?: string;
          status: string;
          error_message?: string | null;
          price_data?: any | null;
        };
        Update: {
          id?: number;
          operator_id?: number;
          sent_at?: string;
          status?: string;
          error_message?: string | null;
          price_data?: any | null;
        };
      };
    };
  };
};

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// For server-side access with service role key
export const createServerSupabaseClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient<Database>(supabaseUrl, serviceRoleKey);
};
