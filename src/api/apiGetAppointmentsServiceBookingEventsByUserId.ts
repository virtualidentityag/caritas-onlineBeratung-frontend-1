import { BookingEventsInterface } from '../globalState/interfaces/BookingDataInterface';
import { config } from '../resources/scripts/config';
import { fetchData, FETCH_METHODS } from './fetchData';

//TODO Andre: maybe use asker instead of user
export const apiAppointmentsServiceBookingEventsByUserId = async (
	userId: string
): Promise<BookingEventsInterface[]> => {
	const url =
		config.endpoints.appointmentsServiceBookingEventsByUserId(userId);

	return fetchData({
		url,
		method: FETCH_METHODS.GET
	});
};
