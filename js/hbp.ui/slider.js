/**
 * ...
 * @author Richard Huntley
 */
var COLORS = { red:'#5B2D28', blue:'#004459', green:'#8da56e', brown:'#2DC6D6', black:'#5A5A4B' };

$.widget( "ui.hbp_slider", $.ui.slider,
    {
        _create: function()
        {
            //var COLORS = { red:'#AB011E', blue:'#048ea5', green:'#669d05', brown:'#bd8903' };

            var show = true;
            if( this.options.showCallout != undefined ) show = this.options.showCallout;
            var col = 'black';
            if( this.options.color != undefined ) col = this.options.color;

            var s = this.options.valueWidth;
            var callout_class = "slider_callout_" + col + s;
            //shadow style
            if( $("style:contains('shadowed')").length < 1 )
                $("<style type='text/css'>.shadowed { -moz-box-shadow: 0px 3px 3px #CCC; -webkit-box-shadow: 0px 3px 3px #CCC; box-shadow: 0px 3px 3px #CCC; } </style>").appendTo("head");
            //add the necessary styles - only add if doesn't already exist
            if( $("style:contains('ui-slider-horizontal')").length < 1 )
                $("<style type='text/css'>.ui-slider-horizontal { height: 4px; width:100%; background-color:#5a5a4b; border: none; /*border-color:#ccc border-radius: 1px; -webkit-border-radius: 1px; -moz-border-radius: 1px;*/ } </style>").appendTo("head");
            if( $("style:contains('.ui-slider-horizontal .ui-state-default')").length < 1 )
                $("<style type='text/css'>.ui-slider-horizontal .ui-state-default { width: 36px; height: 36px; position: absolute; top: -18px; margin-left:-18px; border-style: none;background: url(assets/slider_handle.png) no-repeat scroll 50% 50%; } </style>").appendTo("head");

            if( $("style:contains('slider_text')").length < 1 )
                $("<style type='text/css'>.slider_text { font-family: 'Arial'; color: #b0b0a6; font-size: 9pt; position:absolute } </style>").appendTo("head");
            if( $("style:contains('slider_min')").length < 1 )
                $("<style type='text/css'>.slider_min { margin-top: 17px; left:-3px; color: #b0b0a6 } </style>").appendTo("head");
            if( $("style:contains('slider_max')").length < 1 )
                $("<style type='text/css'>.slider_max { margin-top: 17px; right:-5px; color: #b0b0a6 } </style>").appendTo("head");
            if( $("style:contains('" + callout_class + "')").length < 1 )
                $("<style type='text/css'>." + callout_class + " { width: " + s + "px; margin-left: -" + Math.floor(s/2) + "px; position: absolute; top: -55px; text-align: center; background:#7E97C3; color:#FFF; left:0px; font-size:12pt; font-weight:bold; line-height:30px;  } </style>").appendTo("head");

            //add the minimun, maximum and callout div's
            this.prefix = this.options.valuePrefix?this.options.valuePrefix:'';
            this.fnSuffix = this.options.fnSuffix?this.options.fnSuffix:null;
            if( this.fnSuffix != null ) this.suffix = this.fnSuffix( this.options.value );
            else this.suffix = this.options.valueSuffix?this.options.valueSuffix:'';

            this.minDisplay = $("<div class='slider_text slider_min'>" + this.options.minText + "</div>")
            this.maxDisplay = $("<div class='slider_text slider_max'>" + this.options.maxText + "</div>")
            this.element.append( this.minDisplay );
            this.element.append( this.maxDisplay );


            this.element.removeClass("ui-widget-content");

            if( show )
            {
                if( this.options.value < 0 )
                {
                    this.valueDisplay = $("<div class='slider_text " + callout_class + "'>(" + this.prefix + $.format.number( -1 * this.options.value, this.options.valueFormat ) + this.suffix + ")</div>")
                    //this.valueDisplay.css( "background-color", COLORS['red'] )
                }
                else
                {
                    this.valueDisplay = $("<div class='slider_text " + callout_class + "'>" + this.prefix + $.format.number( this.options.value, this.options.valueFormat ) + this.suffix + "</div>")
                    //this.valueDisplay.css( "background-color", COLORS['green'] )
                }

                this.element.append( this.valueDisplay );
            }
            if( this.options.label )
            {
                if( $("style:contains('slider_label')").length < 1 )
                    $("<style type='text/css'>.slider_label { top: -25px; width:inherit; text-align:left; color: #999; } </style>").appendTo("head");
                this.labelDisplay = $("<div class='slider_text slider_label'>" + this.options.label + "</div>");
                this.element.append( this.labelDisplay );
            }

            //call the prototype _create method to set up the slider
            var result = $.ui.slider.prototype._create.apply( this, arguments );

            //now that the slider is set up we can adjust the valueDisplay
            /*
             jQuery issue:
             handle.css('left') returns a % amount in chrome but a pixel amount in firefox
             thus it can't be used so we need to resort to the native style.left method
             */
            var handle = $(this.handles[ 0 ]);
            //var pos = parseInt(handle.css('left')); different result in firefox and chrome
            if( show ) this.valueDisplay.css( 'left', handle[0].style.left);

            return result;
        },

        _slide: function( event, index, newVal )
        {
            //custom code here
            if( this.options.showCallout == undefined || this.options.showCallout )
            {
                var handle = $(this.handles[ index ]);
                if( this.fnSuffix != null ) this.suffix = this.fnSuffix( newVal );
                //this.valueDisplay.text( this.prefix + $.format.number( newVal , this.options.valueFormat ) + this.suffix );
                if( this.options.value < 0 )
                {
                    this.valueDisplay.text( "(" + this.prefix + $.format.number( -1 * newVal , this.options.valueFormat ) + this.suffix + ")" );
                    //this.valueDisplay.css( "background-color", COLORS['red'] )
                }
                else
                {
                    this.valueDisplay.text( this.prefix + $.format.number( newVal , this.options.valueFormat ) + this.suffix );
                    //this.valueDisplay.css( "background-color", COLORS['green'] )
                }
                this.valueDisplay.css( 'left', handle[0].style.left );
            }
            return $.ui.slider.prototype._slide.apply( this, arguments );
        },

        _stop: function( event, index )
        {
            //custom code here
            if( this.options.showCallout == undefined || this.options.showCallout )
            {
                var handle = $(this.handles[ index ]);
                if( this.fnSuffix != null ) this.suffix = this.fnSuffix( this.value() );
                //this.valueDisplay.text( this.prefix + $.format.number( this.value(), this.options.valueFormat ) + this.suffix );
                if( this.options.value < 0 )
                {
                    this.valueDisplay.text( "(" + this.prefix + $.format.number( -1 * this.value() , this.options.valueFormat ) + this.suffix + ")" );
                    //this.valueDisplay.css( "background-color", COLORS['red'] )
                }
                else
                {
                    this.valueDisplay.text( this.prefix + $.format.number( this.value() , this.options.valueFormat ) + this.suffix );
                    //this.valueDisplay.css( "background-color", COLORS['green'] )
                }
                this.valueDisplay.css( 'left', handle[0].style.left );
            }

            return $.ui.slider.prototype._stop.apply( this, arguments );
        },
        _setOption: function( key, value )
        {
            $.ui.slider.prototype._setOption.apply( this, arguments );

            switch ( key )
            {
                case "min":
                    this.minDisplay.text( $.format.number( value, this.options.valueFormat ) );
                    break;
                case "max":
                    this.maxDisplay.text( $.format.number( value, this.options.valueFormat ) );
                    break;
            }
        },
        _refreshValue: function()
        {
            $.ui.slider.prototype._refreshValue.apply( this, arguments );
            if( this.options.showCallout == undefined || this.options.showCallout )
            {
                var handle = $(this.handles[ 0 ]);
                if( this.fnSuffix != null ) this.suffix = this.fnSuffix( this.value() );
                //this.valueDisplay.text( this.prefix + $.format.number( this.value(), this.options.valueFormat ) + this.suffix );
                if( this.options.value < 0 )
                {
                    this.valueDisplay.text( "(" + this.prefix + $.format.number( -1 * this.value() , this.options.valueFormat ) + this.suffix + ")" );
                    //this.valueDisplay.css( "background-color", COLORS['red'] )
                }
                else
                {
                    this.valueDisplay.text( this.prefix + $.format.number( this.value() , this.options.valueFormat ) + this.suffix );
                    //this.valueDisplay.css( "background-color", COLORS['green'] )
                }
                //this.valueDisplay.css( 'left', handle[0].style.left );
            }
        },
        setColor:function(col)
        {
            //var HANDLE = { red:"url('assets/slider_handle_1.png')", blue:"url('assets/slider_handle_2.png')", green:"url('assets/slider_handle_4.png')", brown:"url('assets/slider_handle_3.png')" };
            //$(this.handles[ 0 ]).css("background-image", HANDLE[col]);
        }
    }
);	
	
	
