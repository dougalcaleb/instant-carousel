### Documentation:

[See the documentation](https://dougalcaleb.github.io/roundabout/docs).

Note: Project is complete and is no longer regularly maintained.

<br/>

### Setup:

The main focus of Roundabout is quick and easy setup, with plenty of customization options.

To add Roundabout to your project, download and link ```roundabout.min.js``` to your HTML. Create another JavaScript file (or use the provided ```roundabout-settings.js```) to contain your settings. Import Roundabout into your settings script.


Link ```roundabout-style.css``` to your page. Your document should look like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <!-- ... -->

    <link href="path/to/roundabout-style.css" rel="stylesheet" type="text/css">
  </head>
  <body>
    <!-- ... -->

    <script type="module" src="path/to/roundabout.min.js"></script>
    <script type="module" src="path/to/roundabout-settings.js"></script>
  </body>
</html>
```

Once you have that, you're all set! Define your settings, and you have a carousel up and running in no time at all.

Creating a new carousel is done with an object constructor, passed an object containing your settings. It does not need to be stored in a variable, except when using the scripting module.
```javascript
import Roundabout from "./roundabout.min.js"

new Roundabout({
   // include your settings here...
});
```

[Documentation](https://dougalcaleb.github.io/roundabout/setup.html)