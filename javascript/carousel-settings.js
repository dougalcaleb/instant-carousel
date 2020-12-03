let c = new Carousel({
	parent: ".carousel-wrap",
	static_showPages: 1,
	static_pageSpacing: 20,
	static_pageSpacingUnits: "px",
	static_spacingMode: "evenly",
   static_sizeFalloff: 0,
   // transition: 1500,
   throttle_matchTransition: true,
   throttle_keys: false,
	// infinite: false,
	pages: [
		{
			background_image: "./images/numbers/1.png",
			html: ``,
			css: ``,
		},
		{
			background_image: "../images/numbers/2.png",
		},
		{
			background_image: "../images/numbers/3.png",
		},
		{
			background_image: "../images/numbers/4.png",
		},
		{
			background_image: "../images/numbers/5.png",
		},
		{
			background_image: "../images/numbers/6.png",
		},
	],
});
