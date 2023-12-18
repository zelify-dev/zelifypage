import { FC, useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import NewsLetterForm from './NewsLetterForm';

const CountDownTimer: FC<any> = ({
	date,
	daysLabel,
	hoursLabel,
	minutesLabel,
	secondsLabel,
	formTitle,
	formInputPlaceholder,
	formLabel,
	formButtonLabel,
	successMessage,
	errorMessage,
}) => {
	const [data, setData] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		isExpired: false,
	});

	useEffect(() => {
		const interval = setInterval(() => {
			const countDownDate = new Date(date).getTime();
			const now = new Date().getTime();
			const distance = countDownDate - now;
			const days = Math.floor(distance / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((distance % (1000 * 60)) / 1000);

			setData({ days, hours, minutes, seconds, isExpired: false });

			if (distance < 0) {
				clearInterval(interval);
				setData({ ...data, isExpired: true });
			}
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col min-w-full gap-4 mt-5">
			<NewsLetterForm
				errorMessage={errorMessage}
				formButtonLabel={formButtonLabel}
				formInputPlaceholder={formInputPlaceholder}
				formLabel={formLabel}
				formTitle={formTitle}
				successMessage={successMessage}
			/>
		</div>
	);
};

export default CountDownTimer;
