/**
 * @name WaterfallFlow
 * @version 1.0.0
 * @created 2015.11.25
 * @lastmodified 2015.11.26
 * @description A waterfall flow layout plugin based on jQuery 2.1.4
 * @author Jonathan BigDog (https://github.com/lilinwan)
 * @url https://github.com/lilinwan/Waterfall-Flow-Layout-jQuery-Plugin
**/
(function ($) {
	var array, WaterFall = function (settings, element) {
		this.settings = settings;
		this.element = element;
		this.init();
	};

	WaterFall.prototype = {
		init: function () {
			this.layout();
		},

		selector: function () {
			var selector = this.settings.selector,
				element = this.element;

			return !selector ? element.children().not('.waterfall') : element.filter(selector).not('.waterfall');
		},

		viewport: function () {
			var e = window,
				a = 'inner';
			if (!('innerWidth' in window)) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return { width: e[a + 'Width'], height: e[a + 'Height'] };
		},

		measure: function () {
			var _this = this,
				columnCount = _this.settings.columnCount,
				columnOffset = _this.settings.columnOffset,

				viewportWidth = _this.viewport().width,

				columnWidth = parseInt((viewportWidth - columnCount * 2 - columnOffset * (columnCount + 1) - 20) / columnCount);
				
				console.log(viewportWidth);

			_this.selector().each(function () {
				var _this = $(this);
				_this.css('width', columnWidth + 'px');
			});

			_this.element.css("position", "relative");

			_this.element.css({
				"width": '100%',
				"margin": "0 auto"
			})

			return { columnWidth: columnWidth, columnCount: columnCount }
		},

		layout: function () {
			var _this = this,
				coloumnOffset = _this.settings.columnOffset,
				columnWidth = _this.measure().columnWidth,
				columnCount = _this.measure().columnCount,

			array = array 　? array : new Array(columnCount);

			$.each(array, function (index, value) {
				if (value === undefined) array[index] = coloumnOffset;
			});
			
			
			var i = 0, deferreds = [];
			_this.selector().each(function () {
				var _this = $(this),
					index = $.inArray(Math.min.apply(Math, array), array);
					
				_this.css({
						left: index * columnWidth,
						position: 'absolute'
					});
					
				_this.children('img').each(function () {
					var _this = $(this);
					deferreds.push(new $.Deferred());
					_this.load(function () {
						var image = {
							width: _this.outerWidth(true),
							height: _this.outerHeight(true)
						};
						_this.data('waterfall', image);
						deferreds[i].resolve();
						i++;
					})
				});
			});
			
			$.when.apply(null, deferreds).done(function () {
				_this.selector().each(function () {
					var _this = $(this),
					index = $.inArray(Math.min.apply(Math, array), array);
	
					_this.animate({
						left: (index * columnWidth + (index + 1) * coloumnOffset) + 'px',
						top: array[index] + 'px',
						position: 'absolute'
					}, index * 350).addClass('waterfall');
	
					var image = _this.find('img').data('waterfall');
					console.log(image);
					var outerHeight = _this.outerHeight(true);
					//outerHeight = outerHeight > image.height ? outerHeight : outerHeight + image.height; 
					array[index] += outerHeight + coloumnOffset;
				});
			});
		}
	};

	$.waterfall = function (settings, element) {
		var waterfall = new WaterFall(settings, element);

		return element;
	};

	$.fn.waterfall = function (options) {
		var settings = $.extend({
			columnCount: 4,
			columnOffset: 5
		}, options);

		return $.waterfall(settings, this);
	};
} (jQuery));