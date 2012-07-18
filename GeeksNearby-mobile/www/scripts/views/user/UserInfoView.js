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

            events:{
                'click #btnBack':'btnBack_clickHandler',
                'click #btnAddToContacts':'btnAddToContacts_clickHandler'
            },

            render:function () {
                this.$el.html(_.template(UserInfoTemplate, {user:this.model}));
                return this;
            },

            btnBack_clickHandler:function (event) {
                $.mobile.jqmNavigator.popView();
            },

            btnAddToContacts_clickHandler:function (event) {

                var fullName = this.model.get('fullName'),
                    displayName = fullName !== '' ? fullName : this.model.get('username'),
                    contactProps = {
                        displayName:displayName,
                        nickname:this.model.get('username')
                    },
                    name = new ContactName();

                if (fullName !== '') {
                    name.formatted = fullName;
                    var split = fullName.split(' ');

                    if (split.length > 1) {
                        name.givenName = split[0];
                        if (split.length > 2) {
                            name.middleName = split[1];
                            name.familyName = split.slice(2, split.length).join(' ');
                        } else {
                            name.familyName = split[1];
                        }
                    }
                } else {
                    name.formatted = this.model.get('username');
                }
                contactProps.name = name;

                if (this.model.has('tel') && this.model.get('tel')) {
                    contactProps.phoneNumbers = [new ContactField('work', this.model.get('tel'), true)];
                }

                if (this.model.has('emailAddress') && this.model.get('emailAddress')) {
                    contactProps.emails = [new ContactField('work', this.model.get('emailAddress'), true)];
                }

                if (this.model.has('company') && this.model.get('company')) {
                    contactProps.organizations = [new ContactOrganization(true, 'work', this.model.get('company'))];
                }

                if (this.model.has('description') && this.model.get('description')) {
                    contactProps.note = this.model.get('description');
                }

                var urls = [];
                if (this.model.has('twitter') && this.model.get('twitter')) {
                    urls.push(new ContactField('twitter', this.model.get('twitter')));
                }
                if (this.model.has('facebook') && this.model.get('facebook')) {
                    urls.push(new ContactField('facebook', this.model.get('facebook')));
                }
                if (this.model.has('linkedIn') && this.model.get('linkedIn')) {
                    urls.push(new ContactField('twitter', this.model.get('linkedIn')));
                }
                if (this.model.has('website') && this.model.get('website')) {
                    urls.push(new ContactField('webpage', this.model.get('website')));
                }

                if (urls.length > 0)
                    contactProps.urls = urls;

                var contact = navigator.contacts.create(contactProps);
                contact.save();

                console.log('Contact saved!');

            }
        });

        return UserInfoView;
    });