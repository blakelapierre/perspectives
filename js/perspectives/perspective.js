angular.module('perspective', [])
.controller('PerspectiveCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('/imageList').success(function(data, status) {
		$scope.images = data.files;
		$scope.apply();
	}).error(function(data, status) {
		console.log('You\'ve got an error', data, status);
	});
}]);