/*
/   Name: api.service.ts
/
/   Description: Provides functionality to call apis. 
/
/   Author: Daniel Mariz
*/
/// <reference path="../_App.ts" />
module services 
{
    export interface IRequestError {
        code: number;
        message: string;
    }

    export class ApiService {

        static injections: string[] = ['logger', '$http', '$q'];

        constructor(
            public logger: ng.ILogService,
            public $http: ng.IHttpService,
            public $q: ng.IQService
        ) {

        }

        ApiRequestError(promise: ng.IDeferred<{}>): Function {
            
            var apiService:ApiService = this;
           
            return function(response: ng.IHttpPromiseCallbackArg<IRequestError>) {
                promise.reject(response);
                if (response.data !== null) {
                    apiService.logger.error('Api request failed with', response.data.code, response.data.message);
                } else {
                    throw new Error('Api request failed');
                }
            };
        }
        
       
        GenericGet(url: string, filters?: any): ng.IPromise<{}> {
            
            var apiService: ApiService = this,
                deferred = this.$q.defer(),
                params = filters || {};

            this.$http({
                headers: {},
                method: 'GET',
                params: params,
                url: url
            }).then(function(response: ng.IHttpPromiseCallbackArg<{}>) {
                return deferred.resolve(response.data);
            }, <any>apiService.ApiRequestError(deferred));

            return deferred.promise;
        }

    }

    //this call has to be at the bottom
	app.module.register.service('api', ApiService);

}