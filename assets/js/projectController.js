const electron = require('electron');
const ipcRender = electron.ipcRenderer;
var item;

//Call the methods here
getAllInfo();


//Event get all data from DB
function getAllInfo(){
    //ipcRender data from server
    var projectName = localStorage.getItem("pName");
    ipcRender.on('get-all-reply', (event, dataFetch)=>{
        var template = "";
        var counter = 0.2;

        
        for (let index = 0; index < dataFetch.length; index++) {
            var id = JSON.stringify(dataFetch[index]);

            template += "<section class='col-md-3 text-center wow zoomIn' data-wow-duration='0.2s' data-wow-delay='"+counter+"s' id='draggable'>"+
                        "<section class='card removeBorder'>"+
                        "<img class='card-img-top memoImg' src='./assets/img/note.png' alt='card-image-to'>"+
                        "<section class='card-body'>"+
                           "<h5 class='card-title'>Title: <strong>"+dataFetch[index].title+"</strong></h5>"+
                            "<p class='card-text'></p>"+
                        "</section>"+
                        "<section class='icon-shift'>"+
                            "<span><i class='fa fa-pencil' onclick='editMemo("+id+")'></i></span>&nbsp;&nbsp;&nbsp;"+
                            "<span><i class='fa fa-trash' onclick='deleMemo("+id+")'></i></span>"+
                        "</section>"+
                        "</section>"+
                        "</section>"+"";

            counter += 0.1;
        }

        //console.log(template);
        $(".resData").html(template);
        console.log(template);
        
    })
    ipcRender.send('get-all-data',projectName);
}

//Event for submitting the memo data
$(".memo").on("submit",function(event){
    event.preventDefault();

    var projName = localStorage.getItem("pName"),
        title = $("#title").val().trim(),
        content = $("#content").val().trim();

        if(title == "" || content == ""){
            $(".result").html("All fields are required").addClass("invalid").fadeIn(2000).fadeOut(6000);
        }else if(projName == ""){
            $(".result").html("Restart app. Problem occurr").addClass("invalid").fadeIn(2000).fadeOut(6000);
        }else{
            

            var data = {
                projectN : projName,
                title : title,
                content : content,
                check : true
            }

            var response = ipcRender.sendSync('send-memo-data',data);
            console.log(response);
            
            if(response.check){
                $(".result").html("Memo Added").addClass("valid").fadeIn(2000).fadeOut(6000);
                $(".memo")[0].reset();
                getAllInfo();
                setTimeout(function(){
                    $("#memoModal").modal('hide');
                },2000);

            }else if(response == 2){
                $(".result").html("Error occur storing Memo").addClass("invalid").fadeIn(2000).fadeOut(6000);
            }
            

        }
})



//let make draggable and sortable
$( "#sortable" ).sortable({
    revert: true
  });
  $( "#draggable" ).draggable({
    connectToSortable: "#sortable",
    helper: "clone",
    revert: "invalid"
  });
  $( "ul, li" ).disableSelection();


  //function to Edit memo
  function editMemo(obj){
      $("#idUniq").val(obj._id);
      $("#tiEdit").val(obj.title);
      $("#contEdit").val(obj.content);
      $("#memoEditModal").modal("show");      
  }

//Function to delete Memo
function deleMemo(obj){
    $("#uniq").val(obj._id);
    $("#delTitle").html(obj.title);
    $("#memoDeleModal").modal("show");
}


  //Event for submitting edit memo
  $(".memoEdit").on("submit",function(event){
      event.preventDefault();
      
      var id = $("#idUniq").val().trim(),
        title = $("#tiEdit").val().trim(),
        content = $("#contEdit").val().trim();

        var editData = {
            _id : id,
            title : title,
            content : content
        }

        var editResponse = ipcRender.sendSync('edit-data-message',editData);
        console.log(editResponse);
        if(editResponse == 1){
            $(".resEdit").html("Memo edited successfully").addClass("valid").fadeIn(500).fadeOut(6000);
            setTimeout(function(){
                getAllInfo();
                $("#memoEditModal").modal("hide");
            },1000); 
        }else if(editResponse == 0){
            $(".resEdit").html("Error occur editing Memo").addClass("invalid").fadeIn(2000).fadeOut(6000);
        }
        
  })

  //Event for deleting memo
  $(".delMemo").on("submit", function(event){
      event.preventDefault();

      var id = $("#uniq").val().trim();
      
      var delRes = ipcRender.sendSync('delete-memo-message',id);
      console.log(delRes);
      if(delRes == 1){
        $(".resDel").html("Memo deleted successfully").addClass("valid").fadeIn(500).fadeOut(6000);
        setTimeout(function(){
            getAllInfo();
            $("#memoDeleModal").modal("hide");
        },1000);
      }else if(delRes == 0){
        $(".resDel").html("Error occur deleting memo").addClass("invalid").fadeIn(2000).fadeOut(6000);
      }
      
  })