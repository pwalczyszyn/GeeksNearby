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
        $.mobile.loadingMessageTextVisible = true;
        $.mobile.buttonMarkup.hoverDelay = 50;

        if (navigator.userAgent.match(/Android/))
            $.mobile.defaultPageTransition = 'none'; // For some reason slide is not very fast on Android
        else
            $.mobile.defaultPageTransition = 'slide';

    });
});