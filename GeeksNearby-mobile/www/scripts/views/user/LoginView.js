/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/16/12
 * Time: 11:43 AM
 */

define(['jquery', 'underscore', 'Backbone', 'Parse', './RegisterView', 'views/home/HomeView', 'text!./LoginView.tpl'],
    function ($, _, Backbone, Parse, RegisterView, HomeView, LoginTemplate) {

        var LoginView = Backbone.View.extend({

            events:{
                'pageshow':'this_pageshowHandler',
                'click #btnLogIn':'btnLogIn_clickHandler',
                'click #btnRegister':'btnRegister_clickHandler'
            },

            render:function () {
                this.$el.html(LoginTemplate);
                return this;
            },

            btnLogIn_clickHandler:function (event) {
                var email = this.$('#txtUsername').val(),
                    password = this.$('#txtPassword').val();

                $.mobile.showPageLoadingMsg('a', 'Authenticating...');

                Parse.User.logIn(email, password, {
                    success:function (user) {
                        $.mobile.jqmNavigator.pushView(new HomeView());
                    },
                    error:function (user, error) {
                        $.mobile.hidePageLoadingMsg();
                        alert('Wrong email or password!');
                    }
                });

            },

            btnRegister_clickHandler:function (event) {
                $.mobile.jqmNavigator.pushView(new RegisterView());
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
                            alert('Login failed!');
                        }
                    });
                }
            }
        });

        return LoginView;
    });