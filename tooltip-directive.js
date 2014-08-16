//TODO: move to utilities
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
angular.module('nag.tooltip')
.directive('nagTooltip', [
  '$compile',
  function($compile){
    return {
      restrict: 'A',
      scope: {
        model: '='
      },
      compile: function() {
        return {
          pre: function(scope, element, attributes) {

          },
          post: function(scope, element, attributes) {
            //we need to make changes to the element with the directive
            element.removeAttr('nag-tooltip');

            if(attributes.sticky !== 'true') {
              element.find('.handle').attr('ng-mouseenter', 'showTooltip()');
              element.find('.handle').attr('ng-mouseleave', 'hideTooltip()');
            } else {
              element.find('.handle').attr('ng-click', 'toggleTooltip()');
            }

            element.find('.content').css({
              position: 'absolute',
              top: '0px',
              left: '0px'
            });
            element.attr('ng-class', "{'is-active': contentVisible}");
            element.addClass('tooltip');
            var newElement = $($compile(element[0].outerHTML)(scope));
            element.replaceWith(newElement);
            element = newElement;



            var $handle, $content, getTop, getLeft, setTooltipPosition, getAutoPosition;
            var verticalPosition = attributes.vertical || 'bottom';
            var horizontalPosition = attributes.horizontal || 'right';
            var autoPosition = attributes.autoPosition === 'true';

            $handle = element.find('.handle');
            $content = element.find('.content');

            getAutoPosition = function(type, position, values, element) {
              var getContentSizeModifier = function() {
                var modifier;

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
              var css =
              {
                top: getTop(),
                left: getLeft()
              };

              $(element).find('.content').css(css);
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
