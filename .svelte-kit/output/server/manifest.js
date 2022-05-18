export const manifest = {
	appDir: "_app",
	assets: new Set(["favicon.png","manageAppointments.html","manageAppointments.js"]),
	mimeTypes: {".png":"image/png",".html":"text/html",".js":"application/javascript"},
	_: {
		entry: {"file":"start-11ea4417.js","js":["start-11ea4417.js","chunks/index-9b6b3a71.js"],"css":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js'),
			() => import('./nodes/3.js'),
			() => import('./nodes/4.js')
		],
		routes: [
			{
				type: 'page',
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				path: "/",
				shadow: null,
				a: [0,2],
				b: [1]
			},
			{
				type: 'page',
				id: "manageAppointments",
				pattern: /^\/manageAppointments\/?$/,
				names: [],
				types: [],
				path: "/manageAppointments",
				shadow: null,
				a: [0,3],
				b: [1]
			},
			{
				type: 'page',
				id: "test",
				pattern: /^\/test\/?$/,
				names: [],
				types: [],
				path: "/test",
				shadow: null,
				a: [0,4],
				b: [1]
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
