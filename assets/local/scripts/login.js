var Login = function() {

    var _isPointersLoaded = false;
    var _isOfficesLoaded = false;
    var _isEnergyItemsLoaded = false;

    var showAlertInfo = function(msg){
        msg = msg || "出现错误,请联系管理员";
        $('.alert-danger span').html(msg);
        $('.alert-danger').show();
    }

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

                var $loginButton = $('.btn-primary');
                var $name = $('input[name=username]'),$password = $('input[name=password]');
                var name1 = $name.val(),password1 = $password.val();
                var name = Went.utility.wCoder.wEncode(name1);
                var password = Went.utility.wCoder.wEncode(password1);
                var accParams = {"userID":name,"userPwd":password};
                if(sessionStorage.apiUrlPrefix)
                {
                    var url = sessionStorage.apiUrlPrefix + "Account/Login";
                    $.ajax({
                        url:url,
                        type:"post",
                        data:accParams,
                        //async:true,
                        success:function(data){
                            //form.submit(); // form validation success, call ajax form submit
                            if(data === "2")
                            {
                                showAlertInfo("请输入正确的用户名");
                            }else if(data === "1")
                            {
                                showAlertInfo("请输入正确的密码");
                            }else {
                                $.cookie("username", name1);
                                $.cookie("password", password);
                                sessionStorage.username=name1;
                                getPointersByUser(name1);
                                getAllOffices();
                                getAllEnergyItems();
                            }
                        },
                        error:function(xhr,res,err){

                        }
                    });
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
    }


    var directToIndex = function(){
        if(_isEnergyItemsLoaded && _isOfficesLoaded && _isPointersLoaded){
            window.location.href = "index.html";
        }
    }


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
                        sessionStorage.pointers = JSON.stringify(pointers);
                        _isPointersLoaded = true;
                        directToIndex();
                    },
                    error:function(xhr,res,errText){

                    }
                }
            );

        }
    };

    //获取到所有分户的数据，List结构
    var getAllOffices = function(){
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix + 'Office/GetAllLeafOffice',
            dataType:'json',
            success:function(offices){
                sessionStorage.offices = JSON.stringify(offices);
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

    //获取配置文件，保存到存储区域
    var initConfig = function (src) {
        var configSrc = "../../assets/local/configs/config.json";
        configSrc = src || configSrc;
        if(!sessionStorage.apiUrlPrefix) {
            $.ajax({
                url: configSrc,
                type: 'get',
                async:false,
                success: function (data) {
                    var apiUrlPrefix = data["apiUriPrefix"] || "";
                    sessionStorage.apiUrlPrefix = apiUrlPrefix;     //存储到暂存区，在本次session中使用
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

        //标题本地存储
        if(!sessionStorage.systemName){
            $.ajax({
                url: configSrc,
                type: 'get',
                async:false,
                success: function (data) {
                    var systemTitle = data["systemTitle"] || "";
                    sessionStorage.systemName = systemTitle;     //存储到暂存区，在本次session中使用
                    handleLogin();      //获取到配置信息后，处理登录相关
                },
                error: function (xhr, res, err) {
                    showAlertInfo(err);
                }
            })
        }
    }


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
    }

    /*
    清除暂存信息，cookie sessionStorage
     */
    var clearLocalInfo = function(){
        sessionStorage.clear();
        $.removeCookie("username");
        $.removeCookie("userpassword");
    }

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