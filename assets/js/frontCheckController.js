const electron = require('electron');
const ipcRender = electron.ipcRenderer;


//check from main project db
loadme()

function loadme(){
    ipcRender.on('get-feedback-reply', (event, data)=>{
        //Check if data contains information
        if(data.length < 1){
            window.location.href = "start.html";
        }else{
            var template = "";
            var counter = 0.4;
            
            //For look to get all project name and document it contains
            for (let index = 0; index < data.length; index++) {
                var id = JSON.stringify(data[index]);
                
                //Let get project name for our count
                var projN = data[index].projName;
                
                //Let get document count from DB
                var count = ipcRender.sendSync('give-me-count-message',projN);
                
                template += "<section class='col-md-4 wow zoomIn' data-wow-duration='0.2s' data-wow-delay='"+counter+"s'>"+
                                "<section class='card projectDis' onclick='getProject("+id+")'>"+
                                        "<section class='box'>"+
                                            "<h4>"+data[index].projName+"</h4>"+
                                        "</section>"+
                                            "<section class='card-body' style='border-top:1px solid #ccc'>"+
                                            "<p class='card-text'>"+count+" Document</p>"+
                                            "<span class='info'><strong>Create:</strong> "+data[index].day+"</span><br>"+
                                            "<span class='info'><strong>Time:</strong>  "+ data[index].time+"</span>"+
                                            "</section>"+
                                    "</section>"+
                             "</section>";

                counter += 0.1;
            }

            $(".projectRes").html(template);
            
            
        }
        
    })
    
    ipcRender.send('get-feedback-message',"get me project data");
}

function getProject(obj){
    $("#projN").val(obj.projName);
    $(".pName").html(obj.projName);
    $("#verifyMemo").modal("show");
}

$(".verify").on("submit",function(event){
    event.preventDefault();

    var projectName = $("#projN").val().trim(),
        passcode = $("#pass").val().trim();

    if(projectName == "" || passcode == ""){
        $(".resVeri").html("All fields are required").addClass("invalid").fadeIn(2000).fadeOut(6000);
    }else{
        
        var verifyData = {
            name : projectName,
            pass : passcode
        };
        
        var verifyRes = ipcRender.sendSync('verify-data', verifyData);
            
        if(verifyRes != null){
            localStorage.setItem("nameProject",verifyRes.projName);
            $(".resVeri").html("Passcode Verified. Please wait...").addClass("valid").fadeIn(500).fadeOut(6000);
            setTimeout(function(){
                window.location.href = "project.html";
            },1000)
        }else if(verifyRes == null){
            $(".resVeri").html("Passcode Verify is incorrect").addClass("invalid").fadeIn(2000).fadeOut(6000);
        }

    }
    
})