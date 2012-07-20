/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/16/12
 * Time: 10:45 AM
 */

define(['jquery', 'underscore', 'Backbone', 'Parse', 'moment', 'models/UserLocation', './ProfileView', './UserInfoView',
        'text!./HomeView.tpl'],
    function ($, _, Backbone, Parse, moment, UserLocation, ProfileView, UserInfoView, HomeTemplate) {

        var HomeView = Backbone.View.extend({

            $lstUsersNearby:null,

            events:{
                'pageshow':'this_pageshowHandler',
                'click #btnProfile':'btnProfile_clickHandler',
                'click #btnRefresh':'btnRefresh_clickHandler',
                'click #btnShareMyInfo':'btnShareMyInfo_clickHandler',
                'click #lstUsersNearby li':'lstUsersNearbyLi_clickHandler'
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
                        navigator.notification.alert('Could\'t obtain your location please try again!', null, 'Error');
                    });
                } else {

                    var locQuery = new Parse.Query(UserLocation);
                    locQuery.withinKilometers('coords',
                        new Parse.GeoPoint({latitude:coords.latitude, longitude:coords.longitude}),
                        0.05 // 50 meters range
                    );

                    locQuery.include("user");
                    locQuery.descending("createdAt");

                    $.mobile.showPageLoadingMsg('a', 'Loading geeks nearby...');

                    locQuery.find({
                        success:function (results) {
                            $.mobile.hidePageLoadingMsg();

                            var items = [];

                            _.each(results, function (userLocation) {

                                var user = userLocation.get('user');
                                if (user) {
                                    var $item = $('<li>'
                                        + '<a href="#">'
                                        + '<img src="'
                                        + (user.get('avatar') ? user.get('avatar').url : 'images/avatar-dark.png')
                                        + '" />'
                                        + '<h3>' + user.escape('username') + '</h3>'
                                        + '<p>' + user.escape('fullName') + '</p>'
                                        + '<p class="ui-li-aside">' + moment(userLocation.createdAt).fromNow() + '</p>'
                                        + '</a>'
                                        + '</li>').jqmData('user', user);

                                    items.push($item[0]);
                                }

                            }, that);

                            that.$lstUsersNearby.html(items).listview('refresh');

                        }, error:function (error) {
                            $.mobile.hidePageLoadingMsg();
                            navigator.notification.alert('error ' + error.message + ' code: ' + error.code, null, 'Error');
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

                    var locACL = new Parse.ACL(user);
                    locACL.setPublicReadAccess(true);
                    userLocation.setACL(locACL);

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
                            navigator.notification.alert(
                                'Could\'t store your current location: ' + error.message + ' code: ' + error.code,
                                null,
                                'Error'
                            );
                        }
                    });

                }, function (error) {

                    navigator.notification.alert('Could\'t obtain your location please try again!', null, 'Error');

                });
            },

            btnProfile_clickHandler:function (event) {
                $.mobile.jqmNavigator.pushView(new ProfileView(), {dataUrl:'fakeUrl'});
            },

            lstUsersNearbyLi_clickHandler:function (event) {
                var user = $(event.currentTarget).jqmData('user');
                $.mobile.jqmNavigator.pushView(new UserInfoView({model:user}));
            }

        });

        return HomeView;
    });