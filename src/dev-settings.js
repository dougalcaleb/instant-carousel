const c = new Roundabout({
   // pagesToShow: 3,
   // scrollBy: 3,
   transition: 200,
   // pageSpacing: 10,
   // pageSpacingUnits: "px",
   swipeThreshold: 1000,

   // pageSpacingMode: "evenly",

   throttleTimeout: 200,
   // swipeSnap: false,
   // infinite: false,
   throttleSwipe: false,
   // initOnly: true,

   swipeSpeed: 1500, // pixels per second

   // swipeInertia: true, // movement continues

   //! TEST NON-INFINITE A LOT

   pages: [
      {
         backgroundImage: "../images/numbers/0.png",
         html: "<a href='https://github.com/dougalcaleb/roundabout' target='_blank'><button class='toRepo'>Go to Roundabout repo</button></a>",
         css: ".toRepo {position: absolute; left: 0; right: 0; margin: auto; top: 30px; z-index: 3; border: 3px solid white; background: none; color: white; outline: none; cursor: pointer;}"
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

// const c2 = new Roundabout({
//    id: ".bruh",
//    pages: [
//       {
//          backgroundImage: "../images/numbers/1.png"
//       },
//       {
//          backgroundImage: "../images/numbers/2.png"
//       },
//       {
//          backgroundImage: "../images/numbers/3.png"
//       },
//       {
//          backgroundImage: "../images/numbers/4.png"
//       },
//    ]
// });