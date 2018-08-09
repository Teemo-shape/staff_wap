// 配置API接口地址
/**
 * 注意 新的版本已经去掉了， 跳转500和timeout 判断, 只有404页面，
 * 默认超时为10秒，之后也将不错跳转。
 */

// axios
import axios from 'axios'
import utils from './utils'
import Router from 'vue-router'

// axios.defaults.baseURL = 'http://localhost:8088/rest' //本地
axios.defaults.baseURL = 'http://10.120.54.47/rest' //测式
    //axios.defaults.baseURL = 'http://m.tcl.com//rest'//正式
    // axios.defaults.timeout = 1
axios.defaults.timeout = 10000

let g = 'application/json; charset=utf-8;'
let p = 'application/x-www-form-urlencoded; charset=UTF-8;'
let f = 'multipart/form-data'

let http = {}


//统一用户中心
http.isUniFunc = () => {
    var isUni = false //统一用户中心开关
    var host = '';
    if (isUni) {
        host = document.domain == 'm.tcl.com' ? 'http://m.user.tcl.com' : 'http://m.testuser.tclo2o.cn'
    }
    return {
        isUni: isUni,
        host: host
    }
}


// osslogin
let callbacks = []
let ossResponsed = false

const callback = () => {
    let _call = callbacks[0]
    _call && (_call(), callbacks.shift())
    callbacks.length > 0 && callback()
}
const osslogin = (m) => {
    // console.log(m)
    var obj = http.isUniFunc()
    if (m && m.status == 1) {
        axios.get('/ssologin/check', { params: { code: m.code } }).then((res) => {
            // if(!obj.isUni){    //不是统一用户中心执行之前代码
            ossResponsed = true;
            let { data } = res;
            if (data && data.code == 0) {
                utils.setCookie('wap_staff_token', data.token)
            };
            callback()
                // }else{
                //   let { data } = res;
                //   if (data.code == 0) {
                //     //如果成功清除计数
                //     window.localStorage.getItem('checkNum') && window.localStorage.removeItem('checkNum')
                //     utils.setCookie('wap_staff_token', data.token)
                //     ossResponsed = true;
                //     callback();
                //   }else{
                //     //设置一个计数  如果失败的话页面只用刷新3次  为了解决安卓uc浏览器第一次调check失败
                //     let checkNum = window.localStorage.getItem('checkNum')?JSON.parse(window.localStorage.getItem('checkNum')):0;
                //     checkNum++;
                //     window.localStorage.setItem('checkNum',JSON.stringify(checkNum))
                //     if(checkNum>3){
                //       return false;
                //     }
                //     window.location.reload()
                //   }
                // }
        }).catch((error) => {
            ossResponsed = true;
            callback()
        })
    } else {
        obj.isUni && utils.delCookie('wap_staff_token');
        ossResponsed = true;
        callback()
    }
};
(typeof window !== 'undefined') && (window.osslogin = osslogin)


let getHeaders = () => {
    return {
        'Content-Type': '',
        'ihome-timestamp': utils.createTimestamp(),
        'ihome-token': utils.getReqCookie(http.context, 'wap_staff_token') || utils.getCookie('wap_staff_token') || http.token || '',
        'uid': utils.createTimestamp() + '-' + utils.uuid(),
        'ihome-version': '0.0.1',
        'appversion': '0.0.1',

        // 'platform' : 'platform_tcl_staff'

        'platform': 'platform_tcl_staff',

    }
}

const getType = (obj) => { return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase() }

const base = (method, url, params, callback) => {
    let call = async() => {
        let _params = params;
        let headers = getHeaders();
        //有些接口不需要platform头，所以添加一个参数即可。
        if (_params && _params.noStaff != null) {
            if (_params.noStaff == true || ((typeof _params == 'string') && (JSON.parse(_params).noStaff == true))) {
                headers.platform = ''
            }
        }

        (params && params.type && params.type === 'string') && (delete params.type, params = JSON.stringify(params));
        headers['Content-Type'] = (getType(params) === 'formdata') ? f : ((typeof(params) === 'string' || getType(params) === 'object') ? g : p);
        if (typeof(window) !== 'undefined' && method === 'post' && typeof(params) === 'object') {
            let ps = new FormData();
        	Object.keys(params).map(x => {
        		if(params[x]== null||params[x]==undefined){
        			return ps.append(x, "")
        		}else{
        			return ps.append(x, params[x])
        		}
        		
        	});
            params = ps;
        }
        let config = { method: method, url: url, headers: headers };
        
        method === 'post' ? (config['data'] = params) : (config['params'] = params);
        
        let { data } = await axios(config).catch((error) => {
        	
            if (error && typeof window !== 'undefined') {
                console.log('时间:' + new Date() + ',接口异常: 错误代码:' + error + ',接口地址:' + url)
                    // window.location.href = '/error?code=9999&from=' + encodeURIComponent(window.location.href)
            }
        }) || { data: { code: 9999 } };
        if ((data && parseInt(data.code) === 9999 || data.code == 502) && typeof window !== 'undefined') {
            console.log("接口异常: 错误代码:" + data.code + ',接口地址:' + url + ',transId:' + data.transId)
                // window.location.href = '/error?code=' + data.code + '&from=' + encodeURIComponent(window.location.href);
            return false;
        }
        if (data && (parseInt(data.code) === 403 || parseInt(data.code) === -10)) {
            utils.delCookie('wap_staff_token');
            let obj = http.isUniFunc()

            typeof window !== 'undefined' && !obj.isUni && (_params && _params.auth !== 1) && (window.location.href = `/account/login?backurl=${encodeURIComponent(window.location.href)}`);
            // typeof window !== 'undefined' && obj.isUni && (_params && _params.auth !== 1) && (window.location.href = obj.host + '/proxy/login?from='+encodeURIComponent(window.location.href));
            return false;
        }
        callback && callback(data)
    }
    call()
        // ossResponsed ? call() : callbacks.push(call)
}

http.get = (url, params, callback) => { base('get', url, params, callback) }

http.post = (url, params, callback) => { base('post', url, params, callback) }

http.upload = (url, params, callback) => {
    if (!params || !params.notRest) {
        url = '/rest' + url
    }
    let headers = getHeaders();
    headers['Content-Type'] = 'multipart/form-data';
    if (params.uploadID) {
        var data = new FormData();
        var obj = document.getElementById(params.uploadID),
            file = obj.files[0];
        // 验证文件格式
        // if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'video/mp4'&& file.type !== 'video/quickTime' && file.type !== 'video/3gpp'&& file.type !== '') { alert('目前只支持上传png，jpg格式图片,mp4,3gp格式视频'); return false };
        // 验证文件大小
        if (file.type.indexOf('image') > -1 && params.maximgsize) {
            if (file.size > 1024 * 1024 * params.maximgsize) {
                alert('上传图片不能大于' + params.maximgsize + 'M');
                obj.value = '';
                return false
            }
        };
        if (file.type.indexOf('video') > -1 && params.maxvideosize) {
            if (file.size > 1024 * 1024 * params.maxvideosize) {
                alert('上传视频不能大于' + params.maxvideosize + 'M');
                obj.value = '';
                return false
            }
        };
        data.append(params.uploadID, file);
        axios.post(url, data, { headers }).then(res => {
            obj.value = '';
            let { data } = res;
            if (data.code == 9999) { console.log(data, url) };
            callback && callback(data);
        })
    }
}
http.asyncPost = async(url, params) => {
    let headers = getHeaders();
    let { data } = await axios({ method: 'post', url: url, params: params, headers: headers }).catch((error) => {
        console.log('时间:' + new Date() + ',接口异常: 错误代码:' + error + ',接口地址:' + url)
            // if (error && http.context) { http.context.redirect('/error', { code: 9999, from: http.context.route.path }) }
    }) || { data: { code: 9999 } };
    if ((data && data.code == 9999 || data.code == 502) && http.context) {
        console.log('时间:' + new Date() + ',接口异常: 错误代码:' + data.code + ',接口地址:' + url + ',transId:' + data.transId)
            // http.context.redirect('/error', { code: data.code, from: http.context.route.path })
    }
    return data
}

http.asyncGet = async(url, params) => {
        let headers = getHeaders();
        let { data } = await axios({ method: 'get', url: url, params: params, headers: headers }).catch((error) => {
            console.log('时间:' + new Date() + ',接口异常: 错误代码:' + error + ',接口地址:' + url)
                // if (error && http.context) { http.context.redirect('/error', { code: 9999, from: http.context.route.path }) }
        }) || { data: { code: 9999 } };
        // console.log(url,'++++++++++')
        if ((data && data.code == 9999 || data.code == 502) && http.context) {
            console.log('时间:' + new Date() + ',接口异常: 错误代码:' + data.code + ',接口地址:' + url + ',transId:' + data.transId)
                // http.context.redirect('/error', { code: data.code, from: http.context.route.path })
        }
        if (data && (parseInt(data.code) === 403 || parseInt(data.code) === -10)) {
            // http.context.redirect('/account/login', { code: data.code, from: http.context.route.path })
        }
        return data
    }
    // 返利网
http.fanli = () => {
    if (!http.isUniFunc().isUni) {
        return false;
    }
    http.get('/tclcustomer/userInfo', { auth: 1 }, res => {
        // if (res && res.code == 0 && res.data.userType == 'FANLI') {
        //   let fanli = JSON.parse(res.data.fanliInfo)
        //   fanli.uname = fanli.username;
        //   delete fanli.username;
        //
        //   fanli.platform = fanli.platform || 1;
        //   fanli.s_id = fanli.s_id || 1846;
        //   utils.setCookie('fanliCookie', JSON.stringify(fanli));
        // }
    })
}

http.install = (Vue, options) => {
    Vue.prototype.$http = http
}

// 返回在vue模板中的调用接口
export default http