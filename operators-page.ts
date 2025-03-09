'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ChevronLeft, 
  Plus, 
  Pencil, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function OperatorsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentOperator, setCurrentOperator] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    location_id: '',
    discount: '0',
  });
  
  const { 
    operators, 
    locations,
    loadingOperators,
    loadingLocations,
    processingAction,
    fetchOperators,
    fetchLocations,
    createOperator,
    updateOperator,
    deleteOperator
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
      fetchOperators();
      fetchLocations();
    }
  }, [loading, user, fetchOperators, fetchLocations]);

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      location_id: '',
      discount: '0',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createOperator({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        location_id: parseInt(formData.location_id),
        discount: parseFloat(formData.discount),
      });
      
      setShowAddDialog(false);
      resetForm();
      
      toast({
        title: 'Operator Added',
        description: 'New operator has been added successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error Adding Operator',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = (operator: any) => {
    setCurrentOperator(operator);
    setFormData({
      first_name: operator.first_name,
      last_name: operator.last_name,
      email: operator.email,
      location_id: String(operator.location_id),
      discount: String(operator.discount),
    });
    setShowEditDialog(true);
  };

  const handleUpdateOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateOperator(currentOperator.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        location_id: parseInt(formData.location_id),
        discount: parseFloat(formData.discount),
      });
      
      setShowEditDialog(false);
      setCurrentOperator(null);
      resetForm();
      
      toast({
        title: 'Operator Updated',
        description: 'Operator has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error Updating Operator',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteClick = (operator: any) => {
    setCurrentOperator(operator);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteOperator(currentOperator.id);
      
      setShowDeleteDialog(false);
      setCurrentOperator(null);
      
      toast({
        title: 'Operator Deleted',
        description: 'Operator has been deleted successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error Deleting Operator',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold ml-2">Manage Operators</h1>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Operator
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Operator</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddOperator} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location_id">Location</Label>
                <Select 
                  value={formData.location_id} 
                  onValueChange={(value) => handleSelectChange('location_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={String(location.id)}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (per liter)</Label>
                <Input
                  id="discount"
                  name="discount"
                  type="number"
                  step="0.0001"
                  min="0"
                  value={formData.discount}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={processingAction}>
                {processingAction ? 'Adding...' : 'Add Operator'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loadingOperators ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-96 bg-gray-100 rounded"></div>
        </div>
      ) : operators.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-lg font-medium">No Operators Found</h3>
          <p className="text-gray-500 mt-2 mb-4">
            There are no operators in the system yet.
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            Add Your First Operator
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map((operator) => {
                const location = locations.find(loc => loc.id === operator.location_id);
                
                return (
                  <TableRow key={operator.id}>
                    <TableCell className="font-medium">{operator.id}</TableCell>
                    <TableCell>
                      {operator.first_name} {operator.last_name}
                    </TableCell>
                    <TableCell>{operator.email}</TableCell>
                    <TableCell>{location ? location.name : 'Unknown'}</TableCell>
                    <TableCell>{operator.discount.toFixed(4)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditClick(operator)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteClick(operator)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Operator Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Operator</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateOperator} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_first_name">First Name</Label>
                <Input
                  id="edit_first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_last_name">Last Name</Label>
                <Input
                  id="edit_last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_email">Email</Label>
              <Input
                id="edit_email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_location_id">Location</Label>
              <Select 
                value={formData.location_id} 
                onValueChange={(value) => handleSelectChange('location_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={String(location.id)}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit_discount">Discount (per liter)</Label>
              <Input
                id="edit_discount"
                name="discount"
                type="number"
                step="0.0001"
                min="0"
                value={formData.discount}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={processingAction}>
              {processingAction ? 'Updating...' : 'Update Operator'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete the operator:{' '}
              <span className="font-medium">
                {currentOperator?.first_name} {currentOperator?.last_name}
              </span>
              ?
            </p>
            <p className="text-gray-500 text-sm mt-2">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={processingAction}
            >
              {processingAction ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
