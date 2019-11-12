function All() {}
All.prototype = {
    timer: "",
    urlReplace(url, title) { //修改路径不刷新页面
        var pageTitle = document.title;
        if (history.pushState) {
            if (title) {
                pageTitle = title;
            } else {
                title = pageTitle;
            }
            history.pushState({
                title: title
            }, title, url);
            return true;
        }
        location.href = url;
        return false;
    },
    dealRouter(routers, resourceIds) {
        var a = JSON.parse(JSON.stringify(routers))
        var newList = []
        a.forEach(item => {
            if (resourceIds.indexOf(item.id) != -1) {
                item.children = !item.children ? null : this.dealRouter(item.children, resourceIds)
                newList.push(item)
            }
        })
        return newList
    },
    getDemoUrl(val, parkId) {
        return `http://www.thingjs.com/guide/sampleindex.html?m=YWRtaW44ODE=/${val}.js&parkId=${parkId}&type=${process.env.NODE_ENV}`
    },
    getFileType(filePath) {
        var startIndex = filePath.lastIndexOf(".");
        if (startIndex != -1)
            return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
        else return "";
    },
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
    isEmpty(val, define = "--") { //无值显示--
        return (val != null && val !== "") ? val : define
    },
    notUnit(val, unit, define = "--") { //无值显示--
        return (val != null && val !== "") ? val + unit : define
    },
    isMobileNum(num) { //手机号校验
        return /^1[3-9]{1}[0-9]{1}\d{8}$/.test(num)
    },
    isTelNum(num) {
        return func.isMobileNum(num) || /^0\d{3}-?\d{7}$|^0\d{2}-?\d{8}$/.test(num)
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
    addZero(temp) { //个位时间加0前缀
        return (temp < 10 ? "0" : "") + temp;
    },
    getBeforeMonth(monthNum = 0, mark = "-") {
        var dd = new Date();
        dd.setMonth(dd.getMonth() + monthNum);
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;
        return y + mark + this.addZero(m)
    },
    getTimeSub(startVal, endVal) {
        if (typeof startVal == "number") {
            var total = Math.abs(endVal - startVal) / 1000;
            var day = parseInt(total / (24 * 60 * 60)); //计算整数天数
            var afterDay = total - day * 24 * 60 * 60; //取得算出天数后剩余的秒数
            var hour = parseInt(afterDay / (60 * 60)); //计算整数小时数
            var afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60; //取得算出小时数后剩余的秒数
            var min = parseInt(afterHour / 60); //计算整数分
            var afterMin = total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60; //取得算出分后剩余的秒数
            return (day != 0 ? (day + "天") : "") +
                (hour != 0 ? (hour + "时") : "") +
                (min != 0 ? (min + "分") : "") +
                (afterMin != 0 ? (afterMin + "秒") : "")
        }
    },
    getDay(val = new Date()) { //某天年月日星期本月天数
        var dd = new Date(this.getTimeStap(val));
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;
        var d = dd.getDate();
        var ds = new Date(y, m, 0);
        return {
            ym: y + "-" + this.addZero(m),
            d: this.addZero(d),
            y: y,
            m: m,
            ds: ds.getDate(),
            week: dd.getDay() == 0 ? 7 : dd.getDay()
        }
    },
    getTimeStap(val = new Date()) {
        return Date.parse(val)
    },
    getDateformat(val, mark = "-") {
        if (val) {
            var dd = new Date(this.getTimeStap(val))
            var y = dd.getFullYear();
            var m = this.addZero(dd.getMonth() + 1);
            var d = this.addZero(dd.getDate());
            return y + mark + m + mark + d;
        } else {
            return "";
        }
    },
    getMM(arr, maxVal) {
        let maxLength = (Math.ceil(arr.max()) + "").length,
            maxPow = arr.max() / Math.pow(10, maxLength - 2),
            minLength = arr.min() >= 0 ? 0 : (Math.floor(arr.min()) + "").length,
            minPow = arr.min() / Math.pow(10, minLength - 3),
            max = Math.ceil(maxPow) * Math.pow(10, maxLength - 2),
            min = Math.floor(minPow) * Math.pow(10, minLength - 3);
        return {
            max: max < maxVal ? maxVal : max,
            min: min,
            interval: ((max < maxVal ? maxVal : max) - min) / 5
        }
    },
    getMMM() {
        let newList = [],
            newList1 = [];
        for (var i = 0; i < arguments.length; i++) {
            for (var j = 0; j < arguments[i].length; j++) {
                if (!newList[j]) {
                    newList[j] = 0
                }
                if (!newList1[j]) {
                    newList1[j] = 0
                }
                if (arguments[i][j] < 0) {
                    newList[j] += arguments[i][j]
                } else if (arguments[i][j] > 0) {
                    newList1[j] += arguments[i][j]
                }
            }
        }
        return {
            max: this.getMM(newList1).max,
            min: this.getMM(newList).min,
            interval: (this.getMM(newList1).max - this.getMM(newList).min) / 5
        }
    },
    /**
     * option 绘制所需的所有即option对象
     * yCoor y轴的宽度
     * hCoor y轴的高度
     * legendData legend数据
     * chartDataX 表的x轴数据
     * Coor 坐标轴表示有几个y轴
     * axisLineColor y轴颜色
     * axisLabel 字体的颜色
     * yAxisIndex y轴的个数
     * seriesData series数据
     * seriesName 图例的名字
     * barWidth 柱状图的宽度
     * seriesColor 曲线或者柱状图的颜色
     * pretendBool 是否显示百分号
     * precentIndex 第几个需要百分号
     * coorColor y轴颜色
     * isLine 是不是线
     * isPile 是不是堆叠的
     */
    echartsDrawPie(yCoor, hCoor, legendData, axisLineColor, chartDataX, Coor, yAxisIndex, seriesData, seriesName, barWidth, seriesColor, coorColor, pretendBool, isLine, isPile, precentIndex) {
        let yAxis = []
        let series = []
        if (Coor) {
            for (let i = 0; i < Coor; i++) {
                yAxis.push({
                    type: 'value',
                    axisLine: {
                        lineStyle: {
                            color: "#bdcbda"
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: "#373d41"
                        }
                    },
                    axisTick: {
                        "show": false
                    },
                    splitLine: {
                        lineStyle: { //y轴参考线颜色，如果要隐藏，可设置为  color： "none"
                            color: '#d8e3ef',
                            type: "dashed"
                        }
                    }
                })
            }
        }
        for (let k = 0; k < seriesName.length; k++) {
            if (seriesName[k] === "出租率" || seriesName[k] === "客户满意度" || seriesName[k] === "回款率" || seriesName[k] === "单平米增值收入" || seriesName[k] === "单平米物业费" || seriesName[k] === "单平米利润" || isLine === true) {
                series.push({
                    name: seriesName[k],
                    type: 'line',
                    yAxisIndex: yAxisIndex,
                    data: seriesData[k],
                    symbolSize: 0,
                    itemStyle: {
                        color: seriesColor[k]
                    },
                    areaStyle: {
                        color: 'rgba(15,113,235,.08)'
                    }
                })
            } else {
                series.push({
                    name: seriesName[k],
                    type: 'bar',
                    data: seriesData[k],
                    itemStyle: {
                        color: seriesColor[k]
                    },
                    barWidth: barWidth,
                    stack: isPile ? '搜索引擎' : '搜索引擎' + k
                })
            }
        }
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                },
                formatter: function(params) {
                    if (pretendBool) {
                        if (params[precentIndex]) {
                            var relVal = params[0].name;
                            for (var i = 0, l = params.length; i < l; i++) {
                                i === precentIndex ? relVal += '<br/>' + params[i].marker + params[i].seriesName + params[i].value + "%" : relVal += '<br/>' + params[i].marker + params[i].seriesName + params[i].value;
                            }
                            return relVal;
                        }
                    } else {
                        var relVal = params[0].name
                        for (var i = 0, l = params.length; i < l; i++) {
                            relVal += '<br/>' + params[i].marker + params[i].seriesName + params[i].value;
                        }
                        return relVal;
                    }
                }
            },
            calculable: true,
            grid: {
                y: yCoor,
                height: hCoor
            },
            legend: {
                data: legendData,
                bottom: 30
            },
            xAxis: [{
                type: 'category',
                data: chartDataX,
                axisPointer: {
                    type: 'shadow'
                },
                axisLine: {
                    lineStyle: {
                        color: '#bdcbda'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#373d41'
                    }
                }, //坐标值得具体的颜色
                axisTick: {
                    show: false
                }, //y轴刻度线
            }],
            yAxis: yAxis,
            series: series
        }
        return option
    }
}
window.func = new All();
/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function() {
    if (document.addEventListener) {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.addEventListener(event, handler, false)
            }
        }
    } else {
        return function(element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler)
            }
        }
    }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function() {
    if (document.removeEventListener) {
        return function(element, event, handler) {
            if (element && event) {
                element.removeEventListener(event, handler, false)
            }
        }
    } else {
        return function(element, event, handler) {
            if (element && event) {
                element.detachEvent('on' + event, handler)
            }
        }
    }
})()

export default func;