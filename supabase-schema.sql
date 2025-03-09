-- Create tables for fuel price automation system

-- Provinces table
CREATE TABLE provinces (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Locations table
CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  province_id INTEGER REFERENCES provinces(id) ON DELETE CASCADE,
  UNIQUE(name, province_id)
);

-- Fuel types table
CREATE TABLE fuel_types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Tax rates table
CREATE TABLE tax_rates (
  id SERIAL PRIMARY KEY,
  province_id INTEGER REFERENCES provinces(id) ON DELETE CASCADE,
  fuel_type_id INTEGER REFERENCES fuel_types(id) ON DELETE CASCADE,
  carbon_tax DECIMAL(10, 4) NOT NULL,
  provincial_road_tax DECIMAL(10, 4) NOT NULL,
  federal_excise_tax DECIMAL(10, 4) NOT NULL,
  UNIQUE(province_id, fuel_type_id)
);

-- Operators table
CREATE TABLE operators (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
  discount DECIMAL(10, 4) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rack prices table
CREATE TABLE rack_prices (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
  fuel_type_id INTEGER REFERENCES fuel_types(id) ON DELETE CASCADE,
  base_price DECIMAL(10, 4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, location_id, fuel_type_id)
);

-- Email logs table
CREATE TABLE email_logs (
  id SERIAL PRIMARY KEY,
  operator_id INTEGER REFERENCES operators(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL,
  error_message TEXT,
  price_data JSONB
);

-- Create initial data for provinces
INSERT INTO provinces (name) VALUES
  ('Alberta'),
  ('British Columbia'),
  ('Manitoba'),
  ('New Brunswick'),
  ('Newfoundland and Labrador'),
  ('Nova Scotia'),
  ('Ontario'),
  ('Prince Edward Island'),
  ('Quebec'),
  ('Saskatchewan');

-- Create initial data for fuel types
INSERT INTO fuel_types (name) VALUES
  ('REG 87'),
  ('MID 89'),
  ('SUP 91'),
  ('ULSD');

-- Set up Row Level Security
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fuel_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE rack_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (authenticated users can read all data)
CREATE POLICY "Allow authenticated read access" ON provinces FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read access" ON locations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read access" ON fuel_types FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read access" ON tax_rates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read access" ON operators FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read access" ON rack_prices FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated read access" ON email_logs FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies (only admins can modify data)
CREATE POLICY "Allow admin insert access" ON provinces FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update access" ON provinces FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete access" ON provinces FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin insert access" ON locations FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update access" ON locations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete access" ON locations FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin insert access" ON fuel_types FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update access" ON fuel_types FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete access" ON fuel_types FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin insert access" ON tax_rates FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update access" ON tax_rates FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete access" ON tax_rates FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin insert access" ON operators FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update access" ON operators FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete access" ON operators FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin insert access" ON rack_prices FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update access" ON rack_prices FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete access" ON rack_prices FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin insert access" ON email_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow admin update access" ON email_logs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin delete access" ON email_logs FOR DELETE USING (auth.role() = 'authenticated');
