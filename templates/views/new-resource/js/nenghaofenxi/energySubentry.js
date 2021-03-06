$(function(){

    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //时间初始化
    $('.time-options-1').click();

    //记录页面
    _energyTypeSel = new ETSelection();

    //读取能耗种类
    _getEcType('initPointers');

    //默认选中第一个能耗
    $('.selectedEnergy').addClass('blueImg0');

    _getEcTypeWord();

    //默认能耗种类
    _ajaxEcType =_getEcTypeValue();

    _ajaxEcTypeWord = _getEcTypeWord();

    //获取区域位置二级结构
    getBranchZtree(0,0,getPointerTree);

    //显示隐藏左侧时
    $('.showOrHidden').click(function(){

        window.onresize();
    });

    //加载初始数据
    getPointerData('EnergyAnalyzeV2/GetEnergyItemByCode',1);


    /*---------------------------------buttonEvent------------------------------*/
    //查询按钮
    $('.buttons').children('.btn-success').click(function(){
        //获得选择的能耗类型
        _ajaxEcType =_getEcTypeValue(_ajaxEcType);

        //获取能耗类型名称
        var ecTypeName = $('.selectedEnergy').attr('value');

        //如果不是查询水的分项
        if(ecTypeName != 200){

            getPointerData('EnergyAnalyzeV2/GetEnergyItemByCode',1);

        }else{

            getPointerData('EnergyAnalyzeV2/GetEnergyItemBySecond',2);
        }

    });

    //能耗选择
    $('.typee').click(function(){
        $('.typee').removeClass('selectedEnergy');
        $(this).addClass('selectedEnergy');

    });


    //chart图自适应
    window.onresize = function () {
        if(myChartTopLeft){
            myChartTopLeft.resize();
        }
    };

});

//记录能耗种类
var _ajaxEcType = '';

//记录能耗种类名称
var _ajaxEcTypeWord = '';

/*---------------------------------echart-----------------------------------*/
//定义存放返回数据的数组（本期 X Y）
var allData = [];
var allDataX = [];
var allDataY = [];

//同比柱状图
var myChartTopLeft = echarts.init(document.getElementById('rheader-content-16'));

// 指定图表的配置项和数据
var option = {

    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        type: 'scroll',
        top: 10,
        bottom: 10,
        data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    grid:{
        left:'right',
        top:'60%'
    },
    series: [
        {
            name:'一级分项',
            type:'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            center:['60%','50%'],
            label: {
                normal: {
                    position: 'inner'
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },

            data:[

            ],
            itemStyle:{
                normal:{
                    label:{
                        show: true,
                        formatter: '{b}'
                    },
                    labelLine :{show:true}
                }
            }
        },
        {
            name:'二级分项',
            type:'pie',
            radius: ['50%', '75%'],
            center:['60%','50%'],
            label: {
                normal: {
                    position: 'inner'
                }
            },
            data:[

            ],
            itemStyle:{
                normal:{
                    label:{
        
                        formatter: '{b}'
                    },
                    labelLine :{show:true}
                }
            }
        }
    ]
};

var option1 = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        type: 'scroll',
        top: 10,
        bottom: 10,
        data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
    },
    grid:{
        left:'right'
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    series: [
        {
            name:'一级分项',
            type:'pie',
            radius: ['50%', '75%'],
            data:[

            ],
            center:['60%','50%'],
            itemStyle:{
                normal:{
                    label:{
                        show: false,
                        formatter: '{b} : {c} ({d}%)'
                    },
                    labelLine :{show:true}
                }
            }
        }
    ]
};

/*---------------------------------otherFunction------------------------------*/

var totalArr = [];

//获取数据
//flag = 1 楼宇数据 flag = 2 分户数据 flag = 3 支路数据
function getPointerData(url,flag){

    var totalAllData = 0;

    //存放要传的企业集合
    var enterpriseIDs = [];

    //获取名称
    var areaName = '';

    //确定支路id
    var nodes = branchTreeObj.getCheckedNodes(true);

    $( nodes).each(function(i,o){

        //如果勾选的是父节点
        if(o.level == 0){

            $(o.children).each(function(i,o){
                enterpriseIDs.push(o.id);
            })

        }else{
            enterpriseIDs.push(o.id);
        }

        //页面上方展示信息
        areaName += o.name;
    });

    //判断是否标煤
    if($('.selectedEnergy p').html() == '标煤'){
        _ajaxEcType = -2;
    }

    //获取开始时间
    var startTime = getPostTime()[0];

    //获取开始时间
    var endTime = getPostTime()[1];

    //定义获得数据的参数
    var ecParams = {

        "energyItemType": _ajaxEcType,
        "enterpriseIDs": enterpriseIDs,
        "startTime": startTime,
        "endTime": endTime
    };

    //发送请求
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix+url,
        data:ecParams,
        timeout:_theTimes,
        beforeSend:function(){
            myChartTopLeft.showLoading();
        },
        success:function(result){
            myChartTopLeft.hideLoading();

            //console.log(result);

            //判断是否返回数据
            if(result == null || result.length == 0){
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'无数据', '');
                return false;
            }
            //改变头部显示信息
            var energyName = '';

            if($('.left-middle-main1 .curChoose').length > 0){
                energyName = $('.left-middle-main1 .curChoose').html();
            }

            //改变头部日期
            var date = startTime +" — " + moment(endTime).subtract('1','days').format('YYYY-MM-DD');

            $('.right-header-title').html('' + energyName + ' &nbsp;' + areaName + ' &nbsp;' + date);


            //绘制echarts

            //表格中的数据
            dataArrs = [];

            dataArrs1 = [];

            totalArr.length = 0;

            //删除之前的数据
            for(var i=0; i<option.series.length; i++){

                option.series[i].data = [];
            }
            option1.series[0].data = [];

            //图例
            var legendArr = [];

            //来源
            var sArr1 = [];
            var sArr2 = [];

            $(result).each(function(i,o){
                //给表格获取数据

                dataArrs.push(o);

                totalArr.push(o);

                var obj = {value : o.energyItemValue.toFixed(2),name:o.energyItemName};

                sArr1.push(obj);

                legendArr.push(o.energyItemName);

                //去向
                $(o.childEnergyItemReturns).each(function(i,o){
                    //给表格获取数据

                    dataArrs1.push(o);

                    var obj = {value : o.energyItemValue.toFixed(2),name:o.energyItemName};

                    sArr2.push(obj);

                    legendArr.push(o.energyItemName);
                })

            });
            //电分项
            if(flag == 1){
                option.series[0].data = sArr1;

                option.series[1].data = sArr2;

                option.legend.data = legendArr;

                //echart饼图

                myChartTopLeft.setOption(option,true);

                //右侧table
                //一级分项
                _datasTable( $('#dateTables'),dataArrs);

                $('#dateTables').show();

                $('#dateTables1').hide();

                //默认展开第一项的二级分项
                $('#dateTables tbody tr .details-control').eq(0).click();


            }else{


                option1.series[0].data = sArr1;

                option1.legend.data = legendArr;

                //echart饼图

                myChartTopLeft.setOption(option1,true);

                //右侧table
                //一级分项
                _datasTable( $('#dateTables1'),dataArrs);

                $('#dateTables1').show();

                $('#dateTables').hide();

            }

        },
        error:function(jqXHR, textStatus, errorThrown){
            myChartTopLeft.hideLoading();
            //错误提示信息
            if (textStatus == 'timeout') {//超时,status还有success,error等值的情况
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'超时', '');
            }else{
                _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请求失败', '');
            }

        }
    })
}

//电分项
var table = $('#dateTables').DataTable({
    "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    //是否分页
    "destroy": false,//还原初始化了的datatable
    "paging":false,
    "bPaginate": false,
    "ordering": false,
    'searching':false,
    'info':false,
    'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        'processing': '查询中...',
        'lengthMenu': '每页 _MENU_ 件',
        'zeroRecords': '没有数据',
        'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
        'paginate': {
            'first':      '第一页',
            'last':       '最后一页',
            'next':       '下一页',
            'previous':   '上一页'
        },
        'infoEmpty': ''
    },
    'buttons': [

    ],
    "dom":'B<"clear">lfrtip',
    //数据源
    'columns':[
        {
            title:'',
            class:'',
            data:"energyItemName",
            render:function(data, type, full, meta){

                var num = meta.row;

                return '<span data-num="'+num+'" title="点击查看二级分项" class="details-control" style="cursor: pointer">'+data+'</span>';
            }

        },
        {
            title:'总量',
            data:"energyItemValue",
            render:function(data, type, full, meta){

                return data.toFixed(2);
            }
        },
        {
            title:'占比（%）',
            data:"energyItemPercent",
            render:function(data, type, full, meta){

                return (data * 100).toFixed(2) + '%';
            }
        }

    ]
});
//水分项
var table1 = $('#dateTables1').DataTable({
    "bProcessing" : true, //DataTables载入数据时，是否显示‘进度’提示
    "autoWidth": false,  //用来启用或禁用自动列的宽度计算
    //是否分页
    "destroy": false,//还原初始化了的datatable
    "paging":false,
    "bPaginate": false,
    "ordering": false,
    'searching':false,
    'info':false,
    'language': {
        'emptyTable': '没有数据',
        'loadingRecords': '加载中...',
        'processing': '查询中...',
        'lengthMenu': '每页 _MENU_ 件',
        'zeroRecords': '没有数据',
        'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
        'paginate': {
            'first':      '第一页',
            'last':       '最后一页',
            'next':       '下一页',
            'previous':   '上一页'
        },
        'infoEmpty': ''
    },
    'buttons': [

    ],
    "dom":'B<"clear">lfrtip',
    //数据源
    'columns':[
        {
            title:'',
            data:"energyItemName"

        },
        {
            title:'总量',
            data:"energyItemValue",
            render:function(data, type, full, meta){

                return data.toFixed(2);
            }
        },
        {
            title:'占比（%）',
            data:"energyItemPercent",
            render:function(data, type, full, meta){

                return (data * 100).toFixed(2) + '%';
            }
        }



    ]
});


$('#dateTables tbody').on('click', '.details-control', function () {

    var $this = $(this);

    var index = $this.attr('data-num');

    var historyArr = [];

    historyArr = totalArr[index].childEnergyItemReturns;

    var tr = $(this).closest('tr');  //找到距离按钮最近的行tr;
    var row = table.row( tr );
    if ( row.child.isShown() ) {
        row.child.hide();
        tr.removeClass('shown');
    }
    else {
        // Open this row
        row.child( format(historyArr) ).show();
        tr.addClass('shown');
        $('.shown').next('tr').addClass('on-show');
    }
} );

//显示隐藏
function format ( d ) {
    var theader = '<table class="table">' +
        '<thead><tr><td>二级分项</td><td>总量</td><td>占比（%）</td></tr></thead>';
    var theaders = '</table>';
    var tbodyer = '<tbody>'
    var tbodyers = '</tbody>';

    var str = '';

    for(var i=0;i< d.length;i++){

        str += '<tr>' +
            '<td>' + d[i].energyItemName +
            '</td><td>' + d[i].energyItemValue.toFixed(1) +
            '</td><td>' + ((d[i].energyItemPercent*100).toFixed(1)) +
            '%</td><td>' +
            '</tr>'
    }
    return theader + tbodyer + str + tbodyers + theaders;
}






