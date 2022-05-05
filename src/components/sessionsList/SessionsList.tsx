import * as React from 'react';
import {
	createRef,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
	getSessionListPathForLocation,
	getSessionType,
	SESSION_LIST_TAB,
	SESSION_LIST_TAB_ANONYMOUS,
	SESSION_LIST_TAB_ARCHIVE,
	SESSION_LIST_TYPES,
	SESSION_TYPE_ARCHIVED,
	SESSION_TYPES
} from '../session/sessionHelpers';
import { history } from '../app/app';
import { translate } from '../../utils/translate';
import {
	AUTHORITIES,
	buildExtendedSession,
	getExtendedSession,
	hasUserAuthority,
	isAnonymousSession,
	ListItemInterface,
	REMOVE_SESSIONS,
	RocketChatContext,
	SessionsDataContext,
	SessionTypeContext,
	SET_SESSIONS,
	STATUS_EMPTY,
	UPDATE_SESSIONS,
	UserDataContext
} from '../../globalState';
import { SelectDropdown, SelectDropdownItem } from '../select/SelectDropdown';
import { SessionListItemComponent } from '../sessionsListItem/SessionListItemComponent';
import { SessionsListSkeleton } from '../sessionsListItem/SessionsListItemSkeleton';
import {
	apiGetAskerSessionList,
	apiGetConsultantSessionList,
	FETCH_ERRORS,
	FILTER_FEEDBACK,
	INITIAL_FILTER,
	SESSION_COUNT
} from '../../api';
import { Button } from '../button/Button';
import { WelcomeIllustration } from './SessionsListWelcomeIllustration';
import { SessionListCreateChat } from './SessionListCreateChat';
import './sessionsList.styles';
import {
	MAX_ITEMS_TO_SHOW_WELCOME_ILLUSTRATION,
	SCROLL_PAGINATE_THRESHOLD
} from './sessionsListConfig';
import { Text } from '../text/Text';
import clsx from 'clsx';
import useUpdatingRef from '../../hooks/useUpdatingRef';
import useDebounceCallback from '../../hooks/useDebounceCallback';
import {
	EVENT_ROOMS_CHANGED,
	EVENT_SUBSCRIPTIONS_CHANGED,
	SUB_STREAM_NOTIFY_USER
} from '../app/RocketChat';
import { getValueFromCookie } from '../sessionCookie/accessSessionCookie';
import { apiGetSessionRooms } from '../../api/apiGetSessionRooms';
import { useWatcher } from '../../hooks/useWatcher';

interface SessionsListProps {
	defaultLanguage: string;
	sessionTypes: SESSION_TYPES;
}

export const SessionsList = ({
	defaultLanguage,
	sessionTypes
}: SessionsListProps) => {
	const { rcGroupId: groupIdFromParam, sessionId: sessionIdFromParam } =
		useParams();
	const initialId = useUpdatingRef(groupIdFromParam || sessionIdFromParam);

	const rcUid = useRef(getValueFromCookie('rc_uid'));
	const location = useLocation();
	const listRef = createRef<HTMLDivElement>();

	const { sessions, dispatch } = useContext(SessionsDataContext);
	const { type } = useContext(SessionTypeContext);

	const {
		subscribe,
		unsubscribe,
		ready: socketReady
	} = useContext(RocketChatContext);
	const [filter, setFilter] = useState<
		typeof INITIAL_FILTER | typeof FILTER_FEEDBACK
	>(INITIAL_FILTER);

	const [sessionListTab, setSessionListTab] = useState<SESSION_LIST_TAB>(
		new URLSearchParams(location.search).get(
			'sessionListTab'
		) as SESSION_LIST_TAB
	);

	useEffect(() => {
		setSessionListTab((sessionListTab) => {
			const newSessionListTab = new URLSearchParams(location.search).get(
				'sessionListTab'
			) as SESSION_LIST_TAB;

			if (sessionListTab === newSessionListTab) {
				return sessionListTab;
			}

			return newSessionListTab;
		});
	}, [location]);

	const [isLoading, setIsLoading] = useState(true);
	const { userData } = useContext(UserDataContext);
	const [currentOffset, setCurrentOffset] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [isReloadButtonVisible, setIsReloadButtonVisible] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const abortController = useRef<AbortController>(null);

	useGroupWatcher(isLoading);

	// If create new group chat
	const activeCreateChat = groupIdFromParam === 'createGroupChat';

	const getConsultantSessionList = useCallback(
		(
			offset: number,
			initialID?: string
		): Promise<{ sessions: ListItemInterface[]; total: number }> => {
			setIsRequestInProgress(true);

			if (abortController.current) {
				abortController.current.abort();
			}

			abortController.current = new AbortController();

			return apiGetConsultantSessionList({
				type,
				filter,
				offset,
				sessionListTab: sessionListTab,
				count: SESSION_COUNT,
				signal: abortController.current.signal
			})
				.then(({ sessions, total }) => {
					if (!initialID) {
						return { sessions, total };
					}

					// Check if selected room already loaded
					if (
						getExtendedSession(initialID, sessions) ||
						total <= offset + SESSION_COUNT
					) {
						return {
							sessions,
							total
						};
					}

					return getConsultantSessionList(
						offset + SESSION_COUNT,
						initialID
					).then(({ sessions: moreSessions, total }) => {
						return {
							sessions: [...sessions, ...moreSessions],
							total
						};
					});
				})
				.then(({ sessions, total }) => {
					setCurrentOffset(offset);
					setTotalItems(total);
					setIsRequestInProgress(false);
					return { sessions, total };
				});
		},
		[filter, sessionListTab, type]
	);

	const scrollIntoView = useCallback(() => {
		const activeItem = document.querySelector('.sessionsListItem--active');
		if (activeItem) {
			activeItem.scrollIntoView(true);
			const wrapper = document.querySelector(
				'.sessionsList__itemsWrapper'
			);
			const firstItemId = document.querySelector('.sessionsListItem')
				? document
						.querySelector('.sessionsListItem')
						.getAttribute('data-group-id')
				: null;
			const lastItemId = wrapper.lastElementChild.querySelector(
				'.sessionsListItem'
			)
				? wrapper.lastElementChild
						.querySelector('.sessionsListItem')
						.getAttribute('data-group-id')
				: null;
			if (
				initialId.current !== firstItemId &&
				initialId.current !== lastItemId
			) {
				wrapper.scrollTop -= 48;
			}
		}
	}, [initialId]);

	// Initially load first sessions
	useEffect(() => {
		setIsLoading(true);
		setIsReloadButtonVisible(false);
		setCurrentOffset(0);
		if (
			hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) ||
			hasUserAuthority(AUTHORITIES.ANONYMOUS_DEFAULT, userData)
		) {
			// Fetch asker data
			apiGetAskerSessionList()
				.then(({ sessions }) => {
					dispatch({
						type: SET_SESSIONS,
						ready: true,
						sessions
					});
					if (
						sessions.length === 1 &&
						sessions[0]?.session?.status === STATUS_EMPTY
					) {
						history.push(`/sessions/user/view/write`);
					} else if (
						sessions.length === 1 &&
						isAnonymousSession(sessions[0]?.session) &&
						hasUserAuthority(
							AUTHORITIES.ANONYMOUS_DEFAULT,
							userData
						)
					) {
						history.push(
							`/sessions/user/view/${sessions[0].groupId}/${sessions[0].id}`
						);
					}
				})
				.then(() => setIsLoading(false));
		} else {
			// Fetch consulting sessionsData
			getConsultantSessionList(0, initialId.current)
				.then(({ sessions }) => {
					dispatch({
						type: UPDATE_SESSIONS,
						ready: true,
						sessions
					});
				})
				.then(() => setIsLoading(false))
				.then(() => {
					if (initialId.current) {
						setTimeout(() => {
							scrollIntoView();
						});
					}
				})
				.catch((error) => {
					if (error.message === FETCH_ERRORS.ABORT) {
						// No action necessary. Just make sure to NOT set
						// `isLoading` to false or `isReloadButtonVisible` to true.
						return;
					}

					setIsLoading(false);
					if (error.message === FETCH_ERRORS.EMPTY) {
						return;
					} else {
						setIsReloadButtonVisible(true);
					}
				});
		}

		return () => {
			if (abortController.current) {
				abortController.current.abort();
				abortController.current = null;
			}

			dispatch({
				type: SET_SESSIONS,
				sessions: [],
				ready: false
			});
		};
	}, [
		dispatch,
		getConsultantSessionList,
		initialId,
		scrollIntoView,
		userData
	]);

	// Refresh myself
	const subscribed = useRef(false);

	const handleRIDs = useCallback(
		(rids: string[]) => {
			/*
			Always try to get each subscription from the backend because closed
			group chats still in sessions but removed in rocket.chat
			 */
			Promise.all(
				rids.map((rid) => {
					// Get session from api
					return apiGetSessionRooms([rid])
						.then(({ sessions }) => {
							const session = sessions[0];

							if (!session) {
								return ['removed', rid];
							}

							const sessionType = getSessionType(session, rid);

							// If subscription session type has changed add it to remove list for current view
							if (
								sessionTypes.indexOf(sessionType) < 0 ||
								(sessionType === SESSION_TYPE_ARCHIVED &&
									sessionListTab !==
										SESSION_LIST_TAB_ARCHIVE) ||
								(sessionType !== SESSION_TYPE_ARCHIVED &&
									sessionListTab === SESSION_LIST_TAB_ARCHIVE)
							) {
								return ['removed', rid];
							}

							return ['insert', session];
						})
						.catch(() => {
							return ['removed', rid];
						});
				})
			).then((sessions) => {
				const updatedSessions = sessions
					.filter(([event]) => event !== 'removed')
					.map(([, s]) => s);

				if (updatedSessions.length > 0) {
					dispatch({
						type: UPDATE_SESSIONS,
						sessions: updatedSessions as ListItemInterface[]
					});
				}

				const removedSessions = sessions
					.filter(([event]) => event === 'removed')
					.map(([, rid]) => rid);

				if (removedSessions.length > 0) {
					dispatch({
						type: REMOVE_SESSIONS,
						ids: removedSessions as string[]
					});
				}
			});
		},
		[dispatch, sessionListTab, sessionTypes]
	);

	const onRoomsChanged = useCallback(
		(args) => {
			if (args.length === 0) return;

			const roomEvents = args
				// Get all collected roomEvents
				.map(([roomEvent]) => roomEvent)
				.filter(([, room]) => room._id !== 'GENERAL')
				// Reduce all room events of the same room to a single roomEvent
				.reduce((acc, [event, room]) => {
					const index = acc.findIndex(([, r]) => r.rid === room._id);
					if (index < 0) {
						acc.push([event, room]);
					} else {
						// Keep last event because insert/update is equal
						// only removed is different
						acc.splice(index, 1, room);
					}
					return acc;
				}, []);

			handleRIDs(roomEvents.map(([, room]) => room._id));
		},
		[handleRIDs]
	);

	const onSubscriptionsChanged = useCallback(
		(args) => {
			if (args.length === 0) return;

			const subscriptionEvents = args
				// Get all collected roomEvents
				.map(([subscriptionEvent]) => subscriptionEvent)
				.filter(([, subscription]) => subscription.rid !== 'GENERAL')
				// Reduce all room events of the same room to a single roomEvent
				.reduce((acc, [event, subscription]) => {
					const index = acc.findIndex(
						([, r]) => r.rid === subscription.rid
					);
					if (index < 0) {
						acc.push([event, subscription]);
					} else {
						// Keep last event because insert/update is equal
						// only removed is different
						acc.splice(index, 1, subscription);
					}
					return acc;
				}, []);

			handleRIDs(
				subscriptionEvents.map(([, subscription]) => subscription.rid)
			);
		},
		[handleRIDs]
	);

	const onDebounceSubscriptionsChanged = useUpdatingRef(
		useDebounceCallback(onSubscriptionsChanged, 500, true)
	);

	const onDebounceRoomsChanged = useUpdatingRef(
		useDebounceCallback(onRoomsChanged, 500, true)
	);

	// Subscribe to all my messages
	useEffect(() => {
		const userId = rcUid.current;
		if (socketReady && !subscribed.current) {
			subscribed.current = true;
			subscribe(
				{
					name: SUB_STREAM_NOTIFY_USER,
					event: EVENT_SUBSCRIPTIONS_CHANGED,
					userId
				},
				onDebounceSubscriptionsChanged
			);
			subscribe(
				{
					name: SUB_STREAM_NOTIFY_USER,
					event: EVENT_ROOMS_CHANGED,
					userId
				},
				onDebounceRoomsChanged
			);
		} else if (!socketReady) {
			// Reconnect
			subscribed.current = false;
		}

		return () => {
			if (subscribed.current) {
				subscribed.current = false;
				unsubscribe(
					{
						name: SUB_STREAM_NOTIFY_USER,
						event: EVENT_SUBSCRIPTIONS_CHANGED,
						userId
					},
					onDebounceSubscriptionsChanged
				);
				unsubscribe(
					{
						name: SUB_STREAM_NOTIFY_USER,
						event: EVENT_ROOMS_CHANGED,
						userId
					},
					onDebounceRoomsChanged
				);
			}
		};
	}, [
		onDebounceRoomsChanged,
		onDebounceSubscriptionsChanged,
		socketReady,
		subscribe,
		subscribed,
		unsubscribe
	]);

	const [showFilter, setShowFilter] = useState(false);

	useEffect(() => {
		const showFilter =
			type !== SESSION_LIST_TYPES.ENQUIRY &&
			sessionListTab !== SESSION_LIST_TAB_ARCHIVE &&
			((hasUserAuthority(AUTHORITIES.VIEW_ALL_PEER_SESSIONS, userData) &&
				type === SESSION_LIST_TYPES.TEAMSESSION) ||
				(hasUserAuthority(AUTHORITIES.USE_FEEDBACK, userData) &&
					!hasUserAuthority(
						AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
						userData
					)));

		setShowFilter(showFilter);

		if (!showFilter) {
			setFilter(INITIAL_FILTER);
		}
	}, [sessionListTab, type, userData]);

	const loadMoreSessions = useCallback(() => {
		setIsLoading(true);
		getConsultantSessionList(currentOffset + SESSION_COUNT)
			.then(({ sessions }) => {
				dispatch({
					type: UPDATE_SESSIONS,
					ready: true,
					sessions
				});
				setIsLoading(false);
			})
			.catch((error) => {
				if (error.message === FETCH_ERRORS.ABORT) {
					// No action necessary. Just make sure to NOT set
					// `isLoading` to false or `isReloadButtonVisible` to true.
					return;
				}

				setIsLoading(false);
				setIsReloadButtonVisible(true);
			});
	}, [currentOffset, dispatch, getConsultantSessionList]);

	const handleListScroll = useCallback(() => {
		const list: any = listRef.current;
		const scrollPosition = Math.ceil(list.scrollTop) + list.offsetHeight;
		if (scrollPosition + SCROLL_PAGINATE_THRESHOLD >= list.scrollHeight) {
			if (
				totalItems > currentOffset + SESSION_COUNT &&
				!isReloadButtonVisible &&
				!isRequestInProgress
			) {
				loadMoreSessions();
			}
		}
	}, [
		currentOffset,
		isReloadButtonVisible,
		isRequestInProgress,
		listRef,
		loadMoreSessions,
		totalItems
	]);

	const handleSelect = (selectedOption) => {
		setCurrentOffset(0);
		setFilter(selectedOption.value);
		history.push(getSessionListPathForLocation());
	};

	const handleReloadButton = useCallback(() => {
		setIsReloadButtonVisible(false);
		loadMoreSessions();
	}, [loadMoreSessions]);

	const selectedOptionsSet = [
		{
			value: FILTER_FEEDBACK,
			label: hasUserAuthority(
				AUTHORITIES.VIEW_ALL_PEER_SESSIONS,
				userData
			)
				? translate('sessionList.filter.option.feedbackMain')
				: translate('sessionList.filter.option.feedbackPeer')
		},
		{
			value: INITIAL_FILTER,
			label: translate('sessionList.filter.option.all')
		}
	];

	const preSelectedOption =
		selectedOptionsSet.find((option) => option.value === filter) ??
		selectedOptionsSet[1];

	const selectDropdown: SelectDropdownItem = {
		id: 'listFilterSelect',
		selectedOptions: selectedOptionsSet,
		handleDropdownSelect: handleSelect,
		selectInputLabel: translate('sessionList.filter.placeholder'),
		useIconOption: false,
		isSearchable: false,
		menuPlacement: 'bottom',
		defaultValue: preSelectedOption
	};

	const showEnquiryTabs =
		hasUserAuthority(AUTHORITIES.CONSULTANT_DEFAULT, userData) &&
		userData.hasAnonymousConversations &&
		type === SESSION_LIST_TYPES.ENQUIRY;

	const showSessionListTabs =
		userData.hasArchive &&
		(type === SESSION_LIST_TYPES.MY_SESSION ||
			type === SESSION_LIST_TYPES.TEAMSESSION);

	const sortSessions = useCallback(
		(a, b) => {
			switch (type) {
				case SESSION_LIST_TYPES.ENQUIRY:
					const sessionA = buildExtendedSession(a);
					const sessionB = buildExtendedSession(b);
					if (sessionA.isGroup || sessionB.isGroup) {
						// There could be no group chats inside enquiry
						return 0;
					}
					if (sessionA.item.createDate === sessionB.item.createDate) {
						return 0;
					}
					return sessionA.item.createDate > sessionB.item.createDate
						? -1
						: 1;
				case SESSION_LIST_TYPES.MY_SESSION:
				case SESSION_LIST_TYPES.TEAMSESSION:
					const latestMessageA = new Date(a.latestMessage);
					const latestMessageB = new Date(b.latestMessage);
					if (latestMessageA === latestMessageB) {
						return 0;
					}
					return latestMessageA > latestMessageB ? -1 : 1;
			}
			return 0;
		},
		[type]
	);

	return (
		<div className="sessionsList__innerWrapper">
			{(showFilter || showEnquiryTabs || showSessionListTabs) && (
				<div className="sessionsList__functionalityWrapper">
					{showEnquiryTabs && (
						<div className="sessionsList__tabs">
							<Link
								className={clsx({
									'sessionsList__tabs--active':
										!sessionListTab
								})}
								to={'/sessions/consultant/sessionPreview'}
							>
								<Text
									text={translate(
										'sessionList.preview.registered.tab'
									)}
									type="standard"
								/>
							</Link>
							<Link
								className={clsx({
									'sessionsList__tabs--active':
										sessionListTab ===
										SESSION_LIST_TAB_ANONYMOUS
								})}
								to={`/sessions/consultant/sessionPreview?sessionListTab=${SESSION_LIST_TAB_ANONYMOUS}`}
							>
								<Text
									text={translate(
										'sessionList.preview.anonymous.tab'
									)}
									type="standard"
								/>
							</Link>
						</div>
					)}
					{showSessionListTabs && (
						<div className="sessionsList__tabs">
							<Link
								className={clsx({
									'sessionsList__tabs--active':
										!sessionListTab
								})}
								to={`/sessions/consultant/${
									type === SESSION_LIST_TYPES.TEAMSESSION
										? 'teamSessionView'
										: 'sessionView'
								}`}
							>
								<Text
									text={translate(
										'sessionList.view.asker.tab'
									)}
									type="standard"
								/>
							</Link>
							<Link
								className={clsx({
									'sessionsList__tabs--active':
										sessionListTab ===
										SESSION_LIST_TAB_ARCHIVE
								})}
								to={`/sessions/consultant/${
									type === SESSION_LIST_TYPES.TEAMSESSION
										? 'teamSessionView'
										: 'sessionView'
								}?sessionListTab=${SESSION_LIST_TAB_ARCHIVE}`}
							>
								<Text
									text={translate(
										'sessionList.view.archive.tab'
									)}
									type="standard"
								/>
							</Link>
						</div>
					)}
					{showFilter && (
						<div className="sessionsList__selectWrapper">
							<SelectDropdown {...selectDropdown} />
						</div>
					)}
				</div>
			)}
			<div
				className={clsx('sessionsList__scrollContainer', {
					'sessionsList__scrollContainer--hasFilter': showFilter,
					'sessionsList__scrollContainer--hasTabs':
						showEnquiryTabs || showSessionListTabs
				})}
				ref={listRef}
				onScroll={handleListScroll}
			>
				{hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData) &&
					!isLoading &&
					sessions.length <=
						MAX_ITEMS_TO_SHOW_WELCOME_ILLUSTRATION && (
						<WelcomeIllustration />
					)}

				<div
					className={`sessionsList__itemsWrapper ${
						activeCreateChat || isLoading || sessions.length > 0
							? ''
							: 'sessionsList__itemsWrapper--centered'
					}`}
					data-cy="sessions-list-items-wrapper"
				>
					{!isLoading &&
						activeCreateChat &&
						type === SESSION_LIST_TYPES.MY_SESSION &&
						hasUserAuthority(
							AUTHORITIES.CREATE_NEW_CHAT,
							userData
						) && <SessionListCreateChat />}

					{(!isLoading || sessions.length > 0) &&
						sessions
							.sort(sortSessions)
							.map((item: ListItemInterface, index) => (
								<SessionListItemComponent
									key={
										buildExtendedSession(
											item,
											groupIdFromParam
										).item.id
									}
									type={type}
									session={buildExtendedSession(
										item,
										groupIdFromParam
									)}
									defaultLanguage={defaultLanguage}
								/>
							))}

					{!isLoading &&
						!activeCreateChat &&
						!isReloadButtonVisible &&
						sessions.length === 0 && (
							<Text
								className="sessionsList--empty"
								text={
									sessionListTab !==
									SESSION_LIST_TAB_ANONYMOUS
										? translate('sessionList.empty')
										: translate(
												'sessionList.empty.anonymous'
										  )
								}
								type="divider"
							/>
						)}

					{isLoading && <SessionsListSkeleton />}

					{isReloadButtonVisible && (
						<div className="sessionsList__reloadWrapper">
							<Button
								item={{
									label: translate(
										'sessionList.reloadButton.label'
									),
									function: '',
									type: 'LINK',
									id: 'reloadButton'
								}}
								buttonHandle={handleReloadButton}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

/*
Watch for inactive groups because there is no api endpoint
 */
const useGroupWatcher = (isLoading: boolean) => {
	const { sessions, dispatch } = useContext(SessionsDataContext);

	const refreshInactiveGroupSessions = useCallback(() => {
		const inactiveGroupSessionIds = sessions
			.filter((s) => !!s.chat && !s.chat.active)
			.map((s) => s.chat.groupId);

		if (inactiveGroupSessionIds.length <= 0) {
			return;
		}

		return apiGetSessionRooms(inactiveGroupSessionIds).then(
			({ sessions }) => {
				dispatch({
					type: UPDATE_SESSIONS,
					sessions: sessions.filter((s) => !!s.chat && s.chat.active)
				});
			}
		);
	}, [dispatch, sessions]);

	const [startWatcher, stopWatcher, isWatcherRunning] = useWatcher(
		refreshInactiveGroupSessions,
		5000
	);

	useEffect(() => {
		if (!isWatcherRunning && !isLoading) {
			startWatcher();
		}

		return () => {
			if (isWatcherRunning) {
				stopWatcher();
			}
		};
	}, [isLoading, isWatcherRunning, startWatcher, stopWatcher]);
};
