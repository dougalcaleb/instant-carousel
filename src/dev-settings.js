const rs = new RoundaboutScripter();
const c = new Roundabout({

   type: "gallery",

   pagesToShow: 3,
   scrollBy: 1,
   transition: 300,

   // navigation: false,
   transitionFunction: "ease-in-out",
   pageSpacing: 10,
   pageSpacingUnits: "px",

   // pageSpacingMode: "evenly",

   throttleTimeout: 300,
   // swipe: false,
   // navigationBehavior: "direction",
   // ignoreErrors: true,
   // swipeSnap: false,

   // interpolate: [
   //    {
   //       value: "height",
   //       between: [
   //          [0, 80],
   //          [1,100],
   //       ],
   //       unit: "$%",
   //    },
   //    {
   //       value: "height",
   //       between: [
   //          [2, 80],
   //          [1, 100],
   //       ],
   //       unit: "$%",
   //    },

   //    {
   //       value: "opacity",
   //       between: [
   //          [0, 0.1],
   //          [1,1],
   //       ],
   //       unit: "$",
   //    },
   //    {
   //       value: "opacity",
   //       between: [
   //          [1, 1],
   //          [2, 0.1],
   //       ],
   //       unit: "$",
   //    },

      
   // ],

   listenForResize: true,

   pages: [
      {
         backgroundImage: "../images/numbers/0.png",
         // html: "<a href='https://github.com/dougalcaleb/roundabout' target='_blank'><button class='toRepo'>Go to Roundabout repo</button></a>",
         // css: ".toRepo {position: absolute; left: 0; right: 0; margin: auto; top: 30px; z-index: 3; border: 3px solid white; background: none; color: white; outline: none; cursor: pointer;}"
         // html: "PAGE ZERO"
      },
      {
         backgroundImage: "../images/numbers/1.png"
         // html: "PAGE ONE"
      },
      {
         backgroundImage: "../images/numbers/2.png"
         // html: "PAGE TWO"

      },
      {
         backgroundImage: "../images/numbers/3.png"
         // html: "<br/>PAGE THREE"

      },
      {
         backgroundImage: "../images/numbers/4.png"
         // html: "<br/>PAGE FOUR"

      },
      {
         backgroundImage: "../images/numbers/5.png"
         // html: "<br/>PAGE FIVE"

      },
      {
         backgroundImage: "../images/numbers/6.png"
         // html: "PAGE SIX"

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
      // {
      //    backgroundImage: "../images/numbers/15.png"
      // }
   ]
});

// rs.onScrollEnd(c, () => {
//    console.log("-----------------------");
//    console.log(c._scrollTimeoutHolder, c._scrollIntervalHolder, c._scrollAfterTimeoutHolder);
//    console.log("-----------------------");
//    console.log("-----------------------");
// });

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

// setInterval(() => {
//    console.log(c._atEnd);
// }, 100);