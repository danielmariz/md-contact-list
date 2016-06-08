/// <reference path="App.module.ts" />
/// <reference path="_App.ts" />

module app
{
	//module.register.controller('shell', layout.Shell);
	module.register.config(['$routeProvider',
		($routeProvider: ng.route.IRouteProvider) => { // *** $routeProvider is typed with ng.route.IRouteProvider ***
			$routeProvider
				.when('/', {
					templateUrl: 'templates/contacts.html',
					controller: 'users',
					controllerAs: 'vm'
				})
				.when('/dashboard', {
					templateUrl: 'templates/dashboard.html',
					controller: 'dashboard',
					controllerAs: 'vm'
				})
				.otherwise({
					redirectTo: '/'
				});
		}
	]);
}
