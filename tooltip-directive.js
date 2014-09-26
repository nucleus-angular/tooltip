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
 * @nghtmlattribute {string} data-position Tell the position of the tooltip relative to the handle, can be:
 *
 * - top
 * - left
 * - right
 * - bottom
 *
 * By default , the tooltip will default to the middle of the position you select (top middle, left middle, etc..) hoever you can use the `data-vertical` and `data-horizontal` attributes to even further modify the tooltip location.
 *
 * @nghtmlattribute {string} [data-vertical="bottom"] Vertical positioning
 *
 * - top
 * - middle
 * - bottom
 *
 * @nghtmlattribute {string} [data-horizontal="right"] Horizontal positioning
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
      scope: true,
      compile: function(element, attributes) {
        var setContentCss = function(cssObject) {
          $('#' + attributes.contentId).css(cssObject);

          if(attributes.stickyContentId) {
            $('#' + attributes.stickyContentId).css(cssObject);
          }
        };

        element.find('.handle').attr('ng-mouseenter', 'showTooltip()');
        element.find('.handle').attr('ng-mouseleave', 'hideTooltip()');

        if(attributes.stickyContentId) {
          element.find('.handle').attr('ng-click', 'toggleTooltip(true)');
        }

        setContentCss({
          position: 'absolute',
          top: '0px',
          left: '0px'
        });
        element.addClass('tooltip');

        return function(scope, element, attributes) {
          var getTop, getLeft, setTooltipPosition, getAutoPosition;
          var verticalPosition = attributes.vertical || 'middle';
          var horizontalPosition = attributes.horizontal || 'middle';
          var position = attributes.position;

          getTop = function($content) {
            var truePosition = (position === 'top' || position === 'bottom') ? position: verticalPosition;
            var top, offset;
            offset = element.position();
            top = {};

            top.middle = offset.top + Math.floor((element.outerHeight(true) / 2) - ($content.outerHeight(true) / 2));
            top.bottom = offset.top + element.outerHeight(true);
            top.top = offset.top - $content.outerHeight(true);

            return top[truePosition];
          };

          getLeft = function($content) {
            var truePosition = (position === 'left' || position === 'right') ? position: horizontalPosition;
            var left, offset;
            offset = element.position();
            left = {};

            left.middle = offset.left + Math.floor((element.outerWidth(true) / 2) - $content.outerWidth(true) / 2);
            left.left = offset.left - $content.outerWidth(true);
            left.right = offset.left + element.outerWidth(true);

            return left[truePosition];
          };

          setTooltipPosition = function() {
            $('#' + attributes.contentId).css({
              top: getTop($('#' + attributes.contentId)),
              left: getLeft($('#' + attributes.contentId))
            });

            if(attributes.stickyContentId) {
              $('#' + attributes.stickyContentId).css({
                top: getTop($('#' + attributes.stickyContentId)),
                left: getLeft($('#' + attributes.stickyContentId))
              });
            }
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
          scope.showTooltip = function(sticky) {
            //makes sure if the layout of the page has changes, the tooltip will still show up in the correct position
            setTooltipPosition();

            if(sticky === true) {
              scope.contentVisible = 'sticky';
            } else if(scope.contentVisible !== 'sticky') { //make sure not to remove sticky content if it is visible and attempting to should hover tooltip
              scope.contentVisible = true;
            }
          };

          /**
           * Hide the tooltip content
           *
           * @ngscope
           * @method hideTooltip
           */
          scope.hideTooltip = function(sticky) {
            if(sticky === true) {
              scope.contentVisible = true;
            } else if(scope.contentVisible !== 'sticky') { //make sure not to remove sticky content is it is visible and attempting to hide regular tooltip
              scope.contentVisible = false;
            }
          };

          /**
           * Toggle the display of the tooltip content
           *
           * @ngscope
           * @method toggleTooltip
           */
          scope.toggleTooltip = function(sticky) {
            if(
              (sticky === true && scope.contentVisible === 'sticky')
              || (sticky !== true && scope.contentVisible === true)) {
              scope.hideTooltip(sticky);
            } else {
              scope.showTooltip(sticky);
            }
          };

          scope.$watch('contentVisible', function(newValue, oldValue) {
            if(attributes.stickyContentId) {
              $('#' + attributes.stickyContentId).removeClass('is-active');
            }

            if(newValue === true) {
              $('#' + attributes.contentId).addClass('is-active');
            } else if(newValue === 'sticky') {
              $('#' + attributes.stickyContentId).addClass('is-active');
              $('#' + attributes.contentId).removeClass('is-active');
            } else {
              $('#' + attributes.contentId).removeClass('is-active');
            }
          });
        };
      }
    };
  }
]);
