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
      cardImage: '/assets/img/cards/2.png',
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
      cardImage: '/assets/img/cards/3.png',
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
      cardImage: '/assets/img/cards/4.png',
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
    <>
      <section className="py-24 relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-blue-900">
              {isSpanish ? 'Compara nuestros planes' : 'Compare our Plans'}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isSpanish ? 'Experimenta transferencias internacionales ultrarrápidas a las mejores tarifas.' : 'Experience lightning-fast international transfers at the best rates.'}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 relative">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className="relative group"
              >
                {/* Tarjeta de crédito superpuesta */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-52 transition-all duration-300 group-hover:-translate-y-1 z-10">
                  <div className="relative">
                    <img
                      src={plan.cardImage}
                      alt={`${plan.name} card`}
                      className="w-full h-auto rounded-lg shadow-lg transition-all duration-300"
                    />
                    {/* Borde blanco alrededor de la tarjeta */}
                    <div className="absolute inset-0 rounded-lg border-2 border-white pointer-events-none"></div>
                  </div>
                </div>

                {/* Contenedor del plan */}
                <div className={`relative mt-16 rounded-2xl p-8 pt-24 transition-all duration-300
                ${index === 0 ? 'text-white' : ''}
                ${index === 1 ? 'text-blue-900' : ''}
                ${index === 2 ? 'text-white' : ''}
                shadow-lg hover:shadow-xl hover:-translate-y-1
                overflow-hidden`}
                  style={{
                    backgroundColor: index === 0 ? '#004196' :
                      index === 1 ? '#95FF0B' :
                        '#00223E'
                  }}
                >
                  {/* Contenido */}
                  <div className="relative z-10">
                    <div className="text-center mb-8">
                      {plan.popular && (
                        <div className="mb-4">
                          <div className="inline-block px-3 py-1 bg-lime-400 text-blue-900 text-xs font-medium rounded-lg shadow-md">
                            most popular
                          </div>
                        </div>
                      )}

                      <div className="mb-6">
                        <h3 className="text-3xl font-bold mb-3">
                          {plan.name}
                        </h3>
                      </div>
                      <div className="flex items-baseline gap-1 justify-center">
                        <span className={`text-4xl font-bold ${index === 0 ? 'text-lime-400' :
                          index === 1 ? 'text-blue-900' :
                            'text-lime-400'
                          }`}>${plan.price}</span>
                        <span className={`${index === 0 ? 'text-gray-200' :
                          index === 1 ? 'text-blue-700' :
                            'text-gray-200'
                          }`}>/mo</span>
                      </div>
                    </div>

                    {/* Lista de features */}
                    {plan.features && plan.features.length > 0 && (
                      <ul className="text-left space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm">
                            <span className={`mt-1 flex-shrink-0 ${index === 0 ? 'text-lime-400' :
                              index === 1 ? 'text-blue-900' :
                                'text-lime-400'
                              }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón para abrir la tabla comparativa */}
          <div className="flex justify-center mt-16">
            <button
              className="px-8 py-3 bg-gray-200 text-blue-900 font-semibold rounded-lg shadow-sm hover:bg-gray-300 transition-all text-lg"
              onClick={() => setShowCompareModal(true)}
            >
              {isSpanish ? 'Comparar planes en detalle' : 'Compare plans in detail'}
            </button>
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
      </section>

      {/* Sección de Beneficios */}
      <section className="w-full py-24" style={{ backgroundColor: '#00213C' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span style={{ color: '#95FF0B' }}>{isSpanish ? 'Beneficios' : 'Exclusive'}</span>
              <span style={{ color: '#D8DCE2' }}> {isSpanish ? 'exclusivos y descuentos' : 'benefits & discounts'}</span>
            </h2>
            <p className="text-lg" style={{ color: '#D8DCE2' }}>
              {isSpanish
                ? 'Convierte tus gastos diarios en recompensas exclusivas con nuestra red de socios'
                : 'Turn your daily expenses into exclusive rewards with our partner network'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 w-full">
            {benefits.map((category) => (
              <div key={category.category} className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: '#144092' }}>
                <h3 className="text-2xl font-semibold mb-6 text-center" style={{ color: '#95FF0B' }}>
                  {category.category}
                </h3>
                <div className="flex flex-col gap-4">
                  {category.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 group hover:bg-opacity-80 p-3 rounded-xl transition-all duration-300 hover:translate-x-2 justify-center w-full"
                      style={{ backgroundColor: 'rgba(216, 220, 226, 0.1)' }}
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden transition-all duration-500 group-hover:w-16 group-hover:h-16 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-150 transition-all duration-500"
                        />
                      </div>
                      <span className="text-base font-medium text-center flex-1 min-w-0" style={{ color: '#D8DCE2' }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;

