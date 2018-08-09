# tcl-staff 0.1

> tcl内购wap1.0 服务端渲染方案
# 代码地址
http://10.120.54.112/tclshop/staff-wap-vue.git

## Build Setup
##配置


``` bash
## 配置nginx
把项目里的nginx放到nginx的conf文件夹
# 首次拉代码执行
$ npm i --registry=https://registry.npm.taobao.org


# 开发环境,代码调试 默认端口:3000
$ npm run dev
$ gulp # 部分调试使用gulp来构建css

# 编译代码
$ npm run build
编译完成会生成 .nuxt 目录

# 用户登录注册部分
用户登录注册部分 源代码在 _nginx 目录, 考虑到之后接入统一用户中心. 所以此部分未纳入新的环境
此部分开发 进入_nignx 目录执行 gulp dev
此部分编译 进入_nignx 目录执行 gulp publish

编译完成会生存 .nginx  目录

# 注意事项

1.新的返利网的接入 .
  1)  ./plugins/http.js  http.fanli =()=>{  .....}
  2) 调用 ./layouts/default.js   mounted() { ... http.fanli() ...  }  

2.统一用户中心之后的接入 或调试
  1) ./plugins/utils.js    osslogin 方法 ,  可在 OSS 云平台 和 OSS 统一用户中心之间切换.
  2) 调用 ./layouts/default.js    beforeMount() {... this.$utils.osslogin() ....}

3.推客.
  1)./pages/tuike

4. 自助检测服务
  1)./pages/service


# 代码打包发布

zip 包(tclshop-wap.zip)

最终包含3个文件夹   .nuxt + .nginx + static  
和2 个文件  go.config.js + package.json

.nuxt 为动态构建代码
.ningx 为登录注册,找回密码 等代码 ,nginx 已经做了代理,无需改动
static 为静态资源目录 (css,img,fonts)

go.config.js 为项目服务端启动文件
package.js 为依赖环境配置文件

#服务端启动
$ npm run go

#nginx 相关配置

upstream sync{
    server 10.120.54.47; #此处改为相关配置
}
server{
    listen 80;
    server_name tclshopwap3.0-seo;
    location / {
        proxy_pass http://$server_addr:3000;
        proxy_redirect  off;
        proxy_set_header        $Host  sync;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_send_timeout      300;
        proxy_read_timeout      300;                    
    }  
    location ^~ /rest/ {
        proxy_pass http://sync/rest/;
        proxy_redirect  off;
        proxy_set_header        $Host  sync;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_send_timeout      300;
        proxy_read_timeout      300;
    }
    location ^~ /user/ {
        root   /home/kuyu/www/tclshop-wap3.0/.nginx; #此处改为相关路径
    }
    location ^~ /res/ {
        root   /home/kuyu/www/tclshop-wap3.0/.nginx;  #此处改为相关路径
    }
}


http.js里有设置服务端访问的地址，换环境时要记得改
