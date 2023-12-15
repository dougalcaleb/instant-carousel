/* 
SCRIPTING
On Functions
✔ onScroll(callback, includeAutoscroll)
✔ onScrollEnd(callback, includeAutoscroll)
✔ onDragStart(callback)
✔ onDragEnd(callback)
✔ onScrollRight(callback, includeAutoscroll)
✔ onScrollLeft(callback, includeAutoscroll)
✔ onScrollRightEnd(callback, includeAutoscroll)
✔ onScrollLeftEnd(callback, includeAutoscroll)
✔ setValue(setting, value)
Methods
✔ Change page elements
✔ scrollTo(page)
✔ destroy(regen, complete)
✔ Scroll next/prev
✖ Pause/play autoscroll
✔ Add page
✔ Remove page
✔ Load page image
Properties
✖ Drag position
✔ onPage
✔ Active breakpoint
Misc
✔ Async lazy load promises
*/


export default class RoundaboutScripter {
   constructor() { }
   
   // on__(carousel, callback) {
   //    carousel.subscribe("", callback)
   // }

   // 1 param
   static onScroll(carousel, callback) {
      carousel.subscribe("scroll", callback);
   }

   static onScrollEnd(carousel, callback) {
      carousel.subscribe("scrollEnd", callback);
   }

   static onDragStart(carousel, callback) {
      carousel.subscribe("dragStart", callback);
   }

   static onDragEnd(carousel, callback) {
      carousel.subscribe("dragEnd", callback)
   }

   // 1 param
   static onScrollNext(carousel, callback) {
      carousel.subscribe("scrollNext", callback)
   }

   // 1 param
   static onScrollPrevious(carousel, callback) {
      carousel.subscribe("scrollPrevious", callback)
   }

   static onScrollNextEnd(carousel, callback) {
      carousel.subscribe("scrollNextEnd", callback);
   }

   static onScrollPreviousEnd(carousel, callback) {
      carousel.subscribe("scrollPreviousEnd", callback);
   }

   static scrollTo(carousel, pageId, transition = true) {
      carousel.scrollTo(pageId, !transition);
   }

   static beforeDestroy(carousel, callback) {
      carousel.subscribe("beforeDestroy", callback);
   }

   static afterDestroy(carousel, callback) {
      carousel.subscribe("afterDestroy", callback);
   }

   static scrollNext(carousel, distance = -1, transition = true) {
      if (distance == -1) {
         carousel.scroll(carousel.scrollBy, !transition);
      } else {
         carousel.scroll(Math.abs(distance), !transition);
      }
   }

   static scrollPrevious(carousel, distance = -1, transition = true) {
      if (distance == -1) {
         carousel.scroll(-carousel.scrollBy, !transition);
      } else {
         carousel.scroll(-1 * Math.abs(distance), !transition);
      }
   }

   static scroll(carousel, distance, transition = true) {
      carousel.scroll(distance, !transition);
   }

   static throttledScroll(carousel, distance) {
      carousel.scrollHandler(carousel, "script", distance);
   }

   static removePage(carousel, pageId) {
      carousel.pages.splice(pageId, 1);
      carousel.destroy();
   }

   static addPage(carousel, page, index = -1) {
      if (index == -1) {
         carousel.pages.push(page);
      } else {
         carousel.pages.splice(index, 0, page);
      }
      carousel.destroy();
   }

   static destroy(carousel, regenerate = true, removeWrap = false) {
      carousel.destroy(regenerate, removeWrap);
   }

   static addPageElement(carousel, pageId, element, replace = false) {
      if (replace) {
         if (typeof element == "object") {
            document.querySelector(`.roundabout-${carousel._uniqueId}-page-${pageId}`).innerHTML = "";
            document.querySelector(`.roundabout-${carousel._uniqueId}-page-${pageId}`).appendChild(element);
         } else if (typeof element == "string") {
            document.querySelector(`.roundabout-${carousel._uniqueId}-page-${pageId}`).innerHTML = element;
         }
      } else {
         if (typeof element == "object") {
            document.querySelector(`.roundabout-${carousel._uniqueId}-page-${pageId}`).appendChild(element);
         } else if (typeof element == "string") {
            document.querySelector(`.roundabout-${carousel._uniqueId}-page-${pageId}`).innerHTML += element;
         }
      }
   }

   static lazyLoad(carousel, pageIds, callback, timeout) {
      if (typeof pageIds != "object") {
         console.error("pageIds must be an array of integers");
      } else {
         pageIds.forEach(id => {
            carousel.subscribe("load", { callback: callback, pageId: id });
         });
         if (!carousel._loadingPages) {
            carousel.load(pageIds, timeout);
         } else {
            pageIds.forEach(id => {
               carousel._loadQueue.push(id);
            });
         }
      }
   }

   static setValue(carousel, setting, value) {
      if (setting.split("")[0] == "_") {
         console.error(`The setting ${setting} cannot be overridden.`);
      } else {
         carousel[setting] = value;
      }
   }
}