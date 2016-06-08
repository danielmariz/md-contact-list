/// <reference path="../_App.ts" />
module layout
{
	export interface IShellVM
	{
		message: String;
	}

	export class Shell implements IShellVM {
		//region implementation of IShellVM
		message: string;
		//endregion

		public static $inject = ['logger'];
		constructor(logger: ng.ILogService)
		{
			var vm = <IShellVM>this;
			vm.message = "a message comes here now!!";//
			logger.info('Shell created!');
		}

		
	}

	//this call has to be at the bottom
	//angular.module('app').controller('shell', Shell);
	app.module.register.controller('shell', Shell);

}

