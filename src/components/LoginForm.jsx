import {
	Form,
	useActionData,
	useNavigation,
	useSearchParams,
} from 'react-router-dom';
import classes from './Form.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
	CONFIRM_PASSWORD_FIELD_ERROR,
	EMAIL_FIELD_ERROR,
	NAME_FIELD_ERROR,
	PASSWORD_FIELD_ERROR,
} from '../Utils/util';

function LoginForm() {
	const [searchParams, setSearchParams] = useSearchParams();

	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const nameInputRef = useRef();
	const emailInputRef = useRef();
	const passwordInputRef = useRef();
	const confirmPasswordInputRef = useRef();
	const dateInputRef = useRef();
	const [formHasError, setFormHasError] = useState([]);

	const navigate = useNavigation();
	const error = useActionData();

	const isLogin = searchParams.get('mode') === 'login';

	const handleClick = () => {
		if (navigate.state === 'submitting') {
			return isLogin ? 'Logging In...' : 'Signing Up...';
		} else {
			return isLogin ? 'Login' : 'Sign Up';
		}
	};

	const formValidationHandler = () => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		let formIsValid = true;

		if (!isLogin && nameInputRef.current.value.length < 1) {
			setFormHasError((p) => [...p, NAME_FIELD_ERROR]);
			formIsValid = false;
		}
		if (!emailRegex.test(emailInputRef.current.value)) {
			setFormHasError((p) => [...p, EMAIL_FIELD_ERROR]);
			formIsValid = false;
		}
		if (passwordInputRef.current.value.length < 6) {
			setFormHasError((p) => [...p, PASSWORD_FIELD_ERROR]);
			formIsValid = false;
		}
		if (
			!isLogin &&
			passwordInputRef.current.value !== confirmPasswordInputRef.current.value
		) {
			setFormHasError((p) => [...p, CONFIRM_PASSWORD_FIELD_ERROR]);
			formIsValid = false;
		}

		return formIsValid;
	};

	const toggleShowConfirmPassword = () => {
		setShowConfirmPassword((prevState) => !prevState);
	};

	// getting mode

	const toggleShowPassword = () => {
		setShowPassword((prevState) => !prevState);
	};

	const handleSubmit = (e) => {
		if (isLogin) {
			return;
		} else {
			formValidationHandler();
			console.log(formValidationHandler());

			!formValidationHandler() && e.preventDefault();
		}
	};

	const fieldError = {};
	formHasError.forEach((error) => (fieldError[error.field] = error.message));

	return (
		<Form className={classes.form} method='post' onSubmit={handleSubmit}>
			<div className={classes.formName}>
				<h1>{isLogin ? 'Login' : 'Create your account'}</h1>
			</div>

			{!isLogin && (
				<div
					className={`${classes.formBlock} ${
						fieldError[NAME_FIELD_ERROR.field] && classes.formFieldError
					}`}
				>
					<label htmlFor='username'>Name</label>
					<input
						id='username'
						type='text'
						name='username'
						required
						ref={nameInputRef}
					/>
				</div>
			)}
			<div
				className={`${classes.formBlock} ${
					fieldError[EMAIL_FIELD_ERROR.field] && classes.formFieldError
				}`}
			>
				<label htmlFor='email'>Email</label>
				<input
					id='email'
					type='email'
					name='email'
					pas
					required
					ref={emailInputRef}
				/>
			</div>
			<div
				className={`${classes.formBlock} ${
					fieldError[PASSWORD_FIELD_ERROR.field] && classes.formFieldError
				}`}
			>
				<label htmlFor='password'>Password</label>
				<div className={classes.inputField}>
					<input
						id='password'
						type={showPassword ? 'text' : 'password'}
						name='password'
						ref={passwordInputRef}
						minLength={6}
						required
					/>
					<ion-button type='button' onClick={toggleShowPassword}>
						{!showPassword ? (
							<ion-icon name='eye-off-outline'></ion-icon>
						) : (
							<ion-icon name='eye-outline'></ion-icon>
						)}
					</ion-button>
				</div>
			</div>
			{!isLogin && (
				<div
					className={`${classes.formBlock} ${
						fieldError[CONFIRM_PASSWORD_FIELD_ERROR.field] &&
						classes.formFieldError
					}`}
				>
					<label htmlFor='confirmPassword'>Confirm Password</label>
					<div className={classes.inputField}>
						<input
							id='confirmPassword'
							type={showConfirmPassword ? 'text' : 'password'}
							name='confirmPassword'
							ref={confirmPasswordInputRef}
							minLength={6}
							required
						/>

						<ion-button type='button' onClick={toggleShowConfirmPassword}>
							{!showConfirmPassword ? (
								<ion-icon name='eye-off-outline'></ion-icon>
							) : (
								<ion-icon name='eye-outline'></ion-icon>
							)}
						</ion-button>
					</div>
				</div>
			)}
			{!isLogin && (
				<div className={classes.formBlock}>
					<label htmlFor='calendar'>Date of birth</label>
					<input
						id='calendar'
						type='date'
						name='dob'
						required
						ref={dateInputRef}
					/>{' '}
				</div>
			)}
			<div className={`${classes.postButton} `}>
				<button name='intent' value={isLogin ? 'login' : 'signup'} to=''>
					{handleClick()}
				</button>
			</div>
			<span style={{ color: 'red' }}>{error?.message}</span>

			<ul>
				{formHasError.map((error) => {
					<li key={error.field}>{error.message}</li>;
				})}
			</ul>
			<div className={classes.footerText}>
				<span>
					{`${!isLogin ? 'Already have an account?' : 'Dont have an account?'}`}

					<Link to={`?mode=${isLogin ? 'signup' : 'login'}`}>Click here</Link>
					{/* setting mode to Signup or Login */}
				</span>
			</div>
		</Form>
	);
}
export default LoginForm;
