/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/16/12
 * Time: 11:43 AM
 */

define(['jquery', 'underscore', 'Backbone', 'Parse', './SignUpView', 'views/home/HomeView', 'text!./LoginView.tpl'],
    function ($, _, Backbone, Parse, SignUpView, HomeView, LoginTemplate) {

        var LoginView = Backbone.View.extend({

            events:{
                'pageshow':'this_pageshowHandler',
                'pagehide':'this_pagehideHandler',
                'click #btnLogIn':'btnLogIn_clickHandler',
                'click #btnSignUp':'btnSignUp_clickHandler'
            },

            render:function () {
                this.$el.html(LoginTemplate);
                return this;
            },

            btnLogIn_clickHandler:function (event) {
                var username = this.$('#txtUsername').val().toLowerCase(),
                    password = this.$('#txtPassword').val();

                $.mobile.showPageLoadingMsg('a', 'Authenticating...');

                Parse.User.logIn(username, password, {
                    success:function (user) {
                        $.mobile.jqmNavigator.pushView(new HomeView());
                    },
                    error:function (user, error) {
                        $.mobile.hidePageLoadingMsg();
                        navigator.notification.alert('Wrong email or password!', null, 'Warning');
                    }
                });
            },

            btnSignUp_clickHandler:function (event) {
                $.mobile.jqmNavigator.pushView(new SignUpView(), {reverse:true});
            },

            this_pageshowHandler:function () {
                var user = Parse.User.current();
                if (user) {
                    $.mobile.showPageLoadingMsg('a', 'Authenticating...');
                    user.fetch({
                        success:function (user) {
                            $.mobile.jqmNavigator.pushView(new HomeView());
                        },
                        error:function (user, error) {
                            $.mobile.hidePageLoadingMsg();
                            navigator.notification.alert('Login failed!', null, 'Warning');
                        }
                    });
                }
            },

            this_pagehideHandler:function (event) {
                this.$('#txtUsername').val('');
                this.$('#txtPassword').val('');
            }
        });

        return LoginView;
    });