import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Toaster } from '../components/ui/toaster';
import { ChevronLeft, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';

interface OperatorsPageProps {
  onBackClick: () => void;
}

const OperatorsPage = ({ onBackClick }: OperatorsPageProps) => {
  // Mock data for operators
  const [operators] = useState([
    { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', location: 'Downtown', discount: 0.0250 },
    { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', location: 'Uptown', discount: 0.0175 },
    { id: 3, first_name: 'Robert', last_name: 'Johnson', email: 'robert.j@example.com', location: 'Westside', discount: 0.0300 },
  ]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBackClick}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold ml-2">Manage Operators</h1>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Operator
        </Button>
      </div>

      {operators.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-lg font-medium">No Operators Found</h3>
          <p className="text-gray-500 mt-2 mb-4">
            There are no operators in the system yet.
          </p>
          <Button>
            Add Your First Operator
          </Button>
        </div>
      ) : (
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Location</th>
                  <th className="text-left py-3 px-4">Discount</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {operators.map((operator) => (
                  <tr key={operator.id} className="border-b">
                    <td className="py-3 px-4">{operator.id}</td>
                    <td className="py-3 px-4">{operator.first_name} {operator.last_name}</td>
                    <td className="py-3 px-4">{operator.email}</td>
                    <td className="py-3 px-4">{operator.location}</td>
                    <td className="py-3 px-4">{operator.discount.toFixed(4)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      
      <Toaster />
    </div>
  );
};

export default OperatorsPage;
