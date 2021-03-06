//initialize all of our variables
var app, base, concat, directory, gulp, gutil, hostname, path, refresh, sass, uglify, imagemin, minifyCSS, del, browserSync, autoprefixer, gulpSequence, shell, sourceMaps, plumber, filter, mainBowerFiles, fileinclude;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

//load all of our dependencies
//add more here if you want to include more libraries
gulp        = require('gulp');
gutil       = require('gulp-util');
concat      = require('gulp-concat');
uglify      = require('gulp-uglify');
sass        = require('gulp-sass');
sourceMaps  = require('gulp-sourcemaps');
imagemin    = require('gulp-imagemin');
minifyCSS   = require('gulp-minify-css');
browserSync = require('browser-sync');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
shell       = require('gulp-shell');
plumber     = require('gulp-plumber');
filter 		= require('gulp-filter');
mainBowerFiles = require ('gulp-main-bower-files');
fileinclude = require ('gulp-file-include');

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "dev/"
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});


//compressing images & handle SVG files
gulp.task('images', function(tmp) {
    return gulp.src(['app/images/*.jpg', 'app/images/*.png'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dev/images'));
});

//compressing images & handle SVG files
gulp.task('images-deploy', function() {
    gulp.src(['app/images/**/*', '!app/images/README'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest('dist/images'));
});

//compiling our Javascripts
gulp.task('scripts', function() {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/_includes/**/*.js', 'app/scripts/**/*.js'])
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber())
                //this is the filename of the compressed version of our JS
                .pipe(concat('app.js'))
                //catch errors
                .on('error', gutil.log)
                //where we will store our finalized, compressed script
                .pipe(gulp.dest('dev/scripts'))
                //notify browserSync to refresh
                .pipe(browserSync.reload({stream: true}));
});

//compiling our Javascripts for deployment
gulp.task('scripts-deploy', function() {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/_includes/**/*.js', 'app/scripts/**/*.js'])
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber())
                //this is the filename of the compressed version of our JS
                .pipe(concat('app.js'))
                //compress :D
                .pipe(uglify())
                //where we will store our finalized, compressed script
                .pipe(gulp.dest('dist/scripts'));
});

//adding Bower files
gulp.task('main-bower-files', function() {
    var filterJS = filter('**/*.js', { restore: true });
    var filterSCSS = filter('**/*.scss', { restore: true });
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles({
            overrides: {
                bootstrap: {
                    main: [
                        './assets/javascripts/bootstrap.js',
                    ]
                }
            }
        }))
        .pipe(filterJS)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dev/vendor/scripts'))
        .pipe(filterJS.restore)
        .pipe(filterSCSS)
        .pipe(sass({
          	errLogToConsole: true
       	}))
        .pipe(gulp.dest('./dev/vendor/css'))
        .pipe(filterSCSS.restore)
});

//deploy Bower files
gulp.task('main-bower-files-deploy', function() {
    var filterJS = filter('**/*.js', { restore: true });
    var filterSCSS = filter('**/*.scss', { restore: true });
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles({
            overrides: {
                bootstrap: {
                    main: [
                        './assets/javascripts/bootstrap.js',
                    ]
                }
            }
        }))
        .pipe(filterJS)
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/vendor/scripts'))
        .pipe(filterJS.restore)
        .pipe(filterSCSS)
        .pipe(sass({
          	errLogToConsole: true
       	}))
        .pipe(gulp.dest('./dist/vendor/css'))
        .pipe(filterSCSS.restore)
});

//adding custom fonts imported by bower packages
gulp.task('main-bower-fonts', function() {
	return gulp.src(['./bower_components/**/*.eot','./bower_components/**/*.svg','./bower_components/**/*.ttf', './bower_components/**/*.woff', './bower_components/**/*.woff2'])
	.pipe(gulp.dest('./dev/vendor/fonts'))
});

//deploy custom fonts imported by bower packages
gulp.task('main-bower-fonts-deploy', function() {
	return gulp.src(['./bower_components/**/*.eot','./bower_components/**/*.svg','./bower_components/**/*.ttf', './bower_components/**/*.woff', './bower_components/**/*.woff2'])
	.pipe(gulp.dest('./dist/vendor/fonts'))
});


//compiling our SCSS files
gulp.task('styles', function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src('app/styles/init.scss')
                //prevent pipe breaking caused by errors from gulp plugins
                .pipe(plumber())
                //get sourceMaps ready
                .pipe(sourceMaps.init())
                //include SCSS and list every "include" folder
                .pipe(sass({
                      errLogToConsole: true,
                      includePaths: [
                      	  'app/bootstrap-sass/assets/stylesheets',
                          'app/styles/scss/'
                      ]
                }))
                .pipe(autoprefixer({
                   browsers: autoPrefixBrowserList,
                   cascade:  true
                }))
                //catch errors
                .on('error', gutil.log)
                //the final filename of our combined css file
                .pipe(concat('styles.css'))
                //get our sources via sourceMaps
                .pipe(sourceMaps.write())
                //where to save our final, compressed css file
                .pipe(gulp.dest('dev/styles'))
                //notify browserSync to refresh
                .pipe(browserSync.reload({stream: true}));
});

//compiling our SCSS files for deployment
gulp.task('styles-deploy', function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src('app/styles/init.scss')
                .pipe(plumber())
                //include SCSS includes folder
                .pipe(sass({
                      includePaths: [
                      	  'app/bootstrap-sass/assets/stylesheets',
                          'app/styles/scss'
                      ]
                }))
                .pipe(autoprefixer({
                  browsers: autoPrefixBrowserList,
                  cascade:  true
                }))
                //the final filename of our combined css file
                .pipe(concat('styles.css'))
                .pipe(minifyCSS())
                //where to save our final, compressed css file
                .pipe(gulp.dest('dist/styles'));
});

//basically just keeping an eye on all HTML files
gulp.task('html', function() {
    //watch any and all HTML files and refresh when something changes
    return gulp.src('app/*.html')
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(browserSync.reload({stream: true}))
        //catch errors
        .on('error', gutil.log)
        .pipe(gulp.dest('dev'));
});

//migrating over all HTML files for deployment
gulp.task('html-deploy', function() {
    //grab everything, which should include htaccess, robots, etc
    gulp.src('app/*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist'));

    //grab any hidden files too
    gulp.src('app/.*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist'));

    gulp.src('app/fonts/**/*')
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist/fonts'));

    //grab all of the styles
    gulp.src(['app/styles/*.css', '!app/styles/styles.css'])
        //prevent pipe breaking caused by errors from gulp plugins
        .pipe(plumber())
        .pipe(gulp.dest('dist/styles'));
});

//just keep an eye on .htaccess file for dev purposes
gulp.task('htaccess', function() {
	gulp.src('app/.htaccess')
	.pipe(plumber())
    .pipe(gulp.dest('dev'));
});

//cleans our dist directory in case things got deleted
gulp.task('clean', function() {
    return shell.task([
      'rm -rf dist'
    ]);
});

//create folders using shell
gulp.task('scaffold', function() {
  return shell.task([
      'mkdir dist',
      'mkdir dist/fonts',
      'mkdir dist/images',
      'mkdir dist/scripts',
      'mkdir dist/vendor',
      'mkdir dist/styles'
    ]
  );
});

//this is our master task when you run `gulp` in CLI / Terminal
//this is the main watcher to use when in active development
//  this will:
//  startup the web server,
//  start up browserSync
//  compress all scripts and SCSS files
gulp.task('default', ['browserSync', 'scripts','images','main-bower-files','main-bower-fonts','styles','html','htaccess'], function() {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch('app/scripts/**', ['scripts']);
    gulp.watch('app/styles/**', ['styles']);
    gulp.watch('app/images/**', ['images']);
    gulp.watch('app/.htaccess', ['htaccess']);
    gulp.watch('app/*.html', ['html']);
    gulp.watch('app/templates/**/*.html', ['html']);
});

//this is our deployment task, it will set everything for deployment-ready files
gulp.task('deploy', gulpSequence('clean', 'scaffold', ['scripts-deploy', 'main-bower-files','main-bower-files-deploy','main-bower-fonts-deploy', 'styles-deploy', 'images-deploy'], 'html-deploy'));