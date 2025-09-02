import React from 'react';

const InternationalTransfer = () => {
  // Detectar idioma basado en la ruta
  const isSpanish = typeof window !== 'undefined' && window.location.pathname.startsWith('/es');

  const features = [
    {
      icon: '/assets/icons/international/i1.svg',
      title: isSpanish ? 'Transferencias instantáneas' : 'Instant transfers',
      description: isSpanish ? 'El dinero llega en segundos, no en días.' : 'Money arrives in seconds, not days.'
    },
    {
      icon: '/assets/icons/international/i2.svg',
      title: isSpanish ? 'Bajas comisiones' : 'Low fees',
      description: isSpanish ? 'Las comisiones más bajas del mercado.' : 'The lowest possible fees in the market.'
    },
    {
      icon: '/assets/icons/international/i3.svg',
      title: isSpanish ? 'Mejores tipos de cambio' : 'Best exchange rates',
      description: isSpanish ? 'Ahorra con tipos de cambio competitivos.' : 'Save up on competitive exchange rates.'
    },
    {
      icon: '/assets/icons/international/i4.svg',
      title: isSpanish ? 'Seguro y fácil' : 'Secure & easy',
      description: isSpanish ? 'Seguridad bancaria con interfaz fácil de usar.' : 'Bank-level security with an easy-to-use interface.'
    }
  ];

  return (
    <section className="w-full bg-[#00223E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white font-normal">
              {isSpanish ? 'Transferir' : 'Transfer'}
            </span>
            <span className="text-[#AFFF33] ml-2 font-bold">
              {isSpanish ? 'internacionalmente' : 'internationally'}
            </span>
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
            {isSpanish
              ? 'Experimenta transferencias internacionales ultrarrápidas a las mejores tarifas.'
              : 'Experience lightning-fast international transfers at the best rates.'
            }
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              {/* Icon Container */}
              <div className="w-20 h-20 mx-auto mb-6 bg-[#AFFF33] rounded-full flex items-center justify-center group-hover:bg-[#95FF0B] transition-colors duration-300">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-10 h-10 text-white"
                />
              </div>

              {/* Title */}
              <h3 className="text-[#AFFF33] font-bold text-lg mb-3 group-hover:text-[#95FF0B] transition-colors duration-300">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-white text-base leading-relaxed max-w-xs mx-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
};

export default InternationalTransfer; 