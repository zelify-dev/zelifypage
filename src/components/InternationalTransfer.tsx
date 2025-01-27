import { useState, useEffect } from 'react';
import { GB, MX, CO, CL, US } from 'country-flag-icons/react/3x2';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  description: string;
  isCredit?: boolean;
  avatar: string;
  name: string;
  country: string;
  status: string;
}

const BENEFITS = [
  {
    icon: 'flash',
    title: 'Instant Transfers',
    description: 'Money arrives in seconds, not days. Real-time cross-border transfers.',
    color: 'from-yellow-400 to-orange-400',
    bgGradient: 'from-yellow-50 via-orange-50 to-red-50',
    iconBg: 'bg-yellow-400/10'
  },
  {
    icon: 'percent',
    title: 'Low Fees',
    description: 'Only 3% fee, compared to 5-7% with traditional banks.',
    color: 'from-blue-500 via-indigo-500 to-violet-500',
    bgGradient: 'from-blue-50 via-indigo-50 to-violet-50',
    iconBg: 'bg-blue-400/10'
  },
  {
    icon: 'trending-up',
    title: 'Best Exchange Rates',
    description: 'Save up to 2% on exchange rates compared to banks.',
    color: 'from-emerald-400 via-green-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    image: '/images/exchange-rates.webp',
    stats: '2% Better',
    highlight: 'Market Rates'
  },
  {
    icon: 'shield',
    title: 'Secure & Easy',
    description: 'Bank-level security with an easy-to-use interface.',
    color: 'from-purple-500 via-fuchsia-500 to-pink-500',
    bgLight: 'bg-purple-50',
    image: '/images/security.webp',
    stats: '256-bit',
    highlight: 'Bank Grade'
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
  const FEE_PERCENTAGE = 0.03;

  // Cálculos fijos
  const convertedAmount = FIXED_USD_AMOUNT * EXCHANGE_RATE;
  const fee = convertedAmount * FEE_PERCENTAGE;
  const totalAmount = convertedAmount - fee;
  
  // Usar useEffect para actualizar el estado después del montaje
  const [balance, setBalance] = useState(180973.00);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Transacciones como constante para evitar diferencias de hidratación
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'International',
      amount: totalAmount,
      date: '15 Mar, 2024',
      description: 'Transferencia internacional',
      isCredit: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      name: 'Sarah Johnson',
      country: 'GB',
      status: 'completed'
    },
    {
      id: '2',
      type: 'International',
      amount: 850,
      date: 'Jan 11, 2025',
      description: 'Transferencia internacional',
      isCredit: true,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
      name: 'Miguel Ángel',
      country: 'MX',
      status: 'pending'
    }
  ];

  useEffect(() => {
    // Cualquier efecto secundario que necesite ejecutarse solo en el cliente
    const handleClientSideInit = () => {
      // Inicialización específica del cliente si es necesaria
    };
    handleClientSideInit();
  }, []);

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
      {/* Fondo decorativo */}
      <div className="absolute inset-0">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#3983ED] to-blue-600">
            Send Money Globally
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
          Experience lightning-fast international transfers at the best rates.
          </p>
        </div>

        {/* Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-24">
          {BENEFITS.map((benefit, index) => (
            <button
              key={benefit.title}
              className={`group relative p-6 rounded-2xl border border-gray-100 
                transition-all duration-300 hover:shadow-lg 
                bg-gradient-to-br ${benefit.bgGradient} hover:bg-opacity-90
                flex items-start gap-4 text-left`}
            >
              {/* Icono con animación */}
              <div className="relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                  bg-gradient-to-br ${benefit.color} group-hover:scale-110 
                  transition-all duration-300 transform group-hover:rotate-12`}
                >
                  <i className={`eva eva-${benefit.icon}-outline text-xl text-white
                    group-hover:animate-bounce-subtle`} 
                  />
                </div>
                <div className={`absolute -inset-1 bg-gradient-to-br ${benefit.color} 
                  opacity-30 blur-sm group-hover:opacity-50 transition-opacity duration-300
                  rounded-xl`}
                />
              </div>

              <div className="flex-1">
                {/* Título */}
                <h3 className={`text-lg font-bold mb-2 bg-gradient-to-r ${benefit.color} 
                  bg-clip-text text-transparent`}>
                  {benefit.title}
                </h3>

                {/* Descripción */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Separador decorativo */}
        <div className="w-full max-w-2xl mx-auto mb-5">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Vista del móvil (USA) */}
          <div className="relative">
            {/* Bandera USA sobre el dispositivo */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
              <US className="w-8 h-8 rounded-full shadow-lg" />
            </div>
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-[320px] mx-auto">
              <div className="relative bg-white h-[600px] overflow-y-auto">
                {/* Header con flecha de regreso */}
                <div className="flex items-center gap-2 p-4 border-b border-gray-100">
                  <button className="text-gray-600">
                    <i className="eva eva-arrow-ios-back-outline text-xl" />
                  </button>
                  <h1 className="text-lg font-medium text-[#3983ED]">Confirm Transaction</h1>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Transaction Details</h2>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500 text-sm">Date/Time</span>
                      <span className="text-gray-900 text-sm">1/21/2025, 12:26:04 PM</span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500 text-sm">Recipient</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 text-sm">Juan Perez</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500 text-sm">Payment Method</span>
                      <span className="text-gray-900 text-sm">BALANCE</span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500 text-sm">Amount</span>
                      <div className="text-right">
                        <div className="text-gray-900 text-sm">$500.00 USD</div>
                        <div className="text-gray-400 text-xs">= $8,269.25 MXN</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500 text-sm">Fee</span>
                      <div className="text-right">
                        <div className="text-gray-900 text-sm">$15.00 USD</div>
                        <div className="text-gray-400 text-xs">= $254.25 MXN</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 mt-4 border-t border-gray-100 pt-4">
                      <span className="text-gray-900 font-bold text-lg">Total</span>
                      <div className="text-right">
                        <div className="text-gray-900 font-bold text-lg">$515.00 USD</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Bar */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 py-3 px-6 bg-white">
                  <div className="flex justify-between">
                    {[
                      { icon: 'home-outline', text: 'Home' },
                      { icon: 'swap-outline', text: 'Transfer' },
                      { icon: 'credit-card-outline', text: 'Cards' },
                      { icon: 'message-circle-outline', text: 'Chat' },
                      { icon: 'person-outline', text: 'Profile' }
                    ].map(({ icon, text }) => (
                      <button key={text} className="flex flex-col items-center gap-1">
                        <i className={`eva eva-${icon} text-xl ${text === 'Transfer' ? 'text-[#3983ED]' : 'text-gray-400'}`} />
                        <span className={`text-[8px] ${text === 'Transfer' ? 'text-[#3983ED] font-medium' : 'text-gray-400'}`}>
                          {text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vista del móvil (MX) */}
          <div className="relative">
            {/* Bandera MX sobre el dispositivo */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
              <MX className="w-8 h-8 rounded-full shadow-lg" />
            </div>
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-[320px] mx-auto">
              <div className="relative bg-white h-[600px] overflow-y-auto">
                {/* Header con imagen de usuario */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-cover bg-center"
                      style={{ backgroundImage: "url('https://api.dicebear.com/7.x/avataaars/svg?seed=Juan')" }}>
                    </div>
                    <div>
                      <h2 className="text-lg font-medium">Hola Juan</h2>
                      <p className="text-gray-500 text-xs">Bienvenido de nuevo</p>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-gray-500 text-xs mb-1">Saldo Disponible</p>
                    <h1 className="text-3xl font-bold text-[#3983ED] animate-fade-in">
                      $8,269.25
                    </h1>
                    <p className="text-gray-400 text-xs mt-1">MXN</p>
                  </div>

                  {/* Quick Actions en español */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: 'paper-plane', text: 'Enviar Dinero' },
                      { icon: 'droplet', text: 'Servicios' },
                      { icon: 'minus-circle', text: 'Retiro Externo' }
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

                {/* Recent Transactions en español */}
                <div className="px-6">
                  <h3 className="font-medium mb-4">Transacciones Recientes</h3>
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

                {/* Navigation Bar pantalla MX */}
                <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 py-3 px-6 bg-white">
                  <div className="flex justify-between">
                    {[
                      { icon: 'home-outline', text: 'Home' },
                      { icon: 'swap-outline', text: 'Transfer' },
                      { icon: 'credit-card-outline', text: 'Cards' },
                      { icon: 'message-circle-outline', text: 'Chat' },
                      { icon: 'person-outline', text: 'Profile' }
                    ].map(({ icon, text }) => (
                      <button key={text} className="flex flex-col items-center gap-1">
                        <i className={`eva eva-${icon} text-xl ${text === 'Transfer' ? 'text-[#3983ED]' : 'text-gray-400'}`} />
                        <span className={`text-[8px] ${text === 'Transfer' ? 'text-[#3983ED] font-medium' : 'text-gray-400'}`}>
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
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 1s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default InternationalTransfer; 