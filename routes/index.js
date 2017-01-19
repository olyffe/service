var express = require('express');
var router = express.Router();
var fs = require('fs');
var PATH = './public/data/';

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
    if(!req.session.user){
        return res.render('login',{});
    }
  return res.render('index',{});
});

router.get('/edit', function (req, res, next) {
    if(!req.session.user){
        return res.render('login',{})
    }
    var type = req.query.type;
    if(type){
        var obj = {};
        switch(type){
            case 'sanwen':
                obj = {};
                break;
            case 'it':
                obj = {};
                break;
            case 'manager':
                obj = {};
                break;
            case 'cookies':
                obj = {};
                break;
            default:
                return res.send({
                    status:0,
                    info:'参数错误'
                });
            break;
        }
        //TODO
    }
})
module.exports = router;
