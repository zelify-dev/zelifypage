import React, { useState, useEffect } from 'react';

const SocialPaymentUI: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slides = [
        {
            id: 1,
            image: '/assets/slider/1_slide.png',
            name: 'Emma Wilson',
            handle: '@emma'
        },
        {
            id: 2,
            image: '/assets/slider/2_slide.png',
            name: 'John Cooper',
            handle: '@coop'
        },
        {
            id: 3,
            image: '/assets/slider/3_slide.png',
            name: 'Sarah Kim',
            handle: '@sarah'
        },
        {
            id: 4,
            image: '/assets/slider/4_slide.png',
            name: 'Maria Garcia',
            handle: '@maria'
        }
    ];

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 4000);

        return () => clearInterval(interval);
    }, [isPaused]);

    const handlePause = () => {
        setIsPaused(!isPaused);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % 3);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + 3) % 3);
    };

    return (
        <div className="w-full min-h-screen bg-[#B0FF51]">
            {/* Grid layout with first image wider but balanced */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 h-screen">
                {/* Image 1 - Wider but not too much */}
                <div className="relative md:col-span-2 lg:col-span-2">
                    <img
                        src="/assets/slider/1_slide.png"
                        alt="Slide 1"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#B0FF51] bg-opacity-20"></div>
                </div>

                {/* Image 2 - With intense green overlay */}
                <div className="relative md:col-span-1 lg:col-span-1">
                    <img
                        src="/assets/slider/2_slide.png"
                        alt="Slide 2"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-[#B0FF51] bg-opacity-95"></div>
                </div>

                {/* Image 3 - With intense green overlay */}
                <div className="relative md:col-span-1 lg:col-span-1">
                    <img
                        src="/assets/slider/3_slide.png"
                        alt="Slide 3"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-[#B0FF51] bg-opacity-95"></div>
                </div>

                {/* Image 4 - With intense green overlay */}
                <div className="relative md:col-span-1 lg:col-span-1">
                    <img
                        src="/assets/slider/4_slide.png"
                        alt="Slide 4"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-[#B0FF51] bg-opacity-95"></div>
                </div>
            </div>
        </div>
    );
};

export default SocialPaymentUI;
