# Structured Header Hard Mode

A web extension to stress out servers with structured headers syntax.

This repo contains a WebExtension that can be installed in Chrome and Firefox. Patches are welcome for 
supporting other browsers. Kindly send $100USD with any patches for Safari (to pay for Apple Developer 
Program fees).

## License
Any copyright is dedicated to the Public Domain, except where noted otherwise.
http://creativecommons.org/publicdomain/zero/1.0/

See [LICENSE.txt](LICENSE.txt) for more details.

## Building the Addons

This uses Webpack to build browser-specific addons from a set of shared resources.

The following commands can be used to generate the supported addons, which will
appear in the `dist/` directory (it will be created on the first run):

* `npm run build:chrome`
* `npm run build:firefox`
* `npm run build:clean` (to delete everything)

From there, the addons can be packaged up, or loaded as temporary development
extensions in each browser.

* `npm run package:chrome`
* `npm run package:firefox`

By default, webpack compiles these with [`mode`](https://webpack.js.org/configuration/mode/)`: production`.

To build the addons with `mode: none` or `mode: development`, those options
can be passed via the commandline, e.g.:

`npm run build:firefox -- --mode=none`

## TODO

It would be neat to expose a UI so you can toggle the different kinds of headers on or off to diagnose breakage.
Also, easy bug reporting would be cool.