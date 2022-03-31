import { emitStompDirectMessage } from '../support/websocket';
import { generateAskerSession } from '../support/sessions';
import { config } from '../../src/resources/scripts/config';

const groupChatAskerMockedLogin = () => {
	const sessions = [generateAskerSession()];
	cy.caritasMockedLogin({ type: 'group-chat-asker', sessions }).then(() => {
		sessions[0].session.messagesRead = false;
		emitStompDirectMessage();
	});
};

describe('Group chat asker', () => {
	beforeEach(() => {
		cy.fixture('services.group-chat-askertypes.basic.json').then(
			(basicGroupChatAskerType) =>
				cy.intercept(
					`${config.endpoints.consultingTypeServiceBase}/basic`,
					basicGroupChatAskerType
				)
		);
	});

	it('should be able to login', () => {
		groupChatAskerMockedLogin();
	});
});
