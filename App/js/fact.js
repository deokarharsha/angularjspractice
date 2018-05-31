// app.factory('connectJson', function($http) {
//
//   return {
//       getItems: function () {
//          return  $http.get('data.json');
//       }
// }
// });
// app.controller('birthController', function($scope, connectJson){
//   connectJson.getItems().then(function(response){
//               $scope.BirthData = response;
//         });
//         $scope.year;
//         $scope.dob1;
//         $scope.BirthData = {};
//         $scope.bdate = [{"Day" :"Sunday","NameInitials" : []},
//                    {"Day" :"Monday","NameInitials" : []},
//                    {"Day" :"Tuesday","NameInitials" : []},
//                    {"Day" :"Wednesday","NameInitials" : []},
//                    {"Day" :"Thursday","NameInitials" : []},
//                    {"Day" :"Friday","NameInitials" : []},
//                    {"Day" :"Saturday","NameInitials" : []}];
//         $scope.submit = function(){
//           angular.forEach($scope.BirthData,function(value,key){
//             var newdob = new Date(value.DOB);
//             newdob.setYear($scope.year);
//             var dob = newdob.getDay();
//             var splitName = value.Name.split(" ");
//             var Initials = splitName[0].charAt(0) + splitName[1].charAt(0);
//             $scope.bdate[dob].NameInitials.push(Initials);
//           });
//           }
// });
