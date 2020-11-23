Settings:

Setting | Type | Value | Default | Example
--------|------|-------|---------|--------
pages | array | unnamed objects containing elements for each corresponding page | [] | [{background_image: "../images/numbers/1.png"},{background_image: "../images/numbers/2.png"}]
type | integer | integer from 0-2 that defines which carousl type to use. 0 defines static (all pages are directly adjacent and can be swiped/dragged). 1 defines overlap (pages slide in from the sides to overlap the current page and can be swiped/dragged). 2 defines fade (pages fade in and out over each other) | 0 | 0


Patch Notes:

v0.2.0:
* Features:
    * Implemented infinite drag scroll - it is no longer limited to the center slide and the two adjacent to it
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

v0.1.0:
* Features:
    * New type: static. All pages are directly next to each other and fill the entire wrapper.
    * Fully implemented swipe/drag scrolling on "static" type
    * Autoscroll
    * Auto-generating HTML and CSS structure
    * User interaction throttling