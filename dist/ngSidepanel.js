(function(){
	angular.module('ngSidepanel',[]);

	angular.module('ngSidepanel').factory('$parseSidepanelHtml',[function($compile){
		var count = 0;
		return function(template,controllerName,width,position,cssClass){
			var sidepanelId = 'sidepanel-' + count;
			count += 1;
			var htmlString = '<div id="' +sidepanelId+ '" class="ng-sidepanel-container" '
				+ ((controllerName) ? ('ng-controller="' +controllerName + '" ') : '') +' >'
				+ '<div class="ng-sidepanel '+ ((cssClass) ? cssClass : '') +
				'>" style="float:'+ position +'; width:'+ '0%' +'"'
				+ template
				+ '</' + 'div>'
				+ '</'+'div>';

			angular.element('body').append(htmlString);
			return sidepanelId;
		};
	}]);

	/**
	 * @title $getSidepanelTemplate
	 * Fetches the template from $templateCache by using URL and if it is not existing in $templateCache
	 * then fetches it from remote url and refills $templateCache for next time usage
	 * @param options
	 * @return promise
	 */
	angular.module('ngSidepanel').service('$getSidepanelTemplate',['$templateRequest','$templateCache','$q','$timeout',
		function($templateRequest,$templateCache,$q,$timeout){
			return function(templateUrl){
				var defer = $q.defer();
				var template = $templateCache.get(templateUrl);
				if(template){
					$timeout(function(){
						return defer.resolve(template)
					},10);
				}
				else{
					$templateRequest(templateUrl).then(function(data){
						$templateCache.put(templateUrl,data);
						defer.resolve(data);
					},function(err){
						console.error(err);
						defer.reject('Template Not found');
					});
				}
				return defer.promise;
			};
	}]);

	/**
	 * Parses the options passed for creating sidepanel instance
	 */
	angular.module('ngSidepanel').service('$parseSidepanelOptions',['$q','$timeout','$controller','$rootScope',
		function($q,$timeout,$controller,$rootScope){
			return function(options){
				var defaultOptions = {
					template : '',
					templateUrl : null,
					controller : null,
					position : 'right',
					width : '20%',
					panelClass : '',
					resolve : null
				};
				if(options && typeof(options) == 'object'){
					for(var prop in options){
						if(options.hasOwnProperty(prop) && defaultOptions.hasOwnProperty(prop) !== -1){
							if(options[prop]){

								if(prop == 'position' && ['right','left'].indexOf(options[prop].toLowerCase()) == -1){
									defaultOptions[prop] = 'right';
								}
								else{
									defaultOptions[prop] = options[prop];
								}
							}
						}
					}
					return defaultOptions;
				}
				else{
					return defaultOptions;
				}
			};
	}]);

	angular.module('ngSidepanel').service('$sidepanel',[
		'$getSidepanelTemplate',
		'$parseSidepanelOptions',
		'$q',
		'$controller',
		'$rootScope',
		'$parseSidepanelHtml',
		'$compile',
		'$timeout',
		function(
				$getSidepanelTemplate,
				$parseSidepanelOptions,
				$q,
				$controller,
				$rootScope,
				$parseSidepanelHtml,
				$compile,
				$timeout
			){

			var defer = $q.defer();
			this.sidepanelInstance = {
			};
			this.open = function(panelOptions){
				var parsedOptions = $parseSidepanelOptions(panelOptions);
				if(!parsedOptions.template){
					$getSidepanelTemplate(parsedOptions.templateUrl).then(function(data){
						var sidePanelId = $parseSidepanelHtml(data,parsedOptions.controller,parsedOptions.width,parsedOptions.position,parsedOptions.panelClass);
						var ctrlDi = {
							$scope : $rootScope.$new(),
							$sidepanelInstance : {
								close : function(data){
									angular.element('#'+sidePanelId + ' > .ng-sidepanel').animate({
										width : '0%'
									}, 400,function(){
										angular.element('#'+sidePanelId).remove();
										defer.resolve(data);
									});
								},
								dismiss : function(cause){
									angular.element('#'+sidePanelId + ' > .ng-sidepanel').animate({
										width : '0%'
									}, 400,function(){
										angular.element('#'+sidePanelId).remove();
										defer.reject(cause);
									});
								}
							}
						};
						if(parsedOptions.resolve && typeof(parsedOptions.resolve) == 'object' ){
							for(var resProp in parsedOptions.resolve){
								if(parsedOptions.resolve.hasOwnProperty(resProp)){
									ctrlDi[resProp] = panelOptions.resolve[resProp];
								}
							}
						}
						/**
						 * Joins the template to body
						 * Instantiate the controller
						 * Compile the template and bind the controller scope
						 */
						if(parsedOptions.controller){
							var ctrlInstance = $controller(parsedOptions.controller,ctrlDi);
						}
						$compile(angular.element('#'+sidePanelId).contents())(ctrlDi.$scope);
						$timeout(function(){
							angular.element('#'+sidePanelId + ' > .ng-sidepanel').animate({
								width : parsedOptions.width
							}, 400,function(){
							});
						},200);

					},function(err){
						console.error(err);
					});
				}
				else{
					/**
					 * Joins the template to body
					 * Instantiate the controller
					 * Compile the template and bind the controller scope
					 */
					var sidePanelId = $parseSidepanelHtml(data,parsedOptions.controller,parsedOptions.width,parsedOptions.position,parsedOptions.panelClass);
					var ctrlDi = {
						$scope : $rootScope.$new(),
						$sidepanelInstance : {
							close : function(data){
								$timeout(function(){
									angular.element('#'+sidePanelId + ' > .ng-sidepanel').animate({
										width : '0%'
									}, 400,function(){
										angular.element('#'+sidePanelId).remove();
										defer.resolve(data);
									});

								},100);

							},
							dismiss : function(cause){
								$timeout(function(){
									angular.element('#'+sidePanelId + ' > .ng-sidepanel').animate({
										width : '0%'
									}, 400,function(){

										angular.element('#'+sidePanelId).remove();

										defer.reject(cause);
									});
								},100);
							}
						}
					};
					if(parsedOptions.resolve && typeof(parsedOptions.resolve) == 'object' ){
						for(var resProp in parsedOptions.resolve){
							if(parsedOptions.resolve.hasOwnProperty(resProp)){
								try{
									ctrlDi[resProp] = panelOptions.resolve[resProp]();
								}
								catch(ex){
									ctrlDi[resProp] = panelOptions.resolve[resProp];
								}
							}
						}
					}
					/**
					 * Joins the template to body
					 * Instantiate the controller
					 * Compile the template and bind the controller scope
					 */
					if(parsedOptions.controller){
						var ctrlInstance = $controller(parsedOptions.controller,ctrlDi);
					}
					$compile(angular.element('#'+sidePanelId).contents())(ctrlDi.$scope);
					$timeout(function(){
						angular.element('#'+sidePanelId + ' > .ng-sidepanel').animate({
							width : parsedOptions.width
						}, 400,'linear',function(){
						});
					},100);

				}
				return this.sidepanelInstance;
			};
			
			this.sidepanelInstance.result = defer.promise;
	}]);

})();



