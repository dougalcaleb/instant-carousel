### Jump to:
[Repository Structure](#repository-structure)

[Setup](#setup)

[General Settings](#general-settings)

[Pages Settings](#pages-settings)

[Behavorial Settings](#behavorial-settings)

[Type-Specific Settings](#type-specific-settings)

[Inactive, Unfinished or Deprecated Settings](#inactive-unfinished-or-deprecated-settings)

[Page Flow](#page-flow)

[Patch Notes](#patch-notes)

<br/>

### Repository Structure:

Releases: Complete, stable versions. May not have fixes for recently discovered issues or the most recent features, but are free of issues that break general usability. Recommended download for most cases.

Master branch: Most up-to-date but stable version. May not have all of the features intended for the next release but potentially addresses bugs that the releases do not. Download if you need these features and/or bugfixes now.

1.x.x branch: Active development. No guaranteed stability. Download and use is not recommended.

<br/>

### Setup:

The focus of this plugin is quick and easy setup, with the freedom to customize extensively.

To add Roundabout to your project, download and link the ```roundabout.js``` file to your HTML. Create another JS file (or use the one provided) to contain your settings, linked *after* ```roundabout.js```. Using this method, your HTML should look like this:
```html
<!-- your webpage code up here... -->
<!-- ... -->

   <script src="path/to/roundabout.js"></script>
   <script src="path/to/roundabout-settings.js"></script>
</body>
</html>
```

Creating a new carousel is done with a simple object constructor, passed an object containing all of your settings. It does not need to be stored in a variable, except where specified by extensions.
```javascript
new Roundabout =({
   // include your settings here...
});
```

Multiple carousels can be created on one page by invoking the constructor multiple times. Be sure to give them unique CSS selectors with the ```id``` property so you can interact with them individually in your CSS:
```javascript
new Roundabout = ({
   id: "#carouselNumberOne",
   // other settings...
});
new Roundabout = ({
   id: "#carouselNumberTwo",
   // other settings...
});
```

Here's an example of a simple carousel you can get up and running quickly:

```javascript
new Roundabout = ({
   parent: "#myCarouselWrap",
   autoScroll: true,
   type: "stack",
   pages: [
      {
         background_image: "../images/myFirstPage.png",
         html: `<button class="example-button">Example Button</button>`,
         css: `.example-button { background: white; border-radius: 5px; border: 2px solid blue; }`
      },
      {
         background_image: "../images/mySecondPage.png"
      },
      {
         background_image: "../images/myThirdPage.png"
      }
   ]
});
```

Included is a ```roundabout-settings.js``` file, which contains a simple template for a Roundabout carousel.

Settings do not need to be declared in any specific order.

<br/>

### General Settings:

Setting | Type | Description | Default
--------|------|-------------|--------
pages | Array | Contains unnamed objects containing elements for each corresponding page. See [Pages Settings](#pages-settings) for all available options. | []
id | String | Sets the CSS selector for the carousel's parent element to allow for CSS styling of the entire carousel. Accepts both IDs and classes. | ".myCarousel"
type | String | Defines which carousel type to use: <ul><li>"normal": all pages are directly adjacent to each other and can be swiped/dragged</li><li>"stack": pages slide in from the sides to overlap the current page and can be swiped/dragged</li><li>"fade": pages fade in and out over each other</li></ul> | "normal"
parent | String | Selector of an HTML element to be the parent of the carousel. | "body"
autoGenCSS | Boolean | Determines whether the required CSS styling will be automatically generated and applied to the carousel, or if it will be created by the user. A reference for custom CSS is given in the "references" folder. | true
navigation | Boolean | Determines whether the navigational radio bubbles will be shown or not. | true
visualPreset | Integer | Selects one of the preset visual styles to display. Currently the default is the only preset, but more are on the way. | 0
mobile | Object | Defines a list of settings to override when the screen is smaller than the size set by "mobile_breakpoint". | { <br/>swipe_threshold: 50 <br/>}
mobile_breakpoint | Integer | Maximum size in pixels for the screen to be to apply the values in the "mobile" setting. | 700

<br/>

### Pages settings:

Setting | Type | Description
--------|------|------------
background_image | String | Defines the path to an image to use as the background image for the corresponding page. Make sure that the path is relative to the ```roundabout.js``` file.
html | String | Contains the HTML structure to include in the corresponding page. Used for interactivity.
css | String | Contains the CSS to apply to the HTML of the corresponding page. Not required - can use an external style sheet making use of selectors instead.

Note: there is a minimum requirement of 3 pages as of version 0.2.0. Support for as few as 2 pages will arrive in a future update.

<br/>

### Behavorial Settings:

Setting | Type | Description | Default
--------|------|-------------|--------
autoScroll | Boolean | Determines whether the autoscroll will be active or not. | false
autoScroll_speed | Integer | Time in miliseconds between automatically scrolling between pages. | 5000
autoScroll_timeout | Integer | Time in miliseconds after user interaction to resume autoscroll. | 15000
autoScroll_pauseOnHover | Boolean | Determines if autoscroll will be paused when user mouses over the carousel. | false
autoScroll_startAfter | Integer | Time in miliseconds for the first automatic scroll to happen after the page loads. | 5000
autoScroll_direction | String | Defines the direction for the autoscroll to scroll. Either "right" or "left". | "right"
transition | Integer | Time in miliseconds to transition between pages when scrolling. | 300
transitionFunction | String | Defines the timing function for transitions between pages. Can be any valid CSS3 timing value. | "ease"
throttle | Boolean | Determines if user interactions will be throttled. | true
throttle_timeout | Integer | Time in miliseconds to disallow user interaction for after an interaction. | 300
throttle_matchTransition | Boolean | Determines if the "throttle_timeout" setting will match the "transition" setting. Overrides "throttle_timeout". | true
throttle_keys | Boolean | Determines if user interaction from keyboard keys are throttled. | true
throttle_buttons | Boolean | Determines if user interaction from left and right buttons are throttled. | true
throttle_swipe | Boolean | Determines if user interaction from swiping is throttled. | true
throttle_navigation | Boolean | Determines if user interaction from navigation is throttled. | true
keys | Boolean | Determines if the arrow keys can be used for navigation. All carousels on the page will be affected by the keypress. | true
infinite | Boolean | Determines if the carousel can scroll infinitely. | true
swipe | Boolean | Determines if the carousel can be click-dragged or swiped. | true
swipe_threshold | Integer | Defines the distance in px that the user must swipe or drag to advance to the next page instead of snapping back to the current one. | 300
swipe_multiplier | Number | Defines the multiplier for swipe interactions. | 1
swipe_resistance | Number | Defines the resistance when attempting to drag past the end of a non-infinite carousel. Must be between 0 and 1, where 0 is no resistance and 1 is full resistance. | 0.95
showWrappedPage | Boolean | Determines if the end page on the opposite end will show when dragging past the end of a non-infinite carousel. | false
navigation_behavior | String | Selects the behavior that scrolling with the navigation will adhere to. <ul><li>"nearest": the carousel will scroll in the direction that passes the fewest number of pages <li>"direction": scrolling will move in the direction of the focused page, according to the order the pages are laid out. On infinite carousels, this means it will never scroll past either end. Default for non-infinite carousels.</li></ul> | "nearest"

<br/>

### Type-Specific Settings:

Setting | Type | Description | Default | Applies to Type(s)
--------|------|-------------|---------|-------------------
pagesToShow | Integer | Defines the number of pages to show. | 1 | "normal", "fade"
enlargeCenter | Integer | Defines the percentage of the size of a normal slide to set the center slide to. | 100 | "normal"
sizeFalloff | Integer | Defines the percentage that each successive page will get smaller by. | 0 | "normal"
pageSpacing | Integer | Defines the space between pages. | 0 | "normal", "fade"
pageSpacingUnits | String | Defines the units used for "pageSpacing". | "px" | "normal", "fade"
spacingMode | String | Determines the spacing mode when showing multiple pages. "evenly" puts space between pages and the sides of the wrap, "fill" puts space only between pages. | "fill" | "normal", "fade"
direction | String | Defines the movement of pages onto and off of the stack. <ul><li>"both": scrolling brings in the next page from the appropriate side that sits on top</li><li>"left": scrolling left brings in a new page from the left that sits on top. Scrolling right moves the topmost page to the left to uncover the page below</li><li>"right": scrolling right brings in a new page from the right that sits on top. Scrolling left moves the topmost page to the right to uncover the page below </li></ul> | "both" | "stack"
offsetIn | Integer | Defines the movement of a page when it is coming into focus. | 20 | "fade"
offsetOut | Integer | Defines the movement of a page when it is going out of focus. | -20 | "fade"
offsetUnits | String | Defines the units to use for offsetIn and offsetOut. | "px" | "fade"

<br/>

### Inactive, Unfinished or Deprecated Settings:

Setting | Status | Time Frame
--------|--------|-----------
enlargeCenter | Not implemented | Upcoming
sizeFalloff | Not implemented | Upcoming
direction | Not implemented | Upcoming
offsetIn | Not implemented | Upcoming
offsetOut | Not implemented | Upcoming
offsetUnits | Not implemented | Upcoming
type | Partially implemented | In progress
pages > html | Not implemented | Upcoming
pages > css | Not implemented | Upcoming
autoGenCSS | Partially implemented | In progress
visualPreset | Not implemented | Upcoming
type: "fade" | Not implemented | Upcoming
type: "stack" | Not implemented | Upcoming

<br/>

### Page Flow:

Each carousel is wrapped in a div that is given two classes: ```.roundabout-wrapper```, and the one given in your settings (defaults to ```.myCarousel```). Note that the wrapper is positioned as ```relative```, which cannot be changed.

Reference files for creating custom visuals can be found in the "references" folder in the main directory of the project.

<br/>

### Patch Notes:

### Jump to:
[v1.0.0](#v100)

#### v1.0.0:
* Features:
   * Carousel type "normal"
      * All pages are next to each other and move in sync
      * Swipe/draggable, support for a nav bar and scroll buttons
   * Autoscroll
   * User interaction throttling
   * Automatic HTML and CSS structure
   * Full documentation