import { NavigationBar } from './NavigationBar';
import { useFeatureStore } from './store';
import { ConfirmSlider } from './ConfirmSlider';
import { useState } from 'react';

interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  logo: string;
}

interface ExternalCashoutProps {
  balance?: number;
  fee?: number;
}

export const ExternalCashout: React.FC<ExternalCashoutProps> = ({
  balance = 9876.50,
  fee = 0.04
}) => {
  const goBack = useFeatureStore(state => state.goBack);
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [isConfirmationScreen, setIsConfirmationScreen] = useState(false);

  const isSpanish = window.location.pathname.startsWith('/es');

  const handleContinue = () => {
    setIsConfirmationScreen(true);
  };

  if (isConfirmationScreen) {
    return (
      <div className="min-w-full h-[600px] bg-white relative">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 bg-[#00223E]">
          <button
            className="text-white p-2 hover:bg-[#00223E]/80 rounded-full transition-all"
            onClick={() => setIsConfirmationScreen(false)}
          >
            <i className="eva eva-arrow-back-outline text-xl" />
          </button>
          <h2 className="text-[#B0FF51] text-base font-medium">
            {isSpanish ? 'Confirmar Transacción' : 'Confirm transaction'}
          </h2>
        </div>

        <div className="p-6 space-y-6 mb-20">
          <div className="bg-white rounded-xl">
            <h3 className="text-lg font-bold mb-6">
              {isSpanish ? 'Detalles de la Transacción' : 'Transaction Details'}
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs">
                  {isSpanish ? 'Fecha/Hora' : 'Date/Time'}
                </span>
                <span className="text-gray-900 text-xs">{new Date().toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs">
                  {isSpanish ? 'Para' : 'To'}
                </span>
                <div className="flex items-center gap-2">
                  <img src={selectedBank?.logo} alt={selectedBank?.name} className="w-6 h-6 rounded-full" />
                  <span className="text-gray-900 text-xs">{selectedBank?.name}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs">
                  {isSpanish ? 'Cuenta' : 'Account'}
                </span>
                <span className="text-gray-900 text-xs">****{selectedBank?.accountNumber.slice(-4)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs">
                  {isSpanish ? 'Método de Pago' : 'Payment Method'}
                </span>
                <span className="text-gray-900 text-xs">
                  {isSpanish ? 'SALDO' : 'BALANCE'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs">
                  {isSpanish ? 'Monto' : 'Amount'}
                </span>
                <span className="text-gray-900 text-xs">USD {amount}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-xs">
                  {isSpanish ? 'Comisión' : 'Fee'}
                </span>
                <span className="text-gray-900 text-xs">USD {fee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-200">
                <span className="text-gray-900 font-bold text-lg">Total</span>
                <span className="text-gray-900 font-bold text-lg">USD {(Number(amount) + fee).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[80px] left-0 right-0 px-6">
            <ConfirmSlider
              onConfirm={() => console.log('Confirmed')}
              text={isSpanish ? "Desliza para confirmar" : "Slide to confirm"}
            />
          </div>
        </div>
      </div>
    );
  }

  const banks: Bank[] = [
    {
      id: 'chase',
      name: 'Chase Bank',
      accountNumber: '****4532',
      logo: 'https://logo.clearbit.com/chase.com'
    },
    {
      id: 'bofa',
      name: 'Bank of America',
      accountNumber: '****7891',
      logo: 'https://companieslogo.com/img/orig/BAC-e7995069.png?t=1720244490'
    },
    {
      id: 'wells',
      name: 'Wells Fargo',
      accountNumber: '****2345',
      logo: 'https://logo.clearbit.com/wellsfargo.com'
    },
    {
      id: 'citi',
      name: 'Citibank',
      accountNumber: '****6789',
      logo: 'https://logo.clearbit.com/citibank.com'
    }
  ];

  return (
    <div className="min-w-full h-[600px] bg-white relative">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-[#00223E]">
        <button className="text-white p-2 hover:bg-[#00223E]/80 rounded-full transition-all" onClick={goBack}>
          <i className="eva eva-arrow-back-outline text-xl" />
        </button>
        <h2 className="text-[#B0FF51] text-base font-medium">
          {isSpanish ? 'Transferencia Bancaria' : 'Bank Transfer'}
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm border">
          <p className="text-gray-500 text-xs mb-1">
            {isSpanish ? 'Tu saldo' : 'Your balance'}
          </p>
          <div className="flex items-center justify-center gap-1">
            <span className="text-[#3983ED] text-sm">USD</span>
            <span className="text-[#3983ED] text-2xl font-bold">
              {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-sm mb-1">
            {isSpanish ? 'Dólares Americanos' : 'US Dollars'}
          </p>
          <p className="text-gray-500 text-[10px]">
            {isSpanish ? 'Comisión por transacción: USD ' : 'Transaction fee: USD '}{fee.toFixed(2)}
          </p>
        </div>

        {/* Bank Account */}
        <div className="space-y-1">
          <label className="text-gray-500 text-xs">
            {isSpanish ? 'Cuenta bancaria' : 'Bank account'}
          </label>
          <div className="relative">
            <button
              className="w-full flex items-center justify-between p-3 border rounded-xl"
              onClick={() => document.getElementById('bankList')?.classList.toggle('hidden')}
            >
              {selectedBank ? (
                <div className="flex items-center gap-2">
                  <img src={selectedBank.logo} alt={selectedBank.name} className="w-5 h-5 object-contain" />
                  <span className="text-sm">{selectedBank.name} - {selectedBank.accountNumber}</span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">
                  {isSpanish ? 'Selecciona un banco' : 'Select a bank'}
                </span>
              )}
              <i className="eva eva-chevron-down-outline text-gray-400" />
            </button>

            {/* Bank List Dropdown */}
            <div id="bankList" className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg hidden">
              {banks.map(bank => (
                <button
                  key={bank.id}
                  className="w-full flex items-center gap-2 p-3 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setSelectedBank(bank);
                    document.getElementById('bankList')?.classList.add('hidden');
                  }}
                >
                  <img src={bank.logo} alt={bank.name} className="w-5 h-5 object-contain" />
                  <span className="text-sm">{bank.name} - {bank.accountNumber}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Amount */}
        <div className="space-y-1">
          <label className="text-gray-500 text-xs">
            {isSpanish ? 'Monto' : 'Amount'}
          </label>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex-1 relative">
              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, '');
                  if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setAmount(value);
                  }
                }}
                placeholder="0.00"
                className="w-full text-sm outline-none bg-transparent border-none focus:ring-0"
              />
            </div>
            <span className="text-gray-400 text-sm ml-2">USD</span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          className={`w-full py-3 rounded-xl text-sm font-medium mt-6 ${selectedBank && amount ? 'bg-[#95FF0B] text-[#00213C]' : 'bg-gray-100 text-gray-400'
            }`}
          disabled={!selectedBank || !amount}
          onClick={handleContinue}
        >
          {isSpanish ? 'Continuar' : 'Continue'}
        </button>
      </div>
    </div>
  );
}; 