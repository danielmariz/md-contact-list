/// <reference path='../_App.ts' />
module users
{
	export interface IDashboardVM{
        data: any[];
        status: string;
    }

	export class DashboardController implements IDashboardVM {
		//region implementation of IUsersVM
		data: any[];
        status: string = Status[Status.WAITING];
		//endregion

        chartMainTitle: string = '';
		chartMainValue: string = '';
		chartTitle: string = this.chartMainTitle;
		chartValue: string = this.chartMainValue;

        chartConfig:any = {
            apiCountProperty: 'duration',
            apiLabelProperty: 'name',
            dataSet: [
                {
                    color: '#25A6F7'
                },
                {
                    color: '#8DBB5F'
                },
                {
                    color: '#F5A623'
                },
                {
                    color: '#D0021B'
                },
                {
                    color: '#737F67'
                },
                {
                    color: '#FFCA71'
                },
                {
                    color: '#595980'
                },
                {
                    color: '#7F2732'
                },
                {
                    color: '#30627F'
                },
                {
                    color: '#C5C5C5'
                }
            ],
            chartOptions: {
                series: {
                    pie: {
                        radius: 1,
                        startAngle: 1,
                        innerRadius: 0.85,
                        show: true,
                        width: 2,
                        label: {
                            show: false,
                            radius: '3/4'
                        },
                        'height': 280,
                        'stroke': {
                            color: '#F4F4F4',
                            'width': 2
                        },
                        'shadow': {
                            'top': 0,
                            'left': 0
                        },
                        'combine': {
                            'threshold': 0.05,
                            color: '#C5C5C5'
                        }
                    }
                },
                'legend': {
                    'show': false
                },
                'grid': {
                    'hoverable': true
                }
            }
        }

        mapConfig: any = {
            "map": {
                "center": {
                    "latitude": -41.29999,
                    "longitude": 174.77559999999994
                },
                "zoom": 5,
                "maxZoom": 15,
                "bounds": {}
            },
            "options": {
                "panControl": true,
                "zoomControl": true,
                "mapTypeControl": false,
                "scaleControl": false,
                "streetViewControl": false,
                "overviewMapControl": false,
                "scrollwheel": false
            },
            "markCluster": {
                // "navigateUrl": "#/Locations/Location/{{id}}/Overview",
                "zoom": 5,
                "maxZoom": 15,
                "styles": [
                    {
                        // "url": "../images/marker-yellow.png",
                        "height": 41,
                        "width": 36,
                        "anchor": [
                            -4,
                            -2
                        ],
                        "textColor": "#333333",
                        "textSize": 12
                    }
                ]
            },
            "styles": [
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#56baf9"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#F3F3F3"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#C3C3C3"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#e3e3e3"
                        }
                    ]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#333333"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#333333"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                }
            ]
        }

		public static $inject: string[] = ['logger', 'api', '$filter', '$scope']; //, '$element'
		
		constructor(
           public logger: ng.ILogService,
           public api: services.ApiService,
           public $filter: ng.IFilterService,
           public $scope: ng.IScope
        //    public $element: ng.IRootElementService
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
                    this.ParsingChartData(this.data);	
					this.AddChartEventListeners();
                    this.logger.info('User Api request succeeded');
                },() => {
                    this.status = Status[Status.ERROR];
                    this.logger.info('User Api request failed');
                });
        }

        AddChartEventListeners() {
			var self: DashboardController = this;
			
			$(this).find('#flot-chart-content').unbind('plothover').bind('plothover', function(event: JQueryEventObject): void {
				var slice = arguments[2];
				self.SetChartLegend(slice);
            });
		}

		SetChartLegend(slice) {
			if (slice) {
				this.chartTitle = slice.series.label;
				this.chartValue = slice.datapoint[1][0][1];
				this.$scope.$apply();
			} else {
				if (this.chartTitle !== this.chartMainTitle) {
					this.chartTitle = this.chartMainTitle;
					this.chartValue = this.chartMainValue;
					this.$scope.$apply();
				}
			}
		}

		ParsingChartData(dataList) {
			var self: DashboardController = this;
			var total: number = 0;
			angular.forEach(dataList, function(singleData, key: number) {
				self.data[key].label = singleData[self.chartConfig.apiLabelProperty];
				self.data[key].data = [[key, singleData[self.chartConfig.apiCountProperty]]];
				total += Number(singleData[self.chartConfig.apiCountProperty]);
			});
			self.chartTitle = self.chartMainTitle = self.chartConfig.title;
			self.chartMainValue = self.chartValue = total.toString();

			console.log('Chart data set: ', self.data);
		}

	}

	//this call has to be at the bottom
	app.module.register.controller('dashboard', DashboardController);

}

