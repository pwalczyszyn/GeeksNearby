/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/4/12
 * Time: 7:52 PM
 */

require.config({
    paths:{
        text:'libs/require/text',
        domReady:'libs/require/domReady',
        jquery:'libs/jquery/jquery-1.7.1',
        Backbone:'libs/backbone/backbone',
        underscore:'libs/underscore/underscore',
        jqm:'libs/jquery.mobile/jquery.mobile-1.1.1',
        jqmNavigator:'libs/jquery.mobile/jqmNavigator',
        Parse:'libs/parse/parse-1.0.8',
        appModel:'models/appModel',
        overthrow:'libs/overthrow/overthrow',
        moment:'libs/moment/moment'
    },
    shim:{
        Backbone:{
            deps:['underscore', 'jquery'],
            exports:'Backbone'
        },
        underscore:{
            exports:'_'
        },
        Parse:{
            exports:'Parse'
        },
        jqm:{
            deps:['jquery', 'jqm-config'/* jQM specific config */, 'jqmNavigator']
        },
        overthrow:{
            exports:'overthrow'
        }
    }
});

require(['domReady', 'Parse', 'views/LoginView', 'jqm', 'overthrow'],
    function (domReady, Parse, LoginView) {

        // domReady is RequireJS plugin that triggers when DOM is ready
        domReady(function () {

            function onDeviceReady(desktop) {

                if (desktop !== true)
                    cordova.exec(null, null, "SplashScreen", "hide", []);

                // TODO: check if this works on Android
                // Hiding splash screen
                cordova.exec(null, null, "SplashScreen", "hide", []);

                // Initializing Parse API's
                Parse.initialize("DeE1IIk6SSWxDVAiywycW78jUBA4ZXXT1nZrFfoV", "QsKQMMV9tQLMiO9GfSh305qP6cy3gqfqCTSQyFEP");

                // Pushing LoginView as a first view of the app
                $.mobile.jqmNavigator.pushView(new LoginView());

            }

            if (navigator.userAgent.match(/(iPad|iPhone|Android)/)) {
                // This is running on a device so waiting for deviceready event
                document.addEventListener("deviceready", onDeviceReady, false);
            } else {
                // Polyfill for navigator.notification features to work in browser when debugging
                navigator.notification = {alert:function (message) {
                    // Using standard alert
                    alert(message);
                }};
                // On desktop don't have to wait for anything
                onDeviceReady(true);
            }
        });
    }
);