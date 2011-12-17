
$.fn.fixColors = function(options) {
    var defaults={'isBackground':false};
    var opts = $.extend(defaults, options);
    
    /*********************************************
        input rgb or rgba value, 
        returns object after prasing various color information.
     ************************************************/
    function getColorInfo(strColor){
        var match=strColor.match(/rgba[ \t]*\([ \t]*([0-9.]+)[ \t]*,[ \t]*([0-9.]+)[ \t]*,[ \t]*([0-9.]+)[ \t]*,[ \t]*([0-9.]+)[ \t]*\)/);
        var isAlpha=true;
        if(match===null){
            match=strColor.match(/rgb[ \t]*\([ \t]*([0-9.]+)[ \t]*,[ \t]*([0-9.]+)[ \t]*,[ \t]*([0-9.]+)[ \t]*\)/);
            isAlpha=false;
        }
        var r = match[1]*1, g = match[2]*1,b = match[3]*1, a = match[4]*1;
        var brightness = (r * 299 + g * 587 + b * 114) / 1000, cb = 20;
        if (brightness < 127) {
            cb = 235;
        }
        isTransparent=(isAlpha)&&(a===0);
        var rgbOnly='rgb('+r+','+g+','+b+')';
        var maxContrast = "rgb(" + cb+"," +cb+"," +cb+")";
        return {'r':r,'g':g,'b':b,'a':a,  
            'brightness':brightness,
            'maxContrast':maxContrast,
            'rgb':rgbOnly,
            'isAlpha':isAlpha,
            'isTransparent':isTransparent
        };
    }
    
    /********************************************
        gets computed style
    *********************************************/
    function getStyle(el, styleProp) {
        var x = el;
        if (x.currentStyle) var y = x.currentStyle[styleProp];
        else if (window.getComputedStyle) var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
        return y;
    }
    
    /*********************************************        
        function: getComputedColor
        gets computed color or background color.
    **********************************************/
    function getComputedColor(el,what) {
        var w={'c':{'css':'color','v':'rgb(0,0,0)'},'b':{'css':'background-color','v':'rgb(255,255,255)'}}
        if (el === null) {
            return w[what].v;
        }
        var str = getStyle(el, w[what].css);
        return (getColorInfo(str).isTransparent)?getComputedColor(el.parentElement,what):str;
    }

    /***********************************************
        recurses on node's children and 
        fixes the contrast of text
    ***********************************************/
    function fixColors(Node, pBg, pColor) {
        Node = (Node === undefined) ? document.body : Node;
        var bg = getColorInfo(getComputedColor(Node,'b'));
        var color = getColorInfo(getComputedColor(Node,'c'));
        (bg.isAlpha) && $(Node).css('background-color', bg.rgb);
        (color.isAlpha) && $(Node).css('color', color.rgb);
        
        var child = null,contrast = Math.abs(color.brightness - bg.brightness);
        if(!opts.isBackground){
            (contrast < 110) && $(Node).css('color', bg.maxContrast);    
        }else{
            (contrast < 110) && $(Node).css('background-color', color.maxContrast);
        }

        for (var i = 0; i < Node.childElementCount; i++) {
            child = Node.children[i];
            var ctn=child.tagName
            if ((ctn !== undefined) && (ctn === 'INPUT' || ctn === 'BUTTON')) {
                continue;
            }
            fixColors(child, bg, color);
        }
    }
    return this.each(function(){
        fixColors(this);
    });
    
}