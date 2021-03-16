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

   onScrollNextEnd(carousel, callback) {
      carousel.subscribe("scrollNextEnd", callback);
   }

   onScrollPreviousEnd(carousel, callback) {
      carousel.subscribe("scrollPreviousEnd", callback);
   }

   scrollTo(carousel, pageId, transition = true) {
      carousel.scrollTo(pageId, !transition);
   }

   scrollNext(carousel, distance = -1, transition = true) {
      if (distance == -1) {
         carousel.scroll(carousel.scrollBy, !transition);
      } else {
         carousel.scroll(Math.abs(distance), !transition);
      }
   }

   scrollPrevious(carousel, distance = -1, transition = true) {
      if (distance == -1) {
         carousel.scroll(-carousel.scrollBy, !transition);
      } else {
         carousel.scroll(-1 * Math.abs(distance), !transition);
      }
   }

   scroll(carousel, distance, transition = true) {
      carousel.scroll(distance, !transition);
   }

   removePage(carousel, pageId) {
      carousel.pages.splice(pageId, 1);
      carousel.destroy();
   }

   addPage(carousel, page, index = -1) {
      if (index == -1) {
         carousel.pages.push(page);
      } else {
         carousel.pages.splice(index, 0, page);
      }
      carousel.destroy();
   }

   destroy(carousel, regenerate = true, removeWrap = false) {
      carousel.destroy(regenerate, removeWrap);
   }

   addPageElement(carousel, pageId, element, replace = false) {
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

   lazyLoad(carousel, pageIds, callback) {
      if (typeof pageIds != "object") {
         console.error("pageIds must be an array of integers");
      } else {
         pageIds.forEach(id => {
            carousel.subscribe("onLoad", { callback: callback, pageId: id });
         });
         if (!carousel._loadingPages) {
            carousel.load(pageIds);
         } else {
            pageIds.forEach(id => {
               carousel._loadQueue.push(id);
            });
         }
      }
   }

   setValue(carousel, setting, value) {
      if (setting.split("")[0] == "_") {
         console.error(`The setting ${setting} cannot be overridden.`);
      } else {
         carousel[setting] = value;
      }
   }
}