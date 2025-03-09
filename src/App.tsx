import { useState } from 'react';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/toaster';
import { useToast } from './components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import OperatorsPage from './pages/OperatorsPage';
import EmailLogsPage from './pages/EmailLogsPage';

function App() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showPricesDialog, setShowPricesDialog] = useState(false);
  const [latestPrices, setLatestPrices] = useState<any[]>([]);

  const handleFetchPrices = async () => {
    setIsLoading(true);
    try {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data for latest prices
      const mockPrices = [
        {
          id: 1,
          date: '2023-06-15',
          location: 'Toronto',
          fuelType: 'Regular Gasoline',
          basePrice: 0.7850,
          carbonTax: 0.1100,
          provincialRoadTax: 0.1450,
          federalExciseTax: 0.1000,
          finalPrice: 1.1400
        },
        {
          id: 2,
          date: '2023-06-15',
          location: 'Toronto',
          fuelType: 'Premium Gasoline',
          basePrice: 0.8950,
          carbonTax: 0.1100,
          provincialRoadTax: 0.1450,
          federalExciseTax: 0.1000,
          finalPrice: 1.2500
        },
        {
          id: 3,
          date: '2023-06-15',
          location: 'Toronto',
          fuelType: 'Diesel',
          basePrice: 0.8250,
          carbonTax: 0.1340,
          provincialRoadTax: 0.1430,
          federalExciseTax: 0.0400,
          finalPrice: 1.1420
        },
        {
          id: 4,
          date: '2023-06-15',
          location: 'Vancouver',
          fuelType: 'Regular Gasoline',
          basePrice: 0.8150,
          carbonTax: 0.1400,
          provincialRoadTax: 0.1550,
          federalExciseTax: 0.1000,
          finalPrice: 1.2100
        },
        {
          id: 5,
          date: '2023-06-15',
          location: 'Vancouver',
          fuelType: 'Premium Gasoline',
          basePrice: 0.9250,
          carbonTax: 0.1400,
          provincialRoadTax: 0.1550,
          federalExciseTax: 0.1000,
          finalPrice: 1.3200
        },
        {
          id: 6,
          date: '2023-06-15',
          location: 'Montreal',
          fuelType: 'Regular Gasoline',
          basePrice: 0.7750,
          carbonTax: 0.0900,
          provincialRoadTax: 0.1920,
          federalExciseTax: 0.1000,
          finalPrice: 1.1570
        }
      ];
      
      setLatestPrices(mockPrices);
      setShowPricesDialog(true);
      
      toast({
        title: "Prices fetched successfully",
        description: "The latest rack prices have been imported.",
      });
    } catch (error) {
      toast({
        title: "Error fetching prices",
        description: "There was a problem fetching the latest prices.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToOperators = () => {
    setCurrentPage('operators');
  };

  const navigateToEmailLogs = () => {
    setCurrentPage('emailLogs');
  };

  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  if (currentPage === 'operators') {
    return <OperatorsPage onBackClick={navigateToDashboard} />;
  }

  if (currentPage === 'emailLogs') {
    return <EmailLogsPage onBackClick={navigateToDashboard} />;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Fuel Price Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Rack Prices</h2>
          <p className="text-gray-500 mb-4">Fetch and manage the latest rack prices</p>
          <Button 
            onClick={handleFetchPrices} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Fetching...' : 'Fetch Latest Prices'}
          </Button>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Operators</h2>
          <p className="text-gray-500 mb-4">Manage operator accounts and discounts</p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={navigateToOperators}
          >
            Manage Operators
          </Button>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Email Logs</h2>
          <p className="text-gray-500 mb-4">View email delivery status and logs</p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={navigateToEmailLogs}
          >
            View Logs
          </Button>
        </Card>
      </div>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Last Price Update:</span>
            <span className="font-medium">Today, 5:00 AM</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Emails Sent Today:</span>
            <span className="font-medium">42</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Active Operators:</span>
            <span className="font-medium">18</span>
          </div>
        </div>
      </Card>
      
      {/* Latest Prices Dialog */}
      <Dialog open={showPricesDialog} onOpenChange={setShowPricesDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Latest Rack Prices</DialogTitle>
          </DialogHeader>
          
          <div className="pt-4">
            <div className="text-sm text-muted-foreground mb-4">
              Showing rack prices as of {latestPrices.length > 0 ? latestPrices[0].date : 'today'}.
            </div>
            
            <div className="border rounded overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Location</TableHead>
                    <TableHead>Fuel Type</TableHead>
                    <TableHead className="text-right">Base Price</TableHead>
                    <TableHead className="text-right">Carbon Tax</TableHead>
                    <TableHead className="text-right">Provincial Tax</TableHead>
                    <TableHead className="text-right">Federal Tax</TableHead>
                    <TableHead className="text-right">Final Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestPrices.map((price) => (
                    <TableRow key={price.id}>
                      <TableCell>{price.location}</TableCell>
                      <TableCell>{price.fuelType}</TableCell>
                      <TableCell className="text-right">${price.basePrice.toFixed(4)}</TableCell>
                      <TableCell className="text-right">${price.carbonTax.toFixed(4)}</TableCell>
                      <TableCell className="text-right">${price.provincialRoadTax.toFixed(4)}</TableCell>
                      <TableCell className="text-right">${price.federalExciseTax.toFixed(4)}</TableCell>
                      <TableCell className="text-right font-medium">${price.finalPrice.toFixed(4)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowPricesDialog(false)}
                className="mr-2"
              >
                Close
              </Button>
              <Button>
                Send Price Emails
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </div>
  );
}

export default App;
