/*
✔ = Complete  ⚠ = Partial  ✖ = Incomplete
INTENDED FEATURES:
TYPES
✔ Normal
✖ Fade
SPECS (NORMAL)
⚠ Can define page size and show however many fit or 
    define number to show and resize dynamically
SPECS (FADE)
✖ Can move and fade simultaneously
HAS AUTOSCROLL
✔ Scrolls over an interval
✔ Pauses on interaction or hover
✔ Can go either direction
PAGES
✔ Can be as simple as an image URL
✔ Support for interactive pages
✔ Can define HTML and CSS per page for interactivity
✔ Transition timings can be custom
✔ Supports as few as 2 pages
✔ Can scroll by a determined number of pages
SWIPE
✔ User can swipe to advance pages
✔ User can swipe past the edge and experience resistance
✔ A page always shows
✖ Inertia movement
BUBBLES
✔ Show current and available pages
✔ Entirely customizable
✔ Can be enabled/disabled
MISC
✔ User interactions can be throttled
✔ Keys can be used to navigate
✔ Scrolling through pages with bubbles is smooth
✔ Responsive
✔ Can have multiple carousels in a single page with object constructors
✔ Any relevant setting has a default, but can be overridden
✔ Unique class names
✔ Adding a new carousel appends without using innerHTML
RESPONSIVENESS
✖ Can be vertical
✔ Multiple breakpoints and value sets can be specified


//! KNOWN ISSUES:
/*
   
*/

//! DON'T FORGET TO UPDATE VERSION#

// To do:
/*
-  Mouse/touch swipe
*/

//? Ideas:
/*
-  Insert properties into pages array
   -  isLoaded
   -  position
-  For fade, replace in/out with class additions (might even work with system already in place)
*/

let roundabout = {
	on: -1,
	usedIds: [],
	overwritten: "no",

	defaults: {
		pages: [],
		breakpoints: [
			{
				width: 300,
				height: 0,
				swipeThreshold: 50,
			},
		],
		listenForResize: false,

		id: ".myCarousel",
		parent: "body",
		lazyLoad: "none",
		uiEnabled: true,

		type: "normal",
		infinite: true,
		keys: true,
		buttons: true,

		swipe: true,
		swipeThreshold: 300,
		swipeMultiplier: 1,
		swipeResistance: 0.95,
		swipeSnap: true,
		swipeSpeed: 1200,

		pagesToShow: 1,
		pageSpacing: 0,
		pageSpacingUnits: "px",
		pageSpacingMode: "fill",
		scrollBy: 1,
		showWrappedPage: false,

		transition: 300,
		transitionFunction: "ease",

		navigation: true,
		navigationTrim: true,
		navigationBehavior: "nearest",

		autoscroll: false,
		autoscrollSpeed: 5000,
		autoscrollTimeout: 15000,
		autoscrollPauseOnHover: false,
		autoscrollStartAfter: 5000,
		autoscrollDirection: "right",

		throttle: true,
		throttleTimeout: 300,
		throttleKeys: true,
		throttleSwipe: true,
		throttleButtons: true,
		throttleNavigation: true,

		nextHTML: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>`,
		prevHTML: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg>`,

		initOnly: false, // does not generate the carousel, but initializes all variables and functions
	},
};

class Roundabout {
	constructor(settings = roundabout.defaults) {
		if (!roundabout.overwritten || roundabout.overwritten != "no") {
			console.error(`Do not redefine the variable "roundabout". Roundabout requires this variable to store data across multiple carousels.`);
		}
		let s = Object.entries(settings);
		let d = Object.entries(roundabout.defaults);
		this.VERSION = "1.4.0-DEV";
		console.log(`Using version ${this.VERSION}`);

		for (let a = 0; a < d.length; a++) {
			let f = false;
			for (let b = 0; b < s.length; b++) {
				if (!roundabout.defaults.hasOwnProperty(s[b][0])) {
					throw `Error: Invalid Roundabout setting: "${s[b][0]}"`;
				}
				if (s[b][0].toString() == d[a][0].toString()) {
					this[s[b][0].toString()] = s[b][1];
					f = true;
					break;
				}
			}
			if (!f && roundabout.defaults.hasOwnProperty(d[a][0])) {
				this[d[a][0].toString()] = d[a][1];
			}
		}
		// Private

		// general
		this._orderedPages = [];
		this._positions = [];
		this._orderedPagesMainIndex = 0;
		this._scrollIsAllowed = true;
		this._onPage = 0;
		this._handledLoad = false;
		this._loadQueue = [];
		this._loadingPages = false;
		this._uniqueId = roundabout.on + 1;
		this._overriddenValues = [];
		this._currentBp = -2;
		this._atEnd = true;
		// internal
		this._allowInternalStyles = true;
		this._allowInternalHTML = true;
		// swipe
		this._sx = 0;
		this._ex = 0;
		this._dx = 0;
		this._x = 0;
		// this.y = 0;
		this._lastDx = 0;
		this._lastMove = null;
		this._t = false;
		this._dragging = false;
		this._canSnap = false;
		this._swipeFrom = 0;
		this._swipeIsAllowed = true;
		this._sts = 0;
		this._ste = 0;
		// autoscroll
		this._scrollTimeoutHolder = null;
		this._scrollIntervalHolder = null;
		this._scrollAfterTimeoutHolder = null;
		// bound functions
		this._boundFollow = null;
		this._boundEnd = null;
		this._boundCancel = null;
		// scripting helpers
		this._callbacks = {
         scroll: [],
         scrollEnd: [],
         dragStart: [],
         dragEnd: [],
         scrollNext: [],
         scrollPrevious: [],
      };
      
		// Function calls
		if (!this.initOnly) {
			this.initialActions();
			try {
				this.setBreakpoints();
			} catch (e) {
				console.error(`Error while attempting to set breakpoint values in Roundabout with id ${this.id}:`);
				console.error(e);
			}
			try {
				this.setListeners();
			} catch (e) {
				console.error(`Error while attempting to add event listeners to Roundabout with id ${this.id}:`);
				console.error(e);
			}
		}
	}

	/*
   ==================================================================================================================
   
   SCROLLING

   ==================================================================================================================
   */

	/*
   
   flusher:
   const flushCssBuffer = document.querySelector(`.roundabout-${this._uniqueId}-page-${a}`).offsetWidth;
   transition changes:
   - change transition
   - make style change
   - flush buffer
   - undo transition change   
   */

   scroll(distance, valuesOnly, overflow = 0) {
      this._callbacks.scroll.forEach(cb => {
         cb();
      });
		if (
			(distance > 0 && this._onPage >= this.pages.length - this.pagesToShow && !this.infinite && this.type == "normal") ||
			(distance < 0 && this._onPage <= 0 && !this.infinite && this.type == "normal")
		) {
			return;
		} else if (distance > 0 && distance > this.pages.length - this.pagesToShow - this._onPage && !this.infinite) {
			let remainingDistance = this.pages.length - this.pagesToShow - this._onPage;
			this.scroll(remainingDistance, valuesOnly, distance - remainingDistance);
		} else if (distance < 0 && Math.abs(distance) > this._onPage && !this.infinite) {
			let remainingDistance = -1 * this._onPage;
			this.scroll(remainingDistance, valuesOnly);
		} else {
			let wrapper = document.querySelector(`.roundabout-${this._uniqueId}-page-wrap`);

			// set up a position modifier array to mutate the normal right-based positioning
			let pos = [];
			if (distance > 0) {
				for (let a = 0; a < this._positions.length; a++) {
					pos.push(a);
            }
            this._callbacks.scrollNext.forEach(cb => {
               cb();
            });
			} else if (distance < 0) {
				for (let a = 0; a < this._positions.length; a++) {
					pos.push(a - Math.abs(distance) - 1);
            }
            this._callbacks.scrollPrevious.forEach(cb => {
               cb();
            });
			}

			if (distance < 0) {
				for (let a = 0; a < Math.abs(distance) + 1; a++) {
					pos.push(pos.shift());
				}
			}

			// position all pages to correct place before move and remove hidden pages
			for (let a = 0; a < this._positions.length; a++) {
				let beforeMove = this.calcPagePos(pos[a]);
				if (beforeMove != "0px") {
					document.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`).classList.remove("roundabout-hidden-page");
				}
				document.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`).style.left = beforeMove;
			}

			if (this.navigationTrim) {
				overflow = 0;
			}

			// transition wrapper
			if (!valuesOnly) {
				wrapper.style.left = this.calcPagePos(-distance, true);
			}

			// adjust values
			for (let a = 0; a < Math.abs(distance); a++) {
				if (distance > 0) {
					this._positions.unshift(this._positions.pop());
					this._orderedPages.push(this._orderedPages.shift());
				} else if (distance < 0) {
					this._positions.push(this._positions.shift());
					this._orderedPages.unshift(this._orderedPages.pop());
				}
			}

			for (let a = 0; a < this.pagesToShow; a++) {
				document
					.querySelector(`.roundabout-${this._uniqueId}-visible-page-${a}`)
					.classList.remove(`roundabout-${this._uniqueId}-visible-page-${a}`);
				document
					.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`)
					.classList.add(`roundabout-${this._uniqueId}-visible-page-${a}`);
			}

			this._onPage += distance;
			this._lastDx = 0;

			if (distance > 0 && this._onPage >= this.pages.length) {
				this._onPage -= this.pages.length;
			} else if (distance < 0 && this._onPage < 0) {
				this._onPage += this.pages.length;
			}

			// finished positioning
			if (!valuesOnly) {
				setTimeout(() => {
					this.positionWrap(!valuesOnly);
               this.positionPages();
               this._callbacks.scrollEnd.forEach(cb => {
                  cb();
               });
				}, this.transition);
			} else {
				this.positionWrap(!valuesOnly);
				this.positionPages();
			}

			if (this.navigation) {
				this.setActiveBtn(this._onPage + overflow);
			}

			if (this.lazyLoad == "hidden") {
				if (distance > 0) {
					this.load(this._orderedPages.slice(this.pagesToShow, this.pagesToShow + this.scrollBy));
				} else if (distance < 0) {
					this.load(this._orderedPages.slice(this._orderedPages.length - this.scrollBy, this._orderedPages.length));
				}
			}
		}
	}

	// Scrolls to the n_ext page. Does not handle clicks/taps
	// scrollN_ext(distance, valuesOnly = false, overflow = 0) {
	// 	if (this._onPage >= this.pages.length - this.pagesToShow && !this.infinite && this.type == "normal") {
	// 		return;
	// 	} else if (distance > this.pages.length - this.pagesToShow - this._onPage && !this.infinite) {
	// 		let remainingDistance = this.pages.length - this.pagesToShow - this._onPage;
	// 		this.scrollN_ext(remainingDistance, valuesOnly, distance - remainingDistance);
	// 	} else {
	// 		let wrapper = document.querySelector(`.roundabout-${this._uniqueId}-page-wrap`);

	// 		// position all pages to correct place before move and remove hidden pages
	// 		for (let a = 0; a < this._positions.length; a++) {
	// 			let beforeMove = this.calcPagePos(a);
	// 			if (beforeMove != "0px") {
	// 				document.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`).classList.remove("roundabout-hidden-page");
	// 			}
	// 			document.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`).style.left = beforeMove;
	// 		}

	// 		if (this.navigationTrim) {
	// 			overflow = 0;
	// 		}

	// 		// transition wrapper
	// 		if (!valuesOnly) {
	// 			wrapper.style.left = this.calcPagePos(-distance, true);
	// 		}

	// 		// adjust values
	// 		for (let a = 0; a < distance; a++) {
	// 			this._positions.unshift(this._positions.pop());
	// 			this._orderedPages.push(this._orderedPages.shift());
	// 		}

	// 		for (let a = 0; a < this.pagesToShow; a++) {
	// 			document
	// 				.querySelector(`.roundabout-${this._uniqueId}-visible-page-${a}`)
	// 				.classList.remove(`roundabout-${this._uniqueId}-visible-page-${a}`);
	// 			document
	// 				.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`)
	// 				.classList.add(`roundabout-${this._uniqueId}-visible-page-${a}`);
	// 		}

	// 		this._onPage += distance;
	// 		this._lastDx = 0;

	// 		if (this._onPage >= this.pages.length) {
	// 			this._onPage -= this.pages.length;
	// 		}

	// 		// finished positioning
	// 		if (!valuesOnly) {
	// 			setTimeout(() => {
	// 				this.positionWrap(!valuesOnly);
	// 				this.positi_onPages();
	// 			}, this.transition);
	// 		} else {
	// 			this.positionWrap(!valuesOnly);
	// 			this.positi_onPages();
	// 		}

	// 		if (this.navigation) {
	// 			this.setActiveBtn(this._onPage + overflow);
	// 		}

	// 		if (this.lazyLoad == "hidden") {
	// 			this.load(this._orderedPages.slice(this.pagesToShow, this.pagesToShow + this.scrollBy));
	// 		}
	// 	}
	// }

	// // Scrolls to the previous page. Does not handle clicks/taps
	// scrollPrevious(distance, valuesOnly = false) {
	// 	if (this._onPage <= 0 && !this.infinite && this.type == "normal") {
	// 		return;
	// 	} else if (Math.abs(distance) > this._onPage && !this.infinite) {
	// 		let remainingDistance = -1 * this._onPage;
	// 		this.scrollPrevious(remainingDistance, valuesOnly);
	// 	} else {
	// 		let wrapper = document.querySelector(`.roundabout-${this._uniqueId}-page-wrap`);

	// 		// set up a position modifier array to mutate the normal right-based positioning
	// 		let pos = [];
	// 		for (let a = 0; a < this._positions.length; a++) {
	// 			pos.push(a - Math.abs(distance)-1);
	// 		}
	// 		for (let a = 0; a < Math.abs(distance)+1; a++) {
	// 			pos.push(pos.shift());
	//       }
	//       // console.log("pos array is ");
	//       // console.log(pos);
	// 		// position all pages to correct place before move and remove hidden pages
	// 		for (let a = 0; a < this._positions.length; a++) {
	//          let beforeMove = this.calcPagePos(pos[a]);
	//          // console.log(`Giving page ${a} position ${beforeMove}`);
	// 			if (beforeMove != "0px") {
	// 				document.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`).classList.remove("roundabout-hidden-page");
	// 			}
	// 			document.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`).style.left = beforeMove;
	// 		}

	// 		// transition wrapper
	// 		if (!valuesOnly) {
	// 			wrapper.style.left = this.calcPagePos(-distance, true);
	// 		}

	// 		// adjust values
	// 		for (let a = 0; a < Math.abs(distance); a++) {
	// 			this._positions.push(this._positions.shift());
	// 			this._orderedPages.unshift(this._orderedPages.pop());
	// 		}

	// 		this._onPage += distance;
	// 		this._lastDx = 0;

	// 		if (this._onPage < 0) {
	// 			this._onPage += this.pages.length;
	// 		}

	// 		// finished positioning
	// 		if (!valuesOnly) {
	// 			setTimeout(() => {
	// 				this.positionWrap(!valuesOnly);
	// 				this.positi_onPages();
	// 			}, this.transition);
	// 		} else {
	// 			this.positionWrap(!valuesOnly);
	// 			this.positi_onPages();
	// 		}

	// 		if (this.navigation) {
	// 			this.setActiveBtn(this._onPage);
	// 		}

	// 		if (this.lazyLoad == "hidden") {
	// 			this.load(this._orderedPages.slice(this._orderedPages.length - this.scrollBy, this._orderedPages.length));
	// 		}
	// 	}
	// }

	scrollTo(page) {
		if (this._scrollIsAllowed && this.throttleNavigation && this.navigation) {
			this.setActiveBtn(page);
		} else if (!this.throttleNavigation && this.navigation) {
			this.setActiveBtn(page);
		}
		if (this.lazyLoad == "hidden") {
			let toLoad = [];
			for (let a = -this.scrollBy; a < this.pagesToShow + this.scrollBy; a++) {
				let idx = (a + page) % this._orderedPages.length;
				if (idx < 0) {
					idx += this._orderedPages.length;
				}
				toLoad.push(this._orderedPages[idx]);
			}
			this.load(toLoad);
		}
		if (!this.infinite || this.navigationBehavior == "direction") {
			// if (page < this._onPage) {
			// 	if (this.throttleNavigation) {
			// 		this.previousHandler(this, "scrollto", page - this._onPage);
			// 	} else {
			// 		this.scroll(page - this._onPage);
			// 	}
			// } else {
			if (this.throttleNavigation) {
				this.scrollHandler(this, "scrollto", page - this._onPage);
			} else {
				this.scroll(page - this._onPage);
			}
			// }
		} else {
			if (this.findOffset(this._onPage, page, "p") < this.findOffset(this._onPage, page, "n")) {
				if (this.throttleNavigation) {
					this.scrollHandler(this, "scrollto", -1 * this.findOffset(this._onPage, page, "p"));
				} else {
					this.scroll(-1 * this.findOffset(this._onPage, page, "p"));
				}
			} else {
				if (this.throttleNavigation) {
					this.scrollHandler(this, "scrollto", this.findOffset(this._onPage, page, "n"));
				} else {
					this.scroll(this.findOffset(this._onPage, page, "n"));
				}
			}
		}
	}

	setActiveBtn(id) {
		document
			.querySelector(`.roundabout-${this._uniqueId}-active-nav-btn`)
			.classList.add(`roundabout-${this._uniqueId}-inactive-nav-btn`, `roundabout-inactive-nav-btn`);
		document
			.querySelector(`.roundabout-${this._uniqueId}-active-nav-btn`)
			.classList.remove(`roundabout-${this._uniqueId}-active-nav-btn`, `roundabout-active-nav-btn`);
		document
			.querySelector(`.roundabout-${this._uniqueId}-nav-btn-${id}`)
			.classList.add(`roundabout-${this._uniqueId}-active-nav-btn`, `roundabout-active-nav-btn`);
		document
			.querySelector(`.roundabout-${this._uniqueId}-nav-btn-${id}`)
			.classList.remove(`roundabout-${this._uniqueId}-inactive-nav-btn`, `roundabout-inactive-nav-btn`);
	}

	// n_extHandler(parent, from, distance) {
	// 	let sd;
	// 	if (from == "snap") {
	// 		sd = 1;
	// 	} else if (from == "scrollto") {
	// 		sd = distance;
	// 	} else {
	// 		sd = parent.scrollBy;
	// 	}
	// 	parent.resetScrollTimeout();
	// 	if (parent._scrollIsAllowed && !parent._dragging) {
	// 		parent.scroll(sd, false);
	// 		if ((parent.throttle && parent.throttleButtons && from != "key") || (parent.throttle && parent.throttleKeys && from == "key")) {
	// 			parent._scrollIsAllowed = false;
	// 			setTimeout(() => {
	// 				parent._scrollIsAllowed = true;
	// 			}, parent.throttleTimeout);
	// 		}
	// 	}
	// }

	scrollHandler(parent, from, distance) {
		let sd;
		if (from == "snap") {
			if (distance > 0) {
				sd = 1;
			} else if (distance < 0) {
				sd = -1;
			}
		} else if (from == "scrollto") {
			sd = distance;
		} else {
			if (distance > 0) {
				sd = parent.scrollBy;
			} else if (distance < 0) {
				sd = -parent.scrollBy;
			}
		}
		parent.resetScrollTimeout();
		if (parent._scrollIsAllowed && !parent._dragging) {
			parent.scroll(sd, false);
			if ((parent.throttle && parent.throttleButtons && from != "key") || (parent.throttle && parent.throttleKeys && from == "key")) {
				parent._scrollIsAllowed = false;
				setTimeout(() => {
					parent._scrollIsAllowed = true;
				}, parent.throttleTimeout);
			}
		}
	}

	/*
   ==================================================================================================================
   
   AUTOSCROLL

   ==================================================================================================================
   */

	// On user interaction, this is called to pause scrolling until user is presumably done
	resetScrollTimeout(f = false) {
		clearTimeout(this._scrollTimeoutHolder);
		clearInterval(this._scrollIntervalHolder);
		this._scrollTimeoutHolder = setTimeout(() => {
			if (f) {
				this.scrollAuto(this);
			}
			this.setAutoScroll(this);
		}, this.autoscrollTimeout);
	}

	// Initializes autoscroll if enabled
	setAutoScroll(parent, firstTime = false) {
		if (firstTime && parent.autoscroll) {
			parent._scrollAfterTimeoutHolder = setTimeout(() => {
				parent.scrollAuto(parent);
				parent._scrollIntervalHolder = setInterval(() => {
					parent.scrollAuto(parent);
				}, parent.autoscrollSpeed);
			}, parent.autoscrollStartAfter);
		} else if (parent.autoscroll) {
			parent._scrollIntervalHolder = setInterval(() => {
				parent.scrollAuto(parent);
			}, parent.autoscrollSpeed);
		}
	}

	// Called at each interval, determines how to scroll
	scrollAuto(parent) {
		if (parent.autoscrollDirection.toLowerCase() == "left" && parent._scrollIsAllowed) {
			parent.scroll(-this.scrollBy);
		} else if (parent.autoscrollDirection.toLowerCase() == "right" && parent._scrollIsAllowed) {
			parent.scroll(this.scrollBy);
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
		parent._t = true;
		parent.tStart(event, parent);
	}

	// called once when touch or click starts
   tStart(event, parent) {
      this._callbacks.dragStart.forEach(cb => {
         cb();
      });
		// throttling
		parent.resetScrollTimeout();
		if (parent.throttleSwipe) {
			if (parent._swipeIsAllowed) {
				if (parent.throttle) {
					parent._swipeIsAllowed = false;
				}
			} else {
				return;
			}
		}

		if (parent.swipeSpeed > 0) {
			parent._sts = Date.now();
		}

		event.preventDefault();
		parent._dragging = true;
		parent._swipeFrom = parent._orderedPages[parent._orderedPagesMainIndex];

		// remove transitions to prevent elastic-y movement
		document.querySelector(`.roundabout-${parent._uniqueId}-page-wrap`).classList.remove(`roundabout-${this._uniqueId}-has-transition`);
		document.querySelector(`.roundabout-${parent._uniqueId}-page-wrap`).classList.add("roundabout-has-no-transition");

		// log the first touch position
		parent._lastMove = event.touches;
		if (parent._t) {
			parent._x = event.touches[0].clientX;
			// parent.y = event.touches[0].clientY;
			parent._sx = event.touches[0].clientX;
			// parent.sy = event.touches[0].clientY;
		} else {
			parent._x = event.clientX;
			// parent.y = event.clientY;

			parent._sx = event.clientX;
			// parent.sy = event.clientY;
		}

		document.addEventListener("mousemove", parent._boundFollow, false);
		document.addEventListener("mouseup", parent._boundEnd, false);

		// if (!parent.swipeSnap) {
		//    parent._dx = parent.
		// }

		if (parent._t) {
			document.addEventListener("touchmove", parent._boundFollow, false);
			document.addEventListener("touchend", parent._boundEnd, false);
			document.addEventListener("touchcancel", parent._boundCancel, false);
		}
	}

	// called repeatedly while _dragging
	follow(event, parent) {
		if (parent._dragging) {
			// capture movements
			if (parent._t) {
				parent._x = event.changedTouches[0].clientX;
				// parent.y = event.changedTouches[0].clientY;
			} else {
				parent._x = event.clientX;
				// parent.y = event.clientY;
			}

			parent._dx = (parent._x - parent._sx) * parent.swipeMultiplier;

			// check if at an end and trying to scroll past
			if (
				!parent.infinite &&
				((parent._onPage == parent.pages.length - parent.pagesToShow && parent._dx < -1 * parent._lastDx) ||
					(parent._onPage == 0 && parent._dx > -1 * parent._lastDx))
			) {
				parent._atEnd = true;
			} else {
				parent._atEnd = false;
			}

			// resistant scrolling
			if (Math.abs(parent._dx) < document.querySelector(parent.parent).offsetWidth && parent.infinite) {
				parent._dx = (parent._x - parent._sx) * parent.swipeMultiplier;
			} else if (parent._dx < 0) {
				if (parent.infinite) {
					parent._dx -= (parent._dx + document.querySelector(parent.parent).offsetWidth) * parent.swipeResistance;
				} else if (parent.pages.length - parent.pagesToShow == parent._onPage) {
					if (parent.swipeResistance == 1) {
						parent._dx = 0;
					} else if (parent._atEnd) {
						// added additional if
						parent._dx -= (parent._dx + parent._lastDx) * parent.swipeResistance;
					}
				}
			} else if (parent._dx > 0) {
				if (parent.infinite) {
					parent._dx -= (parent._dx - document.querySelector(parent.parent).offsetWidth) * parent.swipeResistance;
				} else if (parent._orderedPages[parent._orderedPagesMainInd_ex] === 0) {
					if (parent.swipeResistance == 1) {
						parent._dx = 0;
					} else if (parent._atEnd) {
						// added additional if
						parent._dx -= (parent._dx + parent._lastDx) * parent.swipeResistance;
					}
				}
			}

			parent._dx += parent._lastDx;

			// get distance values
			let dist = Math.abs(parent._dx);
			parent.checkCanSnap(parent);

			let totalSize =
				document.querySelector(`.roundabout-${parent._uniqueId}-page-` + parent._orderedPages[parent._orderedPagesMainIndex]).offsetWidth +
				parent.pageSpacing;

			// determine if snapping to the next page is allowed
			if (
				(dist >= totalSize && parent.infinite) ||
				(dist >= totalSize &&
					!parent.infinite &&
					(parent._onPage < parent.pages.length - parent.pagesToShow ||
						(parent._onPage == parent.pages.length - parent.pagesToShow && parent._dx > 0)) &&
					(parent._onPage > 0 || (parent._onPage == 0 && parent._dx < 0)))
			) {
				if (parent._dx > 0) {
					parent.scroll(-1, true);
				} else if (parent._dx < 0) {
					parent.scroll(1, true);
				}
				parent._sx = parent._x * 1;
				parent._dx = 0;
				parent._lastDx = 0;
			} else {
				document.querySelector(`.roundabout-${parent._uniqueId}-page-wrap`).style.left = parent._dx + "px";
			}
		}
	}

	checkCanSnap(parent, checkSpeed = false) {
		let dist = Math.abs(parent._dx);
		// console.log(`swipe speed is `)

		if (parent.swipeSnap) {
			// snap is enabled - using threshold and speed
			if (
				(dist >= parent.swipeThreshold && parent.infinite) || // (infinite and over threshold) OR
				(checkSpeed && parent.infinite) || // (infinite and checking for speed) OR
				((dist >= parent.swipeThreshold || checkSpeed) && // [(over threshold OR checking for speed) AND
					!parent.infinite && // not infinite AND
					(parent._onPage < parent.pages.length - parent.pagesToShow || // {is less than right end OR
						(parent._onPage == parent.pages.length - parent.pagesToShow && parent._dx > 0)) && // is at right and and moving left} AND
					(parent._onPage > 0 || (parent._onPage == 0 && parent._dx < 0))) // (is not at left end OR is at left end and is moving right)]
			) {
				if (checkSpeed && Math.abs(((parent._ex - parent._sx) / (parent._ste - parent._sts)) * 1000) > parent.swipeSpeed) {
					parent._canSnap = true; // checking speed and speed is over required
				} else if (checkSpeed) {
					parent._canSnap = false; // checking speed and speed is under required
				} else if (!checkSpeed) {
					parent._canSnap = true;
				}
			} else {
				parent._canSnap = false;
			}
		} else {
			// snap is disabled - not using threshold or speed, but must check for non-inf ends
			if (
				!parent.infinite && // not infinite AND
				((parent._onPage == parent.pages.length - parent.pagesToShow && parent._dx < 0) || // (at right end and moving right OR
					(parent._onPage == 0 && parent._dx > 0)) // at left and and moving left
			) {
				parent._canSnap = false;
			} else {
				// console.log("set to true");
				parent._canSnap = true;
			}
		}
	}

	// called once when the touch or click ends
   tEnd(event, parent) {
      this._callbacks.dragEnd.forEach(cb => {
         cb();
      });
		setTimeout(() => {
			parent._swipeIsAllowed = true;
		}, parent.throttleTimeout);

		document.querySelector(`.roundabout-${parent._uniqueId}-page-wrap`).classList.add(`roundabout-${this._uniqueId}-has-transition`);
		document.querySelector(`.roundabout-${parent._uniqueId}-page-wrap`).classList.remove(`roundabout-has-no-transition`);

		parent._dragging = false;

		// log the end of touch position
		if (parent._t) {
			parent._ex = event.changedTouches[0].clientX;
			// parent.ey = event.changedTouches[0].clientY;
		} else {
			parent._ex = event.clientX;
			// parent.ey = event.clientY;
		}

		if (!parent.swipeSnap) {
			parent._lastDx = parent._dx * 1;
		}

		if (parent.swipeSpeed > 0 && Math.abs(parent._dx) < parent.swipeThreshold) {
			parent._ste = Date.now();
			parent.checkCanSnap(parent, true);
		}

		let tempSwipeSpeed = Math.abs(((parent._ex - parent._sx) / (parent._ste - parent._sts)) * 1000);
		console.log(`Swipe speed was ${tempSwipeSpeed}`);

		// parent.checkCanSnap(parent);

		// snap the page to the correct position, and reset for next swipe
		if (parent.swipeSnap || (!parent.swipeSnap && !parent._canSnap && parent._atEnd)) {
			parent.snap(parent._canSnap, parent._dx, parent);
			if (!parent.swipeSnap) {
				parent._lastDx = 0;
			}
		}
		parent.resetSwipeVars(parent);

		document.removeEventListener("mousemove", parent._boundFollow, false);
		document.removeEventListener("mouseup", parent._boundEnd, false);

		document.removeEventListener("touchmove", parent._boundFollow, false);
		document.removeEventListener("touchend", parent._boundEnd, false);
		document.removeEventListener("touchcancel", parent._boundCancel, false);
	}

	// handle touch cancel
   tCancel(event, parent) {
      this._callbacks.dragEnd.forEach(cb => {
         cb();
      });
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
				parent.scrollHandler(parent, "snap", -1);
				parent.positionWrap(false, 1);
			} else if (dir < 0) {
				parent.scrollHandler(parent, "snap", 1);
				parent.positionWrap(false, -1);
			}
		} else {
			parent.positionWrap(false, 0);
		}
	}

	// reset all variables to defaults to avoid strange movements when a new touch starts
	resetSwipeVars(parent) {
		if (parent.swipeSnap) {
			parent._sx = 0;
			// parent.sy = 0;
			parent._ex = 0;
			// parent.ey = 0;
			parent._x = 0;
			// parent.y = 0;
			parent._dx = 0;
		}

		parent._lastMove = [];
		parent._t = false;
		parent._canSnap = false;
	}

	// These remain bound to the constructor object, assisting in circumventing 'this' scope issues
	_execMM(event) {
		this.follow(event, this);
	}
	_execMU(event) {
		this.tEnd(event, this);
	}
	_execTC(event) {
		this.tCancel(event, this);
	}

	/*
   ==================================================================================================================
   
   DEFAULT FUNCTIONS

   ==================================================================================================================
   */

	// Generates the default HTML structure
	defaultHTML(r) {
		let newCarousel = document.createElement("DIV");
		let ui = ``;
		let swipe = ``;
		let buttons = ``;
		if (this.buttons) {
			buttons = `<div class="roundabout-${this._uniqueId}-btn-next roundabout-btn-next roundabout-scroll-btn">${this.nextHTML}</div><div class="roundabout-${this._uniqueId}-btn-prev roundabout-btn-prev roundabout-scroll-btn">${this.prevHTML}</div>`;
		}
		if (this.uiEnabled) {
			ui = `<div class="roundabout-${this._uniqueId}-ui roundabout-ui">${buttons}</div>`;
		}
		if (this.swipe) {
			swipe = `<div class="roundabout-${this._uniqueId}-swipe-overlay roundabout-swipe-overlay"></div>`;
		}
		let html = `${swipe}<div class="roundabout-${this._uniqueId}-page-wrap roundabout-page-wrap roundabout-${this._uniqueId}-has-transition"></div>${ui}`;
		if (r) {
			newCarousel = document.querySelector(this.id);
			newCarousel.innerHTML = html;
		} else {
			newCarousel.innerHTML = html;
			newCarousel.classList.add("roundabout-wrapper");
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
			document.querySelector(this.id).style.position = "relative";
			document.querySelector(this.id).style.overflow = "hidden";
		}
		document.querySelector(`.roundabout-${this._uniqueId}-page-wrap`).style.height = "100%";
		document.querySelector(`.roundabout-${this._uniqueId}-page-wrap`).style.width = "100%";
		document.querySelector(`.roundabout-${this._uniqueId}-page-wrap`).style.position = "absolute";
		document.querySelector(`.roundabout-${this._uniqueId}-page-wrap`).style.left = "0";
	}

	// Generates the required CSS. Seperate from default styling
	internalCSS() {
		let css = `.roundabout-${this._uniqueId}-has-transition {transition:${this.transition / 1000}s;transition-timing-function:${
			this.transitionFunction
		}}.roundabout-has-no-transition{transition:none;}.roundabout-hidden-page {visibility: hidden}.roundabout-error-message {position:relative;margin:auto;left:0;right:0;top:0;bottom:0;border-radius:5px;border:3px solid black;background: white;text-align:center;font-family:sans-serif;width:30%;}`;
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

	// Create each new page from the pages array and append to the parent element
	generatePages() {
		let pagesCss = "";
		for (let a = 0; a < this.pages.length; a++) {
			let newPage = document.createElement("DIV");
			newPage.classList.add(`roundabout-${this._uniqueId}-page-${a}`, "roundabout-page");
			let newPos;
			if (this.type == "normal") {
				// Set width and positions based on mode: calculated to accomodate spacing and number of pages
				let iteratorMod, iteratorMod2;
				if (this.pageSpacingMode == "evenly") {
					iteratorMod = 1;
					iteratorMod2 = 0;
				} else {
					iteratorMod = -1;
					iteratorMod2 = -1;
				}

				let pageWidth =
					"calc((100% - " + (this.pagesToShow + iteratorMod) * this.pageSpacing + this.pageSpacingUnits + ") / " + this.pagesToShow + ")";
				newPage.style.width = pageWidth;
				if (a <= this.pagesToShow + 2) {
					newPos =
						"calc((((100% - " +
						(this.pagesToShow + iteratorMod) * this.pageSpacing +
						this.pageSpacingUnits +
						") / " +
						this.pagesToShow +
						") * " +
						(a - 1) +
						") + " +
						(this.pageSpacing * (a + iteratorMod2) + this.pageSpacingUnits) +
						")";
				}
			} else {
				newPage.style.width = "100%";
			}
			// newPage.style.height = "100%";
			newPage.style.position = "absolute";

			// Give a background image (if supplied)
			if (
				(this.pages[a].backgroundImage && this.lazyLoad == "none") ||
				(this.pages[a].backgroundImage &&
					this.lazyLoad == "hidden" &&
					(a < this.pagesToShow + this.scrollBy || a >= this.pages.length - this.scrollBy))
			) {
				newPage.style.backgroundImage = "url(" + this.pages[a].backgroundImage + ")";
				this.pages[a].isLoaded = true;
			} else if (this.lazyLoad == "all" && !this._handledLoad) {
				this._handledLoad = true;
				window.addEventListener("load", () => {
					this.load(this._orderedPages);
				});
			}
			if (this.pages[a].html) {
				newPage.innerHTML = this.pages[a].html;
				if (this.pages[a].css) {
					pagesCss += this.pages[a].css;
				}
			}
			document.querySelector(`.roundabout-${this._uniqueId}-page-wrap`).appendChild(newPage);
			this._orderedPages.push(a);

			if (a <= this.pagesToShow + 1) {
				this._positions.push(newPos);
			} else {
				this._positions.push("0px");
			}

			if (a < this.pagesToShow) {
				document
					.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`)
					.classList.add(`roundabout-${this._uniqueId}-visible-page-${a}`);
			}
		}

		let newPagesStyle = document.createElement("STYLE");
		newPagesStyle.setAttribute("type", "text/css");
		newPagesStyle.innerHTML = pagesCss;
		document.getElementsByTagName("head")[0].appendChild(newPagesStyle);

		// create navigation

		if (this.navigation && this.uiEnabled) {
			let navbar = document.createElement("div");
			navbar.classList.add(`roundabout-${this._uniqueId}-nav-wrap`, "roundabout-nav-wrap");
			document.querySelector(`.roundabout-${this._uniqueId}-ui`).appendChild(navbar);

			let numButtons;
			if (this.type == "normal") {
				if (this.infinite || !this.navigationTrim) {
					numButtons = this.pages.length;
				} else {
					numButtons = this.pages.length - (this.pagesToShow - 1);
				}
			}
			for (let a = 0; a < numButtons; a++) {
				let newNavBtn = document.createElement("div");
				if (a == 0) {
					newNavBtn.classList.add(`roundabout-${this._uniqueId}-active-nav-btn`, `roundabout-active-nav-btn`);
				} else {
					newNavBtn.classList.add(`roundabout-${this._uniqueId}-inactive-nav-btn`, `roundabout-inactive-nav-btn`);
				}
				newNavBtn.classList.add(`roundabout-${this._uniqueId}-nav-btn`, `roundabout-${this._uniqueId}-nav-btn-${a}`, `roundabout-nav-btn`);
				navbar.appendChild(newNavBtn);
				newNavBtn.addEventListener("click", () => {
					this.scrollTo(a);
				});
			}
		}

		this._positions.push(this._positions.shift());

		this.positionPages();
	}

	// Destroys the HTML of the carousel
	destroy(regen = true, complete = false) {
		clearTimeout(this._scrollTimeoutHolder);
		clearInterval(this._scrollIntervalHolder);
		clearTimeout(this._scrollAfterTimeoutHolder);
		if (complete) {
			document.querySelector(this.id).remove();
		} else {
			document.querySelector(this.id).innerHTML = "";
			if (regen) {
				this._positions = [];
				this._orderedPages = [];
            try {
               //! not working
               let oe = document.querySelector(this.id);
               let ne = oe.cloneNode(true);
               oe.parentNode.replaceChild(ne, oe);
               document.removeEventListener("keydown", (event) => {
                  this.keyListener(event);
               });
					this.initialActions(true);
					this.setListeners(true);
				} catch (e) {
					console.error(`Error while attempting to regenerate Roundabout with id ${this.id}:`);
					console.error(e);
				}
			}
		}
	}

	// Check for an applicable breakpoint
	setBreakpoints() {
		let lbp = {width: -1};
		this.breakpoints.forEach((bp) => {
			if (!bp.hasOwnProperty("width")) {
				console.error("Breakpoint is missing a 'width' property, which defines the screen or window size to apply at.");
			}
			if ((window.innerWidth <= bp.width || screen.width <= bp.width) && (bp.width <= lbp.width || lbp.width == -1)) {
				lbp = bp;
			}
		});

		if (this._currentBp != lbp.width) {
			this._currentBp = lbp.width;
			this.applyBreakpoint(lbp);
		}
	}

	// Regenerate the carousel and apply the breakpoint
	applyBreakpoint(breakpoint) {
		for (let a = 0; a < this._overriddenValues.length; a++) {
			this[this._overriddenValues[a][0]] = this._overriddenValues[a][1];
		}
		this._overriddenValues = [];
		let t = Object.entries(this);
		let p = Object.entries(breakpoint);
		for (let a = 0; a < p.length; a++) {
			for (let b = 0; b < t.length; b++) {
				if (p[a][0].toString() == t[b][0].toString()) {
					this._overriddenValues.push([p[a][0].toString(), this[p[a][0]]]);
					this[p[a][0].toString()] = p[a][1];
				}
			}
		}
		this.destroy();
	}

	// Runs through applicable settings and takes actions based on them. Mostly to reduce constructor clutter
	initialActions(r = false) {
		if (this._allowInternalStyles) {
			this.internalCSS();
		}
		if (this.checkForErrors(r)) {
			if (!r) roundabout.on++;
			if (this._allowInternalHTML) {
				this.defaultHTML(r);
			}
			if (this.autoscroll) {
				this.setAutoScroll(this, true);
			}
			if (!this.uiEnabled) {
				this.navigation = false;
				this.swipe = false;
			}
			try {
				this.generatePages();
			} catch (e) {
				console.error(`Error while attempting to generate Roundabout with id ${this.id}:`);
				console.error(e);
			}
			this._boundFollow = this._execMM.bind(this);
			this._boundEnd = this._execMU.bind(this);
			this._boundCancel = this._execTC.bind(this);
		}
	}

	// Sets all required eventListeners for the carousel
   setListeners(r = false) {
		if (this.uiEnabled && this.buttons) {
			document.querySelector(`.roundabout-${this._uniqueId}-btn-next`).addEventListener("click", () => {
				this.scrollHandler(this, "listener", this.scrollBy);
			});
			document.querySelector(`.roundabout-${this._uniqueId}-btn-prev`).addEventListener("click", () => {
				this.scrollHandler(this, "listener", -this.scrollBy);
			});
		}
		if (this.keys) {
			document.addEventListener("keydown", (event) => {
            this.keyListener(event);
			});
		}
		if (this.listenForResize) {
			setTimeout(() => {
				window.addEventListener("resize", () => {
					this.setBreakpoints();
				});
			}, 0);
		}
		if (this.autoscrollPauseOnHover) {
			document.querySelector(this.parent).addEventListener("mouseover", () => {
				this._scrollIsAllowed = false;
			});
			document.querySelector(this.parent).addEventListener("mouseout", () => {
				this._scrollIsAllowed = true;
				this.resetScrollTimeout(true);
			});
		}
		if (this.swipe) {
			document.querySelector(`.roundabout-${this._uniqueId}-swipe-overlay`).addEventListener(
				"mousedown",
				(event) => {
					this.tStart(event, this);
				},
				false
			);
			document.querySelector(`.roundabout-${this._uniqueId}-swipe-overlay`).addEventListener(
				"touchstart",
				(event) => {
					this.setTouch(event, this);
				},
				false
			);
		}
   }
   
   keyListener(event) {
      switch (event.key) {
         case "ArrowLeft":
            this.scrollHandler(this, "key", -this.scrollBy);
            break;
         case "ArrowRight":
            this.scrollHandler(this, "key", this.scrollBy);
            break;
      }
   }

	// prevents breakage by providing constraints and displaying an error message
	checkForErrors(r) {
		if (this.pages.length < 3) {
			this.displayError("The minimum number of pages supported is 3.");
			return false;
		}
		if (this.pages.length - this.pagesToShow <= 0) {
			this.displayError("Too many pages are being displayed at once. There must be at least 2 fewer pages shown than the number of total pages.");
			return false;
		}
		if (this.pages.length == 0 || !this.pages.length) {
			this.displayError("No pages have been supplied. Please create a 'pages' array containing your pages. See the documentation for details.");
		}
		if (this.id.split("")[0] !== "#" && this.id.split("")[0] !== ".") {
			this.displayError("An invalid selector prefix was given for the parent. Valid selector prefixes are '#' for IDs or '.' for classes.");
			return false;
		}
		if (roundabout.usedIds.includes(this.id) && !r) {
			this.displayError(`The selector '${this.id}' is already in use by another carousel. Please use a unique selector.`);
			return false;
		} else {
			roundabout.usedIds.push(this.id);
		}
		if (this.pagesToShow < this.scrollBy) {
			this.displayError("'scrollBy' must be less than or equal to 'pagesToShow'.");
			return false;
		}
		return true;
	}

	/*
   ==================================================================================================================

   UTILITY
   
   ==================================================================================================================
   */

	// lazy load a page image
	load(pageIds = [], a = false) {
		pageIds.forEach((id) => {
			if (!this._loadQueue.includes(id)) {
				this._loadQueue.push(id);
			}
		});
		if (this._loadQueue.length == 0) {
			this._loadingPages = false;
			return;
		}
		if (!this._loadingPages) {
			a = true;
		}
		if (!a) {
			return;
		}
		if (!this.pages[this._loadQueue[0]].isLoaded) {
			this._loadingPages = true;
			let bgImg = new Image();
			bgImg.onload = () => {
				document.querySelector(`.roundabout-${this._uniqueId}-page-${this._loadQueue[0]}`).style.backgroundImage = "url(" + bgImg.src + ")";
				document.querySelector(`.roundabout-${this._uniqueId}-page-${this._loadQueue[0]}`).style.backgroundSize = "cover";
				document.querySelector(`.roundabout-${this._uniqueId}-page-${this._loadQueue[0]}`).style.backgroundPosition = "center center";

				this.pages[this._loadQueue[0]].isLoaded = true;

				this._loadQueue = this._loadQueue.splice(1, this._loadQueue.length - 1);
				this.load(this._loadQueue, true);
			};
			bgImg.src = this.pages[this._loadQueue[0]].backgroundImage;
		} else {
			this._loadQueue = this._loadQueue.splice(1, this._loadQueue.length - 1);
			this.load(this._loadQueue, true);
		}
	}

	// after a transition, places each page where they should be for the next transiton
	positionPages() {
		for (let a = 0; a < this._positions.length; a++) {
			if (this._positions[a] == "0px") {
				document.querySelector(`.roundabout-${this._uniqueId}-page-${a}`).classList.add("roundabout-hidden-page");
				document.querySelector(`.roundabout-${this._uniqueId}-page-${a}`).style.left = this._positions[a];
			} else {
				document.querySelector(`.roundabout-${this._uniqueId}-page-${a}`).style.left = this._positions[a];
				document.querySelector(`.roundabout-${this._uniqueId}-page-${a}`).classList.remove("roundabout-hidden-page");

				if (!this.infinite && a == 0 && this._onPage > 1 && !this.showWrappedPage) {
					document.querySelector(`.roundabout-${this._uniqueId}-page-${a}`).classList.add("roundabout-hidden-page");
				}
				if (!this.infinite && a == this._positions.length - 1 && this._onPage == 0 && !this.showWrappedPage) {
					document.querySelector(`.roundabout-${this._uniqueId}-page-${this._positions.length - 1}`).classList.add("roundabout-hidden-page");
				}
			}
		}
	}

	// sets page wrap back to left: 0. true = instant movment, false = current transition
	positionWrap(setTransitions = true, position = 0) {
		let wrapper = document.querySelector(`.roundabout-${this._uniqueId}-page-wrap`);
		if (setTransitions) {
			wrapper.classList.remove(`roundabout-${this._uniqueId}-has-transition`);
			wrapper.classList.add(`roundabout-has-no-transition`);
		}
		wrapper.style.left = this.calcPagePos(position, true);
		const flushCssBuffer = wrapper.offsetWidth;
		if (setTransitions) {
			wrapper.classList.add(`roundabout-${this._uniqueId}-has-transition`);
			wrapper.classList.remove(`roundabout-has-no-transition`);
		}
	}

	findOffset(start, end, direction) {
		if (direction == "p") {
			if (end < start) {
				return start - end;
			} else {
				return start + this.pages.length - end;
			}
		} else if (direction == "n") {
			if (end < start) {
				return this.pages.length - start + end;
			} else {
				return end - start;
			}
		}
	}

	// returns the correct css positioning of a page given its position, 0 being the leftmost visible page
	calcPagePos(pagePos, wrap) {
		if (pagePos == 0 && (this.pageSpacingMode == "fill" || wrap)) {
			return "0px";
		}
		pagePos += 1;
		let iteratorMod,
			iteratorMod2,
			adjust = 0;
		if (this.pageSpacingMode == "evenly") {
			iteratorMod = 1;
			iteratorMod2 = 0;
			if (wrap) {
				adjust = -this.pageSpacing;
			}
		} else {
			iteratorMod = -1;
			iteratorMod2 = -1;
		}

		let newPos =
			"calc((((100% - " +
			(this.pagesToShow + iteratorMod) * this.pageSpacing +
			this.pageSpacingUnits +
			") / " +
			this.pagesToShow +
			") * " +
			(pagePos - 1) +
			") + " +
			(this.pageSpacing * (pagePos + iteratorMod2) + adjust + this.pageSpacingUnits) +
			")";
		return newPos;
	}

	/*
   ==================================================================================================================

   OTHER
   
   ==================================================================================================================
   */
   
   subscribe(event, newCallback) {
      this._callbacks[event].push(newCallback);
   }

	// creates error message box
	displayError(message, title = "Error:") {
		let em = document.createElement("DIV");
		em.classList.add("roundabout-error-message");
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
		console.error(message);
	}
}
