/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/16/12
 * Time: 10:45 AM
 */

define(['jquery', 'underscore', 'Backbone', 'Parse', 'moment', 'models/UserLocation', 'views/user/SettingsView',
        'text!./HomeView.tpl'],
    function ($, _, Backbone, Parse, moment, UserLocation, SettingsView, HomeTemplate) {

        var HomeView = Backbone.View.extend({

            $lstUsersNearby:null,

            events:{
                'pageshow':'this_pageshowHandler',
                'click #btnSettings':'btnSettings_clickHandler',
                'click #btnRefresh':'btnRefresh_clickHandler',
                'click #btnShareMyInfo':'btnShareMyInfo_clickHandler'
            },

            render:function () {
                this.$el.html(HomeTemplate);
                this.$lstUsersNearby = this.$('#lstUsersNearby');
                return this;
            },

            this_pageshowHandler:function (event) {
                if (!this.pageShowed) {
                    this.pageShowed = true;

                    this.findUsersNearby();
                }
            },

            findUsersNearby:function (coords) {
                var that = this;
                if (!coords) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        that.findUsersNearby(position.coords);
                    }, function (error) {
                        alert('Could\'t obtain your location please try again!');
                    });
                } else {

                    var locQuery = new Parse.Query(UserLocation);
                    locQuery.near('coords', new Parse.GeoPoint({latitude:coords.latitude, longitude:coords.longitude}));
                    locQuery.include("user");

                    $.mobile.showPageLoadingMsg('a', 'Loading geeks nearby...');

                    locQuery.find({
                        success:function (results) {
                            $.mobile.hidePageLoadingMsg();

                            var items = [];

                            _.each(results, function (userLocation) {

                                var user = userLocation.get('user'),
                                    $item = $('<li>'
                                        + '<a href="#">'
                                        + '<img src="'
                                        + (user.get('avatar') ? user.get('avatar').url : 'images/avatar-dark.png')
                                        + '" />'
                                        + '<h3>' + user.get('username') + '</h3>'
                                        + '<p>' + user.get('fullName') + '</p>'
                                        + '<p class="ui-li-aside">' + moment(userLocation.createdAt).fromNow() + '</p>'
                                        + '</a>'
                                        + '</li>').jqmData('user', user);

                                items.push($item[0]);

                            }, that);

                            that.$lstUsersNearby.html(items).listview('refresh');

                        }, error:function (error) {
                            $.mobile.hidePageLoadingMsg();
                            alert('error ' + error.message + ' code: ' + error.code);
                        }
                    });
                }
            },

            btnRefresh_clickHandler:function (event) {
                this.findUsersNearby();
            },

            btnShareMyInfo_clickHandler:function (event) {
                var that = this;
                navigator.geolocation.getCurrentPosition(function (position) {

                    var user = Parse.User.current(),
                        userLocation = new UserLocation(),
                        coords = new Parse.GeoPoint({
                            latitude:position.coords.latitude,
                            longitude:position.coords.longitude
                        });

                    userLocation.set('user', user);
                    userLocation.set('coords', coords);

                    $.mobile.showPageLoadingMsg('a', 'Saving geo data...');
                    userLocation.save(null, {
                        success:function (userLocation) {
                            $.mobile.hidePageLoadingMsg();
                            that.findUsersNearby(position.coords);
                        },
                        error:function (userLocation, error) {
                            $.mobile.hidePageLoadingMsg();
                            alert('Could\'t store your current location: ' + error.message + ' code: ' + error.code);
                        }
                    });

                }, function (error) {

                    alert('Could\'t obtain your location please try again!');

                });
            },

            btnSettings_clickHandler:function (event) {
                $.mobile.jqmNavigator.pushView(new SettingsView());
            }


        });

        return HomeView;
    });