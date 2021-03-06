fixColor.js
=============
fixColors.js is jQuery plugin to fix contrast ratio of foreground and background color automatically.

How to Use?
---------------
Its very simple to use, just include jQuery on your page and fixColor.js 
Call fixColors every time you want to fix the colors of a content. 

<pre><code>

$('div').fixColors();

</code></pre>

How Code Works?
-----------------

Major part of code goes in function 
<pre><code>
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
</code></pre>

This function finds some interesting information about a color. e.g. brightness, max Contrasting color, RGB value , if The color is has alpha value, if color is a transparent color etc. 

Then there is one more function which finds background or foreground color of a element!
<pre><code>
function getComputedColor(el,what) {
        var w={'c':{'css':'color','v':'rgb(0,0,0)'},'b':{'css':'background-color','v':'rgb(255,255,255)'}}
        if (el === null) {
            return w[what].v;
        }
        var str = getStyle(el, w[what].css);
        return (getColorInfo(str).isTransparent)?getComputedColor(el.parentElement,what):str;
    }
</code></pre>


These 2 functions together used to determine and fix colors of a html content. 


Limitations!
-----------------
- This will remove alpha component from the background color, because its not possible to calculate actual, color by having alpha component in it. 
- does not work with background images. 

Demo?
----------
You can see working Demo Here http://www.purplegene.com/static/contrast.html


<pre>
       ad88  88                 ,ad8888ba,                88                           
      d8"    ""                d8"'    `"8b               88                           
      88                      d8'                         88                           
    MM88MMM  88  8b,     ,d8  88              ,adPPYba,   88   ,adPPYba,   8b,dPPYba,  
      88     88   `Y8, ,8P'   88             a8"     "8a  88  a8"     "8a  88P'   "Y8  
      88     88     )888(     Y8,            8b       d8  88  8b       d8  88          
      88     88   ,d8" "8b,    Y8a.    .a8P  "8a,   ,a8"  88  "8a,   ,a8"  88          
      88     88  8P'     `Y8    `"Y8888Y"'    `"YbbdP"'   88   `"YbbdP"'   88          
</pre>