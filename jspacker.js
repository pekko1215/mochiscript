exports.toBrackets = function(num) {
        var bits = num.toString(2).split('')
        var ret = "";
        bits.forEach(function(data, i) {
                if (i != 0) {
                        ret = "[[" + ret + "][~~[]]<<-~[]][~~[]]"
                }
                if (data == 1) {
                        ret += "-~[]";
                }
        })
        if (ret == "") {
                ret = "~~[]"
        }
        return ret;
}

exports.makeVarName = function(num, base) {
        ret = "";
        base = base.split('')
        num = num.toString(base.length).split('');
        num.forEach(function(d) {
                ret += base[d];
        })
        return ret;
}

exports.shooter = function(str, fname) {
        var strarray = str.split('');
        var ret = "";
        strarray.forEach(function(char) {
                ret += fname + "(" + exports.toBrackets(char.charCodeAt(0)) + ")+";
        })
        ret = ret.substr(0, ret.length - 1);
        if (ret == "") {
                ret = '""'
        }
        return ret
}

exports.makeCCC = function(name) {
        var ret = "function " + name + "(_){"

        ret += "return ''.constructor[Object.getOwnPropertyNames(''.constructor).find(function($){"
        var po = Math.floor(Math.random()*10);
        ret += "return typeof this[$]==typeof this&&this[$]("+po+")=="+'"'+String.fromCharCode(po)+'"';
        ret += "},''.constructor)](_)}"
        /*
        function name(_){
                return String[Object.getOwnPropertyNames(String).find(function(_){
                         return typeof this[_]==typeof this&&this[_](32)==" "
                },String)](_)
        }

         */
        return ret;
}
