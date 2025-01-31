import { useState, useRef, useEffect } from 'react';

interface ConfirmSliderProps {
  onConfirm: () => void;
  text: string;
}

export const ConfirmSlider: React.FC<ConfirmSliderProps> = ({ onConfirm, text }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [sliderLeft, setSliderLeft] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0]?.pageX ?? 0 : (e as React.MouseEvent).pageX;
    startXRef.current = pageX - sliderLeft;
  };


  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const pageX = 'touches' in e ? (e as TouchEvent).touches[0]?.pageX ?? 0 : (e as MouseEvent).pageX;
    const walk = pageX - startXRef.current;
    const maxLeft = sliderRef.current.parentElement!.offsetWidth - sliderRef.current.offsetWidth;
    let newLeft = Math.max(0, Math.min(walk, maxLeft));

    if (newLeft >= maxLeft * 0.85) {
      newLeft = maxLeft;
      handleConfirm();
    }

    setSliderLeft(newLeft);
    setProgress((newLeft / maxLeft) * 100);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (sliderRef.current && !isConfirmed) {
      const maxLeft = sliderRef.current.parentElement!.offsetWidth - sliderRef.current.offsetWidth;
      if (sliderLeft < maxLeft * 0.85) {
        setSliderLeft(0);
        setProgress(0);
      } else {
        setSliderLeft(maxLeft);
        setProgress(100);
      }
    }
  };

  const handleConfirm = () => {
    if (isConfirmed) return;
    
    setIsDragging(false);
    setIsLoading(true);
    setIsConfirmed(true);

    if (sliderRef.current) {
      const maxLeft = sliderRef.current.parentElement!.offsetWidth - sliderRef.current.offsetWidth;
      setSliderLeft(maxLeft);
      setProgress(100);
    }

    setTimeout(() => {
      setIsLoading(false);
      onConfirm();
      
      setTimeout(() => {
        setSliderLeft(0);
        setProgress(0);
        setIsConfirmed(false);
      }, 1000);
    }, 1500);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, isConfirmed]);

  return (
    <div className="relative w-full h-14 bg-gradient-to-r from-green-400 to-[#3983ED] rounded-full overflow-hidden">
      {/* Barra de progreso con transición más suave */}
      <div 
        className="absolute inset-0 bg-white/10 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
      
      {/* Botón deslizante con transición más suave */}
      <div
        ref={sliderRef}
        className={`absolute left-0 top-0 bottom-0 w-14 bg-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-500 ease-out ${
          isDragging ? 'scale-105' : ''
        }`}
        style={{ left: `${sliderLeft}px` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-[#3983ED]" viewBox="0 0 24 24">
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
              fill="none"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <i className="eva eva-arrow-right-outline text-[#3983ED] text-xl" />
        )}
      </div>

      {/* Texto */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className={`text-white font-medium text-sm transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}>
          {isConfirmed ? 'Confirmed!' : text}
        </span>
      </div>
    </div>
  );
};