/**
 * Value Labels Plugin for flot.
 * http://leonardoeloy.github.com/flot-valuelabels
 * http://wiki.github.com/leonardoeloy/flot-valuelabels/
 *
 * Using canvas.fillText instead of divs, which is better for printing - by Leonardo Eloy, March 2010.
 * Tested with Flot 0.6 and JQuery 1.3.2.
 *
 * Original homepage: http://sites.google.com/site/petrsstuff/projects/flotvallab
 * Released under the MIT license by Petr Blahos, December 2009.
 */
(function ($) {
    var options = {
        valueLabels: {
	    show: false,
            showAsHtml: false, // Set to true if you wanna switch back to DIV usage (you need plot.css for this)
            showLastValue: false, // Use this to show the label only for the last value in the series
            showTotal: false, // Use this to show the label only for the last value in the series
            plotAxis: 'y' // Set to the axis values you wish to plot
        }
    };
    
    function init(plot) 
	{
        plot.hooks.draw.push(function (plot, ctx) 
		{
			if (!plot.getOptions().valueLabels.show) return;
				
				var showLastValue = plot.getOptions().valueLabels.showLastValue;
				var showAsHtml = plot.getOptions().valueLabels.showAsHtml;
				var showTotal = plot.getOptions().valueLabels.showTotal;
                var plotAxis = plot.getOptions().valueLabels.plotAxis;
				var ctx = plot.getCanvas().getContext("2d");
				var lastYPos = [-1000, -1000, -1000, -1000, -1000, -1000, -1000];
				var total = [];
                var totalXaxis = [];
				var lastSeries;
			$.each(plot.getData(), function(ii, series) 
			{
						// Workaround, since Flot doesn't set this value anymore
						series.seriesIndex = ii;
						lastSeries = series;
				if (showAsHtml) plot.getPlaceholder().find("#valueLabels"+ii).remove();
				var html = '<div id="valueLabels' + series.seriesIndex + '" class="valueLabels">';
						
				var last_val = null;
				var last_x = -1000;
				var last_y = -1000;
				
				var points = series.datapoints.points;
				var ps = series.datapoints.pointsize;
				for (var i = 0; i < series.data.length; ++i)
				{
					if (series.data[i] == null || (showLastValue && i != series.data.length-1))  continue;
		
					var x = series.data[i][0];
					var y = series.data[i][1];
                    if (x < series.xaxis.min || x > series.xaxis.max || y < series.yaxis.min || y > series.yaxis.max)  continue;
                    var val = x;
					
					if( total[y] == null )
                    {
                        total[y] = [y,0];
                        totalXaxis[y] = series.xaxis;
                    }
					total[ y ][1] += val;

                    /*
					var x = Math.ceil((points[ i*ps + 0 ] + points[ i*ps + 2 ])/2*10)/10;
					if (x < series.xaxis.min || x > series.xaxis.max || y < series.yaxis.min || y > series.yaxis.max)  continue;

					if (series.valueLabelFunc) val = series.valueLabelFunc({ series: series, seriesIndex: ii, index: i });



					//if (val!=last_val || i==series.data.length-1)
                    if( val != null )
					{
                        val = (val == 0)?(""):($.format.number(val, "#") + "%");
						var xx = Math.round(series.xaxis.p2c(x))+plot.getPlotOffset().left - 24;
						var yy = Math.round(series.yaxis.p2c(y))+plot.getPlotOffset().top - 8;

						//if( lastYPos[i] && Math.abs(yy - lastYPos[i]) < 12 ) yy = lastYPos[i] - 18;
						if (Math.abs(yy-last_y) > 20 || last_x < xx) 
						{
							last_val = val;
							last_x = xx + val.length*8;
							last_y = yy;
							lastYPos[i] = yy;
							
							if (!showAsHtml) 
							{
								// Little 5 px padding here helps the number to get
								// closer to points
								x_pos = xx;
								y_pos = yy+6;

								// If the value is on the top of the canvas, we need
								// to push it down a little
								if (yy <= 0) y_pos = 18;
								// The same happens with the x axis
								if (xx >= plot.width()) x_pos = plot.width();

								ctx.fillText(val, x_pos, y_pos);                
							} 
							else 
							{
								//var width = Math.floor(lastSeries.xaxis.p2c(1) - 20);
                                var width = 32;
								var clazz = "value" + ii;
                                var h = '<div style="left:' + xx + 'px;top:' + yy + 'px;width:' + width + 'px;" class="valueLabel ' + clazz +'">' + val + '</div>';
								html += h;
							}
						}
					}
					*/
				}
				if (showAsHtml) 
				{
					html+= "</div>";
					plot.getPlaceholder().append(html);
				}
			});

			if( showTotal )
			{
                //we only need the total labels on the 1st and 3rd columns - ie x values 1 and 5
                //var totalLabels = [];
                var totalLabels = [0,1,2,3];
				for (var j in totalLabels)
				{
					if (showAsHtml) plot.getPlaceholder().find("#valueLabelTotal"+i).remove();
					var html = '<div id="valueLabelTotal' + i + '" class="valueLabels">';
		            var i = totalLabels[j];
                    //console.log("total[ " + i + " ][0] = " + total[i][0])
					var y = total[i][0];
					var x = total[i][1];
					var val = x;

					val = (val == 0)?(""):($.format.number(val, "#.00"));
                    //console.log("totalLabels[ " + j + " ] = " + totalLabels[j] );

					//var xx = lastSeries.xaxis.p2c(x) + plot.getPlotOffset().left;
					var yy = lastSeries.yaxis.p2c(y + 0.5) + plot.getPlotOffset().top - 8;
					var xx = totalXaxis[y].p2c(x) + plot.getPlotOffset().left + 2;

					if (!showAsHtml) 
					{
						// Little 5 px padding here helps the number to get
						// closer to points
						x_pos = xx;
						y_pos = yy+6;

						// If the value is on the top of the canvas, we need
						// to push it down a little
						if (yy <= 0) y_pos = 18;
						// The same happens with the x axis
						if (xx >= plot.width()) x_pos = plot.width();

						ctx.fillText(val, x_pos, y_pos);                
					} 
					else 
					{
                        var width = 32;
						var h = '<div style="left:' + xx + 'px;top:' + yy + 'px;width:' + width + 'px;" class="valueLabelTotal">' + val + '</div>';
						html += h;
						plot.getPlaceholder().append(html);
					}
				}
			}
			
        });
    }
    
    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'valueLabels',
        version: '1.1'
    });
})(jQuery);

