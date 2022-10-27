import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getExtendedSession, SessionsDataContext } from '../../globalState';
import { Headline } from '../headline/Headline';
import './enquiryLanguageSelection.styles';
import { LanguagesContext } from '../../globalState/provider/LanguagesProvider';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';
import { LocaleContext } from '../../globalState/provider/LocaleProvider';

interface EnquiryLanguageSelectionProps {
	className?: string;
	onSelect: (language: string) => void;
	value: string;
}

export const EnquiryLanguageSelection: React.FC<EnquiryLanguageSelectionProps> =
	({ className = '', onSelect, value }) => {
		const { t: translate } = useTranslation();
		const settings = useAppConfig();
		const { sessions, ready } = useContext(SessionsDataContext);
		const { fixed: fixedLanguages } = useContext(LanguagesContext);
		const { sessionId: sessionIdFromParam } =
			useParams<{ sessionId: string }>();
		const { locale } = useContext(LocaleContext);

		const [languages, setLanguages] = useState([]);

		useEffect(() => {
			if (!ready) {
				return;
			}

			// async wrapper
			const getLanguagesFromApi = new Promise<string[]>((resolve) => {
				const activeSession = getExtendedSession(
					sessionIdFromParam,
					sessions
				);

				let agencyId = null;
				if (activeSession) {
					agencyId = activeSession.agency.id;
				} else if (sessions.length === 1) {
					agencyId = sessions[0].agency.id;
				}

				if (!agencyId) {
					resolve([]);
				}
			});

			getLanguagesFromApi.then((sortedLanguages) => {
				if (sortedLanguages.includes(locale)) {
					onSelect(locale);
				}
				setLanguages(sortedLanguages);
			});
		}, [locale, onSelect, ready, sessionIdFromParam, sessions]);

		const mapLanguages = (isoCode) => (
			<span
				key={isoCode}
				onClick={() => onSelect(isoCode)}
				className={`enquiryLanguageSelection__tab ${
					value === isoCode
						? 'enquiryLanguageSelection__tab--selected'
						: ''
				}`}
			>
				{translate(`languages.${isoCode}`)} ({isoCode.toUpperCase()})
			</span>
		);

		if (languages.length <= 1) {
			return null;
		}

		return (
			<div className={`enquiryLanguageSelection ${className}`}>
				<Headline
					semanticLevel="5"
					text={translate('enquiry.language.selection.headline')}
				/>
				<div className="enquiryLanguageSelection__tabs">
					{languages.map(mapLanguages)}
				</div>
			</div>
		);
	};
