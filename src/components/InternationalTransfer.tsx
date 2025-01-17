import { useState, useEffect } from 'react';
import { GB, MX, CO, CL, US } from 'country-flag-icons/react/3x2';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  description: string;
  isCredit?: boolean;
}

const BENEFITS = [
  {
    icon: 'flash',
    title: 'Instant Transfers',
    description: 'Money arrives in seconds, not days. Real-time cross-border transfers.'
  },
  {
    icon: 'percent',
    title: 'Low Fees',
    description: 'Only 3% fee, compared to 5-7% with traditional banks.'
  },
  {
    icon: 'trending-up',
    title: 'Best Exchange Rates',
    description: 'Save up to 2% on exchange rates compared to banks.'
  },
  {
    icon: 'shield',
    title: 'Secure & Easy',
    description: 'Bank-level security with an easy-to-use interface.'
  }
];

const isValidAmount = (value: string) => {
  const num = parseFloat(value);
  return value !== '' && !isNaN(num) && num > 0;
};

const InternationalTransfer = () => {
  // Valores fijos
  const FIXED_USD_AMOUNT = 500; // Monto fijo en USD
  const EXCHANGE_RATE = 17.05;
  const FEE_PERCENTAGE = 0.01;

  // Cálculos fijos
  const convertedAmount = FIXED_USD_AMOUNT * EXCHANGE_RATE;
  const fee = convertedAmount * FEE_PERCENTAGE;
  const totalAmount = convertedAmount - fee;
  const [balance, setBalance] = useState(180973.00);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Transacción de ejemplo fija
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'International',
      amount: totalAmount,
      date: new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      description: 'International Transfer Received',
      isCredit: true
    }
  ]);

  const handleTransfer = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <section className="py-24 relative bg-white overflow-hidden">
      {/* Círculos decorativos */}
      <div className="absolute -left-40 top-20 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-50 to-blue-100/50 blur-3xl opacity-60" />
      <div className="absolute -right-40 bottom-20 w-[400px] h-[400px] rounded-full bg-gradient-to-l from-cyan-50 to-blue-100/50 blur-3xl opacity-60" />
      <div className="absolute left-1/4 top-1/3 w-[200px] h-[200px] rounded-full bg-gradient-to-br from-blue-50 to-cyan-100/50 blur-2xl opacity-40" />
      
      {/* Patrón de puntos */}
      <div className="absolute inset-0 bg-[radial-gradient(#3983ED_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-[0.03]" />

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#3983ED] to-blue-600">
            Send Money Globally
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience lightning-fast international transfers with the best rates. From USA to Mexico in seconds, not days.
          </p>
        </div>

        {/* Beneficios */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {BENEFITS.map(benefit => (
            <div key={benefit.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <i className={`eva eva-${benefit.icon}-outline text-xl text-[#3983ED]`} />
              </div>
              <h3 className="font-medium mb-2">{benefit.title}</h3>
              <p className="text-sm text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Simulador de transferencia */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-8 relative">
            {showSuccess && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center animate-fade-in z-10">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <i className="eva eva-checkmark-outline text-2xl text-green-500" />
                  </div>
                  <p className="text-lg font-medium text-green-600">Transfer Successful!</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mb-8">
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded overflow-hidden">
                  <US className="w-full h-full object-cover" />
                </div>
                <i className="eva eva-arrow-right text-2xl text-[#3983ED]" />
                <div className="w-8 h-8 rounded overflow-hidden">
                  <MX className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-600 mb-2">Amount to Send (USD)</label>
                <div className="relative">
                  <div className="w-full pl-8 pr-24 h-14 border border-gray-200 rounded-2xl text-lg 
                    flex items-center bg-gray-50">
                    <span className="text-gray-400 mr-2">$</span>
                    <span className="font-medium">{FIXED_USD_AMOUNT.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    <div className="absolute right-4 text-sm text-gray-500">
                      ≈ ${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} MXN
                    </div>
                  </div>

                  {/* Preview detallado */}
                  <div className="mt-4 p-6 bg-blue-50 rounded-xl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Amount in USD</span>
                        <span className="font-medium">
                          ${FIXED_USD_AMOUNT.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Exchange Rate</span>
                        <span className="font-medium text-[#3983ED]">
                          1 USD = {EXCHANGE_RATE} MXN
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Converted Amount</span>
                        <span className="font-medium">
                          ${convertedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} MXN
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Fee ({FEE_PERCENTAGE * 100}%)</span>
                        <span className="font-medium text-red-500">
                          -${fee.toLocaleString('en-US', { minimumFractionDigits: 2 })} MXN
                        </span>
                      </div>

                      <div className="h-px bg-gray-200 my-2"></div>

                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">Total to Receive</span>
                        <span className="font-bold text-green-600">
                          ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} MXN
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Vista del móvil */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-[320px] mx-auto">
            <div className="relative bg-white h-[600px] overflow-y-auto">
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center gap-3 mb-6">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-gray-100 object-cover"
                  />
                  <div>
                    <h2 className="text-lg font-medium">Hi 👋, Alexander</h2>
                    <p className="text-gray-500 text-xs">Welcome back</p>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-500 text-xs mb-1">Available Balance</p>
                  <h1 className="text-3xl font-bold text-[#3983ED] animate-fade-in">
                    ${balance.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </h1>
                  <p className="text-gray-400 text-xs mt-1">MXN</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: 'paper-plane', text: 'Send Money' },
                    { icon: 'droplet', text: 'Basic Services' },
                    { icon: 'minus-circle', text: 'External Withdrawal' }
                  ].map(({ icon, text }) => (
                    <button key={text} className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[#3983ED] text-white flex items-center justify-center mb-1">
                        <i className={`eva eva-${icon}-outline text-lg`} />
                      </div>
                      <span className="text-[10px] text-gray-600">{text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="px-6">
                <h3 className="text-gray-600 text-sm font-medium mb-3">Recent Transactions</h3>
                <div className="space-y-3">
                  {transactions.map(transaction => (
                    <div 
                      key={transaction.id} 
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        transaction.isCredit ? 'animate-fade-in border-green-100 bg-green-50' : 'border-gray-100'
                      }`}
                    >
                      <div>
                        <p className="font-medium text-sm text-gray-900">{transaction.description}</p>
                        <p className="text-gray-500 text-[10px]">{transaction.date}</p>
                      </div>
                      <span className={`${transaction.isCredit ? 'text-green-500' : 'text-orange-500'} text-sm font-medium`}>
                        {transaction.isCredit ? '+' : '-'} MXN ${transaction.amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Bar */}
              <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white">
                <div className="flex justify-between p-3">
                  {[
                    { icon: 'home', text: 'Home', active: true },
                    { icon: 'swap', text: 'Transfer' },
                    { icon: 'credit-card', text: 'Cards' },
                    { icon: 'message-square', text: 'Chat' },
                    { icon: 'person', text: 'Profile' }
                  ].map(({ icon, text, active }) => (
                    <button key={text} className="flex flex-col items-center gap-1">
                      <i className={`eva eva-${icon}-outline text-xl ${
                        active ? 'text-[#3983ED]' : 'text-gray-400'
                      }`} />
                      <span className={`text-[10px] ${
                        active ? 'text-[#3983ED]' : 'text-gray-400'
                      }`}>
                        {text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-100 border-t-[#3983ED] rounded-full animate-spin" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Países disponibles */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">Available in</p>
          <div className="flex justify-center gap-4">
            {[
              { Component: US, name: 'USA' },
              { Component: MX, name: 'Mexico' },
              { Component: CO, name: 'Colombia' },
              { Component: CL, name: 'Chile' }
            ].map(({ Component, name }) => (
              <div key={name} className="w-12 h-12 rounded-lg shadow-sm overflow-hidden">
                <Component className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default InternationalTransfer; 