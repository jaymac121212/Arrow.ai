'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ChevronLeft, 
  Pencil, 
  AlertTriangle 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function TaxRatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [currentTaxRate, setCurrentTaxRate] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    carbon_tax: '',
    provincial_road_tax: '',
    federal_excise_tax: '',
  });
  
  const { 
    provinces, 
    fuelTypes,
    taxRates,
    loadingProvinces,
    loadingFuelTypes,
    loadingTaxRates,
    processingAction,
    fetchProvinces,
    fetchFuelTypes,
    fetchTaxRates,
    updateTaxRate
  } = useStore();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push('/login');
        return;
      }
      setUser(data.user);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    if (!loading && user) {
      fetchProvinces();
      fetchFuelTypes();
      fetchTaxRates();
    }
  }, [loading, user, fetchProvinces, fetchFuelTypes, fetchTaxRates]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (taxRate: any) => {
    setCurrentTaxRate(taxRate);
    setFormData({
      carbon_tax: String(taxRate.carbon_tax),
      provincial_road_tax: String(taxRate.provincial_road_tax),
      federal_excise_tax: String(taxRate.federal_excise_tax),
    });
    setShowEditDialog(true);
  };

  const handleUpdateTaxRate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateTaxRate(currentTaxRate.id, {
        carbon_tax: parseFloat(formData.carbon_tax),
        provincial_road_tax: parseFloat(formData.provincial_road_tax),
        federal_excise_tax: parseFloat(formData.federal_excise_tax),
      });
      
      setShowEditDialog(false);
      setCurrentTaxRate(null);
      
      toast({
        title: 'Tax Rate Updated',
        description: 'Tax rate has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error Updating Tax Rate',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const getProvinceName = (provinceId: number) => {
    const province = provinces.find(p => p.id === provinceId);
    return province ? province.name : 'Unknown';
  };

  const getFuelTypeName = (fuelTypeId: number) => {
    const fuelType = fuelTypes.find(ft => ft.id === fuelTypeId);
    return fuelType ? fuelType.name : 'Unknown';
  };

  if (loading || loadingTaxRates || loadingProvinces || loadingFuelTypes) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold ml-2">Tax Rates</h1>
        </div>
      </div>

      {taxRates.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-lg font-medium">No Tax Rates Found</h3>
          <p className="text-gray-500 mt-2 mb-4">
            There are no tax rates in the system yet. Please contact the administrator.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Province</TableHead>
                <TableHead>Fuel Type</TableHead>
                <TableHead>Carbon Tax</TableHead>
                <TableHead>Provincial Road Tax</TableHead>
                <TableHead>Federal Excise Tax</TableHead>
                <TableHead>Total Tax</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxRates.map((taxRate) => {
                const totalTax = (
                  Number(taxRate.carbon_tax) + 
                  Number(taxRate.provincial_road_tax) + 
                  Number(taxRate.federal_excise_tax)
                ).toFixed(4);
                
                return (
                  <TableRow key={taxRate.id}>
                    <TableCell>{getProvinceName(taxRate.province_id)}</TableCell>
                    <TableCell>{getFuelTypeName(taxRate.fuel_type_id)}</TableCell>
                    <TableCell>{Number(taxRate.carbon_tax).toFixed(4)}</TableCell>
                    <TableCell>{Number(taxRate.provincial_road_tax).toFixed(4)}</TableCell>
                    <TableCell>{Number(taxRate.federal_excise_tax).toFixed(4)}</TableCell>
                    <TableCell className="font-medium">{totalTax}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(taxRate)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Tax Rate Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tax Rate</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateTaxRate} className="space-y-4 pt-4">
            {currentTaxRate && (
              <div className="text-sm text-muted-foreground mb-4">
                <p>
                  Province: <span className="font-medium">{getProvinceName(currentTaxRate.province_id)}</span>
                </p>
                <p>
                  Fuel Type: <span className="font-medium">{getFuelTypeName(currentTaxRate.fuel_type_id)}</span>
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="carbon_tax">Carbon Tax</Label>
              <Input
                id="carbon_tax"
                name="carbon_tax"
                type="number"
                step="0.0001"
                min="0"
                value={formData.carbon_tax}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="provincial_road_tax">Provincial Road Tax</Label>
              <Input
                id="provincial_road_tax"
                name="provincial_road_tax"
                type="number"
                step="0.0001"
                min="0"
                value={formData.provincial_road_tax}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="federal_excise_tax">Federal Excise Tax</Label>
              <Input
                id="federal_excise_tax"
                name="federal_excise_tax"
                type="number"
                step="0.0001"
                min="0"
                value={formData.federal_excise_tax}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={processingAction}>
              {processingAction ? 'Updating...' : 'Update Tax Rate'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
