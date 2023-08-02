const enConsultingTypes = {
	consultingType: Array.from({ length: 500 }).reduce(
		(current: Record<string, unknown>, _, i) => ({
			...current,
			[i]: {
				'titles': {
					welcome: 'Welcome!'
				},
				'anonymous.title': 'Anonymous and free of charge',
				'welcomeScreen': {
					anonymous: {
						title: 'Anonymous and free of charge',
						text: 'You remain anonymous and receive free advice and assistance'
					}
				}
			}
		}),
		{}
	)
};

export default enConsultingTypes;
