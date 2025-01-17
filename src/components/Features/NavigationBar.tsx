interface NavigationBarProps {
  activeTab?: string;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ activeTab = "Transfer" }) => (
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