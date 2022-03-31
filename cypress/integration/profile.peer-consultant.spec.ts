import { generateMultipleConsultantSessions } from '../support/sessions';
import { config, apiUrl } from '../../src/resources/scripts/config';

const peerConsultantMockedLogin = (amountOfSessions: number) => {
	const sessions = generateMultipleConsultantSessions(amountOfSessions).map(
		(cur) => ({ ...cur, session: { ...cur.session, isPeerChat: true } })
	);

	cy.caritasMockedLogin({
		type: 'peer-consultant',
		sessions
	});
};

describe('Peer consultant', () => {
	beforeEach(() => {
		cy.fixture('services.peer-consultanttypes.full.json').then(
			(peerConsultingFullType) => {
				cy.intercept(
					`${config.endpoints.consultingTypeServiceBase}/1/full`,
					peerConsultingFullType
				);

				cy.fixture('services.peer-consultanttypes.basic.json').then(
					(peerConsultingBasicType) =>
						cy.intercept(
							`${config.endpoints.consultingTypeServiceBase}/basic`,
							[peerConsultingBasicType, peerConsultingFullType]
						)
				);
			}
		);

		peerConsultantMockedLogin(3);
	});

	it('should show the correct navigation items', () => {
		cy.get('nav').within(() => {
			cy.contains('Meine Nachrichten');
			cy.contains('Erstanfragen');
			cy.contains('Profil');
		});
	});

	it('should check enquiries', () => {
		cy.intercept(config.endpoints.consultantEnquiriesBase, {});
		cy.contains('Erstanfragen').click();
		cy.contains('Live-Chat Anfragen').click();
	});

	describe('Meine Nachrichten', () => {
		beforeEach(() => {
			cy.intercept(`${apiUrl}/service/users/sessions/1/monitoring`, {});
			cy.intercept(config.endpoints.consultantSessions, {});
			cy.fixture('services.users.consultants.json').then((consultangs) =>
				cy.intercept(
					config.endpoints.agencyConsultants + '?agencyId=1',
					consultangs
				)
			);
			cy.contains('Meine Nachrichten').click();
		});

		it('should be able to check asker profile', () => {
			cy.get('[data-cy=sessions-list-items-wrapper]').click();
			cy.get('.sessionInfo__username a').click();
			cy.get('h2:contains("sucht-asker-3")');
		});

		it('should not be able to assign enquiries', () => {
			cy.intercept(
				config.endpoints.sessionBase +
					'/1/consultant/8c286b12-d6af-419d-9643-fbef9a82db6a',
				{ statusCode: 200 }
			);

			cy.get('.sessionsListItem__content').first().click();
			cy.get('h3:contains("sucht-asker-3")').click();
			cy.get(".select__inputLabel:contains('Beratung zuweisen')").should(
				'not.exist'
			);
		});
	});
});
