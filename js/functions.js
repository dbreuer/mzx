window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
      })();
      
function log(text, newLine) {
    
    var p = document.getElementById('tagsinput_tagsinput');
    if (text === "empty") p.innerHTML = "";
    
    if (newLine) {
        p.innerHTML = text + ", " + p.innerHTML;
    } else {
        p.innerHTML = text;
    }
    
    
}
function millisecondsToTime(milli)
{
      var milliseconds = milli % 1000;
      var seconds = Math.floor((milli / 1000) % 60);
      var minutes = Math.floor((milli / (60 * 1000)) % 60);

      return minutes + ":" + seconds + "." + milliseconds;
}


var stopper=
{
  start: function ()
  {
    this.startDate=new Date();
    this.getCurrentDate();
    this.step=100;
    var stopper=this;
    this.timer=setInterval(function ()
    {
      stopper.getCurrentDate();
    },this.step);
  },
  stop: function ()
  {
    clearInterval(this.timer);
  },
  getCurrentDate: function ()
  {
      //console.log(this.startDate);
      
    this.currentDate=new Date();
    this.time=this.currentDate-this.startDate;
    this.printTime(this.time);
    
  },
  printTime: function (time)
  {
      
    var msecs=time%1000;
    time=Math.floor(time/1000);
    var secs=time%60;
    time=Math.floor(time/60);
    var mins=time%60;
    time=Math.floor(time/60);
    var hours=time;
    document.getElementById("timer").innerHTML=hours+":"+mins+":"+secs;
    
    
    //console.log("idő: "+hours+":"+mins+":"+secs+"."+msecs);
  }
};




//end window onload
/*
                                                                                                                                    
         FB.init({                                                                                                                                                           
           appId      : '448852595204459', // App ID                                                                                                                         
           status     : true, // check login status                                                                                                                          
           cookie     : true                                                                                                                                                 
         });                                                                                                                                                                 

         // Check if the current user is logged in                                                                                                                           
         // and has authorized the app                                                                                                                                       
         FB.getLoginStatus(function(response) {
            //console.log(response);
           // Check the result of the user                                                                                                                                   
           if(response && response.status == 'connected') {                                                                                                                  
             // The user is connected to Facebook                                                                                                                            
             // and has authorized the app.                                                                                                                                  
             // Now personalize the user experience                                                                                                                          

             FB.api('/me', function(response) {
                  player.name = response.first_name;
                  player.fid = response.id;
                  
               var message = document.getElementById('welcomeMessage');
               message.innerHTML = 'Üdv, ' + response.first_name;
               console.log(response);
               console.log(response.birthday);
                var time = new Date();
                  $.post('log.php', {time: time, player: player}, function(){
                        console.log("Save Data");
                  });
             });                                                                                                                                                             
           } else {                                                                                                                                                          
            var time = new Date();
                  $.post('log.php', {time: time, player: player}, function(){
                        console.log("Save Data");
                  });                                                                                                         
           }                                                                                                                                                                 
         });
      //log statistic
     
      
      function postToFeed() {

        // calling the API ...
        var obj = {
          method: 'feed',
          redirect_uri: 'http://david.test.amega.hu/apps/hblock/',
          link: 'http://david.test.amega.hu/apps/hblock/',
          picture: 'http://david.test.amega.hu/apps/hblock/images/logo.png',
          name: 'Kocka Játék',
          caption: 'Pontszámom: '+player.score+'.',
          description: 'Gyere és döntsd meg!'
        };

        function callback(response) {
          console.log("Post ID: " + response['post_id']);
        }

        FB.ui(obj, callback);
      }
       
*/

if (!Array.prototype.indexOfPropertyValue){
    Array.prototype.indexOfPropertyValue = function(v1, v2){
      for (var index = 0; index < this.length; index++){
        if (this[index]['x'] && this[index]['y']){
          if (this[index]['x'] === v1 && this[index]['y'] === v2){
            return index;
          }
        }
      }
      return -1;
    }
  }


function writeMessage(messageLayer, message) {
        var context = messageLayer.getContext();
        messageLayer.clear();
        context.font = '18pt Calibri';
        context.fillStyle = 'white';
        context.fillText(message, 10, 25);
      }

function isTouchDevice(){
  return (typeof(window.ontouchstart) !== 'undefined') ? true : false;
}

function emptyArray(array) {
    for(var i in array) {
        if (typeof array[i] !== "object") {
            array[i] = "";
        } else {
            array[i] = [];
        }
    }
}

