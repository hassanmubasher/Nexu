import React, { useState } from 'react';
import { ArrowRightLeft, Download, Upload, Wallet, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out';
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  counterparty?: string;
};

export const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(user?.role === 'investor' ? 1250000 : 45000);
  
  // Mock transactions
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'tx_1',
      type: 'deposit',
      amount: 50000,
      date: '2024-03-01T10:00:00Z',
      status: 'completed'
    },
    {
      id: 'tx_2',
      type: 'transfer_out',
      amount: 5000,
      date: '2024-03-05T14:30:00Z',
      status: 'completed',
      counterparty: 'TechWave LLC'
    },
    {
      id: 'tx_3',
      type: 'transfer_in',
      amount: 15000,
      date: '2024-03-08T09:15:00Z',
      status: 'pending',
      counterparty: 'Angel Fund Partners'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt);
  };

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const numAmt = Number(amount);

    if ((activeTab === 'withdraw' || activeTab === 'transfer') && numAmt > balance) {
      toast.error('Insufficient funds');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: activeTab === 'deposit' ? 'deposit' : activeTab === 'withdraw' ? 'withdrawal' : 'transfer_out',
      amount: numAmt,
      date: new Date().toISOString(),
      status: 'completed',
      counterparty: activeTab === 'transfer' ? recipient || 'Unknown User' : undefined
    };

    setTransactions(prev => [newTx, ...prev]);
    
    if (activeTab === 'deposit') setBalance(prev => prev + numAmt);
    else setBalance(prev => prev - numAmt);

    toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} successful!`);
    
    setAmount('');
    setRecipient('');
    setIsLoading(false);
  };

  const getTransactionIcon = (type: Transaction['type'], status: Transaction['status']) => {
    if (status === 'pending') return <Clock size={20} className="text-warning-500" />;
    
    switch (type) {
      case 'deposit':
      case 'transfer_in':
        return <ArrowDownLeft size={20} className="text-success-500" />;
      case 'withdrawal':
      case 'transfer_out':
        return <ArrowUpRight size={20} className="text-error-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      <Toaster position="bottom-right" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payments & Wallet</h1>
        <p className="text-gray-600">Manage your funds and transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Wallet Balance Card */}
        <Card className="lg:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden relative">
           {/* Decorative background circle */}
           <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-5 blur-2xl"></div>
           
           <CardBody className="p-8">
             <div className="flex items-center justify-between mb-8">
               <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                 <Wallet size={24} className="text-primary-300" />
               </div>
               <Badge variant="secondary" className="bg-white/10 text-white border-white/20">Active</Badge>
             </div>
             <div>
               <p className="text-gray-400 font-medium mb-1 text-sm uppercase tracking-wider">Available Balance</p>
               <h2 className="text-4xl font-bold tracking-tight">{formatCurrency(balance)}</h2>
             </div>
             
             <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-sm text-gray-400">
                <span>Account ID</span>
                <span className="font-mono text-gray-300">NXU-{user?.id.toUpperCase()}-0892</span>
             </div>
           </CardBody>
        </Card>

        {/* Actions Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-gray-100 pb-0 flex gap-4">
             <button 
               className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'deposit' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               onClick={() => setActiveTab('deposit')}
             >
               Deposit Funds
             </button>
             <button 
               className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'withdraw' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               onClick={() => setActiveTab('withdraw')}
             >
               Withdraw
             </button>
             <button 
               className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'transfer' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
               onClick={() => setActiveTab('transfer')}
             >
               Send Funds
             </button>
          </CardHeader>
          <CardBody className="p-6">
             <form onSubmit={handleTransaction} className="max-w-md space-y-6">
               
               {activeTab === 'transfer' && (
                 <div className="animate-fade-in">
                   <Input 
                     label="Recipient (Email or User ID)" 
                     placeholder="e.g. startup@nexus.com" 
                     value={recipient}
                     onChange={(e) => setRecipient(e.target.value)}
                     required
                   />
                 </div>
               )}

               <div className="animate-fade-in">
                 <label className="block text-sm font-medium text-gray-700 mb-1">Amount (USD)</label>
                 <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <span className="text-gray-500 sm:text-sm">$</span>
                   </div>
                   <input
                     type="number"
                     className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md py-3 bg-gray-50 border transition-colors"
                     placeholder="0.00"
                     value={amount}
                     onChange={(e) => setAmount(e.target.value)}
                     required
                     min="1"
                   />
                   <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                     <span className="text-gray-500 sm:text-sm">USD</span>
                   </div>
                 </div>
               </div>

               <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading}
                leftIcon={activeTab === 'deposit' ? <Download size={18} /> : activeTab === 'withdraw' ? <Upload size={18} /> : <ArrowRightLeft size={18} />}
               >
                 {activeTab === 'deposit' ? 'Add Funds' : activeTab === 'withdraw' ? 'Withdraw Funds' : 'Send Payment'}
               </Button>
             </form>
          </CardBody>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        (tx.type === 'deposit' || tx.type === 'transfer_in') ? 'bg-success-50 text-success-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {getTransactionIcon(tx.type, tx.status)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {tx.type.replace('_', ' ')}
                        </div>
                        {tx.counterparty && (
                          <div className="text-sm text-gray-500">
                            {tx.type === 'transfer_in' ? 'From: ' : 'To: '}{tx.counterparty}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      (tx.type === 'deposit' || tx.type === 'transfer_in') ? 'text-success-600' : 'text-gray-900'
                    }`}>
                      {(tx.type === 'deposit' || tx.type === 'transfer_in') ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tx.date).toLocaleDateString()} at {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      tx.status === 'completed' ? 'bg-success-100 text-success-800' :
                      tx.status === 'pending' ? 'bg-warning-100 text-warning-800' :
                      'bg-error-100 text-error-800'
                    }`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
      
    </div>
  );
};
