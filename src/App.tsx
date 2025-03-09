import { useState } from 'react';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/toaster';
import { useToast } from './components/ui/use-toast';

function App() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchPrices = async () => {
    setIsLoading(true);
    try {
      // This would be a real API call in production
      await new Promise(resolve => setTimeout(resolve, 1500));
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
          <Button variant="outline" className="w-full">
            Manage Operators
          </Button>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Email Logs</h2>
          <p className="text-gray-500 mb-4">View email delivery status and logs</p>
          <Button variant="outline" className="w-full">
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
      
      <Toaster />
    </div>
  );
}

export default App;
