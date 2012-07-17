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
            deps:['jquery', 'jqm-config', 'jqmNavigator']
        },
        overthrow:{
            exports:'overthrow'
        },
        'date.format':{}
    }
});

require(['domReady', 'Parse', 'views/user/LoginView', 'jqm', 'overthrow'],
    function (domReady, Parse, LoginView) {

        domReady(function () {

            function onDeviceReady() {
                Parse.initialize("DeE1IIk6SSWxDVAiywycW78jUBA4ZXXT1nZrFfoV", "QsKQMMV9tQLMiO9GfSh305qP6cy3gqfqCTSQyFEP");
                $.mobile.jqmNavigator.pushView(new LoginView());
            }

            if (navigator.userAgent.match(/(iPad|iPhone|Android)/))
                document.addEventListener("deviceready", onDeviceReady, false);
            else
                onDeviceReady();

        });

    }
);