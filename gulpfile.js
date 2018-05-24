const gulp = require('gulp')
const path = require('path')
const babel = require('rollup-plugin-babel')
const sourcemaps = require('gulp-sourcemaps')
const rollup = require('rollup')
const webserver = require('gulp-webserver')
const rename = require('gulp-rename')
const {uglify} = require('rollup-plugin-uglify')
const commonjs = require('rollup-plugin-commonjs')
const rollupResolve = require('rollup-plugin-node-resolve')

function resolve(...rest) {
    return path.resolve(...rest)
}

const src = resolve(__dirname, 'src')
const dist = resolve(__dirname, 'dist')

gulp.task('js', async function () {
    let bundle = await await rollup.rollup({
        input: resolve(src, 'js', 'index.js'),
        plugins: [
            babel({
                exclude: 'node_modules/**' // only transpile our source code
            }),
            rollupResolve({
                jsnext: true,
                main: true,
                browser: true
            }),
            commonjs()
        ]
    })
    await bundle.write({
        file: resolve(dist, 'js', 'tinyJquery.js'),
        name: '$',
        format: 'umd',
        sourcemap: 'inline'
    })
});

gulp.task('webserver', function () {
    gulp
        .src(__dirname)
        .pipe(webserver({livereload: true, open: true}));
})

gulp.task('watch', function () {
    gulp.watch(resolve(src, 'js', '**', '*.js'), ['js'])
})

gulp.task('dev', ['webserver', 'watch'])

gulp.task('build', async function () {
    let bundle = await await rollup.rollup({
        input: resolve(src, 'js', 'index.js'),
        plugins: [
            babel({
                exclude: 'node_modules/**' // only transpile our source code
            }),
            uglify(),
            rollupResolve({
                jsnext: true,
                main: true,
                browser: true
            }),
            commonjs()
        ]
    })
    await bundle.write({
        file: resolve(dist, 'js', 'tinyJquery.min.js'),
        name: '$',
        format: 'umd'
    })
});