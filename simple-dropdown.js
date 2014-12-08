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
        if (!this.jqElem.is('.dropasaurusised, .simple-dd-generated')) this.init();
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
            $.addBody();

            var el = this.jqElem;
            var outEl = this.jqElem;

            el.each(function(){
                var el = $(this);

                var w = el.find('ul');

                y = w.parent();

                var x = w.remove();

                $('.body').append(x);
                x.wrap('<div class="simple-dd simple-dd-generated" id="'+el.data('id')+'"></div>');
                x.parent().css({
                    position: 'absolute',
                    top: y.offset().top+y.height(),
                    left: y.offset().left
                });


                var focused = -1;

                //When clicking on the outer button thing, make it open and close the menu
                el.find('a').first().click(function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    focused = -1;
                    if($('#'+el.data('id')).hasClass('active')){
                        $('.simple-dd').removeClass('active');
                        return
                    }
                    $('.simple-dd').removeClass('active');
                    el.trigger('probable_change');
                    $('#'+el.data('id')).toggleClass('active');
                })

                //When clicking off the menu, close the menu
                $('html').click(function(e){
                    $('.simple-dd').removeClass('active');
                })

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
                        if($('#'+el.data('id')).hasClass('active')){
                            e.preventDefault();
                            var options = $('#'+el.data('id')).find('a');
                            if(focused < options.length-1){ focused++; }
                            var focusedElem = options[focused];
                            focusedElem.focus();
                        }
                    }
                    //tab = 9
                    else if(e.keyCode == 9){
                        if($('#'+el.data('id')).hasClass('active')){
                            var options = $('#'+el.data('id')).find('a');
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
                        if($('#'+el.data('id')).hasClass('active')){
                            e.preventDefault();
                            var options = $('#'+el.data('id')).find('a');
                            if(focused > 0){ focused--; }
                            var focusedElem = options[focused];
                            focusedElem.focus();
                        }
                    }
                    //esc = 27
                    else if(e.keyCode == 27){
                        if($('#'+el.data('id')).hasClass('active')){
                            $('.simple-dd').removeClass('active');
                        }
                    }
                });
            });

            // add the class so we know its all initialised
            this.jqElem.addClass('dropasaurusised');

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
