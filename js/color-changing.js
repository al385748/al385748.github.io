var c = document.getElementById("c");
var ctx = c.getContext("2d");
var cH;
var cW;
var bgColor = "#000000";
var animations = [];
var circles = [];

var isDrawing = false;
var circleTransitionWorking = false;
var isSelectable = false;

var purpleColor = "#7d45bc";
var yellowColor = "#ffd012";
var lightGrayColor = "#ebebeb";
var darkGrayColor = "#2b2b2b";

var currentCircleColor = [darkGrayColor, darkGrayColor];

var ga = 1;
var timerId = 3;

var colorPicker = (function() {
  var colors = ["#363636", "#FFD012"];
  var index = 0;
  function next() {
    index = index++ < colors.length-1 ? index : 0;
    return colors[index];
  }
  function current() {
    return colors[index]
  }
  return {
    next: next,
    current: current
  }
})();

var currentColor = colorPicker.current();
var nextColor = colorPicker.next();

function removeAnimation(animation) {
  if(isDrawing){
    var index = animations.indexOf(animation);
    if (index > -1) animations.splice(index, 1);

    enableNewScene(newScene);
    fadeOut();
  }
}

function calcPageFillRadius(x, y) {
  var l = Math.max(x - 0, cW - x);
  var h = Math.max(y - 0, cH - y);
  return Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2));
}

function addClickListeners() {
  document.addEventListener("touchend", handleEvent);
  document.addEventListener("mousedown", handleEvent);
  document.addEventListener("mouseout", function(e) {
    e = e ? e : window.event;
    var from = e.relatedTarget || e.toElement;
    if (!from || from.nodeName == "HTML") {
      document.getElementById("outer-mouse").style.border = "2px solid #ffffff00";
      document.getElementById("inner-mouse").style.backgroundColor = "#ffffff00";
    }
});
  document.addEventListener("mouseenter", function(e) {
    if(bgColor == yellowColor || bgColor == lightGrayColor){
      document.getElementById("outer-mouse").style.border = "2px solid #000";
      document.getElementById("inner-mouse").style.backgroundColor = "#000";
    }
    else{
      document.getElementById("outer-mouse").style.border = "2px solid #ffffff";
      document.getElementById("inner-mouse").style.backgroundColor = "#ffffff";
    }
  })
};

function handleEvent(e) {

    if(!circleTransitionWorking && !isSelectable){
    setTimeout(function () {

      if(buttonTouch){
        if (e.touches) { 
          e.preventDefault();
          e = e.touches[0];
        }
        circleTransitionWorking = true;

        //setTimeout(function () { circleTransitionWorking = false; console.log("ya no está workeando por si aca") }, 1000);
        
        var targetR = calcPageFillRadius(e.pageX, e.pageY);
        var rippleSize = Math.min(200, (cW * .4));
        var minCoverDuration = 750;
        isDrawing = true;

          var pageFill = new Circle({
            x: e.pageX,
            y: e.pageY,
            r: 0,
            fill: currentCircleColor
          });

        if(currentScene == "intro"){

          var fillAnimation = anime({
            targets: pageFill,
            r: targetR,
            duration:  Math.max(targetR / 2 , minCoverDuration ),
            easing: "easeOutQuart",
            complete: function(){
              bgColor = pageFill.fill;
              removeAnimation(fillAnimation);
              isDrawing = false;
              circleTransitionWorking = false;
              isSelectable = false;
            }
          });
        }

        else{

          var fillAnimation = anime({
            targets: pageFill,
            r: targetR,
            duration:  Math.max(targetR / 2 , minCoverDuration ),
            direction: "reverse",
            easing: "easeOutQuart",
            complete: function(){
              bgColor = pageFill.fill;
              removeAnimation(fillAnimation);
              isDrawing = false;
              circleTransitionWorking = false;
              isSelectable = false;
            }
          });
        }
        
        var ripple = new Circle({
          x: e.pageX,
          y: e.pageY,
          r: 0,
          fill: currentColor,
          stroke: {
            width: 3,
            color: currentColor
          },
          opacity: 1
        });
        var rippleAnimation = anime({
          targets: ripple,
          r: rippleSize,
          opacity: 0,
          easing: "easeOutExpo",
          duration: 900,
          complete: removeAnimation
        });

        
        var particles = [];
        for (var i=0; i<32; i++) {
          var particle = new Circle({
            x: e.pageX,
            y: e.pageY,
            fill: nonCurrentCircleColor()[randomIntFromInterval(0,1)],
            r: anime.random(24/devicePixelRatio, 48/devicePixelRatio)
          })
          particles.push(particle);
        }
        var particlesAnimation = anime({
          targets: particles,
          x: function(particle){
            return particle.x + anime.random(rippleSize, -rippleSize);
          },
          y: function(particle){
            return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
          },
          r: 0,
          easing: "easeOutExpo",
          duration: anime.random(1000,1300),
          complete: removeAnimation
        });
        animations.push(fillAnimation, rippleAnimation, particlesAnimation);
      
      }  
    }, 250);
  }
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function nonCurrentCircleColor(){
  if (currentCircleColor == yellowColor) return [darkGrayColor, darkGrayColor];
  if (currentCircleColor == lightGrayColor) return [purpleColor, yellowColor];
  if (currentCircleColor == purpleColor) return [lightGrayColor, lightGrayColor];
  else return [yellowColor, yellowColor];
}

function extend(a, b){
  for(var key in b) {
    if(b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
  return a;
}

var Circle = function(opts) {
  extend(this, opts);
}

Circle.prototype.draw = function() {
  if(isDrawing) ctx.globalAlpha = this.opacity || 1;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  if (this.stroke) {
    ctx.strokeStyle = this.stroke.color;
    ctx.lineWidth = this.stroke.width;
    ctx.stroke();
  }
  if (this.fill) {
    ctx.fillStyle = this.fill;
    ctx.fill();
  }
  ctx.closePath();
}

function animateCircle(){

  if(anyTransitionWorking && !circleTransitionWorking){

    circleTransitionWorking = true;
  
    var animate = anime({
      duration: Infinity,
      update: function() {
        ctx.fillStyle = bgColor;
        if(currentScene != "intro")ctx.fillRect(0, 0, cW, cH);
        animations.forEach(function(anim) {
          anim.animatables.forEach(function(animatable) {
            animatable.target.draw();
          });
        });
      },
      complete: function() {circleTransitionWorking = false; console.log("YEEE")
    }
  });

  }

}

var auxBorderValue = 2;
var zoomIn = true;
var borderZoomWorking = false;

function animateNonButtonParticles(){

  if(!borderZoomWorking && !anyTransitionWorking){
      recursiveNonButtonParticles();
  }
}

function recursiveNonButtonParticles(){

  if(!buttonTouch){
    if (auxBorderValue < 5 && zoomIn){
      borderZoomWorking = true;
        setTimeout(function(){
          auxBorderValue++;
          document.getElementById("outer-mouse").style.border = auxBorderValue + "px solid #FFF";

          recursiveNonButtonParticles();
        }, 50);

    }
    else {
        if (auxBorderValue == 5) zoomIn = false;
        if (auxBorderValue > 2){

          setTimeout(function(){
            document.getElementById("outer-mouse").style.border = --auxBorderValue + "px solid #FFF";

            recursiveNonButtonParticles();
          }, 50);
      }

      if(auxBorderValue <= 2 && !zoomIn){
        //RESET
        auxBorderValue = 2;
        zoomIn = true;
        borderZoomWorking = false;

      }
    }
  }
  if(buttonTouch)	document.getElementById("outer-mouse").style.border = "2px solid #000";
}

var resizeCanvas = function() {
  cW = window.innerWidth;
  cH = window.innerHeight;
  c.width = cW * devicePixelRatio; // Clear
  c.height = cH * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  console.log("resized");
  ctx.globalAlpha = 0.0;
};

(function init() {
  resizeCanvas();
  if (window.CP) {
    // CodePen's loop detection was causin' problems
    // and I have no idea why, so...
    window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 6000; 
  }
  window.addEventListener("resize", resizeCanvas);

  window.addEventListener("hashchange", function(e) {
    if(e.oldURL.length > e.newURL.length){
        if(currentScene != "intro"){
          document.getElementById(currentScene).click();
        }
    }
   });

  //window.addEventListener("touchmove", function() { e.preventDefault(); }, { passive:false });
  //window.addEventListener("touchstart", function() { e.preventDefault(); }, { passive:false });
  addClickListeners();
  if (!!window.location.pathname.match(/fullcpgrid/)) {
    //startFauxClicking();
  }
  handleInactiveUser();
})();

function handleInactiveUser() {
  var inactive = setTimeout(function(){
    //fauxClick(cW/2, cH/2);
  }, 2000);
  
  function clearInactiveTimeout() {
    clearTimeout(inactive);
    document.removeEventListener("mousedown", clearInactiveTimeout);
    document.removeEventListener("touchend", clearInactiveTimeout);
  }
  
  document.addEventListener("mousedown", clearInactiveTimeout);
  document.addEventListener("touchend", clearInactiveTimeout);
}

function startFauxClicking() {
  setTimeout(function(){
    fauxClick(anime.random( cW * .2, cW * .8), anime.random(cH * .2, cH * .8));
    startFauxClicking();
  }, anime.random(200, 900));
}

function fauxClick(x, y) {
  //var fauxClick = new Event("mousedown");
  fauxClick.pageX = x;
  fauxClick.pageY = y;
  document.dispatchEvent(fauxClick);
}

function fadeOut()
{
    animations = [];

    ctx.clearRect(0, 0, c.width, c.height);
    ctx.globalAlpha -= 0.01;

    if(currentScene == "intro") ctx.fillStyle = "#000000";
    else ctx.fillStyle = currentCircleColor;

    ctx.fillRect(0, 0, cW, cH);

    if (ctx.globalAlpha > 0.01)
    {       
      setTimeout(fadeOut, timerId)
      return;
    }
    else{
      ctx.globalAlpha = 0;
      document.getElementById("c").style.pointerEvents = 'none';
      if(currentScene == "intro") buttonTouch = false;

      anyTransitionWorking = false;
      circleTransitionWorking = false;
    } 
}

function clickOnSelectableObject(){
  isSelectable = true;

  setTimeout(function(){
    isSelectable = false;
  }, 500);
}

function secondClickOnGrid(){
  isSelectable = false;
}

function makeSelectable(){
  isSelectable = true;
}