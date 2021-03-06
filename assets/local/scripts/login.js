var Login = function() {

    //首先获取url根目录
    var _Lurls = window.document.location.href.split('templates')[0];

    var _LurlLength = window.document.location.href.split('templates')[1].split('/').length-1;

    var _isPointersLoaded = false;
    var _isOfficesLoaded = false;
    var _isEnergyItemsLoaded = false;
    var _isMenuLoaded = false;
    var _isProceLoaded = false;
    var _indexUrl = "shouye/index.html";
    //var _indexUrl = "new-nengyuanzonglan/";

    var showAlertInfo = function(msg){
        msg = msg || "出现错误,请联系管理员";
        $('.alert-danger span').html(msg);
        $('.alert-danger').show();
    };

    var handleLogin = function() {

        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },

            messages: {
                username: {
                    required: "用户名未填写."
                },
                password: {
                    required: "密码未填写."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit
                showAlertInfo("请输入用户名和密码");
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {
                //var $loginButton = $('.btn-primary');
                var $name = $('input[name=username]'),$password = $('input[name=password]');
                var name1 = $name.val(),password1 = $password.val();
                var name = Went.utility.wCoder.wEncode(name1);
                var password = Went.utility.wCoder.wEncode(password1);
                var accParams = {"userID":name,"userPwd":password,"userSrc":"web"};
                var rememberme = $('input[name=remember]').parent().hasClass("checked");
                if(rememberme){
                    //$.cookie("rememberme","1");
                    window.localStorage.BEE_remember = "1";
                }
                if(sessionStorage.apiUrlPrefix)
                {

                    var url = sessionStorage.apiUrlPrefix + "Account/Login2";
                    $.ajax({
                        url:url,
                        type:"post",
                        data:accParams,
                        beforeSend:function(){

                            $('.pull-right').attr('disabled',true);

                            var str = '正在登录...';

                            $('.pull-right').html(str);

                        },
                        complete:function(){

                            $('.pull-right').attr('disabled',false);

                            var str = '登录<i class="m-icon-swapright m-icon-white"></i>';

                            $('.pull-right').html(str);

                        },
                        //async:true,
                        success:function(res){
                            if(res.data == "2"){
                                showAlertInfo("请输入正确的用户名");
                            }else if(res.data == "1"){
                                showAlertInfo("请输入正确的密码");
                            }else if(res.data==="98"){
                                showAlertInfo("没有登录web系统权限");
                            }
                            else {
                                //$.cookie("username", name1);
                                //$.cookie("userpassword", password);
                                if(rememberme){
                                    localStorage.BEE_username = name1;
                                    localStorage.BEE_userpassword = password;
                                }
                                sessionStorage.userName=name1;
                                sessionStorage.userpassword=password;
                                if(res.userName){
                                    sessionStorage.realUserName = res.userName;
                                    sessionStorage.userRole = '';
                                    if(res.role){
                                        sessionStorage.userRole = res.role;
                                    }
                                    if(res.departNum){
                                        sessionStorage.userDepartNum = res.departNum;

                                    }
                                    if(res.departName){
                                        sessionStorage.userDepartName = res.departName;

                                    }
                                }
                                sessionStorage.userInfo = JSON.stringify(res);
                                getPointersByUser(name1);
                                getAllOffices(name1);
                                getAllEnergyItems();
                                getMenu();
                                sessionStorage.userAuth = convertAuthTo01Str(res.userAuth);     //存储权限字符串
                                getAllProce(name1);
                            }
                        },
                        error:function(xhr,res,err){

                        }
                    });

                    //$.ajax({
                    //    url:'http://192.168.1.109/BEEWebAPI/token',
                    //    type:"post",
                    //    data: {
                    //        'grant_type': 'password',
                    //        'username':name,
                    //        'password': password
                    //    },
                    //    success: function (data, status) {
                    //
                    //        getToken = data;
                    //        //alert('获取Token成功' + "," + status + "," + data.access_token);
                    //
                    //        sessionStorage.setItem("access_token",  data.access_token);
                    //        sessionStorage.setItem("access_timeout",  data['.expires']);
                    //
                    //        if(rememberme){
                    //            localStorage.BEE_username = name1;
                    //            localStorage.BEE_userpassword = password;
                    //        }
                    //        sessionStorage.userName=name1;
                    //        getPointersByUser(name1);
                    //        getAllOffices(name1);
                    //        getAllEnergyItems();
                    //        getMenu();
                    //        sessionStorage.userAuth = convertAuthTo01Str(data.sysuserauthority
                    //        );     //存储权限字符串
                    //    },
                    //    error: function (e) {
                    //        alert('获取Token失败,' + e);
                    //    }
                    //
                    //});
                }
            }
        });

        $('.login-form input').keypress(function(e) {

            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });
    };

    //将用户权限转换成01的字符串
    var convertAuthTo01Str = function(hexstr){
        var arr = [];
        var i=0;
        for(i=0;i<800;i++){
            arr[i] = "";
        }
        var seed = [8,4,2,1];
        hexstr = hexstr.toUpperCase();
        var hexStrs = "0123456789ABCDEF";
        for(i = 0;i < hexstr.length;i++){
            var ic = hexStrs.indexOf(hexstr.charAt(i));
            for(var d = 0; d < 4; d++){
                var r = ic & seed[d];
                arr[i * 4 + d] = r == 0 ? "0" : "1";
            }
        }
        return arr.join("");
    };

    var directToIndex = function(){


        if(_isEnergyItemsLoaded && _isOfficesLoaded && _isPointersLoaded && _isMenuLoaded && _isProceLoaded){

            if(sessionStorage.indexUrl){

                _indexUrl = sessionStorage.indexUrl

            }

            if(window.screen.width > 2500 && sessionStorage.bigScreenSwitch == 1){

                //虹桥页面
                if(sessionStorage.colorStyle == 1){

                    window.location.href = 'njn-dapingzhanshi/pandectEnergy1.html';

                }else{

                    window.location.href = 'njn-dapingzhanshi/pandectEnergy.html';
                }


                return false;
            }

            //判断是否启用新框架
            if( sessionStorage.useNewIframe == 1){

                var newFrameUrl = sessionStorage.useNewIframeUrl;

                window.location.href = newFrameUrl;

                return false;
            }

            if(sessionStorage.redirectFromPage){
                window.location.href = sessionStorage.redirectFromPage;
                sessionStorage.removeItem('redirectFromPage');
            }else{

                window.location.href = _indexUrl;
            }
        }

        //if(_isEnergyItemsLoaded && _isOfficesLoaded && _isPointersLoaded && _isMenuLoaded){
        //    if(sessionStorage.redirectFromPage){
        //        window.location.href = sessionStorage.redirectFromPage;
        //        sessionStorage.removeItem('redirectFromPage');
        //    }else{
        //        window.location.href = "shouye/index.html";
        //    }
        //}

    };

    //根据用户名获取楼宇,存放到sessionstorage中
    var getPointersByUser = function(userId){

        if(userId) {
            var dataStr = {'': userId};
            $.ajax({
                    type:'post',
                    url:sessionStorage.apiUrlPrefix + 'pointer/GetAllPointersByUserId',
                    data:dataStr,
                    dataType:'json',
                    success:function(pointers){

                        var pointersArr =  JSON.stringify(pointers);
                        sessionStorage.pointers = pointersArr;
                        sessionStorage.allPointers = pointersArr;
                        getAllUnitType(pointers);

                        _isPointersLoaded = true;
                        getEnterpriseList();
                        directToIndex();

                    },
                    error:function(xhr,res,errText){

                    }
                }
            );

        }
    };

    //根据用户名获取流程图，存放到sessionstorage中
    //var get

    //根据楼宇列表获取唯一支行列表
    var getEnterpriseList = function(){

        var theArr = JSON.parse(sessionStorage.pointers);
        var enterPriseListArr = [];

        for(var i=0; i<theArr.length; i++){

            var id = theArr[i].enterpriseID;

            var isEnterpriseID  = false;

            for(var j=0; j<enterPriseListArr.length; j++){

                if(enterPriseListArr[j].enterpriseID == id){

                    isEnterpriseID = true;

                    break;
                }

            }
            if(!isEnterpriseID){
                var obj = {
                    enterpriseID : theArr[i].enterpriseID,
                    eprName: theArr[i].eprName
                };

                enterPriseListArr.push(obj)

            }

        }
        var pushArr =  JSON.stringify(enterPriseListArr);
        sessionStorage.setItem("enterPriseList", pushArr);
    };


    //获取到所有分户的数据，List结构
    var getAllOffices = function(userId){
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix + 'Office/GetAllOfficeInfoByUser',
            dataType:'json',
            data:{"PointerID":0,"userID":userId},
            success:function(offices){

                sessionStorage.offices = JSON.stringify(offices);
                sessionStorage.allOffices = JSON.stringify(offices);

                _isOfficesLoaded = true;
                directToIndex();

            }
        });
    };


    //获取到所有分项，list结构，需要时候转成对应的树状结构
    var getAllEnergyItems = function(){
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix + 'EnergyItem/GetAllEnergyItems',
            dataType:'json',
            success:function(eis){
                sessionStorage.energyItems = JSON.stringify(eis);
                _isEnergyItemsLoaded = true;
                directToIndex();
            }
        });
    };

    //获取到菜单配置文件
    var getMenu = function(){

        //var menuSrc = '../../assets/local/configs/menu.json?'+ Math.random();

        var menuSrc = _Lurls + 'assets/local/configs/menu.json?'+ Math.random();

        $.ajax({
                url:menuSrc,
                type:"get",
                success:function(str){

                    sessionStorage.menuStr = JSON.stringify(str);
                    _isMenuLoaded = true;
                    directToIndex();
                },
                error:function(xhr,text,err){

                }
            }
        );
    };

    //获取全部流程图
    var getAllProce = function(userId){

        var _isViewAllProcs = false;

        if(sessionStorage.userAuth){

            var userAuth = sessionStorage.userAuth;

            if(userAuth.charAt(52) == "1"){
                _isViewAllProcs = true;
            }
        }

        if(userId) {
            var dataStr = {'userID': userId,'isViewAllProcs':_isViewAllProcs};
            $.ajax({
                    type:'get',
                    url:sessionStorage.apiUrlPrefix + 'PR/PR_GetAllProcsByUser',
                    data:dataStr,
                    success:function(data){
                        console.log(sessionStorage.apiUrlPrefix + 'PR/PR_GetAllProcsByUser');

                        sessionStorage.allProcs = JSON.stringify(data);
                        //console.log(JSON.stringify(data))
                        _isProceLoaded = true;
                        directToIndex();
                    },
                    error:function(xhr,res,errText){

                    }
                }
            );

        }
    };

    //获取配置文件，保存到存储区域
    var initConfig = function (src) {
        //var configSrc = "../../assets/local/configs/config.json?"+ Math.random();

        var configSrc =  _Lurls + "assets/local/configs/config.json?"+ Math.random();

        //保存当前的登录页面，提供给退出登录时候使用
        var curLoginPage = window.location.href;
        curLoginPage = curLoginPage.substring(curLoginPage.lastIndexOf("/") + 1,curLoginPage.length);
        //console.log(curLoginPage);
        sessionStorage.curLoginPage = curLoginPage;
        configSrc = src || configSrc;
        if(!sessionStorage.apiUrlPrefix) {
            $.ajax({
                url: configSrc,
                type: 'get',
                async:false,
                success: function (data) {

                    //获取当前的接口地址
                    var apiUrlPrefix = data["apiUriPrefix"] || "";
                    sessionStorage.apiUrlPrefix = apiUrlPrefix;     //存储到暂存区，在本次session中使用

                    var apiUriPrefixUEditor = data["apiUriPrefixUEditor"] || "";
                    sessionStorage.apiUriPrefixUEditor = apiUriPrefixUEditor;     //存储到暂存区，在本次session中使用

                    ///当前运维的接口地址，没有配置则同上
                    var apiUrlPrefixYW = data["apiUriPrefixYW"] || apiUrlPrefix;
                    sessionStorage.apiUrlPrefixYW = apiUrlPrefixYW;     //存储到暂存区，在本次session中使用

                    //获取当前系统名
                    var systemTitle = data["systemTitle"] || "";
                    sessionStorage.systemName = systemTitle;     //存储到暂存区，在本次session中使用

                    //获取是否在systemTitle的基础上追加企业名称
                    var isShowTitleEprName = data["isShowTitleEprName"] || "";
                    sessionStorage.isShowTitleEprName = isShowTitleEprName;     //存储到暂存区，在本次session中使用

                    //报警弹框
                    var alarmAlert = data["alarmAlert"] || "0";
                    sessionStorage.alarmAlert = alarmAlert;
                    //报警声音
                    var alarmSong = data["alarmSong"] || "0";
                    sessionStorage.alarmSong = alarmSong;

                    //报警声音等级
                    var alarmSongGrade = data["alarmSongGrade"] || "0";
                    sessionStorage.alarmSongGrade = alarmSongGrade;

                    //zTree绘制楼宇列表时是否显示全部楼宇
                    var allPointerName = data["allPointerName"] || '';
                    sessionStorage.allPointerName = allPointerName;

                    //是否根据流程图动态绘制菜单
                    var changeMenuByProcs = data["changeMenuByProcs"] || '';
                    sessionStorage.changeMenuByProcs = changeMenuByProcs;

                    //登录后跳转首页配置

                    if(data["indexUrl"]){

                        _indexUrl = data["indexUrl"];

                    }

                    //工单自动刷新开关
                    var gongdanInterval = data["gongdanInterval"] || '';
                    sessionStorage.gongdanInterval = gongdanInterval;

                    //大屏幕自动刷新开关
                    var dapinInterval = data["dapinInterval"] || '';
                    sessionStorage.dapinInterval = dapinInterval;

                    //判断右上角信息走哪条分支
                    var gongdanIndustryType = data["gongdanIndustryType"] || '';
                    sessionStorage.gongdanIndustryType = gongdanIndustryType;

                    //是否多人审核出库单 入库单，0为关闭，1为不同登录ID审核
                    sessionStorage.ckAuditType = data["ckAuditType"] || '';

                    //工单图片路径
                    var imgPath = data["imgPath"] || '';
                    sessionStorage.imgPath = imgPath;

                    //首页图片路径
                    var indexImg = data["indexImg"] || '';
                    sessionStorage.indexImg = indexImg;

                    //首页图片简介
                    var indexWord = data["indexWord"] || '';
                    sessionStorage.indexWord = indexWord;

                    //初始加载的页面
                    var indexUrl = data["indexUrl"] || '';
                    sessionStorage.indexUrl = indexUrl;

                    //大屏首页人工配置数据开关
                    var bigScreenSet = data["bigScreenSet"] || '';
                    sessionStorage.bigScreenSet = bigScreenSet;

                    //登陆时是否进行自动识别大屏标识
                    var bigScreenSwitch = data["bigScreenSwitch"] || '';
                    sessionStorage.bigScreenSwitch = bigScreenSwitch;


                    //是否显示折标能效
                    var showstep = data["showstep"] || '';

                    sessionStorage.showstep = showstep;

                    //是否启用右上角单位选择
                    var showChooseUnit = data["showChooseUnit"] || '';
                    sessionStorage.showChooseUnit = showChooseUnit;

                    //语言选择
                    var misc = data["misc"] || '';
                    sessionStorage.misc = misc;

                    //是否显示折标能效（数组）
                    var steps = data["steps"] || '';
                    sessionStorage.steps = steps;

                    //右上角选择楼宇是单选还是多选
                    var selectPointerType = data["selectPointerType"] || '';
                    sessionStorage.selectPointerType = selectPointerType;

                    //车站大屏导航栏模式
                    var stationTabType = data["stationTabType"] || '';
                    sessionStorage.stationTabType = stationTabType;

                    //是否启用新框架
                    var useNewIframe = data["useNewIframe"] || '';
                    sessionStorage.useNewIframe = useNewIframe;

                    //页面颜色风格
                    var colorStyle = data["colorStyle"] || '';
                    sessionStorage.colorStyle = colorStyle;

                    //新框架页面路径
                    var useNewIframeUrl = data["useNewIframeUrl"] || '';
                    sessionStorage.useNewIframeUrl = useNewIframeUrl;

                    //车站大屏页面跳转方式
                    var  stationJumpType = data["stationJumpType"] || '';
                    sessionStorage. stationJumpType =  stationJumpType;

                    //是否启用新的流程图工具栏
                    var  newMonitorToolbal = data["newMonitorToolbal"] || '';
                    sessionStorage. newMonitorToolbal =  newMonitorToolbal;

                    //监控信息的刷新时间
                    if(data["refreshInterval"]){ sessionStorage.refreshInterval = data["refreshInterval"];}

                    //系统能耗类型配置，需要与api配置同步
                    var allEnergyType = data["allEnergyType"];

                    var showEnergyType = {};
                    showEnergyType.alltypes = [];

                    showEnergyType.comment = allEnergyType.comment;

                    //提取能耗类型配置isShowItem属性为1的保存到本地会话存储中
                    for(var i=0; i<allEnergyType.alltypes.length; i++){

                        if(allEnergyType.alltypes[i].isShowItem == 1){

                            showEnergyType.alltypes.push(allEnergyType.alltypes[i])
                        }

                    };

                    //if(allEnergyType){
                    //    sessionStorage.allEnergyType = JSON.stringify(allEnergyType);
                    //}

                    if(showEnergyType){
                        sessionStorage.allEnergyType = JSON.stringify(showEnergyType);
                    }

                    var officeEnergyType = data["officeEnergyType"];
                    if(officeEnergyType){
                        sessionStorage.officeEnergyType = JSON.stringify(officeEnergyType);
                    }

                    //首页报警信息的刷新时间
                    if(data["alarmInterval"]){ sessionStorage.alarmInterval = data["alarmInterval"];}
                    //每个页面的标题
                    if(data["pageTitle"]) {sessionStorage.pageTitle = data["pageTitle"];}

                    //系统的theme
                    if(!localStorage.themeColor || 1){ // ||1 为登陆时强制使用config.json中配置的系统风格
                        var themeColor = data["themeColor"];

                        if(themeColor){
                            localStorage.themeColor = themeColor;
                        }else{
                            localStorage.themeColor = "default";
                        }
                    }
                    handleLogin();      //获取到配置信息后，处理登录相关
                },
                error: function (xhr, res, err) {
                    showAlertInfo(err);
                }
            });
        }
        else{
            handleLogin();      //获取到配置信息后，处理登录相关
        }

    };

    //获取楼宇下全部单位类型
    var getAllUnitType = function(pointerArr){

        //存放全部单位类型
        var allUnitType = [];

        var _allUnitTypeArr = unique(pointerArr,'pointerClass');

        $(_allUnitTypeArr).each(function(i,o){

            var obj= {

                className: o.className,
                pointerClass: o.pointerClass
            };

            allUnitType.push(obj);
        });

        sessionStorage.allUnitType = JSON.stringify(allUnitType);

    };

    var particle = function(){
        var div = document.getElementById("particles-js");
        if(div && particlesJS){
            particlesJS("particles-js", {
                "particles": {
                    "number": {
                        "value": 30,
                        "density": {
                            "enable": true,
                            "value_area": 800
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        },
                        "polygon": {
                            "nb_sides": 6
                        }
                    },
                    "opacity": {
                        "value": 0.05,
                        "random": false,
                        "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                        }
                    },
                    "size": {
                        "value": 10,
                        "random": true,
                        "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 500,
                        "color": "#ffffff",
                        "opacity": 0.05,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 2,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "bounce",
                        "bounce": true,
                        "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "grab"
                        },
                        "onclick": {
                            "enable": false,
                            "mode": "push"
                        },
                        "resize": true
                    },
                    "modes": {
                        "grab": {
                            "distance": 140,
                            "line_linked": {
                                "opacity": 1
                            }
                        },
                        "bubble": {
                            "distance": 400,
                            "size": 40,
                            "duration": 2,
                            "opacity": 8,
                            "speed": 3
                        },
                        "repulse": {
                            "distance": 200,
                            "duration": 0.4
                        },
                        "push": {
                            "particles_nb": 4
                        },
                        "remove": {
                            "particles_nb": 2
                        }
                    }
                },
                "retina_detect": true
            });
        }
    };

    //数组去重
    function unique(a,attr) {

        var res = [];

        for (var i = 0, len = a.length; i < len; i++) {
            var item = a[i];
            for (var j = 0, jLen = res.length; j < jLen; j++) {
                //console.log(i + '' + res);
                if (res[j][attr] === item[attr]){
                    //console.log(333);
                    break;
                }

            }
            if (j === jLen){

                res.push(item);

            }

        }

        return res;
    };

    /*
    清除暂存信息，cookie sessionStorage
     */
    var clearLocalInfo = function(){
        //保留的部分sessionStorage
        var redirectFromPage = sessionStorage.redirectFromPage;
        sessionStorage.clear();
        //赋值保留的sessionStorage
        if(redirectFromPage){
            sessionStorage.redirectFromPage = redirectFromPage;
        }
        var remember = localStorage.BEE_remember;
        if(remember && remember=="1"){
            if(localStorage.BEE_username){
                $('input[name=username]').val(localStorage.BEE_username);
            }
            if(localStorage.BEE_userpassword){
                var pwd = localStorage.BEE_userpassword;
                pwd = Went.utility.wCoder.wDecode(pwd);
                $('input[name=password]').val(pwd);
            }
            $("input[name=remember]").parent().addClass("checked");
        }
        //$.removeCookie("username");
        //$.removeCookie("userpassword");
        //$.removeCookie("rememberme");

    };

    return {
        //main function to initiate the module
        init: function() {
            clearLocalInfo();
            initConfig();
            particle();
            //handleLogin();
        }

    };

}();