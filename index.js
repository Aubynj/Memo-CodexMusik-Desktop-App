//Define constant variables
const { app, BrowserWindow, ipcMain } = require('electron');
const database = require('./database');
const url =  require('url');
const path = require('path');


//Let initialise window object
let win;

//Function to create Window
function createWindow(){

    //Let create a window with width and height
    win = new BrowserWindow({
        width : 1300,
        height: 786,
        icon : __dirname+'/assets/img/note.png'
    });

    //Let load window with URL
    win.loadURL(url.format({
        pathname : path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes : true
    }));

    //Let devTools for development mode
    //win.webContents.openDevTools();


    //Event to handle when windows is closed
    win.on('closed',()=>{
        win = null;
    });
}

//Event channel handler for first project input
ipcMain.on('project-start-message',(event, data)=>{
    //Get all data from database
    var projectNme = data.projName;
    
    database.project.find({projName: projectNme},function(err, doc){
        var len = doc.length;
        //Check if name already exist in DB    
        if(len < 1){
            //Let insert into database
            database.project.insert(data, function(err, newDoc){
                if(newDoc){
                    event.returnValue = newDoc;
                }else{
                    event.returnValue = 0;
                }
            });
        }else{
            event.returnValue = 2;
        }
    })
});

//Channel event to verify passcode
ipcMain.on('verify-data',(event, ni)=>{
    var proj = ni.name;
    var pas = ni.pass;

    database.project.findOne({projName: proj, passcode : pas}, function(err,doc){ 
        event.returnValue = doc;       
    })
});


//Event to get all info from DB
ipcMain.on('get-all-data', (event,res)=>{
    var projectName = res;
    
    database.users.find({projectN : projectName},function(err, fetch){
        if(fetch){
            event.sender.send('get-all-reply', fetch);
        }
    })
});

//Get all project
ipcMain.on('get-feedback-message',(event,resData)=>{
    database.project.find({},function(err,res){
        if(res){
            event.sender.send('get-feedback-reply',res);
        }else if(err){
            event.sender.send('get-feedback-reply',"Nice meeting you");
        }
    })
    
});

//Let get project count
ipcMain.on('give-me-count-message',(event, data)=>{

    database.users.count({projectN : data}, function(err, count){

        event.returnValue = count;
    //   if(count){
    //     event.returnValue = count;
    //     console.log(count);
    //  }else if(err){
    //     event.returnValue = "No(Error)";
    //     console.log(err);
    //  }  
        
    })
})

  
//Event for storing memo data
ipcMain.on('send-memo-data',(event, res)=>{
    
    database.users.insert(res,function(err,resDoc){
        if(resDoc){
            event.returnValue = resDoc;
        }else if(err){
            event.returnValue = 2;
        }
    })
    
})


//Event to send Memo Edit Data
ipcMain.on('edit-data-message',(event, res)=>{
    database.users.update({ _id: res._id }, {$set : { title : res.title, content : res.content } }, {}, function (err, numRep) {
        if(numRep){
            event.returnValue = 1;
            database.users.persistence.setAutocompactionInterval(100);
        }else if(err){
            event.returnValue = 0
        }
      });
})

//Event for deleting from database
ipcMain.on('delete-memo-message', (event, res)=>{
    database.users.remove({_id : res},{},function(err, numRem){
        if(numRem){
            event.returnValue = 1;
            database.users.persistence.setAutocompactionInterval(100);
        }else{
            event.returnValue = 0;
        }
    })
})



//Event to handle when app is ready in other to fire the event
app.on('ready',createWindow);

//Event to handle when all windows are closed
app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit();
    }
});