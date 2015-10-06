# ngSidepanel
Angular Sidepanel 


## Install

```
bower install ngSidepanel
```

## Usage

```
		var testApp = angular.module('testApp',['ngSidepanel']);
		testApp.controller('testController',['$scope','$sidepanel','$window',function($scope,$sidepanel,$window){
			
			$scope.title = 'NgSidepanel';
			$scope.name = 'Default Name';
			
			$scope.openSidepanel = function(){
				var sidePanelInstance = $sidepanel.open({
					templateUrl : './views/test-sidepanel.html',
					controller : 'testSidepanelController',
					width : '25%',
					position : 'right',
					panelClass : 'bg-blue',
					resolve : {
						title : function(){
							return $scope.title;
						}
					}
				});
				
				sidePanelInstance.result.then(function(data){
					$scope.name = data;
				},function(reason){
					$window.alert('Sidepanel dismissed');
				})
			};
			
		}]);
		
		testApp.controller('testSidepanelController',['$scope','$sidepanelInstance','title',function($scope,$sidepanelInstance,title){
			$scope.panelTitle = title;
			$scope.panelName = 'Panel Name';
			
			$scope.closePanel = function(){
				$sidepanelInstance.close($scope.panelName);
			};
			
			$scope.dismissPanel = function(){
				$sidepanelInstance.dismiss('Dismissed');
			};
		}]);


```
