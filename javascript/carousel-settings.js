let c = new Carousel({
    parent: ".carousel-wrap",
    transition: 300,
    throttle_matchTransition: true,
    pages: [
        {
            imageURL: "../images/numbers/1.png",
            // elements: 
            // `
            // <div class="popup">
            //     <button class="wow">Click here!</button>
            // </div>
            // `
        },
        {
            imageURL: "../images/numbers/2.png"
        },
        {
            imageURL: "../images/numbers/3.png"
        },
        {
            imageURL: "../images/numbers/4.png"
        },
        {
            imageURL: "../images/numbers/5.png"
        },
        {
            imageURL: "../images/numbers/6.png"
        },
        
    ]
});