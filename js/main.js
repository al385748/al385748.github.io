/** 
 * ===================================================================
 * main js
 *
 * ------------------------------------------------------------------- 
 */ 

var currentScene = "intro";
var newScene = "";

var anyTransitionWorking = false;
var buttonTouch = false;

document.getElementById("c").style.pointerEvents = 'none';

(function($) {

	"use strict";

	/*---------------------------------------------------- */
	/* Preloader
	------------------------------------------------------ */ 
   $(window).load(function() {

      // will first fade out the loading animation 
    	$("#loader").fadeOut("slow", function(){

        // will fade out the whole DIV that covers the website.
        $("#preloader").delay(300).fadeOut("slow");

		screen.orientation.lock('landscape');

		function waxon_tm_cursor(){

			var myCursor	= jQuery('.mouse-cursor');
		
			if(myCursor.length){
				if ($("body")) {
				const e = document.querySelector(".cursor-inner"),
					t = document.querySelector(".cursor-outer");
				let n, i = 0,
					o = !1;
				window.onmousemove = function (s) {
					o || (t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)"), e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)", n = s.clientY, i = s.clientX
				}, $("body").on("mouseenter", "data, .cursor-pointer", function () {
					e.classList.add("cursor-hover"), t.classList.add("cursor-hover")
				}), $("body").on("mouseleave", "data, .cursor-pointer", function () {
					$(this).is("img") && $(this).closest(".cursor-pointer").length || (e.classList.remove("cursor-hover"), t.classList.remove("cursor-hover"))
				}), e.style.visibility = "visible", t.style.visibility = "visible"
			}
			}
		};

		document.body.style.cursor = 'none';
		waxon_tm_cursor();
		
		$('img').on('dragstart', function(event) { event.preventDefault(); });

      });       

  	})


  	/*---------------------------------------------------- */
  	/* FitText Settings
  	------------------------------------------------------ */
  	setTimeout(function() {

   	$('#intro h1').fitText(1, { minFontSize: '42px', maxFontSize: '84px' });

  	}, 100);


	/*---------------------------------------------------- */
	/* FitVids
	------------------------------------------------------ */ 
  	$(".fluid-video-wrapper").fitVids();


	/*---------------------------------------------------- */
	/* Owl Carousel
	------------------------------------------------------ */ 
	$("#owl-slider").owlCarousel({
        navigation: false,
        pagination: true,
        itemsCustom : [
	        [0, 1],
	        [700, 2],
	        [960, 3]
	     ],
        navigationText: false
    });


	/*----------------------------------------------------- */
	/* Alert Boxes
  	------------------------------------------------------- */
	$('.alert-box').on('click', '.close', function() {
	  $(this).parent().fadeOut(500);
	});	


	/*----------------------------------------------------- */
	/* Stat Counter
  	------------------------------------------------------- */
   var statSection = $("#stats"),
       stats = $(".stat-count");

   statSection.waypoint({

   	handler: function(direction) {

      	if (direction === "down") {       		

			   stats.each(function () {
				   var $this = $(this);

				   $({ Counter: 0 }).animate({ Counter: $this.text() }, {
				   	duration: 4000,
				   	easing: 'swing',
				   	step: function (curValue) {
				      	$this.text(Math.ceil(curValue));
				    	}
				  	});
				});

       	} 

       	// trigger once only
       	this.destroy();      	

		},
			
		offset: "90%"
	
	});	


	/*---------------------------------------------------- */
	/*	Masonry
	------------------------------------------------------ */
	var containerProjects = $('#folio-wrapper');

	containerProjects.imagesLoaded( function() {

		containerProjects.masonry( {		  
		  	itemSelector: '.folio-item',
		  	resize: true 
		});

	});


	/*----------------------------------------------------*/
	/*	Modal Popup
	------------------------------------------------------*/
   $('.item-wrap a').magnificPopup({

      type:'inline',
      fixedContentPos: false,
      removalDelay: 300,
      showCloseBtn: false,
      mainClass: 'mfp-fade',
	  closeOnBgClick: false,
	  enableEscapeKey: false
   });

   $(document).on('click', '.popup-modal-dismiss', function (e) {
   		e.preventDefault();
		secondClickOnGrid();
   		$.magnificPopup.close();
	});

	
	/*-----------------------------------------------------*/
  	/* Navigation Menu
   ------------------------------------------------------ */  
   var toggleButton = $('.menu-toggle'),
       nav = $('.main-navigation');

   // toggle button
   toggleButton.on('click', function(e) {

		e.preventDefault();
		toggleButton.toggleClass('is-clicked');
		nav.slideToggle();
	});

   // nav items
  	nav.find('li a').on("click", function() {   

   	// update the toggle button 		
   	toggleButton.toggleClass('is-clicked'); 
   	// fadeout the navigation panel
   	nav.fadeOut();   		
   	     
  	});


   /*---------------------------------------------------- */
  	/* Highlight the current section in the navigation bar
  	------------------------------------------------------ */
	var sections = $("section"),
	navigation_links = $("#main-nav-wrap li a");	

	sections.waypoint( {

       handler: function(direction) {

		   var active_section;

			active_section = $('section#' + this.element.id);

			if (direction === "up") active_section = active_section.prev();

			var active_link = $('#main-nav-wrap a[href="#' + active_section.attr("id") + '"]');			

         navigation_links.parent().removeClass("current");
			active_link.parent().addClass("current");

		}, 

		offset: '25%'
	});


	/*---------------------------------------------------- */
  	/* Smooth Scrolling
  	$('.smoothscroll').on('click', function (e) {
	 	
	 	e.preventDefault();

   	var target = this.hash,
    	$target = $(target);

    	$('html, body').stop().animate({
       	'scrollTop': $target.offset().top
      }, 800, 'swing', function () {
      	window.location.hash = target;
      });

  	});  
  
  	------------------------------------------------------ */

   /*---------------------------------------------------- */
	/*  Placeholder Plugin Settings
	------------------------------------------------------ */ 
	$('input, textarea, select').placeholder()  


  	/*---------------------------------------------------- */
	/*	contact form
	------------------------------------------------------ */

	/* local validation */
	$('#contactForm').validate({

		/* submit via ajax 
		submitHandler: function(form) {

			var sLoader = $('#submit-loader');

			$.ajax({      	

		      type: "POST",
		      url: "inc/sendEmail.php",
		      data: $(form).serialize(),
		      beforeSend: function() { 

		      	sLoader.fadeIn(); 

		      },
		      success: function(msg) {

	            // Message was sent
	            if (msg == 'Your email has been sent correctly :)') {
	            	sLoader.fadeOut(); 
	               $('#message-warning').hide();
	               $('#contactForm').fadeOut();
	               $('#message-success').fadeIn();   
	            }
	            // There was an error
	            else {
	            	sLoader.fadeOut(); 
	               $('#message-warning').html(msg);
		            $('#message-warning').fadeIn();
	            }

		      },
		      error: function() {

		      	sLoader.fadeOut(); 
		      	$('#message-warning').html("Something went wrong. Please try again.");
		         $('#message-warning').fadeIn();

		      }
			  
	      });     		
  		}
		*/
	});

 	/*----------------------------------------------------- */
  	/* Back to top
   ------------------------------------------------------- */ 
	var pxShow = 300; // height on which the button will show
	var fadeInTime = 400; // how slow/fast you want the button to show
	var fadeOutTime = 400; // how slow/fast you want the button to hide
	var scrollSpeed = 300; // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'

   // Show or hide the sticky footer button
	jQuery(window).scroll(function() {

		if (!( $("#header-search").hasClass('is-visible'))) {

			if (jQuery(window).scrollTop() >= pxShow) {
				jQuery("#go-top").fadeIn(fadeInTime);

			} else {
				jQuery("#go-top").fadeOut(fadeOutTime);
			}

		}		

	});	

})(jQuery);

function goFullscreen(){
	if (!document.fullscreenElement) {
		document.documentElement.requestFullscreen();
	} else {
	  if (document.exitFullscreen) {
		document.exitFullscreen();
	  }
	}
}

function play_button_myload(){
	jQuery('.play-button-button').addClass('loaded');
	jQuery('.play-button-empty').addClass('loaded');
	
	setTimeout(function() {jQuery('#play-button').addClass('loaded')}, 200);
	goFullscreen();

	setTimeout(function() {
		var lockFunction =  window.screen.orientation.lock;
		if (lockFunction.call(window.screen.orientation, 'landscape')) {
				   console.log('Orientation locked')
				} else {
					console.error('There was a problem in locking the orientation')
				}
		}, 200);
}

/*
function disableOldScene(myCurrentScene, myNewScene){
	console.log(document.getElementById(myCurrentScene));
	document.getElementById(myCurrentScene).style.display = "none";
	console.log("AHORA LA CURRENT NO ES " + myCurrentScene + " SINO " + newScene)
	currentScene = myNewScene;
}
*/

function enableNewScene(myNewScene){
	if(myNewScene == null || myNewScene == "") myNewScene = "intro";
	if(myNewScene != "intro") document.getElementById(myNewScene).style.display = "block";
	console.log("PINTANDO " + myNewScene)
	currentScene = myNewScene;
}

function goToNewScreen(myNewScene){

	setTimeout(function () {

	if(myNewScene == "about") currentCircleColor = lightGrayColor;
	if(myNewScene == "skills") currentCircleColor = lightGrayColor;
	if(myNewScene == "services") currentCircleColor = lightGrayColor;
	if(myNewScene == "contact") currentCircleColor = lightGrayColor;
	if(myNewScene == "stats") currentCircleColor = lightGrayColor;
	if(myNewScene == "portfolio-unity") currentCircleColor = purpleColor;
	if(myNewScene == "portfolio-unreal") currentCircleColor = purpleColor;
	if(myNewScene == "portfolio-extra") currentCircleColor = purpleColor;
	if(myNewScene == "portfolio-filmmaking") currentCircleColor = yellowColor;
	if(myNewScene == "portfolio-journalism") currentCircleColor = yellowColor;
	if(myNewScene == "resume") currentCircleColor = lightGrayColor;

	document.getElementById("transition-color-screen").style.backgroundColor = currentCircleColor;

	if(!circleTransitionWorking && !anyTransitionWorking){
		anyTransitionWorking = true;
		buttonTouch = true;
		bgColor = "#00000000";
		animateCircle();
		
		if ($("body")) {
			const e = document.querySelector(".cursor-inner"),
				t = document.querySelector(".cursor-outer");
			$("body").is("a") && $("body").closest(".cursor-pointer").length || (e.classList.remove("cursor-hover"), t.classList.remove("cursor-hover"))
		}

		newScene = myNewScene;
		document.getElementById(newScene).style.opacity = "100%";

		if(currentCircleColor != purpleColor) blackMouse();
		else setTimeout(function() {whiteMouse()}, 10);
	}

	}, 100);
}

function disableAllButtons(){
	document.getElementById("goFullscreenButton").style.cursor = not-allowed;
	document.getElementById("goAboutButton").style.cursor = not-allowed;
}

function enableAllButtons(){
	document.getElementById("goFullscreenButton").disabled = false;
	document.getElementById("goAboutButton").disabled = false;
}

function endSceneTransition(value){
	document.getElementById("transition-color-screen").style.display = "block"
	if(value > 10){
		document.getElementById(currentScene).style.opacity = value + "%";
		setTimeout(function () {
			endSceneTransition(value - 10)
		}, 20);
	}
	else{
		document.getElementById("transition-color-screen").style.display = "none"

		setTimeout(function () {
			whiteMouse();
			//enableAllButtons();
		}, 500);
	} 

	console.log(value);
}

function returnHome(){

	if(!circleTransitionWorking && !isSelectable){

	setTimeout(function () {

		endSceneTransition(100);

		setTimeout(function () {

		bgColor = "#000000";
		animateCircle();

		if ($("body")) {
			const e = document.querySelector(".cursor-inner"),
				t = document.querySelector(".cursor-outer");
			$("body").is("a") && $("body").closest(".cursor-pointer").length || (e.classList.remove("cursor-hover"), t.classList.remove("cursor-hover"))
		}

		newScene = "intro";

		console.log("RETURNEANDO A CASITA " + newScene + " DESDE " + currentScene);
		document.getElementById(currentScene).style.display = "none";

		buttonTouch = false;
		}, 200);
	}, 100);
}
}

function forceReturnHome(){

	setTimeout(function () {

		endSceneTransition(100);

		setTimeout(function () {
			animateCircle();

			if ($("body")) {
				const e = document.querySelector(".cursor-inner"),
					t = document.querySelector(".cursor-outer");
				$("body").is("a") && $("body").closest(".cursor-pointer").length || (e.classList.remove("cursor-hover"), t.classList.remove("cursor-hover"))
			}

			newScene = "intro";

			console.log("RETURNEANDO A CASITA " + newScene + " DESDE " + currentScene);
			document.getElementById(currentScene).style.display = "none";

			buttonTouch = false;
			circleTransitionWorking = false;
			isSelectable = false;
		}, 400);
	}, 200);
}


function whiteMouse(){
	document.getElementById("outer-mouse").style.border = "2px solid #FFF";
	document.getElementById("inner-mouse").style.backgroundColor = "#FFF";
}

function blackMouse(){
	document.getElementById("outer-mouse").style.border = "2px solid #000";
	document.getElementById("inner-mouse").style.backgroundColor = "#000";
}

function downloadCV(){
	window.open("docs/CURRICULUM-VITAE.pdf");
}