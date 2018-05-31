var app = angular.module("mainApp", ["ngRoute"]);
app.config(function($routeProvider){
  $routeProvider
  .when("/",{
    templateUrl : "index.html",
  })
  .when("/shapedir",{
    templateUrl : "shapedir.html"
  })
});

app.controller('Controller', ['$scope', function($scope) {
  $scope.customer = {
    name: 'Naomi',
    address: '1600 Amphitheatre'

  };
  $scope.call = false;
  $scope.submit =function(){

           if ($scope.call ){
                  return true;
             }
                  return false;
            }
}])
app.directive('myCustomer', function() {
  return {
    restrict : 'E',
    scope: {
      ngModel: '='
           },
     require: 'ngModel',
    template: 'address : {{customer.address}}'
  }
});


app.directive("shape", function() {

		return {
			restrict: "E",
			scope:{
				message:"@"
			},
			controller: function($scope) {
				$scope.shapes = [];

				this.triangle = function() {
					$scope.shapes.push("Triangle");
				};

				this.circle = function() {
					$scope.shapes.push("Circle");
				};
			},
			link: function(scope, element){
				element.bind("click", function() {
				alert(scope.shapes);
				});
			},
			template:'<button style="color:green">{{message}}</button> <br><br>'
		};

	});

	app.directive("triangle", function() {
		return {
			require: '^shape',
			link: function (scope, element, attrs, shapeCtrl) {
				shapeCtrl.triangle();
				}
			};
	});

	app.directive("circle", function() {
		return {
		require: '^shape',
		link: function (scope, element, attrs, shapeCtrl) {
			shapeCtrl.circle();
		}
	};
});
