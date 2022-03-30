import { generateMultipleConsultantSessions } from '../support/sessions';
import { config } from '../../src/resources/scripts/config';

const defaultConsultantMockedLogin = (amountOfSessions: number) => {
	const sessions = generateMultipleConsultantSessions(amountOfSessions);
	cy.fixture('service.consultant.stats').then((consultantStats) => {
		cy.intercept(config.endpoints.consultantStatistics, consultantStats);
	});
	cy.caritasMockedLogin({
		type: 'consultant',
		sessions
	});
};

describe('Default consultant', () => {
	beforeEach(() => {
		cy.fixture('services.default-consultanttypes.full.json').then(
			(defaultConsultingFullType) => {
				cy.intercept(
					`${config.endpoints.consultingTypeServiceBase}/1/full`,
					defaultConsultingFullType
				);

				cy.fixture('services.default-consultanttypes.basic.json').then(
					(defaultConsultingBasicType) =>
						cy.intercept(
							`${config.endpoints.consultingTypeServiceBase}/basic`,
							[
								defaultConsultingBasicType,
								defaultConsultingFullType
							]
						)
				);
			}
		);
	});

	describe('Profile', () => {
		beforeEach(() => {
			defaultConsultantMockedLogin(3);
			cy.get('.navigation__item ').contains('Profil').click();
		});

		it('should login, check impressum and privacy data links', () => {
			cy.contains('Impressum')
				.closest('a')
				.should(
					'have.attr',
					'href',
					'https://www.caritas.de/impressum'
				);
			cy.contains('Datenschutzerklärung')
				.closest('a')
				.should(
					'have.attr',
					'href',
					'https://www.caritas.de/hilfeundberatung/onlineberatung/datenschutz'
				);
		});

		it('should enable absence mode and set message', () => {
			cy.contains('Meine Aktivitäten').click();
			cy.intercept(config.endpoints.setAbsence, {});
			cy.get('#absenceForm').within(() => {
				cy.get('[role="switch"]').click({ force: true });
				cy.get('textarea')
					.focus()
					.type(
						'Having a well deserved rest in the Antartica with some penguins'
					);
				cy.contains('Speichern').click();
			});

			cy.get('.overlay__buttons')
				.get('button')
				.contains('Schließen')
				.click();
			cy.contains('Speichern').should('not.exist');
		});

		it('should reset consultant password and login with new one', () => {
			cy.contains('Sicherheit').click();
			cy.intercept(config.endpoints.passwordReset, {});
			cy.get('input[id="passwordResetOld"]').focus().type('password');
			cy.get('input[id="passwordResetNew"]').focus().type('Password123!');
			cy.get('input[id="passwordResetConfirm"]')
				.focus()
				.type('Password123!');
			cy.intercept(config.endpoints.rocketchatLogout, {});
			cy.get('#passwordResetButton').click();
			cy.get('.overlay__buttons')
				.get('button')
				.contains('Zum Login')
				.click();

			// `force` is necessary because Cypress reports the labels to be covering the inputs
			cy.get('#username').type('username', { force: true });
			cy.get('#passwordInput').type('Password123!', { force: true });
			cy.contains('Anmelden').click();
			cy.contains('Erstanfragen');
		});

		it('should check statistics and download them', () => {
			cy.contains('Meine Aktivitäten').click();
			cy.get('#statisticsSelect').click();
			cy.contains('letzten Monats').click();
			cy.get('a').contains('Download Excel Datei').click();
		});

		it('should edit consultant email and full name', () => {
			cy.intercept(config.endpoints.userData, {});
			cy.contains('Private Daten')
				.closest('.profile__content__title')
				.find('[aria-label="Bearbeiten"]')
				.click();

			cy.get('#E-Mail-Adresse')
				.focus()
				.type('test@test.com')
				.get('#Vorname')
				.focus()
				.type('AnotherName')
				.get('#Nachname')
				.focus()
				.type('AnotherLastName')
				.get('.button__item')
				.contains('Speichern')
				.click();

			cy.contains('Speichern').should('not.exist');
		});

		it('guide the user through the 2FA form', () => {
			cy.contains('Sicherheit').click();
			cy.get('.twoFactorAuth__switch').click();
			cy.get('#overlay').within(() => {
				cy.contains('1. Schritt | 2. Faktor wählen');
				cy.contains('Weiter').click();

				cy.contains('2. Schritt | Installieren Sie sich die App');
				cy.contains('Weiter').click();

				cy.contains(
					'3. Schritt | Verknüpfen Sie die App und Ihren Account'
				);
				cy.contains('Weiter').click();

				cy.contains('4. Schritt | Einmal-Code eingeben');
				cy.get('input[name="otp"]').type('123456');
				cy.get('button:contains("Speichern")').should('be.enabled');
			});
		});
	});
});
