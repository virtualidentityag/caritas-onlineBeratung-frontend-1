import * as React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import i18n, { FALLBACK_LNG, init } from '../../i18n';
import { InformalContext } from './InformalProvider';
import { useAppConfig } from '../../hooks/useAppConfig';
import { setValueInCookie } from '../../components/sessionCookie/accessSessionCookie';
import { apiGetTenantTheming } from '../../api/apiGetTenantTheming';
import getLocationVariables from '../../utils/getLocationVariables';
import useTenantTheming from '../../utils/useTenantTheming';

export const STORAGE_KEY_LOCALE = 'locale';

type TLocaleContext = {
	locale: string;
	initLocale: string;
	setLocale: (lng: string) => void;
	locales: string[];
	selectableLocales: string[];
};

export const LocaleContext = createContext<TLocaleContext>(null);

export function LocaleProvider(props) {
	const settings = useAppConfig();
	useTenantTheming();
	const [initialized, setInitialized] = useState(false);
	const [initLocale, setInitLocale] = useState(null);
	const { informal } = useContext(InformalContext);
	const [locale, setLocale] = useState(null);
	const { subdomain } = getLocationVariables();
	// const { activeLanguages } = getTenantSettings();

	const [activeLanguages, setActiveLanguages] = useState(null);

	useEffect(() => {
		init(settings.i18n).then(() => {
			setInitLocale(i18n.language);
			const locale =
				localStorage.getItem(STORAGE_KEY_LOCALE) ||
				i18n.language ||
				FALLBACK_LNG;

			setValueInCookie('lang', locale);
			setLocale(locale);
			setInitialized(true);
		});
	}, [settings.i18n]);

	useEffect(() => {
		apiGetTenantTheming({
			subdomain,
			useMultiTenancyWithSingleDomain:
				settings?.multitenancyWithSingleDomainEnabled,
			mainTenantSubdomainForSingleDomain:
				settings.mainTenantSubdomainForSingleDomainMultitenancy
		}).then((tenant) =>
			setActiveLanguages(tenant['settings'].activeLanguages)
		);
	}, [
		settings.mainTenantSubdomainForSingleDomainMultitenancy,
		settings?.multitenancyWithSingleDomainEnabled,
		subdomain
	]);

	const locales = useMemo(() => {
		if (activeLanguages) {
			return initialized
				? activeLanguages?.filter((lng) => {
						return lng.indexOf('_informal') < 0;
				  })
				: [];
		}

		return initialized
			? Object.keys(i18n.services.resourceStore.data).filter((lng) => {
					return lng.indexOf('_informal') < 0;
			  })
			: [];
	}, [activeLanguages, initialized]);

	const selectableLocales = useMemo(() => {
		if (activeLanguages) {
			return initialized
				? activeLanguages?.filter((lng) => {
						return lng.indexOf('_informal') < 0;
				  })
				: [];
		}

		return initialized
			? Object.keys(i18n.services.resourceStore.data).filter((lng) => {
					return lng.indexOf('_informal') < 0;
			  })
			: [];
	}, [activeLanguages, initialized]);

	useEffect(() => {
		if (!initialized) {
			return;
		}

		if (locale) {
			let lngCode = `${locale}${informal ? '_informal' : ''}`;
			if (!locales.includes(lngCode)) {
				// If language is x_informal try if only x exists
				lngCode = locale;
				if (!locales.includes(lngCode)) {
					// else fallback to default lng
					lngCode = FALLBACK_LNG;
				}
			}
			i18n.changeLanguage(lngCode);
			localStorage.setItem(STORAGE_KEY_LOCALE, locale);
			document.documentElement.lang = locale;
			setValueInCookie('lang', locale);
		}
	}, [locale, informal, locales, initialized]);

	if (!initialized) {
		return null;
	}

	return (
		<LocaleContext.Provider
			value={{
				locale,
				initLocale,
				setLocale,
				locales,
				selectableLocales
			}}
		>
			{props.children}
		</LocaleContext.Provider>
	);
}
