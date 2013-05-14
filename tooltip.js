/**
 * todo: support ajax loading data
 * todo: support being able to hover over tooltip and keep it open without make it completely sticky
 */
angular.module('nag.tooltip', [
  'nag.core'
])
.directive('nagTooltip', [
  '$compile',
  'nagDefaults',
  function($compile, nagDefaults){
    return {
      restrict: 'A',
      scope: {
        options: '=nagTooltip'
      },
      compile: function() {
        return {
          pre: function(scope, element, attributes) {
            scope.options = nagDefaults.getTooltipOptions(scope.options);
            var template = $('<div>' + $(element).html() + '</div>');

            if(scope.options.sticky !== true) {
              template.find('.nag-handle').attr('ng-mouseenter', 'showTooltip()');
              template.find('.nag-handle').attr('ng-mouseleave', 'hideTooltip()');
            } else {
              template.find('.nag-handle').attr('ng-click', 'toggleTooltip()');
            }

            template.find('.nag-content').attr('ng-hide', '!contentVisible');
            $(element).html($compile(template)(scope));
            $(element).addClass('nag-tooltip');

          },
          post: function(scope, element, attributes) {
            var $handle, $content, getTop, getLeft, defaults, setTooltipPosition;

            $handle = $(element).find('.nag-handle');
            $content = $(element).find('.nag-content');

            getTop = function() {
              var top, offset, returnValue;
              offset = $handle.offset();
              top = {};

              top.middle = offset.top - (($content.outerHeight(true) - $handle.outerHeight(true)) / 2);
              top.bottom = offset.top + $handle.outerHeight(true);
              top.top = offset.top - $content.outerHeight(true);

              returnValue = top[scope.options.verticalPosition];

              if(returnValue < 0) {
                returnValue = top.bottom;
              } else if((returnValue + $content.outerHeight(true)) > $(window).height()) {
                returnValue = top.top;
              }

              return returnValue;
            }

            getLeft = function() {
              var left, offset, returnValue;
              offset = $handle.offset();
              left = {};

              left.middle = offset.left - ($content.outerWidth(true) / 2);
              left.left = offset.left - $content.outerWidth(true);
              left.right = offset.left + $handle.outerWidth(true);

              returnValue = left[scope.options.horizontalPosition];

              if(returnValue < 0) {
                returnValue = left.right;
              } else if((returnValue + $content.outerWidth(true)) > $(window).width()) {
                returnValue = left.left;
              }


              return returnValue;
            }

            setTooltipPosition = function() {
              $content.css('display', 'none');

              var css =
              {
                position: 'absolute',
                top: getTop(),
                left: getLeft()
              };

              $(element).find('.nag-content').css(css);
              $content.css('display', 'inherit');
            };

            scope.contentVisible = false;

            scope.showTooltip = function() {
              //makes sure if the layout of the page has changes, the tooltip will still show up in the correct position
              setTooltipPosition();
              scope.contentVisible = true;
            };

            scope.hideTooltip = function() {
              scope.contentVisible = false;
            };

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
