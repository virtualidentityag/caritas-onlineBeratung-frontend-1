import { config, apiUrl } from '../../src/resources/scripts/config';
import { generateMultipleConsultantSessions } from '../support/sessions';

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

describe('Default consultant sessions', () => {
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
		defaultConsultantMockedLogin(3);
	});

	it('should show Meine Nachrichten, Profil, Erstanfragen', () => {
		cy.get('nav').within(() => {
			cy.contains('Meine Nachrichten');
			cy.contains('Profil');
			cy.contains('Erstanfragen');
			cy.contains('Team Beratungen');
		});
	});

	it('should check asker and archive tabs', () => {
		cy.get('a[href="/sessions/consultant/sessionView"]').click();
		cy.intercept(config.endpoints.sendMessage, {});
		cy.get('.sessionsListItem__content').first().click();
		cy.get('span[class="textarea__inputWrapper"]')
			.click()
			.type('Hallo, wie kann ich helfe?');
		cy.get('span[title="Nachricht senden"]').click();
		cy.intercept(`${apiUrl}/service/users/sessions/1/archive`, {});
		cy.get('[aria-label="Menü ein- / ausblenden"]:visible').click();
		cy.intercept(config.endpoints.myMessagesBase, {});
		cy.get('div[class="sessionMenu__item"]')
			.contains('Archivieren')
			.click();
		cy.get('.overlay__buttons').get('button').contains('Schließen').click();
	});

	it('should check the asker profile', () => {
		cy.intercept(`${apiUrl}/service/users/sessions/1/monitoring`, {});
		cy.intercept(config.endpoints.messages, {});
		cy.get('a[href="/sessions/consultant/sessionView"]').click();
		cy.get('.sessionsListItem__content').first().click();
		cy.get('[aria-label="Menü ein- / ausblenden"]:visible').click();
		cy.get('div[id="flyout"]').contains('a', 'Ratsuchendenprofil').click();
		cy.get('.profile__header__backButton').click();
		cy.get('.sessionInfo__username').click();
		cy.get('.profile__header__backButton').click();
	});

	it('should have legal links in the chat menu', () => {
		cy.intercept(config.endpoints.sendMessage, {});
		cy.get('a[href="/sessions/consultant/sessionView"]').click();
		cy.get('.sessionsListItem__content').first().click();

		cy.get('[aria-label="Menü ein- / ausblenden"]:visible').click();
		cy.get('#flyout').within(() => {
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
	});

	it('should send chat message', () => {
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
		cy.get('a[href="/sessions/consultant/sessionView"]').click();
		cy.get('.sessionsListItem__content').first().click();

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
		cy.get('a[href="/sessions/consultant/sessionView"]').click();
		cy.get('.sessionsListItem__content').first().click();
		cy.intercept(`${apiUrl}/service/users/sessions/1/archive`, {});
		cy.intercept(config.endpoints.consultantSessions, {});
		cy.get('[aria-label="Menü ein- / ausblenden"]:visible').click();
		cy.get('div[class="sessionMenu__item"]')
			.contains('Archivieren')
			.click();
		cy.get('.overlay__buttons').get('button').contains('Schließen').click();
		cy.intercept(config.endpoints.rocketchatLogout, {});
	});

	it('should document/monitor user data', () => {
		cy.get('a[href="/sessions/consultant/sessionView"]').click();
		cy.intercept(`${apiUrl}/service/users/sessions/1/monitoring`, {});
		cy.intercept(config.endpoints.messages, {});
		cy.get('.sessionsListItem__content').first().click();
		cy.get('[aria-label="Menü ein- / ausblenden"]:visible').click();
		cy.get('a[class="sessionMenu__item"]')
			.contains('Dokumentation')
			.click();
		cy.intercept(config.endpoints.rocketchatLogout, {});
	});

	it('should delete chat from menu', () => {
		cy.get('a[href="/sessions/consultant/sessionView"]').click();
		cy.get('.sessionsListItem__content').first().click();
		cy.get('[aria-label="Menü ein- / ausblenden"]:visible').click();
		cy.get('div[class="sessionMenu__item"]').contains('Löschen').click();
		cy.intercept(config.endpoints.sessionBase, {});
		cy.get('.overlay__content').contains('button', 'ja').click();
		cy.get('.overlay__content').contains('button', 'ok').click();
	});
});
