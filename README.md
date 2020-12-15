![Roundabout](/images/logos/r-small.png)

#### This plugin is unfinished but is in active development. Check back for updates.

<br/>

### Jump to:
[General Settings](#general-settings)

[Pages Settings](#pages-settings)

[Behavorial Settings](#behavorial-settings)

[Type-Specific Settings](#type-specific-settings)

[Inactive, Unfinished or Deprecated Settings](#inactive-unfinished-or-deprecated-settings)

[Page Flow](#page-flow)

[Patch Notes](#patch-notes)

<br/>

### Setup

Note: minified files will be available once development has matured past v1.0.

The focus of this plugin is quick and easy setup, with the option to customize extensively.

To add Roundabout to your project, download and link the ```roundabout.js``` file to your HTML. Create another script file to contain your settings, linked *after* ```roundabout.js```.

Initialization is done with a simple object constructor, passed an object containing all of your settings:
```javascript
new Roundabout =({
   // include your settings here...
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

Multiple carousels can be created on one page by invoking the constructor multiple times. Be sure to give them unique CSS selectors with the ```id``` property so you can interact with them individually in your CSS:
```javascript
new Roundabout = ({
   id: "#carouselNumberOne",
   // other settings...
});
new Roundabout = ({
   id: ".carouselNumberTwo",
   // other settings...
});
```

Included is a ```settings.js``` file, which contains a simple template for a new Roundabout constructor.

<br/>

### General Settings:

Setting | Type | Description | Default
--------|------|-------------|--------
pages | Array | Contains unnamed objects containing elements for each corresponding page. See [Pages Settings](https://github.com/dougalcaleb/instant-carousel#pages-settings) for all available options. | []
id | String | Sets the CSS selector for the carousel's parent element to allow for CSS styling of the entire carousel. Accepts both IDs and classes. | ".myCarousel"
type | String | Defines which carousel type to use: <ul><li>"normal": all pages are directly adjacent to each other and can be swiped/dragged</li><li>"stack": pages slide in from the sides to overlap the current page and can be swiped/dragged</li><li>"fade": pages fade in and out over each other</li></ul> | "normal"
parent | String | Selector of an HTML element to be the parent of the carousel. | "body"
autoGenHTML | Boolean | Determines whether the required HTML structure will be automatically generated inside the element specified by the "parent" setting, or if it will be created by the user. A reference for custom HTML will be available soon. | true
autoGenCSS | Boolean | Determines whether the required CSS styling will be automatically generated and applied to the carousel, or if it will be created by the user. A reference for custom CSS will be available soon. | true
radioBubbles | Boolean | Determines whether the navigational radio bubbles will be shown or not. | true
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
transition_timingFunction | String | Defines the timing function for transitions between pages. Can be any valid CSS timing value. | "ease"
throttle | Boolean | Determines if user interactions will be throttled. | true
throttle_timeout | Integer | Time in miliseconds to disallow user interaction for after an interaction. | 300
throttle_matchTransition | Boolean | Determines if the "throttle_timeout" setting will match the "transition" setting. Overrides "throttle_timeout". | false
throttle_keys | Boolean | Determines if user interaction from keyboard keys are throttled. | true
throttle_buttons | Boolean | Determines if user interaction from left and right buttons are throttled. | true
throttle_swipe | Boolean | Determines if user interaction from swiping is throttled. | true
throttle_navigation | Boolean | Determines if user interaction from navigation is throttled. | true
keys | Boolean | Determines if the arrow keys can be used for navigation. All carousels on the page will be affected by the keypress. | true
infinite | Boolean | Determines if the carousel can scroll infinitely. | true
swipe | Boolean | Determines if the carousel can be click-dragged or swiped. | true
swipe_threshold | Integer | Defines the distance in px that the user must swipe or drag to advance to the next page instead of snapping back to the current one. | 300
swipe_multiplier | Integer | Defines the multiplier for swipe interactions. | 1
swipe_resistance | Number | Defines the resistance when attempting to drag past the end of a non-infinite carousel. Must be between 0 and 1, where 0 is no resistance and 1 is full resistance. | 0.95
rtl | Boolean | Determines if the carousel will be laid out right-to-left. | false

<br/>

### Type-Specific Settings:

Setting | Type | Description | Default | Applies to Type(s)
--------|------|-------------|---------|-------------------
showPages | Integer | Defines the number of pages to show. | 1 | "normal", "fade"
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
showPages | Almost finished | In progress
enlargeCenter | Not implemented | Upcoming
sizeFalloff | Not implemented | Upcoming
pageSpacing | Almost finished | In progress
pageSpacingUnits | Almost finished | In progress
spacingMode | Almost finished | In progress
direction | Not implemented | Upcoming
offsetIn | Not implemented | Upcoming
offsetOut | Not implemented | Upcoming
offsetUnits | Not implemented | Upcoming
rtl | Not implemented | Low priority
type | Partially implemented | In progress
autoGenHTML | Deprecated | Next major update
autoGenCSS | Partially implemented | In progress
radioBubbles | Not implemented | Upcoming

<br/>

### Page Flow:

Each carousel is wrapped in a div that is given two classes: ```.roundabout-wrapper```, and the one given in your settings (defaults to ```.myCarousel```). Note that the wrapper is positioned as ```relative```, which cannot be changed.

Reference files for creating custom visuals can be found in the "references" folder in the main directory of the project.

<br/>

### Patch Notes:

### Jump to:
[v0.2.0](https://github.com/dougalcaleb/instant-carousel#v020)
[v0.1.0](https://github.com/dougalcaleb/instant-carousel#v010)

##### v0.2.0:
* Features:
    * Implemented infinite drag scroll - it is no longer limited to the center slide and the two adjacent to it
    * New extensions for type "static": multiple pages can now be visible at once
    * Swiping can now be throttled
    * Different types of user interactions can be individually throttled or not throttled
    * Swiping now supports moving multiple pages at once
    * Type settings is no longer defined by arbitrary integers, now uses names (strings) instead
    * Improved documentation
    * Swiping has been optimized for large page counts
    * Support for multiple carousels on one page
    * New settings (refer to documentation above for descriptions):
      * showPages
      * pageSpacing
      * pageSpacingUnits
      * spacingMode
      * transition_timingFunction
      * throttle_swipe
      * throttle_keys
      * throttle_buttons
      * throttle_navigation
      * visualPreset
    * Added comprehensive list of settings to README
* Bugfixes:
    * Scrolling quickly with fewer pages caused a pop-in effect
    * Some transitions were not being reset correctly in certain conditions. Switched to a css-class based method instead
    * A single frame of the wrong page could show up when swiping between pages
    * The first page wouldn't accept dragging when not an infinite carousel
    * 4 jitter issues related to edge resistance and non-infinite scrolling
    * Dragging through multiple pages caused transitions to not reset correctly
    * Some global event listeners were not being reset correctly
    * Dragging and then step-scrolling back to the initial page would cause some pages to disappear
    * Dragging and step-scrolling was possible, and could break page order
    * Page order could break when non-infinite and spamming nav buttons
    * Static non-infinite scroll with multiple pages could show pages beyond the end
    * Positions were being incorrectly set and read, causing "ghost pages"
    * When using spacing, pages would follow mouse movement incorrectly
    * Ending a swipe with multiple pages visible would set incorrect positions
    * Pop-in would occur during swiping when more than half of the pages were visible
    * Swiping past the right end of a non-infinite carousel when showing multiple pages caused jumping
    * When using multiple pages with spacing, swiping would ignore the spacing and jump between pages

##### v0.1.0:
* Features:
    * New type: static. All pages are directly next to each other and fill the entire wrapper.
    * Fully implemented swipe/drag scrolling on "static" type
    * Autoscroll
    * Auto-generating HTML and CSS structure
    * User interaction throttling