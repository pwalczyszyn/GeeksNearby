/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/16/12
 * Time: 11:06 AM
 */

define(['jquery', 'underscore', 'Backbone', 'Parse', 'text!./SignUpView.tpl'],
    function ($, _, Backbone, Parse, RegisterTemplate) {

        var RegisterView = Backbone.View.extend({

            $avatarImg:null,

            events:{
                'click #btnLogIn':'btnLogIn_clickHandler',
                'click #btnSignUp':'btnSignUp_clickHandler',
                'click #btnAddPhoto':'btnAddPhoto_clickHandler',
                'focus #txtFacebook':'socialLinks_focusHandler',
                'focus #txtLinkedIn':'socialLinks_focusHandler',
                'focus #txtTwitter':'txtTwitter_focusHandler',
                'blur #txtTwitter':'txtTwitter_blurHandler',
                'focus #txtWebsite':'txtWebsite_focusHandler',
                'blur #txtWebsite':'txtWebsite_blurHandler'
            },

            render:function () {
                this.$el.html(RegisterTemplate);
                return this;
            },

            btnSignUp_clickHandler:function (event) {

                var $username = this.$('#txtUsername'),
                    $password = this.$('#txtPassword');

                if ($username.val().trim() != '' && $password.val() != '') {

                    var that = this,
                        $fullName = this.$('#txtFullName'),
                        $email = this.$('#txtEmail'),
                        $company = this.$('#txtCompany'),
                        $tel = this.$('#txtTel'),
                        $twitter = this.$('#txtTwitter'),
                        $facebook = this.$('#txtFacebook'),
                        $linkedIn = this.$('#txtLinkedIn'),
                        $website = this.$('#txtWebsite'),
                        user = new Parse.User();

                    user.set("username", $username.val().trim().toLowerCase());
                    user.set("password", $password.val());

                    // Basic info
                    user.set("emailAddress", $email.val().trim());
                    user.set("fullName", $fullName.val().trim());
                    user.set("company", $company.val().trim());
                    user.set("tel", $tel.val().trim());

                    // Social info
                    user.set("twitter", $twitter.val().trim());
                    user.set("facebook", $facebook.val() !== 'http://facebook.com/you' ? $facebook.val().trim() : '');
                    user.set("linkedIn", $linkedIn.val() !== 'http://linkedin.com/in/you' ? $linkedIn.val().trim() : '');
                    user.set("website", $website.val().trim());

                    $.mobile.showPageLoadingMsg('a', 'Registering...');

                    user.signUp(null, {
                        success:function (user) {

                            $.mobile.hidePageLoadingMsg();

                            if (that.imageURI) {

                                $.mobile.showPageLoadingMsg('a', 'Uploading avatar...');

                                var options = new FileUploadOptions();
                                options.fileKey = 'file';
                                options.fileName = that.imageURI.substr(that.imageURI.lastIndexOf('/') + 1);
                                options.mimeType = 'image/jpeg';

                                options.params = {
                                    headers:{
                                        'X-Parse-Application-Id':'DeE1IIk6SSWxDVAiywycW78jUBA4ZXXT1nZrFfoV',
                                        'X-Parse-REST-API-Key':'VL4OYFB7HXO00VHXMdaHBLGqO2Xbav2vyfn5VIP9'
                                    }
                                };

                                var fileTransfer = new FileTransfer();
                                fileTransfer.upload(that.imageURI, 'http://api.geeksnearby.com/upload',
                                    function (response) {

                                        var decodedResponse = JSON.parse(decodeURI(response.response));

                                        user.set('avatar', {
                                            'name':decodedResponse.name,
                                            '__type':'File'
                                        });
                                        user.save(null, {
                                            success:function (user) {
                                                $.mobile.hidePageLoadingMsg();

                                                $.mobile.jqmNavigator.popView();
                                            },
                                            error:function (user, error) {

                                                console.log('Error saving user, message: ' + error.message
                                                    + ' code: ' + error.code);

                                                $.mobile.hidePageLoadingMsg();

                                                $.mobile.jqmNavigator.popView();
                                            }
                                        });

                                    },
                                    function (error) {

                                        $.mobile.hidePageLoadingMsg();

                                        alert('Avatar upload failed ' + error);

                                    }, options);

                            } else {
                                $.mobile.jqmNavigator.popView();
                            }
                        },
                        error:function (user, error) {
                            $.mobile.hidePageLoadingMsg();
                            // Show the error message somewhere and let the user try again.
                            alert("Error: " + error.code + " " + error.message);
                        }
                    });

                } else {
                    alert('Login and password a required!');
                }
            },

            btnLogIn_clickHandler:function (event) {
                $.mobile.jqmNavigator.popView({reverse:false});
            },

            btnAddPhoto_clickHandler:function (event) {
                var that = this;
                navigator.camera.getPicture(
                    function (imageURI) {
                        that.imageURI = imageURI;

                        if (!that.$avatarImg) {
                            that.$avatarImg = $('<img />');
                            that.$('#btnAddPhoto').html(that.$avatarImg);
                        }
                        that.$avatarImg.attr('src', imageURI);

                    },
                    function (message) {
                        console.log('Get picture failed ' + message);
                    },
                    {
                        quality:50,
                        allowEdit:true,
                        targetWidth:160,
                        targetHeight:160,
//                        saveToPhotoAlbum:true,
                        correctOrientation:true,
                        encodingType:navigator.camera.EncodingType.JPEG,
                        destinationType:navigator.camera.DestinationType.FILE_URI,
                        MediaType:navigator.camera.MediaType.PICTURE
                    }
                );
            },

            socialLinks_focusHandler:function (event) {
                var field = event.currentTarget,
                    $field = $(field),
                    start = $field.val().lastIndexOf('/') + 1,
                    end = $field.val().length;

                _.defer(function () {
                    if (start != -1) {
                        if (field.createTextRange) {
                            var selRange = field.createTextRange();
                            selRange.collapse(true);
                            selRange.moveStart('character', start);
                            selRange.moveEnd('character', end);
                            selRange.select();
                        } else if (field.setSelectionRange) {
                            field.setSelectionRange(start, end);
                        } else if (field.selectionStart) {
                            field.selectionStart = start;
                            field.selectionEnd = end;
                        }
                    }
                });
            },

            txtTwitter_focusHandler:function (event) {
                var $field = $(event.currentTarget);
                if ($field.val() === '') $field.val('@');
            },

            txtTwitter_blurHandler:function (event) {
                var $field = $(event.currentTarget);
                if ($field.val() === '@') $field.val(null);
            },

            txtWebsite_focusHandler:function (event) {
                var $field = $(event.currentTarget);
                if ($field.val() === '') $field.val('http://');
            },

            txtWebsite_blurHandler:function (event) {
                var $field = $(event.currentTarget);
                if ($field.val() === 'http://') $field.val(null);
            }
        });

        return RegisterView;
    });