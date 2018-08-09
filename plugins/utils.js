/**
 * create BY CHUCHUR
 * 2017年2月22日 14:09:31
 */
import http from './http'

let utils = {
    getURLParam(url, name) {　　　　
        var arrObj = url.split("?");　　　　
        if (arrObj.length > 1) {　　　　　　
            var arrPara = arrObj[1].split("&");　　　　　　
            var arr;　　　　　　
            for (var i = 0; i < arrPara.length; i++) {　　　　　　　　
                arr = arrPara[i].split("=");　　　　　　　　
                if (arr != null && arr[0] == name) {
                    return arr[1];
                }
            }　　　　　　
            return "";
        }　　　　
        else {
            return "";
        }
    },
    iswx: () => {
        if (typeof window === 'undefined') return
        var msg = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) || []
        return msg === 'micromessenger' || msg[0] === 'micromessenger'
    },
    parseQuery: (pkey) => {
        var search = window.location.search
        var args = search.substring(1).split('&')
        var argsParsed = {}
        var i, arg, kvp, key, value
        for (i = 0; i < args.length; i++) {
            arg = args[i]
            if (arg.indexOf('=') === -1) {
                argsParsed[decodeURIComponent(arg).replace(/(^\s*)|(\s*$)/g, '')] = true
            } else {
                kvp = arg.split('=')
                key = decodeURIComponent(kvp[0]).replace(/(^\s*)|(\s*$)/g, '')
                value = decodeURIComponent(kvp[1]).replace(/(^\s*)|(\s*$)/g, '')
                argsParsed[key] = value
            }
        }
        if (pkey) {
            return argsParsed[pkey]
        }
        return argsParsed
    },
    delCookie: (name) => {
        // if (window.localStorage && window.localStorage.removeItem) {
        //     window.localStorage.removeItem(name)
        // }
        let old = utils.getCookie(name);
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        old && (document.cookie = name + '=' + old + ';expires=' + exp.toGMTString() + ';path=/;')
    },
    getCookie: (name) => {
        if (typeof window === 'undefined') return ''
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        return (arr = document.cookie.match(reg)) ? unescape(arr[2]) : null
    },
    getReqCookie(context, name) {
        var Cookies = {}
        let cookie = context && context.req && context.req.headers && context.req.headers.cookie || ''
        cookie !== null && cookie.split(';').forEach(function(Cookie) {
            var parts = Cookie.split('=');
            Cookies[parts[0].trim()] = (parts[1] || '').trim();
        });
        return Cookies[name] || ''
    },
    setCookie: (name, value, days, domain) => {
        if (typeof window === 'undefined') return
            // if (window.localStorage && window.localStorage.setItem) {
            //   window.localStorage.setItem(name, value)
            // } else {

        var cookie = name + '=' + escape(value) + ';path=/;'
        if (days != null) {
            var Days, exp = new Date()
            if (typeof(days) === 'object') {
                Days = days
            } else {
                days = (days === undefined) ? 30 : days //  此 cookie 将被保存 30 天
                Days = exp.getTime() + days * 24 * 60 * 60 * 1000
            }
            exp.setTime(Days)
            cookie += 'expires=' + exp.toGMTString() + ';'
        }
        document.cookie = cookie
            // }
    },
    createTimestamp: () => { // 取时间撮
        //  201508061018417065
        var dt = new Date()
        var y = dt.getFullYear()
        var M = dt.getMonth() + 1
        var d = dt.getDate()
        var h = dt.getHours()
        var m = dt.getMinutes()
        var sec = dt.getSeconds()
        var minsec = dt.getMilliseconds()
        var str = y + ''
        M = M < 10 ? '0' + M : M
        d = d < 10 ? '0' + d : d
        h = h < 10 ? '0' + h : h
        m = m < 10 ? '0' + m : m
        sec = sec < 10 ? '0' + sec : sec
        minsec = minsec < 1000 ? '0' + minsec : minsec
        str += M + d + h + m + sec + minsec
        return str
    },
    uuid: () => { //    生成uuid 并且寸cookie
        var uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            // this.setCookie('temp_id', uuid, 360)
        return uuid
    },
    guid: () => {
        const s4 = () => {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }

        return (s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4())
    },
    loadScript: (url) => {
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = url
        document.head.appendChild(script)
    },
    formatDate: (datespan, isfull, lan) => { // 时间格式化
        if (!datespan) return new Date()
        if (typeof(datespan) === 'string') datespan = Number(datespan.replace(/-/g, '/'))
        let date = new Date(datespan)
        let Y = date.getFullYear()
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
        let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
        let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())
        return lan ? Y + '年' + M + '月' + D + '日' + h + m + s : (isfull ? Y + '-' + M + '-' + D + ' ' + h + m + s : Y + '-' + M + '-' + D)
    },
    urlTojson: (url) => { //地址传参转数组
        if (!url || url.length == 0) return '';
        url = decodeURIComponent(url);
        var obj = {};
        obj.url = url.split('?')[0];
        var args = url.split('?')[1];
        if (args && args.length > 0) {
            var arg = args.split('&');
            if (arg && arg.length >= 1) {
                arg.map(function(m) {
                    var ar = m.split('=');
                    if (ar && ar.length > 1) {
                        obj[ar[0]] = ar[1];
                    };
                });
            };
        };
        return obj;
    },
    checkUser: (v, t) => {
        var emailReg = /^[_\.0-9a-z-]+@([0-9a-z][0-9a-z-]+\.){1,4}[a-z]{2,3}$/,
            mobileReg = /(^1[3|4|5|6|7|8|9][0-9]{9}$)/,
            telphone = /^0\d{2,3}-?\d{7,8}$/,
            zhNameReg = /^[\u4e00-\u9fa5]{2,20}$/,
            enNameReg = /^[a-zA-Z\/]{2,20}$/,
            ext = false;
        t == 1 && (ext = mobileReg.test(v));
        t == 11 && (ext = mobileReg.test(v) || telphone.test(v));
        t == 2 && (ext = emailReg.test(v));
        t == 3 && (ext = zhNameReg.test(v) || enNameReg.test(v));

        !t && (ext = (mobileReg.test(v) || emailReg.test(v)));
        return ext;
    },
    osslogin: () => {
        /*var obj = http.isUniFunc()
        if(!obj.isUni){
          // OSS 云平台
          let host = window.location.host == 'm.tcl.com' ? 'https://login.tclclouds.com' : 'https://logintest.tclclouds.com'
          utils.loadScript(host + '/account/verifyUsernameToken?clientId=14046695&funcName=osslogin')
        }else{
          // OSS 统一用户中心
          let host = window.location.host == 'm.tcl.com' ? 'http://m.user.tcl.com' : 'http://m.testuser.tclo2o.cn'
          utils.loadScript(host + '/sso/account/verifyUsernameToken?client_id=14046695&funcName=osslogin')
        }*/
    },
    install: (Vue, option) => {
        Vue.prototype.$utils = utils
    },
    createId: () => {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    base64encode: (str) => {
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    }
}

export default utils