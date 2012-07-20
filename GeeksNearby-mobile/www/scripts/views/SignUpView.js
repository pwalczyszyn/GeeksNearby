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

            $imgAvatar:null,

            events:{
                'click #btnLogIn':'btnLogIn_clickHandler',
                'click #btnSignUp':'btnSignUp_clickHandler',
                'click #btnAddPhoto':'btnAddPhoto_clickHandler',
                'focus #txtFacebook':'socialLinks_focusHandler',
                'focus #txtLinkedIn':'socialLinks_focusHandler',
                'focus #txtTwitter':'socialLinks_focusHandler',
                'focus #txtWebsite':'txtWebsite_focusHandler',
                'blur #txtWebsite':'txtWebsite_blurHandler'
            },

            render:function () {
                this.$el.html(RegisterTemplate);
                this.$imgAvatar = this.$('#imgAvatar');
                return this;
            },

            btnSignUp_clickHandler:function (event) {

                var $username = this.$('#txtUsername'),
                    $password = this.$('#txtPassword');

                // Doing simple validation, making sure username and password are not empty
                if ($username.val().trim() != '' && $password.val() != '') {

                    var that = this,
                        $description = this.$('#txtDescription'),
                        $fullName = this.$('#txtFullName'),
                        $email = this.$('#txtEmail'),
                        $company = this.$('#txtCompany'),
                        $tel = this.$('#txtTel'),
                        $twitter = this.$('#txtTwitter'),
                        $facebook = this.$('#txtFacebook'),
                        $linkedIn = this.$('#txtLinkedIn'),
                        $website = this.$('#txtWebsite'),
                        user = new Parse.User();

                    // Setting username and password
                    user.setUsername($username.val().trim().toLowerCase());
                    user.setPassword($password.val());

                    // User description field
                    user.set('description', $description.val().trim());

                    // Basic info
                    user.set("emailAddress", $email.val().trim());
                    user.set("fullName", $fullName.val().trim());
                    user.set("company", $company.val().trim());
                    user.set("tel", $tel.val().trim());

                    // Social info
                    user.set("twitter", $twitter.val() !== 'http://twitter.com/@you' ? $twitter.val().trim() : '');
                    user.set("facebook", $facebook.val() !== 'http://facebook.com/you' ? $facebook.val().trim() : '');
                    user.set("linkedIn", $linkedIn.val() !== 'http://linkedin.com/in/you' ? $linkedIn.val().trim() : '');
                    user.set("website", $website.val().trim());

                    $.mobile.showPageLoadingMsg('a', 'Registering...');

                    // Using Parse.com API to signup a user
                    user.signUp(null, {
                        success:function (user) {

                            $.mobile.hidePageLoadingMsg();

                            // If user took a picture
                            if (that.imageURI) {

                                $.mobile.showPageLoadingMsg('a', 'Uploading avatar...');

                                // PhoneGap API to upload files
                                var options = new FileUploadOptions();
                                options.fileKey = 'file';
                                options.fileName = that.imageURI.substr(that.imageURI.lastIndexOf('/') + 1);
                                options.mimeType = 'image/jpeg';
                                options.chunkedMode = false;
                                options.params = {
                                    // Required Parse.com headers to upload files
                                    headers:{
                                        'X-Parse-Application-Id':'DeE1IIk6SSWxDVAiywycW78jUBA4ZXXT1nZrFfoV',
                                        'X-Parse-REST-API-Key':'VL4OYFB7HXO00VHXMdaHBLGqO2Xbav2vyfn5VIP9'
                                    }
                                };

                                var fileTransfer = new FileTransfer();
                                // Had to proxy the upload because Parse.com didn't accept http file uploads
                                fileTransfer.upload(that.imageURI, 'http://api.geeksnearby.com/upload.php',
                                    function (response) {

                                        // Decoding response because it comes a string
                                        var decodedResponse = JSON.parse(decodeURI(response.response));

                                        // Setting avatar file
                                        user.set('avatar', {
                                            'name':decodedResponse.name,
                                            '__type':'File'
                                        });

                                        user.save(null, {
                                            success:function (user) {
                                                // Popping to a LoginView
                                                $.mobile.jqmNavigator.popView();
                                            },
                                            error:function (user, error) {

                                                navigator.notification.alert(
                                                    'Something went wrong saving avatar info (message: '
                                                        + error.message + ' code: ' + error.code
                                                        + '), you can try later from your profile editor!', null, 'Error');

                                                // Popping to a LoginView
                                                $.mobile.jqmNavigator.popView();
                                            }
                                        });

                                    },
                                    function (error) {

                                        navigator.notification.alert(
                                            'Something went wrong uploading avatar (error: '
                                                + error
                                                + '), you can try later from your profile editor!', null, 'Error');

                                        // Popping to a LoginView
                                        $.mobile.jqmNavigator.popView();

                                    }, options);

                            } else {
                                $.mobile.jqmNavigator.popView();
                            }
                        },
                        error:function (user, error) {
                            $.mobile.hidePageLoadingMsg();
                            // Show the error message somewhere and let the user try again.
                            navigator.notification.alert("Error: " + error.code + " " + error.message, null, 'Error');
                        }
                    });

                } else {
                    navigator.notification.alert('Login and password a required!', null, 'Error');
                }
            },

            btnLogIn_clickHandler:function (event) {
                // Popping to LoginView with left-to-right transition
                $.mobile.jqmNavigator.popView({reverse:false});
            },

            btnAddPhoto_clickHandler:function (event) {
                var that = this;
                // Using PhoneGap API to take new picture
                navigator.camera.getPicture(
                    function (imageURI) {
                        // Setting view level imageURI, to be uploaded when user signs up
                        that.imageURI = imageURI;
                        that.$imgAvatar.attr('src', imageURI);
                    },
                    function (message) {
                        navigator.notification.alert('Taking picture failed: ' + message, null, 'Error');
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