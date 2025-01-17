import { create } from 'zustand';

interface FeaturesStore {
  currentSlide: number;
  activeService: string | null;
  setCurrentSlide: (slide: number) => void;
  setActiveService: (service: string | null) => void;
  goBack: () => void;
}

export const useFeatureStore = create<FeaturesStore>((set, get) => ({
  currentSlide: 0,
  activeService: null,
  setCurrentSlide: (slide) => set({ currentSlide: slide }),
  setActiveService: (service) => set({ activeService: service }),
  goBack: () => {
    const state = get();
    // Forzar la limpieza del servicio activo
    set({ activeService: null });
    console.log('Going back, clearing service:', state.activeService); // Para debug
  },
})); 