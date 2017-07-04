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
            uid: function(idBase) {

                // init vars
                var i = 2,
                    elementID = idBase;

                // Create an ID if there isn't one
                while (!elementID || $('#' + elementID).length) {
                    elementID = idBase + i;
                    i++;
                }

                // return
                return elementID;
            },
            init: function () {

                // touch my body?
                if (this.options.touchBody) $.addBody();

                // scope some variables
                var self = this,
                    outEl = this.jqElem;

                // attach stuff to each element in the jqArray
                outEl.each(function() {

                    // scope vars
                    var el = $(this),
                        w = el.find('ul'),
                        y = w.parent(),
                        x = w.detach(),
                        id = self.uid(el.attr('data-id') || 'dd'),
                        lockY = y.offset().top + y.height() + $.scrollElem().scrollTop(),
                        focused = -1,
                        shiftDown = false;

                    // move list to end of doc
                    $.scrollElem().append(x);

                    // wrap the list in the dd wrapper
                    x.wrap(
                        '<div '+
                            'class="' +
                                'simple-dd ' +
                                'simple-dd-generated ' +
                                (el.is('.pin-right') ? 'pin-right' : '') +
                            '" ' +
                            'id="' + id + '">' +
                        '</div>'
                    );

                    // bind resize handler
                    $(window)
                        .off('resize.' + id)
                        .on('resize.' + id, function() {

                            // create the CSS obj
                            var conf = {
                                position: 'absolute',
                                top: y.offset().top + y.height() + $.scrollElem().scrollTop() // lockY,
                            }

                            // update based on pin right flag
                            conf['left'] = el.is('.pin-right')
                                ? y.offset().left - x.outerWidth() + y.outerWidth()
                                : conf['left'] = y.offset().left;

                            // apply the css
                            x.parent().css(conf);
                        })
                        .trigger('resize');

                    // When clicking on the outer button thing, make it open and close the menu
                    el.find('a').first()
                        .off('click.smpdd')
                        .on('click.smpdd', function(e) {

                            e.preventDefault();
                            e.stopPropagation();

                            focused = -1;

                            if ($('#' + id).hasClass('active')) {
                                $('.simple-dd').removeClass('active');
                                outEl.removeClass('active');
                                return;
                            }

                            $('.simple-dd').removeClass('active');
                            el.trigger('probable_change');
                            $('#' + id).addClass('active');
                            outEl.addClass('active');

                            $(window).trigger('resize');
                        });

                    // When clicking off the menu, close the menu
                    $('html')
                        .off('click.smpdd')
                        .on('click.smpdd', function(e) {
                            $('.simple-dd').removeClass('active');
                        });

                    // tab, enter, arrow keys
                    $(document)
                        .off('keyup.' + id)
                        .on('keyup.' + id, function(e){
                            if (e.keyCode == 16) shiftDown = false;
                        });

                    $(document)
                        .off('keydown.' + id)
                        .on('keydown.' + id, function(e) {

                            // down = 40
                            if (e.keyCode == 16) {
                                shiftDown=true;
                            }
                            else if (e.keyCode == 40) {
                                if($('#' + id).hasClass('active')){
                                    e.preventDefault();
                                    var options = $('#' + id).find('a');
                                    if(focused < options.length-1){ focused++; }
                                    var focusedElem = options[focused];
                                    focusedElem.focus();
                                }
                            }

                            // tab = 9
                            else if(e.keyCode == 9){
                                if($('#' + id).hasClass('active')){
                                    var options = $('#' + id).find('a');
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
                                if($('#' + id).hasClass('active')){
                                    e.preventDefault();
                                    var options = $('#' + id).find('a');
                                    if(focused > 0){ focused--; }
                                    var focusedElem = options[focused];
                                    focusedElem.focus();
                                }
                            }

                            //esc = 27
                            else if(e.keyCode == 27){
                                if($('#' + id).hasClass('active')){
                                    $('.simple-dd').removeClass('active');
                                }
                            }
                        });
                });

                // add the class so we know its all initialised
                outEl
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
