(function() {
    'use strict';
    var h = $("<div>").appendTo($("body")).css({
        "text-align": "center",
        padding: "1em"
    });
    $("<h1>").appendTo(h).text("16pxの画像をfeeder語に変換する");
    $("<button>").appendTo(h).text("画像選択").click(function(){
        input.click();
    });
    var h_result = $("<div>").appendTo(h);
    var input = $("<input>").attr({
        type: "file"
    }).change(loadImg);
    function loadImg(e){
        var file = e.target.files[0];
        if(!file) return;
        var blobUrl = window.URL.createObjectURL(file);
        var img = new Image();
        img.onload = function(){ main(img); };
        img.src = blobUrl;
    }
    function main(img){
        var cv = $("<canvas>").attr({
            width: 16,
            height: 16
        });
        var ctx = cv.get(0).getContext('2d');
        ctx.drawImage(img,0,0);
        var p = ctx.getImageData(0, 0, 16, 16);
        var d = p.data;
        var result = '' , rgb_log,
            width = 4 * 16;
        for (var i = 0; i <d.length; i=i+4) {
            if(i % width === 0) result += '\n';
            var r = d[i],
                g = d[i+1],
                b = d[i+2],
                a = d[i+3];
            if(a === 0){ // 透過色なら
                if(rgb_log) result += "}";
                rgb_log = null;
                result += "　";
                continue;
            }
            var rgb = [r,g,b].map(function(n){
                return ("00" + n.toString(16)).slice(-2);
            }).join('');
            if(rgb !== rgb_log) { // ログと別なら
                if(rgb_log) result += "}";
                result += "{#" + rgb.toUpperCase() + ":█"
            }
            else {
                result += "█";
            }
            rgb_log = rgb;
        }
        if(rgb_log) result += "}";
        var str = result.split('\n').map(function(v){
            return v.replace(/　+$/,'');
        }).join('\n').replace(/^\n+/,'').replace(/\n+$/,'');
        $("<div>",{text:"文字数："+str.length}).appendTo(h_result.empty());
        yaju1919.addInputText(h_result,{
            title: "output",
            readonly: true,
            textarea: true,
            value: str,
            trim: false
        });
    }
})();
