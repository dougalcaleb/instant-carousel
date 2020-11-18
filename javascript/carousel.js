/*
✔ = Complete  ⚠ = Partial  ✖ = Incomplete
INTENDED FEATURES:

3 TYPES
⚠  Static (including full-screen and multiview)
✖  Overlap
✖  Fade

SPECS (STATIC)
✖  Full-size subtype
✖  Multiple pages visible subtype
✖  Can define page size and show multiple dynamically or 
    define number to show and resize dynamically

SPECS (OVERLAP)
✖  Left subtype
✖  Right subtype
✖  Both subtype
✖  Can have a parallax effect

SPECS (FADE)
✖  Can move and fade simultaneously

HAS AUTOSCROLL
✔  Scrolls over an interval
✔  Pauses on interaction or hover
✔  Can go either direction

HTML
✔  Can be auto-genned
✖  Can be custom
✔  Includes default styles
✖  Can overwrite or create new styles
✖  When not autogenning, classes can be specified to use
    instead of the default class names

PAGES
✔  Can be as simple as an image URL
✖  Support for interactive pages
✖  Can define HTML and CSS per page for interactivity

SWIPE
✔  User can swipe to advance pages
✔  User can swipe past the edge and experience resistance
✖  A page always shows

BUBBLES
✖  Show current page and available pages
✖  Entirely customizable
✖  Can be disabled

MISC
✔  User interactions can be throttled
✔  Keys can be used to navigate
✖  Scrolling through pages with bubbles is smooth
✖  Responsive
✖  Can have multiple carousels in a single page with object constructors
⚠  Any relevant setting has a default, but can be overridden
✖  Unique class names
*/

class Carousel {
    constructor(settings) {

        // User defined

        this.pages = (settings.pages) ? settings.pages : {};

        this.type = (settings.type) ? settings.type : 0;
        this.subtype = (settings.subtype) ? settings.subtype : 0;
        this.parent = (settings.parent) ? settings.parent : "body";
        this.autoGenHTML = (settings.autoGenHTML == false) ? settings.autoGenHTML : true;
        this.autoGenCSS = (settings.autoGenCSS == false) ? settings.autoGenCSS : true;
        this.radioBubbles = (settings.radioBubbles == false) ? settings.radioBubbles : true;
        this.autoScroll = (settings.autoScroll) ? settings.autoScroll : false;
        this.autoScroll_speed = (settings.autoScroll_speed) ? settings.autoScroll_speed : 5000;
        this.autoScroll_timeout = (settings.autoScroll_timeout) ? settings.autoScroll_timeout : 15000;
        this.autoScroll_pauseOnHover = (settings.autoScroll_pauseOnHover) ? settings.autoScroll_pauseOnHover : false;
        this.autoScroll_startAfter = (settings.autoScroll_startAfter) ? settings.autoScroll_startAfter : 5000;
        this.autoScroll_direction = (settings.autoScroll_direction) ? settings.autoScroll_direction : "right";
        this.transition = (settings.transition) ? settings.transition : 300;
        this.throttle = (settings.throttle == false) ? settings.throttle : true;
        this.throttle_timeout = (settings.throttle_timeout) ? settings.throttle_timeout : 300;
        this.throttle_matchTransition = (settings.throttle_matchTransition) ? settings.throttle_matchTransition : false;
        this.keys = (settings.keys == false) ? settings.keys : true;
        this.infinite = (settings.infinite == false) ? settings.infinite : true;
        this.swipe = (settings.swipe == false) ? settings.swipe : true;
        this.swipe_threshold = (settings.swipe_threshold) ? settings.swipe_threshold : 300;
        this.swipe_multiplier = (settings.swipe_multiplier) ? settings.swipe_multiplier : 1;
        this.swipe_resistance = (settings.swipe_resistance) ? settings.swipe_resistance : 0.95;
        this.rtl = (settings.rtl) ? settings.rtl : false;
        this.typeSpecific = (settings.typeSpecific) ? settings.typeSpecific : {};

        this.typeSpecific.fade_offsetIn = (settings.typeSpecific && settings.typeSpecific.fade_offsetIn) ? settings.typeSpecific.fade_offsetIn : 20;
        this.typeSpecific.fade_offsetOut = (settings.typeSpecific && settings.typeSpecific.fade_offsetOut) ? settings.typeSpecific.fade_offsetOut : -20;
        this.typeSpecific.fade_offsetUnits = (settings.typeSpecific && settings.typeSpecific.fade_offsetUnits) ? settings.typeSpecific.fade_offsetUnits : "px";

        this.mobile = (settings.mobile) ? settings.mobile : {swipe_threshold: 50};
        this.mobile_breakpoint = (settings.mobile_breakpoint) ? settings.mobile_breakpoint : 700;

        this.dev__allowInternalStyles = (settings.dev__allowInternalStyles == false) ? settings.dev__allowInternalStyles : true;
        
        // Private

        // general
        this.orderedPages = [];
        this.orderedPositions = [];
        this.orderedPagesMainIndex = 0;
        this.scrollIsAllowed = true;
        this.onPage = 0;
        this.scrollMightBeAllowed = true;
        //swipe
        this.sx = 0;
        this.sy = 0;
        this.ex = 0;
        this.ey = 0;
        this.dx = 0;
        this.dy = 0;
        this.x = 0;
        this.y = 0;
        this.lastMove = null;
        this.t = false;
        this.dragging = false;
        this.canSnap = false;
        // autoscroll
        this.scrollTimeoutHolder = null;
        this.scrollIntervalHolder = null;
        // probably temporary
        this.pageOffset = 100;

        // Function calls
        this.initialActions();
        this.replaceWithMobile();
        this.setListeners();
        this.debug_output();

    } // end of constructor

    generatePages() {
        let leftSidePages = Math.floor((this.pages.length - 1) / 2);
        for (let a = 0; a < this.pages.length; a++) {
            let newPage = document.createElement("DIV");
            newPage.classList.add("carousel-page-"+a, "carousel-page");
            if (this.pages[a].imageURL) {
                newPage.style.background = "url("+this.pages[a].imageURL+")";
                newPage.style.backgroundSize = "cover";
                newPage.style.backgroundPosition = "center center";
            }
            newPage.style.left = (this.pageOffset * a + "%");
            newPage.style.transition = (this.transition/1000)+"s";
            document.querySelector(".carousel-page-wrap").appendChild(newPage);
            this.orderedPages.push(a);
            this.orderedPositions.push(a-leftSidePages);
        }

        this.orderedPagesMainIndex = leftSidePages/1;
        for (let b = 1; b <= leftSidePages; b++) {
            let targeting = document.querySelector(".carousel-page-wrap").children.length-b;
            document.querySelector(".carousel-page-wrap").children[targeting].style.left = (-b * this.pageOffset + "%");
            this.orderedPages.unshift(this.orderedPages.pop());
        }
    }

    scrollRight() { //! Both of these will probably need to be updated to accomodate multiple visible pages at once and different units than %
        if (this.onPage >= this.pages.length-1 && !this.infinite) {
            return;
        } else {
            for (let a = 0; a < this.pages.length; a++) {
                let currentPageOffset = parseFloat(document.querySelector(".carousel-page-"+a).style.left.split("%")[0]);
                currentPageOffset -= this.pageOffset;
                document.querySelector(".carousel-page-"+a).style.left = currentPageOffset+"%";
            }
            document.querySelector(".carousel-page-"+this.orderedPages[0]).classList.add("carousel-moving-page");
            document.querySelector(".carousel-page-"+arr_last(this.orderedPages)).classList.remove("carousel-moving-page");
            document.querySelector(".carousel-page-"+this.orderedPages[0]).style.left = arr_last(this.orderedPositions) * this.pageOffset + "%";
            this.onPage++;
            this.orderedPages.push(this.orderedPages.shift());
        }
    }

    scrollLeft() {
        if (this.onPage <= 0 && !this.infinite) {
            return;
        } else {
            for (let a = 0; a < this.pages.length; a++) {
                let currentPageOffset = parseFloat(document.querySelector(".carousel-page-"+a).style.left.split("%")[0]);
                currentPageOffset += this.pageOffset;
                document.querySelector(".carousel-page-"+a).style.left = currentPageOffset+"%";
            }
            document.querySelector(".carousel-page-"+arr_last(this.orderedPages)).classList.add("carousel-moving-page");
            document.querySelector(".carousel-page-"+this.orderedPages[0]).classList.remove("carousel-moving-page");
            document.querySelector(".carousel-page-"+arr_last(this.orderedPages)).style.left = this.orderedPositions[0] * this.pageOffset + "%";
            this.onPage--;
            this.orderedPages.unshift(this.orderedPages.pop());
        }
    }

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
        console.log(parent);
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
                        this.leftPressed(this);
                        break;
                    case "ArrowRight":
                        this.rightPressed(this);
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
            document.querySelector(".carousel-swipe-overlay").addEventListener("mousedown", (event) => {
                this.tStart(event, this);
            }, false);
            document.querySelector(".carousel-swipe-overlay").addEventListener("touchstart", (event) => {
                this.setTouch(event, this);
            }, false);
        }
    }


    /*
    =======================================================
    SWIPE
    =======================================================
    */

    setTouch(event, parent) {
        event.preventDefault();
        parent.t = true;
        parent.tStart(event, parent);
    }
    
    // called once when touch or click starts
    tStart(event, parent) {
        event.preventDefault();
        parent.dragging = true;
    
        // remove transitions to eliminate delayed movement
        document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex-1]).style.transition = "0s";
        document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex]).style.transition = "0s";
        document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex+1]).style.transition = "0s";
    
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
    
        document.addEventListener("mousemove", (event) => {
            parent.follow(event, parent);
        }, false);
        document.addEventListener("touchmove", (event) => {
            parent.follow(event, parent);
        }, false);
    
        document.addEventListener("mouseup", (event) => {
            parent.tEnd(event, parent);
        }, false);
        document.addEventListener("touchend", (event) => {
            parent.tEnd(event, parent);
        }, false);
        document.addEventListener("touchcancel", (event) => {
            parent.tCancel(event, parent);
        }, false);
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
    
            // resistant scrolling
            if (Math.abs(parent.dx) < document.querySelector(parent.parent).offsetWidth && parent.infinite) {
                parent.dx = (parent.x-parent.sx)*parent.swipe_multiplier;
                parent.dy = (parent.y-parent.sy)*parent.swipe_multiplier;
            } else if (parent.dx < 0) {
                parent.dx = (parent.x-parent.sx)*parent.swipe_multiplier;
                if (parent.infinite) {
                    parent.dx -= (parent.dx + document.querySelector(parent.parent).offsetWidth)*parent.swipe_resistance;
                } else if (parent.orderedPages[parent.orderedPagesMainIndex] === parent.pages.length-1) {
                    parent.dx -= (parent.dx)*parent.swipe_resistance;
                }
                parent.dy = (parent.y-parent.sy)*parent.swipe_multiplier;
            } else if (parent.dx >= 0) {
                parent.dx = (parent.x-parent.sx)*parent.swipe_multiplier;
                if (parent.infinite) {
                    parent.dx -= (parent.dx - document.querySelector(parent.parent).offsetWidth)*parent.swipe_resistance;
                } else if (parent.orderedPages[parent.orderedPagesMainIndex] === 0) {
                    parent.dx -= (parent.dx*parent.resist);
                }
                parent.dy = (parent.y-parent.sy)*parent.swipe_multiplier;
            }
    
            // get distance values
            let rawDist = (Math.pow(parent.dx, 2) + Math.pow(parent.dy, 2));
            let dist = Math.sqrt(rawDist);
    
            // if user has swiped far enough, allow movement to next slide
            if (dist >= parent.swipe_threshold) {
                parent.canSnap = true;
            } else {
                parent.canSnap = false;
            }
            // move slides to the correct position while being dragged
            document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex-1]).style.left = "calc(-100% + "+parent.dx+"px)";
            document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex]).style.left = parent.dx+"px";
            document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex+1]).style.left = "calc(100% + "+parent.dx+"px)";
        } else {
            // if not dragging, restore correct values
            document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex-1]).style.transition = parent.transition/1000+"s";
            document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex]).style.transition = parent.transition/1000+"s";
            document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex+1]).style.transition = parent.transition/1000+"s";

            document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex-1]).style.left = "-100%";
            document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex]).style.left = "0";
            document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex+1]).style.left = "100%";
        }
    }
    
    // called once when the touch or click ends
    tEnd(event, parent) {
        parent.dragging = false;
    
        // log the end of touch position
        if (parent.t) {
            parent.ex = event.changedTouches[0].clientX;
            parent.ey = event.changedTouches[0].clientY;
        } else {
            parent.ex = event.clientX;
            parent.ey = event.clientY;
        }
    
        parent.snap(parent.canSnap, parent.dx, parent);

        parent.resetSwipeVars(parent);
    
        document.removeEventListener("mousemove", (event) => {parent.follow(event, parent);}, false);
        document.removeEventListener("touchmove", (event) => {parent.follow(event, parent);}, false);

        document.removeEventListener("mouseup", (event) => {parent.tEnd(event, parent);}, false);
        document.removeEventListener("touchend", (event) => {parent.tEnd(event, parent);}, false);
        document.removeEventListener("touchcancel", (event) => {parent.tCancel(event, parent);}, false);
    }
    
    // when touch is canceled, handle it
    tCancel(event, parent) {
        event.preventDefault();
        document.removeEventListener("mouseup", (event) => {parent.tEnd(event, parent);}, false);
        document.removeEventListener("touchend", (event) => {parent.tEnd(event, parent);}, false);
        document.removeEventListener("touchcancel", (event) => {parent.tCancel(event, parent);}, false);
    }
    
    // snap to a new slide once touch or click ends
    snap(al, dir, parent) {
        document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex-1]).style.transition = parent.transition/1000+"s";
        document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex]).style.transition = parent.transition/1000+"s";
        document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex+1]).style.transition = parent.transition/1000+"s";
        if (al) {
            if (dir > 0) {
                parent.leftPressed(parent);
            } else if (dir < 0) {
                parent.rightPressed(parent);
            }
        } else {
            document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex-1]).style.left = "-100%";
            document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex]).style.left = "0";
            document.querySelector(".carousel-page-"+parent.orderedPages[parent.orderedPagesMainIndex+1]).style.left = "100%";
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
        parent.dy = 0;
        parent.lastMove = [];
        parent.t = false;
        parent.canSnap = false;
    }












    // Generates the default HTML structure
    defaultHTML() {
        let html = `<div class="carousel-swipe-overlay"></div><div class="carousel-page-wrap"></div></div><div class="carousel-nav"><div class="btn-r nav-btn"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg></div><div class="btn-l nav-btn"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg></div><div class="radio-btn-wrap"><div class="radio-btn rbtn-0"></div><div class="radio-btn rbtn-1"></div><div class="radio-btn rbtn-2"></div></div></div>`;
        document.querySelector(this.parent).innerHTML = html;
    }

    // Generates the default CSS styling
    defaultCSS() {
        let css = `.carousel-wrap,.carousel-wrap .carousel-nav .nav-btn svg{position:absolute;left:0;right:0;top:0;bottom:0;margin:auto}.carousel-wrap .carousel-nav .radio-btn-wrap{position:absolute;left:0;right:0;margin:auto}.carousel-wrap .carousel-nav .nav-btn{position:absolute;top:0;bottom:0;margin:auto}.carousel-wrap{height:calc(100% - 50px);width:calc(100% - 50px);background:gray}.carousel-wrap .carousel-nav{height:100%;width:100%}.carousel-wrap .carousel-nav .nav-btn{height:80px;width:80px;cursor:pointer;color:white;}.carousel-wrap .carousel-nav .nav-btn svg{height:70px}.carousel-wrap .carousel-nav .btn-l{left:0px}.carousel-wrap .carousel-nav .btn-r{right:0px}.carousel-wrap .carousel-nav .radio-btn-wrap{display:flex;justify-content:space-evenly;bottom:0;height:40px;width:25%}.carousel-wrap .carousel-nav .radio-btn-wrap .radio-btn{border-radius:100%;border:2px solid #fff;height:15px;width:15px;align-self:center;cursor:pointer} .carousel-page-wrap{width:100%;height:100%;overflow:hidden;position:absolute;} .carousel-swipe-overlay{width:calc(100% - 140px);height:calc(100% - 40px);top:0;left:0;right:0;position:absolute;margin:auto;z-index:2}`;
        let newStyle = document.createElement("STYLE");
        newStyle.setAttribute("type", "text/css");
        newStyle.innerHTML = css;
        document.getElementsByTagName("head")[0].appendChild(newStyle);
    }

    // Generates the required CSS. Seperate from default styling
    internalCSS() {
        let css = `.carousel-moving-page{opacity:0;transition:0;z-index:-100}`;
        let newStyle = document.createElement("STYLE");
        newStyle.setAttribute("type", "text/css");
        newStyle.innerHTML = css;
        document.getElementsByTagName("head")[0].appendChild(newStyle);
    }

    // If mobile replacement values are provided, the defaults are overridden when the screen is assumed to be that of a mobile
    replaceWithMobile() {
        if (screen.width <= this.mobile_breakpoint) {
            let c = Object.entries(this);
            let cm = Object.entries(this.mobile);
            for (let a = 0; a < obj_length(this.mobile); a++) {
                for (let b = 0; b < obj_length(this); b++) {
                    if (c[b][0] == cm[a][0]) {
                        this[""+c[b][0]] = cm[a][1];
                    }
                }
            }
        }
    }

    // Runs through applicable settings and takes actions based on them. Mostly to reduce constructor clutter
    initialActions() {
        if (this.autoGenHTML) {
            this.defaultHTML();
        }
        if (this.autoGenCSS && this.dev__allowInternalStyles) {
            this.defaultCSS();
        }
        if (this.dev__allowInternalStyles) {
            this.internalCSS();
        }
        if (this.throttle_matchTransition) {
            this.throttle_timeout = this.transition;
        }
        if (this.autoScroll) {
            this.setAutoScroll(this, true);
        }
        this.generatePages();
    }




    debug_output() {
        console.log(this.orderedPages);
    }
}


Carousel.prototype.rightPressed = function(parent) {
    parent.resetScrollTimeout();
    if (parent.scrollIsAllowed) {
        parent.scrollRight();
        if (parent.throttle) {
            parent.scrollIsAllowed = false;
            setTimeout(() => {
                parent.scrollIsAllowed = true;
            }, parent.throttle_timeout);
        }
    }
};

Carousel.prototype.leftPressed = function(parent) {
    parent.resetScrollTimeout();
    if (parent.scrollIsAllowed) {
        parent.scrollLeft();
        if (parent.throttle) {
            parent.scrollIsAllowed = false;
            setTimeout(() => {
                parent.scrollIsAllowed = true;
            }, parent.throttle_timeout);
        }
    }
};








// TYPICAL FUNCTIONS


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

function arr_last(arr) {
    if (typeof arr !== "object") {
        return "INVALID PARAMETERS";
    }
    return arr[arr.length-1];
}

function arr_rotate(arr, dir = 1) {
    if (typeof arr !== "object") {
        return "INVALID PARAMETERS";
    }
    if (dir === 0) {        // left
        arr.push(arr[0]);
        arr.shift();
        return arr;
    } else if (dir === 1) { // right
        arr.unshift(arr_last(arr));
        arr.pop();
        return arr;
    } else {
        return "INVALID DIRECTION";
    }
}