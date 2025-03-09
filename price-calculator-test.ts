import { calculatePricesForOperators, roundToFourDecimals } from '@/lib/price-calculator';

describe('price-calculator', () => {
  describe('roundToFourDecimals', () => {
    it('should round numbers to 4 decimal places', () => {
      expect(roundToFourDecimals(1.12345)).toBe(1.1235);
      expect(roundToFourDecimals(1.12344)).toBe(1.1234);
      expect(roundToFourDecimals(0.12345)).toBe(0.1235);
      expect(roundToFourDecimals(100.00005)).toBe(100.0001);
    });
  });

  describe('calculatePricesForOperators', () => {
    it('should calculate prices correctly for operators', () => {
      // Mock data
      const operators = [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          location_id: 1,
          discount: 0.1,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          location: {
            id: 1,
            name: 'Toronto, ON',
            province_id: 7,
          },
        },
      ];

      const rackPrices = [
        {
          id: 1,
          date: '2023-01-01',
          location_id: 1,
          fuel_type_id: 1,
          base_price: 1.0,
          created_at: '2023-01-01T00:00:00Z',
          fuel_type: {
            id: 1,
            name: 'REG 87',
          },
        },
        {
          id: 2,
          date: '2023-01-01',
          location_id: 1,
          fuel_type_id: 3,
          base_price: 1.2,
          created_at: '2023-01-01T00:00:00Z',
          fuel_type: {
            id: 3,
            name: 'SUP 91',
          },
        },
      ];

      const taxRates = [
        {
          id: 1,
          province_id: 7,
          fuel_type_id: 1,
          carbon_tax: 0.0884,
          provincial_road_tax: 0.147,
          federal_excise_tax: 0.1,
          fuel_type: {
            id: 1,
            name: 'REG 87',
          },
        },
        {
          id: 2,
          province_id: 7,
          fuel_type_id: 3,
          carbon_tax: 0.0884,
          provincial_road_tax: 0.147,
          federal_excise_tax: 0.1,
          fuel_type: {
            id: 3,
            name: 'SUP 91',
          },
        },
      ];

      // Calculate prices
      const results = calculatePricesForOperators(operators, rackPrices, taxRates);

      // Expectations
      expect(results).toHaveLength(1);
      
      // Check operator info
      expect(results[0].operatorId).toBe(1);
      expect(results[0].operatorName).toBe('John Doe');
      expect(results[0].operatorEmail).toBe('john@example.com');
      expect(results[0].location).toBe('Toronto, ON');
      
      // Check price calculations
      expect(results[0].prices).toHaveLength(2);
      
      // REG 87 price
      const reg87 = results[0].prices.find(p => p.fuelTypeName === 'REG 87');
      expect(reg87).toBeDefined();
      expect(reg87?.basePrice).toBe(1.0);
      expect(reg87?.carbonTax).toBe(0.0884);
      expect(reg87?.provincialRoadTax).toBe(0.147);
      expect(reg87?.federalExciseTax).toBe(0.1);
      expect(reg87?.discount).toBe(0.1);
      expect(reg87?.finalPrice).toBe(1.2354); // 1.0 + 0.0884 + 0.147 + 0.1 - 0.1 = 1.2354
      
      // SUP 91 price
      const sup91 = results[0].prices.find(p => p.fuelTypeName === 'SUP 91');
      expect(sup91).toBeDefined();
      expect(sup91?.basePrice).toBe(1.2);
      expect(sup91?.carbonTax).toBe(0.0884);
      expect(sup91?.provincialRoadTax).toBe(0.147);
      expect(sup91?.federalExciseTax).toBe(0.1);
      expect(sup91?.discount).toBe(0.1);
      expect(sup91?.finalPrice).toBe(1.4354); // 1.2 + 0.0884 + 0.147 + 0.1 - 0.1 = 1.4354
    });

    it('should throw error if tax rate not found', () => {
      // Mock data with missing tax rate
      const operators = [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          location_id: 1,
          discount: 0.1,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
          location: {
            id: 1,
            name: 'Toronto, ON',
            province_id: 7,
          },
        },
      ];

      const rackPrices = [
        {
          id: 1,
          date: '2023-01-01',
          location_id: 1,
          fuel_type_id: 1,
          base_price: 1.0,
          created_at: '2023-01-01T00:00:00Z',
          fuel_type: {
            id: 1,
            name: 'REG 87',
          },
        },
      ];

      const taxRates = [
        {
          id: 1,
          province_id: 8, // Different province
          fuel_type_id: 1,
          carbon_tax: 0.0884,
          provincial_road_tax: 0.147,
          federal_excise_tax: 0.1,
          fuel_type: {
            id: 1,
            name: 'REG 87',
          },
        },
      ];

      // Expect error
      expect(() => {
        calculatePricesForOperators(operators, rackPrices, taxRates);
      }).toThrowError('Tax rate not found');
    });
  });
});
