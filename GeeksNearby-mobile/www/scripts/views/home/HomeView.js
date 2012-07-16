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

            $lstUsersNearby:null,

            events:{
                'click #btnShareMyInfo':'btnShareMyInfo_clickHandler',
                'click #btnSettings':'btnSettings_clickHandler'
            },

            initialize:function (options) {
            },

            render:function () {

                this.$el.html(HomeTemplate);
                this.$lstUsersNearby = this.$('#lstUsersNearby');

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

                            var items = [];

                            _.each(results, function (item) {

                                var avatarSrc = item.get('avatar') ? item.get('avatar').name : '',
                                    h3 = item.get('fullName') ? item.get('fullName') : item.get('username'),
                                    p = '';

                                $item = $('<li>'
                                    + '<a href="#">'
                                    + '<img src="' + avatarSrc + '" />'
                                    + '<h3>' + h3 + '</h3>'
                                    + '<p>' + p + '</p>'
                                    + '</a>'
                                    + '</li>');

                                items.push($item[0]);

                            }, that);

                            that.$lstUsersNearby.html(items).listview('refresh');


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
            },

            btnSettings_clickHandler:function (event) {
                Parse.User.logOut();
                $.mobile.jqmNavigator.popView();
            }


        });

        return HomeView;
    });