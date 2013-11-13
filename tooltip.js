//todo: move to utilities
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

/**
 * # Tooltip
 *
 * This directive allow you to create a tooltip when you hover of interact with the element.
 *
 * EXAMPLE TODO
 *
 * @todo: support ajax loading data
 * @todo: support being able to hover over tooltip and keep it open without make it completely sticky
 * @todo: support automatically repositioning tooltip content if any part fall out of the window viewport (difficult with element that has a positioned element)
 *
 * @module nag.tooltip
 * @ngdirective nagToolTip
 *
 * @nghtmlattribute {empty} nag-tooltip Tell AngularJS this element is a tooltip component
 * @nghtmlattribute {boolean} [data-sticky=false] Whether or not the tooltip is sticky
 * @nghtmlattribute {string} [data-vertical="bottom"] Vertical positioning
 *
 * - top
 * - middle
 * - bottom
 *
 * @nghtmlattribute {string} [horizontal="right"] Horizontal positioning
 *
 * - left
 * - middle
 * - right
 */
angular.module('nag.tooltip', [])
.directive('nagTooltip', [
  '$compile',
  function($compile){
    return {
      restrict: 'A',
      scope: {},
      compile: function() {
        return {
          pre: function(scope, element, attributes) {
            var template = $('<span>' + $(element).html() + '</span>');

            if(attributes.sticky !== 'true') {
              template.find('.handle').attr('ng-mouseenter', 'showTooltip()');
              template.find('.handle').attr('ng-mouseleave', 'hideTooltip()');
            } else {
              template.find('.handle').attr('ng-click', 'toggleTooltip()');
            }

            template.find('.content').css({
              visibility: 'hidden',
              position: 'absolute',
              top: '0px',
              left: '0px'
            });
            $(element).html($compile(template)(scope));
            $(element).addClass('tooltip');

          },
          post: function(scope, element, attributes) {
            var $handle, $content, getTop, getLeft, setTooltipPosition, getAutoPosition;
            var verticalPosition = attributes.vertical || 'bottom';
            var horizontalPosition = attributes.horizontal || 'right';
            var autoPosition = attributes.autoPosition === 'true' ? true : false;

            $handle = element.find('.handle');
            $content = element.find('.content');

            getAutoPosition = function(type, position, values, element) {
              var getContentSizeModifier = function() {
                var modifier;
                console.log('fn position: ' + position);

                switch(position) {
                  case 'middle':
                    modifier = .5;
                    break;

                  case 'right':
                  case 'bottom':
                    modifier = 1;
                    break;

                  default:
                    modifier = 0;
                    break;
                }

                return modifier;
              };

              var autoPosition = position;
              var dimensionToGet = type === 'horizontal' ? 'width' : 'height';
              var positionToGet = type === 'horizontal' ? 'left' : 'top';
              var contentSizeModifer = getContentSizeModifier();
              var assumeContentSize = ($content['outer' + capitalize(dimensionToGet)](true) * contentSizeModifer);
              var switchToPosition = type === 'horizontal' ? 'left' : 'top';

              console.log('---off screen---');
              console.log('type: ' + type);
              console.log('position: ' + position);
              console.log('dimenison to get: ' + dimensionToGet);
              console.log('values: ' + JSON.stringify(values));
              console.log('value to test: ' + values[position])
              console.log('element offset position: ' + positionToGet);
              console.log('element offset value: ' + element.offset()[positionToGet]);
              console.log('content size modifier: ' + contentSizeModifer);
              console.log('content outer' + capitalize(dimensionToGet) + '(true) with modifier: ' + assumeContentSize);
              console.log('window ' + dimensionToGet + '(): ' + $(window)[dimensionToGet]());

              if(values[position] + element.offset()[positionToGet] + assumeContentSize > $(window)[dimensionToGet]()) {
                autoPosition = type === 'horizontal' ? 'left' : 'top';
              } else if(values[position] + element.offset()[positionToGet] + assumeContentSize < 0) {
                autoPosition = type === 'horizontal' ? 'right' : 'bottom';
              }

              return autoPosition;
            };

            getTop = function() {
              var truePosition = verticalPosition;
              var top, offset;
              offset = $handle.position();
              top = {};

              top.middle = offset.top + Math.floor(($handle.outerHeight(true) / 2) - ($content.outerHeight(true) / 2));
              top.bottom = offset.top + $handle.outerHeight(true);
              top.top = offset.top - $content.outerHeight(true);

              if(autoPosition === true) {
                truePosition = getAutoPosition('vertical', truePosition, top, element);
              }

              return top[truePosition];
            };

            getLeft = function() {
              var truePosition = horizontalPosition;
              var left, offset;
              offset = $handle.position();
              left = {};

              left.middle = offset.left + Math.floor(($handle.outerWidth(true) / 2) - $content.outerWidth(true) / 2);
              left.left = offset.left - $content.outerWidth(true);
              left.right = offset.left + $handle.outerWidth(true);

              if(autoPosition === true) {
                truePosition = getAutoPosition('horizontal', truePosition, left, element);
              }

              return left[truePosition];
            };

            setTooltipPosition = function() {
              $content.css('visibility', 'hidden');

              var css =
              {
                top: getTop(),
                left: getLeft()
              };

              $(element).find('.content').css(css);
              $content.css('visibility', 'inherit');
            };

            /**
             * Whether or no the content is visible
             *
             * @ngscope
             * @property {boolean} contentVisible
             */
            scope.contentVisible = false;

            /**
             * Display the tooltip content
             *
             * @ngscope
             * @method showTooltip
             */
            scope.showTooltip = function() {
              //makes sure if the layout of the page has changes, the tooltip will still show up in the correct position
              setTooltipPosition();
              scope.contentVisible = true;
            };

            /**
             * Hide the tooltip content
             *
             * @ngscope
             * @method hideTooltip
             */
            scope.hideTooltip = function() {
              $content.css('visibility', 'hidden');
              scope.contentVisible = false;
            };

            /**
             * Toggle the display of the tooltip content
             *
             * @ngscope
             * @method toggleTooltip
             */
            scope.toggleTooltip = function() {
              if(scope.contentVisible === true) {
                scope.hideTooltip();
              } else {
                scope.showTooltip();
              }
            }
          }
        };
      }
    };
  }
]);