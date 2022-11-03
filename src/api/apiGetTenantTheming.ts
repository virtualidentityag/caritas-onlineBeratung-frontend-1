import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';
import { endpoints } from '../resources/scripts/endpoints';
import { TenantDataInterface } from '../globalState/interfaces/TenantDataInterface';

interface GetTenantThemingParams {
	subdomain: string;
	useMultiTenancyWithSingleDomain: boolean;
	mainTenantSubdomainForSingleDomain: string;
	tenantId: string;
}

export const apiGetTenantTheming = async ({
	subdomain,
	useMultiTenancyWithSingleDomain,
	mainTenantSubdomainForSingleDomain,
	tenantId
}: GetTenantThemingParams): Promise<TenantDataInterface> =>
	fetchData({
		url: `${endpoints.tenantServiceBase}/public/${
			useMultiTenancyWithSingleDomain
				? mainTenantSubdomainForSingleDomain
				: subdomain
		}?tenantId=${tenantId || 0}`,
		method: FETCH_METHODS.GET,
		skipAuth: true,
		responseHandling: [FETCH_ERRORS.CATCH_ALL]
	});
