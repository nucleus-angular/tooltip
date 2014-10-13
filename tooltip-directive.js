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
    //we need to be able to track at a global level if a sticky is active to prevent any other tooltip from displaying
    var globalStickyActive = false;

    return {
      restrict: 'A',
      scope: true,
      controller: [
        '$scope',
        function($scope) {
          this.hide = function() {
            //only need to hide if it is the tooltip with the sticky active
            if($scope.contentVisible === 'sticky') {
              $scope.hideTooltip(true);
            }
          };

          this.show = function() {
            $scope.showTooltip();
          };
        }
      ],
      compile: function(element, attributes) {
        var stickyContent = element.find('.tooltip-sticky-content');
        var setContentCss = function(cssObject) {
          if(stickyContent) {
            stickyContent.css(cssObject);
          }
        };

        element.find('.handle').attr('ng-mouseenter', 'showTooltip()');
        element.find('.handle').attr('ng-mouseleave', 'hideTooltip()');

        if(stickyContent) {
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
            if(stickyContent) {
              stickyContent.css({
                top: getTop(stickyContent),
                left: getLeft(stickyContent)
              });
            }
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
          scope.showTooltip = function(sticky) {
            //should not be able to activate any tooltip when a sticky version is already being displayed
            if(globalStickyActive === false) {
              //makes sure if the layout of the page has changes, the tooltip will still show up in the correct position
              setTooltipPosition();

              if(sticky === true) {
                globalStickyActive = true;
                scope.contentVisible = 'sticky';
              } else if(scope.contentVisible !== 'sticky') { //make sure not to remove sticky content if it is visible and attempting to should hover tooltip
                scope.contentVisible = true;
              }
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
              globalStickyActive = false;
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
            if(stickyContent) {
              stickyContent.removeClass('is-active');
              element.removeClass('is-active');
            }

            if(newValue === 'sticky') {
              stickyContent.addClass('is-active');
              element.addClass('is-active');
            }
          });
        };
      }
    };
  }
]);
