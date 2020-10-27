const {
    src,
    dest,
    watch,
    series,
    parallel
} = require('gulp');

const del = require('del');
const babel = require('gulp-babel');
const cached = require('gulp-cached');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const connect = require('gulp-connect');
const changed = require('gulp-changed');

const compileTpl = require('gulp-seajs-tpl');

const clean = () => del(['build/**/*']);


var paths = {
    output: './build/',
    css: './src/**/*.scss',
    js: ['./src/**/*.js', '!src/thirdPlugin/**/*'],
    html: './src/*.html',
    tpl: './src/**/*.tpl',
    img: './src/img/**/*',
    plugin: './src/thirdPlugin/**/*'
}

function css() {
    return src(paths.css)
        .pipe(changed(paths.output, {
            extension: '.css'
        }))
        .pipe(sass())
        .pipe(cleanCss())
        .pipe(dest(paths.output))
}

function js() {
    return src(paths.js, {
            sourcemaps: true
        })
        .pipe(changed(paths.output, {
            extension: '.js'
        }))
        .pipe(babel({
            presets: ['env']
        }))
        /*.pipe(uglify({
            mangle: {
                reserved :['require','exports','module','$']
            },
            compress: true
        }))*/
        .pipe(dest(paths.output, {
            sourcemaps: true
        }))
}

function html() {
    return src(paths.html)
        .pipe(changed(paths.output, {
            extension: '.html'
        }))
        .pipe(dest(paths.output))
}

const reload = () => src(paths.html)
    .pipe(connect.reload());

const copy = () => src([paths.plugin])
    .pipe(dest(paths.output + 'thirdPlugin'));

const img = () => src(paths.img)
    .pipe(dest(paths.output + 'img'));

const tpl = () => {
    return src(paths.tpl)
        .pipe(compileTpl())
        .pipe(dest(paths.output));
}

const watchFile = () => {
    watch(paths.css, css);
    watch(paths.js, js);
    watch(paths.img, img);
    watch(paths.html, html);
    watch(paths.tpl, tpl);
    watch('src/**/*.*', reload);

    connect.server({
        root: paths.output.root,
        port: 9100,
        livereload: true
    });
}



exports.js = js;
exports.css = css;
exports.clean = clean;
exports.html = html;
exports.copy = copy;
exports.img = img;
exports.tpl = tpl;

exports.default = series(parallel(css, js, tpl, copy), img, html, watchFile);