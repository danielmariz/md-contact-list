/// <reference path="../app.d.ts" />
module users
{
	export interface IUsersVM
	{
        data: any[];
        status: string;
	}

    export enum Status {WAITING, LOADING, LOADED, ERROR};

	export class UsersController implements IUsersVM {
		//region implementation of IUsersVM
		data: any[];
        status: string = Status[Status.WAITING];
		//endregion

		public static $inject: string[] = ['logger', 'api', '$mdSideNav'];
		
		constructor(
           public logger: common.LoggerService,
           public api: services.ApiService,
           public $mdSideNav: angular.material.ISidenavService
        )
		{
            logger.info('Users Controller created!'); 

            this.GetData();
		}

        GetData ():void {
            
            this.status = Status[Status.LOADING];

            this.api.GenericGet('http://jsonplaceholder.typicode.com/users')
                .then((response:any) => {
                    this.data = response;
					this.status = Status[Status.LOADED];
                    this.logger.info('User Api request succeeded');
                },() => {
                    this.status = Status[Status.ERROR];
                    this.logger.info('User Api request failed');
                });
        }

        ToggleSideNav():void {
            this.$mdSideNav('left').toggle();
        }

	}

	//this call has to be at the bottom
	app.module.register.controller('users', UsersController);

}

