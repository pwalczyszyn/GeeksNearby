/**
 * Created by Piotr Walczyszyn (outof.me | @pwalczyszyn)
 *
 * User: pwalczys
 * Date: 7/11/12
 * Time: 12:08 AM
 */

define(['jquery'], function ($) {

    // Listening for mobileinit event
    $(document).one("mobileinit", function () {

        // Setting jQM pageContainer to #container div, this solves some jQM flickers & jumps
        // I covered it here: http://outof.me/fixing-flickers-jumps-of-jquery-mobile-transitions-in-phonegap-apps/
        $.mobile.pageContainer = $('#container');

        // Setting to show message text in jQM loaders
        $.mobile.loadingMessageTextVisible = true;

        // 100ms for hoverDelay behaves better IMHO
        $.mobile.buttonMarkup.hoverDelay = 100;

        if (navigator.userAgent.match(/Android/))
            $.mobile.defaultPageTransition = 'none'; // I wasn't happy with jQM transition on Android
        else
            $.mobile.defaultPageTransition = 'slide'; // On iOS slide transitions look goog

    });
});