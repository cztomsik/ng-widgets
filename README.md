# Deprecated

<!--<h3 class="doc-link"><a href="http://tomsik.cz/ng-widgets/docs/">Browse full documentation</a></h3>-->

<iframe src="http://ghbtns.com/github-btn.html?user=cztomsik&amp;repo=ng-widgets&amp;type=watch&amp;size=large&amp;count=true" allowtransparency="true" frameborder="0" scrolling="0" width="170" height="30"></iframe>
[![Build Status](https://travis-ci.org/cztomsik/ng-widgets.png?branch=master)](https://travis-ci.org/cztomsik/ng-widgets)


# ng-widgets

  - <a href="https://github.com/cztomsik/ng-widgets/blob/master/index.js" class="btn btn-default btn-lg">Source</a>
  - <a href="https://github.com/cztomsik/ng-widgets/archive/master.zip" class="btn btn-default btn-lg">Download</a>
  - <a href="https://twitter.com/share?url=https://github.com/cztomsik/ng-widgets" class="btn btn-default btn-lg">Share</a>


## Table of contents:

  - [Introduction](#introduction)
  - [Quickstart](#quickstart)
  - [Spread the word](#spreadtheword)
  - [Contributing](#contributing)
  - [Development](#development)
  - [License](#license)


## Introduction
ng-widgets is library full of stuff you were missing in angular.

  - bootstrap components
  - grids, lists
  - forms
  - and more & more every day...


## Quickstart

Include `ng-widgets.js`

    <script src=".../ng-widgets.js"></script>

Define angular.js **module** with `ng-widgets` as its dependency

    angular
      .module('my-app', ['ng-widgets'])
      ...

Tell angular about your module using `ng-app`

    <html ng-app="my-app">
    ...

Use any of [available widgets](#/elements)

    <nw-grid items=" users ">
      ...
    </nw-grid>


## Spread the word
Do you think this may be useful to someone? [Share link](https://twitter.com/share?url=https://github.com/cztomsik/ng-widgets) with your friends.

## Contributing

- tests & patches are welcome
- new features/widgets should be discussed first to suit overall feel of library
- use included .sublime-project (or set your IDE according to it)


## Development
In case you want to hack on ng-widgets, you'll need node.js first.

Then you can use npm to resolve all dependencies

    npm install

Compile sources, run linting & unit tests

    npm run build

To produce minified version

    npm run production

You might also enjoy automatic re-building (including linting and tests) after each file change:

    npm run watch


## LICENSE
BSD style, ISC

Copyright (c) 2013 - 2014, Kamil Tomšík <info@tomsik.cz>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
