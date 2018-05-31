var app = angular.module("App",['ngRoute']);
app.config(function($routeProvider)
{
    $routeProvider
    .when("/", {
        templateUrl : "home.html",
    })
    .when("/tex", {
        templateUrl : "tex.html",
        controller : "ctrl"
    })
    .when("/customdir", {
        templateUrl : "customdir.html"

    })

})

app.controller("ctrl",function($scope,$http){
  $scope.customer = {
    name: 'Naomi',
    address: '1600 Amphitheatre'

  }
  $scope.submit = function(){
    alert("Submitted")
  }
});


app.directive('myCustomer', function() {
  return {
    restrict : 'E',
    template: 'Name is :<input type="text" value="{{customer.name}}"><br>Address is :<input type="text" value="{{customer.address}}"> '
  }

});
app.directive('numbersOnly', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function(inputValue) {
                if (inputValue == undefined) return ''
                var onlyNumeric = inputValue.replace(/[^0-9]/g, '');
                if (onlyNumeric != inputValue) {
                    modelCtrl.$setViewValue(onlyNumeric);
                    modelCtrl.$render();
                }
                return onlyNumeric;

            });
        }
    };
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
