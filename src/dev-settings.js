import Roundabout from "./roundabout.js";
import RoundaboutScripter from "./roundabout-scripting.js"

const RS = RoundaboutScripter;

const c = new Roundabout({
   parent: "body",
   id: ".example",
   // transition: 5000,
   // throttleTimeout: 5000,
   pages: [
      {
         backgroundImage: "./images/numbers/0.png"
      },
      {
         backgroundImage: "./images/numbers/1.png"
      },
      {
         backgroundImage: "./images/numbers/2.png"
      },
      {
         backgroundImage: "./images/numbers/3.png"
      },
      {
         backgroundImage: "./images/numbers/4.png"
      },
      {
         backgroundImage: "./images/numbers/5.png"
      },
   ]
});
