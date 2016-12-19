/**
 * Created by went on 2016/5/5.
 */

var BEE = (function(){

    var _assetsPath = '../../assets/';
    var _localImgPath = 'local/img/';
    var _localCssPath = 'local/css/';
    var _localConfigsPath = 'local/configs/';

    String.prototype.endWith = function(s){
        var d = this.length - s.length;
        return (d>=0 && this.lastIndexOf(s) == d);
    }

    String.prototype.startWith = function(s){
        return this.indexOf(s) == 0;
    }

    //从json配置中获取menu,并且配置menu
    var getMenu = function(srcUri){
        //var src = "../../assets/local/configs/menu.json";
        if(sessionStorage.menuStr){
            var str = sessionStorage.menuStr;
            var $sidebar = $(".page-sidebar-menu");
            JSON.parse(str);
            getHTMLFromMenu(JSON.parse(str), $sidebar);
            setPageTitle();
        }else{
            var src = _assetsPath + _localConfigsPath + "menu.json";
            src = srcUri || src;
            $.ajax({
                    url:src,
                    type:"get",
                    success:function(str){
                        var $sidebar = $(".page-sidebar-menu");
                        if($sidebar) {
                            $(".page-sidebar-menu li").remove('li[class!="sidebar-toggler-wrapper"]');
                            sessionStorage.menuStr = JSON.stringify(str);
                            getHTMLFromMenu(str, $sidebar);
                            setPageTitle();
                        }
                    },
                    error:function(xhr,text,err){
                    }
                }
            );
        }

    }

    //将文本解析为菜单，和插入菜单的父级元素
    var getHTMLFromMenu = function(menu,$src){
        var li,$li,ul,$ul;
        for(var p in menu){
            var curType = menu[p]["type"];
            if(curType){console.log(curType);
                if(curType=="0"){
                    //具体菜单操作
                    if( menu[p]["uri"]){
                        li = '<li><a href="' + menu[p]["uri"] +'">';
                        if(window.location.href.endWith(menu[p]["uri"]))
                        {
                            li = '<li class="active"><a href="' + menu[p]["uri"] +'">';
                            sessionStorage.menuArg = menu[p]["arg"];        //存储各个菜单的menuArg参数
                            sessionStorage.menuSecond = menu[p]["content"];
                        }
                        if(menu[p]["iconclass"]){
                            li += '<i class="' + menu[p]["iconclass"] +  '"></i>';
                        }
                    }else{
                        li = '<li><a href="javascript:void(0);">';
                    }

                    li += menu[p]["content"] + '</a></li>';
                    $li = $(li);
                    $src.append($li);
                }
                else if(curType=="1"){
                    //子菜单操作
                    //一级菜单不跳转

                    li = '<li><a href="javascript:void(0);">';
                    var isSelected = false;
                    if(menu[p]["submenu"]) {
                        for (var sm in menu[p]["submenu"]) {
                            if(menu[p]["submenu"][sm]["uri"]){
                                if (window.location.href.endWith(menu[p]["submenu"][sm]["uri"])) {
                                    li = '<li class="active open"><a href="javascript:void(0);">';
                                    isSelected = true;
                                    sessionStorage.menuFirst = menu[p]["content"];
                                    break;
                                }
                            }
                        }
                    }
                    if(menu[p]["iconclass"]){
                        li += '<i class="' + menu[p]["iconclass"] +'"></i>';
                    }else {
                        li += '<i></i>';
                    }
                    li += '<span class="title">' + menu[p]["content"] + '</span>';
                    if(isSelected){
                        li += '<span class="selected"></span>';
                    }
                    if(!menu[p]["uri"]){
                        if(isSelected){
                            li += '<span class="arrow open"></span>';
                        }else{
                            li += '<span class="arrow "></span>';
                        }
                    }
                    li += '</a></li>';
                    $li = $(li);
                    ul = '<ul class="sub-menu"></ul>';
                    $ul = $(ul);
                    $li.append($ul);
                    $src.append($li);
                    //下级菜单
                    if(menu[p]["submenu"]){
                        getHTMLFromMenu(menu[p]["submenu"],$ul);
                    }
                }
                else if(curType == "2"){
                    //二级菜单内的非菜单显示，一般用做区段的标题
                    li = '<li style="border-bottom:1px;border-color:white;"><span style="color:white;margin-left:45px;font-size:15px;font-weight: bold;">';
                    if(menu[p]["iconclass"]){
                        li += '<i class="' + menu[p]["iconclass"] +  '"></i>';
                    }
                    li += "-- " + menu[p]["content"] + ' --</span></li>';
                    $li = $(li);
                    $src.append($li);
                }
            }
        }
    };

    //设置header中信息
    var setHeaderInfo = function(){
        if(sessionStorage.pageTitle) { document.title = sessionStorage.pageTitle; }
        var username = sessionStorage.userName || "未登录";
        $('.username').html(username);
        var systemName = sessionStorage.systemName;
        $('.totalTitle').html(systemName);
        var curLoginPage = sessionStorage.curLoginPage || "login_3.html";
        var $logout = $('.logout-page');
        $logout.attr('href',curLoginPage);
    }

    //设置页面的标题部分
    var setPageTitle = function(){
        var menuSecond = sessionStorage.menuSecond,menuFirst = sessionStorage.menuFirst;
        if(menuSecond && menuFirst){
            var $pageTitle = $(".page-title");
            if($pageTitle.length>0){
                $pageTitle.html(menuSecond);
            }
            var $pageBreadcrumb = $(".page-breadcrumb");
            if($pageBreadcrumb.length>0){       //设置菜单的一二级显示
                $pageBreadcrumb.append('<li><a href="javascript:void(0);">' + menuFirst + '</a><i class="fa fa-angle-right"></i></li>')
                $pageBreadcrumb.append('<li><a href="javascript:void(0);">' + menuSecond + '</a></li>')
            }
        }
    }


    //设置theme
    var setTheme = function(){
        /*
         配置页面配置当前的theme，BEE.js初始化页面时候载入当前theme，如果localStorage中存有当前的theme，则获取
         设置theme按钮的选中，存储当前的theme到localStorage中，
         */
        var themeColor = localStorage.themeColor || "default";
        //$('#style_color').attr("href", Layout.getLayoutCssPath() + 'themes/' + color_ + ".css");
        var $colorCssLink = $("#style_color");
        if($colorCssLink.length == 0){       //如果当前没有style_color的css引用
            var link = document.createElement("link");
            link.rel = "stylesheet";
            link.id = "style_color";
            document.head.appendChild(link);
            $colorCssLink  = $(link);
        }
        $colorCssLink.attr("href", _assetsPath + 'admin/layout/css/themes/' + themeColor + ".css");

        var $panel = $('.theme-panel');
        var $themes = $('.theme-colors > ul > li', $panel);      //获取所有的theme选择器
        var $thisTheme = $(".theme-colors > ul > li[data-style=" + themeColor + "]",$panel);
        $themes.removeClass("current");
        $thisTheme.addClass("current");
    }


    //设置页面右上角报警信息
    //保存当前数据的时间和数据到sessionStorage中，每次打开时候比对时间，如果时间超过数据时间+刷新时间，则重新载入
    var getAlarmInfo = function(){
        if(sessionStorage.alaDataLength){       //如果有数据，进入页面就载入
            setPageTopRightAlarmData(sessionStorage.alaDataLength);
        }
        if(!sessionStorage.pointers){ return;}      //当前没有楼宇
        if(sessionStorage.alaInsDataTime && sessionStorage.alarmInterval && sessionStorage.alarmInterval!='0'){      //如果上次有数据时间
            var lastTime = (new Date(sessionStorage.alaInsDataTime)).getTime();
            var nowTime = (new Date()).getTime();
            var refreshItv = parseInt(sessionStorage.alarmInterval) * 60 * 1000;        //获取到数据刷新间隔的毫秒数
            if(nowTime - lastTime < refreshItv && refreshItv>0){
                setTimeout(getAlarmInfo,refreshItv);        //下次刷新数据使用
                return;
            }
        }
        if(document.getElementById('header_notification_bar') == null){ return;}        //当前页面没有显示报警数据的位置
        var pointers = JSON.parse(sessionStorage.pointers);
        var ptIds = [];
        for(var i= 0,len=pointers.length;i<len;i++){
            ptIds.push(pointers[i].pointerID);
        }
        var now = new Date();
        var year = now.getFullYear(),month = now.getMonth(),day = now.getDate();
        var st = year + "-" + month + "-" + day + " 00:00:00";
        var et = year + "-" + month + "-" + day + " " + now.getHours() + ":" + now.getMinutes() + ":00";
         var prmData = {
             "st" : st,
             "et" : et,
             "excTypeInnerId":"",
             "energyType":"",
             "pointerIds":ptIds
        };
        $.ajax({
            type:'post',
            url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcData',
            data:prmData,
            dataType:'json',
            success:function(data){
                if(data){       //设置右上角的报警数据显示情况
                    setPageTopRightAlarmData(data.length);
                }else{
                    setPageTopRightAlarmData(0);
                }
                var now = new Date();
                sessionStorage.alaInsDataTime = now.toString();      //存储当前的数据载入时间
                if(sessionStorage.alarmInterval && sessionStorage.alarmInterval!='0'){
                    var refreshItv = parseInt(sessionStorage.alarmInterval) * 60 * 1000;        //获取到数据刷新间隔的毫秒数
                    setTimeout(getAlarmInfo,refreshItv);            //下一次获取数据
                }
            },
            error:function(xhr,res,err){
                setPageTopRightAlarmData(0);        //出错时候，清除显示
                if(sessionStorage.alarmInterval && sessionStorage.alarmInterval!='0'){
                    var refreshItv = parseInt(sessionStorage.alarmInterval) * 60 * 1000;        //获取到数据刷新间隔的毫秒数
                    setTimeout(getAlarmInfo,refreshItv);
                }
            }
        });
    }

    function setPageTopRightAlarmData(dataLength){
        var $badge = $("#header_notification_bar .badge");
        var $alarmDetail = $("#header_notification_bar .external>h3>span");
        var $alarmBlock = $("#header_notification_bar");
        $badge.removeClass("badge-danger");
        if($badge.length>0){        //设置当前报警显示的内容
            if(dataLength==0){
                $badge.html("");            //当前警告的小圆点
                $alarmDetail.html("");      //当前警告的下拉li第一项内容
                $alarmBlock.hide();         //页面右上角警告的内容
                if(sessionStorage.alaDataLength){
                    sessionStorage.removeItem(alaDataLength);
                }
            }else{
                $badge.addClass("badge-danger");
                $badge.html(dataLength);
                $alarmDetail.html(dataLength);
                $alarmBlock.show();
                sessionStorage.alaDataLength = dataLength;
            }
        }
    }

    return {
        //getMenu: getMenu
        init:function(){
            if(!sessionStorage.userName)
            {
                sessionStorage.redirectFromPage = window.location.href;      //记录重定向的url
                window.location.href = "login_3.html";
            }else{
                getMenu();
                setHeaderInfo();
                setTheme();
                if(sessionStorage.alarmInterval && sessionStorage.alarmInterval=='0') {
                    getAlarmInfo();
                }
            }
        }
    }
})();