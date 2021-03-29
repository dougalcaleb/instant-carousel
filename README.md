### Documentation:

[See the documentation](https://dougalcaleb.github.io/roundabout/docs).

<br/>

### Downloads:

Master branch: Most up-to-date but stable version. May not have all of the features intended for the next release but potentially addresses bugs that the releases do not, as well as containing the most recent features. Recommended for most cases.

Releases: Major versions. May not have fixes for recently discovered issues, but are free of issues that break general usability. Updated the least frequently.

1.x.x branch: Active development. No guaranteed stability. Download and use is not recommended.

<br/>

### Setup:

The main focus of Roundabout is quick and easy setup, with the freedom to customize extensively.

To add Roundabout to your project, first download and link ```roundabout.min.js``` to your HTML. Create another JavaScript file (or use the provided ```roundabout-settings.js```) to contain your settings, linked *after* ```roundabout.min.js```.

Finally, link ```roundabout-style.css``` the same HTML page as before. Your HTML should then look like this:

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
Once you have that, you're all set! Define your settings, and you have a carousel up and running in no time at all.

Creating a new carousel is done with an object constructor, passed an object containing all of your settings. It does not need to be stored in a variable, except when using the scripting module (coming soon).
```javascript
new Roundabout = ({
   // include your settings here...
});
```

Included is a ```roundabout-settings.js``` file, which contains a simple template for a Roundabout carousel.

Settings do not need to be declared in any specific order.

<br/>

### Patch Notes:

### Jump to:
[v1.4.0](#v140) | [v1.3.1](#v131) | [v1.3.0](#v130) | [v1.2.1](#v121) | [v1.2.0](#v120) | [v1.1.0](#v110) | [v1.0.0](#v100)

### v1.4.0:
Features:
   *  Scripting module
      *  Provides methods for controlling, listening to, and modifying Roundabout carousels
   *  New setting: swipeSnap
      *  Values: true, false
      *  Enables or disables snapping on swipe release
   *  New setting: swipeSpeed
      *  Value: integer
      *  Sets the speed (pixels/s) that must be exceeded to advance the page
      *  Can be used alongside swipeThreshold
   *  New setting: rotation
      *  Values: "none", "left", "right"
      *  Changes the way the swiping is handled for rotated carousels
   *  New setting: interpolate
      *  Values: objects (each must have a "value", "between", and "unit" property)
      *  Calculates intermediate values between pages when swiping
   *  New setting: scrollwheel
      *  values: true, false
      *  Allows for scrolling with a mouse wheel to advance the carousel instead of scrolling
   *  New setting: type
      *  Values: "slider", "gallery"
      *  Selects the type of carousel to use
   *  New mode: "gallery"
      *  Pages do not move
      *  Fade in/out
   *  New setting: ignoreErrors
      *  Values: true, false
      *  Allows for error checking against settings to be bypassed
      *  Not recommended for general use
   *  New lazy load type: "lazy-hidden"
      *  All initially visible images and images within one scroll in each direction load after the page has loaded
      *  All other pages wait to be loaded until they are within one scroll
   *  New class: ".roundabout-[ID]-page"
      *  Applied to every individual page

Bugfixes:
   *  Fixed error when scrolling next when navigationTrim is on and the number of pages to the right is less than scrollBy
   *  Fixed non-visible pages being positioned incorrectly when scrolling left. This fixes transitions that have bounce showing nothing beyond the current pages.
   *  Fixed duplicate event listeners
   *  Fixed minor sticking between pages when swiping on infinite carousels
   *  Fixed disappearing page on scroll when parts of pages were visible. May have introduced other minor errors, keeping an eye on it

Known Issues:
   *  Swipe is currently unsupported on carousels with 2 pages. A solution is being worked on in order to fix the display issues caused in this case.

### v1.3.1:
Bugfixes:
   *  Fixed error when disabling buttons

### v1.3.0:
Features:
   *  New setting: breakpoints
      *  Values: objects (each object must have a "width" property)
      *  Rework of the breakpoint system to support multiple breakpoints
      *  Removed mobile option
      *  Remove mobileBreakpoint option
   *  New setting: buttons
      *  Values: true, false
      *  Enables or disables the previous and next navigation buttons
   *  Restructured the way settings are input to allow for editor autocomplete
   *  Added license (applies to all previous versions as well)
   *  Protection against overwriting "roundabout" variable

Bugfixes:
   *  Fixed swipeThreshold changing when more than one page was displayed
   *  Standardized the name of pageSpacingMode option (previously was named spacingMode)
   *  Added missing option scrollBy to documentation
   *  Fixed background-size and background-position missing from CSS, removed these properties being automatically set on creation
   *  Fixed non-trimmed nav bubbles not gaining the correct classes
   *  Fixed hitching when using pageSpacingMode set to "evenly"
   *  Removed throttleMatchTransition option (leftover development helper)
   *  Fixed double event listeners
   *  Fixed several bugs relating to autoscroll timings

### v1.2.1:
Features:
   *  Pages that are visible now gain a unique class
      *  Can be used to stylize pages in certain positions
      *  Removed enlargeCenter option
      *  Removed sizeFalloff option

### v1.2.0:
Features:
*  New setting: lazyLoad
   *  Values: "all", "hidden", "none"
   *  Selects the type of backgroundImage loading to use
*  New setting: uiEnabled
   *  Values: true, false
   *  Determines if the UI will be enabled and usable. Disabled UIs are not generated at all
*  New settings: nextHTML and prevHTML
   *  Values: valid HTML string
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

### v1.1.0:
Features:
*  HTML for pages
   *  HTML elements can be added to pages via the "html" setting in the "pages" array
   *  CSS can also be added via the "css" property
*  Better settings validation
*  HTML elements in pages can now be protected or interactible

Bugfixes:
*  Setting names have been standardized to normal camel case
*  Fixed inconsistencies in documentation and template files

### v1.0.0:
Features:
* Carousel type "normal"
   * All pages are next to each other and move in sync
   * Swipe/draggable, support for a nav bar and scroll buttons
* Autoscroll
* User interaction throttling
* Automatic HTML and CSS structure
* Full documentation
