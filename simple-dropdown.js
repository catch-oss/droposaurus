;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "simpleDropdown",
    defaults = {
        propertyName: "value"
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
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).

            if (!$('body > .body').length) {
                var scrollTop = $(window).scrollTop();
                var $wrap  = $('<div class="body"></div>').css({
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    overflow: 'scroll',
                    '-webkit-overflow-scrolling': 'touch'
                });
                $('body').wrapInner($wrap);
                $wrap.scrollTop(scrollTop);
            }

            var el = this.jqElem;
            var outEl = this.jqElem;
            el.each(function(){
                var el = $(this);
                //When clicking on the outer button thing, make it open and close the menu
                el.find('a').first().click(function(e){
                    if(!el.hasClass('active')){
                        $('.simple-dd').removeClass('active');
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    el.trigger('probable_change');
                    el.toggleClass('active');
                })

                //When clicking off the menu, close the menu
                $('html').click(function(e){
                    $('.simple-dd').removeClass('active');
                })

                //tab, enter, arrow keys
                var focused = 0;
                $(document).keydown(function(e){
                    //down = 40
                    if(e.keyCode == 40){
                        if(el.hasClass('active')){
                            e.preventDefault();
                            var options = el.find('a');
                            if(focused < options.length-1){ focused++; }
                            var focusedElem = options[focused]
                            focusedElem.focus()
                        }
                    }
                    //up = 38
                    else if(e.keyCode == 38){
                        if(el.hasClass('active')){
                            e.preventDefault();
                            var options = el.find('a');
                            if(focused > 0){ focused--; }
                            var focusedElem = options[focused]
                            focusedElem.focus()
                        }
                    }
                    //esc = 27
                    else if(e.keyCode == 27){
                        if(el.hasClass('active')){
                            $('.simple-dd').removeClass('active');
                        }
                    }
                });
            });
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

})( jQuery, window, document );
