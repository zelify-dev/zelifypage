import React, { useState, useEffect } from 'react';
import ComparePlans from './ComparePlans';

const Pricing = () => {
  const [isSpanish, setIsSpanish] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    setIsSpanish(window.location.pathname.startsWith('/es'));
  }, []);

  const plans = [
    {
      name: 'Standard',
      price: '0.00',
      features: isSpanish ? [
        'Servicios bancarios básicos con Mastercard virtual o física',
        'Capacidades de transacción limitadas (límite de $200)',
        'Sin beneficios adicionales (cashback, conversión FX, seguro de viaje, etc.)',
        'Soporte al cliente estándar'
      ] : [
        'Basic banking services with virtual or physical Mastercard',
        'Limited transaction capabilities ($200 limit)',
        'No additional benefits (cashback, FX conversion, travel insurance, etc.)',
        'Standard customer support'
      ],
      cardImage: '/assets/img/cards/4.png',
      gradient: 'from-blue-500/20 via-purple-500/20 to-pink-500/20'
    },
    {
      name: 'Plus',
      price: '4.99',
      features: isSpanish ? [
        'Límite de transacción de $500',
        'Comisiones reducidas en transferencias internacionales (3.8%)',
        'Cashback en compras (0.40%)',
        'Acceso a suscripciones de socios',
        'Soporte al cliente personalizado en la app'
      ] : [
        '$500 transaction limit',
        'Reduced fees on international transfers (3.8%)',
        'Cashback on purchases (0.40%)',
        'Access to partner subscriptions',
        'Personalized in-app customer support'
      ],
      cardImage: '/assets/img/cards/2.png',
      gradient: 'from-blue-600/20 via-cyan-500/20 to-emerald-500/20'
    },
    {
      name: 'Premium',
      price: '7.99',
      popular: true,
      features: isSpanish ? [
        'Límite de transacción de $1,000',
        'Comisiones más bajas en FX y transferencias internacionales (3%)',
        'Mayor cashback (0.60%)',
        'Opciones de tarjeta personalizadas',
        'Beneficios de viaje (seguro, acceso a salas VIP)',
        'Cuentas de ahorro y co-parentalidad',
        'Soporte al cliente personalizado en la app'
      ] : [
        '$1,000 transaction limit',
        'Lower FX and international transfer fees (3%)',
        'Higher cashback (0.60%)',
        'Custom card options',
        'Travel benefits (insurance, VIP lounge access)',
        'Savings accounts and co-parenting',
        'Personalized in-app customer support'
      ],
      cardImage: '/assets/img/cards/5.png',
      gradient: 'from-orange-500/20 via-amber-500/20 to-yellow-500/20'
    }
  ];

  const benefits = [
    {
      category: isSpanish ? "Estilo de Vida y Entretenimiento" : "Lifestyle & Entertainment",
      items: [
        {
          image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop&q=80",
          name: isSpanish ? "Restaurantes" : "Restaurants"
        },
        {
          image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=200&h=200&fit=crop&q=80",
          name: isSpanish ? "Conciertos" : "Concerts"
        },
        {
          image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=200&h=200&fit=crop&q=80",
          name: isSpanish ? "Suscripciones de Noticias" : "News Subscriptions"
        }
      ]
    },
    {
      category: isSpanish ? "Viajes y Movilidad" : "Travel & Mobility",
      items: [
        {
          image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&h=200&fit=crop&q=80",
          name: isSpanish ? "Millas Aéreas" : "Airline Miles"
        },
        {
          image: "https://media.gq.com.mx/photos/6060c63cc94329bc868c3f41/master/w_1600%2Cc_limit/gasolina.jpg",
          name: isSpanish ? "Descuentos en Gasolina" : "Gasoline Discounts"
        }
      ]
    },
    {
      category: isSpanish ? "Salud y Bienestar" : "Health & Wellness",
      items: [
        {
          image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop&q=80",
          name: isSpanish ? "Farmacias" : "Pharmacies"
        },
        {
          image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop&q=80",
          name: isSpanish ? "Gimnasios" : "Fitness & Gyms"
        },
        {
          image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=200&h=200&fit=crop&q=80",
          name: isSpanish ? "Servicios de Bienestar" : "Wellness Services"
        }
      ]
    },
    {
      category: isSpanish ? "Compras y Educación" : "Shopping & Education",
      items: [
        {
          image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&q=80",
          name: isSpanish ? "Descuentos en Tiendas" : "Retail Store Discounts"
        },
        {
          image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=200&h=200&fit=crop&q=80",
          name: isSpanish ? "Tiendas de Mascotas" : "Pet Stores"
        },
        {
          image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&h=200&fit=crop&q=80",
          name: isSpanish ? "Beneficios Educativos" : "Education Benefits"
        }
      ]
    }
  ];

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="text-center mb-28">
          <h2 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            {isSpanish ? 'Compara nuestros planes' : 'Compare Our Plans'}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {isSpanish ? 'Elige el plan perfecto para tu viaje financiero.' : 'Choose the perfect plan to fit your financial journey.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 relative">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative group ${index === 1 ? 'lg:-mt-0' : ''
                }`}
            >
              {/* Tarjeta de crédito flotante */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 perspective-1000 transition-all duration-500 group-hover:-translate-y-2">
                <div className="relative transition-transform duration-700 transform-style-3d group-hover:[transform:rotateX(10deg)_rotateY(-10deg)]">
                  <img
                    src={plan.cardImage}
                    alt={`${plan.name} card`}
                    className="w-full h-auto rounded-2xl shadow-2xl transition-all duration-500 group-hover:shadow-[0_0_2rem_0_rgba(59,130,246,0.3)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl 
                    group-hover:animate-shine"></div>
                </div>
              </div>

              {/* Contenedor del plan */}
              <div className={`relative mt-16 rounded-3xl bg-gradient-to-b from-gray-800 to-gray-900 p-8 pt-24
                border border-gray-800 backdrop-blur-xl transition-all duration-500
                group-hover:border-gray-700 group-hover:shadow-[0_0_3rem_0_rgba(var(--tw-gradient-stops),0.4)]
                group-hover:-translate-y-2
                overflow-hidden`}
              >
                {/* Gradiente de fondo */}
                <div className={`absolute inset-0 bg-gradient-to-b ${plan.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                {/* Contenido */}
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {plan.name}
                      </h3>
                    </div>
                    <div className="flex items-baseline gap-1 justify-center">
                      <span className="text-5xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-500">/mo</span>
                    </div>
                  </div>
                  {/* Lista de features */}
                  {plan.features && plan.features.length > 0 && (
                    <ul className="text-left space-y-3 mb-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-200 text-sm">
                          <span className="mt-1 text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {plan.popular && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón para abrir la tabla comparativa */}
        <div className="flex justify-center mt-10">
          <button
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all text-lg"
            onClick={() => setShowCompareModal(true)}
          >
            {isSpanish ? 'Comparar planes en detalle' : 'Compare plans in detail'}
          </button>
        </div>

        {/* Sección de Beneficios */}
        <div className="pt-24 border-t border-gray-800">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              {isSpanish ? 'Beneficios y Descuentos Exclusivos' : 'Exclusive Benefits & Discounts'}
            </h2>
            <p className="text-gray-400">
              {isSpanish
                ? 'Convierte tus gastos diarios en recompensas exclusivas con nuestra red de socios'
                : 'Turn your daily expenses into exclusive rewards with our partner network'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 w-full">
            {benefits.map((category) => (
              <div key={category.category} className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-xl border border-gray-700/50">
                <h3 className="text-2xl font-semibold mb-6 text-white text-center">
                  {category.category}
                </h3>
                <div className="flex flex-col gap-4">
                  {category.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 text-gray-300 group hover:bg-gray-800/50 p-3 rounded-xl transition-all duration-300 hover:translate-x-2 justify-center w-full"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden transition-all duration-500 group-hover:w-16 group-hover:h-16 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-150 transition-all duration-500"
                        />
                      </div>
                      <span className="text-base font-medium text-center flex-1 min-w-0">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal de Comparación */}
        {showCompareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-2xl font-bold">
                  {isSpanish ? 'Comparación de Planes' : 'Plan Comparison'}
                </h3>
                <button
                  onClick={() => setShowCompareModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <i className="eva eva-close-outline text-2xl" />
                </button>
              </div>
              <div className="p-6">
                <ComparePlans isSpanish={isSpanish} />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shine {
          animation: shine 2s infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(0.95); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default Pricing;

