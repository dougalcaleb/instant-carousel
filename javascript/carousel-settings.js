let c = new Carousel({
	parent: ".carousel-wrap",
	static_showPages: 2,
	static_pageSpacing: 20,
	static_pageSpacingUnits: "px",
	static_spacingMode: "fill",
	static_sizeFalloff: 0,
	// transition_timingFunction: "linear",
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
