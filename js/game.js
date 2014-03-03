/**
 * MZ/X Game
 * This is a full responsive online game
 * Simple, easy and with flat design
 * Used Bootstrap structure
 * @see Bootstrap 3.x {@link http://getbootstrap.com/}
 * @author David Breuer <dbreuer83@gmail.com>
 * @global
 */
var parent = document.body;
var container = document.getElementById('main-view');
var homeView = document.getElementById('homeView');
var homeViewControllers = document.getElementById('HomeViewControllers');
var settings = document.getElementById('settings-view');
var main = document.getElementById('main-id');

var play_html5_audio = false;
var winWIDTH = window.innerWidth;

var winHEIGHT = window.innerHeight;
var GameStartTime = new Date().getTime();
var pointsData = new Array();
var GameLevel = 0;
var GameCircles = 10;
var boxColumns = 0;
var boxRows = 0;
var bW = 0;
var bH = 0;
var boxWIDTH = 0;
var boxHEIGHT = 0;

var boxSize = 10;
var size = 50;
var GameType = 'hero';

var GameSpeed = 100;
var GameScore = 0;
var GameCombo = 0;
var mouseDown = false;

var facebookLoginBox = true;
var allBrickets = new Array();
var selectedArray = new Array();

var snd = [];
var sound ="";
var playEffect = {};


var donesData = [];
var dones = [];

var colorCodes = ["#009B77", "#E2492F", "#D65076", "#EFC050", "#5B5EA6", "#4ECDC4", "#C7F464", "#FF6B6B", "#C44D58"];

var sColor = "";
var sID = "";
/**
 * The game constructor
 * 
 * @name Game
 * @constructor
 */
var Game = {
    /**
     * Initialize
     * @function
     * @memberOf Game
     */
    init: function() {
        $("body").css({width: (3*winWIDTH)+"px"});
        $("section").css({width: winWIDTH+"px", height: winHEIGHT+"px"});
        $(".gameView").css({marginLeft: - winWIDTH+"px"});
        $("#HomeViewControllers").css({marginTop: (winHEIGHT/3)+"px"});
        
        Game.getJSONData();
        
    },
    /**
     * Rebuild game
     * @function
     * @memberOf Game
     */
    resetBuild: function() {
        Game.getJSONData();
        Game.build();
    },
    /**
     * Get settings data from JSON
     * @function
     * @memberOf Game
     */
    getJSONData: function() {
        $.getJSON('data/settings.json', function(data) {
            $.each(data, function(key, val) {
                if (!document.getElementsByClassName) {
                    if (document.querySelectorAll(key))
                    {
                        for(var i in document.querySelectorAll(key)) {
                        document.querySelectorAll(key)[i].innerHTML = document.querySelectorAll(key)[i].innerHTML + val;
                        }
                    }
                } else {
                if (document.getElementsByClassName(key))
                    {
                        for(var i in document.getElementsByClassName(key)) {
                        document.getElementsByClassName(key)[i].innerHTML = document.getElementsByClassName(key)[i].innerHTML + val;
                        }
                    }
                }
            });
            $.each(data.cButton, function(key_f, val_f){
               Game.cButton(val_f.id, val_f.text, eval(val_f.view), val_f.className, val_f.before, eval(val_f.event), val_f.top, val_f.right, val_f.bottom, val_f.left);
            });
            
             $.each(data.cText, function(key_f, val_f){
               Game.cText(val_f.id, val_f.text, eval(val_f.view), val_f.className, val_f.before, eval(val_f.event), val_f.top, val_f.right, val_f.bottom, val_f.left);
            });
            
          });
    },
    /**
     * Build Game field
     * @property {array} pointsData Generated bricks data
     * @function
     * @name build
     * @memberOf Game
     */
    build: function() {
         
           Game.getShake(); // shake (SPACE)
           Game.getSlide(); // slide it (A - bal, D - jobb)
           Game.loadFx(); // Effect loading
           stopper.start();
           stopper.printTime();
        
        pointsData =[];
        $.getJSON('data/levels.json', function(levelData) { 
            //console.log(levelData);
            if (!levelData[GameLevel]) {
                //Game end
                Game.completeLevel("end");
                return false;
            }
            if (winWIDTH > winHEIGHT) {
                boxColumns = levelData[GameLevel].columns;
                boxRows = levelData[GameLevel].rows;
                bW = Math.floor(winWIDTH / boxColumns)-1;
                bH = Math.floor((winHEIGHT-60) / boxRows)-1;
            } else {
                boxColumns = levelData[GameLevel].rows;
                boxRows = levelData[GameLevel].columns;
                bW = Math.floor(winWIDTH / boxColumns)-1;
                bH = Math.floor((winHEIGHT-60) / boxRows)-1;
            }
            
            
            
            if (bW > bH) {
                bW = bH;
            }
            if (bW < bH) {
                bH = bW;
            }
            boxWIDTH = bW*boxColumns;
            boxHEIGHT = bH*boxRows;
            $("#main-id").css({width: boxWIDTH+"px", height: boxHEIGHT+"px"});
           
        
        
        if (document.getElementById("back")) {
            document.getElementById("back").parentNode.removeChild(document.getElementById("back"));
        }

       
            var b = document.createElement("canvas");
            b.id="back";
            b.width = bW*boxColumns;
            b.height = bH*boxRows;
            main.appendChild(b);
            
                document.getElementById("back").addEventListener("touchstart", handleStart, false);
                document.getElementById("back").addEventListener("touchmove", handleMove, true);
                document.getElementById("back").addEventListener("touchend", handleEnd, false);

                document.getElementById("back").addEventListener("mousemove", handleMove, false);
                document.getElementById("back").addEventListener("mousedown", handleStart, false);
                document.getElementById("back").addEventListener("mouseup", handleEnd, false);
    
                var lBtn = document.createElement("a");
                lBtn.id = "leftRotate";
                lBtn.className = "btn btn-info visible-md visible-lg";
                lBtn.style.position = "absolute";
                lBtn.style.top = "60px";
                lBtn.style.left = "10px";
                lBtn.innerHTML = "<i class='fa fa-mail-reply'></i>";
                document.body.appendChild(lBtn);
                
                var lBtn = document.createElement("a");
                lBtn.id = "rightRotate";
                lBtn.className = "btn btn-info visible-md visible-lg";
                lBtn.style.position = "absolute";
                lBtn.style.top = "140px";
                lBtn.style.left = "10px";
                lBtn.innerHTML = "<i class='fa fa-mail-forward'></i>";
                document.body.appendChild(lBtn);
                
                var lBtn = document.createElement("a");
                lBtn.id = "shake";
                lBtn.className = "btn btn-info visible-md visible-lg";
                lBtn.style.position = "absolute";
                lBtn.style.top = "100px";
                lBtn.style.left = "10px";
                lBtn.innerHTML = "<i class='fa fa-flash'></i>";
                document.body.appendChild(lBtn);
                
                document.getElementById("leftRotate").addEventListener("click", function(){Game.goSlide("left");}, false);
                document.getElementById("rightRotate").addEventListener("click", function(){Game.goSlide("right");}, false);
                document.getElementById("shake").addEventListener("click",  function() { info("Yepp bricks are mixed <i class='fa fa-smile-o'></i>"); Game.setRandomBricks();}, false);
    
      for (var y = 0; y < boxRows; y++)
        {  
        for (var x = 0; x < boxColumns; x++)
            {
               pointsData.push({id: x+"_"+y, x: x*bW, y: y*bH, width: bW, height: bH, borderWidth: 2, color: colorCodes[Math.floor(Math.random()*4)], clear: false});
            }
        }
        Game.cBrick(pointsData[0]);

        for(var c in pointsData) {
            Game.cBrick(pointsData[c]);
        }

       /**
        * Mouse button up and touch end event
        * @param {object} ev DOM element
        * @function
        * @memberOf build
        */
        function handleEnd(ev){
            var back = document.getElementById("back");
            var b = back.getContext("2d");
            var evX,evY;
            var box = {};
            
		evX = ev.pageX-$("#main-id").offset().left;
		evY = ev.pageY-$("#main-id").offset().top;
                box.x = (Math.floor(evX/bW));
                box.y = (Math.floor(evY/bH));
                
            Game.mouseDown = false;
           
            if (selectedArray.length > 2) {
                //FX
                Game.playFX("5");
                
                //point counting
                var db, combo, timeNow;
                    db = selectedArray.length; 
                    combo = false;
                        if (db > 3) combo = true;
                    timeNow = new Date().getTime();
                
                Game.setPoint(db, combo, timeNow);
                
                //remove from array
                
                for (var i = 0; i < pointsData.length;i++) {
                    log(pointsData[i].id, true);
                    for (var o in selectedArray) {
                        //console.log(selectedArray);
                        if (selectedArray[o] && pointsData[i]) {
                            if(selectedArray[o].id === pointsData[i].id && selectedArray[o].color === pointsData[i].color) {
                                pointsData.splice(i, 1);
                                
                            }
                        }
                        
                    }
                }

                Game.goAnimate() 
                
                if (GameType === "sos") {
                    Game.generateNewBricks();
                }
                

            } else {
                for (var r = 0; r < selectedArray.length; r++) {
                    Game.reDraw(selectedArray[r]);
                }
            }
            
            
        }
        /**
        * Mouse button down and touch start event
        * @param {object} ev DOM element
        * @function
        * @memberOf build
        */
        function handleStart(ev){
                selectedArray = [];
                var back = document.getElementById("back");
                var b = back.getContext("2d"); 
                
		Game.mouseDown = true;
		var evX,evY;
		evX = ev.pageX-$("#main-id").offset().left;
		evY = ev.pageY-$("#main-id").offset().top;

                var box = {};
                var oldID;
                
		box.x = (Math.floor(evX/bW));
                box.y = (Math.floor(evY/bH));
                
                for (var c in pointsData) {
                    if (box.x*bW === pointsData[c].x && box.y*bH === pointsData[c].y) {
                        Game.touchDraw(pointsData[c]);
                        selectedArray.push(pointsData[c]);
                    }
                }
                
		   
	}
        
        /**
        * Mouse move and touch move
        * @param {object} ev DOM element
        * @function
        * @memberOf build
        */
        function handleMove(ev){
           ev.preventDefault();
            var isSelected = -1;
            
            var evX,evY;
		evX = ev.pageX-$("#main-id").offset().left;
		evY = ev.pageY-$("#main-id").offset().top;
    
            var box = {};
		box.x = (Math.floor(evX/bW));
                box.y = (Math.floor(evY/bH));
                
                
                
		if (Game.mouseDown && box) {
                    for (var s in selectedArray) {
                        if (box.x*bW === selectedArray[s].x && box.y*bH === selectedArray[s].y) {
                            isSelected = s;
                        }
                    }
                    
                    if (isSelected === -1) {
                        //console.log(selectedArray[0]);
                        
                        for (var c in pointsData) {
                            if (box.x*bW === pointsData[c].x && box.y*bH === pointsData[c].y && selectedArray[0].color === pointsData[c].color
                        && ((selectedArray[selectedArray.length-1].x === box.x*bW && (( selectedArray[selectedArray.length-1].y === (box.y*bH)-bH) || selectedArray[selectedArray.length-1].y === (box.y*bH)+bH)) 
                        || ((selectedArray[selectedArray.length-1].y === box.y*bW && (( selectedArray[selectedArray.length-1].x === (box.x*bW)-bW) || selectedArray[selectedArray.length-1].x === (box.x*bW)+bW))) ) ) {
                                Game.touchDraw(pointsData[c]);
                                selectedArray.push(pointsData[c]);
                                //console.log(selectedArray);
                            }
                        }
                    }
                }
          
	}
        
       
       });
      
    },
    /**
     * Create new brick in the empty place
     * @function
     * @memberOf Game
     */
    generateNewBricks: function() {
         for (var a = 0; a < boxColumns; a++)
                {
                    for (var b = 0; b < boxRows; b++)
                    {  
                        if (Game.getBrick({x: a, y: b}) === false) {
                            pointsData.unshift({id: a+"_"+b, x: a*bW, y: b*bH, width: bW, height: bH, borderWidth: 2, color: colorCodes[Math.floor(Math.random()*4)], clear: false});
                            Game.cBrick(pointsData[0]);
                        }
                    }
                }
    },
    /**
     * Handle mobile shake or space button
     * @function
     * @memberOf Game
     */
    getShake: function() {
         window.addEventListener("keyup", function(evt) {
             if (evt.keyCode === 32) {
                info("Yepp bricks are mixed <i class='icon-smile></i>'");
                Game.setRandomBricks();
              }
        }, false);
            
        
        if (window.DeviceMotionEvent === undefined) {
            return false;
        }
        var sensitivity = 20;

        // Position variables
        var x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0;

        // Listen to motion events and update the position
        window.addEventListener('devicemotion', function (e) {
            x1 = e.accelerationIncludingGravity.x;
            y1 = e.accelerationIncludingGravity.y;
            z1 = e.accelerationIncludingGravity.z;
        }, false);

        // Periodically check the position and fire
        // if the change is greater than the sensitivity
        setInterval(function () {
            var change = Math.abs(x1-x2+y1-y2+z1-z2);

            if (change > sensitivity) {
                info("<h3>Yepp, bricks are mixed...</h3>");
                Game.setRandomBricks();
            }

            // Update new position
            x2 = x1;
            y2 = y1;
            z2 = z1;
        }, 150);
        return false;
    },
    /**
     * Mobile accelerometer event or A and D button event
     * @function
     * @memberOf Game
     * @returns {Boolean}
     */
    getSlide: function() {
        window.addEventListener("keyup", function(evt) {
             if (evt.keyCode === 65) {
                info("<h3>Bal </h3>");
                    Game.goSlide("left");
              }
              
              if (evt.keyCode === 68) {
                info("<h3>Jobb </h3>");
                    Game.goSlide("right");
              }
        }, false);
        
        if (window.DeviceMotionEvent === undefined) {
            return false;
        }
        
        var sensitivity = 20;

        // Position variables
        var y1 = 0, y2 = 0;
        
         window.addEventListener('devicemotion', function (e) {
            y1 = e.accelerationIncludingGravity.x;
        }, false);
        
         setInterval(function () {
            var change = Math.round(y1);

                if (change > 5) {
                    info("<h3>Right </h3>");
                    Game.goSlide("right");
                }
                if (change < -5) {
                    info("<h3>Left </h3>");
                    Game.goSlide("left");
                }
                
            

            // Update new position
            y2 = y1;
        }, 150);
        return false;
        
    },
    /**
     * Set game point by hidden bricks
     * @param {string|number} db numbers of hided bricks
     * @param {boolean} combo was more than 3
     * @param {string|number} time unix timestamp
     * @function
     * @memberOf Game
     */
    setPoint: function(db, combo, time) {
        if (!document.getElementById("scoreCount")) {
            var score = document.getElementById("score");
        var s = document.createElement("span");
            s.id = "scoreCount";
            s.innerHTML = "0";
        score.appendChild(s);
        }
        if (combo) db = db * 10;
        GameScore = GameScore + Math.floor(db-(10000/(time-GameStartTime)/3600));
        document.getElementById("scoreCount").innerHTML = GameScore;
        
        
    },
    /**
     * Animate bricks
     * @param {object} rect
     * @param {string} startTime
     * @param {string} way
     */
    animate: function(rect, startTime, way) {
        var back = document.getElementById("back");
        var b = back.getContext("2d");
        // update
        var time = (new Date()).getTime() - startTime;
        var gravity = 980;
        //if (rect.clear === false) return false;
        //console.log(rect.id);
        // clear
        b.clearRect(rect.x, rect.y, bW, bH);
        // draw stuff
        if (!way || way === "down") {
            rect.y =rect.y+bH;
        }
        if (way === "right") {
            rect.x =rect.x+bW;
        }
        if (way === "left") {
            rect.x =rect.x-bW;
        }
        //rect.clear = false;
        Game.cBrick(rect);
        // request new frame
        rect.id = rect.x/bW+"_"+rect.y/bH;
    },
    /**
     * 
     */
    goAnimate: function() {
        
        for(var c = 0; c < selectedArray.length; c++) {
            Game.clearBrick(selectedArray[c]);
        }
        selectedArray =[];
        
        var ret = false;
                
                for (var a = 0; a < boxColumns; a++)
                {
                    for (var b = 0; b < boxRows-1; b++)
                    {  
                        var bot = {x: a, y: b};
                        var bt2 = {x: a, y: b+1};
                        if (Game.getBrick(bot) !== false && Game.getBrick(bt2) === false) {
                                Game.animate(Game.getBrick(bot)); 
                                ret = true;
                        } 
                    }
                }
                if(ret===true) Game.goAnimate();
    },
    /**
     * 
     * @param {type} rect
     */
    clearBrick: function(rect) {
        var back = document.getElementById("back");
        var b = back.getContext("2d");
        // clear
        //console.log(rect);
        b.clearRect(rect.x, rect.y, bW, bH); 
        
        for (var c = 0; c < pointsData.length; c++) {
            if (pointsData[c].x === rect.x && pointsData[c].y === rect.y) {
                pointsData.splice(c, 1);
            }
        }
    },
    /**
     * 
     * @param {type} coords
     * @returns {Boolean}
     */
    getBrick: function(coords) {
        //console.log(coords);
        
        var pos = false;
        if (coords.x*bW >= 0 && coords.y*bH >= 0 && coords.x*bW < boxColumns*bW && coords.y*bH < boxRows*bH) {
            
            for (var p in pointsData) {
                if (pointsData[p].x === coords.x*bW && pointsData[p].y === coords.y*bH) {
                  pos = pointsData[p];  
                }   
            }   
        }
        return pos;
    },
    /**
     * 
     */
    setRandomBricks: function() {
        var back = document.getElementById("back");
        var b = back.getContext("2d");
        b.clearRect(0, 0, boxColumns*bW, boxRows*bH); 
        
        //keverés
        Game.shuffleArray(pointsData);
        for(var c in pointsData) {
            Game.cBrick(pointsData[c]);
        }
    },
    /**
     * 
     * @param {type} angle
     */
    goSlide: function(angle){
        
        if (typeof angle === 'object' ) return false;
        
        var ret = false;
        if (angle === "right") {
            for (var a = 0; a < boxColumns-1; a++)
                {
                    for (var b = 0; b < boxRows; b++)
                    {  
                        var rot = {x: a, y: b};
                        var rt2 = {x: a+1, y: b};
                        var sTime = (new Date()).getTime();
                        if (Game.getBrick(rot) !== false && Game.getBrick(rt2) === false) {
                                Game.animate(Game.getBrick(rot), sTime, "right"); 
                                ret = true;
                        } 
                    }
                }
                if (ret === true) Game.goSlide("right");
        } else {
            for (var a = 1; a < boxColumns; a++)
                {
                    for (var b = 0; b < boxRows; b++)
                    {  
                        var lot = {x: a, y: b};
                        var lt2 = {x: a-1, y: b};
                        var sTime = (new Date()).getTime();
                        if (Game.getBrick(lot) !== false && Game.getBrick(lt2) === false) {
                                Game.animate(Game.getBrick(lot), sTime, "left"); 
                                ret = true;
                        } 
                    }
                }
                if (ret === true) Game.goSlide("left");
        }
    },
    /**
     * 
     * @param {type} array
     * @returns {array}
     */
    shuffleArray: function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i].color;
            array[i].color = array[j].color;
            array[j].color = temp;
        }
        return array;
    },
    /**
     * 
     * @param {type} ev
     */
    nextLevel: function(ev) {
        log('');
        GameLevel++;
        Game.build();
        console.log(GameLevel);
        $("#complete").addClass("hidden");
    },
    /**
     * 
     */
    completeLevel: function() {
        emptyArray(donesData);
        
        pointsData = [];
        var cl = document.createElement("div");
        cl.className = "palette palette-wisteria";
        cl.style.left = "20%";
        cl.style.top = "20%";
        cl.innerHTML='<h2>You completed '+GameLevel+'. Level</h2>';
        cl.innerHTML+='<p>Congratulation!</p> <br/>';
        var b = document.createElement("button");
        b.className = "btn btn-large btn-block btn-info";
        b.innerHTML = 'Next level <span class="glyphicon glyphicon-chevron-right"></span>';
        if (!b.addEventListener) {
            b.attachEvent('onclick', Game.nextLevel);
        } else {
            b.addEventListener('click', Game.nextLevel, true);
        }
        
        
        cl.appendChild(b);
        document.getElementById("complete").appendChild(cl);
        $("#complete").removeClass("hidden");
    },
    /**
     * 
     * @param {type} brickData
     */
    cBrick: function(brickData){
        var back = document.getElementById("back").getContext("2d");
                back.beginPath();
                back.lineWidth="1";
                back.strokeStyle="white";
                back.rect(brickData.x,brickData.y,bW,bH);
                back.fillStyle=brickData.color;
                back.id = brickData.color;
                back.fill();
                back.stroke();
                back.closePath();
    },
    /**
     * 
     * @param {type} brickData
     */
    reDraw: function(brickData){
        var back = document.getElementById("back").getContext("2d");
                back.beginPath();
                back.lineWidth="1";
                back.strokeStyle="white";
                back.rect(brickData.x,brickData.y,bW,bH);
                back.fillStyle=brickData.color;
                back.id = brickData.color;
                back.fill();
                back.stroke();
                back.closePath();
    },
    /**
     * 
     * @param {object} brickData
     */
    touchDraw: function(brickData){
        var back = document.getElementById("back").getContext("2d");
                back.beginPath();
                back.lineWidth="1";
                back.strokeStyle="white";
                back.rect(brickData.x,brickData.y,bW,bH);
                back.fillStyle="#cccccc";
                back.id = brickData.color;
                back.fill();
                back.stroke();
                back.closePath();
    },
    /**
     * 
     * @param {type} id
     * @param {type} text
     * @param {type} parent
     * @param {type} className
     * @param {type} before
     * @param {type} eventName
     * @param {type} top
     * @param {type} right
     * @param {type} bottom
     * @param {type} left
     */
    cButton: function(id, text, parent,className, before,eventName, top, right, bottom, left){
        var newButton = (parent.id === "navigation")?document.createElement('a'):document.createElement('button');
        
          newButton.id = id;
          newButton.innerHTML = text;
          
          
          if (left!=="") { newButton.style.left = left; }
          if (top!=="") { newButton.style.top = top; }
		  if (bottom!=="") { newButton.style.bottom = bottom; }
		  if (right!=="") { newButton.style.right = right; }
          
          newButton.style.zIndex = "97";
          if (className) { newButton.className = className; }
          if (eventName) { 
              if (!newButton.addEventListener) {
                    newButton.attachEvent("click", eventName); 
                } else {
                    newButton.addEventListener("click", eventName, false); 
                }
              
          }
          
          if (before) {
              parent.insertBefore(newButton, parent.firstChild);
            } else { 
                
                if(parent.id === "navigation") {
                    newButton.style.position ="absolute";
                    var l = document.createElement("li");
                    l.appendChild(newButton);
                    
                    parent.appendChild(l);
                } else {
                    parent.appendChild(newButton);
                }
              
          }
    },
    /**
     * 
     * @param {type} id
     * @param {type} text
     * @param {type} parent
     * @param {type} className
     * @param {type} before
     * @param {type} tagName
     * @param {type} top
     * @param {type} right
     * @param {type} bottom
     * @param {type} left
     */
    cText: function(id, text, parent,className, before,tagName, top, right, bottom, left){
        var newText = document.createElement('h2');
          newText.id = id;
          newText.innerHTML = text;
          newText.style.position = "absolute";
          
          if (left!=="") { newText.style.left = left; }
          if (top!=="") { newText.style.top = top; }
		  if (bottom!=="") { newText.style.bottom = bottom; }
		  if (right!=="") { newText.style.right = right; }
          
          newText.style.zIndex = "97";
          if (className) { newText.className = className; }
          
          if (before) {
              parent.insertBefore(newText, parent.firstChild);
            } else { 
              parent.appendChild(newText);
          }
    },
    /**
     * 
     * @returns {object}
     */
    html5_audio: function(){
	var a = document.createElement('audio');
	return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
    },
    /**
     * 
     */
    loadFx: function() {
        
        if(Game.html5_audio()) play_html5_audio = true;
        if(play_html5_audio){
                
		
	}else{
		$("#sound").remove();
		sound = $("<embed id='sound' type='audio/mpeg' />");
		sound.attr('src', effects[fx]);
		sound.attr('loop', false);
		sound.attr('hidden', true);
		sound.attr('autostart', true);
		$('body').append(sound);
	}
    },
    /**
     * 
     * @param {type} fx
     */
    playFX: function(fx){
        var effects = {
            1: "fx/fx1.mp3", 
            2: "fx/fx2.mp3", 
            3: "fx/fx3.mp3",
            4: "fx/fx4.mp3", 
            5: "fx/fx5.mp3",
            6: "fx/fx6.mp3"
        };
        
        var newSnd, timeSnd;
        timeSnd = new Date();
        newSnd = fx+timeSnd.getTime();
        playEffect[newSnd] = new Audio(effects[fx]);
        playEffect[newSnd].playbackRate.value = 5;
        playEffect[newSnd].onended = function(){delete playEffect[newSnd]};
        playEffect[newSnd].play();
       
       
    },
    /**
     * 
     * @param {type} e
     */
    getInfo: function(e) {
        info(" [SPACE] button mixed the bricks<br/>the [A] button to  slide left and [D] button to slide right the bricks! <br/> The aim is  you have to frame one line the bricks which them disappear. More points is more brick in one line at time.<br/> Good game!'");
    },
    /**
     * 
     * @param {type} e
     */
    goView: function(e) {
        //console.log(e.target.innerHTML);
        
        switch(e.target.id) {
            case 'goPlay':
                parent.style.marginLeft = -(winWIDTH)+"px";
                GameType = e.target.innerHTML.toString().toLowerCase();
                Game.build();
            break;
            case 'goHome':
                parent.style.marginLeft = "0px";
            break;
            case 'goSettings':
                parent.style.marginLeft = -(2*winWIDTH)+"px"; 
            break;
        };
        
        parent.className = "container-div gameView";
        
        //parent.style.marginLeft = -(2*winWIDTH)+"px";
    }
};

       function info(text) {
           $("#modalBodyContent").html(text);
           $("#modalDiv").modal("show");
       }
    

 
