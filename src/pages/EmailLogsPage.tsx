import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Toaster } from '../components/ui/toaster';
import { ChevronLeft, Eye, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';

interface EmailLogsPageProps {
  onBackClick: () => void;
}

const EmailLogsPage = ({ onBackClick }: EmailLogsPageProps) => {
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [currentLog, setCurrentLog] = useState<any>(null);
  
  // Mock data for email logs
  const [emailLogs] = useState([
    { 
      id: 1, 
      sent_at: '2023-06-15T08:30:00Z', 
      operator_id: 1, 
      status: 'sent', 
      error_message: null,
      price_data: [
        { 
          fuelTypeName: 'Regular Gasoline', 
          basePrice: 0.7850, 
          carbonTax: 0.1100, 
          provincialRoadTax: 0.1450, 
          federalExciseTax: 0.1000, 
          discount: 0.0250, 
          finalPrice: 1.1150 
        },
        { 
          fuelTypeName: 'Premium Gasoline', 
          basePrice: 0.8950, 
          carbonTax: 0.1100, 
          provincialRoadTax: 0.1450, 
          federalExciseTax: 0.1000, 
          discount: 0.0250, 
          finalPrice: 1.2250 
        }
      ]
    },
    { 
      id: 2, 
      sent_at: '2023-06-15T08:31:00Z', 
      operator_id: 2, 
      status: 'sent', 
      error_message: null,
      price_data: [
        { 
          fuelTypeName: 'Regular Gasoline', 
          basePrice: 0.7850, 
          carbonTax: 0.1100, 
          provincialRoadTax: 0.1450, 
          federalExciseTax: 0.1000, 
          discount: 0.0175, 
          finalPrice: 1.1225 
        }
      ]
    },
    { 
      id: 3, 
      sent_at: '2023-06-15T08:32:00Z', 
      operator_id: 3, 
      status: 'error', 
      error_message: 'Failed to deliver: Recipient mailbox unavailable',
      price_data: null
    }
  ]);

  // Mock data for operators
  const operators = [
    { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com' },
    { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com' },
    { id: 3, first_name: 'Robert', last_name: 'Johnson', email: 'robert.j@example.com' }
  ];

  const handleViewDetails = (log: any) => {
    setCurrentLog(log);
    setShowDetailsDialog(true);
  };

  const getOperatorName = (operatorId: number) => {
    const operator = operators.find(op => op.id === operatorId);
    return operator 
      ? `${operator.first_name} ${operator.last_name}`
      : `Operator #${operatorId}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBackClick}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold ml-2">Email Logs</h1>
        </div>
        
        <Button variant="outline">
          Refresh Logs
        </Button>
      </div>

      {emailLogs.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-lg font-medium">No Email Logs Found</h3>
          <p className="text-gray-500 mt-2 mb-4">
            There are no email logs in the system yet. Run the daily price calculation to generate logs.
          </p>
        </div>
      ) : (
        <Card className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Error</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emailLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{formatDate(log.sent_at)}</TableCell>
                    <TableCell>{getOperatorName(log.operator_id)}</TableCell>
                    <TableCell>
                      {log.status === 'sent' ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Sent
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle className="h-4 w-4 mr-1" />
                          Error
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {log.error_message || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleViewDetails(log)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Log Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Email Log Details</DialogTitle>
          </DialogHeader>
          
          {currentLog && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Log ID</p>
                  <p className="text-sm">{currentLog.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Sent At</p>
                  <p className="text-sm">{formatDate(currentLog.sent_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Operator</p>
                  <p className="text-sm">{getOperatorName(currentLog.operator_id)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className={`text-sm ${currentLog.status === 'sent' ? 'text-green-600' : 'text-red-600'}`}>
                    {currentLog.status}
                  </p>
                </div>
              </div>
              
              {currentLog.error_message && (
                <div>
                  <p className="text-sm font-medium">Error Message</p>
                  <div className="mt-1 p-2 bg-red-50 border border-red-100 rounded text-red-800 text-sm">
                    {currentLog.error_message}
                  </div>
                </div>
              )}
              
              {currentLog.price_data && (
                <div>
                  <p className="text-sm font-medium mb-2">Price Data</p>
                  <div className="border rounded overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fuel Type</TableHead>
                          <TableHead className="text-right">Base Price</TableHead>
                          <TableHead className="text-right">Carbon Tax</TableHead>
                          <TableHead className="text-right">Provincial Tax</TableHead>
                          <TableHead className="text-right">Federal Tax</TableHead>
                          {/* Admin-only view still shows discount */}
                          <TableHead className="text-right">Discount</TableHead>
                          <TableHead className="text-right">Final Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(currentLog.price_data) && currentLog.price_data.map((price: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{price.fuelTypeName}</TableCell>
                            <TableCell className="text-right">{price.basePrice.toFixed(4)}</TableCell>
                            <TableCell className="text-right">{price.carbonTax.toFixed(4)}</TableCell>
                            <TableCell className="text-right">{price.provincialRoadTax.toFixed(4)}</TableCell>
                            <TableCell className="text-right">{price.federalExciseTax.toFixed(4)}</TableCell>
                            <TableCell className="text-right">{price.discount.toFixed(4)}</TableCell>
                            <TableCell className="text-right font-medium">{price.finalPrice.toFixed(4)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </div>
  );
};

export default EmailLogsPage;
