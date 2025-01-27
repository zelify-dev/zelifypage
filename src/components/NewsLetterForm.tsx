import { FC, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewsLetterForm: FC<any> = ({
	formTitle,
	formInputPlaceholder,
	formLabel,
	formButtonLabel,
	successMessage,
	buttonType = 'primary',
	color = 'text-gray-600',
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [value, setValue] = useState('');
	const [disabled, setDisabled] = useState(true);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const target = e.target as typeof e.target & {
			UserEmail: { value: string };
		};
		
		setIsLoading(true);
		
		setTimeout(() => {
			toast.success(successMessage, {
				position: 'bottom-right',
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				theme: 'dark',
			});
			setIsLoading(false);
			setValue('');
			setDisabled(true);
		}, 1500);
	};

	const validateEmail = (email: string) => {
		const regex = /\S+@\S+\.\S+/;
		return regex.test(email);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setValue(newValue);
		setDisabled(!validateEmail(newValue));
	};

	return (
		<>
			<div className="flex flex-col gap-4 my-2 justify-center max-w-lg mx-auto">
				<div className={`${color} font-mono`}>{formTitle}</div>
				<form onSubmit={onSubmit} noValidate>
					<label
						htmlFor="UserEmail"
						className={`block text-xs font-medium ${color}`}
					>
						{formLabel}
					</label>
					<div
						className={`flex flex-col md:flex-row justify-center md:justify-end items-center md:items-end gap-4 ${
							buttonType !== 'primary' && 'flex-col'
						}`}
					>
						<input
							disabled={isLoading}
							type="email"
							id="UserEmail"
							name="UserEmail"
							placeholder={formInputPlaceholder}
							className="h-11 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm text-gray-950"
							value={value}
							onChange={handleInputChange}
							required
						/>
						<button
							type="submit"
							disabled={disabled || isLoading}
							className={`
								w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-all duration-200
								${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
								${
									buttonType === 'primary'
										? 'bg-blue-600 text-white hover:bg-blue-700'
										: 'bg-gray-900 text-white hover:bg-gray-800'
								}
							`}
						>
							{isLoading ? (
								<div className="flex items-center justify-center gap-2">
									<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									<span>Subscribing...</span>
								</div>
							) : (
								formButtonLabel
							)}
						</button>
					</div>
				</form>
			</div>
			<ToastContainer />
		</>
	);
};

export default NewsLetterForm;
