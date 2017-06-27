;(function (root, factory) {

    // AMD. Register as an anonymous module depending on jQuery.
    if (typeof define === 'function' && define.amd) define(['jquery', './../body-toucher/body-toucher', './../gush/gush'], factory);

    // Node, CommonJS-like
    else if (typeof exports === 'object') module.exports = factory(require('jquery'), require('./../body-toucher/body-toucher'), require('./../gush/gush'));

    // Browser globals (root is window)
    else {
        factory(root.jQuery);
    }

}(this, function ($, bodyToucher, gush, undefined) {

    "use strict"

    $(function() {

        // Create the defaults once
        var pluginName = "simpleDropdown",
        defaults = {
            touchBody: true
        };

        // The actual plugin constructor
        function Plugin ( element, options ) {
            this.element = element;
            this.jqElem = $(element);
            // jQuery has an extend method which merges the contents of two or
            // more objects, storing the result in the first object. The first object
            // is generally empty as we don't want to alter the default options for
            // future instances of the plugin
            this.options = $.extend( {}, defaults, options );
            this._defaults = defaults;
            this._name = pluginName;
            if (!this.jqElem.is('.droposaurusised, .simple-dd-generated')) this.init();
        }

        Plugin.prototype = {
            init: function () {

                // Place initialization logic here
                // You already have access to the DOM element and
                // the options via the instance, e.g. this.element
                // and this.options
                // you can add more functions like the one below and
                // call them like so: this.yourOtherFunction(this.element, this.options).

                // touch my body
                if (this.options.touchBody) $.addBody();

                var el = this.jqElem,
                    self = this,
                    outEl = this.jqElem;

                el.each(function(){

                    var el = $(this),
                        w = el.find('ul'),
                        y = w.parent(),
                        x = w.detach();

                    $.scrollElem().append(x);

                    var lockY = y.offset().top + y.height() + $.scrollElem().scrollTop();

                    x.wrap(
                        '<div class="simple-dd simple-dd-generated ' + (el.is('.pin-right') ? 'pin-right' : '') + '"' +
                        '     id="' + el.attr('data-id') + '"></div>'
                    );

                    $(window).on('resize',function(){

                        var conf = {
                            position: 'absolute',
                            top: y.offset().top + y.height() + $.scrollElem().scrollTop() // lockY,
                        }

                        if (el.is('.pin-right')) {
                            conf['left'] = y.offset().left - x.outerWidth() + y.outerWidth();
                        } else {
                            conf['left'] = y.offset().left;
                        }

                        x.parent().css(conf);
                    });


                    var focused = -1;

                    // When clicking on the outer button thing, make it open and close the menu
                    el.find('a').first()
                        .off('click.smpdd')
                        .on('click.smpdd', function(e) {

                            e.preventDefault();
                            e.stopPropagation();

                            focused = -1;

                            if ($('#' + el.attr('data-id')).hasClass('active')) {

                                $('.simple-dd').removeClass('active');
                                outEl.removeClass('active');
                                return;
                            }

                            $('.simple-dd').removeClass('active');
                            el.trigger('probable_change');
                            $('#' + el.attr('data-id')).addClass('active');
                            outEl.addClass('active');

                            $(window).trigger('resize');
                        });

                    // When clicking off the menu, close the menu
                    $('html')
                        .off('click.smpdd')
                        .on('click.smpdd', function(e) {
                            $('.simple-dd').removeClass('active');
                        });

                    //tab, enter, arrow keys
                    var shiftDown = false;
                    $(document).keyup(function(e){
                        if(e.keyCode == 16){
                            shiftDown=false;
                        }
                    });

                    $(document).keydown(function(e){
                        //down = 40
                        if(e.keyCode == 16){
                            shiftDown=true;
                        }
                        else if(e.keyCode == 40){
                            if($('#'+el.attr('data-id')).hasClass('active')){
                                e.preventDefault();
                                var options = $('#'+el.attr('data-id')).find('a');
                                if(focused < options.length-1){ focused++; }
                                var focusedElem = options[focused];
                                focusedElem.focus();
                            }
                        }
                        //tab = 9
                        else if(e.keyCode == 9){
                            if($('#'+el.attr('data-id')).hasClass('active')){
                                var options = $('#'+el.attr('data-id')).find('a');
                                if(focused < options.length-1 && !shiftDown){
                                    focused++;
                                    var focusedElem = options[focused];
                                    focusedElem.focus();
                                    e.preventDefault();
                                }
                                else if(shiftDown){
                                    if(focused > 0){
                                        focused--;
                                        var focusedElem = options[focused];
                                        focusedElem.focus();
                                    }
                                    else {
                                        focused--;
                                        $('.simple-dd').removeClass('active');
                                        el.find('a').first().focus();
                                    }
                                    e.preventDefault();
                                }
                                else {
                                    focused++;
                                    if(el.data('next')){
                                        $(el.data('next')).find('a').focus();
                                        $('.simple-dd').removeClass('active');
                                        e.preventDefault();
                                    }
                                    else {
                                        el.find('a').focus();
                                        $('.simple-dd').removeClass('active');
                                    }
                                }
                            }
                        }
                        //up = 38
                        else if(e.keyCode == 38){
                            if($('#'+el.attr('data-id')).hasClass('active')){
                                e.preventDefault();
                                var options = $('#'+el.attr('data-id')).find('a');
                                if(focused > 0){ focused--; }
                                var focusedElem = options[focused];
                                focusedElem.focus();
                            }
                        }
                        //esc = 27
                        else if(e.keyCode == 27){
                            if($('#'+el.attr('data-id')).hasClass('active')){
                                $('.simple-dd').removeClass('active');
                            }
                        }
                    });
                });

                // add the class so we know its all initialised
                this.jqElem
                    .addClass('droposaurusised')
                    .trigger('droposaurusised');

            }
        };

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.fn[ pluginName ] = function ( options ) {
            return this.each(function() {
                if ( !$.data( this, "plugin_" + pluginName ) ) {
                    $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
                }
            });
        };
    });

}));
