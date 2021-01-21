const c1 = new Roundabout({
   pages: [
      {
         background_image: "../images/numbers/0.png",
         html: `<a href="https://github.com/dougalcaleb/roundabout" target="_blank"><button>GO TO REPO</button></a>`,
         css: "button {border: none; border-radius: 5px;}"
      },
      {
         background_image: "../images/numbers/1.png",
         html: `<a href="https://github.com/dougalcaleb/roundabout" target="_blank"><div class="bruh">GO TO REPO</div></a>`,
         css: ".bruh {background: orange}"
      },
      {
         background_image: "../images/numbers/2.png"
      },
      {
         background_image: "../images/numbers/3.png"
      },
      {
         background_image: "../images/numbers/4.png"
      },
   ]
});