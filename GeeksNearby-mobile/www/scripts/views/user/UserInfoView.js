/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/16/12
 * Time: 10:56 AM
 */

define(['jquery', 'underscore', 'Backbone', 'text!./UserInfoView.tpl'],
    function ($, _, Backbone, UserInfoTemplate) {

        var UserInfoView = Backbone.View.extend({

            initialize:function (options) {

            },

            render:function () {

                this.$el.html(UserInfoTemplate);

                return this;
            }

        });

        return UserInfoView;
    });