;
(function($, window, document, undefined) {

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "catchDropdown",
        defaults = {
            touchBody: true
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.jqElem = $(element);
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        if (!this.jqElem.is('.dropasaurusised')) this.init();
    }

    Plugin.prototype = {
        scrollElem: function() {
            return $('.body').length ? $('.body') : $(window);
        },
        init: function() {

            // vars
            var $el = this.jqElem,
                self = this;

            // touch my body
            if (this.options.touchBody) $.addBody();

            // iterate through each elem in the jq selector
            $el.each(function() {

                var $el = $(this).wrap('<div class="dropdown-wrapper' + ($(this).data('size') ? (' size'+$(this).data('size')) : '') +'"></div>'),
                    $par = $el.parent(),
                    classList = ($el.attr('class') || '').replace('select-invisible', ''),
                    catchDropdownHtml = '<label aria-hidden="true" class="' + ($el.data('error ') ? 'error' : '') + classList + '"><span class="span-label' + ($el.data('hideLabel') ? ' hidden' : '') + '">' + (!$el.data('mobile-only-label') && $el.data('label') || '') + '</span>' +
                                            '<div class="btn-dd">' +
                                                '<a href="" class="input btn-dd-select phone-type icon-chevron-fat-down' + ($el.data('selected') ? ' populated' : '') + '" tabindex="0">' +
                                                '<span class="main"'+
                                                    ( $el.data('placeholder-color') ? (' style="color:'+$el.data('placeholder-color')+'"') : '' )+
                                                    '>' + $el.data('placeholder') + '</span>' +
                                                ($el.data('subtext') ? ("<span class='sub'>" + $el.data('subtext') + "</span>") : "") + '</a>' +
                                                '<div class="btn-dd-options">' +
                                                    '<div class="btn-dd-header">' +
                                                        $el.data('label') +
                                                        ' <a class="btn-dd-close">Close</a>' +
                                                    '</div>' +
                                                    '<ul></ul>' +
                                                '</div>' +
                                            '</div>' +
                                        '</label>'

                //set up the proper display of the select and list elements
                $el.after(catchDropdownHtml);
                $el.addClass('hidden');

                // update the options
                self.update();

                // attach the gusher
                $par.find('ul').gush({
                    x: false,
                    move: {
                        stopPropagation: true
                    }
                });

                //When clicking off the menu, close the menu
                $('html').click(function(e) {
                    $par.find('.btn-dd').removeClass('active');
                    self.scrollElem().removeClass('no-overflow');
                });

                //tab, enter, arrow keys
                var focused = -1
                $(document).on('keydown.dropasaur', function(e) {
                    //down = 40
                    if (e.keyCode == 40) {
                        if ($par.find('.btn-dd.active').length) {
                            e.preventDefault();
                            var options = $par.find('.btn-dd-option a');
                            if (focused < options.length - 1) {
                                focused++;
                            }
                            var focusedElem = options[focused]
                            focusedElem.focus()
                            $el.find('option[value="' + $(focusedElem).data('value') + '"]').prop('selected', true);
                            $el.trigger('change');
                            $el.trigger('changeDrop',[$(focusedElem).data('value')]);
                        }
                    }
                    //up = 38
                    else if (e.keyCode == 38) {
                        if ($par.find('.btn-dd.active').length) {
                            e.preventDefault();
                            var options = $par.find('.btn-dd-option a');
                            if (focused > 0) {
                                focused--;
                            }
                            var focusedElem = options[focused]
                            focusedElem.focus()
                            $el.find('option[value="' + $(focusedElem).data('value') + '"]').prop('selected', true);
                            $el.trigger('change');
                            $el.trigger('changeDrop',[$(focusedElem).data('value')]);
                        }
                    }
                    //tab
                    else if (e.keyCode == 9) {
                        var active = $par.find('.btn-dd.active');
                        if (active.length) {
                            var $sel = $el.find('option[value="' + $el.val() + '"]');
                            e.preventDefault();
                            active.removeClass('active');
                            self.scrollElem().removeClass('no-overflow');
                            active.find('a').first().addClass('populated');
                            active.find('a').first().focus();
                            active.find('a .main').first().text($sel.text());
                            if (active.find('a .sub').length == 0) {
                                active.find('a').append('<span class="sub"></span>')
                            }
                            active.find('a .sub').first().text($el.data('subtext') || $sel.data('subtext') || '');
                        }
                    }
                    //enter
                    else if (e.keyCode == 13) {
                        var active = $par.find('.btn-dd.active');
                        if (active.length) {
                            var $sel = $el.find('option[value="' + $el.val() + '"]');
                            e.preventDefault();
                            active.removeClass('active');
                            self.scrollElem().removeClass('no-overflow');
                            active.find('a').first().addClass('populated');
                            active.find('a').first().focus();
                            active.find('a .main').first().text($sel.text());
                            if (active.find('a .sub').length == 0) {
                                active.find('a').append('<span class="sub"></span>')
                            }
                            active.find('a .sub').first().text($el.data('subtext') || $sel.data('subtext') || '');
                        }
                    }
                });
            });

            // add the class so we know its all initialised
            this.jqElem.addClass('dropasaurusised');
        },

        update: function(params) {

            var $el = this.jqElem,
                self = this,
                $sel,
                opt,
                i;

            $el.each(function(){

                var $el = $(this),
                    $par = $el.closest('.dropdown-wrapper');

                // update the original select if we have new options provided
                if (typeof params == 'object') {

                    $el.html('');

                    for (i=0; i<params.length; i++) {
                        opt = params[i];
                        $el.append('<option value="' + opt.value + '" data-subtext="' + opt.subtext + '">' + (opt.innerHTML ? opt.innerHTML : opt.value) + '<option>');
                    }

                } else if (typeof params == 'string') {

                    $el.html(params);

                }

                if (params != undefined) $par.find('ul').html('');

                // Add the blank option if allowed
                // this is stupid - having null values is cool but...
                if ($el.attr('allow-empty') == "true" || $el.attr('data-allow-empty') == "true") {
                    $el.prepend('<option value=""></option>');
                    $par.find('ul').append('<li class="input btn-dd-option catch-dropdown-item"><a class="catch-dropdown-link" href="" tabindex="-1" data-value=""></a></li>')
                }

                //populate the list with the select items
                $el.find('option').each(function() {

                    var $this = $(this),
                        txt = $this.text(),
                        val = $this.attr('value') === undefined ? '' : $this.attr('value'),     // $el.val() returns $el.text() if value attr is missing
                        sel = $el.data('selected') === undefined ? '' : $el.data('selected');   // being consistent

                    if ($this.text() != '') {
                        $par.find('ul').append(
                            '<li class="input btn-dd-option catch-dropdown-item">' +
                                // this add connection thing is BS
                                '<a class="catch-dropdown-link' + (txt == 'Add Connection' ? ' btn--add btn--icon icon-add icon-after' : '') + (sel == val ? ' selected' : '') + '" ' +
                                   'href="" ' +
                                   'tabindex="-1" ' +
                                   'data-value="' + val + '">' +
                                    '<span class="main">' + txt + '</span>' +
                                    ($this.data('subtext') ? '<span class="sub">' + $this.data('subtext') + '</span>' : '') +
                                '</a>' +
                            '</li>'
                        );
                    }
                });

                // if no value is supplied by the data elem
                // find the selected item in the select
                // else select the first
                if ($el.data('selected') === undefined) {
                    $sel = $el.find('option[selected]');
                    if (!$sel.length) $sel = $el.find('option[value="' + $el.val() + '"]');
                    if (!$sel.length) $sel = $el.find('option').first();
                }
                else {

                    // find elem specified by data attr
                    $sel = $el.find('option[value="' + $el.data('selected') + '"]');

                    if (!$sel.length) {

                        // if we got here then we couldn't find an option with a value attr that matches
                        // so do a looser match
                        $el.find('option').each(function() {
                            var val = $(this).attr('value') === undefined ? '' : $(this).attr('value');
                            if ($el.data('selected') == val) $sel = $(this);
                        });
                    }
                }

                console.log($sel);

                // select the current value we found above
                $sel.prop('selected', true);
                $el.trigger('change');
                $par.find('.btn-dd-select .main').first().text($sel.text() || $el.data('placeholder') || '');
                if ($par.find('.btn-dd-select .sub').length == 0) {
                    $par.find('.btn-dd-select').append('<span class="sub"></span>')
                }
                $par.find('.btn-dd-select .sub').first().text($el.data('subtext') || $sel.data('subtext') || '');

                //When clicking on the outer button thing, make it open and close the menu
                $par.find('.btn-dd').off('click.dropasaur').on('click.dropasaur', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if($(this).hasClass('disabled')){
                        return;
                    }
                    if (!$(this).hasClass('active')) {
                        $('.btn-dd').removeClass('active');
                    }
                    $el.trigger('probable_change');
                    var selected = $el.val();
                    $(this).find('li a').each(function() {
                        $(this).toggleClass('selected', selected == $(this).data('value'));
                    });
                    $(this).toggleClass('active');
                    self.scrollElem().toggleClass('no-overflow');
                    $(this).find('a').first().addClass('populated');
                });

                //When clicking on the menu items, select that menu item and close the menu
                $par.find('li a').off('click.dropasaur').on('click.dropasaur', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var $sel = $el.find('option[value="' + $(this).data('value') + '"]').prop('selected', true);
                    $par.find('.btn-dd-select .main').first().text($(this).find('.main').text());
                    if ($par.find('.btn-dd-select .sub').length == 0) {
                        $par.find('.btn-dd-select').append('<span class="sub"></span>')
                    }
                    $par.find('.btn-dd-select .sub').first().text($el.data('subtext') || $sel.data('subtext') || '');
                    $el.trigger('change');
                    self.scrollElem().removeClass('no-overflow');
                    $par.find('.btn-dd').toggleClass('active').find('a').first().addClass('populated');
                });

            });

        },
        setDisabled: function(disabled){
            this.jqElem.parent().find('.btn-dd').toggleClass('disabled',disabled);
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options, params) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            } else if (options == 'update') {
                $.data(this, "plugin_" + pluginName).update(params);
            } else if (options == 'setDisabled') {
                $.data(this, "plugin_" + pluginName).setDisabled(params);
            }
        });
    };

})(jQuery, window, document);
