/*
✔ = Complete  ⚠ = Partial  ✖ = Incomplete
INTENDED FEATURES:

3 TYPES
⚠ Static (including full-screen and multiview)
✖ Overlap
✖ Fade

SPECS (STATIC)
⚠ Can define page size and show however many fit or 
    define number to show and resize dynamically
✖ Can be all equal size or have an emphasized center slide
✖ Size falloff: center is biggest, and all side slides
    continually get smaller by set percentage

SPECS (OVERLAP)
✖ Left subtype
✖ Right subtype
✖ Both subtype
✖ Can have a parallax effect

SPECS (FADE)
✖  Can move and fade simultaneously

HAS AUTOSCROLL
✔ Scrolls over an interval
✔ Pauses on interaction or hover
✔ Can go either direction

HTML
✔ Can be auto-genned
✖ Can be custom
✔ Includes default styles
✖ Can overwrite or create new styles
✖ When not autogenning, classes can be specified to use
   instead of the default class names

PAGES
✔ Can be as simple as an image URL
✖ Support for interactive pages
✖ Can define HTML and CSS per page for interactivity
✔ Transition timings can be custom
✖ Supports as few as 2 pages

SWIPE
✔ User can swipe to advance pages
✔ User can swipe past the edge and experience resistance
✔ A page always shows

BUBBLES
✖ Show current and available pages
✖ Entirely customizable
✖ Can be enabled/disabled

MISC
✔ User interactions can be throttled
✔ Keys can be used to navigate
✖ Scrolling through pages with bubbles is smooth
⚠ Responsive
✖ Can have multiple carousels in a single page with object constructors
⚠ Any relevant setting has a default, but can be overridden
✖ Unique class names
✖ Adding a new carousel appends without using innerHTML
✖ Errors are thrown when using incorrect settings for the type

RESPONSIVENESS
✖ Can be vertical
✖ Multiple breakpoints and value sets can be specified

EXTRA
✖ Presets for carousel visuals
✖ Presets for bubble visuals
✖ Which keys to include in navigation can be specified

RELEASES
-  Each release has a full file and a .min file
-  Replace variables names with extremely short versions and letters where possible
-  Create a gitignored key file to easily replace variable names
*/

//? IDEAS:
/*
- Unique class names can be achieved through storing instances in an array, and using the array index in the names
   - Alternatively, an incremental integer value can be stored in each Carousel, placed as a this. value
*/

//! KNOWN ISSUES:
/*

*/

// To do:
/*

*/

class Roundabout {
	constructor(settings) {
		// User defined (commented out = not used yet)

      this.pages = settings.pages ? settings.pages : {};
      this.id = settings.id ? settings.id : ".myCarousel";
		this.type = settings.type ? settings.type : "normal";
		// this.subtype = (settings.subtype) ? settings.subtype : 0;
		this.parent = settings.parent ? settings.parent : "body";
		this.autoGenHTML = (settings.autoGenHTML === false) ? settings.autoGenHTML : true;
		this.autoGenCSS = (settings.autoGenCSS === false) ? settings.autoGenCSS : true;
		// this.navigation = (settings.navigation == false) ? settings.navigation : true;
		this.autoScroll = settings.autoScroll ? settings.autoScroll : false;
		this.autoScroll_speed = settings.autoScroll_speed ? settings.autoScroll_speed : 5000;
		this.autoScroll_timeout = settings.autoScroll_timeout ? settings.autoScroll_timeout : 15000;
		this.autoScroll_pauseOnHover = settings.autoScroll_pauseOnHover ? settings.autoScroll_pauseOnHover : false;
		this.autoScroll_startAfter = settings.autoScroll_startAfter ? settings.autoScroll_startAfter : 5000;
		this.autoScroll_direction = settings.autoScroll_direction ? settings.autoScroll_direction : "right";
		this.transition = (settings.transition != undefined) ? settings.transition : 300;
		this.transition_timingFunction = settings.transition_timingFunction ? settings.transition_timingFunction : "ease";
		this.throttle = (settings.throttle === false) ? settings.throttle : true;
		this.throttle_timeout = settings.throttle_timeout ? settings.throttle_timeout : 300;
		this.throttle_matchTransition = settings.throttle_matchTransition ? settings.throttle_matchTransition : false;
		this.throttle_keys = (settings.throttle_keys === false) ? settings.throttle_keys : true;
		this.throttle_swipe = (settings.throttle_swipe === false) ? settings.throttle_swipe : true;
		this.throttle_buttons = (settings.throttle_buttons === false) ? settings.throttle_buttons : true;
		// this.throttle_navigation = settings.throttle_navigation == false ? settings.throttle_navigation : true;
		this.keys = (settings.keys === false) ? settings.keys : true;
		this.infinite = (settings.infinite === false) ? settings.infinite : true;
		this.swipe = (settings.swipe === false) ? settings.swipe : true;
		this.swipe_threshold = settings.swipe_threshold ? settings.swipe_threshold : 300;
		this.swipe_multiplier = settings.swipe_multiplier ? settings.swipe_multiplier : 1;
		this.swipe_resistance = (settings.swipe_resistance != undefined) ? settings.swipe_resistance : 0.95;
		// this.rtl = (settings.rtl) ? settings.rtl : false;

		this.static_showPages = settings.static_showPages ? settings.static_showPages : 1;
		this.static_enlargeCenter = settings.static_enlargeCenter ? settings.static_enlargeCenter : 100;
		this.static_sizeFalloff = settings.static_sizeFalloff ? settings.static_sizeFalloff : 0;
		this.static_pageSpacing = settings.static_pageSpacing ? settings.static_pageSpacing : 0;
		this.static_pageSpacingUnits = settings.static_pageSpacingUnits ? settings.static_pageSpacingUnits : "px";
		this.static_spacingMode = settings.static_spacingMode ? settings.static_spacingMode : "fill";

		// this.overlap_direction = (settings.overlap_direction) ? settings.overlap_direction : 0;

		// this.fade_offsetIn = (settings.fade_offsetIn) ? settings.fade_offsetIn : 20;
		// this.fade_offsetOut = (settings.fade_offsetOut) ? settings.fade_offsetOut : -20;
		// this.fade_offsetUnits = (settings.fade_offsetUnits) ? settings.fade_offsetUnits : "px";

		this.mobile = settings.mobile ? settings.mobile : {swipe_threshold: 50};
      this.mobile_breakpoint = settings.mobile_breakpoint ? settings.mobile_breakpoint : 700;
      

		// this.val = settings.val ? settings.val : default;
		// this.val = (settings.val === false) ? settings.val : true;
		// this.val = settings.val ? settings.val : false;

		// Private

		// general
		this.orderedPages = [];
		// this.orderedPositions = [];
		this.positions = [];
		this.orderedPagesMainIndex = 0;
		this.scrollIsAllowed = true;
      this.onPage = 0;
      this.allowInternalStyles = true;
      this.leftSidePages = 0;
		// swipe
		this.sx = 0;
		this.sy = 0;
		this.ex = 0;
		this.ey = 0;
		this.dx = 0;
		this.x = 0;
		this.y = 0;
		this.lastMove = null;
		this.t = false;
		this.dragging = false;
		this.canSnap = false;
		this.swipeFrom = 0;
		this.swipeIsAllowed = true;
		// autoscroll
		this.scrollTimeoutHolder = null;
		this.scrollIntervalHolder = null;
		// bound functions
		this.boundFollow = null;
		this.boundEnd = null;
		this.boundCancel = null;

		// Function calls
		this.initialActions();
		this.replaceWithMobile();
		this.setListeners();
		this.debug_output();
	}

	/*
   ==================================================================================================================
   
   SCROLLING

   ==================================================================================================================
   */

	// Scrolls right. Does not handle actual clicks
	scrollRight(valuesOnly = false) {
		if (
			(this.onPage >= this.pages.length - this.static_showPages && !this.infinite) ||
			(this.onPage >= this.pages.length - this.static_showPages && !this.infinite && this.type == "normal")
		) {
			return;
		} else {
			this.positions.unshift(this.positions.pop());
			if (!valuesOnly) {
				for (let a = 0; a < this.pages.length; a++) {
               document.querySelector(".carousel-page-" + a).style.left = this.positions[a];
               // document.querySelector(".carousel-page-" + a).classList.add("carousel-page-has-transition");
               // document.querySelector(".carousel-page-" + a).classList.remove("carousel-page-has-no-transition");
				}
         }

			let currentMoving = this.orderedPages[0];
			document.querySelector(".carousel-page-" + currentMoving).classList.add("carousel-page-has-no-transition");
         document.querySelector(".carousel-page-" + currentMoving).classList.remove("carousel-page-has-transition");
         
			setTimeout(() => {
            if (!valuesOnly) {
					document.querySelector(".carousel-page-" + currentMoving).classList.remove("carousel-page-has-no-transition");
					document.querySelector(".carousel-page-" + currentMoving).classList.add("carousel-page-has-transition");
				}
			}, this.transition);
			this.onPage++;
			this.orderedPages.push(this.orderedPages.shift());
			if (valuesOnly) {
				document
					.querySelector(".carousel-page-" + this.orderedPages[this.orderedPagesMainIndex + 1])
					.classList.add("carousel-page-has-no-transition");
				document
					.querySelector(".carousel-page-" + this.orderedPages[this.orderedPagesMainIndex + 1])
					.classList.remove("carousel-page-has-transition");
			} else {
            document
               .querySelector(".carousel-page-" + this.orderedPages[this.leftSidePages + this.static_showPages])
					.classList.add("carousel-page-has-transition");
				document
					.querySelector(".carousel-page-" + this.orderedPages[this.leftSidePages + this.static_showPages])
					.classList.remove("carousel-page-has-no-transition");
			}
      } 
	}

	// Scrolls left. Does not handle actual clicks
	scrollLeft(valuesOnly = false) {
		if (this.onPage <= 0 && !this.infinite) {
			return;
		} else {
			this.positions.push(this.positions.shift());
			if (!valuesOnly) {
				for (let a = 0; a < this.pages.length; a++) {
					document.querySelector(".carousel-page-" + a).style.left = this.positions[a];
				}
         }
         
         let currentMoving = this.orderedPages[this.orderedPages.length - 1];
			document.querySelector(".carousel-page-" + currentMoving).classList.add("carousel-page-has-no-transition");
         document.querySelector(".carousel-page-" + currentMoving).classList.remove("carousel-page-has-transition");

			setTimeout(() => {
				if (!valuesOnly) {
					document.querySelector(".carousel-page-" + currentMoving).classList.remove("carousel-page-has-no-transition");
					document.querySelector(".carousel-page-" + currentMoving).classList.add("carousel-page-has-transition");
				}
			}, this.transition);
			this.onPage--;
			this.orderedPages.unshift(this.orderedPages.pop());
			if (valuesOnly) {
				document
					.querySelector(".carousel-page-" + this.orderedPages[this.orderedPagesMainIndex - 1])
					.classList.add("carousel-page-has-no-transition");
				document
					.querySelector(".carousel-page-" + this.orderedPages[this.orderedPagesMainIndex - 1])
					.classList.remove("carousel-page-has-transition");
			} else {
            document
               .querySelector(".carousel-page-" + this.orderedPages[this.leftSidePages - 1])
					.classList.add("carousel-page-has-transition");
				document
					.querySelector(".carousel-page-" + this.orderedPages[this.leftSidePages - 1])
					.classList.remove("carousel-page-has-no-transition");
			}
		}
	}

	/*
   ==================================================================================================================
   
   AUTOSCROLL

   ==================================================================================================================
   */

	// On user interaction, this is called to pause scrolling until user is presumably done
	resetScrollTimeout() {
		clearTimeout(this.scrollTimeoutHolder);
		clearInterval(this.scrollIntervalHolder);
		this.scrollTimeoutHolder = setTimeout(() => {
			this.setAutoScroll(this);
		}, this.autoScroll_timeout);
	}

	// Initializes autoscroll if enabled
	setAutoScroll(parent, firstTime = false) {
		if (firstTime && parent.autoScroll) {
			setTimeout(() => {
				parent.scrollAuto(parent);
				parent.scrollIntervalHolder = setInterval(() => {
					parent.scrollAuto(parent);
				}, parent.autoScroll_speed);
			}, parent.autoScroll_startAfter);
		} else if (parent.autoScroll) {
			parent.scrollIntervalHolder = setInterval(() => {
				parent.scrollAuto(parent);
			}, parent.autoScroll_speed);
		}
	}

	// Called at each interval, determines how to scroll
	scrollAuto(parent) {
		if (parent.autoScroll_direction.toLowerCase() == "left" && parent.scrollIsAllowed) {
			parent.scrollLeft();
		} else if (parent.autoScroll_direction.toLowerCase() == "right" && parent.scrollIsAllowed) {
			parent.scrollRight();
		}
	}

	/*
   ==================================================================================================================

   SWIPING

   ==================================================================================================================
   */

	// starts the touch if the user has a touchscreen
	setTouch(event, parent) {
		event.preventDefault();
		parent.t = true;
		parent.tStart(event, parent);
	}

	// called once when touch or click starts
	tStart(event, parent) {
		// throttling
		parent.resetScrollTimeout();
		if (parent.throttle_swipe) {
			if (parent.swipeIsAllowed) {
				if (parent.throttle) {
					parent.swipeIsAllowed = false;
					setTimeout(() => {
						parent.swipeIsAllowed = true;
					}, parent.throttle_timeout);
				}
			} else {
				return;
			}
		}

		event.preventDefault();
		parent.dragging = true;
		parent.swipeFrom = parent.orderedPages[parent.orderedPagesMainIndex];

		// remove transitions to prevent elastic-y movement         
      for (let a = 0; a < parent.pages.length; a++) {
         document.querySelector(".carousel-page-" + a).classList.remove("carousel-page-has-transition");
         document.querySelector(".carousel-page-" + a).classList.add("carousel-page-has-no-transition");
      }

		// log the first touch position
		parent.lastMove = event.touches;
		if (parent.t) {
			parent.x = event.touches[0].clientX;
			parent.y = event.touches[0].clientY;
			parent.sx = event.touches[0].clientX;
			parent.sy = event.touches[0].clientY;
		} else {
			parent.x = event.clientX;
			parent.y = event.clientY;

			parent.sx = event.clientX;
			parent.sy = event.clientY;
		}

		document.addEventListener("mousemove", parent.boundFollow, false);
		document.addEventListener("mouseup", parent.boundEnd, false);

		if (parent.t) {
			document.addEventListener("touchmove", parent.boundFollow, false);
			document.addEventListener("touchend", parent.boundEnd, false);
			document.addEventListener("touchcancel", parent.boundCancel, false);
		}
	}

	// called repeatedly while dragging
	follow(event, parent) {
		if (parent.dragging) {
			// capture movements
			if (parent.t) {
				parent.x = event.changedTouches[0].clientX;
				parent.y = event.changedTouches[0].clientY;
			} else {
				parent.x = event.clientX;
				parent.y = event.clientY;
			}

			parent.dx = (parent.x - parent.sx) * parent.swipe_multiplier;

			// resistant scrolling
			if (Math.abs(parent.dx) < document.querySelector(parent.parent).offsetWidth && parent.infinite) {
				parent.dx = (parent.x - parent.sx) * parent.swipe_multiplier;
			} else if (parent.dx < 0) {
				if (parent.infinite) {
					parent.dx -= (parent.dx + document.querySelector(parent.parent).offsetWidth) * parent.swipe_resistance;
				} else if (parent.pages.length - parent.static_showPages == parent.onPage) {
					if (parent.swipe_resistance == 1) {
						parent.dx = 0;
					} else {
						parent.dx -= parent.dx * parent.swipe_resistance;
					}
				}
			} else if (parent.dx > 0) {
				if (parent.infinite) {
					parent.dx -= (parent.dx - document.querySelector(parent.parent).offsetWidth) * parent.swipe_resistance;
				} else if (parent.orderedPages[parent.orderedPagesMainIndex] === 0) {
					if (parent.swipe_resistance == 1) {
						parent.dx = 0;
					} else {
						parent.dx -= parent.dx * parent.swipe_resistance;
					}
				}
			}

			// get distance values
			let dist = Math.abs(parent.dx);

			// if user has swiped far enough, allow movement to next slide
			if (dist >= parent.swipe_threshold) {
				parent.canSnap = true;
			} else {
				parent.canSnap = false;
         }
         
         let totalSize = document.querySelector(".carousel-page-" + parent.orderedPages[parent.orderedPagesMainIndex]).offsetWidth + parent.static_pageSpacing;

			if (dist >= totalSize) {
				if (parent.dx > 0) {
					parent.scrollLeft(true);
				} else if (parent.dx < 0) {
					parent.scrollRight(true);
				}
				parent.sx = parent.x / 1;
				parent.dx = 0;
         } else {
            // sets the position of all necessary pages
            for (let a = 0; a < parent.static_showPages + 2; a++) {
               let pos = a + parent.leftSidePages - 1;
               document.querySelector(".carousel-page-" + parent.orderedPages[pos]).style.left = "calc((" + parent.positions[parent.orderedPages[pos]] + ") + " + parent.dx + "px)";
            }
			}
		}
	}

	// called once when the touch or click ends
	tEnd(event, parent) {
      for (let a = 0; a <= parent.static_showPages + 2; a++) {
         let pos = a + parent.leftSidePages - 1;
         if (!document.querySelector(".carousel-page-" + parent.orderedPages[pos]).classList.contains("carousel-page-has-transition")) {
            document.querySelector(".carousel-page-" + parent.orderedPages[pos]).classList.add("carousel-page-has-transition");
			   document.querySelector(".carousel-page-" + parent.orderedPages[pos]).classList.remove("carousel-page-has-no-transition");
         }
      }
		parent.dragging = false;

		// log the end of touch position
		if (parent.t) {
			parent.ex = event.changedTouches[0].clientX;
			parent.ey = event.changedTouches[0].clientY;
		} else {
			parent.ex = event.clientX;
			parent.ey = event.clientY;
		}

		// snap the page to the correct position, and reset for next swipe
		parent.snap(parent.canSnap, parent.dx, parent);
		parent.resetSwipeVars(parent);

		document.removeEventListener("mousemove", parent.boundFollow, false);
		document.removeEventListener("mouseup", parent.boundEnd, false);

		document.removeEventListener("touchmove", parent.boundFollow, false);
		document.removeEventListener("touchend", parent.boundEnd, false);
		document.removeEventListener("touchcancel", parent.boundCancel, false);
	}

	// handle touch cancel
	tCancel(event, parent) {
		event.preventDefault();
		document.removeEventListener(
			"mouseup",
			(event) => {
				parent.tEnd(event, parent);
			},
			false
		);
		document.removeEventListener(
			"touchend",
			(event) => {
				parent.tEnd(event, parent);
			},
			false
		);
		document.removeEventListener(
			"touchcancel",
			(event) => {
				parent.tCancel(event, parent);
			},
			false
		);
	}

	// snap to a new slide once touch or drag ends
	snap(al, dir, parent) {
		if (al) {
			if (dir > 0) {
				parent.leftPressed(parent);
			} else if (dir < 0) {
				parent.rightPressed(parent);
			}
		}
      
      for (let a = 0; a < parent.pages.length; a++) {
			document.querySelector(".carousel-page-" + a).style.left = parent.positions[a];
		}
	}

	// reset all variables to defaults to avoid strange movements when a new touch starts
	resetSwipeVars(parent) {
		parent.sx = 0;
		parent.sy = 0;
		parent.ex = 0;
		parent.ey = 0;
		parent.x = 0;
		parent.y = 0;
		parent.dx = 0;
		parent.lastMove = [];
		parent.t = false;
		parent.canSnap = false;
	}

	// These remain bound to the constructor object, assisting in circumventing 'this' scope issues
	execMM(event) {
		this.follow(event, this);
	}
	execMU(event) {
		this.tEnd(event, this);
	}
	execTC(event) {
		this.tCancel(event, this);
	}

	/*
   ==================================================================================================================
   
   DEFAULT FUNCTIONS

   ==================================================================================================================
   */

	// Generates the default HTML structure
   defaultHTML() {
      let newCarousel = document.createElement("DIV");
      let html = `<div class="carousel-swipe-overlay"></div><div class="carousel-page-wrap"></div></div><div class="carousel-nav"><div class="btn-r nav-btn"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg></div><div class="btn-l nav-btn"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg></div><div class="radio-btn-wrap"><div class="radio-btn rbtn-0"></div><div class="radio-btn rbtn-1"></div><div class="radio-btn rbtn-2"></div></div></div>`;
      newCarousel.innerHTML = html;
      newCarousel.classList.add("carousel-html-place-holder");
      if (this.id.split("")[0] == "#") {
         let newId = this.id.split("");
         newId.shift();
         newId = newId.join("");
         newCarousel.setAttribute("id", newId);
      } else {
         let newClass = this.id.split("");
         newClass.shift();
         newClass = newClass.join("");
         newCarousel.classList.add(newClass);
      }
		document.querySelector(this.parent).appendChild(newCarousel);
	}

	// Generates the default CSS styling
	defaultCSS() {
		let css = `.carousel-wrap,.carousel-wrap .carousel-nav .nav-btn svg{position:absolute;left:0;right:0;top:0;bottom:0;margin:auto}.carousel-wrap .carousel-nav .radio-btn-wrap{position:absolute;left:0;right:0;margin:auto}.carousel-wrap .carousel-nav .nav-btn{position:absolute;top:0;bottom:0;margin:auto}.carousel-wrap{height:calc(100% - 50px);width:100%}.carousel-wrap .carousel-nav{height:100%;width:100%}.carousel-wrap .carousel-nav .nav-btn{height:80px;width:80px;cursor:pointer;color:white;}.carousel-wrap .carousel-nav .nav-btn svg{height:70px}.carousel-wrap .carousel-nav .btn-l{left:0px}.carousel-wrap .carousel-nav .btn-r{right:0px}.carousel-wrap .carousel-nav .radio-btn-wrap{display:flex;justify-content:space-evenly;bottom:0;height:40px;width:25%}.carousel-wrap .carousel-nav .radio-btn-wrap .radio-btn{border-radius:100%;border:2px solid #fff;height:15px;width:15px;align-self:center;cursor:pointer} .carousel-page-wrap{width:100%;height:100%;overflow:hidden;position:absolute;} .carousel-swipe-overlay{width:calc(100% - 140px);height:calc(100% - 40px);top:0;left:0;right:0;position:absolute;margin:auto;z-index:2} .carousel-page {position:absolute;}`;
		//
		let newStyle = document.createElement("STYLE");
		newStyle.setAttribute("type", "text/css");
		newStyle.innerHTML = css;
		document.getElementsByTagName("head")[0].appendChild(newStyle);
	}

	// Generates the required CSS. Seperate from default styling
	internalCSS() {
		let css = `.carousel-page-has-transition{transition:${
			this.transition / 1000
		}s; transition-timing-function:${
			this.transition_timingFunction
		}} .carousel-page-has-no-transition{transition:0s;} .carousel-error-message {position:relative;margin: auto;left: 0;right: 0;top: 0;bottom: 0;border-radius:5px;border:3px solid black;background: white;
      text-align:center;font-family:sans-serif;width:30%;}`;
		let newStyle = document.createElement("STYLE");
		newStyle.setAttribute("type", "text/css");
		newStyle.innerHTML = css;
		document.getElementsByTagName("head")[0].appendChild(newStyle);
	}

	/*
   ==================================================================================================================

   GENERAL FUNCTIONS
   
   ==================================================================================================================
   */

	// Create each new page from the this.pages array and append to the parent element
	generatePages() {
      this.leftSidePages = Math.floor((this.pages.length - this.static_showPages) / 2);
		let baseHeight = 100;
		for (let a = 0; a < this.pages.length; a++) {
			let newPage = document.createElement("DIV");
			newPage.classList.add("carousel-page-" + a, "carousel-page", "carousel-page-has-transition");
			let newPos;
			if (this.type == "normal") {
				// Set width and positions based on mode: calculated to accomodate spacing and #pages
				if (this.static_spacingMode == "evenly") {
					let pageWidth =
						"calc((100% - " +
						(this.static_showPages + 1) * this.static_pageSpacing +
						this.static_pageSpacingUnits +
						")/" +
						this.static_showPages +
						")";
					newPage.style.width = pageWidth;
					newPos =
						"calc((((100% - " +
						(this.static_showPages + 1) * this.static_pageSpacing +
						this.static_pageSpacingUnits +
						") / " +
						this.static_showPages +
						") * " +
						(a - this.leftSidePages) +
						") + " +
						(this.static_pageSpacing * (a - this.leftSidePages + 1) + this.static_pageSpacingUnits) +
						")";
				} else {
					let pageWidth =
						"calc((100% - " +
						(this.static_showPages - 1) * this.static_pageSpacing +
						this.static_pageSpacingUnits +
						") / " +
						this.static_showPages +
						")";
					newPage.style.width = pageWidth;
					newPos =
						"calc((((100% - " +
						(this.static_showPages - 1) * this.static_pageSpacing +
						this.static_pageSpacingUnits +
						") / " +
						this.static_showPages +
						") * " +
						(a - this.leftSidePages) +
						") + " +
						(this.static_pageSpacing * (a - this.leftSidePages) + this.static_pageSpacingUnits) +
						")";
				}
			} else {
				newPage.style.width = "100%";
			}
			// Create falloff //! not working
			if (this.static_sizeFalloff && this.type == "normal") {
				newPage.style.height = baseHeight + "%";
				baseHeight -= this.static_sizeFalloff;
				newPage.style.top = "0";
				newPage.style.bottom = "0";
				newPage.style.margin = "auto";
			} else {
				newPage.style.height = "100%";
			}
			// Give a background image (if supplied)
			if (this.pages[a].background_image) {
				newPage.style.background = "url(" + this.pages[a].background_image + ")";
				newPage.style.backgroundSize = "cover";
				newPage.style.backgroundPosition = "center center";
			}
			document.querySelector(".carousel-page-wrap").appendChild(newPage);
			this.orderedPages.push(a);
			this.positions.push(newPos);
		}

		this.orderedPagesMainIndex = this.leftSidePages / 1;

		// Alter the positional arrays as necessary
		for (let b = 1; b <= this.leftSidePages; b++) {
			this.orderedPages.unshift(this.orderedPages.pop());
			if (b > 0) {
				this.positions.push(this.positions.shift());
			}
		}

		// position each page
		for (let c = 0; c < this.positions.length; c++) {
			document.querySelector(".carousel-page-" + c).style.left = this.positions[c];
		}
	}

	// If mobile replacement values are provided, the defaults are overridden when the screen is assumed to be that of a mobile
	replaceWithMobile() {
		if (screen.width <= this.mobile_breakpoint) {
			let c = Object.entries(this);
			let cm = Object.entries(this.mobile);
			for (let a = 0; a < obj_length(this.mobile); a++) {
				for (let b = 0; b < obj_length(this); b++) {
					if (c[b][0] == cm[a][0]) {
						this["" + c[b][0]] = cm[a][1];
					}
				}
			}
		}
	}

	// Runs through applicable settings and takes actions based on them. Mostly to reduce constructor clutter
	initialActions() {
		if (this.allowInternalStyles) {
			this.internalCSS();
		}
		if (this.checkForErrors()) {
			if (this.autoGenHTML) {
				this.defaultHTML();
			}
			if (this.autoGenCSS && this.allowInternalStyles) {
				this.defaultCSS();
			}
			if (this.throttle_matchTransition) {
				this.throttle_timeout = this.transition;
			}
			if (this.autoScroll) {
				this.setAutoScroll(this, true);
			}
			this.generatePages();
			this.boundFollow = this.execMM.bind(this);
			this.boundEnd = this.execMU.bind(this);
			this.boundCancel = this.execTC.bind(this);
			if (this.type == "normal") {
				this.swipe_threshold /= this.static_showPages;
			}
		}
	}

	// Sets all required eventListeners for the carousel
	setListeners() {
		document.querySelector(".btn-r").addEventListener("click", () => {
			this.rightPressed(this);
		});
		document.querySelector(".btn-l").addEventListener("click", () => {
			this.leftPressed(this);
		});
		if (this.keys) {
			document.addEventListener("keydown", (event) => {
				switch (event.key) {
					case "ArrowLeft":
						this.leftPressed(this, true);
						break;
					case "ArrowRight":
						this.rightPressed(this, true);
						break;
				}
			});
		}
		if (this.autoScroll_pauseOnHover) {
			document.querySelector(this.parent).addEventListener("mouseover", () => {
				this.scrollIsAllowed = false;
			});
			document.querySelector(this.parent).addEventListener("mouseout", () => {
				this.scrollIsAllowed = true;
				this.resetScrollTimeout();
			});
		}
		if (this.swipe) {
			document.querySelector(".carousel-swipe-overlay").addEventListener(
				"mousedown",
				(event) => {
					this.tStart(event, this);
				},
				false
			);
			document.querySelector(".carousel-swipe-overlay").addEventListener(
				"touchstart",
				(event) => {
					this.setTouch(event, this);
				},
				false
			);
		}
	}

	// prevents breakage by providing constraints and displaying an error message
	checkForErrors() {
		if (this.pages.length - this.static_showPages <= 1) {
			this.displayError(
				"For the number of pages supplied, there are too many being shown. There must be at least 2 fewer pages shown than the number of pages."
			);
			return false;
      }
      if (this.id.split("")[0] !== "#" && this.id.split("")[0] !== ".") {
         this.displayError(
            "An invalid selector prefix was given for the parent. Valid selector prefixes are '#' for IDs or '.' for classes."
         );
         return false;
      }
         
		return true;
	}

   // creates error message box
	displayError(message, title = "Error:") {
		let em = document.createElement("DIV");
		em.classList.add("carousel-error-message");
		let t = document.createElement("SPAN");
		t.innerHTML = title;
		t.style.color = "red";
      t.style.fontWeight = "bold";
      em.appendChild(t);
      let m = document.createElement("SPAN");
      m.innerHTML = message;
      let lb = document.createElement("BR");
      em.appendChild(lb);
      em.appendChild(m);
		document.querySelector(this.parent).appendChild(em);
	}

	debug_output() {
		console.log(this.orderedPages);
	}
}

Roundabout.prototype.rightPressed = function (parent, isKey) {
	parent.resetScrollTimeout();
	if (parent.scrollIsAllowed && !parent.dragging) {
		parent.scrollRight();
		if ((parent.throttle && parent.throttle_buttons && !isKey) || (parent.throttle && parent.throttle_keys && isKey)) {
			parent.scrollIsAllowed = false;
			setTimeout(() => {
				parent.scrollIsAllowed = true;
			}, parent.throttle_timeout);
		}
	}
};

Roundabout.prototype.leftPressed = function (parent, isKey) {
	parent.resetScrollTimeout();
	if (parent.scrollIsAllowed && !parent.dragging) {
		parent.scrollLeft();
		if ((parent.throttle && parent.throttle_buttons && !isKey) || (parent.throttle && parent.throttle_keys && isKey)) {
			parent.scrollIsAllowed = false;
			setTimeout(() => {
				parent.scrollIsAllowed = true;
			}, parent.throttle_timeout);
		}
	}
};

// ASSISTIVE FUNCTIONS

function obj_length(obj) {
	if (typeof obj !== "object") {
		return "INVALID PARAMETERS";
	}
	let length = 0;
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			length++;
		}
	}
	return length;
}