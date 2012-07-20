/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/16/12
 * Time: 11:43 AM
 */

define(['jquery', 'underscore', 'Backbone', 'Parse', './SignUpView', './HomeView', 'text!./LoginView.tpl'],
    function ($, _, Backbone, Parse, SignUpView, HomeView, LoginTemplate) {

        var LoginView = Backbone.View.extend({

            events:{
                // Listening to jQM pagehow event
                'pageshow':'this_pageshowHandler',
                // Listening to jQM pagehide event
                'pagehide':'this_pagehideHandler',
                // Listening for click event on #btnLogIn button
                'click #btnLogIn':'btnLogIn_clickHandler',
                // Listening for click event on #btnSignUp button
                'click #btnSignUp':'btnSignUp_clickHandler'
            },

            render:function () {
                // Rendering a view from a template
                this.$el.html(LoginTemplate);
                return this;
            },

            btnLogIn_clickHandler:function (event) {
                var username = this.$('#txtUsername').val().toLowerCase(),
                    password = this.$('#txtPassword').val();

                $.mobile.showPageLoadingMsg('a', 'Authenticating...');

                // Login using entered username and password, this Parse.com specific API
                Parse.User.logIn(username, password, {
                    success:function (user) {
                        // On successful login pushing HomeView
                        $.mobile.jqmNavigator.pushView(new HomeView());
                    },
                    error:function (user, error) {
                        // Hiding message
                        $.mobile.hidePageLoadingMsg();
                        // Displaying alert that login went wrong
                        navigator.notification.alert('Wrong email or password!', null, 'Warning');
                    }
                });
            },

            btnSignUp_clickHandler:function (event) {
                // Pushing SignUpView, with a reverse (right-to-left) transition
                $.mobile.jqmNavigator.pushView(new SignUpView(), {reverse:true});
            },

            this_pageshowHandler:function () {
                // Getting current user if one is available in localStorage
                var user = Parse.User.current();
                if (user) {
                    $.mobile.showPageLoadingMsg('a', 'Authenticating...');
                    // Refetching a user as it may have changed on the server side
                    user.fetch({
                        success:function (user) {
                            // On success pushing HomeView
                            $.mobile.jqmNavigator.pushView(new HomeView());
                        },
                        error:function (user, error) {
                            $.mobile.hidePageLoadingMsg();
                            // Displaying alert that login went wrong
                            navigator.notification.alert('Login failed!', null, 'Warning');
                        }
                    });
                }
            },

            this_pagehideHandler:function (event) {
                // Clearing the login form
                this.$('#txtUsername').val('');
                this.$('#txtPassword').val('');
            }
        });

        return LoginView;
    });