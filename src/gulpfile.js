const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const pug = require('gulp-pug');

gulp.task('styles', () => {
    return gulp.src('./client/styles/*.less')
        .pipe(less())
        .pipe(gulp.dest('../dist/client/styles')); // Вероятно, вы хотите сохранять стили в dist/client/styles
});

gulp.task('templates', () => {
    return gulp.src('./client/templates/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('../dist/client/templates'));
});

gulp.task('scripts', () => {
    return gulp.src('./client/js/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest('../dist/client/js'));
});

gulp.task('static', () => {
    return gulp.src('./static/**/*')
        .pipe(gulp.dest('../dist/static'));
});

gulp.task('build', gulp.parallel('styles', 'templates', 'scripts', 'static'));

gulp.task('watch', () => {
    gulp.watch('./client/styles/**/*.less', gulp.series('styles'));
    gulp.watch('./client/templates/**/*.pug', gulp.series('templates'));
    gulp.watch('./client/js/**/*.js', gulp.series('scripts'));
    gulp.watch('./static/**/*', gulp.series('static'));
});

gulp.task('dev', gulp.series('build', 'watch'));

gulp.task('default', gulp.series('dev'));
