let gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    jshint = require('gulp-jshint'),
    debug = require('gulp-debug'),
    babel = require('gulp-babel')

let sources = {
    sass: {
        src: [
            './assets-src/css/*.scss',
        ],
        dest: './assets/css/',
        debugConfig: {
            debug_info: true,
            errLogToConsole: true,
            outputStyle: 'expanded',
        },
    },
    postcss: {
        src: './assets-src/css/*.css',
        // for cssnano
        dest: './assets/css/',
        plugins: [
            autoprefixer({
                browsers: ['last 2 versions'],
            }),
            cssnano(),
            // for live
        ],
    },
    js: {
        src: './assets-src/js/*.js',
        dest: './assets/js/min',
    },
}

// noinspection DuplicatedCode
function prepareCss() {
    return gulp.src(sources.sass.src).
        pipe(sass(sources.sass.debugConfig).on('error', sass.logError)).
        pipe(gulp.dest(sources.sass.dest))
}

function postprocessCss() {
    return gulp.src(sources.postcss.src).
        pipe(postcss(sources.postcss.plugins)).
        pipe(gulp.dest(sources.postcss.dest))
}

function prepareJs() {
    return gulp.src(sources.js.src).
        pipe(babel({
            presets: [
                [
                    '@babel/preset-env', {},
                ],
                // 'minify',
            ],
            plugins: [
                '@babel/plugin-proposal-class-properties'
            ]
        })).
        pipe(gulp.dest(sources.js.dest))
}

// noinspection DuplicatedCode
let buildCss = gulp.series(prepareCss, postprocessCss)
let uglify = gulp.series(prepareJs)

var watch = function (done) {
    gulp.watch(sources.sass.src, buildCss)
    gulp.watch(sources.js.src, uglify)

    done()
}

exports.build = gulp.series(buildCss, uglify)
exports.watch = gulp.series(buildCss, uglify, watch)