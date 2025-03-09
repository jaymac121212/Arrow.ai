import { Database } from './supabase';

type Operator = Database['public']['Tables']['operators']['Row'];
type RackPrice = Database['public']['Tables']['rack_prices']['Row'];
type TaxRate = Database['public']['Tables']['tax_rates']['Row'];
type FuelType = Database['public']['Tables']['fuel_types']['Row'];
type Location = Database['public']['Tables']['locations']['Row'];

export interface PriceCalculationResult {
  operatorId: number;
  operatorName: string;
  operatorEmail: string;
  location: string;
  prices: {
    fuelTypeId: number;
    fuelTypeName: string;
    finalPrice: number;
    basePrice: number;
    carbonTax: number;
    provincialRoadTax: number;
    federalExciseTax: number;
    discount: number;
  }[];
}

/**
 * Calculate fuel prices for all operators based on rack prices and tax rates
 */
export const calculatePricesForOperators = (
  operators: (Operator & { location: Location })[], 
  rackPrices: (RackPrice & { fuel_type: FuelType })[], 
  taxRates: (TaxRate & { fuel_type: FuelType })[]
): PriceCalculationResult[] => {
  return operators.map(operator => {
    // Get rack prices for the operator's location
    const locationRackPrices = rackPrices.filter(
      rp => rp.location_id === operator.location_id
    );

    // Calculate prices for each fuel type
    const prices = locationRackPrices.map(rackPrice => {
      // Find tax rate for this fuel type and province
      const taxRate = taxRates.find(
        tr => tr.fuel_type_id === rackPrice.fuel_type_id && 
              tr.province_id === operator.location.province_id
      );

      if (!taxRate) {
        throw new Error(
          `Tax rate not found for fuel type ${rackPrice.fuel_type.name} in province ID ${operator.location.province_id}`
        );
      }

      // Calculate final price using the formula
      const finalPrice = roundToFourDecimals(
        rackPrice.base_price +
        taxRate.carbon_tax +
        taxRate.provincial_road_tax +
        taxRate.federal_excise_tax -
        operator.discount
      );

      return {
        fuelTypeId: rackPrice.fuel_type_id,
        fuelTypeName: rackPrice.fuel_type.name,
        finalPrice,
        basePrice: rackPrice.base_price,
        carbonTax: taxRate.carbon_tax,
        provincialRoadTax: taxRate.provincial_road_tax,
        federalExciseTax: taxRate.federal_excise_tax,
        discount: operator.discount,
      };
    });

    return {
      operatorId: operator.id,
      operatorName: `${operator.first_name} ${operator.last_name}`,
      operatorEmail: operator.email,
      location: operator.location.name,
      prices,
    };
  });
};

/**
 * Round a number to 4 decimal places
 */
export const roundToFourDecimals = (num: number): number => {
  return Math.round(num * 10000) / 10000;
};
