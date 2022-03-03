import { config, apiUrl } from '../../src/resources/scripts/config';
import { generateMultipleConsultantSessions } from '../support/sessions';

describe('Default consultant sessions', () => {
	const loginGenerateSessions = (amountOfSessions: number) => {
		const sessions = generateMultipleConsultantSessions(amountOfSessions);
		cy.caritasMockedLogin({
			type: 'consultant',
			sessions
		});
	};
	it('should check Ratsuchende and Archiv tabs', () => {
		loginGenerateSessions(3);
		cy.get('a[href="/sessions/consultant/sessionView"]').click();
		cy.intercept(config.endpoints.sendMessage, {});
		cy.get('.sessionsListItem__content').first().click();
		cy.get('span[class="textarea__inputWrapper"]')
			.click()
			.type('Hallo, wie kann ich helfe?');
		cy.get('span[title="Nachricht senden"]').click();
		cy.intercept(`${apiUrl}/service/users/sessions/1/archive`, {});
		cy.get('span[id="iconH"]').click();
		cy.intercept(config.endpoints.myMessagesBase, {});
		cy.get('div[class="sessionMenu__item"]')
			.contains('Archivieren')
			.click();
		cy.get('.overlay__buttons').get('button').contains('Schließen').click();
	});

	it('should check RS profile access', () => {
		loginGenerateSessions(3);
		cy.intercept(`${apiUrl}/service/users/sessions/1/monitoring`, {});
		cy.intercept(config.endpoints.messages, {});
		cy.get('a[href="/sessions/consultant/sessionView"]').click();
		cy.get('.sessionsListItem__content').first().click();
		cy.get('span[id="iconH"]').click();
		cy.get('div[id="flyout"]').contains('a', 'Ratsuchendenprofil').click();
		cy.get('.profile__header__backButton').click();
		cy.get('.sessionInfo__username').click();
		cy.get('.profile__header__backButton').click();
	});

	it('should check impressum and datenschutzerklärung from chat menu', () => {
		cy.get('span[id="iconH"]').click();
		cy.get('.legalInformationLinks')
			.contains('Impressum')
			.closest('a')
			.should('have.attr', 'href', 'https://www.caritas.de/impressum');
		cy.get('.legalInformationLinks')
			.contains('Datenschutzerklärung')
			.closest('a')
			.should(
				'have.attr',
				'href',
				'https://www.caritas.de/hilfeundberatung/onlineberatung/datenschutz'
			);
	});

	it('should send chat message', () => {
		loginGenerateSessions(3);
		cy.intercept(config.endpoints.sendMessage, {});
		cy.get('a[href="/sessions/consultant/sessionView"]').click();

		cy.get('.sessionsListItem__content').first().click();
		cy.intercept('POST', config.endpoints.draftMessages, {
			message: 'Hallo, wie kann ich helfe?'
		});

		cy.get('span[class="textarea__inputWrapper"]')
			.click()
			.type('Hallo, wie kann ich helfe?');
		cy.get('span[title="Nachricht senden"]').click();
	});

	it('should attach file and send it', () => {
		cy.intercept('POST', config.endpoints.draftMessages, {
			message: 'Hallo, wie kann ich helfe?'
		});

		cy.get('span[class="textarea__attachmentSelect"]').click();
		cy.fixture('empty.pdf').then((fileAttachment) => {
			cy.intercept(
				'POST',
				`${config.endpoints.attachmentUpload}/groupId`,
				{ fileAttachment }
			).as('file');
		});

		cy.get('.textarea__attachmentInput').attachFile('empty.pdf');
		cy.get('.textarea__iconWrapper').click();
	});

	it('should archive chat and check archived message', () => {
		cy.intercept(`${apiUrl}/service/users/sessions/1/archive`, {});
		cy.intercept(config.endpoints.consultantSessions, {});
		cy.get('span[id="iconH"]').click();
		cy.get('div[class="sessionMenu__item"]')
			.contains('Archivieren')
			.click();
		cy.get('.overlay__buttons').get('button').contains('Schließen').click();
		cy.intercept(config.endpoints.rocketchatLogout, {});
		// to-do: recreate archived message
	});

	it('should document/monitor user data', () => {
		loginGenerateSessions(3);
		cy.get('a[href="/sessions/consultant/sessionView"]').click();
		cy.intercept(`${apiUrl}/service/users/sessions/1/monitoring`, {});
		cy.intercept(config.endpoints.messages, {});
		cy.get('.sessionsListItem__content').first().click();
		cy.get('span[id="iconH"]').click();
		cy.get('a[class="sessionMenu__item"]')
			.contains('Dokumentation')
			.click();
		cy.intercept(config.endpoints.rocketchatLogout, {});
	});

	it('should delete chat from menu', () => {
		loginGenerateSessions(3);
		cy.get('a[href="/sessions/consultant/sessionView"]').click();
		cy.get('.sessionsListItem__content').first().click();
		cy.get('span[id="iconH"]').click();
		cy.get('div[class="sessionMenu__item"]').contains('Löschen').click();
		cy.intercept(config.endpoints.sessionBase, {});
		cy.get('.overlay__content').contains('button', 'ja').click();
		cy.get('.overlay__content').contains('button', 'ok').click();
	});
});
