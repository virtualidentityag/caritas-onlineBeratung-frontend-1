import { emitStompDirectMessage } from '../support/websocket';
import { generateAskerSession } from '../support/sessions';
import { config } from '../../src/resources/scripts/config';

const basicAskerMockedLogin = () => {
	const sessions = [generateAskerSession()];
	cy.caritasMockedLogin({ type: 'asker', sessions }).then(() => {
		sessions[0].session.messagesRead = false;
	});
};

describe('Basic user', () => {
	beforeEach(() => {
		cy.fixture('services.askertypes.full.json').then((fullAskerType) => {
			cy.intercept(
				`${config.endpoints.consultingTypeServiceBase}/1/full`,
				fullAskerType
			);

			cy.fixture('services.askertypes.basic.json').then(
				(basicAskerType) =>
					cy.intercept(
						`${config.endpoints.consultingTypeServiceBase}/basic`,
						[basicAskerType, fullAskerType]
					)
			);
		});
	});
	it('should login', () => {
		basicAskerMockedLogin();
	});
	it('should show Meine Nachrichten, Profil', () => {
		cy.get('.navigation__item ').contains('Meine Nachrichten');
		cy.get('.navigation__item ').contains('Profil');
	});
	it('should not show Erstanfragen, Peer Beratungen', () => {
		cy.get('.navigation__item ')
			.contains('Erstanfragen')
			.should('not.exist');
		cy.get('.navigation__item ')
			.contains('Peer Beratungen')
			.should('not.exist');
	});
	describe('Meine Nachrichten', () => {
		it('should show Chat, and show only Impressum and Datenschutz links', () => {
			basicAskerMockedLogin();
			cy.get('[data-cy=sessions-list-items-wrapper]').click();
			cy.get('#iconH').click();
			cy.get('#flyout').contains('Impressum');
			cy.get('#flyout').contains('Datenschutz');
			cy.get('#flyout')
				.contains('Ratsuchendenprofil')
				.should('not.exist');
			cy.get('#flyout').contains('Archivieren').should('not.exist');
			cy.get('#flyout').contains('Dokumentation').should('not.exist');
		});
		it('no click on session header', () => {
			cy.get('.sessionInfo__username a').should('not.exist');
		});
	});

	describe('Profile', () => {
		beforeEach(() => {
			basicAskerMockedLogin();
		});

		it('should be able to change the password', () => {
			cy.get('.navigation__item ').contains('Profil').click();
			cy.intercept(config.endpoints.passwordReset, {});
			cy.contains('Sicherheit').click();
			cy.get('#passwordResetOld').should('exist');

			// Change password
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
			cy.contains('Meine Nachrichten');
		});

		it('should be able to delete an account', () => {
			cy.get('.navigation__item ').contains('Profil').click();
			cy.contains('Sicherheit').click();
			cy.get('.deleteAccount').click();
			cy.get('#passwordInput').focus().type('Password123!');
			cy.get('.button__primary').click();
			cy.contains('Login');
		});
	});
});
