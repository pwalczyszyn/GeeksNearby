/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/16/12
 * Time: 11:06 AM
 */

define(['jquery', 'underscore', 'Backbone', 'Parse', 'text!./RegisterView.tpl'],
    function ($, _, Backbone, Parse, RegisterTemplate) {

        var RegisterView = Backbone.View.extend({

            $avatarImg:null,

            events:{
                'click #btnLogIn':'btnLogIn_clickHandler',
                'click #btnRegister':'btnRegister_clickHandler',
                'click #btnAddPhoto':'btnAddPhoto_clickHandler'
            },

            render:function () {
                this.$el.html(RegisterTemplate);
                return this;
            },

            btnRegister_clickHandler:function (event) {

                var $username = this.$('#txtUsername'),
                    $password = this.$('#txtPassword');

                if ($username.val().trim() != '' && $password.val() != '') {

                    var that = this,
                        $fullName = this.$('#txtFullName'),
                        $email = this.$('#txtEmail'),
                        $company = this.$('#txtCompany'),
                        $tel = this.$('#txtTel'),

                        user = new Parse.User();

                    user.set("username", $username.val().trim());
                    user.set("password", $password.val());
                    user.set("email1", $email.val().trim());
                    user.set("fullName", $fullName.val().trim());
                    user.set("company", $company.val().trim());
                    user.set("tel", $tel.val().trim());

                    $.mobile.showPageLoadingMsg('a', 'Registering...');

                    user.signUp(null, {
                        success:function (user) {

                            console.log('User registered!');
                            $.mobile.hidePageLoadingMsg();

                            if (that.imageURI) {

                                $.mobile.showPageLoadingMsg('a', 'Uploading avatar...');

                                var options = new FileUploadOptions();
                                options.fileKey = 'file';
                                options.fileName = that.imageURI.substr(that.imageURI.lastIndexOf('/') + 1);
                                options.mimeType = 'image/jpeg';
                                options.chunkedMode = false;
                                options.params = {
                                    headers:{
                                        'X-Parse-Application-Id':'DeE1IIk6SSWxDVAiywycW78jUBA4ZXXT1nZrFfoV',
                                        'X-Parse-REST-API-Key':'VL4OYFB7HXO00VHXMdaHBLGqO2Xbav2vyfn5VIP9'
                                    }
                                };

                                var fileTransfer = new FileTransfer();
                                fileTransfer.upload(that.imageURI, 'https://api.parse.com/1/files/' + options.fileName,
                                    function (response) {

                                        var decodedResponse = JSON.parse(decodeURI(response.response));
                                        console.log(decodedResponse);

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
                $.mobile.jqmNavigator.popView();
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
                        targetWidth:80,
                        targetHeight:80,
                        saveToPhotoAlbum:true,
                        correctOrientation:true,
                        encodingType:navigator.camera.EncodingType.JPEG,
                        destinationType:navigator.camera.DestinationType.FILE_URI,
                        MediaType:navigator.camera.MediaType.PICTURE
                    }
                );
            }
        });

        return RegisterView;
    });