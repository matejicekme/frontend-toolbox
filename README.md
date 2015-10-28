Front end Toolbox
==========================

Front-end toolbox, based on harvest (https://github.com/ryanbenson/Harvest).
Removed :
- HTML5 Boilerplate
- normalize

Added :
- Bootstrap 3 SASS

Todo :
- Adding gulp-file-include for better html templating
- Better Bower support
- manifest file for imported assets
- add command if you want separated CSS / JS files
- add command if you want unminified CSS / JS files

Install
==========================
1. First you'll need [node.js](http://nodejs.org/download/). Install then run `npm install -g npm@latest` command to make sure you've got the last version.
2. Install [gulp](http://gulpjs.com) and [Bower](http://bower.io/) globally with `npm install -g gulp bower`
3. Go to the root directory of frontend-toolbox then run `npm install` and `bower install`

Installation is now complete.

gulp commands
==========================
* `gulp` — Start development mode, edit files in `app` directory to serve them in `/dev` directory and view changes through browsersync
* `gulp deploy` — All your files will be stored & optimized in the `/dist` directory

More information
==========================
Everything come from [Harvest](https://github.com/ryanbenson/Harvest) by Ryan Benson. I've just added / modified some things to match my current front-end development tasks.

Version
==========================
1.0.0


Revision History
==========================
October 28, 2015
* First commit