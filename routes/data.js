var express = require('express');
var router = express.Router();
var fs = require('fs');
var PATH = './public/data/';

//读取数据模块
//data/read?type=it
//data/read?type=it.json
router.get('/read', function(req, res, next) {
    var type = req.param('type') || '';
    fs.readFile(PATH + type + '.json', function (err, data) {
        if(err){
            return res.send({
                status:0,
                info:'读取文件出现异常'
            });
        }
        var COUNT = 50;
        var obj = [];
        try{
            obj = JSON.parse(data.toString());
        }catch(e){
            obj = [];
        }
        if(obj.length > COUNT){
            obj = obj.slice(0, COUNT);
        }
        return res.send({
            status:1,
            data:obj
        });
    });
});
//数据存储模块
router.post('/write', function (req, res, next) {
    var type = req.param('type') || '';
    var title = req.param('title') || '';
    var url = req.param('url') || '';
    var img = req.param('img') || '';
    if(!type || !title || !url || !img){
        return res.send({
            status:0,
            info:'提交字段不全'
        });
    }
    //1，读取信息
    var filePath = PATH + type + '.json';
    fs.readFile(filePath, function (err, data) {
        if(err){
            return res.send({
                status:0,
                info:'读取数据失败'
            });
        }
        var arr = JSON.parse(data.toString());
        var obj = {
            title: title,
            url: url,
            img: img,
            id: guidGenerate(),
            time: new Date()
        }
        arr.splice(0,0,obj);
        var newData = JSON.stringify(arr);
        fs.writeFile(filePath, newData, function (err) {
            if(err){
                return res.send({
                    status:0,
                    info:'写入数据失败'
                });
            }
            return res.send({
                status:1,
                data:obj
            });
        });
        
    });
    //
});
//阅读模块配置接口
router.post('/write_config',function (req, res, next) {
    //TODO:后期进行提交数据的验证
    //防xss攻击 xss
    // npm install xss
    // require('xss')
    // var str = xss(name);
    var data = req.body.data;
    //TODO:try catch
    var obj = JSON.parse(data);
    var newData = JSON.stringify(obj);
    fs.writeFile(PATH + 'config.json', function (err) {
        if(err){
            return res.send({
                status:0,
                info:'写入数据失败'
            });
        }
        return res.send({
            status:1,
            data:obj
        });
    });
});

//登陆校验
router.post('/login', function (req, res, next) {
    //用户名，密码，验证码
    var username = req.body.username;
    var password = req.body.password;
    //TODO 对密码验证码进行校验
    //XSS攻击 判空
    if(username === 'admin' && password === '123456'){
        req.session.user = {
            username: username
        };
        return res.send({
            status:1
        });
    }
    return res.send({
        status:1,
        info:'登陆失败'
    });

});

//生成guid
function guidGenerate() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
}

module.exports = router;
