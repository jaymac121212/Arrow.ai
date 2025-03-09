import { create } from 'zustand';
import { supabase } from './supabase';
import { Database } from './supabase';

type Province = Database['public']['Tables']['provinces']['Row'];
type Location = Database['public']['Tables']['locations']['Row'];
type FuelType = Database['public']['Tables']['fuel_types']['Row'];
type TaxRate = Database['public']['Tables']['tax_rates']['Row'];
type Operator = Database['public']['Tables']['operators']['Row'];
type RackPrice = Database['public']['Tables']['rack_prices']['Row'];
type EmailLog = Database['public']['Tables']['email_logs']['Row'];

interface AppState {
  // Data
  provinces: Province[];
  locations: Location[];
  fuelTypes: FuelType[];
  taxRates: TaxRate[];
  operators: Operator[];
  rackPrices: RackPrice[];
  emailLogs: EmailLog[];
  
  // Loading states
  loadingProvinces: boolean;
  loadingLocations: boolean;
  loadingFuelTypes: boolean;
  loadingTaxRates: boolean;
  loadingOperators: boolean;
  loadingRackPrices: boolean;
  loadingEmailLogs: boolean;
  
  // Action states
  processingAction: boolean;
  
  // Fetch data actions
  fetchProvinces: () => Promise<void>;
  fetchLocations: () => Promise<void>;
  fetchFuelTypes: () => Promise<void>;
  fetchTaxRates: () => Promise<void>;
  fetchOperators: () => Promise<void>;
  fetchRackPrices: (date?: string) => Promise<void>;
  fetchEmailLogs: () => Promise<void>;
  
  // CRUD operations
  createOperator: (operator: Omit<Operator, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateOperator: (id: number, updates: Partial<Omit<Operator, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
  deleteOperator: (id: number) => Promise<void>;
  
  updateTaxRate: (id: number, updates: Partial<Omit<TaxRate, 'id'>>) => Promise<void>;
  
  // Utility actions
  triggerFetchPrices: () => Promise<any>;
  triggerDailyPrices: () => Promise<any>;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial data
  provinces: [],
  locations: [],
  fuelTypes: [],
  taxRates: [],
  operators: [],
  rackPrices: [],
  emailLogs: [],
  
  // Initial loading states
  loadingProvinces: false,
  loadingLocations: false,
  loadingFuelTypes: false,
  loadingTaxRates: false,
  loadingOperators: false,
  loadingRackPrices: false,
  loadingEmailLogs: false,
  
  // Initial action states
  processingAction: false,
  
  // Fetch data actions
  fetchProvinces: async () => {
    set({ loadingProvinces: true });
    try {
      const { data, error } = await supabase.from('provinces').select('*');
      if (error) throw error;
      set({ provinces: data || [] });
    } catch (error) {
      console.error('Error fetching provinces:', error);
    } finally {
      set({ loadingProvinces: false });
    }
  },
  
  fetchLocations: async () => {
    set({ loadingLocations: true });
    try {
      const { data, error } = await supabase.from('locations').select('*');
      if (error) throw error;
      set({ locations: data || [] });
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      set({ loadingLocations: false });
    }
  },
  
  fetchFuelTypes: async () => {
    set({ loadingFuelTypes: true });
    try {
      const { data, error } = await supabase.from('fuel_types').select('*');
      if (error) throw error;
      set({ fuelTypes: data || [] });
    } catch (error) {
      console.error('Error fetching fuel types:', error);
    } finally {
      set({ loadingFuelTypes: false });
    }
  },
  
  fetchTaxRates: async () => {
    set({ loadingTaxRates: true });
    try {
      const { data, error } = await supabase.from('tax_rates').select('*');
      if (error) throw error;
      set({ taxRates: data || [] });
    } catch (error) {
      console.error('Error fetching tax rates:', error);
    } finally {
      set({ loadingTaxRates: false });
    }
  },
  
  fetchOperators: async () => {
    set({ loadingOperators: true });
    try {
      const { data, error } = await supabase.from('operators').select('*');
      if (error) throw error;
      set({ operators: data || [] });
    } catch (error) {
      console.error('Error fetching operators:', error);
    } finally {
      set({ loadingOperators: false });
    }
  },
  
  fetchRackPrices: async (date) => {
    set({ loadingRackPrices: true });
    try {
      let query = supabase.from('rack_prices').select('*');
      
      if (date) {
        query = query.eq('date', date);
      } else {
        // Get most recent date by default
        query = query.order('date', { ascending: false }).limit(20);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      set({ rackPrices: data || [] });
    } catch (error) {
      console.error('Error fetching rack prices:', error);
    } finally {
      set({ loadingRackPrices: false });
    }
  },
  
  fetchEmailLogs: async () => {
    set({ loadingEmailLogs: true });
    try {
      const { data, error } = await supabase
        .from('email_logs')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      set({ emailLogs: data || [] });
    } catch (error) {
      console.error('Error fetching email logs:', error);
    } finally {
      set({ loadingEmailLogs: false });
    }
  },
  
  // CRUD operations
  createOperator: async (operator) => {
    set({ processingAction: true });
    try {
      const { error } = await supabase.from('operators').insert(operator);
      if (error) throw error;
      await get().fetchOperators();
    } catch (error) {
      console.error('Error creating operator:', error);
      throw error;
    } finally {
      set({ processingAction: false });
    }
  },
  
  updateOperator: async (id, updates) => {
    set({ processingAction: true });
    try {
      const { error } = await supabase
        .from('operators')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      await get().fetchOperators();
    } catch (error) {
      console.error('Error updating operator:', error);
      throw error;
    } finally {
      set({ processingAction: false });
    }
  },
  
  deleteOperator: async (id) => {
    set({ processingAction: true });
    try {
      const { error } = await supabase
        .from('operators')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await get().fetchOperators();
    } catch (error) {
      console.error('Error deleting operator:', error);
      throw error;
    } finally {
      set({ processingAction: false });
    }
  },
  
  updateTaxRate: async (id, updates) => {
    set({ processingAction: true });
    try {
      const { error } = await supabase
        .from('tax_rates')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      await get().fetchTaxRates();
    } catch (error) {
      console.error('Error updating tax rate:', error);
      throw error;
    } finally {
      set({ processingAction: false });
    }
  },
  
  // Utility actions
  triggerFetchPrices: async () => {
    set({ processingAction: true });
    try {
      const response = await fetch('/api/fetch-prices', {
        method: 'GET',
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch prices');
      }
      
      await get().fetchRackPrices();
      return result;
    } catch (error) {
      console.error('Error triggering fetch prices:', error);
      throw error;
    } finally {
      set({ processingAction: false });
    }
  },
  
  triggerDailyPrices: async () => {
    set({ processingAction: true });
    try {
      const response = await fetch('/api/daily-prices', {
        method: 'GET',
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to process daily prices');
      }
      
      await get().fetchEmailLogs();
      return result;
    } catch (error) {
      console.error('Error triggering daily prices:', error);
      throw error;
    } finally {
      set({ processingAction: false });
    }
  },
}));
