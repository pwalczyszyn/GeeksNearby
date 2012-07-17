/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/16/12
 * Time: 11:06 AM
 */

define(['jquery', 'underscore', 'Backbone', 'Parse', 'text!./SettingsView.tpl'],
    function ($, _, Backbone, Parse, SettingsTemplate) {

        var RegisterView = Backbone.View.extend({

            $avatarImg:null,

            events:{
                'click #btnBack':'btnBack_clickHandler',
                'click #btnLogOut':'btnLogOut_clickHandler'
            },

            render:function () {
                this.$el.html(_.template(SettingsTemplate, Parse.User.current().toJSON()));
                return this;
            },

            btnLogOut_clickHandler:function (event) {
                Parse.User.logOut();
                $.mobile.jqmNavigator.popToFirst();
            },

            btnBack_clickHandler:function (event) {
                $.mobile.jqmNavigator.popView();
            }

        });

        return RegisterView;
    });