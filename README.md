# Svg Charts
Built using AngularJS and D3.js for visualizations.

![alt tag] (https://github.com/timstrze/svgCharts/blob/master/app/images/screenshot.png)

## First Install


Clone the front end repo `svgCharts`:
```bash
git clone https://github.com/timstrze/svgCharts.git
```

Install `generator-angular`:
```bash
npm install -g generator-angular
```

Install `node-modules`:
```bash
npm install
```

Install `bower-components`:
```bash
bower install
```


## Grunt Server

Launch your express server in development mode. This will also start the live-reload server to watch js, css, and html files.
```bash
grunt serve
```

### Livereload

`grunt serve` will watch client files in `app/` restarting the Grunt server when a change is detected.

## Deployment

To generate a dist folder that can easily be deployed use:

```bash
grunt
```

This will run unit tests, jshint, concatenate and minify scripts/css, compress images, add css vendor prefixes, and finally copy all files to a tidy dist folder.

Alternatively to skip tests and jshint, use:

```bash
grunt build
```

## Generators

All of the **generator-angular** client side generators are available. 

Angular sub-generators:

* [angular:controller](https://github.com/yeoman/generator-angular#controller)
* [angular:directive](https://github.com/yeoman/generator-angular#directive)
* [angular:filter](https://github.com/yeoman/generator-angular#filter)
* [angular:route](https://github.com/yeoman/generator-angular#route)
* [angular:service](https://github.com/yeoman/generator-angular#service)
* [angular:provider](https://github.com/yeoman/generator-angular#service)
* [angular:factory](https://github.com/yeoman/generator-angular#service)
* [angular:value](https://github.com/yeoman/generator-angular#service)
* [angular:constant](https://github.com/yeoman/generator-angular#service)
* [angular:decorator](https://github.com/yeoman/generator-angular#decorator)
* [angular:view](https://github.com/yeoman/generator-angular#view)


**Note: Generators are to be run from the root directory of your app.**

### Add to Index
By default, new scripts are added to the index file. However, this may not always be suitable. Some use cases:

* Manually added to the file
* Auto-added by a 3rd party plugin
* Using this generator as a sub-generator

To skip adding them to the index, pass in the skip-add argument:
```bash
yo angular:service serviceName --skip-add
```


## Testing

Running `grunt test` will run the client unit tests with karma and mocha.



