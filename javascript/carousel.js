/*
INTENDED FEATURES:

3 TYPES
✖  Static (including full-screen and multiview)
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
✖  Scrolls over an interval
✖  Pauses on interaction or hover
✖  Can go either direction

HTML
✖  Can be auto-genned
✖  Can be custom
✖  Includes default styles
✖  Can overwrite or create new styles

PAGES
✖  Can be as simple as an image URL
✖  Support for interactive pages
✖  Can define HTML and CSS per page for interactivity

SWIPE
✖  User can swipe to advance pages
✖  User can swipe past the edge and experience resistance
✖  A page always shows

MISC
✖  User interactions can be throttled
✖  Keys can be used to navigate
✖  Scrolling through pages with bubbles is smooth
✖  Responsive
✖  Can have multiple carousels in a single page with object constructors
*/

class Carousel {
    constructor(settings) {

        // User Defined

        this.type = (settings.type) ? settings.type : 0;
        this.subtype = (settings.subtype) ? settings.subtype : 0;
        this.parent = (settings.parent) ? settings.parent : "body";
        this.autoGenHTML = (settings.autoGenHTML) ? settings.autoGenHTML : true;
        this.radioBubbles = (settings.radioBubbles) ? settings.radioBubbles : true;
        this.autoScroll = (settings.autoScroll) ? settings.autoScroll : false;
        this.autoScroll_speed = (settings.autoScroll_speed) ? settings.autoScroll_speed : 5000;
        this.autoScroll_timeout = (settings.autoScroll_timeout) ? settings.autoScroll_timeout : 15000;
        this.autoScroll_direction = (settings.autoScroll_direction) ? settings.autoScroll_direction : "r";
        this.transition = (settings.transition) ? settings.transition : 300;
        this.throttle = (settings.throttle) ? settings.throttle : true;
        this.throttle_timeout = (settings.throttle_timeout) ? settings.throttle_timeout : 100;
        this.throttle_matchTransition = (settings.throttle_matchTransition) ? settings.throttle_matchTransition : true;
        this.keys = (settings.keys) ? settings.keys : true;
        this.infinite = (settings.infinite) ? settings.infinite : true;
        this.swipe = (settings.swipe) ? settings.swipe : true;
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

        this.dev__allowInternalStyles = (settings.dev__allowInternalStyles) ? settings.dev__allowInternalStyles : true;
        
        // Private

        this.sx = 0;
        this.sy = 0;
        this.ex = 0;
        this.ey = 0;
        this.x = 0;
        this.y = 0;
        this.lastMove = null;
        this.t = false;
        this.dragging = false;
        this.canSnap = false;

        // Function calls
        this.replaceWithMobile();
        this.setListeners();
        this.output();

        /*
        this.val = (settings.val) ? settings.val : "default";
        */
    } // end of constructor


    scrollRight() {}

    scrollLeft() {}

    rightPressed() {}

    leftPressed() {}

    setListeners() {}

    createHTML() {
        let html = ``;
    }

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




    output() {
        
    }
}









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