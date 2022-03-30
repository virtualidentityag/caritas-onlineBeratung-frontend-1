import { generateMultipleConsultantSessions } from '../support/sessions';
import { config, apiUrl } from '../../src/resources/scripts/config';

const mainConsultantMockedLogin = (amountOfSessions: number) => {
	const sessions = generateMultipleConsultantSessions(amountOfSessions);
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

		mainConsultantMockedLogin(3);
		cy.get('.navigation__item').contains('Profil').click();
	});

	it('should show Meine Nachrichten, Profil, Erstanfragen', () => {
		cy.get('.navigation__item').contains('Meine Nachrichten');
		cy.get('.navigation__item').contains('Erstanfragen');
		cy.get('.navigation__item').contains('Profil');
	});
	describe('Erstanfragen', () => {
		it('should check Erstanfragen and Live-Chat Anfragen', () => {
			cy.intercept(config.endpoints.consultantEnquiriesBase, {});
			cy.contains('Erstanfragen').click();
			cy.contains('Live-Chat Anfragen').click();
		});
	});
	describe('Meine Nachrichten', () => {
		it('should be able to check Asker profile', () => {
			cy.get('.navigation__item').contains('Meine Nachrichten').click();
			cy.get('[data-cy=sessions-list-items-wrapper]').click();
			cy.get('.sessionInfo__username a').click();
		});
		// ToDo: Session: Feedback Chat!
		it('should not be able to assign enquiries', () => {
			cy.get('.select__input__control')
				.contains('Beratung zuweisen')
				.should('not.exist');
		});
	});
});
