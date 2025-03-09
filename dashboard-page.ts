'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Percent, 
  Mail, 
  Calendar, 
  RefreshCw, 
  LogOut,
  AlertTriangle 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const { 
    operators, 
    emailLogs, 
    rackPrices,
    loadingOperators,
    loadingEmailLogs,
    loadingRackPrices,
    processingAction,
    fetchOperators,
    fetchEmailLogs,
    fetchRackPrices,
    triggerFetchPrices,
    triggerDailyPrices
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
      fetchEmailLogs();
      fetchRackPrices();
    }
  }, [loading, user, fetchOperators, fetchEmailLogs, fetchRackPrices]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleFetchPrices = async () => {
    try {
      setLoading(true);
      const result = await triggerFetchPrices();
      toast({
        title: 'Rack Prices Fetched',
        description: `Processed ${result.totalRows} prices for ${result.date}`,
      });
    } catch (error) {
      toast({
        title: 'Error Fetching Prices',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendPrices = async () => {
    try {
      setLoading(true);
      const result = await triggerDailyPrices();
      toast({
        title: 'Prices Processed',
        description: `Sent ${result.emailsSent} emails to operators`,
      });
    } catch (error) {
      toast({
        title: 'Error Processing Prices',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString();
  const recentErrorLogs = emailLogs.filter(log => log.status === 'error').slice(0, 5);
  const todayRackPrices = rackPrices.filter(rp => 
    new Date(rp.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Fuel Price Automation Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Logged in as {user.email}
          </span>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Operators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-2xl font-bold">
                {loadingOperators ? '...' : operators.length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Today's Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-2xl font-bold">{today}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Today's Rack Prices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Percent className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-2xl font-bold">
                {loadingRackPrices ? '...' : todayRackPrices.length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Recent Emails
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-2xl font-bold">
                {loadingEmailLogs ? '...' : emailLogs.length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Manual Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleFetchPrices} 
                disabled={processingAction}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Fetch Today's Rack Prices
              </Button>
              
              <Button 
                onClick={handleSendPrices} 
                disabled={processingAction || todayRackPrices.length === 0}
                className="w-full"
              >
                <Mail className="h-4 w-4 mr-2" />
                Calculate & Send Prices
              </Button>
            </div>
            
            {todayRackPrices.length === 0 && (
              <p className="text-sm text-amber-600 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                No rack prices available for today. Fetch prices first.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Error Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingEmailLogs ? (
              <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
            ) : recentErrorLogs.length > 0 ? (
              <div className="space-y-2">
                {recentErrorLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="p-2 bg-red-50 border border-red-100 rounded-md text-sm"
                  >
                    <div className="font-medium">Error for Operator #{log.operator_id}</div>
                    <div className="text-red-600 text-xs">{log.error_message}</div>
                    <div className="text-gray-500 text-xs">
                      {new Date(log.sent_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-600 flex items-center">
                <span className="bg-green-100 p-1 rounded-full mr-2">✓</span>
                No recent errors. Everything is running smoothly!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/operators" className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Manage Operators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Add, edit, or remove gas station operators and set their price discounts.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/tax-rates" className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="h-5 w-5 mr-2" />
                Tax Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View and manage tax rates by province and fuel type.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/logs" className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                View history of all sent emails and any delivery issues.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
