/**
 * # Tooltip
 *
 * Since a regular hover tooltip can be provide by the hint.css library that is included without javascript, this directive is only need in the use cases where you need a sticky tooltip ()
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
      controller: [
        '$scope',
        function($scope) {
          this.hide = function() {
            if($scope.contentVisible === true) {
              $scope.hideTooltip();
            }
          };

          this.show = function() {
            $scope.showTooltip();
          };
        }
      ],
      compile: function(element, attributes) {
        var stickyContent = element.find('.tooltip-sticky-content');
        element.find('.handle').attr('ng-click', 'toggleTooltip()');

        stickyContent.css({
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
            offset = element.find('.handle').position();
            top = {};

            top.middle = offset.top + Math.floor((element.find('.handle').outerHeight(true) / 2) - ($content.outerHeight(true) / 2));
            top.bottom = offset.top + element.find('.handle').outerHeight(true);
            top.top = offset.top - $content.outerHeight(true);

            return top[truePosition];
          };

          getLeft = function($content) {
            var truePosition = (position === 'left' || position === 'right') ? position: horizontalPosition;
            var left, offset;
            offset = element.find('.handle').position();
            left = {};

            left.middle = offset.left + Math.floor((element.find('.handle').outerWidth(true) / 2) - $content.outerWidth(true) / 2);
            left.left = offset.left - $content.outerWidth(true);
            left.right = offset.left + element.find('.handle').outerWidth(true);

            return left[truePosition];
          };

          setTooltipPosition = function() {
            stickyContent.css({
              top: getTop(stickyContent),
              left: getLeft(stickyContent)
            });
          };

          /**
           * What content to display
           *
           * @ngscope
           * @property {boolean|string} contentVisible
           */
          scope.contentVisible = false;

          /**
           * Display the tooltip content
           *
           * @ngscope
           * @method showTooltip
           */
          scope.showTooltip = function() {
            if(scope.contentVisible !== true) {
              //makes sure if the layout of the page has changes, the tooltip will still show up in the correct position
              setTooltipPosition();

              scope.contentVisible = true;
            }
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
          };

          scope.$watch('contentVisible', function(newValue, oldValue) {
            if(newValue === true) {
              stickyContent.addClass('is-active');
              element.addClass('is-active');
            } else {
              stickyContent.removeClass('is-active');
              element.removeClass('is-active');
            }
          });
        };
      }
    };
  }
]);
