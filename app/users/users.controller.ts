/// <reference path="../_App.ts" />
module users
{
	

    export interface ISidenavObject {
        toggle(): ng.IPromise<void>;
        open(): ng.IPromise<void>;
        close(): ng.IPromise<void>;
        isOpen(): boolean;
        isLockedOpen(): boolean;
    }

    export interface ISidenavService {
        (component: string): ISidenavObject;
    }

    export interface IUsersVM
	{
        data: any[];
        status: string;
        selected: any;
        sideNav: ISidenavObject;
        searchText: string;
	}

    export enum Status {WAITING, LOADING, LOADED, ERROR};

	export class UsersController implements IUsersVM {
		//region implementation of IUsersVM
		data: any[];
        status: string = Status[Status.WAITING];
        selected: any;
        sideNav: ISidenavObject;
        searchText: string = '';
		//endregion

		public static $inject: string[] = ['logger', 'api', '$mdSidenav', '$filter'];
		
		constructor(
           public logger: ng.ILogService,
           public api: services.ApiService,
           public $mdSidenav: ISidenavService,
           public $filter: ng.IFilterService
        )
		{
            logger.info('Users Controller created!'); 
            this.GetData();
		}

        GetData ():void {
            
            this.status = Status[Status.LOADING];

            this.api.GenericGet('http://jsonplaceholder.typicode.com/users')
                .then((response:any) => {
                    this.data = this.$filter('orderBy')(response, 'name');
					this.status = Status[Status.LOADED];
                    this.selected = this.data[0];
                    this.sideNav = this.$mdSidenav('left');
                    this.logger.info('User Api request succeeded');
                },() => {
                    this.status = Status[Status.ERROR];
                    this.logger.info('User Api request failed');
                });
        }

        ToggleSideNav():void {
            this.sideNav.toggle();
        }

        SelectUser(user:any):void {
            this.selected = user;
            
            if(this.sideNav.isOpen()){
                this.sideNav.close();
            }
        }

	}

	//this call has to be at the bottom
	app.module.register.controller('users', UsersController);

}

