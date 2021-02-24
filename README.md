### Jump to:
[Downloads](#downloads)

[Setup](#setup)

[General Settings](#general-settings)

[Pages Settings](#pages-settings)

[Behavorial Settings](#behavorial-settings)

[Type-Specific Settings](#type-specific-settings)

[Unfinished Settings](#unfinished-settings)

[Styling and Page Flow](#styling-and-page-flow)

[Patch Notes](#patch-notes)

<br/>

### Downloads:

Master branch: Most up-to-date but stable version. May not have all of the features intended for the next release but potentially addresses bugs that the releases do not, as well as containing the most recent features. Recommended for most cases.

Releases: Complete, stable versions. May not have fixes for recently discovered issues or the most recent features, but are free of issues that break general usability. Recommended for highest stability.

1.x.x branch: Active development. No guaranteed stability. Download and use is not recommended.

<br/>

### Setup:

The focus of this plugin is quick and easy setup, with the freedom to customize extensively.

To add Roundabout to your project, first download and link the ```roundabout.min.js``` file to your HTML. Create another JS file (or use the one provided) to contain your settings, linked *after* ```roundabout.min.js```.

Next, link ```roundabout-style.css``` to your HTML in the ```head``` tag. Using this method, your HTML should look like this:

```html
<!DOCTYPE html>
<html>
<head>
   <!-- ... -->

   <link href="path/to/roundabout-style.css" rel="stylesheet" type="text/css">
</head>
<body>
   <!-- ... -->

   <script src="path/to/roundabout.min.js"></script>
   <script src="path/to/roundabout-settings.js"></script>
</body>
</html>
```


Creating a new carousel is done with a simple object constructor, passed an object containing all of your settings. It does not need to be stored in a variable, except where specified.
```javascript
new Roundabout = ({
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
   autoscroll: true,
   pages: [
      {
         backgroundImage: "../images/myFirstPage.png",
         html: `<button class="example-button">Example Button</button>`,
         css: `.example-button { background: white; border-radius: 5px; border: 2px solid blue; }`
      },
      {
         backgroundImage: "../images/mySecondPage.png"
      },
      {
         backgroundImage: "../images/myThirdPage.png"
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
id | String | Sets the CSS selector for the carousel's parent element to allow for CSS styling of the entire carousel. Accepts both IDs and classes. | ".myCarousel"
breakpoints | Array | Contains objects that describe the settings to change when the screen is smaller than a "width" property. | [{width: 500, swipeThreshold: 50}]
navigation | Boolean | Determines whether the navigational radio bubbles will be shown or not. | true
pages | Array | Contains unnamed objects containing elements for each corresponding page. The minimum page count supported is 2. See [Pages Settings]
nextHTML | String | Contains the HTML to place inside the "next" button | SVG Right Arrow
prevHTML | String | Contains the HTML to place inside the "previous" button | SVG Left Arrow(#pages-settings) for all available options. | []
parent | String | Selector of an HTML element to be the parent of the carousel. | "body"
type | String | Defines which carousel type to use: <ul><li>"normal": all pages are directly adjacent to each other and can be swiped/dragged</li><li>"fade": pages fade in and out over each other</li></ul> | "normal"
uiEnabled | Boolean | Determines if the UI will be created. | true

<br/>

### Pages settings:

Setting | Type | Description
--------|------|------------
backgroundImage | String | Defines the path to an image to use as the background image for the corresponding page. Make sure that the path is either absolute or relative to the HTML file that Roundabout is linked to.
css | String | Contains the CSS to apply to the HTML of the corresponding page. Not required - can use an external style sheet making use of selectors instead. <ul><li>By default, elements are protected from user interaction by the swipe overlay to prevent image dragging or text highlighting. To make them accessible to the user (for cases like buttons), give them a ```position``` of ```relative``` or ```absolute``` and a ```z-index``` of ```3``` or higher. This is not necessary if ```swipe``` is set to ```false```.</li><li>Styles included are not applied exclusively to the HTML in the corresponding page. This setting is mostly an organizational helper. Make sure to utilize classes and IDs accordingly.</li></ul> 
html | String | Contains the HTML structure to include in the corresponding page. Used for interactivity.

<br/>

### Behavorial Settings:

Setting | Type | Description | Default
--------|------|-------------|--------
autoscroll | Boolean | Determines whether the autoscroll will be active or not. | false
autoscrollDirection | String | Defines the direction for the autoscroll to scroll. Either "right" or "left". | "right"
autoscrollPauseOnHover | Boolean | Determines if autoscroll will be paused when user mouses over the carousel. | false
autoscrollSpeed | Integer | Time in miliseconds between automatically scrolling between pages. | 5000
autoscrollStartAfter | Integer | Time in miliseconds for the first automatic scroll to happen after the page loads. | 5000
autoscrollTimeout | Integer | Time in miliseconds after user interaction to resume autoscroll. | 15000
infinite | Boolean | Determines if the carousel can scroll infinitely. | true
keys | Boolean | Determines if the arrow keys can be used for navigation. All carousels on the page will be affected by the keypress. | true
lazyLoad | String | Selects the type of lazy loading to use <ul><li>"all": After the webpage has finished loading, all supplied images will load one-by-one.</li><li>"hidden": Each image that is initially shown will be loaded with the webpage, as well as images within one scroll in either direction. Once the user scrolls, the new images within one scroll will be loaded in.</li><li>"none": All images are loaded with the webpage.</li></ul> | "none"
navigationBehavior | String | Selects the behavior that scrolling with the navigation will adhere to. <ul><li>"nearest": the carousel will scroll in the direction that passes the fewest number of pages <li>"direction": scrolling will move in the direction of the focused page, according to the order the pages are laid out. On infinite carousels, this means it will never scroll past either end. Default for non-infinite carousels.</li></ul> | "nearest"
navigationTrim | Boolean | Determines if the navigation bubbles will be trimmed to only the necessary ones on non-infinite carousels when ```pagesToShow``` is greater than 1. Turning this off is recommended for thumbnail-style navigation. | true
swipe | Boolean | Determines if the carousel can be swiped. Supports both mouse and touch. Swipe is not supported when 2 or fewer pages are supplied. | true
swipeMultiplier | Number | Defines the multiplier for swipe interactions. | 1
swipeResistance | Number | Defines the resistance when attempting to drag past the end of a non-infinite carousel. Must be between 0 and 1, where 0 is no resistance and 1 is full resistance. | 0.95
swipeThreshold | Integer | Defines the distance in px that the user must swipe or drag to advance to the next page instead of snapping back to the current one. | 300
showWrappedPage | Boolean | Determines if the end page on the opposite end will show when dragging past the end of a non-infinite carousel. | false
transition | Integer | Time in miliseconds to transition between pages when scrolling. | 300
transitionFunction | String | Defines the timing function for transitions between pages. Can be any valid CSS3 timing value. | "ease"
throttle | Boolean | Determines if user interactions will be throttled. | true
throttleButtons | Boolean | Determines if user interaction from left and right buttons are throttled. | true
throttleKeys | Boolean | Determines if user interaction from keyboard keys are throttled. | true
throttleMatchTransition | Boolean | Determines if the "throttleTimeout" setting will match the "transition" setting. Overrides "throttleTimeout". | true
throttleNavigation | Boolean | Determines if user interaction from navigation is throttled. | true
throttleSwipe | Boolean | Determines if user interaction from swiping is throttled. | true
throttleTimeout | Integer | Time in miliseconds to disallow user interaction for after an interaction. | 300

<br/>

### Type-Specific Settings:

Setting | Type | Description | Default | Applies to Type(s)
--------|------|-------------|---------|-------------------
offsetIn | Integer | Defines the movement of a page when it is coming into focus. | 20 | "fade"
offsetOut | Integer | Defines the movement of a page when it is going out of focus. | -20 | "fade"
offsetUnits | String | Defines the units to use for offsetIn and offsetOut. | "px" | "fade"
spacingMode | String | Determines the spacing mode when showing multiple pages. "evenly" puts space between pages and the sides of the wrap, "fill" puts space only between pages. | "fill" | "normal", "fade"
pageSpacing | Integer | Defines the space between pages. | 0 | "normal", "fade"
pageSpacingUnits | String | Defines the units used for "pageSpacing". | "px" | "normal", "fade"
pagesToShow | Integer | Defines the number of pages to show. | 1 | "normal", "fade"

<br/>

### Unfinished Settings:

Setting | Status | Time Frame
--------|--------|-----------
offsetIn | Not implemented | Upcoming
offsetOut | Not implemented | Upcoming
offsetUnits | Not implemented | Upcoming
type | Partially implemented | In progress
type: "fade" | Not implemented | Upcoming

<br/>

### Styling and Page Flow:

Included is a stylesheet,  ```roundabout-style.css```. Inside, all available class selectors are laid out and described to facilitate easy style changes.

Many different classes are provided for group styling as well as individual element styling. Check your browser inspector to see all of the classes that a given element has at any one time.

Be aware that there are a few properties on some elements that cannot be changed for layout reasons. These properties are detailed in the provided stylesheet.

Note that each carousel is wrapped in a div that is given two classes: ```.roundabout-wrapper```, and the one given in your settings (defaults to ```.myCarousel```). Note that the wrapper is given a ```position``` of ```relative```, which cannot be changed. This may affect the layout of your website.

Be sure to read and follow all rules and guidelines contained in the stylesheet. There are a few properties per element that cannot be changed, and a few that must follow specific rules.

<br/>

### Patch Notes:

### Jump to:
[v1.3.0](#v130) | [v1.2.1](#v121) | [v1.2.0](#v120) | [v1.1.0](#v110) | [v1.0.0](#v100)

#### v1.3.0:
Features:
   *  New setting: breakpoints
      *  values: objects (each object must have a "width" property)
      *  Rework of the breakpoint system to support multiple breakpoints
      *  Removed mobile option
      *  Remove mobileBreakpoint option
   *  Restructured the way settings are input to allow for autocomplete in your IDE (when supported by editor)

#### v1.2.1:
Features:
   *  Pages that are visible now gain a unique class
      *  Can be used to stylize pages in certain positions
      *  Removed enlargeCenter option
      *  Removed sizeFalloff option

Bugfixes:
   *  Fixed swipeThreshold changing when more than one page was displayed

#### v1.2.0:
Features:
*  New setting: lazyLoad
   *  values: "all", "hidden", "none"
   *  Selects the type of backgroundImage loading to use
*  New setting: uiEnabled
   *  values: true, false
   *  Determines if the UI will be enabled and usable. Disabled UIs are not generated at all
*  New settings: nextHTML and prevHTML
   *  values: valid HTML string
   *  Replaces the default next and previous arrows with custom HTML. Supports both elements and plain text
*  Complete overhaul of the CSS system
      *  Now much more intuitive, uses an external stylesheet for easy, on-the-fly changes and complete visual freedom
      *  Removed visualPreset option
      *  Removed autoGenCSS option
*  On non-infinite carousels, dragging infinitely past an end is now possible instead of hitting a resetting limit

Bugfixes:
   *  Fixed non-infinite carousels being able to scroll 1 page past the left side.
   *  Fixed snapping back to initial position when scrolling very far past the end of non-infinite carousels

Bugfixes:

#### v1.1.0:
Features:
*  HTML for pages
   *  HTML elements can be added to pages via the "html" setting in the "pages" array
   *  CSS can also be added via the "css" property
*  Better settings validation
*  HTML elements in pages can now be protected or interactible

Bugfixes:
*  Setting names have been standardized to normal camel case
*  Fixed inconsistencies in documentation and template files

#### v1.0.0:
Features:
* Carousel type "normal"
   * All pages are next to each other and move in sync
   * Swipe/draggable, support for a nav bar and scroll buttons
* Autoscroll
* User interaction throttling
* Automatic HTML and CSS structure
* Full documentation
