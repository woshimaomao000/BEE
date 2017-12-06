/**
 * Created by admin on 2017/11/15.
 */
    //时间选择
$('.time-options').click(function(){
    $('.time-options').removeClass('time-options-1');
    $(this).addClass('time-options-1');
    var sss = $('.time-options-1').index('.time-options');
    //获取到时间类型
    var dataType = $('.time-options-1').html();
    //调用时间变化函数
    changeShowTimes(dataType);

});

//点击上方能耗种类切换时
$('.energy-types').on('click','div',function(){
    //获取当前的能耗类型
    var index = $(this).index();
    //定义单位数组
    var unitArr = unitArr1;

    for(var i=0; i<$('.energy-types div').length; i++){
        var className = 'blueImg' + i;
        //清除之前选中的类
        $('.energy-types div').eq(i).removeClass(className);
    }
    //电
    if(index == 0){
        $(this).addClass('blueImg0');
    //水
    }else if(index == 1){
        $(this).addClass('blueImg1');
        //能耗类型为水时，单位变化
        unitArr = unitArr2;
    //气
    }else if(index == 2){
        $(this).addClass('blueImg2');
    //暖
    }else if(index == 3){
        $(this).addClass('blueImg3');
    //冷
    }else if(index == 4){
        $(this).addClass('blueImg4');
    };

    //判断是否在支路霞选择能耗种类
    if($('.onChecked').length > 0){
        //获取对应能耗类型下的支路
        if(branchesType == 2){
            GetAllBranches(2);
        }else{
            GetAllBranches();
        }

    }

    //改变右上角单位
    var html = '';
    $(unitArr).each(function(i,o){
        html += '<option value="'+ o.unitNum+'">'+ o.unitName+'</option>'
    });

    $('#unit').html(html);

});

//初始化时间
changeShowTimes('日');

//页面右上角单位
 unitArr1 = [
    {
        "unitComment":"基础单位",
        "unitName":"kWh",
        "unitNum":"0"
    },
    {
        "unitComment":"转标准煤",
        "unitName":"Kgce",
        "unitNum":"1"
    },
    {
        "unitComment":"转kg碳",
        "unitName":"Kg碳",
        "unitNum":"2"
    },
    {
        "unitComment":"转人民币",
        "unitName":"元",
        "unitNum":"3"
    }
];
//水的单位
 unitArr2 = [
    {
        "unitComment":"基础单位",
        "unitName":"t",
        "unitNum":"0"
    },
    {
        "unitComment":"转人民币",
        "unitName":"元",
        "unitNum":"3"
    }
];

//能耗指标页面单位
 unitArr3 = [
    {
        "unitComment":"基础单位",
        "unitName":"kWh/㎡",
        "unitName1":"kWh/床",
        "unitNum":"0"
    },
    {
        "unitComment":"转标准煤",
        "unitName":"Kgce/㎡",
        "unitName1":"Kgce/床",
        "unitNum":"1"
    },
    {
        "unitComment":"转kg碳",
        "unitName":"Kg碳/㎡",
        "unitName1":"Kg碳/床",
        "unitNum":"2"
    },
    {
        "unitComment":"转人民币",
        "unitName":"元/㎡",
        "unitName1":"元/床",
        "unitNum":"3"
    }
];
//水的单位
 unitArr4 = [
    {
        "unitComment":"基础单位",
        "unitName":"m³/㎡",
        "unitName1":"m³/床",
        "unitNum":"0"
    },
    {
        "unitComment":"转人民币",
        "unitName":"元/平方米",
        "unitName1":"元/床",
        "unitNum":"3"
    }
];

//加载默认能耗类型单位
var html = '';
$(unitArr1).each(function(i,o){
    html += '<option value="'+ o.unitNum+'">'+ o.unitName+'</option>'
});

$('#unit').html(html);

//时间变化
function changeShowTimes(dataType){

    _selectTime(dataType);
}

$('#datetimepicker').on('changeDate',function(e){
    //获取到时间类型
    var dataType = $('.time-options-1').html();

    if(dataType == '周'){
        //获取当前时间
        var curDate = $(this).val();
        //获取结束时间
        var date = moment(curDate).add('6','days').format('YYYY-MM-DD');
        //给结束时间选框赋值
        $('.max').val(date);
    }
});

$('#datetimepicker1').on('changeDate',function(e){
    //获取到时间类型
    var dataType = $('.time-options-1').html();

    if(dataType == '周'){
        //获取当前时间
        var curDate = $(this).val();
        //获取开始时间
        var date = moment(curDate).subtract('6','days').format('YYYY-MM-DD');
        //给结束时间选框赋值
        $('.min').val(date);
    }
});

//支路是否是单选框
 branchesType = 1;

//获取支路 flag 2表示复选框 energy表示获取支路的能耗类型
function GetAllBranches(flag,energy){

    //获取能耗类型
    var energyType = $('.selectedEnergy').attr('value');

    if(!energyType){
        energyType = 100;
    }

    if(energy){
        energyType = energy
    }
    //获取楼宇
    //确定楼宇id
    var pts = _pointerZtree.getSelectedPointers(),pointerID;

    if(pts.length > 0){
        pointerID = pts[0].pointerID;
        _pointerNames = pts[0].pointerName;
    }

    //存放要传的楼宇集合
    var postPointerID = [];

    $(pts).each(function(i,o){
        if(i < 10){
            postPointerID.push(o.pointerID)
        }

    });

    //从后台获取支路数据
    var prm = {
        'pointerIds':postPointerID,
        'serviceType':energyType,
        'isShowTree':1

    };
    //console.log(postPointerID);
    $.ajax({
        type:'post',
        url:_urls + 'BranchV2/GetAllBranches',
        data:prm,
        success:function(result){
           //console.log(result);
            getBranchZtree(result,flag);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR.responseText);
        }
    })



}

//搜索框
var key;
key = $("#keyss");
key.bind("focus",focusKey)
    .bind("blur", blurKey)
    .bind("propertychange", searchNode)
    .bind("input", searchNode);

//构建支路树状图
//zTree树
var branchTreeObj;
function getBranchZtree(EnItdata,flag,fun){

    var setting = {
        check: {
            enable: true,
            chkStyle: "radio",
            radioType: "all"
        },
        data: {
            key: {
                title: "title"
            },
            simpleData: {
                enable: true
            }
        },
        view: {
            showIcon: false
        },
        callback: {
            onClick:function (event,treeId,treeNode){
                branchTreeObj.checkNode(treeNode,!treeNode.checked,false)
            }
        }
    };
    //判断是单选框还是复选框
    if(branchesType == 2){
        setting.check.chkStyle = 'checkbox';
    }
    var zNodes;

    if(!fun){
         zNodes = getZNodes(EnItdata);
    }else{
        zNodes = fun();
    }

    //console.log(zNodes);
    branchTreeObj = $.fn.zTree.init($("#allBranch"), setting, zNodes);
};

//获取不带楼宇的区域位置zTree树的数据
function getPointerTree(){

    var strPointers = sessionStorage.pointers;
    var tempAllPointers = [];

    if(strPointers){
        tempAllPointers = JSON.parse(strPointers);
    };

    var treeArr = getCompactArr(tempAllPointers,true);

    $(treeArr).each(function(i,o){
        if(o.nodeType == 2){
            treeArr.remove(o);
        };
        if(i === 0){
            o.checked=true;
        }
        o.title = o.name;
    });

    return treeArr;
};

//获取分项zTree树的数据
function getZNodes(EnItdata){

    var zNodes = new Array();
    var aaa = [];

    $(EnItdata).each(function(i,o){
        //获取楼宇ID
        var pointerID = o.pointerID;
        var ifOpen = false;
        if(i == 0){
            ifOpen = true;
        }
        zNodes.push({ id: o.pointerID, pId:-1, name:o.pointerName,title: o.pointerName,open:ifOpen,checked:false,nocheck :true})
        //二级结构
        $(o.branchModelV2s).each(function(i,o){
            var parentid = o.f_ParentId;
            //判断是否是一级支路
            if(o.f_ParentId == 0){
                parentid = pointerID
            }
            zNodes.push({ id: o.f_ServiceId, pId: parentid, title: o.f_ServiceName,name:o.f_ServiceName,open:false,checked:false})

        })
    });
    return zNodes;

}
//搜索
var lastValue='',nodeList=[],fontCss={};

function searchNode(e,node) {
    var zTree = $.fn.zTree.getZTreeObj("allBranch");
    //去掉input中的空格（首尾）
    var value = $.trim($("#keyss").val().trim());
    keyType = "name";
    if (lastValue === value)
        return;
    lastValue = value;
    if (value === "") {
        $('.tipes').hide();
        //将 zTree 使用的标准 JSON 嵌套格式的数据转换为简单 Array 格式。
        //获取 zTree 的全部节点数据
        //如果input是空的则显示全部；
        zTree.showNodes(zTree.transformToArray(zTree.getNodes())) ;
        return;
    }
    //getNodesByParamFuzzy:根据节点数据的属性搜索，获取条件模糊匹配
    // 的节点数据 JSON 对象集合
    nodeList = zTree.getNodesByParamFuzzy(keyType,value);
    nodeList = zTree.transformToArray(nodeList);
    if(nodeList==''){
        $('.tipes').show();
        $('.tipes').html('抱歉，没有您想要的结果')
    }else{
        $('.tipes').hide();
    }
    updateNodes(true);

}

//选中之后更新节点
function updateNodes(highlight) {
    var zTree = $.fn.zTree.getZTreeObj("allBranch");
    var allNode = zTree.transformToArray(zTree.getNodes());
    //指定被隐藏的节点 JSON 数据集合
    zTree.hideNodes(allNode);
    //遍历nodeList第n个nodeList
    for(var n in nodeList){
        findParent(zTree,nodeList[n]);
    }
    zTree.showNodes(nodeList);
}
//确定父子关系
function findParent(zTree,node){
    //展开 / 折叠 指定的节点
    zTree.expandNode(node,true,false,false);
    //pNode父节点
    if(typeof node == 'function'){
        return false;
    }
    //pNode父节点
    var pNode = node.getParentNode();
    if(pNode != null){
        nodeList.push(pNode);
        findParent(zTree,pNode);
    }
}
function filter(node) {
    return !node.isParent && node.isFirstNode;
}

//搜索框功能
function focusKey(e) {
    if ($('#key').hasClass("empty")) {
        $('#key').removeClass("empty");
    }
}
function blurKey(e) {
    //内容置为空，并且加empty类
    if ($('#key').get(0).value === "") {
        $('#key').addClass("empty");
    }
}

//展示日期类型 用户选择日期类型
function getShowDateType(){
    //获取页面日期类型
    var dateType = $('.time-options-1').html();

    //定义展示日期类型
    var showDateType = '';
    //定义用于选择日期类型
    var selectDateType = '';

    if(dateType == '日'){

        showDateType = "Hour";
        selectDateType = "Day"

    }else if(dateType == '周'){

        showDateType = "Day";
        selectDateType = "Week"

    }else if(dateType == '月'){

        showDateType = "Week";
        selectDateType = "Month"
    }else if(dateType == '年'){

        showDateType = "Month";
        selectDateType = "Year"
    }else if(dateType == '自定义'){

        showDateType = "Custom";
        selectDateType = "Custom"
    }

    return [showDateType,selectDateType]
};

//获取开始结束时间
function getPostTime(){
    //获取页面日期类型
    var dateType = $('.time-options-1').html();

    //定义开始时间
    var startTime = '';

    if($('.min').length > 0){

        startTime = $('.min').val();
    }

    //定义结束时间
    var endTime = '';

    if(dateType == '日'){

        startTime = startTime;
        endTime = moment(startTime).add('1','days').format('YYYY-MM-DD');

    }else if(dateType == '周'){

        startTime = startTime;

        endTime = moment(startTime).add('7','days').format('YYYY-MM-DD');

    }else if(dateType == '月'){

        startTime = startTime + '-01';
        endTime = moment(startTime).add('1','months').startOf('month').format('YYYY-MM-DD');
    }else if(dateType == '年'){

        endTime = (parseInt(startTime) + 1) + '-01-01';
        startTime = startTime + '-01-01';

    }else if(dateType == '自定义'){

        startTime = startTime;
        endTime = moment($('.max').val()).add('1','days').format('YYYY-MM-DD');
    }

    return [startTime,endTime]
};

//深拷贝的方法
function deepCopy(src,obj){

    obj = obj || (Array.isArray(src) ? [] : {});
    for(var i in src){
        if(src.hasOwnProperty(i)){
            if(typeof src[i] == 'object' && src[i]!=null){
                obj[i] = Array.isArray(src[i]) ? [] : {};
                deepCopy(src[i],obj[i]);
            }else{
                obj[i] = src[i];
            }
        }
    }
};

//关闭提示弹窗后给input获得焦点
function getFocus1(dom){

    $('#myModal2').one('click','.btn-default',function(){
        dom.focus();
    });
}

//检验是否必填项全部填写
function checkedNull1(dom){

    var checkNum = $(dom).find('.colorTip').length;

    for(var i=0; i<checkNum; i++){

        var val = $(dom).find('.colorTip').eq(i).next().find('input').val();

        var name = $(dom).find('.colorTip').eq(i).html().split('*')[0];

        if(val == ''){
            //myAlter('请输入'+ name + '!');
            _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'请输入'+ name + '!', '');
            getFocus1($(dom).find('.colorTip').eq(i).next().find('input'));
            return false;
        }

    }
    return true;
}

//比较开始结束日期是否合理
function checkedDate(dom){

    var txt1 = $(dom).find('.startDate').val();
    var txt2 = $(dom).find('.endDate').val();

    var nowDate = getNewDate();

    //if(CompareDate(txt2,nowDate) == true){
    //        myAlter('结束日期不能大于当前日期');
    //        getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));
    //
    //        return false;
    //};


    if(CompareDate(txt2,txt1) == false){
        //myAlter('结束日期必须大于开始日期');
        _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'结束日期必须大于开始日期', '');
        getFocus1( $(this).parents('.modal-header').find('.add-input').eq(1));

        return false;
    };

    return true;
};

//判断输入内容是否为数字
function checkedNum(dom){
    var num = $(dom).find('.type-number').length;
    for(var i=0; i<num; i++){
        if($(dom).find('.type-number').eq(i).val() != ''){
            var txt = $(dom).find('.type-number').eq(i).val() / 1;

            if(isNaN(txt)){
                var txt1 = $(dom).find('.type-number').eq(i).parent().prev().html().split('*')[0];
                //console.log(txt1);

                //myAlter(txt1 + '必须为数字');
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,txt1 + '必须为数字', '');
                getFocus1($(dom).find('.type-number').eq(i));
                return false;
            }
        }

    }
    return true;
}

//获取当前年月日
function getNewDate(){

    var mydate = new Date();
    var str = "" + mydate.getFullYear() + "-";
    str += (mydate.getMonth()+1) + "-";
    str += mydate.getDate() + "";
    return str;
}

//判断输入是否为电话号码

function checkedPhone(dom){
    var num = $(dom).find('.type-phone').length;

    for(var i=0; i<num; i++){
        var txt = $(dom).find('.type-phone').eq(i).val();
        if(txt != ''){
            if(!(/^1[3|4|5|8][0-9]\d{8}$/.test(txt))){

                //myAlter('手机号输入错误');
                _moTaiKuang($('#myModal2'),'提示', true, 'istap' ,'手机号输入错误', '');
                getFocus1($(dom).find('.type-phone').eq(i));
                return false;

            }
        }
    }


    return true;
}
//比较日期大小
function CompareDate(d1,d2) {
    return ((new Date(d1.replace(/-/g,"\/"))) > (new Date(d2.replace(/-/g,"\/"))));
};

