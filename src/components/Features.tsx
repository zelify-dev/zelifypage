import { useState, useEffect } from 'react';
import { ExternalCashout } from './Features/ExternalCashout';
import { ConfirmSlider } from './Features/ConfirmSlider';

interface Service {
  id: string;
  name: string;
  icon: string;
  amount: number;
  fee: number;
}

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'transfer' | 'request';
}

interface TransactionConfirmationProps {
  amount?: number;
  fee?: number;
  recipient?: string;
  onBack: () => void;
}

const NavigationBar = ({ activeTab = "Transfer" }) => (
  <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 py-3 px-6 bg-white">
    <div className="flex justify-between">
      {[
        { icon: 'home-outline', text: 'Home' },
        { icon: 'swap-outline', text: 'Transfer' },
        { icon: 'credit-card-outline', text: 'Cards' },
        { icon: 'message-square-outline', text: 'Chat' },
        { icon: 'person-outline', text: 'Profile' }
      ].map(({ icon, text }) => (
        <button key={text} className="flex flex-col items-center gap-1">
          <i className={`eva eva-${icon} text-xl ${text === activeTab ? 'text-[#3983ED]' : 'text-gray-600'}`} />
          <span className={`text-[10px] ${text === activeTab ? 'text-[#3983ED] font-medium' : 'text-gray-600'}`}>
            {text}
          </span>
        </button>
      ))}
    </div>
  </div>
);

const TransactionConfirmation = ({ 
  amount = 600, 
  fee = 0, 
  recipient = "John Cooper",
  onBack 
}: TransactionConfirmationProps) => (
  <div className="slide min-w-full h-[600px] bg-white relative">
    <div className="flex items-center gap-4 p-4 border-b">
      <button 
        className="text-[#3983ED] p-2 hover:bg-gray-100 rounded-full transition-all"
        onClick={onBack}
      >
        <i className="eva eva-arrow-back-outline text-xl" />
      </button>
      <h2 className="text-[#3983ED] text-base font-medium">Confirm Transaction</h2>
    </div>

    <div className="p-6 space-y-6 mb-20">
      <div className="bg-white rounded-xl">
        <h3 className="text-lg font-bold mb-6">Transaction Details</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs">Date/Time</span>
            <span className="text-gray-900 text-xs">{new Date().toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs">Recipient</span>
            <div className="flex items-center gap-2">
              {recipient.includes('Service') ? (
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                  <i className={`eva eva-${
                    recipient.toLowerCase().includes('water') ? 'droplet' :
                    recipient.toLowerCase().includes('electricity') ? 'bulb' :
                    recipient.toLowerCase().includes('internet') ? 'wifi' :
                    recipient.toLowerCase().includes('gas') ? 'flame' :
                    recipient.toLowerCase().includes('phone') ? 'phone' :
                    'flash'
                  }-outline text-sm text-blue-600`} />
                </div>
              ) : (
                <img src="https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=150&h=150&fit=crop" alt={recipient} className="w-6 h-6 rounded-full" />
              )}
              <span className="text-gray-900 text-xs">{recipient}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs">Payment Method</span>
            <span className="text-gray-900 text-xs">BALANCE</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs">Amount</span>
            <span className="text-gray-900 text-xs">${amount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs">Fee</span>
            <span className="text-gray-900 text-xs">${fee.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
            <span className="text-gray-900 font-bold text-lg">Total</span>
            <span className="text-gray-900 font-bold text-lg">${(amount + fee).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[80px] left-0 right-0 px-6">
        <ConfirmSlider 
          onConfirm={() => {
            console.log('Transaction confirmed:', {
              type: 'external_cashout',
              timestamp: new Date().toISOString(),
              status: 'success'
            });
          }}
          text="Slide to confirm"
        />
      </div>
    </div>
  </div>
);

const UtilityServices = ({ 
  onServiceClick, 
  services 
}: { 
  onServiceClick: (id: string) => void;
  services: Service[];
}) => (
  <div className="slide min-w-full h-[600px] bg-white relative">
    <div className="flex items-center gap-4 p-4 border-b">
      <button className="text-[#3983ED] p-2 hover:bg-gray-100 rounded-full transition-all">
        <i className="eva eva-arrow-back-outline text-xl" />
      </button>
      <h2 className="text-[#3983ED] text-base font-medium">Utility Services</h2>
    </div>

    <div className="p-6">
      <h3 className="text-base font-bold mb-6">Available Services:</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {services.map(service => (
          <button
            key={service.id}
            className="flex flex-col items-center p-4 rounded-2xl transition-all group"
            onClick={() => onServiceClick(service.id)}
          >
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
              <i className={`eva eva-${service.icon}-outline text-2xl text-gray-600 group-hover:text-[#3983ED] transition-colors`} />
            </div>
            <span className="text-xs text-gray-600 group-hover:text-[#3983ED] transition-colors">
              {service.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

const TransferModal = ({ isOpen, onClose, type }: TransferModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-[90%] rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {type === 'transfer' ? 'Send Money' : 'Request Money'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#3983ED]"
                placeholder="0.00"
              />
            </div>
          </div>

          <button 
            className="w-full py-2.5 bg-[#3983ED] text-white rounded-xl text-sm font-medium"
          >
            {type === 'transfer' ? 'Send Money' : 'Request Money'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  // Estado inicial estático para evitar diferencias de hidratación
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Datos estáticos
  const services = [
    { id: 'water', name: 'Water', icon: 'droplet', amount: 120.50, fee: 0.50 },
    { id: 'electricity', name: 'Electricity', icon: 'bulb', amount: 200.75, fee: 0.75 },
    { id: 'internet', name: 'Internet', icon: 'wifi', amount: 89.99, fee: 0.45 },
    { id: 'phone', name: 'Phone', icon: 'phone', amount: 65.00, fee: 0.35 }
  ] as const;

  const features = [
    { 
      name: 'Internal Transfer', 
      icon: 'swap',
      description: 'Send money instantly between accounts'
    },
    { 
      name: 'Utility Services', 
      icon: 'grid',
      description: 'Pay all your bills in one place'
    },
    { 
      name: 'External Cashout', 
      icon: 'download',
      description: 'Withdraw to external accounts'
    },
    { 
      name: 'Pay via chat', 
      icon: 'message-square',
      description: 'Effortless Social Payments with Zelify'
    }
  ] as const;

  // Manejar efectos del lado del cliente
  useEffect(() => {
    const handleClientSideInit = () => {
      // Inicialización específica del cliente
    };
    handleClientSideInit();
    
    return () => {
      // Limpieza al desmontar
      setCurrentSlide(0);
      setActiveService(null);
    };
  }, []);

  const handleBack = () => {
    setActiveService(null);
  };

  return (
    <div className="mx-auto max-w-screen-xl px-4 min-h-screen flex items-center py-8">
      {/* Avatares flotantes con mensajes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Burbuja de chat estilo Monzo - Superior */}
        <div className="absolute top-20 right-[5%] animate-float-slow lg:block hidden">
          <div className="relative">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover" />
            <div className="absolute -right-32 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs px-4 py-3 rounded-[18px] shadow-lg border border-gray-100 whitespace-nowrap">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 transform -rotate-45"></div>
              paid you $26.50
            </div>
          </div>
        </div>
        
        {/* Nueva burbuja - Superior derecha */}
        <div className="absolute top-[25%] right-[8%] animate-float-delayed-3 lg:block hidden">
          <div className="relative">
            <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover" />
            <div className="absolute -left-36 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs px-4 py-3 rounded-[18px] shadow-lg border border-gray-100 whitespace-nowrap">
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-r border-t border-gray-100 transform rotate-45"></div>
              transferred $55.20
            </div>
          </div>
        </div>
        
        {/* Grupo derecho */}
        <div className="absolute top-[15%] right-[15%] animate-float-delayed lg:block hidden">
          <div className="relative">
            <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="" className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover" />
            <div className="absolute -left-32 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs px-4 py-3 rounded-[18px] shadow-lg border border-gray-100 whitespace-nowrap">
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-r border-t border-gray-100 transform rotate-45"></div>
              requested $23.50
            </div>
          </div>
        </div>
        
        {/* Nueva burbuja - Centro derecha */}
        <div className="absolute top-[45%] right-[12%] animate-float-slow-4 lg:block hidden">
          <div className="relative">
            <img src="https://randomuser.me/api/portraits/women/63.jpg" alt="" className="w-11 h-11 rounded-full border-2 border-white shadow-lg object-cover" />
            <div className="absolute -right-36 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs px-4 py-3 rounded-[18px] shadow-lg border border-gray-100 whitespace-nowrap">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 transform -rotate-45"></div>
              split bill $128.50
            </div>
          </div>
        </div>
        
        {/* Grupo izquierdo */}
        <div className="absolute top-[60%] right-[25%] animate-float-slow-2 lg:block hidden">
          <div className="relative">
            <img src="https://randomuser.me/api/portraits/men/92.jpg" alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-lg object-cover" />
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs px-3 py-2 rounded-xl shadow-lg border border-gray-100 whitespace-nowrap">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 transform -rotate-45"></div>
              sent $15.75
            </div>
          </div>
        </div>
        
        {/* Grupo inferior */}
        <div className="absolute bottom-[30%] right-[10%] animate-float-delayed-2 lg:block hidden">
          <div className="relative">
            <img src="https://randomuser.me/api/portraits/women/29.jpg" alt="" className="w-11 h-11 rounded-full border-2 border-white shadow-lg object-cover" />
            <div className="absolute -left-24 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs px-3 py-2 rounded-xl shadow-lg border border-gray-100 whitespace-nowrap">
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-r border-t border-gray-100 transform rotate-45"></div>
              paid $42.30
            </div>
          </div>
        </div>
        
        {/* Grupo central */}
        <div className="absolute top-[40%] right-[35%] animate-float-slow-3 lg:block hidden">
          <div className="relative">
            <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="" className="w-9 h-9 rounded-full border-2 border-white shadow-lg object-cover" />
            <div className="absolute -right-24 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-xs px-3 py-2 rounded-xl shadow-lg border border-gray-100 whitespace-nowrap">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 transform -rotate-45"></div>
              received $33.90
            </div>
          </div>
        </div>
        
        {/* Mini avatares decorativos sin mensajes */}
        <div className="absolute top-[25%] right-[40%] animate-float-mini lg:block hidden">
          <img src="https://randomuser.me/api/portraits/men/41.jpg" alt="" className="w-8 h-8 rounded-full border-2 border-white shadow-lg opacity-50 object-cover" />
        </div>
        <div className="absolute bottom-[20%] right-[45%] animate-float-mini-2 lg:block hidden">
          <img src="https://randomuser.me/api/portraits/women/89.jpg" alt="" className="w-7 h-7 rounded-full border-2 border-white shadow-lg opacity-50 object-cover" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        <div className="w-full lg:w-5/12 space-y-8">
          <div className="space-y-6 text-center lg:text-left relative">
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="relative">
              <span className="inline-block text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1 rounded-full mb-4">
                In features
              </span>
              <h2 className="text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#3983ED] to-[#70FA7E] mx-auto lg:mx-0 mb-6">
              Zelify powers banking for both personal and business users
              </h2>
              <p className="text-xl text-gray-600 pr-4 max-w-lg mx-auto lg:mx-0">
              Send, split, or gift money instantl. No hassle, no waiting, just smooth transactions at your fingertips. Sending and receiving money is as easy as texting a friend.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 max-w-2xl mx-auto lg:mx-0">
            {features.map(({ name, icon, description }) => (
              <button
                key={name}
                className={`feature-card flex-1 min-w-[280px] group relative p-8 rounded-2xl border transition-all hover:shadow-xl
                  ${currentSlide === features.findIndex(f => f.name === name)
                    ? 'border-[#3983ED] bg-white shadow-lg'
                    : 'border-gray-100 hover:border-[#3983ED] hover:bg-white'
                  }`}
                onClick={() => {
                  setCurrentSlide(features.findIndex(f => f.name === name));
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`feature-icon w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0
                    ${currentSlide === features.findIndex(f => f.name === name)
                      ? 'bg-[#3983ED]'
                      : 'bg-blue-100 group-hover:bg-[#3983ED]'
                    }`}
                  >
                    <i className={`eva eva-${icon}-outline text-2xl
                      ${currentSlide === features.findIndex(f => f.name === name)
                        ? 'text-white'
                        : 'text-[#3983ED] group-hover:text-white'
                      }`}
                    />
                  </div>
                  <div className="flex flex-col items-start text-left flex-1">
                    <span className={`text-base font-medium transition-colors mb-2
                      ${currentSlide === features.findIndex(f => f.name === name)
                        ? 'text-[#3983ED]'
                        : 'text-gray-700 group-hover:text-[#3983ED]'
                      }`}
                    >
                      {name}
                    </span>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-7/12 flex justify-center">
          <div className="w-full max-w-[300px] relative">
            <div className="relative bg-[#1F1F1F] rounded-[40px] shadow-2xl p-[2px] border-[3px] border-black">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[20px] bg-black rounded-b-[16px] z-10" />
              
              <div className="absolute -right-[1px] top-[90px] w-[1px] h-10 bg-gray-800 rounded-l" />
              <div className="absolute -right-[1px] top-[150px] w-[1px] h-10 bg-gray-800 rounded-l" />
              <div className="absolute -left-[1px] top-[90px] w-[1px] h-14 bg-gray-800 rounded-r" />
              
              <div className="relative bg-black rounded-[35px] overflow-hidden h-[640px]">
                <div className="absolute inset-0 border-[3px] border-black rounded-[35px] pointer-events-none z-10" />
                
                <div className="features-slider w-full h-full bg-white relative">
                  <div 
                    className="slides flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    <div className="slide min-w-full h-full pb-[76px]">
                      <TransactionConfirmation onBack={() => setCurrentSlide(0)} />
                    </div>
                    
                    <div className="slide min-w-full h-full pb-[76px]">
                      {activeService ? (
                        <TransactionConfirmation
                          amount={services.find(s => s.id === activeService)?.amount || 0}
                          fee={services.find(s => s.id === activeService)?.fee || 0}
                          recipient={`${activeService.charAt(0).toUpperCase() + activeService.slice(1)} Service`}
                          onBack={handleBack}
                        />
                      ) : (
                        <UtilityServices
                          services={services}
                          onServiceClick={setActiveService}
                        />
                      )}
                    </div>
                    
                    <div className="slide min-w-full h-full pb-[76px]">
                      <ExternalCashout />
                    </div>
                    
                    <div className="slide min-w-full h-full">
                      <div className="flex flex-col h-full bg-white relative">
                        {/* Header */}
                        <div className="flex-none flex items-center gap-2 p-3 border-b mt-2">
                          <button className="text-gray-600">
                            <i className="eva eva-arrow-back-outline text-lg" />
                          </button>
                          
                          <div className="flex items-center gap-2">
                            <img
                              src="https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=150&h=150&fit=crop"
                              alt="John Cooper"
                              className="w-9 h-9 rounded-full"
                            />
                            <div>
                              <h3 className="text-[14px] font-medium">John Cooper</h3>
                              <p className="text-[11px] text-gray-500">@coop</p>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-auto">
                            <div className="flex flex-col items-center">
                              <button 
                                className="w-8 h-8 bg-green-500 rounded-full text-white"
                                onClick={() => setShowTransferModal(true)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" viewBox="0 0 24 24" fill="none">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                                </svg>
                              </button>
                              <span className="text-[10px] text-gray-600 mt-0.5">Transfer</span>
                            </div>
                            
                            <div className="flex flex-col items-center">
                              <button 
                                className="w-8 h-8 bg-blue-500 rounded-full text-white"
                                onClick={() => setShowRequestModal(true)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-auto" viewBox="0 0 24 24" fill="none">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                                </svg>
                              </button>
                              <span className="text-[10px] text-gray-600 mt-0.5">Request</span>
                            </div>
                          </div>
                        </div>

                        {/* Messages - usando flex-1 */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 pb-10">
                          <div className="p-3">
                            <div className="flex justify-start">
                              <div className="bg-white rounded-[20px] rounded-bl-sm px-4 py-2.5 shadow-sm max-w-[80%]">
                                <p className="text-[13px]">Hi! How's the project going? 👋</p>
                                <span className="text-[10px] text-gray-500 mt-1 block">16:23</span>
                              </div>
                            </div>
                          </div>
                          {/* Espacio flexible */}
                          <div className="flex-1 min-h-[300px]"></div>
                        </div>

                        {/* Footer - usando flex-none */}
                        <div className="flex-none">
                          {/* Input */}
                          <div className="border-t">
                            <div className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                                <input 
                                  type="text" 
                                  placeholder="Type a message..." 
                                  className="flex-1 py-2 px-3 rounded-full text-sm focus:outline-none bg-gray-50 border border-gray-100"
                                />
                                <button className="p-2 text-gray-400">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>

                        
                        </div>

                        {/* Modales dentro del chat */}
                        <TransferModal 
                          isOpen={showTransferModal} 
                          onClose={() => setShowTransferModal(false)} 
                          type="transfer" 
                        />
                        <TransferModal 
                          isOpen={showRequestModal} 
                          onClose={() => setShowRequestModal(false)} 
                          type="request" 
                        />
                      </div>
                    </div>
                  </div>

                  {currentSlide !== 5 && (
                    <div className="absolute bottom-0 left-0 right-0">
                      <NavigationBar activeTab={
                        currentSlide === 0 ? "Transfer" :
                        currentSlide === 1 ? "Services" :
                        currentSlide === 2 ? "Cards" : ""
                      } />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {[0, 1, 2, 3].map(index => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-[#3983ED] w-6' : 'bg-gray-200'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;