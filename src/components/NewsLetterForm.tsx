import { FC, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewsLetterForm: FC<any> = ({
	formTitle,
	formInputPlaceholder,
	formLabel,
	formButtonLabel,
	successMessage,
	errorMessage,
	buttonType = 'primary',
	color = 'text-gray-600',
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [value, setValue] = useState('');
	const [disabled, setDisabled] = useState(true);

	const onSubmit = (e: any) => {
		e.preventDefault();
		console.log('value:' + e.target.UserEmail.value);
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
		}, 3000);
	};

	return (
		<>
			<div className="flex flex-col gap-4 my-2 justify-center max-w-lg mx-auto">
				<div className={`${color} font-mono`}>{formTitle}</div>
				<form onSubmit={onSubmit}>
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
							placeholder={formInputPlaceholder}
							className="h-11 mt-1 w-full rounded-md border-gray-200 shadow-sm sm:text-sm text-gray-950"
							value={value}
							onChange={(e) => {
								setValue(e.target.value);
								const regex = /\S+@\S+\.\S+/;
								if (regex.test(e.target.value)) {
									return setDisabled(false);
								}
								setDisabled(true);
							}}
						/>
						<button
							disabled={isLoading || disabled}
							type="submit"
							className={`cursor-pointer w-56 relative h-11 ${
								buttonType === 'primary'
									? 'bg-black'
									: 'border-2 border-green-300 w-full'
							} text-white rounded-md px-4 py-2 flex justify-center items-center ${
								!isLoading &&
								!disabled &&
								'border-2 hover:bg-transparent border-transparent hover:border-white transition-all'
							}`}
						>
							{isLoading && (
								<div
									role="status"
									className="absolute right-0 left-0 flex justify-center"
								>
									<svg
										aria-hidden="true"
										className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-orange-600"
										viewBox="0 0 100 101"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
											fill="currentColor"
										/>
										<path
											d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
											fill="currentFill"
										/>
									</svg>
									<span className="sr-only">Loading...</span>
								</div>
							)}
							<div className={`flex gap-4 ${isLoading && 'opacity-0'}`}>
								<span>{formButtonLabel}</span>
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g clipPath="url(#clip0_2_456)">
										<path
											d="M3 13H9V11H3V1.846C3.00001 1.75911 3.02267 1.67373 3.06573 1.59827C3.1088 1.52281 3.17078 1.45987 3.24558 1.41566C3.32037 1.37144 3.4054 1.34749 3.49227 1.34614C3.57915 1.3448 3.66487 1.36612 3.741 1.408L22.203 11.562C22.2814 11.6052 22.3468 11.6686 22.3923 11.7456C22.4378 11.8227 22.4618 11.9105 22.4618 12C22.4618 12.0895 22.4378 12.1773 22.3923 12.2544C22.3468 12.3314 22.2814 12.3948 22.203 12.438L3.741 22.592C3.66487 22.6339 3.57915 22.6552 3.49227 22.6539C3.4054 22.6525 3.32037 22.6286 3.24558 22.5843C3.17078 22.5401 3.1088 22.4772 3.06573 22.4017C3.02267 22.3263 3.00001 22.2409 3 22.154V13Z"
											fill="white"
										/>
									</g>
									<defs>
										<clipPath id="clip0_2_456">
											<rect width="24" height="24" fill="white" />
										</clipPath>
									</defs>
								</svg>
							</div>
						</button>
					</div>
				</form>
			</div>
			<ToastContainer />
		</>
	);
};

export default NewsLetterForm;
