var app = app || {};
app.options = {
    ageVerified: true
};
app.main = {
    test: function () {

        console.log('wahoo!');
    }
};
app.init = function () {
    app.main.test();
};