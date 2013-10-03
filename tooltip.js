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
 * @nghtmlattribute {string} [vertical="bottom"] Vertical positioning
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

            template.find('.content').attr('ng-hide', '!contentVisible');
            $(element).html($compile(template)(scope));
            $(element).addClass('tooltip');

          },
          post: function(scope, element, attributes) {
            var $handle, $content, getTop, getLeft, setTooltipPosition;
            var verticalPosition = attributes.vertical || 'bottom';
            var horizontalPosition = attributes.horizontal || 'right';

            $handle = $(element).find('.handle');
            $content = $(element).find('.content');

            getTop = function() {
              var top, offset;
              offset = $handle.position();
              top = {};

              top.middle = offset.top + (($handle.outerHeight(true) / 2) - ($content.outerHeight(true) / 2));
              top.bottom = offset.top + $handle.outerHeight(true);
              top.top = offset.top - $content.outerHeight(true);

              return top[verticalPosition];
            };

            getLeft = function() {
              var left, offset;
              offset = $handle.position();
              left = {};

              left.middle = offset.left + (($handle.outerWidth(true) / 2) - $content.outerWidth(true) / 2);
              left.left = offset.left - $content.outerWidth(true);
              left.right = offset.left + $handle.outerWidth(true);

              return left[horizontalPosition];
            };

            setTooltipPosition = function() {
              $content.css('display', 'none');

              var css =
              {
                position: 'absolute',
                top: getTop(),
                left: getLeft()
              };

              $(element).find('.content').css(css);
              $content.css('display', 'inherit');
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