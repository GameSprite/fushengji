//wrapper some game useful interface

var chinese_default_width = 2;

//get actual length of str
exports.strlen = function (str) {

    if (typeof str != "string") {
        return 0;
    }

    //get width
    var chinese_width = chinese_default_width;
    if (arguments.length > 1) {
        var width = arguments[1];
        width *= 1;

        if (!isNaN(width) && width > 0) {
            chinese_width = width;
        }
    }

    var len = 0;
    for (var i = 0; i < str.length; i++) {

        var code = str.charCodeAt(i);

        if (code > 127) {

            //multi bytes utf8, the most high byte must be 11XXXXXX, otherwise 10XXXXXX
            if (code & 0x40) {
                len += chinese_width;
            }
            else {
                //skip
            }

        }
        else {

            //ASCII - 1 byte uft8
            len++;
        }

    }

    return len;
}


//sub string
exports.substr = function (str, len) {

    if (typeof str != "string") {
        return "";
    }

    len *= 1;

    if (isNaN(len) || len <= 0) {
        return "";
    }

    //get width
    var chinese_width = chinese_default_width;
    if (arguments.length > 2) {
        var width = arguments[2];
        width *= 1;

        if (!isNaN(width) && width > 0) {
            chinese_width = width;
        }
    }

    for (var i = 0; i < str.length; i++) {

        var code = str.charCodeAt(i);

        if (code > 127) {

            //multi bytes utf8, the most high byte must be 11XXXXXX, otherwise 10XXXXXX
            if (code & 0x40) {

                len -= chinese_width;

                //check is enough
                if (len < 0) {
                    return str.substring(0, i);
                }

            }
            else {
                //skip
            }

        }
        else {

            //ASCII - 1 byte uft8
            len--;

            //check is enough
            if (len < 0) {
                return str.substring(0, i);
            }
        }

    }

    return str;
}

exports.strenter = function (str, len) {
    var isToEnglish = false;
    if(global.Language.current == "en" || global.Language.current == "id"){
        isToEnglish = true;
    }

    if (typeof str != "string") {
        return "";
    }

    len *= 1;

    if (isNaN(len) || len <= 0) {
        return str;
    }

    //get width
    var chinese_width = chinese_default_width;
    if (arguments.length > 2) {
        var width = arguments[2];
        width *= 1;

        if (!isNaN(width) && width > 0) {
            chinese_width = width;
        }
    }

    var newstr = "";
    var _len = 0;
    var begin = 0;
    var _en = 0;
    for (var i = 0; i < str.length; i++) {

        var code = str.charCodeAt(i);

        if (code > 127) {

            //multi bytes utf8, the most high byte must be 11XXXXXX, otherwise 10XXXXXX
            if (code & 0x40) {

                _len += chinese_width;

                //check is enough
                if (_len > len) {
                    newstr += str.substring(begin, i);
                    newstr += "\n";

                    begin = i;

                    _len = chinese_width;
                }

            }
            else {
                //skip
            }

        }
        else {

            //ASCII - 1 byte uft8
            _len++;
            if(isToEnglish){
                if(str[i] == " "){
                    _en = i;
                }
            }else{
                _en = i;
            }

            //check is enough
            if (_len > len) {
                if(isToEnglish && str[i+1] == " "){     //预判下一个字节是不是空格，是空格的话，代表已经是单词最后
                    _en = i+1;
                }
                newstr += str.substring(begin, _en);
                newstr += "\n";
                if(isToEnglish){
                    i = _en+1;
                    _en = i;
                }
                begin = i;

                _len = 1;
            }
            else if (str[i] == "\n") {
                newstr += str.substring(begin, i);                
                begin = i;

                _len = 1;
            }
        }

    }

    newstr += str.substring(begin, i);

    return newstr;
}
