let c = new Carousel({
	parent: ".carousel-wrap",
	static_showPages: 3,
	static_pageSpacing: 20,
	// static_pageSpacingUnits: "px",
	static_spacingMode: "evenly",
	static_sizeFalloff: 0,
	// transition: 0,
	throttle_matchTransition: true,
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
		}
	],
});


/*
Setup:
- Initialize a new carousel using "new Carousel({ <settings> })"
- Must have a "pages" setting defined that contains specifications for each page of the carousel
- All other settings are optional
- Refer to the documentation for all options
   - https://github.com/dougalcaleb/instant-carousel#instant-carousel

Template: 

new Carousel({
   parent: "",
   id: "#myCarousel",
	pages: [
		{
			background_image: "",
			html: ``,
			css: ``,
		},
		{
			background_image: "",
			html: ``,
			css: ``,
		}
	]
});

*/