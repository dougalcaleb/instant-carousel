const rs = new RoundaboutScripter();
const c = new Roundabout({

   type: "gallery", // normal should be slider

   pagesToShow: 3,
   scrollBy: 1,
   transition: 300,

   navigation: false,
   transitionFunction: "ease-in-out",
   pageSpacing: 10,
   pageSpacingUnits: "px",

   // pageSpacingMode: "evenly",

   throttleTimeout: 300,
   // rotation: "left",

   // lazyLoad: "no-load",

   // breakpoints: [
   //    {
   //       width: 1500,
   //       pagesToShow: 3,
   //       scrollBy: 3,
   //       // navigation: false,
   //       swipeThreshold: 50
   //    },
   //    {
   //       width: 1000,
   //       pagesToShow: 2,
   //       scrollBy: 2,
   //       navigation: false,
   //       swipeThreshold: 50
   //    }
   // ],

   listenForResize: true,

   pages: [
      {
         backgroundImage: "../images/numbers/0.png",
         // html: "<a href='https://github.com/dougalcaleb/roundabout' target='_blank'><button class='toRepo'>Go to Roundabout repo</button></a>",
         // css: ".toRepo {position: absolute; left: 0; right: 0; margin: auto; top: 30px; z-index: 3; border: 3px solid white; background: none; color: white; outline: none; cursor: pointer;}"
      },
      {
         backgroundImage: "../images/numbers/1.png"
      },
      {
         backgroundImage: "../images/numbers/2.png"
      },
      {
         backgroundImage: "../images/numbers/3.png"
      },
      {
         backgroundImage: "../images/numbers/4.png"
      },
      {
         backgroundImage: "../images/numbers/5.png"
      },
      {
         backgroundImage: "../images/numbers/6.png"
      },
      {
         backgroundImage: "../images/numbers/7.png"
      },
      {
         backgroundImage: "../images/numbers/8.png"
      },
      {
         backgroundImage: "../images/numbers/9.png"
      },
      {
         backgroundImage: "../images/numbers/10.png"
      },
      {
         backgroundImage: "../images/numbers/11.png"
      },
      {
         backgroundImage: "../images/numbers/12.png"
      },
      {
         backgroundImage: "../images/numbers/13.png"
      },
      {
         backgroundImage: "../images/numbers/14.png"
      },
      {
         backgroundImage: "../images/numbers/15.png"
      }
   ]
});

rs.onScroll(c, () => {
   console.log("Scroll Start");
});

rs.onScrollEnd(c, () => {
   console.log("-----------------------");
   console.log(c._scrollTimeoutHolder, c._scrollIntervalHolder, c._scrollAfterTimeoutHolder);
   console.log("-----------------------");
   console.log("-----------------------");
});

// rs.onDragStart(c, () => {
//    console.log("Drag start");
// });

// rs.onDragEnd(c, () => {
//    console.log("Drag ended");
// });

// rs.onScrollNext(c, () => {
//    console.log("Scrolled Next");
// });

// rs.onScrollPrevious(c, () => {
//    console.log("Scrolled Previous");
// });

// function set() {
//    rs.setValue(c, "pagesToShow", 2);
//    rs.setValue(c, "scrollBy", 2);
//    rs.destroy(c);
// }
