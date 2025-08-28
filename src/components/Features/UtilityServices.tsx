import { NavigationBar } from './NavigationBar';
import { useFeatureStore } from './store';

interface Service {
  id: string;
  name: string;
  icon: string;
  amount: number;
  fee: number;
}

interface UtilityServicesProps {
  services: Service[];
  onServiceClick: (id: string) => void;
  onBackClick: () => void;
}

export const UtilityServices: React.FC<UtilityServicesProps> = ({
  services,
  onServiceClick,
  onBackClick
}) => {
  const goBack = useFeatureStore(state => state.goBack);

  return (
    <div className="min-w-full h-[600px] bg-white relative">
      <div className="flex items-center gap-4 p-4 bg-[#00223E]">
        <button
          className="text-white p-2 hover:bg-[#00223E]/80 rounded-full transition-all"
          onClick={goBack}
          type="button"
        >
          <i className="eva eva-arrow-back-outline text-xl" />
        </button>
        <h2 className="text-[#B0FF51] text-base font-medium">Utility Services</h2>
      </div>

      <div className="p-6">
        <h3 className="text-base font-bold mb-6 text-[#00223E]">Available Services:</h3>

        <div className="grid grid-cols-2 gap-4">
          {services.map(service => (
            <button
              key={service.id}
              type="button"
              className="flex flex-col items-center p-4 rounded-2xl transition-all group"
              onClick={() => onServiceClick(service.id)}
            >
              <div className="w-12 h-12 rounded-full bg-[#00223E] flex items-center justify-center mb-3">
                <i className={`eva eva-${service.icon}-outline text-2xl text-white group-hover:text-white transition-colors`} />
              </div>
              <span className="text-xs text-[#00223E] group-hover:text-[#00223E] transition-colors">
                {service.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <NavigationBar />
    </div>
  );
}; 