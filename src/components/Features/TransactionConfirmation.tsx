import { useEffect } from 'react';
import { NavigationBar } from './NavigationBar';
import { ConfirmSlider } from './ConfirmSlider';
import { useFeatureStore } from './store';

interface TransactionConfirmationProps {
  amount: number;
  fee: number;
  recipient?: string;
}

export const TransactionConfirmation: React.FC<TransactionConfirmationProps> = ({
  amount,
  fee,
  recipient = "John Cooper",
}) => {
  const goBack = useFeatureStore(state => state.goBack);

  return (
    <div className="min-w-full h-[600px] bg-white relative">
      <div className="flex items-center gap-4 p-4 border-b">
        <button 
          className="back-button"
          onClick={() => {
            window.alert("Volviendo a la pantalla anterior");
            goBack();
          }}
        >
          <i className="eva eva-arrow-back-outline" />
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
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${recipient}`} alt={recipient} className="w-6 h-6 rounded-full" />
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
          <ConfirmSlider onConfirm={() => console.log('Confirmed')} text="Slide to confirm" />
        </div>
      </div>

      <NavigationBar />
    </div>
  );
}; 