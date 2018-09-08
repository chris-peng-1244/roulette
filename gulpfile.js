const gulp = require('gulp');
const gulpBabel= require('gulp-babel');
const sourceMaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');

gulp.task('build', () => {
    gulp.src('src/**/*.js')
        .pipe(sourceMaps.init())
        .pipe(gulpBabel({
            "presets": [
                ["@babel/env", {targets: {node: "current"}}],
                "@babel/flow",
            ],
        }))
        .pipe(sourceMaps.write('.', {
            includeContent: false,
            sourceRoot: './src',
        }))
        .pipe(gulp.dest('lib'));
});

gulp.task('start', done => {
    const nodemonConfig = {
        "ignore": ["node_modules", "test", "lib", "logs", "gulpfile.js"],
        "env": {
            "NODE_ENV": "development",
        },
        "ext": ".js,.json",
        "watch": "./src",
        done,
        script: "lib/index.js",
        tasks: [ 'build' ],
    };
    nodemon(nodemonConfig);
});

gulp.task('watch', () => {
    gulp.watch('src/**/*.js', ['build']);
});
