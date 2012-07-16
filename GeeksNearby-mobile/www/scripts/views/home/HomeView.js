/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/16/12
 * Time: 10:45 AM
 */

define(['jquery', 'underscore', 'Backbone', 'Parse', 'models/UserLocation', 'text!./HomeView.tpl'],
    function ($, _, Backbone, Parse, UserLocation, HomeTemplate) {

        var HomeView = Backbone.View.extend({

            events:{
                'click #btnShareMyInfo':'btnShareMyInfo_clickHandler'
            },

            initialize:function (options) {
            },

            render:function () {
                this.$el.html(HomeTemplate);

                this.findUsersNearby();

                return this;
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

                    var userQuery = new Parse.Query(Parse.User);
                    userQuery.matchesKeyInQuery("objectId", "userId", locQuery);

                    userQuery.find({
                        success:function (results) {
                            // results has the list of users with a hometown team with a winning record

                            alert('success ' + results.length);

                        }, error:function (error) {
                            alert('error ' + error.message + ' code: ' + error.code);
                        }
                    });


                }
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

                    userLocation.set('userId', user.id);
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
            }


        });

        return HomeView;
    });