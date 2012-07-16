/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/16/12
 * Time: 4:48 PM
 */

define(['Parse'], function (Parse) {
    var UserLocation = Parse.Object.extend('UserLocation');
    return UserLocation;
});