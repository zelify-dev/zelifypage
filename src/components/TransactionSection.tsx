import React from 'react';

const TransactionSection = () => {
    // Detectar idioma basado en la ruta
    const isSpanish = typeof window !== 'undefined' && window.location.pathname.startsWith('/es');

    return (
        <section className="w-full bg-[#D8DCE2] h-screen p-0 m-0">
            <div className="w-full h-full">
                <div className="flex flex-col lg:flex-row items-stretch gap-0 h-full">
                    {/* Imagen de la mujer - cubre completamente el lado izquierdo */}
                    <div className="w-full lg:w-1/2 h-full">
                        <img
                            src="/assets/imgs_div/1_women.jpg"
                            alt={isSpanish ? "Mujer usando Zelify" : "Woman using Zelify"}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Mockup del teléfono */}
                    <div className="w-full lg:w-1/2 flex justify-center items-center p-8">
                        <div className="relative">
                            {/* Teléfono mockup usando imagen */}
                            <img
                                src="/assets/imgs_div/2_phone.png"
                                alt={isSpanish ? "Teléfono Zelify" : "Zelify Phone"}
                                className="w-auto h-[520px] object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TransactionSection;
