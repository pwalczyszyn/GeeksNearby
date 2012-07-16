/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/11/12
 * Time: 12:08 AM
 */

define(['jquery'], function ($) {
    $(document).one("mobileinit", function () {

        $.mobile.pageContainer = $('#container');
        $.mobile.defaultPageTransition = 'slide';
        $.mobile.loadingMessageTextVisible = true;
        $.mobile.buttonMarkup.hoverDelay = 30;

    });
});