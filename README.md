# ngSidepanel
Angular Sidepanel 


## Install

```
bower install ngSidepanel

bower install ngSidepanel --save
```

## Usage

### index.html

```
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>ngSidepanel Demo</title>
		<meta name="description" content="ngSidepanel : AngularJS directive  for sidepanel" />
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" />
		<link rel="stylesheet" href="bower_components/ngSidepanel/dist/ngSidepanel.css" />
		<style>
			.bg-blue{
				background : #0AB5F7;
			}
		</style>
		
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"></script>
		<script type="text/javascript" src="bower_components/ngSidepanel/dist/ngSidepanel.js"></script>
		<script type="text/javascript" src="app.js"></script>
	</head>
	<body ng-app="testApp">
		<div class="container-fluid">
			<div class="row" ng-controller="testController">
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<h1>Title : {{title}} </h1>
					<h4>Name : {{name}}</h4>
					<button class="btn btn-default btn-sm" ng-click="openSidepanel()">Open Sidepanel</button>
				</div>

			</div>
		</div>
	</body>
</html>

```

### app.js

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
### views/test-sidepanel.html

```

	<h3>Panel Title : {{panelTitle}} </h3>
	<div class="form-group form-group-sm">
		<input type="text" class="form-control" ng-model="panelName" type="text" placeholder="Panel Name" />
	</div>
	<button class="btn btn-sm btn-primary" ng-click="closePanel()">Close</button>
	<button class="btn btn-sm btn-danger" ng-click="dismissPanel()">Dismiss</button>

```
