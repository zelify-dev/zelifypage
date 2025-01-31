import { useState } from 'react';
import { TransactionConfirmation } from './TransactionConfirmation';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
}

interface ChatMessage {
  id: string;
  text: string;
  time: string;
  sender: 'user' | 'contact';
}

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  type: 'transfer' | 'request';
}

const TransferModal = ({ isOpen, onClose, onSubmit, type }: TransferModalProps) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const value = Number(amount);
    if (value <= 0 || value > 10000) {
      setError('Amount must be between $0 and $10,000');
      return;
    }
    onSubmit(value);
    onClose();
    setAmount('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm">
        <h3 className="text-lg font-medium mb-4">
          {type === 'transfer' ? 'Transfer Money' : 'Request Money'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#3983ED]"
              placeholder="Enter amount"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-[#3983ED] text-white rounded-xl text-sm"
            >
              {type === 'transfer' ? 'Transfer' : 'Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ChatTransfer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transferAmount, setTransferAmount] = useState(0);

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Cooper',
      avatar: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=150&h=150&fit=crop',
      lastMessage: "Hi! How's the project going? 👋",
      time: '16:23',
      unread: 1
    },
    {
      id: '2',
      name: 'Dr. Brand',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Brand',
      lastMessage: 'Those arent mountains...',
      time: '15:45'
    },
    {
      id: '3',
      name: 'Murphy Cooper',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Murphy',
      lastMessage: 'Dad, come back...',
      time: 'Yesterday'
    },
    {
      id: '4',
      name: 'TARS',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TARS',
      lastMessage: 'Humor setting at 75%',
      time: '12:30'
    },
    {
      id: '5',
      name: 'Prof. John Brand',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JohnBrand',
      lastMessage: 'Plan A was always possible',
      time: 'Wed'
    }
  ];

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    if (contact.name === 'Cooper') {
      setMessages([
        {
          id: '1',
          text: "Hi! How's the project going? 👋",
          time: '16:23',
          sender: 'contact'
        },
        {
          id: '2',
          text: "Hey! All good, almost done 💪",
          time: '16:23',
          sender: 'user'
        },
        {
          id: '3',
          text: "Hey, could you lend me some money for hosting? 🙏",
          time: '16:23',
          sender: 'contact'
        }
      ]);
    }
  };

  const handleTransfer = (amount: number) => {
    setTransferAmount(amount);
    setShowConfirmation(true);
  };

  const handleRequest = (amount: number) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: `${selectedContact?.name} requests $${amount.toFixed(2)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'contact',
      isRequest: true
    }]);
  };

  if (showConfirmation) {
    return (
      <div className="min-w-full h-full bg-white">
        <TransactionConfirmation
          amount={transferAmount}
          recipient="John Cooper"
          onBack={() => setShowConfirmation(false)}
        />
      </div>
    );
  }

  if (selectedContact?.name === 'Cooper') {
    return (
      <div className="min-w-full h-full bg-white flex flex-col">
        {/* Header del chat */}
        <div className="flex items-center gap-2 p-3 border-b bg-white">
          <button 
            className="text-gray-600"
            onClick={() => setSelectedContact(null)}
          >
            <i className="eva eva-arrow-back-outline text-lg" />
          </button>
          
          <div className="flex items-center gap-2">
            <img
              src={selectedContact.avatar}
              alt={selectedContact.name}
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
                className="w-8 h-8 bg-green-500 rounded-full text-white hover:bg-green-600 transition-all transform hover:scale-105 flex items-center justify-center"
                onClick={() => setShowTransferModal(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" 
                  />
                </svg>
              </button>
              <span className="text-[10px] text-gray-600 mt-0.5">Transfer</span>
            </div>
            
            <div className="flex flex-col items-center">
              <button 
                className="w-8 h-8 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-all transform hover:scale-105 flex items-center justify-center"
                onClick={() => setShowRequestModal(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <path 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" 
                  />
                </svg>
              </button>
              <span className="text-[10px] text-gray-600 mt-0.5">Request</span>
            </div>
          </div>
        </div>

        {/* Área de mensajes - ajustado el padding bottom */}
        <div className="flex-1 overflow-y-auto p-3 pb-[120px] bg-gray-50">
          <div className="flex justify-start">
            <div className="bg-white rounded-[20px] rounded-bl-sm px-4 py-2.5 shadow-sm max-w-[80%]">
              <p className="text-[13px]">Hi! How's the project going? 👋</p>
              <span className="text-[10px] text-gray-500 mt-1 block">16:23</span>
            </div>
          </div>
        </div>

        {/* Container fijo para input y navbar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white">
          {/* Input */}
          <div className="border-t">
            <div className="px-4 py-3">
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 py-2 px-3 border rounded-full text-sm focus:outline-none focus:border-blue-500"
                />
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Navbar - sin espacio extra */}
          <div className="border-t">
            <div className="flex justify-between py-3 px-6">
              {[
                { icon: 'home-outline', text: 'Home' },
                { icon: 'swap-outline', text: 'Transfer' },
                { icon: 'credit-card-outline', text: 'Cards' },
                { icon: 'message-square-outline', text: 'Chat', active: true },
                { icon: 'person-outline', text: 'Profile' }
              ].map(({ icon, text, active }) => (
                <button key={text} className="flex flex-col items-center gap-1">
                  <i className={`eva eva-${icon} text-xl ${active ? 'text-[#3983ED]' : 'text-gray-600'}`} />
                  <span className={`text-[10px] ${active ? 'text-[#3983ED] font-medium' : 'text-gray-600'}`}>
                    {text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modales */}
        <TransferModal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          onSubmit={handleTransfer}
          type="transfer"
        />
        <TransferModal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          onSubmit={handleRequest}
          type="request"
        />
      </div>
    );
  }

  return (
    <div className="min-w-full h-full bg-white">
      {/* Header con diseño refinado */}
      <div className="pt-6 pb-5 px-6">
        <h1 className="text-[22px] font-semibold mb-1">Messages</h1>
        <p className="text-gray-500 text-[13px] mb-5">
          Chat and send money to your contacts instantly
        </p>
        
        {/* Search Bar rediseñada */}
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-gray-400/80">
              <i className="eva eva-search-outline text-lg" />
            </div>
            <input
              type="text"
              placeholder="Search contacts"
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50/70 text-[14px] outline-none transition-all
                border border-gray-100 rounded-[12px]
                placeholder:text-gray-400/90
                focus:border-[#3983ED]/20 focus:bg-white focus:shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            className="p-2.5 text-[#3983ED] bg-gray-50/70 rounded-[12px] border border-gray-100
              hover:bg-white hover:border-[#3983ED]/20 hover:shadow-sm transition-all"
          >
            <i className="eva eva-plus-outline text-xl" />
          </button>
        </div>
      </div>

      {/* Contact List con padding ajustado */}
      <div className="overflow-y-auto h-[calc(100%-165px)]">
        {contacts
          .filter(contact => 
            contact.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(contact => (
            <button
              key={contact.id}
              className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/70 active:bg-gray-100/80 transition-colors border-b border-gray-100"
              onClick={() => handleContactClick(contact)}
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-11 h-11 rounded-full"
                />
                {contact.unread && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-[#3983ED] text-white text-[11px] rounded-full flex items-center justify-center">
                    {contact.unread}
                  </span>
                )}
              </div>
              
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-[14px] text-gray-900">{contact.name}</h3>
                  <span className="text-[11px] text-gray-500">{contact.time}</span>
                </div>
                <p className="text-[12px] text-gray-500 truncate mt-0.5">
                  {contact.lastMessage}
                </p>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}; 