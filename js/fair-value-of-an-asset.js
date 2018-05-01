var GRID_COUNT = 30;
var GRID_TAB_LENGTH = 0;

var principalOne = false;
var principalTwo = false;

var getPrincipalIndexWidth = function(div) {
  var barContainer = div.find('.bar-container');

  var leftMost = undefined;
  var rightMost = undefined;
 
  barContainer.each(function() {
    var bars = $(this).find('.bar');

    if (bars.length == 1) {
      rightMost = bars.eq(0).width();
    }
    else if (bars.length == 2) {
      leftMost = bars.eq(0).width() + bars.eq(1).width();
    }
  });

  var leftIndex = Math.round(leftMost / GRID_TAB_LENGTH);
  var rightIndex = Math.round(rightMost / GRID_TAB_LENGTH);

  return (rightIndex - leftIndex);
}

var updatePrincipal = function(div, principal, bottom) {
  //get the position of the first from both rows.

  var barContainer = div.find('.bar-container');

  div.find('.fair-value').remove();
  div.find('.market-grid-line').css('z-index', '').css('width', 1).css('background', 'rgb(235, 235, 235)').each(function(index, dom) {
    if ((index % 5) == 0) {
    }
    else {
      $(dom).css('height', 'calc(100% - 8px)');
    }
  });

  if (principal) {
    var leftMost = undefined;
    var rightMost = undefined;

    barContainer.each(function() {
      var bars = $(this).find('.bar');

      if (bars.length == 1) {
        rightMost = bars.eq(0).width();
      }
      else if (bars.length == 2) {
        leftMost = bars.eq(0).width();
      }
    });
    
    var isNegative = leftMost > rightMost;

    if (isNegative) {
      var temp = leftMost;

      leftMost = rightMost;
      rightMost = temp;
    }

    var leftIndex = Math.round(leftMost / GRID_TAB_LENGTH);
    var rightIndex = Math.round(rightMost / GRID_TAB_LENGTH);

    var fairValue = $('<div class="fair-value"' + (bottom ? 'style="margin-top:12px"' : '') + '><div class="fair-value-text">Fair Value ' + (isNegative ? '-' : '') + '$' + (rightIndex - leftIndex) + '</div></div>');

    var leftArrow = $('<div class="fair-value-arrow left">');
    var rightArrow = $('<div class="fair-value-arrow right">');

    fairValue.append(rightArrow);
    fairValue.prepend(leftArrow);

    fairValue.find('.fair-value-arrow').toggleClass('hidden', !(rightIndex - leftIndex));
    fairValue.find('.fair-value-text').css('width', rightMost - leftMost).toggleClass('left', ((rightIndex - leftIndex) <= 5));
    
    fairValue.find('.fair-value-text')

    // position it absolutely to the top.
    div.find('.market-graph').eq(0).append(fairValue);

    // find where each bubble is sitting;

    fairValue.css('left', leftMost);
    fairValue.css('width', rightMost - leftMost);

    div.find('.market-grid-line').eq(leftIndex).css('width', 3).css('background', 'rgb(247, 148, 29)').css('z-index', '5');
    div.find('.market-grid-line').eq(rightIndex).css('width', 3).css('background', 'rgb(247, 148, 29)').css('z-index', '5');
  }
  else {
    div.find('.fair-value').remove();
  }
};

var update = function() {
  var principals = $('.market-container');

  updatePrincipal(principals.eq(0), principalOne);
  updatePrincipal(principals.eq(1), principalTwo, true);

  if (!(principalOne || principalTwo)) {
    var p1Length = getPrincipalIndexWidth(principals.eq(0));
    var p2Length = getPrincipalIndexWidth(principals.eq(1));

    if (p2Length > p1Length) {
      updatePrincipal(principals.eq(1), true, true);
    }
    else {
      updatePrincipal(principals.eq(0), true);
    }
  }
};

$(document).ready(function() {
  var numbered = false;

  var reset = function() {
    var originValues = [26, 2, 3, 2, 1, 25];

    $('.bar').each(function(index) {
      var self = $(this);
      self.html('$' + originValues[index]);
      self.width(originValues[index] * GRID_TAB_LENGTH);

      var barControl = $('<div class="bar-control">');

      var mousedown = function(e) {
        barControl.off('mousedown touchstart');
        e.preventDefault();

        $(window).on('mousemove touchmove', function(e) {
          var p = self.parent().offset();
          var totalLength = 0;

          if (self.index() == 1) {
            p.left += self.parent().children().eq(0).width();
            totalLength += self.parent().children().eq(0).width();
          }
          else {
            var next = self.parent().children().eq(1);

            if (next) {
              totalLength += self.parent().children().eq(1).width();
            }
          }

          var maxWidth = GRID_COUNT * GRID_TAB_LENGTH;
          var px = e.pageX || e.originalEvent.touches[0].pageX;

          var adjustedLength = 
            Math.max(
              self.attr('min') * GRID_TAB_LENGTH, 
              Math.min(
                Math.round((px - p.left) / GRID_TAB_LENGTH) * GRID_TAB_LENGTH,
                Math.min(maxWidth - totalLength, self.attr('max') * GRID_TAB_LENGTH))
            );

          self.text('$' + Math.round(adjustedLength / GRID_TAB_LENGTH));
          self.append(barControl);
          self.css('width', adjustedLength + 1);

          update();
        })
          .on('mouseup touchend', function() {
            $(window).off('mousemove touchmove');
            $(window).off('mouseup touchend');

            barControl.on('mousedown touchstart', mousedown);
          });
      };

      barControl.on('mousedown touchstart', mousedown);

      self.append(barControl);
    });

    update();
  }


  $('.market-grid').each(function(e) {
    var self = $(this);

    var width = self.width();
    var height = self.height();

    GRID_TAB_LENGTH = width / GRID_COUNT;

    for (var i = 0; i <= GRID_COUNT; i++) {
      var lineDiv = $('<div class="market-grid-line">');

      lineDiv.css('left', i * (width / GRID_COUNT));

      if ((i % 5) == 0) {
        //lineDiv.css('z-index', 3);

        if (!numbered) {
          var numberDiv = $('<div class="market-grid-number">' + i + '</div>');

          lineDiv.append(numberDiv);
        }
      }

      self.append(lineDiv);
    }

    numbered = true;
  });

  $('.principal').css('cursor', 'pointer').each(
    function(index) {
      $(this).click(
        function() {
          $('.principal').removeClass('selected');

          if (index == 0) {
            principalOne = !principalOne;
            principalTwo = false;

            if (principalOne) {
              $(this).addClass('selected');
            }
          }
          else {
            principalTwo = !principalTwo;
            principalOne = false;

            if (principalTwo) {
              $(this).addClass('selected');
            }
          }

          update();
        }
      );
    }
  )

  reset();

  $('.block-btn').click(reset);
});