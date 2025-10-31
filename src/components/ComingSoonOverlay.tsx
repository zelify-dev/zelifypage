import { FC, useEffect, useState } from 'react';

const ComingSoonOverlay: FC = () => {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		// Prevent body scroll
		document.body.style.overflow = 'hidden';

		// Create target date: October 31, 3 PM Ecuador time (UTC-5)
		// Ecuador is UTC-5, so 3 PM local time = 8 PM UTC (20:00)
		const currentYear = new Date().getFullYear();
		const targetDate = new Date(`${currentYear}-10-31T20:00:00Z`); // 3 PM Ecuador = 8 PM UTC
		const targetTime = targetDate.getTime();

		const interval = setInterval(() => {
			const now = new Date().getTime();
			const distance = targetTime - now;

			if (distance > 0) {
				const days = Math.floor(distance / (1000 * 60 * 60 * 24));
				const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((distance % (1000 * 60)) / 1000);

				setTimeLeft({ 
					days: days,
					hours, 
					minutes, 
					seconds 
				});
			} else {
				setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
				clearInterval(interval);
			}
		}, 1000);

		return () => {
			clearInterval(interval);
			document.body.style.overflow = '';
		};
	}, []);

	return (
		<div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#B0FF51] overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute top-0 left-0 w-96 h-96 bg-[#95FF0B] rounded-full opacity-20 blur-3xl animate-pulse floating-orb-1"></div>
				<div className="absolute bottom-0 right-0 w-96 h-96 bg-[#144092] rounded-full opacity-20 blur-3xl animate-pulse floating-orb-2"></div>
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00223E] rounded-full opacity-10 blur-3xl animate-pulse floating-orb-3"></div>
			</div>

			{/* Main content */}
			<div className="relative z-10 text-center px-6 sm:px-8 md:px-12 max-w-4xl mx-auto">
				{/* Logo and Title */}
				<div className="mb-8 sm:mb-12 flex flex-col items-center">
					<img 
						src="/assets/logos/new_zelify_logo.svg" 
						alt="Zelify Logo" 
						className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto mb-4 sm:mb-6"
						style={{ background: 'transparent' }}
					/>
					<span className="block text-[#144092] font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl" style={{ fontFamily: "'Nata Sans', sans-serif" }}>
						Business
					</span>
				</div>

				{/* Coming Soon text */}
				<div className="mb-12 sm:mb-16">
					<p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00223E] tracking-wide" style={{ fontFamily: "'Nata Sans', sans-serif" }}>
						Coming Soon
					</p>
				</div>

				{/* Countdown */}
				<div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 mb-8 flex-wrap">
					{/* Days */}
					{timeLeft.days > 0 && (
						<>
							<div className="flex flex-col items-center">
								<div className="relative bg-[#00223E] rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl transform transition-all duration-300 hover:scale-105 countdown-box">
									<div className="absolute inset-0 bg-gradient-to-br from-[#144092] to-[#00223E] rounded-2xl opacity-50 animate-pulse"></div>
									<div className="relative z-10">
										<div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#B0FF51]" style={{ fontFamily: "'Nata Sans', sans-serif" }}>
											{String(timeLeft.days).padStart(2, '0')}
										</div>
									</div>
								</div>
								<div className="mt-4 text-sm sm:text-base md:text-lg font-medium text-[#00223E] uppercase tracking-wider" style={{ fontFamily: "'Nata Sans', sans-serif" }}>
									Days
								</div>
							</div>
							{/* Separator */}
							<div className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#144092] mb-8 animate-pulse" style={{ fontFamily: "'Nata Sans', sans-serif" }}>
								:
							</div>
						</>
					)}
					{/* Hours */}
					<div className="flex flex-col items-center">
						<div className="relative bg-[#00223E] rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl transform transition-all duration-300 hover:scale-105 countdown-box">
							<div className="absolute inset-0 bg-gradient-to-br from-[#144092] to-[#00223E] rounded-2xl opacity-50 animate-pulse"></div>
							<div className="relative z-10">
								<div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#B0FF51]" style={{ fontFamily: "'Nata Sans', sans-serif" }}>
									{String(timeLeft.hours).padStart(2, '0')}
								</div>
							</div>
						</div>
						<div className="mt-4 text-sm sm:text-base md:text-lg font-medium text-[#00223E] uppercase tracking-wider" style={{ fontFamily: "'Nata Sans', sans-serif" }}>
							Hours
						</div>
					</div>

					{/* Separator */}
					<div className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#144092] mb-8 animate-pulse" style={{ fontFamily: "'Nata Sans', sans-serif" }}>
						:
					</div>

					{/* Minutes */}
					<div className="flex flex-col items-center">
						<div className="relative bg-[#00223E] rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl transform transition-all duration-300 hover:scale-105 countdown-box" style={{ animationDelay: '0.3s' }}>
							<div className="absolute inset-0 bg-gradient-to-br from-[#144092] to-[#00223E] rounded-2xl opacity-50 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
							<div className="relative z-10">
								<div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#B0FF51]" style={{ fontFamily: "'Nata Sans', sans-serif" }}>
									{String(timeLeft.minutes).padStart(2, '0')}
								</div>
							</div>
						</div>
						<div className="mt-4 text-sm sm:text-base md:text-lg font-medium text-[#00223E] uppercase tracking-wider" style={{ fontFamily: "'Nata Sans', sans-serif" }}>
							Minutes
						</div>
					</div>

					{/* Separator */}
					<div className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#144092] mb-8 animate-pulse" style={{ animationDelay: '0.5s', fontFamily: "'Nata Sans', sans-serif" }}>
						:
					</div>

					{/* Seconds */}
					<div className="flex flex-col items-center">
						<div className="relative bg-[#00223E] rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl transform transition-all duration-300 hover:scale-105 countdown-box" style={{ animationDelay: '0.6s' }}>
							<div className="absolute inset-0 bg-gradient-to-br from-[#144092] to-[#00223E] rounded-2xl opacity-50 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
							<div className="relative z-10">
								<div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#B0FF51]" style={{ fontFamily: "'Nata Sans', sans-serif" }}>
									{String(timeLeft.seconds).padStart(2, '0')}
								</div>
							</div>
						</div>
						<div className="mt-4 text-sm sm:text-base md:text-lg font-medium text-[#00223E] uppercase tracking-wider" style={{ fontFamily: "'Nata Sans', sans-serif" }}>
							Seconds
						</div>
					</div>
				</div>

				{/* Animated accent line */}
				<div className="flex justify-center mt-8 sm:mt-12">
					<div className="h-1 w-32 sm:w-40 bg-gradient-to-r from-transparent via-[#144092] to-transparent animate-pulse"></div>
				</div>
			</div>

			{/* Floating particles effect */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="absolute w-2 h-2 bg-[#144092] rounded-full opacity-30 floating-particle"
						style={{
							left: `${20 + i * 15}%`,
							top: `${10 + (i % 3) * 30}%`,
							animationDuration: `${3 + i * 0.5}s`,
							animationDelay: `${i * 0.3}s`,
						}}
					></div>
				))}
			</div>

			{/* CSS Animations */}
			<style dangerouslySetInnerHTML={{
				__html: `
					@keyframes float {
						0%, 100% {
							transform: translate(0, 0) scale(1);
						}
						33% {
							transform: translate(30px, -30px) scale(1.1);
						}
						66% {
							transform: translate(-20px, 20px) scale(0.9);
						}
					}

					@keyframes floatReverse {
						0%, 100% {
							transform: translate(0, 0) scale(1);
						}
						33% {
							transform: translate(-30px, 30px) scale(0.9);
						}
						66% {
							transform: translate(20px, -20px) scale(1.1);
						}
					}

					@keyframes floatSlow {
						0%, 100% {
							transform: translate(0, 0) scale(1);
						}
						50% {
							transform: translate(15px, -15px) scale(1.05);
						}
					}

					@keyframes particleFloat {
						0%, 100% {
							transform: translateY(0) translateX(0);
							opacity: 0.3;
						}
						25% {
							transform: translateY(-30px) translateX(15px);
							opacity: 0.5;
						}
						50% {
							transform: translateY(-50px) translateX(-10px);
							opacity: 0.2;
						}
						75% {
							transform: translateY(-20px) translateX(20px);
							opacity: 0.4;
						}
					}

					@keyframes countdownPulse {
						0%, 100% {
							transform: scale(1);
							box-shadow: 0 0 0 0 rgba(176, 255, 81, 0.7);
						}
						50% {
							transform: scale(1.02);
							box-shadow: 0 0 0 10px rgba(176, 255, 81, 0);
						}
					}

					.floating-orb-1 {
						animation: float 8s ease-in-out infinite !important;
					}

					.floating-orb-2 {
						animation: floatReverse 10s ease-in-out infinite !important;
					}

					.floating-orb-3 {
						animation: floatSlow 12s ease-in-out infinite !important;
					}

					.floating-particle {
						animation: particleFloat 4s ease-in-out infinite !important;
					}

					.countdown-box {
						animation: countdownPulse 2s ease-in-out infinite !important;
					}
				`
			}} />
		</div>
	);
};

export default ComingSoonOverlay;

