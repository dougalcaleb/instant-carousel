


class RoundaboutScripter {
   constructor() {

   }


   onScroll(r, callback) {
      r.subscribe("scroll", callback);
   }

   onScrollEnd(r, callback) {

   }
}


/*


subscribe(event, newCallback) {
      this.callbacks[event].push(newCallback);
   }


// scripting helpers
      this.callbacks = {
         "scroll": []
      }



*/