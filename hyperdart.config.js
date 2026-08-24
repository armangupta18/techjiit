import pkg from './package.json' with {type:'json'}

export default {
	// import name from package.json
	name: pkg.name,
	triggers: {
		keywords: [
			'holiday',
			'holidays',
			'public holiday',
			'public holidays',
			'bank holiday',
			'national holiday',
			'chhuti',
			'chhutti',
			'chutti',
			'vacation',
			'vacations',
			'festival',
			'festivals'
		]
	},
	query_format: {
		regex: [
			'(holidays?|chhuti|chhutti|chutti|vacations?|festivals?)\\s+(in|of|for|on)\\s+HD_LOCATION.*',
			'public\\s+(holidays?|chhuti|chhutti|chutti)\\s+(in|of|for|on)\\s+HD_LOCATION.*',
			'is\\s+.*\\s+(a\\s+)?(holiday|chhuti|chhutti|chutti)\\s+(in|of|for|on)\\s+HD_LOCATION.*',
			'(list|show)\\s+(holidays?|chhuti|chhutti|chutti|vacations?)\\s+(in|of|for|on)\\s+HD_LOCATION.*',
			'(holidays?|chhuti|chhutti|chutti)\\s+on\\s+.*\\s+(in|of|for)\\s+HD_LOCATION.*',
			'.*(holidays?|chhuti|chhutti|chutti|vacations?|festivals?).*HD_LOCATION.*'
		]
	},
	client: {
		// location of client side code
		location: pkg.module,
		// name of the UMD module
		moduleName: pkg.umdName || 'HD' + pkg.name,
		// baseURL is only used in local testing and ignored after publish
		baseURL: '/' + pkg.name,
	},
	format: {
		mainline: true,
		sidebar: true
	},
	permissions: {
		
	},
	info: {
		
	}
}
