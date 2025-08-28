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
    <div className="relative w-full h-16 bg-gradient-to-r from-[#AFFF33] to-[#95FF0B] rounded-full overflow-hidden shadow-lg border-2 border-[#95FF0B]/20">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Progress bar with smooth transition */}
      <div
        className="absolute inset-0 bg-white/20 transition-all duration-700 ease-out backdrop-blur-sm"
        style={{ width: `${progress}%` }}
      />

      {/* Sliding button with enhanced design */}
      <div
        ref={sliderRef}
        className={`absolute left-0 top-0 bottom-0 w-16 bg-[#1A2B40] rounded-full shadow-xl flex items-center justify-center cursor-pointer transition-all duration-700 ease-out border-2 border-white/20 ${isDragging ? 'scale-110 shadow-2xl' : 'hover:scale-105'
          }`}
        style={{ left: `${sliderLeft}px` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-[#AFFF33]" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#AFFF33] transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Text with better styling */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center">
          <span className={`text-[#1A2B40] font-medium text-sm transition-all duration-500 ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
            {isConfirmed ? '¡Confirmado!' : 'Send'}
          </span>
        </div>
      </div>

      {/* Success animation overlay */}
      {isConfirmed && !isLoading && (
        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-700 font-bold text-sm">Transacción exitosa</span>
          </div>
        </div>
      )}
    </div>
  );
};