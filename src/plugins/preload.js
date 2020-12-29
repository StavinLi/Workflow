function All() {}
All.prototype = {
    timer: "",
    debounce(fn, delay = 500) {
        var _this = this;
        return function(arg) {
            //获取函数的作用域和变量
            let that = this;
            let args = arg;
            clearTimeout(_this.timer) // 清除定时器
            _this.timer = setTimeout(function() {
                fn.call(that, args)
            }, delay)
        }
    },
    setCookie(val) { //cookie设置[{key:value}]、获取key、清除['key1','key2']
        for (var i = 0, len = val.length; i < len; i++) {
            for (var key in val[i]) {
                document.cookie = key + '=' + encodeURIComponent(val[i][key]) + "; path=/";
            }
        }
    },
    getCookie(name) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0, len = arrCookie.length; i < len; i++) {
            var arr = arrCookie[i].split("=");
            if (name == arr[0]) {
                return decodeURIComponent(arr[1]);
            }
        }
    },
    clearCookie(name) {
        var myDate = new Date();
        myDate.setTime(-1000); //设置时间    
        for (var i = 0, len = name.length; i < len; i++) {
            document.cookie = "" + name[i] + "=''; path=/; expires=" + myDate.toGMTString();
        }
    },
}

export default new All();