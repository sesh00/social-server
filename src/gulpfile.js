const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const plumber = require('gulp-plumber');

gulp.task('styles', () => {
    return gulp.src('./styles/*.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest('../dist/styles'));
});

gulp.task('views', () => {
    return gulp.src('./views/static/*.pug')
        .pipe(plumber())
        .pipe(pug())
        .pipe(gulp.dest('../dist/views'));
});

gulp.task('scripts', () => {
    return gulp.src('./js/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('../dist/js'));
});

gulp.task('routes', () => {
    return gulp.src('./routes/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('../dist/routes'));
});

gulp.task('data', () => {
    return gulp.src('./data/*')
        .pipe(plumber())
        .pipe(gulp.dest('../dist/data'));
});

gulp.task('build', gulp.parallel('styles', 'views', 'scripts', 'routes', 'data'));

gulp.task('watch', () => {
    gulp.watch('./styles/*.less', gulp.series('styles'));
    gulp.watch('./views/*.pug', gulp.series('views'));
    gulp.watch('./js/*.js', gulp.series('scripts'));
    gulp.watch('./routes/*.js', gulp.series('routes'));
    gulp.watch('./data/*', gulp.series('data'));
});

gulp.task('dev', gulp.series('build', 'watch'));

gulp.task('default', gulp.series('dev'));
