/* 
SCRIPTING
On Functions
✔ onScroll(callback, includeAutoscroll)
✔ onScrollEnd(callback, includeAutoscroll)
✔ onDragStart(callback)
✔ onDragEnd(callback)
✔ onScrollRight(callback, includeAutoscroll)
✔ onScrollLeft(callback, includeAutoscroll)
✖ onScrollRightEnd(callback, includeAutoscroll)
✖ onScrollLeftEnd(callback, includeAutoscroll)
✔ setValue(setting, value)
-  Change page stuff?
Methods
✖ Change page elements
✔ scrollTo(page)
✔ destroy(regen, complete)
✔ Scroll next/prev
✖ Pause/play autoscroll
✖ Add page
✖ Remove page
✖ Update page
✔ Load page image
Properties
✖ Classlist
✖ Drag position
✖ onPage
✖ Active breakpoint
Misc
✖ Async lazy load promises
*/


class RoundaboutScripter {
   constructor() { }
   
   // on__(carousel, callback) {
   //    carousel.subscribe("", callback)
   // }

   onScroll(carousel, callback) {
      carousel.subscribe("scroll", callback);
   }

   onScrollEnd(carousel, callback) {
      carousel.subscribe("scrollEnd", callback);
   }

   onDragStart(carousel, callback) {
      carousel.subscribe("dragStart", callback);
   }

   onDragEnd(carousel, callback) {
      carousel.subscribe("dragEnd", callback)
   }

   onScrollNext(carousel, callback) {
      carousel.subscribe("scrollNext", callback)
   }

   onScrollPrevious(carousel, callback) {
      carousel.subscribe("scrollPrevious", callback)
   }

   scrollTo(carousel, pageId) {
      carousel.scrollTo(pageId);
   }

   scrollNext(carousel) {
      carousel.scroll(carousel.scrollBy, false);
   }

   scrollPrevious(carousel) {
      carousel.scroll(-carousel.scrollBy, false)
   }

   destroy(carousel, regenerate = true, removeWrap = false) {
      carousel.destroy(regenerate, removeWrap);
   }

   lazyLoad(carousel, pageId) {
      carousel._loadQueue.push(pageId);
   }

   setValue(carousel, setting, value) {
      if (setting.split("")[0] == "_") {
         console.error(`The setting ${setting} cannot be overridden.`)
      } else {
         carousel[setting] = value;
      }
   }
}