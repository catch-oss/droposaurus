;(function ( $, window, document, undefined ) {

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

						addBody();

						var el = this.jqElem;
						el.each(function(){
							var el = $(this);

							var catchDropdownHtml = '<label' + (el.data('error') ? ' class="error"' : '') + '><span class="span-label">'+el.data('label')+'</span>'+
								'<div class="btn-dd">'+
										'<a href="" class="input btn-dd-select phone-type icon-chevron-fat-down'+ (el.data('selected') ? ' populated' : '') +'" tabindex="10"><span>'+el.data('placeholder')+'</span></a>'+
										'<div class="btn-dd-options">'+
											'<div class="btn-dd-header">'+
												el.data('label') +
												' <a class="btn-dd-close">Close</a>'+
											'</div>'+
											'<ul>'+
											'</ul>'+
										'</div>'+
								'</div></label>'

							//set up the proper display of the select and list elements
							el.wrap('<div class="dropdown-wrapper"></div>');
							var par = el.parent();
							el.after(catchDropdownHtml);
							el.addClass('hidden');

							//Add the blank option if allowed
							el.prepend('<option value=""></option>');
							if(el.attr('allow-empty')=="true"){
								par.find('ul').append('<li class="input btn-dd-option catch-dropdown-item"><a class="catch-dropdown-link" href="" tabindex="-1" data-value="">&nbsp;</a></li>')
							}

							//populate the list with the select items
							el.find('option').each(function(){
								if($(this).val()!=''){
									par.find('ul').append('<li class="input btn-dd-option catch-dropdown-item"><a class="catch-dropdown-link'+ (el.data('selected')==$(this).val() ? ' selected' : '') +'" href="" tabindex="-1" data-value="'+$(this).val()+'">'+$(this).text()+'</a></li>')
								}
							});

							//Preselect an option if one is specified, else the first
							sel = el.data('selected') ? el.find('option[value="'+el.data('selected')+'"]') : el.find('option').first()
							sel.prop('selected',true);
							par.find('.btn-dd-select span').text(sel.text() || el.data('placeholder') || '&nbsp;');

							//When clicking on the outer button thing, make it open and close the menu
							par.find('.btn-dd').click(function(e){
								e.preventDefault();
								e.stopPropagation();
								var selected = el.val();
								$(this).find('li a').each(function(){
									$(this).toggleClass('selected',selected==$(this).data('value'));
								});
								$(this).toggleClass('active');
								$('.body').toggleClass('no-overflow');
								$(this).find('a').first().addClass('populated');
							})

							//When clicking on the menu items, select that menu item and close the menu
							par.find('li a').click(function(e){
								e.preventDefault();
								el.find('option[value="'+$(this).data('value')+'"]').prop('selected',true);
								par.find('.btn-dd-select span').text($(this).text());
							})

							//When clicking off the menu, close the menu
							$('html').click(function(e){
								par.find('.btn-dd').removeClass('active');
								$('.body').removeClass('no-overflow');
							})

							//tab, enter, arrow keys
							var focused = -1
							$(document).keydown(function(e){
								//down = 40
								if(e.keyCode == 40){
									if(par.find('.btn-dd.active').length){
										e.preventDefault();
										var options = par.find('.btn-dd-option a');
										if(focused < options.length-1){ focused++; }
										var focusedElem = options[focused]
										focusedElem.focus()
										el.find('option[value="'+$(focusedElem).data('value')+'"]').prop('selected',true);
									}
								}
								//up = 38
								else if(e.keyCode == 38){
									if(par.find('.btn-dd.active').length){
										e.preventDefault();
										var options = par.find('.btn-dd-option a');
										if(focused > 0){ focused--; }
										var focusedElem = options[focused]
										focusedElem.focus()
										el.find('option[value="'+$(focusedElem).data('value')+'"]').prop('selected',true);
									}
								}
								//tab
								else if(e.keyCode == 9){
									var active = par.find('.btn-dd.active');
									if(active.length){
										e.preventDefault();
										active.removeClass('active');
										$('.body').removeClass('no-overflow');
										active.find('a').first().addClass('populated');
										active.find('a').first().focus();
										active.find('a span').first().text(el.val());
									}
								}
								//enter
								else if(e.keyCode == 13){
									var active = par.find('.btn-dd.active');
									if(active.length){
										e.preventDefault();
										active.removeClass('active');
										$('.body').removeClass('no-overflow');
										active.find('a').first().addClass('populated');
										active.find('a').first().focus();
										active.find('a span').first().text(el.val());
									}
								}
							});
						})
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
