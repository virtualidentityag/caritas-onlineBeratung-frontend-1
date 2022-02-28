import { generateMultipleConsultantSessions } from '../support/sessions';
import { config, apiUrl } from '../../src/resources/scripts/config';

const mainConsultantMockedLogin = (amountOfSessions: number) => {
	const sessions = generateMultipleConsultantSessions(amountOfSessions);
	cy.caritasMockedLogin({
		type: 'main-consultant',
		sessions
	});
};

describe('Main consultant', () => {
	beforeEach(() => {
		cy.fixture('services.main-consultanttypes.full.json').then(
			(mainConsultingFullType) => {
				cy.intercept(
					`${config.endpoints.consultingTypeServiceBase}/1/full`,
					mainConsultingFullType
				);

				cy.fixture('services.main-consultanttypes.basic.json').then(
					(mainConsultingBasicType) =>
						cy.intercept(
							`${config.endpoints.consultingTypeServiceBase}/basic`,
							[mainConsultingBasicType, mainConsultingFullType]
						)
				);
			}
		);
	});
	it('should login', () => {
		mainConsultantMockedLogin(3);
	});
	it('should show Meine Nachrichten, Profil, Erstanfragen', () => {
		cy.get('.navigation__item ').contains('Meine Nachrichten');
		cy.get('.navigation__item ').contains('Profil');
		cy.get('.navigation__item ').contains('Erstanfragen');
	});
	it('should check if Peer Beratungen is shown', () => {
		cy.get('.navigation__item ').contains('Peer Beratungen');
	});
	describe('Erstanfragen', () => {
		it('should check Erstanfragen and Live-Chat Anfragen', () => {
			mainConsultantMockedLogin(3);
			cy.intercept(config.endpoints.consultantEnquiriesBase, {});
			cy.contains('Erstanfragen').click();
			cy.contains('Live-Chat Anfragen').click();
		});
	});
	describe('Meine Nachrichten', () => {
		it('should be able to check Asker profile', () => {
			mainConsultantMockedLogin(3);
			cy.get('.navigation__item ').contains('Meine Nachrichten').click();
			cy.get('[data-cy=sessions-list-items-wrapper]').click();
			cy.get('.sessionInfo__username a').click();
		});
		// ToDo: Session: Feedback Chat!
		it('should be able to assign enquiries', () => {
			cy.get('.select__input__control').contains('Beratung zuweisen');
		});
	});
	describe('Peer Beratungen', () => {
		it('Ratsuchende should have filter for Feedback benötigt', () => {
			mainConsultantMockedLogin(3);
			cy.get('.navigation__item ').contains('Peer Beratungen').click();
			cy.get('.select__input').click();
			cy.get('.select__input__menu').contains('Feedback benötigt');
		});
	});
});
