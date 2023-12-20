//! KNOWN ISSUES:
/*
	
*/

//! DON'T FORGET TO UPDATE VERSION#

// To do:
/*
	- Refactor positioning thing, way out of control. Make sure 0px is only returned for correct cases.
	- Try catch on initial actions, "may be issue with settings"
*/

//? Tests to do:
/*
	- test gallery and non-infinite
	- dragging (especially touch and interaction ends)
*/

//> FOR THIS RELEASE (1.5.0)
/**
 * Ensure lazy loading bit is done
 * Convert methods to private
 */

let roundabout = {
	on: -1,
	usedIds: [],
	overwritten: "no",
	logged: false,

	defaults: {
		pages: [],
		breakpoints: [],
		listenForResize: false,
		interpolate: [],
		template: null,

		id: ".myCarousel",
		parent: "body",
		lazyLoad: "none",
		loadTimeout: 5000,
		uiEnabled: true,
		rotation: "none",

		type: "slider",
		infinite: true,
		keys: true,
		buttons: true,

		swipe: true,
		swipeThreshold: 300,
		swipeMultiplier: 1,
		swipeResistance: 0.95,
		swipeSnap: true,
		swipeSpeedThreshold: 1200,

		scrollwheel: false,

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
		ignoreErrors: false, // bypasses the checkForErrors function
	},
};

/**
 * @class Roundabout
 * @param {Object} settings - The settings for the carousel
 */
export default class Roundabout {
	constructor(settings = roundabout.defaults) {
		if (!roundabout.overwritten || roundabout.overwritten != "no") {
			console.error(`Do not redefine the variable "roundabout". Roundabout requires this variable to store data across multiple carousels.`);
		}
		let s = Object.entries(settings);
		let d = Object.entries(roundabout.defaults);
		this.VERSION = "1.5.0 (PRERELASE)";
		if (!roundabout.logged) console.log(`Using Roundabout version ${this.VERSION} (github.com/dougalcaleb/roundabout)`);
		roundabout.logged = true;

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
		this.onPage = 0;
		this._handledLoad = false;
		this._loadQueue = [];
		this._loadTimeout = null;
		this._loadingPages = false;
		this._uniqueId = roundabout.on + 1;
		this._overriddenValues = [];
		this._currentBp = -2;
		this._atEnd = true;
		this.activeBreakpoint = null;
		this._calculatedPageSize = null;
		this._htmlTemplates = [];
		this._abort = {
			all: new AbortController(),
			swipe: new AbortController()
		};
		// internal
		this._allowInternalStyles = true;
		this._allowInternalHTML = true;
		// swipe
		this._sx = 0;
		this._ex = 0;
		this._dx = 0;
		this._x = 0;
		this._lastDx = 0;
		this._lastMove = null;
		this._t = false;
		this._dragging = false;
		this._canSnap = false;
		this._swipeFrom = 0;
		this._swipeIsAllowed = true;
		this._sts = 0;
		this._ste = 0;
		this._distPercent = 0;
		// autoscroll
		this._isAutoscrolling = false;
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
			scrollNextEnd: [],
			scrollPreviousEnd: [],
			load: [],
			beforeDestroy: [],
			afterDestroy: [],
		};

		// Function calls
		if (!this.initOnly) {
			if (this.initialActions()) {
				try {
					this.setListeners();
				} catch (e) {
					console.error(`Error while attempting to add event listeners to Roundabout with id ${this.id}:`);
					console.error(e);
				}
				try {
					this.setBreakpoints();
				} catch (e) {
					console.error(`Error while attempting to set breakpoint values in Roundabout with id ${this.id}:`);
					console.error(e);
				}
			} else {
				console.error(`Error while attempting to initialize carousel with id ${this.id}. Ensure the settings are valid.`)
			}
		}
	}

	/*
	==================================================================================================================
	
	SCROLLING

	==================================================================================================================
	*/

	scroll(distance, valuesOnly, overflow = 0) {
		if (
			(distance > 0 && this.onPage >= this.pages.length - this.pagesToShow && !this.infinite) ||
			(distance < 0 && this.onPage <= 0 && !this.infinite) ||
			distance == 0
		) {
			// at end
			// will allow selection of nav button, but no scroll
			if (!this.infinite && !this.navigationTrim && distance == 1) {
				this.setActiveBtn(this.onPage + 1);
			}
			return;
		} else if (distance > 0 && distance > this.pages.length - this.pagesToShow - this.onPage && !this.infinite) {
			// will reach right end: return remaining
			let remainingDistance = this.pages.length - this.pagesToShow - this.onPage;
			this.scroll(remainingDistance, valuesOnly, distance - remainingDistance);
		} else if (distance < 0 && Math.abs(distance) > this.onPage && !this.infinite) {
			// will reach left end: return remaining
			let remainingDistance = -1 * this.onPage;
			this.scroll(remainingDistance, valuesOnly);
		} else {
			let wrapper = document.querySelector(`.roundabout-${this._uniqueId}-page-wrap`);

			this._callbacks.scroll.forEach((cb) => {
				cb(distance);
			});

			// position array to give the correct position values to the correct pages
			let pos = [];

			if (distance > 0) {
				if (this.type == "slider") { // in slider type, each page has its own unique position
					for (let a = 0; a < this._positions.length; a++) {
						// directly related to a because no pages need to change since it's left-based
						pos.push(a - (this.pages.length > 2 ? 1 : 0));
					}
					if (this.pages.length > 2) pos.push(pos.shift());
					// fix for last page popping in after immediate nav
					if (!this.infinite && (this.onPage + distance + this.pagesToShow == this.pages.length)) {
						pos[pos.length - 1] = pos.length - 1;
					}
				} else if (this.type == "gallery") { // in gallery type, two sets of pages will have the same position, and the rest will be hidden
					for (let a = 0; a < this._positions.length; a++) {
						if (a < this.pagesToShow || (a >= distance && a < distance + this.pagesToShow)) { 
							pos.push(a % this.pagesToShow); // place the two sets
						} else {
							pos.push(-1); // not visible page
						}
					}
				}
				
				this._callbacks.scrollNext.forEach((cb) => {
					cb(distance);
				});
			} else if (distance < 0) {
				if (this.type == "slider") {
					for (let a = 0; a < this._positions.length; a++) {
						// modified by distance because the pages have to move to display correctly while left-based
						pos.push(a - Math.abs(distance));
					}
					// Move everything left because the pages will be moving past the left end when they normally do not
					for (let a = 0; a < Math.abs(distance); a++) {
						pos.push(pos.shift());
					}
				} else if (this.type == "gallery") {
					for (let a = 0; a < this._positions.length; a++) {
						if (a < this.pagesToShow || (a >= this._positions.length + distance && a < this._positions.length + distance + this.pagesToShow )) {
							pos.push(a % this.pagesToShow);
						} else {
							pos.push(-1);
						}
					}
				}
				
				this._callbacks.scrollPrevious.forEach((cb) => {
					cb(distance);
				});
			}
			// position all pages to correct place before move and remove hidden pages
			for (let a = 0; a < this._positions.length; a++) {
				let beforeMove = this.type == "slider" ? this.calcPagePos(pos[a], {raw: true}) : this.calcPagePos(pos[a], {direction: distance});
				if (beforeMove != "0px") {
					document
						.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`)
						.classList.remove(`roundabout-${this._uniqueId}-hidden-page`);
				}
				if (this.type == "gallery") {
					if (a < this.pagesToShow) {
						document.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`).classList.add(`roundabout-fadeout`);
					} else {
						document.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`).classList.remove(`roundabout-fadeout`);
					}
				}
				document.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`).style.left = beforeMove;
			}

			if (this.navigationTrim) {
				overflow = 0;
			}

			// transition wrapper if sliding
			if (!valuesOnly && this.type == "slider") {
				wrapper.style.left = this.calcPagePos(-distance, {wrap: true});
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

			this.onPage += distance;
			this._lastDx = 0;

			if (distance > 0 && this.onPage >= this.pages.length) {
				this.onPage -= this.pages.length;
			} else if (distance < 0 && this.onPage < 0) {
				this.onPage += this.pages.length;
			}

			// finished positioning
			if (!valuesOnly) {
				setTimeout(() => {
					if (this.type == "slider") {
						this.positionWrap(!valuesOnly);
					}
					this.positionPages();
					this._callbacks.scrollEnd.forEach((cb) => {
						cb();
					});
					if (distance > 0) {
						this._callbacks.scrollNextEnd.forEach((cb) => {
							cb();
						});
					} else if (distance < 0) {
						this._callbacks.scrollPreviousEnd.forEach((cb) => {
							cb();
						});
					}
				}, this.transition);
			} else {
				this.positionWrap(!valuesOnly);
				this.positionPages();
			}
			
			if (this.navigation) {
				this.setActiveBtn(
					this.type == "slider"
						? this.onPage + overflow
						: Math.floor(this.onPage / this.pagesToShow) % Math.floor(this.pages.length / this.pagesToShow)
				);
			}

			if ((this.lazyLoad == "hidden" || this.lazyLoad == "lazy-hidden") && (Math.abs(distance) == this.scrollBy)) {
				if (distance > 0) {
					this.load(this._orderedPages.slice(this.pagesToShow, this.pagesToShow + this.scrollBy));
				} else if (distance < 0) {
					this.load(this._orderedPages.slice(this._orderedPages.length - this.scrollBy, this._orderedPages.length));
				}
			}
		}
	}

	scrollTo(page, transition = true) {
		if (this._scrollIsAllowed && this.throttleNavigation && this.navigation) {
			this.setActiveBtn(
				this.type == "slider" ? this.onPage : Math.floor(this.onPage / this.pagesToShow) % Math.floor(this.pages.length / this.pagesToShow)
			);
		} else if (!this.throttleNavigation && this.navigation) {
			this.setActiveBtn(
				this.type == "slider" ? this.onPage : Math.floor(this.onPage / this.pagesToShow) % Math.floor(this.pages.length / this.pagesToShow)
			);
		}
		
		if (!this.infinite || this.navigationBehavior == "direction") {
			if (this.throttleNavigation) {
				this.scrollHandler(this, "scrollto", page - this.onPage);
			} else {
				this.scroll(page - this.onPage, transition);
			}
		} else {
			if (this.findOffset(this.onPage, page, "p") < this.findOffset(this.onPage, page, "n")) {
				if (this.throttleNavigation) {
					this.scrollHandler(this, "scrollto", -1 * this.findOffset(this.onPage, page, "p"), transition);
				} else {
					this.scroll(-1 * this.findOffset(this.onPage, page, "p"), transition);
				}
			} else {
				if (this.throttleNavigation) {
					this.scrollHandler(this, "scrollto", this.findOffset(this.onPage, page, "n"));
				} else {
					this.scroll(this.findOffset(this.onPage, page, "n"), transition);
				}
			}
		}
		this.load([...this._orderedPages.slice(0, this.pagesToShow + this.scrollBy), ...this._orderedPages.slice(this._orderedPages.length - this.scrollBy)]);
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

	scrollHandler(parent, from, distance, transition = true) {
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
		// requires scroll allowed and not dragging (slider type) or from follow (gallery type is ok)
		if (parent._scrollIsAllowed && (!parent._dragging || from == "follow")) {
			parent.scroll(sd, !transition);
			if ((parent.throttle && parent.throttleButtons && from != "key") || (parent.throttle && parent.throttleKeys && from == "key")) {
				parent._scrollIsAllowed = false;
				parent._swipeIsAllowed = false;
				setTimeout(() => {
					parent._scrollIsAllowed = true;
					parent._swipeIsAllowed = true;
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
		this._isAutoscrolling = true;
		setTimeout(() => {
			parent._isAutoscrolling = false;
			this._scrollIsAllowed = true;
		}, parent.transition);
		if (parent.autoscrollDirection.toLowerCase() == "left" && parent._scrollIsAllowed) {
			this._scrollIsAllowed = false;
			parent.scroll(-this.scrollBy);
		} else if (parent.autoscrollDirection.toLowerCase() == "right" && parent._scrollIsAllowed) {
			this._scrollIsAllowed = false;
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
		if (parent._isAutoscrolling || !parent._swipeIsAllowed) return
		event.preventDefault();
		parent._t = true;
		parent.tStart(event, parent);
	}

	// called once when touch or click starts
	tStart(event, parent) {
		if (parent._isAutoscrolling || !parent._swipeIsAllowed) return
		this._callbacks.dragStart.forEach((cb) => {
			cb(event);
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

		if (parent.swipeSpeedThreshold > 0) {
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
			parent.rotation == "none" ? (parent._sx = event.touches[0].clientX) : (parent._sx = parent.rotation * event.touches[0].clientY);
			parent.rotation == "none" ? (parent._x = event.touches[0].clientX) : (parent._x = parent.rotation * event.touches[0].clientY);
		} else {
			parent.rotation == "none" ? (parent._x = event.clientX) : (parent._x = parent.rotation * event.clientY);

			parent.rotation == "none" ? (parent._sx = event.clientX) : (parent._sx = parent.rotation * event.clientY);
		}

		document.addEventListener("mousemove", parent._boundFollow, false, { signal: parent._abort.swipe.signal });
		document.addEventListener("mouseup", parent._boundEnd, false, { signal: parent._abort.swipe.signal });
		
		if (parent._t) {
			document.addEventListener("touchmove", parent._boundFollow, false, { signal: parent._abort.swipe.signal });
			document.addEventListener("touchend", parent._boundEnd, false, { signal: parent._abort.swipe.signal });
			document.addEventListener("touchcancel", parent._boundEnd, false, { signal: parent._abort.swipe.signal });
		}
	}

	// called repeatedly while dragging
	follow(event, parent) {
		if (parent._dragging) {
			// capture movements
			if (parent._t) {
				parent.rotation == "none"
					? (parent._x = event.changedTouches[0].clientX)
					: (parent._x = parent.rotation * event.changedTouches[0].clientY);
			} else {
				parent.rotation == "none" ? (parent._x = event.clientX) : (parent._x = parent.rotation * event.clientY);
			}

			parent._dx = (parent._x - parent._sx) * parent.swipeMultiplier;

			// check if at an end and trying to scroll past
			if (
				!parent.infinite &&
				((parent.onPage == parent.pages.length - parent.pagesToShow && parent._dx < -1 * parent._lastDx) ||
					(parent.onPage == 0 && parent._dx > -1 * parent._lastDx))
			) {
				parent._atEnd = true;
			} else {
				parent._atEnd = false;
			}

			// resistant scrolling
			if (Math.abs(parent._dx) < document.querySelector(parent.parent).offsetWidth && parent.infinite) {
				parent._dx = (parent._x - parent._sx) * parent.swipeMultiplier;
			} else if (parent._dx < 0 && !parent.infinite) {
				if (parent.infinite) {
					parent._dx -= (parent._dx + document.querySelector(parent.parent).offsetWidth) * parent.swipeResistance;
				} else if (parent.pages.length - parent.pagesToShow == parent.onPage) {
					if (parent.swipeResistance == 1) {
						parent._dx = 0;
					} else if (parent._atEnd) {
						parent._dx -= (parent._dx + parent._lastDx) * parent.swipeResistance;
					}
				}
			} else if (parent._dx > 0 && !parent.infinite) {
				if (parent.infinite) {
					parent._dx -= (parent._dx - document.querySelector(parent.parent).offsetWidth) * parent.swipeResistance;
				} else if (parent._orderedPages[parent._orderedPagesMainIndex] === 0) {
					if (parent.swipeResistance == 1) {
						parent._dx = 0;
					} else if (parent._atEnd) {
						parent._dx -= (parent._dx + parent._lastDx) * parent.swipeResistance;
					}
				}
			}

			parent._dx += parent._lastDx;

			// get distance values
			let dist = Math.abs(parent._dx);
			parent.checkCanSnap(parent);

			parent._distPercent = dist / parent._calculatedPageSize;

			if (parent._distPercent != 0 && parent.interpolate.length > 0) {
				if (parent._distPercent > 1) parent._distPercent = 1;
				parent.interpolate.forEach((inter) => {
					if (parent._dx > 0) {
						document.querySelector(`.roundabout-${parent._uniqueId}-visible-page-${inter.between[0][0]}`).style.transition =
							inter.value + " 0s";
						let val = (inter.between[1][1] - inter.between[0][1]) * parent._distPercent + inter.between[0][1];
						let re = inter.unit.replace("$", val);
						document.querySelector(`.roundabout-${parent._uniqueId}-visible-page-${inter.between[0][0]}`).style[inter.value] = re;
					} else if (parent._dx < 0) {
						document.querySelector(`.roundabout-${parent._uniqueId}-visible-page-${inter.between[1][0]}`).style.transition =
							inter.value + " 0s";
						let val = (inter.between[0][1] - inter.between[1][1]) * parent._distPercent + inter.between[1][1];
						let re = inter.unit.replace("$", val);
						document.querySelector(`.roundabout-${parent._uniqueId}-visible-page-${inter.between[1][0]}`).style[inter.value] = re;
					}
				});
			}

			let totalSize =
				document.querySelector(`.roundabout-${parent._uniqueId}-page-` + parent._orderedPages[parent._orderedPagesMainIndex]).offsetWidth +
				parent.pageSpacing;

			// determine if snapping to the next page is allowed
			if (
				(dist >= totalSize && parent.infinite && parent.type == "slider") ||
				(dist >= totalSize &&
					!parent.infinite &&
					(parent.onPage < parent.pages.length - parent.pagesToShow ||
						(parent.onPage == parent.pages.length - parent.pagesToShow && parent._dx > 0)) &&
					(parent.onPage > 0 || (parent.onPage == 0 && parent._dx < 0)) ||
				(dist >= parent.swipeThreshold && parent.type == "gallery")
				)
			) {
				if (parent._dx > 0) { // come back
					if (parent.type == "slider") {
						parent.scroll(-1,true);
					} else if (parent.type == "gallery") {
						parent.scrollHandler(parent, "follow", -parent.scrollBy)
					}
					// parent.scroll(parent.type == "slider" ? -1 : -parent.scrollBy, parent.type == "slider" ? true : false);
				} else if (parent._dx < 0) {
					if (parent.type == "slider") {
						parent.scroll(1, true)
					} else if (parent.type == "gallery") {
						parent.scrollHandler(parent, "follow", parent.scrollBy)
					}
					// parent.scroll(parent.type == "slider" ? 1 : parent.scrollBy, parent.type == "slider" ? true : false);
				}
				parent._sx = parent._x * 1;
				parent._dx = 0;
				parent._lastDx = 0;
			} else if (parent.type == "slider") {
				document.querySelector(`.roundabout-${parent._uniqueId}-page-wrap`).style.left = parent._dx + "px";
			}
		}
	}

	checkCanSnap(parent, checkSpeed = false) {
		let dist = Math.abs(parent._dx);

		if (parent.swipeSnap) {
			// snap is enabled - using threshold and speed
			if (
				(dist >= parent.swipeThreshold && parent.infinite) || // (infinite and over threshold) OR
				(checkSpeed && parent.infinite) || // (infinite and checking for speed) OR
				((dist >= parent.swipeThreshold || checkSpeed) && // [(over threshold OR checking for speed) AND
					!parent.infinite && // not infinite AND
					(parent.onPage < parent.pages.length - parent.pagesToShow || // {is less than right end OR
						(parent.onPage == parent.pages.length - parent.pagesToShow && parent._dx > 0)) && // is at right and and moving left} AND
					(parent.onPage > 0 || (parent.onPage == 0 && parent._dx < 0))) // (is not at left end OR is at left end and is moving right)]
			) {
				if (checkSpeed && Math.abs(((parent._ex - parent._sx) / (parent._ste - parent._sts)) * 1000) > parent.swipeSpeedThreshold) {
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
				((parent.onPage == parent.pages.length - parent.pagesToShow && parent._dx < 0) || // (at right end and moving right OR
					(parent.onPage == 0 && parent._dx > 0)) // at left and and moving left
			) {
				parent._canSnap = false;
			} else {
				parent._canSnap = true;
			}
		}
	}

	// called once when the touch or click ends
	tEnd(event, parent) {
		parent._callbacks.dragEnd.forEach((cb) => {
			cb(event);
		});
		setTimeout(() => {
			parent._swipeIsAllowed = true;
		}, parent.throttleTimeout);

		if (parent.interpolate.length > 0) {
			for (let a = 0; a < parent.pages.length; a++) {
				let t = "";
				parent.interpolate.forEach((inter) => {
					if (!t.includes(inter.value)) {
						t += inter.value + " " + parent.transition / 1000 + "s, ";
					}
					document.querySelector(`.roundabout-${parent._uniqueId}-page-${a}`).style[inter.value] = "";
				});
				t = t.substr(0, t.length - 2) + ";";
				document.querySelector(`.roundabout-${parent._uniqueId}-page-${a}`).style.transition = "";
				document.querySelector(`.roundabout-${parent._uniqueId}-page-${a}`).style.transition = t;
			}
		}

		parent._distPercent = 0;

		document.querySelector(`.roundabout-${parent._uniqueId}-page-wrap`).classList.add(`roundabout-${parent._uniqueId}-has-transition`);
		document.querySelector(`.roundabout-${parent._uniqueId}-page-wrap`).classList.remove(`roundabout-has-no-transition`);

		parent._dragging = false;

		// log the end of touch position
		if (parent._t) {
			parent.rotation == "none"
				? (parent._ex = event.changedTouches[0].clientX)
				: (parent._ex = parent.rotation * event.changedTouches[0].clientY);
		} else {
			parent.rotation == "none" ? (parent._ex = event.clientX) : (parent._ex = parent.rotation * event.clientY);
		}

		if (!parent.swipeSnap) {
			parent._lastDx = parent._dx * 1;
		}

		if (parent.swipeSpeedThreshold > 0 && Math.abs(parent._dx) < parent.swipeThreshold) {
			parent._ste = Date.now();
			parent.checkCanSnap(parent, true);
		}
		
		// snap the page to the correct position, and reset for next swipe
		if (
			(parent.type == "slider" || (parent.type == "gallery" && Math.abs(parent._dx) < parent.swipeThreshold)) &&
			parent.swipeSnap || (!parent.swipeSnap && !parent._canSnap && parent._atEnd)) {
			parent.snap(parent._canSnap, parent._dx, parent);
			if (!parent.swipeSnap) {
				parent._lastDx = 0;
			}
		}
		parent.resetSwipeVars(parent);

		parent._abort.swipe.abort();
		parent._abort.swipe = new AbortController();
	}

	// snap to a new slide once touch or drag ends
	snap(al, dir, parent) {
		if (al) {
			if (dir > 0) {
				if (parent.type == "slider") {
					parent.positionWrap(false, 1);
				}
				parent.scrollHandler(parent, parent.type == "slider" ? "snap" : "snap-g", parent.type == "slider" ? -1 : -parent.scrollBy);
			} else if (dir < 0) {
				if (parent.type == "slider") {
					parent.positionWrap(false, -1);
				}
				parent.scrollHandler(parent, parent.type == "slider" ? "snap" : "snap-g", parent.type == "slider" ? 1 : parent.scrollBy);
			}
		} else if (parent.type == "slider") {
			parent.positionWrap(false, 0);
		}
	}

	// reset all variables to defaults to avoid strange movements when a new touch starts
	resetSwipeVars(parent) {
		if (parent.swipeSnap) {
			parent._sx = 0;
			parent._ex = 0;
			parent._x = 0;
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
			if (this.template) {
				let root = document.querySelector(this.template);
				let rootPos = Array.prototype.slice.call(root.parentNode.children).indexOf(root);
				let appendTo = root.parentNode;
				appendTo.removeChild(root);
				appendTo.insertBefore(newCarousel, appendTo.childNodes[rootPos + 2]);
			} else {
				document.querySelector(this.parent).appendChild(newCarousel);
			}
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
		}}.roundabout-has-no-transition{transition: left 0s; !important}.roundabout-error-message {position:relative;margin:auto;left:0;right:0;top:0;bottom:0;border-radius:5px;border:3px solid black;background: white;text-align:center;font-family:sans-serif;width:30%;}`;
		if (this.type == "gallery") {
			css += `.roundabout-${this._uniqueId}-hidden-page {opacity: 0; z-index: 0; visibility: hidden;} .roundabout-fadeout {opacity: 0}`;
			for (let a = 0; a < this.pagesToShow; a++) {
				css += `.roundabout-${this._uniqueId}-page-wrap .roundabout-${this._uniqueId}-visible-page-${a} {z-index: 1}`;
			}
		} else if (this.type == "slider") {
			css += `.roundabout-${this._uniqueId}-hidden-page {visibility: hidden;}`;
		}
		let newStyle = document.createElement("STYLE");
		newStyle.setAttribute("type", "text/css");
		newStyle.innerHTML = css;
		document.getElementsByTagName("head")[0].appendChild(newStyle);
	}

	parseTemplate() {
		let template = document.querySelector(this.template);
		for (let a = 0; a < template.childNodes.length; a++) {
			if (template.childNodes[a].nodeType == 1) {
				this._htmlTemplates.push({ root: template.childNodes[a], elements: template.childNodes[a].innerHTML.trim() });
			}
		}
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
			newPage.classList.add(`roundabout-${this._uniqueId}-page-${a}`, "roundabout-page", `roundabout-${this._uniqueId}-page`);
			let newPos;
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

			if (this.type == "slider") {
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
			} else if (this.type == "gallery") {
				newPos = this.calcPagePos(a);
			}
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
			} else if (this.lazyLoad == "lazy-hidden" && !this._handledLoad) {
				let initial = [];
				for (let b = -this.scrollBy; b < this.pagesToShow + this.scrollBy; b++) {
					let i = b;
					if (b < 0) {
						i = this.pages.length + b;
					}
					initial.push(i);
				}
				window.addEventListener("load", () => {
					this.load(initial);
				}, { signal: this._abort.all.signal });
				this._handledLoad = true;
			} else if (this.lazyLoad == "all" && !this._handledLoad) {
				this._handledLoad = true;
				window.addEventListener("load", () => {
					this.load(this._orderedPages);
				}, { signal: this._abort.all.signal });
			}
			if (this._htmlTemplates[a]) {
				newPage.innerHTML += this._htmlTemplates[a].elements;
				if (this._htmlTemplates[a].root.classList?.length) {
					newPage.classList.add(...this._htmlTemplates[a].root.classList);
				}
				if (this._htmlTemplates[a].root.id) {
					newPage.id = this._htmlTemplates[a].root.id;
				}
			}
			if (this.pages[a].html) {
				if (typeof this.pages[a].html === "string") {
					newPage.innerHTML += this.pages[a].html;
				} else {
					newPage.appendChild(this.pages[a].html);
				}
				if (this.pages[a].css) {
					pagesCss += this.pages[a].css;
				}
			}
			if (this.type == "gallery") {
				newPage.style.transition = `opacity ${this.transition / 1000}s ${this.transitionFunction}`;
			}
			document.querySelector(`.roundabout-${this._uniqueId}-page-wrap`).appendChild(newPage);
			this._orderedPages.push(a);

			if (this.type == "slider") {
				if (a <= this.pagesToShow + 1) {
					this._positions.push(newPos);
				} else {
					this._positions.push("0px");
				}
			} else if (this.type == "gallery") {
				if (a < this.pagesToShow) {
					this._positions.push(newPos);
				} else {
					this._positions.push("0px");
				}
			}

			if (a < this.pagesToShow) {
				document
					.querySelector(`.roundabout-${this._uniqueId}-page-${this._orderedPages[a]}`)
					.classList.add(`roundabout-${this._uniqueId}-visible-page-${a}`);
			}
		}

		if (this.type == "gallery") {
			document.querySelector(`.roundabout-${this._uniqueId}-page-wrap`).style.left = this.calcPagePos(0, {forceType: "slider"});
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
			let m = 1;
			if (this.type == "slider") {
				if (this.infinite || !this.navigationTrim) {
					numButtons = this.pages.length;
				} else {
					numButtons = this.pages.length - (this.pagesToShow - 1);
				}
			} else if (this.type == "gallery") {
				m = this.pagesToShow;
				numButtons = Math.floor(this.pages.length / this.pagesToShow);
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
					this.scrollTo(a * m);
				}, { signal: this._abort.all.signal });
			}
		}

		if (this.type == "slider") {
			this._positions.push(this._positions.shift());
		}

		this.positionPages();
	}

	// Destroys the HTML of the carousel
	destroy(regen = true, complete = false) {
		this._callbacks.beforeDestroy.forEach((cb) => {
			cb();
		});
		clearTimeout(this._scrollTimeoutHolder);
		clearInterval(this._scrollIntervalHolder);
		clearTimeout(this._scrollAfterTimeoutHolder);
		this._abort.all.abort();
		this._abort.all = new AbortController();
		this.pages.forEach(page => {
			page.isLoaded = false;
		});
		if (complete) {
			document.querySelector(this.id).remove();
		} else {
			document.querySelector(this.id).innerHTML = "";
			if (regen) {
				this._positions = [];
				this._orderedPages = [];
				try {
					if (this.initialActions(true)) {
						this.setListeners();
					}
				} catch (e) {
					console.error(`Error while attempting to regenerate Roundabout with id ${this.id}:`);
					console.error(e);
				}
			}
		}
		this._callbacks.afterDestroy.forEach((cb) => {
			cb();
		});
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
			if (lbp.width == -1) {
				this.activeBreakpoint = {};
			} else {
				this.activeBreakpoint = lbp;
			}
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
		if (this.template && !r) {
			this.parseTemplate();
		}
		if (this.checkForErrors(r)) {
			if (!r) roundabout.on++;
			if (this._allowInternalHTML) {
				this.defaultHTML(r);
			}
			if (this.autoscroll) {
				this.setAutoScroll(this, r);
			}
			if (!this.uiEnabled) {
				this.navigation = false;
				this.swipe = false;
			}
			if (this.rotation == "left") {
				this.rotation = -1;
			} else if (this.rotation == "right") {
				this.rotation = 1;
			}
			if (this.type == "gallery") {
				this.scrollBy = this.pagesToShow;
			}
			try {
				this.generatePages();
			} catch (e) {
				console.error(`Error while attempting to generate Roundabout with id ${this.id}:`);
				console.error(e);
			}
			this.interpolate.forEach((i) => {
				if (i.between[0][0] > i.between[1][0]) {
					this.interpolate[this.interpolate.indexOf(i)].between.push(this.interpolate[this.interpolate.indexOf(i)].between.shift());
				}
			});
			this._boundFollow = this._execMM.bind(this);
			this._boundEnd = this._execMU.bind(this);
			this._boundCancel = this._execMU.bind(this);
			return true;
		} else {
			return false;
		}
	}

	// Sets all required eventListeners for the carousel
	setListeners() {
		if (this.uiEnabled && this.buttons) {
			document.querySelector(`.roundabout-${this._uniqueId}-btn-next`).addEventListener("click", () => {
				this.scrollHandler(this, "listener", this.scrollBy);
			}, { signal: this._abort.all.signal });
			document.querySelector(`.roundabout-${this._uniqueId}-btn-prev`).addEventListener("click", () => {
				this.scrollHandler(this, "listener", -this.scrollBy);
			}, { signal: this._abort.all.signal });
		}
		if (this.keys) {
			document.addEventListener("keydown", (event) => {
				this.keyListener(event);
			}, { signal: this._abort.all.signal });
		}
		if (this.listenForResize) {
			setTimeout(() => {
				window.addEventListener("resize", () => {
					this.setBreakpoints();
				}, { signal: this._abort.all.signal });
			}, 0);
		}
		if (this.scrollwheel) {
			document.querySelector(this.id).addEventListener("wheel", (e) => {
				e.preventDefault();
				if (e.deltaY > 0) this.scrollHandler(this, "scroll", 1);
				if (e.deltaY < 0) this.scrollHandler(this, "wheel", -1);
			}, { signal: this._abort.all.signal });
		}
		this._calculatedPageSize = document.querySelector(`.roundabout-${this._uniqueId}-page-0`).offsetWidth;
		setTimeout(() => {
			window.addEventListener("resize", () => {
				this._calculatedPageSize = document.querySelector(`.roundabout-${this._uniqueId}-page-0`).offsetWidth;
			}, { signal: this._abort.all.signal });
		}, 0);
		if (this.autoscrollPauseOnHover) {
			document.querySelector(this.parent).addEventListener("mouseover", () => {
				this._scrollIsAllowed = false;
			}, { signal: this._abort.all.signal });
			document.querySelector(this.parent).addEventListener("mouseout", () => {
				this._scrollIsAllowed = true;
				this.resetScrollTimeout(true);
			}, { signal: this._abort.all.signal });
		}
		if (this.swipe) {
			document.querySelector(`.roundabout-${this._uniqueId}-swipe-overlay`).addEventListener(
				"mousedown",
				(event) => {
					this.tStart(event, this);
				},
				{capture: false, signal: this._abort.all.signal }
				// false
			);
			document.querySelector(`.roundabout-${this._uniqueId}-swipe-overlay`).addEventListener(
				"touchstart",
				(event) => {
					this.setTouch(event, this);
				},
				{capture: false, signal: this._abort.all.signal }
				// false
			);
			document.querySelectorAll(`.roundabout-${this._uniqueId}-page`).forEach(page => {
				page.addEventListener(
					"mousedown",
					(event) => {
						this.tStart(event, this);
					},
					{capture: false, signal: this._abort.all.signal }
					// false
				);
				page.addEventListener(
					"touchstart",
					(event) => {
						this.setTouch(event, this);
					},
					{capture: false, signal: this._abort.all.signal }
					// false
				);
			});
			
		}
	}

	// prevents breakage by providing constraints and displaying an error message
	checkForErrors(r) {
		if (this.ignoreErrors) {
			return true;
		}
		if (this._htmlTemplates.length < this.pages.length) {
			this.displayError("The number of 'pages' objects is greater than the number of pages in the template. Ensure that the number of 'pages' objects is equal to or less than the number of pages in the template.");
			return false;
		}
		if (this.pages.length < 2) {
			this.displayError("The minimum number of pages supported is 2.");
			return false;
		}
		if (this.pages.length - this.pagesToShow <= 0) {
			this.displayError("Too many pages are being displayed at once. There must be at least 2 fewer pages shown than the number of total pages.");
			return false;
		}
		if (this.pages.length == 2 && this.swipe && this.type == "slider") {
			this.displayError("Swipe is not supported on sliders with 2 pages.");
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
		if (this.pagesToShow < this.scrollBy && this.type == "slider") {
			this.displayError("'scrollBy' must be less than or equal to 'pagesToShow'.");
			return false;
		}
		if (this.type == "gallery" && this.navigation && this.pages.length % this.pagesToShow != 0) {
			this.displayError(
				"To enable navigation on 'gallery' mode carousels, the total number of pages must be divisible by the number of pages shown. This prevents different groups of pages corresponding the same navigation bubble."
			);
			return false;
		}
		if (this.type == "gallery" && this.interpolate.length > 0) {
			this.displayError("Interpolation is not supported by 'gallery' mode carousels.");
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
	load(pageIds = [], timeout = this.loadTimeout, a = false) {
		clearTimeout(this._loadTimeout);
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

				this._callbacks.load.forEach((cb) => {
					if (cb.pageId == this._loadQueue[0]) {
						cb.callback(this._loadQueue[0]);
					}
				});

				this._loadQueue.shift();
				this.load(this._loadQueue, timeout, true);
			};
			bgImg.src = this.pages[this._loadQueue[0]].backgroundImage;
			
			this._loadTimeout = setTimeout(() => {
				console.warn(`Loading image ${this._loadQueue[0]} timed out.`);
				bgImg.src = "";
				bgImg.onload = null;
				this._loadQueue.shift();
				this.load(this._loadQueue, timeout, true);
			}, timeout);
		} else {
			this._loadQueue.shift();
			this.load(this._loadQueue, timeout, true);
		}
	}

	// after a transition, places each page where they should be for the next transiton
	positionPages(pre = false) {
		for (let a = 0; a < this._positions.length; a++) {
			if (this._positions[a] == "0px") {
				document.querySelector(`.roundabout-${this._uniqueId}-page-${a}`).classList.add(`roundabout-${this._uniqueId}-hidden-page`);
				document.querySelector(`.roundabout-${this._uniqueId}-page-${a}`).style.left = this._positions[a];
			} else {
				document.querySelector(`.roundabout-${this._uniqueId}-page-${a}`).style.left = this._positions[a];
				document.querySelector(`.roundabout-${this._uniqueId}-page-${a}`).classList.remove(`roundabout-${this._uniqueId}-hidden-page`);

				if (!this.infinite && a == 0 && this.onPage > 1 && !this.showWrappedPage) {
					document.querySelector(`.roundabout-${this._uniqueId}-page-${a}`).classList.add(`roundabout-${this._uniqueId}-hidden-page`);
				}
				if (!this.infinite && a == this._positions.length - 1 && this.onPage == 0 && !this.showWrappedPage) {
					document
						.querySelector(`.roundabout-${this._uniqueId}-page-${this._positions.length - 1}`)
						.classList.add(`roundabout-${this._uniqueId}-hidden-page`);
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
		wrapper.style.left = this.calcPagePos(position, {wrap: true});
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
	
	// returns the correct css positioning of a page given its position, 0 being the leftmost visible page
	calcPagePos(pagePos, options = {wrap: false, forceType: this.type, direction: null, raw: false}) {
		if (options.forceType == undefined) {
			options.forceType = this.type;
		}
		if (pagePos == 0 && options.forceType == "slider" && !options.raw && (this.pageSpacingMode == "fill" || options.wrap)) {
			return "0px";
		}
		if (options.forceType == "gallery") {
			if (options.direction > 0 && pagePos >= this.pagesToShow * 2) {
				return "0px";
			}
			if (options.direction < 0 && (pagePos < -this.pagesToShow || pagePos >= this.pagesToShow)) {
				return "0px";
			}
			if (pagePos == -1) {
				return "0px";
			}
		}
		if (options.forceType == "slider") {
			pagePos += 1;
		}
		let spacesAdjust,
			spacesAdjust2,
			adjust = 0;
		if (this.pageSpacingMode == "evenly") {
			spacesAdjust = 1;
			spacesAdjust2 = 0;
			if (options.wrap) {
				adjust = -this.pageSpacing;
			}
		} else {
			spacesAdjust = -1;
			spacesAdjust2 = options.forceType == "slider" ? -1 : 0;
		}
		let newPos;
		if (options.forceType == "slider") {
			newPos =
				"calc((((100% - " +
				(this.pagesToShow + spacesAdjust) * this.pageSpacing + // remove space for spaces between pages
				this.pageSpacingUnits +
				") / " +
				this.pagesToShow + // remaining space is split between pages equally
				") * " +
				(pagePos - 1) + // position of the page (usually 0 to pagesToShow)
				") + " +
				(this.pageSpacing * (pagePos + spacesAdjust2) + adjust + this.pageSpacingUnits) + // adjustment for spacing
				")";
		} else if (options.forceType == "gallery") {
			newPos =
				"calc((((100% - " +
				(this.pagesToShow + spacesAdjust) * this.pageSpacing + // remove space for spaces between pages
				this.pageSpacingUnits +
				") / " +
				this.pagesToShow + // remaining space is split between pages equally
				") * " +
				(pagePos % this.pagesToShow) + // position of the page (usually 0 to pagesToShow)
				") + " +
				(this.pageSpacing * ((pagePos % this.pagesToShow) + spacesAdjust2) + adjust + this.pageSpacingUnits) + // adjustment for spacing
				")";
		}
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
