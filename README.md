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

To add Roundabout to your project, first download and link ```roundabout.min.js``` to your HTML. Create another JavaScript file (or use the provided ```roundabout-settings.js```) to contain your settings, linked *after* ```roundabout.min.js```. It is important that your settings come after the source code, so that it can load and initialize in the correct order. Do not use the ```async``` property.

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

Alternatively, if you'd rather have your ```script``` tags in your ```head```, you must use the ```defer``` attribute and structure your HTML like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- ... -->

    <link href="path/to/roundabout-style.css" rel="stylesheet" type="text/css">

    <script src="path/to/roundabout.min.js" defer></script>
    <script src="path/to/roundabout-settings.js" defer></script>
  </head>
  <body>
    <!-- ... -->
  </body>
</html>
```

Once you have that, you're all set! Define your settings, and you have a carousel up and running in no time at all.

Creating a new carousel is done with an object constructor, passed an object containing all of your settings. It does not need to be stored in a variable, except when using the scripting module.
```javascript
new Roundabout = ({
   // include your settings here...
});
```

[Learn More](https://dougalcaleb.github.io/roundabout/setup.html)