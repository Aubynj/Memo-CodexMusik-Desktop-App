var app = angular.module('app',[]);

app.controller('loginCtrl', function($scope,$http){
    


    $scope.login = ()=> {

        var emptyTemplate = `
            <section class="errorNotifier">
                <h4>All fields are required</h4>
            </section>
        `;
        
        var errorTemplate = `
            <section class="errorNotifier">
                <h5>Username / Password is incorrect</h5>
            </section>
        `;

        if($scope.username === undefined || $scope.password === undefined){
            //document.getElementById('errorReport').innerHTML = emptyTemplate;
            $('#errorReport').html("Hello world");
        }else if($scope.username === "" || $scope.password === ""){
            document.getElementById('errorReport').innerHTML = errorTemplate;
        }else{
            
            var data = {
                username : $scope.username,
                password : $scope.password
            };

            $http.post('',data).then((response)=>{
                
            },
            (error)=>{
                
            })
        }
        
    };


    

    
})