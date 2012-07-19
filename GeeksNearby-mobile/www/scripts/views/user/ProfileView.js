/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/16/12
 * Time: 11:06 AM
 */

define(['jquery', 'underscore', 'Backbone', 'Parse', 'models/UserLocation', 'text!./ProfileView.tpl'],
    function ($, _, Backbone, Parse, UserLocation, ProfileTemplate) {

        var RegisterView = Backbone.View.extend({

            $imgAvatar:null,

            avatarRef:null,

            changedInputs:null,

            events:{
                'click #btnBack':'btnBack_clickHandler',
                'click #btnLogOut':'btnLogOut_clickHandler',
                'change input':'input_changeHandler',
                'click #btnAddPhoto':'btnAddPhoto_clickHandler',
                'click #btnDeleteAccount':'btnDeleteAccount_clickHandler'
            },

            initialize:function (options) {
                this.changedInputs = {};
            },

            render:function () {
                this.$el.html(_.template(ProfileTemplate, {user:Parse.User.current()}));
                this.$imgAvatar = this.$('#imgAvatar');
                return this;
            },

            btnLogOut_clickHandler:function (event) {
                Parse.User.logOut();
                $.mobile.jqmNavigator.popToFirst();
            },

            input_changeHandler:function (event) {
                this.changedInputs[event.currentTarget.name] = event.currentTarget;
            },

            btnBack_clickHandler:function (event) {

                if (Object.keys(this.changedInputs).length == 0 && !this.avatarRef) {
                    $.mobile.jqmNavigator.popView();
                } else {

                    var user = Parse.User.current();

                    for (var fieldName in this.changedInputs) {
                        var $input = $(this.changedInputs[fieldName]);

                        if (fieldName === 'password' && $input.val() === '')
                            continue;

                        user.set(fieldName, $input.val());
                    }

                    if (this.avatarRef) user.set('avatar', this.avatarRef);

                    $.mobile.showPageLoadingMsg('a', 'Saving Geek info...');
                    user.save(null, {
                        success:function (user) {
                            $.mobile.jqmNavigator.popView();
                        },
                        error:function (user, error) {
                            navigator.notification.alert('Saving failed: ' + error.message, null, 'Error');
                            $.mobile.jqmNavigator.popView();
                        }
                    });
                }
            },

            btnAddPhoto_clickHandler:function (event) {
                var that = this;
                navigator.camera.getPicture(
                    function (imageURI) {
                        that.$imgAvatar.attr('src', imageURI);

                        var options = new FileUploadOptions();
                        options.fileKey = 'file';
                        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
                        options.mimeType = 'image/jpeg';

                        options.params = {
                            headers:{
                                'X-Parse-Application-Id':'DeE1IIk6SSWxDVAiywycW78jUBA4ZXXT1nZrFfoV',
                                'X-Parse-REST-API-Key':'VL4OYFB7HXO00VHXMdaHBLGqO2Xbav2vyfn5VIP9'
                            }
                        };

                        var fileTransfer = new FileTransfer();
                        fileTransfer.upload(imageURI, 'http://api.geeksnearby.com/upload.php',
                            function (response) {
                                var decodedResponse = JSON.parse(decodeURI(response.response));
                                that.avatarRef = {'name':decodedResponse.name, '__type':'File'};
                            },
                            function (error) {
                                navigator.notification.alert('Avatar upload failed: ' + error, null, 'Error');
                            }, options);

                    },
                    function (message) {
                        console.log('Get picture failed: ' + message);
                    },
                    {
                        quality:50,
                        allowEdit:true,
                        targetWidth:80,
                        targetHeight:80,
                        correctOrientation:true,
                        encodingType:navigator.camera.EncodingType.JPEG,
                        destinationType:navigator.camera.DestinationType.FILE_URI,
                        MediaType:navigator.camera.MediaType.PICTURE
                    }
                );
            },

            btnDeleteAccount_clickHandler:function (event) {

                function deleteUser(buttonIndex) {
                    if (buttonIndex == 1) {
                        var user = Parse.User.current(),
                            locsQuery = new Parse.Query(UserLocation),
                            locsQuerySuccess = function (locs) {
                                _.invoke(locs, 'destroy');

                                if (locs.length > 0) {
                                    locsQuery.find({success:locsQuerySuccess, error:locsQueryError});
                                }
                                else {
                                    user.destroy({
                                        success:function (user) {
                                            $.mobile.jqmNavigator.popToFirst();
                                        },
                                        error:function (user, error) {
                                            navigator.notification.alert('Something went wrong: ' + error.message, null, 'Error');
                                        }
                                    });
                                }
                            },
                            locsQueryError = function (error) {
                                navigator.notification.alert('Something went wrong: ' + error.message, null, 'Error');
                            };

                        var locsQuery = new Parse.Query(UserLocation);
                        locsQuery.equalTo('user', user);
                        locsQuery.find({success:locsQuerySuccess, error:locsQueryError});
                    }
                }

                var message = "Do you want to delete your profile?";
                if (navigator.notification.confirm) {
                    navigator.notification.confirm(message, deleteUser, 'Delete a Geek?', 'Yes,No');
                } else {
                    var answer = confirm(message);
                    if (answer) deleteUser(1);
                }

            }
        });

        return RegisterView;
    });