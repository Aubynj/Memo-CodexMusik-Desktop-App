const electron = require('electron');
const ipcRender = electron.ipcRenderer;

//Initializing start project
$(".strtP").text("Start Project");

//Event to start the project
$(".startProject").click(()=>{
    
    //Animation on front page
    $(".pushImg").html("<img src='./assets/img/loader.gif' class='startImg' alt='startProject' height='50px' width='50px' />");
    $(".animate-flicker").html("Initializing Project.<br> Please wait...");
    $(".strtP").html("");
    
    //Setting timeout to trigger the event
    setTimeout(()=>{
        $("#startMod").modal('show');
        $(".animate-flicker").html("");
        $(".pushImg").html("");
        $(".strtP").text("Start Project");
        
        //Form event to submit project details
        //Event handler for submitting a project name
        $(".formSub").on("submit", function(event){
            event.preventDefault();

            var date = new Date();
            var name = $("#name").val().trim();
            var pass = $("#passcode").val().trim();
            var year = date.getFullYear(); //Getting date year
            var month = date.getMonth(); // Getting date month
            var number = date.getDate();
            var hrs = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();

            var fullDate = number + "-"+month+"-"+year; //Let get the full date
            var tme  = hrs+":"+minutes+":"+seconds; //Let get the full time
            
            if(name == "" || pass == ""){
                $(".result").html("Project name / Passcode is required").addClass("invalid").fadeIn(2000).fadeOut(6000);
            }else if(pass.length < 6){
                $(".result").html("Passcode should be greater than 6").addClass("invalid").fadeIn(2000).fadeOut(6000);
            }else{
                
                //Let validate data into data object
                var data = {
                    projName : name,
                    passcode : pass,
                    day : fullDate,
                    time : tme,
                    check : true
                };
    
                var response = ipcRender.sendSync('project-start-message', data);
                console.log(response);
                //Response Query
                if(response.check){
                    localStorage.setItem("pName", response.projName);
                    $(".result").html("Success. Please wait...").addClass("valid").fadeIn(2000).fadeOut(6000);
                    setTimeout(function(){
                        window.location.href = "project.html";
                    },3000);
                }else if(response == 2){
                    $(".result").html("Project name already exist").addClass("invalid").fadeIn(2000).fadeOut(6000);
                }else if(response == 0){
                    $(".result").html("We can't store your Project name").addClass("invalid").fadeIn(2000).fadeOut(6000);   
                }
            }
            
            
        })
        
        
    },10000);
})

