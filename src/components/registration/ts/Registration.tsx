import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage } from '../../stage/ts/stage';
import { InputField, InputFieldItem } from '../../inputField/ts/InputField';
import { SVG } from '../../svgSet/ts/SVG';
import { ICON_KEYS } from '../../svgSet/ts/SVGHelpers';
import { useEffect, useState } from 'react';
import { translate } from '../../../resources/ts/i18n/translate';
import { Button } from '../../button/ts/Button';
import registrationResortsData from '../registrationData';
import { AgencySelection } from '../../agencySelection/ts/AgencySelection';
import {
	inputValuesFit,
	strengthIndicator
} from '../../passwordField/ts/validateInputValue';
import { CheckboxItem, Checkbox } from '../../checkbox/ts/Checkbox';
import {
	buttonItemSubmit,
	getOptionOfSelectedValue,
	getValidationClassNames,
	isStringValidEmail,
	MIN_USERNAME_LENGTH,
	overlayItemRegistrationSuccess
} from './registrationHelper';
import { postRegistration } from '../../apiWrapper/ts/ajaxCallRegistration';
import { config } from '../../../resources/ts/config';
import { setTokenInCookie } from '../../sessionCookie/ts/accessSessionCookie';
import { SelectDropdown } from '../../select/ts/SelectDropdown';
import { RadioButton } from '../../radioButton/ts/RadioButton';
import { TagSelect } from '../../tagSelect/ts/TagSelect';
import {
	AgencyDataProps,
	DEFAULT_POSTCODE,
	redirectToHelpmail,
	redirectToRegistrationWithoutAid
} from './prefillPostcode';
import { getUrlParameter } from '../../../resources/ts/helpers/getUrlParameter';
import {
	AGENCY_FALLBACK_LINK,
	getConsultingTypeFromRegistration,
	isKreuzbundRegistration,
	isRehabilitationRegistration,
	isU25Registration
} from '../../../resources/ts/helpers/resorts';
import { getAgencyById } from '../../apiWrapper/ts';
import { FETCH_ERRORS } from '../../apiWrapper/ts/fetchData';
import { ajaxCallAgencySelection } from '../../apiWrapper/ts/ajaxCallPostcode';
import {
	OverlayWrapper,
	Overlay,
	OVERLAY_FUNCTIONS
} from '../../overlay/ts/Overlay';
import { redirectToApp } from './autoLogin';
import { removeInputErrorClass, removeWarningLabelById } from './warningLabels';
import { isNumber } from '../../../resources/ts/helpers/isNumber';

export const initRegistration = () => {
	ReactDOM.render(
		<Registration />,
		document.getElementById('registrationRoot')
	);
};

const Registration = () => {
	const [username, setUsername] = useState(null);
	const [isUsernameValid, setIsUsernameValid] = useState(false);
	const [usernameSuccessMessage, setUsernameSuccessMessage] = useState(null);
	const [usernameErrorMessage, setUsernameErrorMessage] = useState(null);
	const [postcode, setPostcode] = useState(null);
	const [agencyId, setAgencyId] = useState(null);
	const [prefilledAgencyData, setPrefilledAgencyData] = useState(null);
	const [password, setPassword] = useState(null);
	const [passwordSuccessMessage, setPasswordSuccessMessage] = useState(null);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState(null);
	const [isPasswordValid, setIsPasswordValid] = useState(false);
	const [passwordConfirmation, setPasswordConfirmation] = useState(null);
	const [
		passwordConfirmationSuccessMessage,
		setPasswordConfirmationSuccessMessage
	] = useState(null);
	const [
		passwordConfirmationErrorMessage,
		setPasswordConfirmationErrorMessage
	] = useState(null);
	const [email, setEmail] = useState(null);
	const [isEmailValid, setIsEmailValid] = useState(true);
	const [emailSuccessMessage, setEmailSuccessMessage] = useState(null);
	const [emailErrorMessage, setEmailErrorMessage] = useState(null);
	const [valuesOfGeneratedInputs, setValuesOfGeneratedInputs] = useState(
		null
	);
	const [isDataProtectionSelected, setIsDataProtectionSelected] = useState(
		false
	);
	const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);
	const [consultingType] = useState(getConsultingTypeFromRegistration());
	const [overlayActive, setOverlayActive] = useState(false);

	const resortDataArray = Object.entries(registrationResortsData).filter(
		(resort) => resort[1].consultingType == consultingType.toString()
	);

	let resortData;
	if (resortDataArray.length > 1) {
		const resortName = document.getElementById('registrationRoot').dataset
			.resortname;
		resortData = resortDataArray.filter(
			(resort) => resort[0] === resortName
		)[0][1];
	} else {
		resortData = resortDataArray[0][1];
	}

	// SET FORMAL/INFORMAL COOKIE
	setTokenInCookie('useInformal', resortData.useInformal ? '1' : '');

	const prefillPostcode = () => {
		const agencyId = isNumber(getUrlParameter('aid'))
			? getUrlParameter('aid')
			: null;

		if (agencyId) {
			getAgencyData(agencyId);
		} else if (isU25Registration()) {
			redirectToHelpmail();
		}

		if (isRehabilitationRegistration() || isKreuzbundRegistration()) {
			ajaxCallAgencySelection({
				postcode: DEFAULT_POSTCODE,
				consultingType: consultingType
			})
				.then((response) => {
					const fallbackAid = response[0].id;
					if (!agencyId || parseInt(agencyId) != fallbackAid) {
						window.location.href =
							AGENCY_FALLBACK_LINK[consultingType] + fallbackAid;
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const getAgencyData = (agencyId) => {
		getAgencyById(agencyId)
			.then((response) => {
				const agencyData = response[0];
				agencyData.consultingType === consultingType
					? handlePrefilledAgencyData(agencyData, agencyId)
					: redirectToRegistrationWithoutAid();
			})
			.catch((error) => {
				if (error.message === FETCH_ERRORS.NO_MATCH) {
					redirectToRegistrationWithoutAid();
				}
			});
	};

	const handlePrefilledAgencyData = (
		agencyData: AgencyDataProps,
		agencyId: string
	) => {
		setPostcode(
			agencyData.postcode ? agencyData.postcode : DEFAULT_POSTCODE
		);
		setAgencyId(agencyId);
		setPrefilledAgencyData(agencyData);
	};

	const isRegistrationValid = () => {
		const validation = [];
		const generalValidation =
			isUsernameValid &&
			password &&
			isPasswordValid &&
			password === passwordConfirmation &&
			isDataProtectionSelected;

		validation.push(generalValidation ? true : false);
		resortData.showPostCode
			? validation.push(postcode && agencyId ? true : false)
			: null;
		resortData.showEmail
			? validation.push(isEmailValid ? true : false)
			: null;

		// U25 and gemeinsamstatteinsam
		consultingType === 1
			? validation.push(
					valuesOfGeneratedInputs &&
						valuesOfGeneratedInputs['age'] &&
						valuesOfGeneratedInputs['state']
						? true
						: false
			  )
			: null;

		return validation.indexOf(false) === -1;
	};

	useEffect(() => {
		prefillPostcode();
	}, []);

	useEffect(() => {
		const warningLabels = document.querySelectorAll('.warning');
		if (warningLabels.length > 0) {
			removeWarningLabelById('username');
			removeInputErrorClass('username');
		}
	}, [username]);

	useEffect(() => {
		const warningLabels = document.querySelectorAll('.warning');
		if (warningLabels.length > 0 && resortData.showEmail) {
			removeWarningLabelById('email');
			removeInputErrorClass('email');
		}
	}, [email]);

	useEffect(() => {
		if (isRegistrationValid()) {
			setIsSubmitButtonDisabled(false);
		} else {
			setIsSubmitButtonDisabled(true);
		}
	}, [
		username,
		postcode,
		password,
		passwordConfirmation,
		email,
		valuesOfGeneratedInputs,
		isDataProtectionSelected
	]);

	const inputItemUsername: InputFieldItem = {
		content: username,
		class: getValidationClassNames(
			!!usernameErrorMessage,
			!!usernameSuccessMessage
		),
		icon: <SVG name={ICON_KEYS.PERSON} />,
		id: 'username',
		label:
			usernameErrorMessage || usernameSuccessMessage
				? `${usernameErrorMessage} ${usernameSuccessMessage}`
				: translate('registration.user.label'),
		infoText: translate('registration.user.infoText'),
		maxLength: 30,
		name: 'username',
		type: 'text'
	};

	const inputItemPassword: InputFieldItem = {
		content: password,
		class: getValidationClassNames(
			!!passwordErrorMessage,
			!!passwordSuccessMessage
		),
		icon: <SVG name={ICON_KEYS.LOCK} />,
		id: 'passwordInput',
		label:
			passwordErrorMessage || passwordSuccessMessage
				? `${passwordErrorMessage} ${passwordSuccessMessage}`
				: translate('registration.password.input.label'),
		name: 'passwordInput',
		type: 'password'
	};

	const inputItemPasswordConfirmation: InputFieldItem = {
		content: passwordConfirmation,
		class: getValidationClassNames(
			!!passwordConfirmationErrorMessage,
			!!passwordConfirmationSuccessMessage
		),
		icon: <SVG name={ICON_KEYS.LOCK} />,
		id: 'passwordConfirmation',
		label:
			passwordConfirmationErrorMessage ||
			passwordConfirmationSuccessMessage
				? `${passwordConfirmationErrorMessage} ${passwordConfirmationSuccessMessage}`
				: translate('registration.password.confirmation.label'),
		infoText: translate('registration.password.confirmation.infoText'),
		name: 'passwordConfirmation',
		type: 'password'
	};

	const inputItemEmail: InputFieldItem = {
		content: email,
		class: getValidationClassNames(
			!!emailErrorMessage,
			!!emailSuccessMessage
		),
		icon: <SVG name={ICON_KEYS.ENVELOPE} />,
		id: 'email',
		label:
			emailErrorMessage || emailSuccessMessage
				? `${emailErrorMessage} ${emailSuccessMessage}`
				: translate('registration.email.label'),
		infoText: translate('registration.email.infoText'),
		name: 'email',
		type: 'text'
	};

	const checkboxItemDataProtection: CheckboxItem = {
		inputId: 'dataProtectionCheckbox',
		name: 'dataProtectionCheckbox',
		labelId: 'dataProtectionLabel',
		label: translate('registration.dataProtection.label'),
		checked: isDataProtectionSelected
	};

	const handleUsernameChange = (event) => {
		validateUsername(event.target.value);
		setUsername(event.target.value);
	};

	const handlepasswordChange = (event) => {
		validatePassword(event.target.value);
		setPassword(event.target.value);
	};

	const handlePasswordConfirmationChange = (event) => {
		validatePasswordConfirmation(event.target.value);
		setPasswordConfirmation(event.target.value);
	};

	const handleEmailChange = (event) => {
		validateEmail(event.target.value);
		setEmail(event.target.value);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECTWITHBLUR) {
			redirectToApp();
		}
	};

	const handleSubmitButtonClick = () => {
		const generalRegistrationData = {
			username: username,
			password: encodeURIComponent(password),
			consultingType: consultingType.toString(),
			termsAccepted: isDataProtectionSelected.toString(),
			...(email && { email: email }),
			...(postcode && { postcode: postcode }),
			...(agencyId && { agencyId: agencyId.toString() })
		};

		let generatedRegistrationData = {};

		if (valuesOfGeneratedInputs) {
			const {
				addictiveDrugs,
				...voluntaryFieldsWithOneValue
			} = valuesOfGeneratedInputs;

			generatedRegistrationData = {
				...(valuesOfGeneratedInputs['addictiveDrugs'] && {
					addictiveDrugs: valuesOfGeneratedInputs[
						'addictiveDrugs'
					].join(',')
				}),
				...voluntaryFieldsWithOneValue
			};
		}

		const registrationData = {
			...generalRegistrationData,
			...generatedRegistrationData
		};

		console.log('reg data', registrationData);

		postRegistration(config.endpoints.registerAsker, registrationData, () =>
			setOverlayActive(true)
		);
	};

	const validateUsername = (username) => {
		if (username.length >= MIN_USERNAME_LENGTH) {
			setIsUsernameValid(true);
			setUsernameSuccessMessage(translate('registration.user.suitable'));
			setUsernameErrorMessage('');
		} else if (username.length > 0) {
			setIsUsernameValid(false);
			setUsernameSuccessMessage('');
			setUsernameErrorMessage(translate('registration.user.unsuitable'));
		} else {
			setIsUsernameValid(false);
			setUsernameSuccessMessage('');
			setUsernameErrorMessage('');
		}
	};

	const validatePassword = (password) => {
		let passwordStrength = strengthIndicator(password);
		if (password.length >= 1 && passwordStrength < 4) {
			setIsPasswordValid(false);
			setPasswordSuccessMessage('');
			setPasswordErrorMessage(
				translate('registration.password.insecure')
			);
		} else if (password.length >= 1) {
			setIsPasswordValid(true);
			setPasswordSuccessMessage(
				translate('registration.password.secure')
			);
			setPasswordErrorMessage('');
		} else {
			setIsPasswordValid(false);
			setPasswordSuccessMessage('');
			setPasswordErrorMessage('');
		}
	};

	const validatePasswordConfirmation = (confirmPassword) => {
		let passwordFits = inputValuesFit(confirmPassword, password);
		if (confirmPassword.length >= 1 && !passwordFits) {
			setPasswordConfirmationSuccessMessage('');
			setPasswordConfirmationErrorMessage(
				translate('registration.password.notSame')
			);
		} else if (confirmPassword.length >= 1) {
			setPasswordConfirmationSuccessMessage(
				translate('registration.password.same')
			);
			setPasswordConfirmationErrorMessage('');
		} else {
			setPasswordConfirmationSuccessMessage('');
			setPasswordConfirmationErrorMessage('');
		}
	};

	const validateEmail = (email) => {
		if (email.length > 0 && isStringValidEmail(email)) {
			setIsEmailValid(true);
			setEmailSuccessMessage(translate('registration.email.valid'));
			setEmailErrorMessage('');
		} else if (email.length > 0) {
			setIsEmailValid(false);
			setEmailSuccessMessage('');
			setEmailErrorMessage(translate('registration.email.invalid'));
		} else {
			setIsEmailValid(true);
			setEmailSuccessMessage('');
			setEmailErrorMessage('');
		}
	};

	const handleGeneratedInputfieldValueChange = (
		inputValue,
		inputName,
		areMultipleValuesAllowed?
	) => {
		if (areMultipleValuesAllowed) {
			const values =
				valuesOfGeneratedInputs && valuesOfGeneratedInputs[inputName]
					? valuesOfGeneratedInputs[inputName]
					: [];
			const index = values.indexOf(inputValue);
			if (index > -1) {
				values.splice(index, 1);
			} else {
				values.push(inputValue);
			}
			setValuesOfGeneratedInputs({
				...valuesOfGeneratedInputs,
				[inputName]: values
			});
		} else {
			setValuesOfGeneratedInputs({
				...valuesOfGeneratedInputs,
				[inputName]: inputValue
			});
		}
	};

	const renderInputComponent = (component, index) => {
		if (component.componentType === 'SelectDropdown') {
			return (
				<SelectDropdown
					key={index}
					handleDropdownSelect={(e) =>
						handleGeneratedInputfieldValueChange(
							e.value,
							component.name
						)
					}
					defaultValue={
						valuesOfGeneratedInputs
							? getOptionOfSelectedValue(
									component.item.selectedOptions,
									valuesOfGeneratedInputs[component.name]
							  )
							: null
					}
					{...component.item}
				/>
			);
		} else if (component.componentType === 'RadioButton') {
			return component.radioButtons.map((radio, index) => {
				return (
					<RadioButton
						key={index}
						name={component.name}
						value={index}
						handleRadioButton={(e) =>
							handleGeneratedInputfieldValueChange(
								e.target.value,
								component.name
							)
						}
						{...radio}
					/>
				);
			});
		} else if (component.componentType === 'TagSelect') {
			return component.tagSelects.map((tag, index) => {
				return (
					<TagSelect
						key={index}
						name={component.name}
						value={index}
						handleTagSelectClick={(e) =>
							handleGeneratedInputfieldValueChange(
								e.target.value,
								component.name,
								true
							)
						}
						{...tag}
					/>
				);
			});
		}
	};

	const voluntaryComponents = resortData.voluntaryComponents
		? resortData.voluntaryComponents.map((component, index) => {
				return (
					<div key={index} className="registration__contentRow">
						<h3>{component.headline}</h3>
						{renderInputComponent(component, index)}
					</div>
				);
		  })
		: null;

	const requiredComponents = resortData.requiredComponents
		? resortData.requiredComponents.map((component, index) => {
				return renderInputComponent(component, index);
		  })
		: null;

	return (
		<div className="registration">
			<Stage hasAnimation={true}></Stage>
			<form
				id="registrationForm"
				className="registration__form"
				data-consultingtype="{{consultingType}}"
			>
				<h3 className="registration__layline">{resortData.overline}</h3>
				<h1 className="registration__headline">
					{translate('registration.headline')}
				</h1>

				{/* ----------------------------- Required Fields ---------------------------- */}
				<div className="registration__generalInformation">
					{prefilledAgencyData ? (
						<div className="registration__agencyInfo">
							<div className="formWrapper__infoText">
								{translate(
									'registration.agency.prefilled.prefix'
								)}
								<br />
								<strong>{prefilledAgencyData.name}</strong>
								{prefilledAgencyData.teamAgency ? (
									<div className="formWrapper__infoText__text--tertiary">
										<span className="suggestionWrapper__item__content__teamAgency__icon">
											<SVG name={ICON_KEYS.INFO} />
										</span>
										{translate(
											'registration.agency.prefilled.isTeam'
										)}
									</div>
								) : null}
							</div>
						</div>
					) : null}
					<InputField
						item={inputItemUsername}
						inputHandle={handleUsernameChange}
					/>
					{resortData.showPostCode ? (
						<AgencySelection
							selectedConsultingType={consultingType}
							icon={<SVG name={ICON_KEYS.PIN} />}
							setAgency={(agency) => {
								if (agency) {
									setAgencyId(agency?.id);
									setPostcode(agency?.typedPostcode);
								}
							}}
						/>
					) : null}
					<InputField
						item={inputItemPassword}
						inputHandle={handlepasswordChange}
					/>
					<InputField
						item={inputItemPasswordConfirmation}
						inputHandle={handlePasswordConfirmationChange}
					/>
					{resortData.showEmail ? (
						<InputField
							item={inputItemEmail}
							inputHandle={handleEmailChange}
						/>
					) : null}
					{resortData.requiredComponents ? requiredComponents : null}
				</div>

				{/* ----------------------------- Voluntary Fields ---------------------------- */}
				{resortData.voluntaryComponents ? (
					<div className="registration__voluntaryInformation">
						<div>
							<h2>
								{translate('registration.voluntary.headline')}
							</h2>
							<p>{translate('registration.voluntary.subline')}</p>
						</div>
						{voluntaryComponents}
					</div>
				) : null}

				{/* ----------------------------- Submit Section ---------------------------- */}
				<div className="registration__footer">
					<p className="registration__requiredInfoText formWrapper__infoText">
						{translate('registration.required.infoText')}
					</p>

					<Checkbox
						item={checkboxItemDataProtection}
						checkboxHandle={() =>
							setIsDataProtectionSelected(
								!isDataProtectionSelected
							)
						}
					/>
					<Button
						item={buttonItemSubmit}
						buttonHandle={handleSubmitButtonClick}
						disabled={isSubmitButtonDisabled}
					/>
				</div>
			</form>

			{/* ----------------------------- TO LOGIN BUTTON ---------------------------- */}
			<div className="registration__toLogin">
				<p className="registration__toLogin__text">
					{translate('registration.login.helper')}
				</p>
				<div className="registration__toLogin__button">
					<a href="/login.html">
						<Button
							item={{
								label: translate('registration.login.label'),
								type: 'TERTIARY'
							}}
							isLink={true}
							buttonHandle={() => {}}
						/>
					</a>
				</div>
			</div>
			{overlayActive ? (
				<OverlayWrapper>
					<Overlay
						item={overlayItemRegistrationSuccess}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			) : null}
		</div>
	);
};
