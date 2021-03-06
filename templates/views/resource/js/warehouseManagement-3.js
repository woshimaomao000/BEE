$(function(){

    /*--------------------------------------------------时间设置---------------------------------------------------------*/
    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //条件查询的起止时间(默认半年数据)
    var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');

    var _initEnd = moment().format('YYYY/MM/DD');

    //显示时间
    $('.min').val(_initStart);

    $('.max').val(_initEnd);

    //工单查询时间
    //查询工单号的时间
    var gdTimeST = moment().subtract(2,'months').format('YYYY/MM/DD');

    var gdTimeET = moment().format('YYYY/MM/DD');

    $('.gdTime').eq(0).val(gdTimeST);

    $('.gdTime').eq(1).val(gdTimeET);

    var gdrealityEnd = moment($('.gdTime').eq(1).val()).add(1,'d').format('YYYY/MM/DD') + '00:00:00';

    var gdrealityStart = moment($('.gdTime').eq(0).val()).format('YYYY/MM/DD') + '00:00:00';

    //车站数组
    var _stationArr = [];

    stationType();
    /*-------------------------------------------------表格初始化--------------------------------------------------------*/

    //出库单表格初始化
    var ckCol = [
        {
            title:'出库单号',
            data:'orderNum',
            className:'orderNum',
            render:function(data, type, row, meta){
                return '<a href="outboundOrder.html?orderNum=' + row.orderNum +
                    '" target="_blank">' + row.orderNum + '</a>'
            }
        },
        {
            title:'出库类型',
            data:'outType',
            render:function(data, type, full, meta){
                if(data == 9){
                    return '其他'
                }if(data == 1){
                    return '领用出库'
                }
            },
            className:'outType'

        },
        {
            title:'材料员名称',
            data:'cusName'
        },
        {
            title:'材料员电话',
            data:'phone'
        },
        {
            title:'创建日期',
            data:'createTime',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data.split(' ')[0]

                }

            }
        },
        {
            title:'审核日期',
            data:'auditTime',
            render:function(data, type, full, meta){

                if(data == ''){

                    return ''

                }else{

                    return data.split(' ')[0]

                }

            }
        },
        {
            title:'制单人',
            data:'createUserName'
        },
        {
            title:'备注',
            data:'remark'
        },
        {
            title:'操作',
            data:'status',
            render:function(data, type, full, meta){
                if(data == 1){
                    return  "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option option-confirmed btn default btn-xs green-stripe'>已审核</span>" +
                        "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
                }if(data == 0){
                    return "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                        "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                        "<span class='data-option option-confirm btn default btn-xs green-stripe'>待审核</span>" +
                        "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"
                }
            }

        }
    ];

    _tableInit($('.main-contents-table .table'),ckCol,1,'flag','','');

    //第一层弹窗表格初始化
    var rkwpCol = [

        {
            title:'物品编号',
            data:'itemNum',
            className:'bianma'
        },
        {
            title:'物品名称',
            data:'itemName'
        },
        {
            title:'规格型号',
            data:'size'
        },
        {
            title:'物品序列号',
            data:'sn',
            className:'sn'
        },
        {
            title:'单位',
            data:'unitName'
        },
        {
            title:'数量',
            data:'num',
            className:'right-justify'
        },
        {
            title:'出库单价',
            data:'outPrice',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = formatNumber(parseFloat(data));
                return data
            }
        },
        {
            title:'总金额',
            data:'amount',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = formatNumber(parseFloat(data));
                return data
            }
        },
        {
            title:'仓库',
            data:'storageName',
            className:'storageName',
            render:function(data, type, row, meta){

                return '<span data-num="' + row.storageNum +
                    '">' + data + '</span>'

            }
        },
        {
            title:'库区',
            data:'localName',
            className:'localName',
            render:function(data, type, row, meta){
                return '<span data-num="' + row.localNum +
                    '">'+ data + '</span>'
            }
        },
        {
            title:'品质',
            data:'batchNum'
        },
        {
            title:'工单号',
            data:'gdCode2',
            className:'gdCode2'
        },
        {
            title:__names.department,
            data:'bxKeshi',
            className:'station1',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.bxKeshiNum  + '">' + data + '</span>'

            }
        },
        {
            title:'备注',
            data:'outMemo'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            render:function(data, type, full, meta){
                var html = "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span><span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>";

                html +=   "<span class='data-option option-materials btn default btn-xs green-stripe'><a href='materialOdd.html?a1=" + full.gdCode2 +
                        "&a2=" + full.orderNum +
                        "&a3=" + full.itemNum +
                        "&a4=" + full.storageNum +
                        "&a5=" + full.sn +
                        "&a6=" + full.bxKeshiNum +
                    "' target=_blank>用料单</a></span>"

                //if(full.gdCode2 != ''){
                //    html +=   "<span class='data-option option-materials btn default btn-xs green-stripe'><a href='materialOdd.html?a1=" + full.gdCode2 +
                //        "&a2=" + full.orderNum +
                //        "&a3=" + full.itemNum +
                //        "&a4=" + full.storageNum +
                //        "&a5=" + full.sn +
                //        "' target=_blank>用料单</a></span>"
                //}
                return html;
            }
            //"defaultContent": "<span class='data-option option-see1 btn default btn-xs green-stripe'>查看</span><span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span><span class='data-option option-materials btn default btn-xs green-stripe'>用料单</span>"

        }
    ];

    _tableInit($('#personTable1'),rkwpCol,2,'','','');

    //第二层弹窗表格
    var rkwpCol2 = [
        {
            title:'物品编号',
            data:'itemNum',
            className:'bianma'
        },
        {
            title:'物品名称',
            data:'itemName'
        },
        {
            title:'规格型号',
            data:'size'
        },
        {
            title:'物品序列号',
            data:'sn',
            className:'sn'
        },
        {
            title:'单位',
            data:'unitName'
        },
        {
            title:'数量',
            data:'num',
            className:'right-justify'
        },
        {
            title:'出库单价',
            data:'outPrice',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = formatNumber(parseFloat(data));
                return data
            }
        },
        {
            title:'总金额',
            data:'amount',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = formatNumber(parseFloat(data));
                return data
            }
        },
        {
            title:'仓库',
            data:'storageName',
            className:'storageName',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.storageNum +
                    '">' + data + '</span>'

            }
        },
        {
            title:'库区',
            data:'localName',
            className:'localName',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.localNum +
                    '">' + data + '</span>'

            }
        },
        {
            title:'品质',
            data:'batchNum'
        },
        {
            title:'工单号',
            data:'gdCode2',
            className:'gdCode2'
        },
        {
            title:__names.department,
            data:'bxKeshi',
            className:'station1',
            render:function(data, type, full, meta){

                return '<span data-num="' + full.bxKeshiNum  + '">' + data + '</span>'

            }
        },
        {
            title:'备注',
            data:'outMemo'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-bianji btn default btn-xs green-stripe' data-flag=1>编辑</span><span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>"

        }
    ];

    _tableInit($('#wuPinListTable1'),rkwpCol2,2,'','','');

    //工单表格
    var gdCol = [
        {
            title:'工单号',
            data:'gdCode2',
            className:'gdCodes',
            render:function(data, type, full, meta){
                return '<span data-gdCode="' + full.gdCode +
                    '" data-czCode="' + full.bxKeshiNum +
                    '">'+ data + '</span>'
            }
        },
        {
            title:'工单状态',
            data:'gdZht',
            render:function(data, type, full, meta){
                if (data == 1) {
                    return '待下发'
                }
                if (data == 2) {
                    return '待分派'
                }
                if (data == 3) {
                    return '待执行'
                }
                if (data == 4) {
                    return '执行中'
                }
                if (data == 5) {
                    return '等待资源'
                }
                if (data == 6) {
                    return '待关单'
                }
                if (data == 7) {
                    return '任务关闭'
                }
                if (data == 999) {
                    return '任务取消'
                }
            }
        },
        {
            title:'督察督办责任人',
            data:'wxUserNames'
        },
        {
            title:'维修系统',
            data:'wxShiX'
        },
        {
            title:'所需备件',
            data:'wxClNames'
        },
        {
            title:'车站',
            data:'bxKeshi',
            className:'bxKS'
        }
    ];

    _tableInit($('#gdTable'),gdCol,2,'','','');

    //选择出库材料表格
    var col4 = [
        {
            title:'序列号',
            data:'sn',
            className:'xuliehao'
        },
        {
            title:'物品编码',
            className:'bianma',
            data:'itemNum'
        },
        {
            title:'物品名称',
            className:'mingcheng',
            data:'itemName'
        },
        {
            title:'仓库编码',
            data:'storageNum',
            className:'cangkuNum hiddenButton'
        },
        {
            title:'仓库',
            data:'storageName',
            className:'cangku'
        },
        {
            title:'库区编码',
            data:'localNum',
            className:'localNum hiddenButton'
        },
        {
            title:'库区名称',
            data:'localName',
            className:'localName'
        },
        {
            title:'是否耐用',
            data:'isSpare',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '否'
                }if(data == 1){
                    return '是'
                }
            },
            className:'isSpare'
        },
        {
            title:'规格型号',
            data:'size',
            className:'size'
        },
        {
            title:'分类名称',
            data:'cateName'
        },
        {
            title:'剩余数量',
            data:'num',
            className:'num'
        },
        {
            title:'单价',
            data:'',
            render:function(data, type, full, meta){

                var aa = Number(full.amount) / Number(full.num)

                return formatNumber(aa);
            }
        }
    ];

    _tableInit($('#wuPinListTable'),col4,2,'','','');

    //物品明细表格
    var outPrinceCol = [
        {
            title:'物品序列号',
            data:'sn'
        },
        {
            name: 'second',
            title:'物品编号',
            data:'itemNum'
        },
        {
            title:'物品名称',
            data:'itemName'
        },
        {
            title:'规格型号',
            data:'size'
        },
        {
            title:'数量',
            data:'num'
        },
        {
            title:'单价',
            data:'price',
            render:function(data, type, full, meta){
                if(data){
                    return data.toFixed(2)
                }else{
                    return ''
                }

            }
        },
        {
            title:'金额',
            data:'amount',
            render:function(data, type, full, meta){
                if(data){
                    return data.toFixed(2)
                }else{
                    return ''
                }
            }
        },
        {
            title:'仓库',
            data:'storageName'
        },
        {
            title:'库区',
            data:'localName'
        },
        {
            title:'台账类型',
            data:'ivtType'
        },
        {
            title:'关联单号',
            data:'orderNum',
            render:function(data, type, full, meta){
                if(full.ivtType == '入库'){
                    return '<a href="godownEntry.html?orderNum=' + full.orderNum +
                        '" target="_blank">' + full.orderNum + '</a>'
                }else if(full.ivtType == '出库'){
                    return '<a href="outboundOrder.html?orderNum=' + full.orderNum +
                        '" target="_blank">' + full.orderNum + '</a>'
                }
            }
        },
        {
            title:'创建时间',
            data:'createTime'
        },
        {
            title:'操作人',
            data:'createUserName'
        }
    ];

    _tableInit($('#outPrince-table'),outPrinceCol,2,'','','');

    //车站表格
    var stationCol = [

        {
            title:'名称',
            data:'ddName'
        },
        {
            title:'编码',
            data:'ddNum'
        },
        {
            title:'拼音简写',
            data:'ddPy'
        },
        {
            title:'上级',
            data:'ddParentNum'
        }

    ];

    _tableInitS($('#station-table'),stationCol,2,true,'','','');

    //车站列表
    //stationData(true);

    /*-------------------------------------------------全局变量---------------------------------------------------------*/
    //存放所有仓库
    var _ckArr = [];

    //存放所有出库单
    var _allData = [];

    //当前仓库下的所有库区
    var _kqArr = [];

    //所有物品列表
    var _wpListArr = [];

    //过滤之后的物品列表
    var _filterWPList = [];

    //序列号列表
    var _snArr = [];

    //工单列表
    var _gdArr = [];

    //所有车站列表
    var _cheArr = [];

    //所有工单列表
    //材料申请是否已审批（默认已审批）
    $('#isExamine').parent('span').removeClass('checked');

    GDselect(0,true);

    //获取所有车站
    chezhan(true);

    //第二层暂存选中的入库产品的数组
    var _tempRKArr = [];

    //暂存选中的数组（用于删除）
    var _tempObj = [];

    //第一层选中入库产品的数组
    var _rukuArr = [];

    //条件查询-出库类型方法
    rkLX();

    //获取仓库（出库单的查询前提）
    warehouse();

    //控制出库单的到处按钮显示隐藏

    $('.excelButton').children('.dt-buttons').hide();

    $('.excelButton').children('.dt-buttons').eq(0).show();

    //新增入库单vue对象
    var putOutList = new Vue({

        el:'#myApp33',
        data:{
            bianhao:'',

            rkleixing:'',

            clymc:'',

            clydh:'',

            zhidanren:'',

            shijian:'',

            remarks:'',

            shRemarks:'',

            shenheTime:''

        },
        methods:{

            time:function(){

                $('.datatimeblock').eq(2).datepicker({
                    language:  'zh-CN',
                    todayBtn: 1,
                    todayHighlight: 1,
                    format: 'yyyy/mm/dd',
                    autoclose:1
                });

            },
            time1:function(){

                $('.datatimeblock').eq(3).datepicker({
                    language:  'zh-CN',
                    todayBtn: 1,
                    todayHighlight: 1,
                    format: 'yyyy/mm/dd',
                    autoclose:1
                });

            }
        }

    })

    //新增入库物品vue对象
    var putOutGoods = new Vue({

        el:'#workDone',
        data:{
            'ck':'',
            'kuwei':'',
            'bianhao':'',
            'mingcheng':'',
            'goodsId':'',
            'size':'',
            'picked':'',
            'unit':'',
            'quality':'',
            'warranty':'',
            'redundant':0,
            'num':'',
            'outPrice':'',
            'amount':'',
            'gdCode':'',
            'chezhan':'',
            'remark':''
        },
        methods:{
            //仓库键盘事件
            selectCK:function(){

                upDown($('#workDone').find('.pinzhixx').eq(0),enterCK,inputCK);

            },
            //库区键盘事件
            selectKQ:function(){

                upDown($('#workDone').find('.kuqu-list').eq(0),enterKQ,inputKQ);

            },
            //物品编码键盘事件
            searchbm:function(){

                upDown($('#workDone').find('.accord-with-list').eq(0),enterBM,inputBM);

            },
            //物品名称键盘事件
            searchmc:function(){

                upDown($('#workDone').find('.accord-with-list').eq(1),enterMC,inputMC);

            },
            //物品序列号键盘事件
            keySn:function(){

                upDown($('#workDone').find('.accord-sn-list'),enterSN,inputSN);

            },
            //工单键盘事件
            selectGD:function(){

                upDown($('#workDone').find('.pinzhixx').eq(1),enterGD,inputGD);

            },
            //数量验证
            addFun1:function(){
                var mny = /^[0-9]*[1-9][0-9]*$/;
                //首先确定数量填写了
                if(putOutGoods.num != ''){
                    //判断是否符合正则（正整数）;
                    if(mny.test(putOutGoods.num)){
                        $('.format-error').hide();
                        if(parseInt(putOutGoods.num)>parseInt(putOutGoods.redundant)){
                            $('.format-error2').show();
                        }else{
                            $('.format-error2').hide();
                        }
                        if(putOutGoods.picked == 1 && putOutGoods.num != 1){
                            $('.format-error4').show();
                        }else{
                            $('.format-error4').hide();
                        }
                    }else{
                        $('.format-error').show();
                    }
                }else{
                    $('.format-error').hide();
                    $('.format-error2').hide();
                }
                var amount = Number(putOutGoods.outPrice) * Number(putOutGoods.num);
                putOutGoods.amount = formatNumber(amount);
            },
            //出库单价
            addFun2:function(){
                //var mny = /^((?:-?0)|(?:-?[1-9]\d*))(?:\.\d{1,2})?$/;
                var mny = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
                if(putOutGoods.outPrice != ''){

                    if(mny.test(putOutGoods.outPrice)){
                        $('.format-error1').hide();
                    }else{
                        $('.format-error1').show();
                    }
                }else{
                    $('.format-error1').hide();
                }
                var amount = Number(putOutGoods.outPrice) * Number(putOutGoods.num);

                putOutGoods.amount = formatNumber(amount);
            },
            addFun4:function(){
                var outPrince = Number(putOutGoods.outPrice);
                putOutGoods.outPrice = formatNumber(parseFloat(outPrince));
            },
            //总金额
            addFun3:function(){
                var mny = /^([1-9][0-9]*(\.[0-9]{1,2})?|0\.(?!0+$)[0-9]{1,4})$/;
                if(mny.test(putOutGoods.amount)){
                    $('.format-error3').hide();
                    //根据总金额得出单价
                    var danjia =  Number(putOutGoods.amount)/Number(putOutGoods.num);
                    putOutGoods.outPrice = formatNumber(danjia);
                }else{
                    $('.format-error3').show();
                }
            },
            addFun5:function(){
                var outPrince = putOutGoods.amount;
                putOutGoods.amount = formatNumber(parseFloat(outPrince));
            },
        }

    })

    //出库
    var chukuObject = new Vue({
        el:'#chukuObject',
        data:{
            ck:'',
            bianhao:'',
            mingcheng:'',
            size:'',
            picked:'',
            goodsId:'',
            unit:'',
            quality:'',
            warranty:'',
            shengyu:'',
            num:'',
            outPrice:'',
            amount:'',
            gdCode:'',
            chezhan:'',
            remark:'',
            cangkuNum:''
        }
    })

    //下拉列表(上下键记录)
    var _numIndex = -1;

    //备件申请完成
    var _bjComplete = false;

    //备件状态
    var _BjFlag = false;

    //审核执行完成
    var _shComplete = false;

    //审核执行成功
    var _shSuccess = false;

    //出库单号
    var _$thisRKnum = '';

    //审核标志
    var _examineRen = false;

    //生成用料单是否完成
    var _ldComplete = false;

    //生成用料单是否成功
    var _ldSuccess = false;

    //是否可以自己审核
    var _isShenHe = sessionStorage.getItem('ckAuditType');

    //当前选中的一条物品列表
    var _wpObject = {};

    /*--------------------------------------------------按钮事件---------------------------------------------------------*/
    //tab选项卡
    $('.table-title').children('span').click(function(){

        $('.table-title').children('span').removeClass('spanhover');

        $(this).addClass('spanhover');

        $('.main-contents-table').addClass('hide-block');

        $('.main-contents-table').eq($(this).index()).removeClass('hide-block');

        //导出按钮显示
        for( var i=0;i<$('.excelButton').children().length;i++ ){

            $('.excelButton').children().eq(i).addClass('hidding');

        };

        $('.excelButton').children().eq($(this).index()).removeClass('hidding');
    });

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //重置
    $('.resites').click(function(){

        var block = $('.condition-query').eq(0);

        block.find('input').val('');

        block.find('select').val('');

        //时间
        $('.min').val(_initStart);

        $('.max').val(_initEnd);


    })

    //新增
    $('.creatButton').click(function(){

        //可操作项(input\select\textarea\新增按钮\审核备注)
        $('#myApp33').find('input').removeAttr('readonly').removeClass('disabled-block');

        $('#myApp33').find('input').parent('.input-blockeds').removeClass('disabled-block');

        //$('#myApp33').find('select').attr('disabled',false).removeClass('disabled-block');

        $('#myApp33').find('textarea').removeAttr('readonly').removeClass('disabled-block');

        //自动生成的不可操作
        $('#myApp33').find('.automatic').attr('readonly','readonly').addClass('disabled-block');

        //审核备注不显示
        $('#myApp33').find('.shRemarks').hide();

        //编辑物品按钮修改名称
        $('.zhiXingRenYuanButton').html('新增物品').show();

        //动态添加类名dengji删除bianji类
        $('#myModal').find('.confirm').removeClass('bianji').removeClass('shanchu').removeClass('shenhe').addClass('dengji');

        $('#myModal1').find('.saveCK').removeClass('bianji').addClass('dengji').html('保存出库单');

        //新增入库单弹窗初始化
        RKDInit();

        //模态框
        _moTaiKuang($('#myModal'), '新增', '', '' ,'', '新增');

        //清空
        _rukuArr.length = 0;

    })

    $('#myModal').on('shown.bs.modal',function(){

        $('.touchingTime').focus().blur();

        if($('.datepicker:visible')){

            $('.datepicker').hide();

        }

    })

    //登记确定按钮、编辑
    $('#myModal')
        .on('click','.dengji',function(){

            //先判断 必填项
            if(putOutList.rkleixing == ''){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项!', '');
            }else{
                var outStoreDetails1 = [];
                ////工单的信息
                //var gdArr = [];
                ////材料工单
                //var clArr = [];

                for(var i=0;i<_rukuArr.length;i++){

                    var obj = {};
                    obj.sn = _rukuArr[i].sn;
                    obj.itemNum = _rukuArr[i].itemNum;
                    obj.itemName = _rukuArr[i].itemName;
                    obj.size = _rukuArr[i].size;
                    obj.unitName = _rukuArr[i].unitName;
                    obj.num = _rukuArr[i].num;
                    obj.outPrice = _rukuArr[i].outPrice;
                    obj.amount = _rukuArr[i].amount;
                    obj.gdCode = typeof (_rukuArr[i].gdCode == 'undefined')?'':_rukuArr[i].gdCode;
                    obj.gdCode2 = _rukuArr[i].gdCode2;
                    obj.bxKeshi = (typeof _rukuArr[i].bxKeshi == 'undefined')?'':_rukuArr[i].bxKeshi;
                    obj.bxKeshiNum = (typeof _rukuArr[i].bxKeshiNum == 'undefined')?'':_rukuArr[i].bxKeshiNum;
                    obj.outMemo = _rukuArr[i].outMemo;
                    obj.userID=_userIdNum;
                    obj.userName = _userIdName;
                    obj.storageName = _rukuArr[i].storageName;
                    obj.storageNum = _rukuArr[i].storageNum;
                    obj.batchNum = _rukuArr[i].batchNum;
                    obj.localNum = _rukuArr[i].localNum;
                    obj.localName = _rukuArr[i].localName;
                    outStoreDetails1.push(obj);
                    //备件转换
                    //if(_rukuArr[i].gdCode){
                    //    gdArr.push(_rukuArr[i].gdCode);
                    //    clArr.push(_rukuArr[i].itemName);
                    //}
                }

                //获取填写的入库信息
                var ckName = '';
                if($('#ckselect').val() == ''){
                    ckName = ''
                }else{
                    ckName = $('#ckselect').children('option:selected').html();
                }

                var prm = {
                    'outType':putOutList.rkleixing,
                    'remark':putOutList.remarks,
                    'outStoreDetails':outStoreDetails1,
                    'userID':_userIdNum,
                    'userName':_userIdName,
                    'b_UserRole':_userRole,
                    'storageName':ckName,
                    'storageNum':$('#ckselect').val(),
                    'contractOrder':(typeof putOutList.gdCode == 'undefined')?'':putOutList.gdCode,
                    'cusName':putOutList.clymc,
                    'phone':putOutList.clydh,
                    //制单时间
                    'createTime':putOutList.shijian
                }

                $.ajax({
                    type:'post',
                    url: _urls + 'YWCK/ywCKAddOutStorage',
                    data:prm,
                    success:function(result){

                        if(result == 99){
                            _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'登记成功!', '');
                            $('#myModal').modal('hide');
                            conditionSelect();
                        }else{
                            _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'登记失败!', '');
                        }

                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }
                })
            }
        })
        .on('click','.bianji',function(){

            var outStoreDetails1 = [];

            //入库单的信息
            for(var i=0;i<_rukuArr.length;i++){
                var obj = {};
                obj.itemNum = _rukuArr[i].itemNum;
                obj.itemName = _rukuArr[i].itemName;
                obj.size = _rukuArr[i].size;
                obj.unitName = _rukuArr[i].unitName;
                obj.num = _rukuArr[i].num;
                obj.outPrice = _rukuArr[i].outPrice;
                obj.amount = _rukuArr[i].amount;
                obj.gdCode2 = _rukuArr[i].gdCode2;
                obj.bxKeshi = (typeof _rukuArr[i].bxKeshi == 'undefined')?'':_rukuArr[i].bxKeshi;
                obj.bxKeshiNum = (typeof _rukuArr[i].bxKeshiNum == 'undefined')?'':_rukuArr[i].bxKeshiNum;
                //obj.bxKeshi = $('#chezhan').children('option:selected').html();
                //obj.bxKeshiNum = _rukuArr[i].chezhan;
                obj.outMemo = _rukuArr[i].outMemo;
                obj.userID=_userIdNum;
                obj.userName = _userIdName;
                obj.storageName = _rukuArr[i].storageName;
                obj.storageNum = _rukuArr[i].storageNum;
                obj.sn = _rukuArr[i].sn;
                obj.localNum = _rukuArr[i].localNum;
                obj.localName = _rukuArr[i].localName;
                outStoreDetails1.push(obj);
            }

            var ckName = '';
            if($('#ckselect').val() == ''){
                ckName = ''
            }else{
                ckName = $('#ckselect').children('option:selected').html();
            }
            var prm = {
                'orderNum':putOutList.bianhao,
                'outType':putOutList.rkleixing,
                'remark':putOutList.remarks,
                'outStoreDetails':outStoreDetails1,
                'userID':_userIdNum,
                'userName':_userIdName,
                'b_UserRole':_userRole,
                'storageName':ckName,
                'storageNum':$('#ckselect').val(),
                'contractOrder':putOutList.gdCode,
                'cusName':putOutList.clymc,
                'phone':putOutList.clydh,
                'createTime':putOutList.shijian
            }

            $.ajax({
                type:'post',
                url: _urls + 'YWCK/ywCKEditOutStorage',
                data:prm,
                success:function(result){
                    if(result == 99){
                        _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'修改成功!', '');

                        $('#myModal').modal('hide');

                        conditionSelect();

                    }else{
                        _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'修改失败!', '');
                    }
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })

        })
        .on('click','.shenhe',function(){

            //如果是_examineRen == false 可以审核，_examineRen == true不可以审核
            if(_isShenHe == 1){

                if(!_examineRen){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'不能审核自己创建的入库单！', '');

                }else{

                    //当出库物品没有的时候，不能审核
                    if( _rukuArr.length == 0 ){

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'出库物品为空，不能审核！', '');

                    }else{

                        //审核
                        shenheFun();


                    }
                }

            }else if(_isShenHe == 0 ){

                //当出库物品没有的时候，不能审核
                if( _rukuArr.length == 0 ){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'出库物品为空，不能审核！', '');

                }else{

                    //审核
                    shenheFun();

                }

            }


        })

    $('#myModal1')
        .on('click','.dengji',function(){
            //先判断 必填项
            if(putOutList.rkleixing == ''){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项!', '');
            }else{
                var outStoreDetails1 = [];
                ////工单的信息
                //var gdArr = [];
                ////材料工单
                //var clArr = [];

                _rukuArr.length = 0;

                for(var i=0;i<_tempRKArr.length;i++){

                    _rukuArr.push(_tempRKArr[i]);

                }

                for(var i=0;i<_rukuArr.length;i++){

                    var obj = {};
                    obj.sn = _rukuArr[i].sn;
                    obj.itemNum = _rukuArr[i].itemNum;
                    obj.itemName = _rukuArr[i].itemName;
                    obj.size = _rukuArr[i].size;
                    obj.unitName = _rukuArr[i].unitName;
                    obj.num = _rukuArr[i].num;
                    obj.outPrice = _rukuArr[i].outPrice;
                    obj.amount = _rukuArr[i].amount;
                    obj.gdCode = typeof (_rukuArr[i].gdCode == 'undefined')?'':_rukuArr[i].gdCode;
                    obj.gdCode2 = _rukuArr[i].gdCode2;
                    obj.bxKeshi = (typeof _rukuArr[i].bxKeshi == 'undefined')?'':_rukuArr[i].bxKeshi;
                    obj.bxKeshiNum = (typeof _rukuArr[i].bxKeshiNum == 'undefined')?'':_rukuArr[i].bxKeshiNum;
                    obj.outMemo = _rukuArr[i].outMemo;
                    obj.userID=_userIdNum;
                    obj.userName = _userIdName;
                    obj.storageName = _rukuArr[i].storageName;
                    obj.storageNum = _rukuArr[i].storageNum;
                    obj.batchNum = _rukuArr[i].batchNum;
                    obj.localNum = _rukuArr[i].localNum;
                    obj.localName = _rukuArr[i].localName;
                    outStoreDetails1.push(obj);
                    //备件转换
                    //if(_rukuArr[i].gdCode){
                    //    gdArr.push(_rukuArr[i].gdCode);
                    //    clArr.push(_rukuArr[i].itemName);
                    //}
                }

                //获取填写的入库信息
                var ckName = '';
                if($('#ckselect').val() == ''){
                    ckName = ''
                }else{
                    ckName = $('#ckselect').children('option:selected').html();
                }

                var prm = {
                    'outType':putOutList.rkleixing,
                    'remark':putOutList.remarks,
                    'outStoreDetails':outStoreDetails1,
                    'userID':_userIdNum,
                    'userName':_userIdName,
                    'b_UserRole':_userRole,
                    'storageName':ckName,
                    'storageNum':$('#ckselect').val(),
                    'contractOrder':(typeof putOutList.gdCode == 'undefined')?'':putOutList.gdCode,
                    'cusName':putOutList.clymc,
                    'phone':putOutList.clydh,
                    //制单时间
                    'createTime':putOutList.shijian
                }

                $.ajax({
                    type:'post',
                    url: _urls + 'YWCK/ywCKAddOutStorage',
                    data:prm,
                    success:function(result){

                        if(result == 99){
                            _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'登记成功!', '');

                            $('#myModal').modal('hide');

                            $('#myModal1').modal('hide');

                            conditionSelect();
                        }else{
                            _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'登记失败!', '');
                        }

                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }
                })
            }
        })
        .on('click','.bianji',function(){

            if(putOutList.rkleixing == ''){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项!', '');

            }else{

                _rukuArr.length = 0;

                //首先要获取所有物品的信息
                for(var i=0;i<_tempRKArr.length;i++){

                    _rukuArr.push(_tempRKArr[i]);

                }

                //工单的信息
                var gdArr = [];
                //材料工单
                var clArr = [];

                var outStoreDetails1 = [];

                for(var i=0;i<_rukuArr.length;i++){

                    var obj = {};
                    obj.sn = _rukuArr[i].sn;
                    obj.itemNum = _rukuArr[i].itemNum;
                    obj.itemName = _rukuArr[i].itemName;
                    obj.size = _rukuArr[i].size;
                    obj.unitName = _rukuArr[i].unitName;
                    obj.num = _rukuArr[i].num;
                    obj.outPrice = _rukuArr[i].outPrice;
                    obj.amount = _rukuArr[i].amount;
                    obj.gdCode = typeof (_rukuArr[i].gdCode == 'undefined')?'':_rukuArr[i].gdCode;
                    obj.gdCode2 = _rukuArr[i].gdCode2;
                    obj.bxKeshi = (typeof _rukuArr[i].bxKeshi == 'undefined')?'':_rukuArr[i].bxKeshi;
                    obj.bxKeshiNum = (typeof _rukuArr[i].bxKeshiNum == 'undefined')?'':_rukuArr[i].bxKeshiNum;
                    obj.outMemo = _rukuArr[i].outMemo;
                    obj.userID=_userIdNum;
                    obj.userName = _userIdName;
                    obj.storageName = _rukuArr[i].storageName;
                    obj.storageNum = _rukuArr[i].storageNum;
                    obj.batchNum = _rukuArr[i].batchNum;
                    obj.localNum = _rukuArr[i].localNum;
                    obj.localName = _rukuArr[i].localName;
                    outStoreDetails1.push(obj);
                    //备件转换
                    //if(_rukuArr[i].gdCode){
                    //    gdArr.push(_rukuArr[i].gdCode);
                    //    clArr.push(_rukuArr[i].itemName);
                    //}
                }

                //获取填写的入库信息
                var ckName = '';
                if($('#ckselect').val() == ''){
                    ckName = ''
                }else{
                    ckName = $('#ckselect').children('option:selected').html();
                }

                var prm = {
                    'orderNum':putOutList.bianhao,
                    'outType':putOutList.rkleixing,
                    'remark':putOutList.remarks,
                    'outStoreDetails':outStoreDetails1,
                    'userID':_userIdNum,
                    'userName':_userIdName,
                    'b_UserRole':_userRole,
                    'storageName':ckName,
                    'storageNum':$('#ckselect').val(),
                    'contractOrder':(typeof putOutList.gdCode == 'undefined')?'':putOutList.gdCode,
                    'cusName':putOutList.clymc,
                    'phone':putOutList.clydh,
                    'createTime':putOutList.shijian
                }

                $.ajax({
                    type:'post',
                    url: _urls + 'YWCK/ywCKEditOutStorage',
                    data:prm,
                    success:function(result){

                        if(result == 99){
                            _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'编辑成功!', '');

                            $('#myModal').modal('hide');

                            $('#myModal1').modal('hide');

                            conditionSelect();

                        }else{
                            _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'编辑失败!', '');
                        }

                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }
                })

            }

        })


    //删除确定按钮
    $('#myModal3').on('click','.daShanchu',function(){

        var prm = {
            'orderNum':_$thisRKnum,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKDelOutStorage',
            data:prm,
            success:function(result){
                if(result == 99){
                    _moTaiKuang($('#myModal5'), '提示','flag', 'istap' ,'删除成功!', '');
                    conditionSelect();
                    $('#myModal3').modal('hide');
                }else{
                    _moTaiKuang($('#myModal5'), '提示','flag', 'istap' ,'删除失败!', '');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    })

    //查看
    $('.main-contents-table .table tbody').on('click','.option-see',function(){

        RKDInit();

        //可操作项(input\select\textarea\新增按钮\审核备注)
        $('#myApp33').find('input').attr('readonly','readonly').addClass('disabled-block');

        $('#myApp33').find('input').parent('.input-blockeds').addClass('disabled-block');

        $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');

        $('#myApp33').find('textarea').attr('readonly','readonly').addClass('disabled-block');

        //新增按钮消失
        $('.zhiXingRenYuanButton').hide();

        //审核备注显示
        $('#myApp33').find('.shRemarks').show();

        //样式
        var $this = $(this).parents('tr');

        $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

        $this.addClass('tables-hover');

        var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();

        _$thisRKnum = $thisDanhao;

        //赋值
        for(var i=0;i<_allData.length;i++){
            if(_allData[i].orderNum == $thisDanhao){

                //绑定数据
                putOutList.rkleixing = _allData[i].outType;
                putOutList.bianhao = _allData[i].orderNum;
                putOutList.remarks = _allData[i].remark;
                putOutList.gysphone = _allData[i].phone;
                putOutList.zhidanren = _allData[i].createUser;

                var zhidanTime = '';

                if(_allData[i].createTime){

                    zhidanTime = _allData[i].createTime.split(' ')[0]

                }

                putOutList.shijian = zhidanTime;
                putOutList.gdCode = _allData[i].contractOrder;
                putOutList.clymc = _allData[i].cusName;
                putOutList.clydh = _allData[i].phone;
                putOutList.shRemarks = _allData[i].auditMemo;

                var shenheTime = '';

                if(_allData[i].auditTime){

                    shenheTime = _allData[i].auditTime.split(' ')[0];

                }

                putOutList.shenheTime = shenheTime;
            }
        }

        //模态框
        _moTaiKuang($('#myModal'), '查看', 'flag', '' ,'', '');

        //获取入库信息的详细物品信息
        function sucFun1(result){

            _datasTable($('#personTable1'),result);

            //共计
            //数量
            var num = 0;

            //金额
            var amount = 0;

            for(var i=0;i<result.length;i++){

                num += Number(result[i].num);

                amount += Number(result[i].amount);

            }

            //赋值
            $('#personTable1 tfoot').find('.totalnum').html(num);

            $('#personTable1 tfoot').find('.count').html(amount.toFixed(2));

        }

        detailInfo($thisDanhao,sucFun1);

        $('#personTable1 tbody').children('tr').find('.option-shanchu').addClass('hiddenButton');
    })

    //编辑
    $('.main-contents-table .table tbody').on('click','.option-edit',function(){

        RKDInit();

        //样式
        var $this = $(this).parents('tr');

        $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

        $this.addClass('tables-hover');

        var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();

        _$thisRKnum = $thisDanhao;

        for(var i=0;i<_allData.length;i++){
            if(_allData[i].orderNum == $thisDanhao){
                //绑定数据
                putOutList.rkleixing = _allData[i].outType;
                putOutList.bianhao = _allData[i].orderNum;
                putOutList.remarks = _allData[i].remark;
                putOutList.gysphone = _allData[i].phone;
                putOutList.zhidanren = _allData[i].createUser;

                var zhidanTime = '';

                if(_allData[i].createTime){

                    zhidanTime = _allData[i].createTime.split(' ')[0]

                }

                putOutList.shijian = zhidanTime;
                putOutList.gdCode = _allData[i].contractOrder;
                putOutList.clymc = _allData[i].cusName;
                putOutList.clydh = _allData[i].phone;
                putOutList.shRemarks = _allData[i].auditMemo;
            }
        }

        _moTaiKuang($('#myModal'), '编辑', '', '' ,'', '保存');

        //获取入库信息的详细物品信息
        function sucFun2(result){

            _rukuArr.length = 0;

            for(var i=0;i<result.length;i++){

                for(var j=0;j<_gdArr.length;j++){

                    if(result[i].gdCode2 == _gdArr[j].gdCode2){

                        result[i].bxKeshi = _gdArr[j].bxKeshi;

                        result[i].bxKeshiNum = _gdArr[j].bxKeshiNum;

                        result[i].gdCode = _gdArr[j].gdCode;
                    }

                }

                _rukuArr.push(result[i]);
            }

            _datasTable($('#personTable1'),_rukuArr);

            //共计
            //数量
            var num = 0;

            //金额
            var amount = 0;

            for(var i=0;i<result.length;i++){

                num += Number(result[i].num);

                amount += Number(result[i].amount);

            }

            //赋值
            $('#personTable1 tfoot').find('.totalnum').html(num);

            $('#personTable1 tfoot').find('.count').html(amount.toFixed(2));

            if(_rukuArr.length == 0){

                $('#ckselect').attr('disabled',false).removeClass('disabled-block');

            }else{

                $('#ckselect').attr('disabled',true).addClass('disabled-block');

            }

        }

        detailInfo($thisDanhao,sucFun2);

        //删除添加类
        $('#myModal').find('.confirm').removeClass('dengji').removeClass('shanchu').removeClass('shenhe').addClass('bianji');

        $('#myModal1').find('.saveCK').removeClass('dengji').addClass('bianji').html('保存出库单');

        if( $(this).next().html() == '已审核' ){

            //可操作项(input\select\textarea\新增按钮\审核备注)
            $('#myApp33').find('input').attr('readonly','readonly').addClass('disabled-block');

            $('#myApp33').find('input').parent('.input-blockeds').addClass('disabled-block');

            $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');

            $('#myApp33').find('textarea').attr('readonly','readonly').addClass('disabled-block');

            //新增按钮消失
            $('.zhiXingRenYuanButton').hide();

            //审核备注显示
            $('#myApp33').find('.shRemarks').show();

            $('#personTable1 tbody').children('tr').find('.option-shanchu').addClass('hiddenButton');



        }else{

            //可操作项(input\select\textarea\新增按钮\审核备注)
            $('#myApp33').find('input').removeAttr('readonly').removeClass('disabled-block');

            $('#myApp33').find('input').parent('.input-blockeds').removeClass('disabled-block');

            //$('#myApp33').find('select').attr('disabled',false).removeClass('disabled-block');

            $('#myApp33').find('textarea').removeAttr('readonly').removeClass('disabled-block');

            //新增按钮消失
            $('.zhiXingRenYuanButton').html('修改物品').show();

            //审核备注显示
            $('#myApp33').find('.shRemarks').show();

            //审核备注不可操作
            $('#myApp33').find('.shRemarks').find('textarea').attr('readonly','readonly').addClass('disabled-block');

            //$('#personTable1 tbody').children('tr').find('.option-shanchu').removeClass('hiddenButton');

        }

        //自动生成的不可操作
        $('#myApp33').find('.automatic').attr('readonly','readonly').addClass('disabled-block');

        //审核部分隐藏
        $('.shRemarks').hide();

    })

    //审核
    $('.main-contents-table .table tbody').on('click','.option-confirm',function(){

        RKDInit();

        //样式
        var $this = $(this).parents('tr');

        $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

        $this.addClass('tables-hover');

        //可操作项(input\select\textarea\新增按钮\审核备注)
        $('#myApp33').find('input').attr('readonly','readonly').addClass('disabled-block');

        $('#myApp33').find('input').parent('.input-blockeds').addClass('disabled-block');

        $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');

        $('#myApp33').find('textarea').attr('readonly','readonly').addClass('disabled-block');

        //新增按钮消失
        $('.zhiXingRenYuanButton').hide();

        //审核备注显示
        $('#myApp33').find('.shRemarks').show();

        //审核备注可操作
        $('#myApp33').find('.shRemarks').find('textarea').removeAttr('readonly').removeClass('disabled-block');

        $('#myApp33').find('.shRemarks').find('input').removeAttr('readonly').removeClass('disabled-block');

        $('#myApp33').find('.shRemarks').find('.input-blockeds').removeAttr('readonly').removeClass('disabled-block');

        //删除添加类
        $('#myModal').find('.confirm').removeClass('dengji').removeClass('shanchu').removeClass('bianji').addClass('shenhe');

        //获取当前入库单号的
        _moTaiKuang($('#myModal'), '审核', '', '' ,'', '审核');

        //绑定数据
        var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();

        _$thisRKnum = $thisDanhao;

        for(var i=0;i<_allData.length;i++){

            if(_allData[i].orderNum == $thisDanhao){

                //绑定数据
                putOutList.bianhao = _allData[i].orderNum;
                putOutList.rkleixing = _allData[i].outType;
                putOutList.gdCode = _allData[i].contractOrder;
                putOutList.clymc = _allData[i].cusName;
                putOutList.clydh = _allData[i].phone;
                putOutList.ckselect = _allData[i].storageNum;
                putOutList.zhidanren = _allData[i].createUser;

                var zhidanTime = '';

                if(_allData[i].createTime){

                    zhidanTime = _allData[i].createTime.split(' ')[0]

                }

                putOutList.shijian = zhidanTime;
                putOutList.remarks = _allData[i].remark;
                putOutList.shRemarks = _allData[i].auditMemo;
                //判断制单人和审核人是不是一样(相等的话是false)
                if(_allData[i].createUser == _userIdNum){
                    _examineRen = false;
                }else{
                    _examineRen = true;
                }
            }
        }

        //获取入库信息的详细物品信息
        function sucFun3(result){

            _rukuArr.length = 0;

            for(var i=0;i<result.length;i++){

                _rukuArr.push(result[i]);

            }

            _datasTable($('#personTable1'),result);

            //共计
            //数量
            var num = 0;

            //金额
            var amount = 0;

            for(var i=0;i<result.length;i++){

                num += Number(result[i].num);

                amount += Number(result[i].amount);

            }

            //赋值
            $('#personTable1 tfoot').find('.totalnum').html(num);

            $('#personTable1 tfoot').find('.count').html(amount.toFixed(2));

        }
        detailInfo($thisDanhao,sucFun3);

        $('#personTable1 tbody').children('tr').find('.option-shanchu').addClass('hiddenButton');

        //审核时间默认
        $('.touchingTime').val(moment().format('YYYY/MM/DD'));

    })

    //审核
    $('.main-contents-table .table tbody').on('click','.option-delete',function(){

        //可操作项(input\select\textarea\新增按钮\审核备注)
        $('#myApp33').find('input').attr('readonly','readonly').addClass('disabled-block');

        $('#myApp33').find('input').parent('.input-blockeds').addClass('disabled-block');

        $('#myApp33').find('select').attr('disabled',true).addClass('disabled-block');

        $('#myApp33').find('textarea').attr('readonly','readonly').addClass('disabled-block');

        //新增按钮消失
        $('.zhiXingRenYuanButton').hide();

        //审核备注显示
        $('#myApp33').find('.shRemarks').show();

        //删除添加类
        $('#myModal').find('.confirm').removeClass('dengji').removeClass('shanchu').removeClass('bianji').addClass('shenhe');

        //获取当前入库单号的
        _moTaiKuang($('#myModal3'), '确定要删除吗？', '', '' ,'', '删除');

        //样式
        var $this = $(this).parents('tr');

        $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

        $this.addClass('tables-hover');

        //绑定数据
        var $thisDanhao = $(this).parents('tr').find('.orderNum').children('a').html();
        _$thisRKnum = $thisDanhao;

        //绑定信息
        $('#ckabh').val(_$thisRKnum);

        $('#cklx').val($(this).parents('tr').children('.outType').html());

    })


    //第一层弹窗事件---------------------------------------------------------

    //新增出库物品按钮
    $('.zhiXingRenYuanButton').click(function(){

        console.log(_rukuArr);

        //首先验证仓库是否选择了
        if($('#ckselect').val() == ''){

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请先选择仓库！', '确定');

        }else{

            //模态框显示
            _moTaiKuang($('#myModal1'), '出库物品管理', '', '' ,'');

            //仓库下拉列表初始化
            ckList(_ckArr);

            //将_rukuArr 付给 _tempArr
            _tempRKArr.length = 0;

            for(var i=0;i<_rukuArr.length;i++){

                _tempRKArr.push(_rukuArr[i]);

            }

            //第二层弹窗初始化
            RKCPInit(true,_tempRKArr);

            //自动刷新一下库存数据
            goodsList();

            //仓库赋值，并且不能操作
            putOutGoods.ck = $('#ckselect').children('option:selected').html();

            $('#workDone').find('.cangku').attr('data-num',$('#ckselect').val());

            $('#workDone').find('.cangku').parent().addClass('disabled-block');

            $('#workDone').find('.cangku').attr('disabled',true).addClass('disabled-block');

            //遍历$('.pinzhixx').eq(0)里的ul，然后自动点一下
            var lis = $('.pinzhixx').eq(0).children();

            var attrs = $('#workDone').find('.cangku').attr('data-num');

            for(var i=0;i<lis.length;i++){

                if(attrs == lis.eq(i).attr('data-num')){

                    lis.eq(i).addClass('li-color');

                }

            }

            enterCK();

        }

    });

    //出库产品框显示之后的回调函数
    $('#myModal1').on('shown.bs.modal',function(){

        $('#workDone').find('.kuwei').focus();


    })

    //删除按钮
    //删除入库产品操作
    $('#personTable1 tbody')
        .on('click','.option-shanchu',function(){

            var $this = $(this).parents('tr');
            var bm = $this.find('.bianma').html();
            var ck = $this.find('.storageName').children('span').attr('data-num');
            var kq = $this.find('.localName').children('span').attr('data-num');
            var sn = $this.find('.sn').html();
            var gd = $this.find('.gdCode2').html();

            _tempObj.length = 0;

            for(var i=0;i<_rukuArr.length;i++){

                if(_rukuArr[i].itemNum == bm && _rukuArr[i].storageNum == ck && _rukuArr[i].localNum == kq && _rukuArr[i].sn == sn && _rukuArr[i].gdCode2 == gd){

                    _tempObj.push(_rukuArr[i]);

                }

            }

            _moTaiKuang($('#myModal2'), '提示', '', 'istap' ,'确定要删除吗？', '删除');

            //新添加类名，实现入库单操作；
            $('#myModal2').find('.btn-primary').removeClass('removeButton').addClass('xiaoShanchu');
        })

        .on('click','.option-see1',function(){

            _moTaiKuang($('#myModal6'), '出库产品详情', 'flag', '' ,'', '');

            var $thisCK = $(this).parents('tr').children('.storageName').children('span').attr('data-num');

            var $thisKQ = $(this).parents('tr').children('.localName').children('span').attr('data-num');

            var $thisBM = $(this).parents('tr').children('.bianma').html();

            var $thisSN = $(this).parents('tr').children('.sn').html();

            var $thisGD = $(this).parents('tr').children('.gdCode2').html();

            //获取详情赋值
            function sucFun3(result){

                for(var i=0;i<result.length;i++){

                    if( $thisCK == result[i].storageNum && $thisKQ == result[i].localNum && $thisBM == result[i].itemNum && $thisSN == result[i].sn && $thisGD == result[i].gdCode2 ){

                        chukuObject.ck = result[i].storageName;
                        chukuObject.bianhao = result[i].itemNum;
                        chukuObject.mingcheng = result[i].itemName;
                        chukuObject.size = result[i].size;
                        chukuObject.picked = result[i].isSpare;
                        chukuObject.goodsId = result[i].sn;
                        chukuObject.unit = result[i].unitName;
                        chukuObject.quality = result[i].batchNum;
                        chukuObject.warranty = result[i].maintainDate;
                        chukuObject.num = result[i].num;
                        chukuObject.outPrice = result[i].outPrice;
                        chukuObject.amount = result[i].amount;
                        chukuObject.gdCode = result[i].gdCode2;
                        chukuObject.chezhan = result[i].bxKeshi;
                        chukuObject.remark = result[i].outMemo;

                    }

                }

                if(chukuObject.picked == 0){
                    $('.durable').parent('span').removeClass('checked');
                    $('.durable').parent('span').eq(1).addClass('checked');
                }else{
                    $('.durable').parent('span').removeClass('checked');
                    $('.durable').parent('span').eq(0).addClass('checked');
                }
            }
            //所有信息不可编辑
            $('#chukuObject').find('.gdList').children('.input-blockeds').addClass('disabled-block');
            $('#chukuObject').find('.gdList').children('.input-blockeds').children('input').addClass('disabled-block').attr('readonly','readonly');
            detailInfo(_$thisRKnum,sucFun3);

        })
    //确定删除
    //入库产品删除操作按钮
    $('#myModal2').on('click','.xiaoShanchu',function(){

        _rukuArr.remove(_tempObj[0]);

        _datasTable($('#personTable1'),_rukuArr);

        //共计
        //数量
        var num = 0;

        var amount = 0;

        for(var i=0;i<_rukuArr.length;i++){

            num += Number(_rukuArr[i].num);

            amount += Number(_rukuArr[i].amount);

        }

        $('#personTable1 tfoot').find('.totalnum').html(num);

        $('#personTable1 tfoot').find('.count').html(amount.toFixed(2));

        $('#myModal2').modal('hide');

        $(this).removeClass('xiaoShanchu');
    })


    //第二层弹窗事件---------------------------------------------------------
    //点击其他地方，所有下拉列表消失；
    $(document).click(function(){
        $('.hidden1').hide();
    });

    //回车换input事件
    $('.inputType').keyup(function(e){
        var e = e||window.event;
        if(e.keyCode == 13){

            if( $(this).parents('.gdList').next('li').find('.inputType').attr('id') == 'addRK' ){

                addTable();

            }else{
                $(this).parents('.gdList').next('li').find('.inputType').focus();

            }
        }
    });

    //点击事件
    //点击状态下出现选项
    $('.selectBlock').click(function(e){

        if($(this).parent('.input-blockeds').hasClass('disabled-block')){
            return false;
        }else{
            var e = event || window.event;
            var this1 = $(this);
            if(this1.next()[0].style.display == 'none'){
                this1.next().show();
            }else if(this1.next()[0].style.display != 'none'){
                this1.next().hide();
            }
            e.stopPropagation();
        }
    });

    //仓库点击事件
    $('.pinzhixx').eq(0).on('click','li', function(){

            enterCK();

        })


    //库区点击事件
    $('.kuqu-list').eq(0).on('click','li',function(){

        enterKQ();

    })

    //物品编码
    $('.accord-with-list').eq(0).on('click','li',function(){

        enterBM();

    })

    //物品名称
    $('.accord-with-list').eq(1).on('click','li',function(){

        enterMC();

    })

    //物品序列号
    $('.accord-sn-list').on('click','li',function(){

        enterSN();

    })

    //工单号
    $('.pinzhixx').eq(1).on('click','li',function(){

        enterGD();

    })

    //所有下拉框的mouseover事件
    $('#workDone').find('.hidden1').on('mouseover','li',function(){

        mouseoverFun($(this));

    })

    //添加
    $('#addRK').click(function(){

        addTable();

    })

    //重置
    $('#addReset').click(function(){

        RKCPInit(false,_tempRKArr);

    })

    $('#wuPinListTable1 tbody')
        .on('click','.option-shanchu',function(){

            var $this = $(this).parents('tr');
            var bm = $this.find('.bianma').html();
            var ck = $this.find('.storageName').children('span').attr('data-num');
            var kq = $this.find('.localName').children('span').attr('data-num');
            var sn = $this.find('.sn').html();

            _tempObj.length = 0;

            for(var i=0;i<_tempRKArr.length;i++){

                if(_tempRKArr[i].itemNum == bm && _tempRKArr[i].storageNum == ck && _tempRKArr[i].localNum == kq && _tempRKArr[i].sn == sn){

                    _tempObj.push(_tempRKArr[i]);

                }

            }

            _moTaiKuang($('#myModal2'),'提示', '', 'istap' ,'确定要删除吗？', '删除');
            //新添加类名，实现入库单操作；
            $('#myModal2').find('.btn-primary').removeClass('xiaoShanchu').addClass('removeButton');

            event.stopPropagation();
        })
        //点击表格中的数据，将内容赋值给onput，以便编辑
        .on('click','.option-bianji',function(){

            $(this).html('保存').removeClass('option-bianji').addClass('option-save');

            //编辑的时候，仓库、库区、物品信息都不能修改。
            $('.not-editable').attr('readonly','readonly').addClass('disabled-block');

            $('.not-editable').parents('.input-blockeds').addClass('disabled-block');

            //编辑的时候，工单号也不能修改
            $('#workDone').find('.gdCode').parents('.input-blockeds').attr('readonly','readonly').addClass('disabled-block');

            $('#workDone').find('.gdCode').attr('readonly','readonly').addClass('disabled-block');

            //样式修改
            $('#wuPinListTable1 tbody').children('tr').css({'background':'#ffffff'});

            var $this = $(this).parents('tr');

            $this.css({'background':'#FBEC88'});

            var bm = $this.find('.bianma').html();
            var ck = $this.find('.storageName').children('span').attr('data-num');
            var kq = $this.find('.localName').children('span').attr('data-num');
            var sn = $this.find('.sn').html();
            var gd = $this.find('.gdCode2').html();
            var cz = $this.find('.station1').children().attr('data-num');


            for(var i=0;i<_tempRKArr.length;i++){
                if(_tempRKArr[i].itemNum == bm && _tempRKArr[i].storageNum == ck && _tempRKArr[i].localNum == kq && _tempRKArr[i].sn == sn && _tempRKArr[i].gdCode2 == gd && cz == _tempRKArr[i].bxKeshiNum){

                    //赋值
                    putOutGoods.bianhao = _tempRKArr[i].itemNum;
                    putOutGoods.mingcheng = _tempRKArr[i].itemName;
                    putOutGoods.size = _tempRKArr[i].size;
                    putOutGoods.picked = _tempRKArr[i].isSpare;
                    if(putOutGoods.picked == 0){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(1).addClass('checked');
                    }else if(putOutGoods.picked == 1){
                        $('.inpus').parent('span').removeClass('checked');
                        $('.inpus').parent('span').eq(0).addClass('checked');
                    }
                    putOutGoods.kuwei = _tempRKArr[i].localName;
                    putOutGoods.goodsId = _tempRKArr[i].sn;
                    putOutGoods.unit = _tempRKArr[i].unitName;
                    putOutGoods.quality = _tempRKArr[i].batchNum;
                    putOutGoods.warranty = _tempRKArr[i].maintainDate;
                    putOutGoods.num = _tempRKArr[i].num;
                    putOutGoods.outPrice = _tempRKArr[i].outPrice;
                    putOutGoods.amount = _tempRKArr[i].amount;
                    putOutGoods.remark = _tempRKArr[i].outMemo;
                    putOutGoods.gdCode = _tempRKArr[i].gdCode2;
                    putOutGoods.chezhan = _tempRKArr[i].bxKeshi;

                    if(_tempRKArr[i].shengyu){

                        putOutGoods.redundant = _tempRKArr[i].shengyu;

                    }else{

                        for(var j=0;j<_wpListArr.length;j++){

                            if(_wpListArr[j].itemNum == bm && _wpListArr[j].storageNum == ck && _wpListArr[j].localNum == kq && _wpListArr[j].sn == sn){

                                putOutGoods.redundant = _wpListArr[j].num;

                            }

                        }

                    }


                    putOutGoods.ck = _tempRKArr[i].storageName;
                    $('.cangku').attr('data-num',_tempRKArr[i].storageNum);
                    $('.cangku').attr('data-name',_tempRKArr[i].storageName);
                    $('.kuwei').attr('data-num',_tempRKArr[i].localNum);

                    if(_tempRKArr[i].gdCode != null){

                        $('.gdCode').attr('gdcode',_tempRKArr[i].gdCode);

                        $('.chezhan').attr('data-name',_tempRKArr[i].bxKeshi);

                        $('.chezhan').attr('data-num',_tempRKArr[i].bxKeshiNum);

                        putOutGoods.chezhan = _tempRKArr[i].bxKeshi;

                    }else{

                        for(var j=0;j<_gdArr.length;j++){

                            if(_gdArr[j].gdCode2 == _tempRKArr[i].gdCode2){

                                $('.gdCode').attr('gdcode',_gdArr[j].gdCode);

                                $('.chezhan').attr('data-num',_gdArr[j].bxKeshiNum);

                                $('.chezhan').attr('data-name',_gdArr[j].bxKeshi);

                                putOutGoods.chezhan = _gdArr[j].bxKeshi;

                            }

                        }

                    }

                    $('.chezhan').attr('data-num',_tempRKArr[i].bxKeshiNum);

                    $('.chezhan').attr('data-name',_tempRKArr[i].bxKeshi);

                }
            }
        })
        //编辑之后，保存
        .on('click','.option-save',function(){

            if(putOutGoods.ck == '' || putOutGoods.bianhao == '' || putOutGoods.mingcheng == '' || putOutGoods.num == '' || putOutGoods.outPrice == '' || putOutGoods.amount == ''){
                //提示框
                _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,'请填写红色必填项!', '');
            }else{
                var $this = $(this).parents('tr');
                var bm = $this.find('.bianma').html();
                var ck = $this.find('.storageName').children('span').attr('data-num');
                var kq = $this.find('.localName').children('span').attr('data-num');
                var sn = $this.find('.sn').html();
                var gd = $this.find('.gdCode2').html();
                for(var i=0;i<_tempRKArr.length;i++){
                    if(_tempRKArr[i].itemNum == bm && _tempRKArr[i].storageNum == ck && _tempRKArr[i].localNum == kq && _tempRKArr[i].sn == sn && _tempRKArr[i].gdCode2 == gd){

                        console.log()
                        _tempRKArr[i].num = putOutGoods.num;
                        _tempRKArr[i].outPrice = putOutGoods.outPrice;
                        _tempRKArr[i].amount = putOutGoods.amount;
                        _tempRKArr[i].gdCode2 = putOutGoods.gdCode;
                        _tempRKArr[i].bxKeshi = $('.chezhan').attr('data-name');
                        _tempRKArr[i].bxKeshiNum = $('.chezhan').attr('data-num');
                        _tempRKArr[i].storageName = $('.cangku').attr('data-name');
                        _tempRKArr[i].storageNum = $('.cangku').attr('data-num');
                        _tempRKArr[i].outMemo = putOutGoods.remark;
                    }
                }

                _datasTable($('#wuPinListTable1'),_tempRKArr);
                //编辑之后清空
                RKCPInit(false,_tempRKArr);
            }
        })

    //第二层弹窗删除
    $('#myModal2').on('click','.removeButton',function(){
        //静态删除

        _tempRKArr.remove(_tempObj[0]);

        _datasTable($('#wuPinListTable1'),_tempRKArr);

        //共计
        //数量
        var num = 0;

        var amount = 0;

        for(var i=0;i<_tempRKArr.length;i++){

            num += Number(_tempRKArr[i].num);

            amount += Number(_tempRKArr[i].amount);

        }

        $('#wuPinListTable1 tfoot').find('.amount1').html(num);

        $('#wuPinListTable1 tfoot').find('.count1').html(amount.toFixed(2));

        $('this').removeClass('removeButton');

        $('#myModal2').modal('hide');
    });

    //增加入库单操作(仅仅是全端静态操作，没有涉及数据库)
    $('#myModal1').on('click','.ruku',function(){

        $('#myModal1').modal('hide');

        _rukuArr.length = 0;

        for(var i=0;i<_tempRKArr.length;i++){

            _rukuArr.push(_tempRKArr[i]);

        }

        _datasTable($('#personTable1'),_rukuArr);

        //共计
        //数量
        var num = 0;

        var amount = 0;

        for(var i=0;i<_rukuArr.length;i++){

            num += Number(_rukuArr[i].num);

            amount += Number(_rukuArr[i].amount);

        }

        $('#personTable1 tfoot').find('.totalnum').html(num);

        $('#personTable1 tfoot').find('.count').html(amount.toFixed(2));


        $('#personTable1 tbody').children('tr').find('.option-see1').addClass('hiddenButton');

        if(_tempRKArr.length == 0){

            $('#ckselect').attr('disabled',false).removeClass('disabled-block');

        }else{

            $('#ckselect').attr('disabled',true).addClass('disabled-block');

        }

    })

    //第三层工单--------------------------------------------------------------
    //点击放大镜，获取工单弹出框
    $('.fdjImg').click(function(){

        //初始化
        $('#gdzt').val(0);

        $('#gdcode').val('');

        $('.gdTime').eq(0).val(gdTimeST);

        $('.gdTime').eq(1).val(gdTimeET);

        $('.returnEmpty').val('');

        //材料申请是否已审批（默认已审批）
        $('#isExamine').parent('span').removeClass('checked');

        GDselect($('#gdzt').val());

        _moTaiKuang($('#myModal7'), '工单', '', '' ,'', '确定');

    })

    //工单条件查询
    $('#selectedGD').click(function(){

        GDselect($('#gdzt').val());

    })

    //工单条件选择
    $('#isExamine').click(function(){

        if( $(this).parent('.checked').length == 0 ){

            $(this).parent('span').addClass('checked');

        }else{

            $(this).parent('span').removeClass('checked');

        }

    })

    //工单选择
    $('#gdTable tbody').on('click','tr',function(){

        $('#gdTable tbody').find('tr').removeClass('tables-hover');

        $(this).addClass('tables-hover');

    })

    $('.rukuGD').click(function(){

        var gd = $('#gdTable tbody').find('.tables-hover');

        putOutGoods.gdCode = gd.children('.gdCodes').children().html();

        $('.gdCode').attr('gdCode',gd.children('.gdCodes').children().attr('data-gdcode'));

        putOutGoods.chezhan = gd.children('.bxKS').html();

        $('.chezhan').attr('data-name',gd.children('.bxKS').html());

        $('.chezhan').attr('data-num',gd.children('.gdCodes').children().attr('data-czcode'));

        $('#myModal7').modal('hide');
    });

    //选择车站
    $('#station-table tbody').on('click','tr',function(){

        //样式
        $('#station-table tbody').children().removeClass('tables-hover');

        $(this).addClass('tables-hover');

    })

    //确定选中的车站，赋值
    $('#station-modal').on('click','.btn-primary',function(){

        var thisRow = $('#station-table tbody').children('.tables-hover')

        var num = thisRow.children('td').eq(1).html();

        var name = thisRow.children('td').eq(0).html();

        //模态框消失
        $('#station-modal').modal('hide');

        //赋值
        $('#workDone').find('.chezhan').attr('data-name',name);

        $('#workDone').find('.chezhan').attr('data-num',num);

        //赋值
        putOutGoods.chezhan = name;

    })


    //选择出库物品，第四层弹窗-----------------------------------------------------------
    $('.tianJiaruku').click(function(){

        //初始化
        $('.filterInput1').val('');

        $('#ckSelect1').val('');

        _moTaiKuang($('#myModal4'), '选择出库物品列表', '', '' ,'', '确定');

        goodsSelect();

    });

    //条件查询
    $('#selected1').click(function(){

        goodsSelect();

    });

    //选择物品列表
    $('#wuPinListTable tbody').on('click','tr',function(){

        $('#wuPinListTable tbody').children('tr').removeClass('tables-hover');

        $(this).addClass('tables-hover');

        //通过物品编码，名称，序列号，规格，剩余数量来比较
        _wpObject.bm = $(this).children('.bianma').html();
        _wpObject.mc = $(this).children('.mingcheng').html();
        _wpObject.sn = $(this).children('.xuliehao').html();
        _wpObject.size = $(this).children('.size').html();
        _wpObject.cangku = $(this).children('.cangku').html();
        _wpObject.isSpare = $(this).children('.isSpare').html();
        _wpObject.num = $(this).children('.num').html();
        _wpObject.cangkuNum = $(this).children('.cangkuNum').html();

    });

    $('#myModal4').find('.btn-primary').on('click',function(){

        //初始化一次
        RKCPInit(true,_tempRKArr);

        for(var i=0;i<_wpListArr.length;i++){
            if(_wpListArr[i].itemNum == _wpObject.bm && _wpListArr[i].itemName == _wpObject.mc && _wpListArr[i].sn == _wpObject.sn && _wpListArr[i].size == _wpObject.size && _wpListArr[i].storageName == _wpObject.cangku && _wpListArr[i].num == _wpObject.num){
                //赋值
                putOutGoods.goodsId = _wpListArr[i].sn;
                putOutGoods.bianhao = _wpListArr[i].itemNum;
                putOutGoods.mingcheng = _wpListArr[i].itemName;
                putOutGoods.size = _wpListArr[i].size;
                putOutGoods.picked = _wpListArr[i].isSpare;
                putOutGoods.unit = _wpListArr[i].unitName;
                putOutGoods.quality = _wpListArr[i].batchNum;
                putOutGoods.warranty = _wpListArr[i].maintainDate;
                putOutGoods.redundant = _wpListArr[i].num;
                putOutGoods.ck = _wpListArr[i].storageName;
                $('.cangku').attr('data-num',_wpListArr[i].storageNum);
                $('.cangku').attr('data-name',_wpListArr[i].storageName);
                var outPrice = '';
                if(_wpListArr[i].num == 0){
                    outPrice = 0;
                }else{
                    outPrice = parseFloat(_wpListArr[i].amount)/parseFloat(_wpListArr[i].num)
                }
                putOutGoods.outPrice = formatNumber(outPrice);
                //库区赋值
                $('.kuwei').attr('data-num',_wpListArr[i].localNum);
                putOutGoods.kuwei = _wpListArr[i].localName;
                if(putOutGoods.picked == 0){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(1).addClass('checked');
                    //数量自动填写
                    putOutGoods.num = '';

                    $('.number1').removeAttr('readonly').removeClass('disabled-block');

                    $('.number1').parents('.input-blockeds').removeClass('disabled-block');

                    putOutGoods.amount = '';

                }else if(putOutGoods.picked == 1){
                    $('.inpus').parent('span').removeClass('checked');
                    $('.inpus').parent('span').eq(0).addClass('checked');
                    //数量自动填写
                    putOutGoods.num = 1;

                    $('.number1').attr('readonly','readonly').addClass('disabled-block');

                    $('.number1').parents('.input-blockeds').addClass('disabled-block');

                    //总金额自动填写
                    var amount = Number(putOutGoods.outPrice) * Number(putOutGoods.num);

                    putOutGoods.amount = formatNumber(amount);
                }
            }
        }
        $('#myModal4').modal('hide');
    });

    //单价查看历史
    $('#historical-record').click(function(){

        //模态框
        _moTaiKuang($('#outPrince-modal'),'物品明细','flag','','','');

        //调用接口
        $.ajax({

            type:'post',
            url:_urls + 'YWCK/ywCKRptInventory',
            data:{
                itemNum:putOutGoods.bianhao,
                storageNum:$('.cangku').attr('data-num'),
                localNum:$('.kuwei').attr('data-num'),
                hasNum:1,
                userID:_userIdNum,
                userName:_userIdName
            },
            success:function(result){

                _datasTable($('#outPrince-table'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    })

    /*--------------------------------------------------其他方法---------------------------------------------------------*/
    //功能性方法-----------------------------------------------------------------------------
    //仓库下拉列表初始化(flag标识完全符合项)
    function ckList(arr,flag){

        var str = '';

        if(flag){

            for(var i=0;i<arr.length;i++){

                str +='<li class="li-color" data-num="' + arr[i].storageNum + '"data-name="' + arr[i].storageName +
                            '">' + arr[i].storageName + '</li>'

            }

        }else{

            for(var i=0;i<arr.length;i++){

                str +='<li data-num="' + arr[i].storageNum + '"data-name="' + arr[i].storageName +
                            '">' + arr[i].storageName + '</li>'
            }

        }

        $('#workDone').find('.pinzhixx').eq(0).empty().append(str);


    }

    //库区下拉列表初始化(flag标识完全符合项)
    function kqList(arr,flag){
        var str = '';

        if( flag ){

            for(var i=0;i<arr.length;i++){

                str += '<li class="li-color" data-num="' + arr[i].localNum + '">' + arr[i].localName + '</li>'

            }

        }else{

            for(var i=0;i<arr.length;i++){

                str += '<li data-num="' + arr[i].localNum + '">' + arr[i].localName + '</li>'

            }

        }

        $('#workDone').find('.kuqu-list').empty().append(str);
    }

    //物品下拉列表初始化(flag标识完全符合项)
    function wpList(arr,flag){

        var str = '';
        if(flag){

            for(var i=0;i<arr.length;i++){
                str += '<li class="li-color" data-amount="' + arr[i].amount +
                    '" data-num="' + arr[i].num +
                    '" data-durable="' + arr[i].isSpare +
                    '"' + 'data-unit="' + arr[i].unitName +
                    '"data-quality="' + arr[i].batchNum +
                    '"data-maintainDate="' +  arr[i].maintainDate +
                    '"' + 'data-sn="' + arr[i].sn +
                    '"' + 'data-shengyu="' + arr[i].num +
                    '"' +
                    '>' + '<span class="dataNum">' + arr[i].itemNum +'</span>' +
                    '<span class="dataName" style="margin-left: 5px;">' +  arr[i].itemName +'</span>' +
                    '<span class="dataSize" style="margin-left: 5px;">' +
                    arr[i].size+'</span>' + '<span style="margin-left: 5px;">' + arr[i].localName +
                    '</span>' +
                    '</li>';
            }

        }else{

            for(var i=0;i<arr.length;i++){
                str += '<li data-amount="' + arr[i].amount +
                    '"data-num="' + arr[i].num +
                    '" data-durable="' + arr[i].isSpare +
                    '"' + 'data-unit="' + arr[i].unitName +
                    '"data-quality="' + arr[i].batchNum +
                    '"data-maintainDate="' +  arr[i].maintainDate +
                    '"' + 'data-sn="' + arr[i].sn +
                    '"' + 'data-shengyu="' + arr[i].num +
                    '"' +
                    '>' + '<span class="dataNum">' + arr[i].itemNum +'</span>' +
                    '<span class="dataName" style="margin-left: 5px;">' +  arr[i].itemName +'</span>' +
                    '<span class="dataSize" style="margin-left: 5px;">' +
                    arr[i].size+'</span>' + '<span style="margin-left: 5px;">' + arr[i].localName +
                    '</span>' +
                    '</li>';
            }

        }

        $('#workDone').find('.accord-with-list').eq(0).empty().append(str);

        $('#workDone').find('.accord-with-list').eq(1).empty().append(str);
    }

    //序列号下拉列表初始化(flag标识完全符合项)
    function snList(arr,flag){

        var str = '';
        var snStr = '';
        var isSpareStr = '';
        for(var i=0;i<arr.length;i++){
            if(arr[i].sn == ''){
                snStr = ' ';
            }else{
                snStr = arr[i].sn;
            }
            if(arr[i].isSpare == 0){
                isSpareStr = '消耗品';
            }else if(arr[i].isSpare == 1){
                isSpareStr = '耐用品';
            }

            if(flag){

                str += '<li class="li-color" data-amount="' + arr[i].amount+
                    '"data-size="' + arr[i].size +
                    '"data-unit="' + arr[i].unitName + '"data-quality="' + arr[i].batchNum +
                    '"data-warranty="' + arr[i].maintainDate +'"'+
                    '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + arr[i].isSpare +
                    '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + arr[i].num + '</span>' +
                    '<span class="dataStorageName" style="margin-left: 10px;">' + arr[i].storageName +
                    '</span>'+ '<span style="margin: 0 10px;">' + arr[i].batchNum +
                    '</span>'+ '<span>' + arr[i].localName +
                    '</span>'
                    +'</li>';

            }else{

                str += '<li data-amount="' + arr[i].amount+
                    '"data-size="' + arr[i].size +
                    '"data-unit="' + arr[i].unitName + '"data-quality="' + arr[i].batchNum +
                    '"data-warranty="' + arr[i].maintainDate +'"'+
                    '><label>序列号</label><span class="dataSn">' + snStr + '</span>' + '<span data-isSpare="' + arr[i].isSpare +
                    '"class="dataIsSpare" style="margin: 0 10px;">' + isSpareStr + '</span>' +'<label>数量</label><span class="dataNum">' + arr[i].num + '</span>' +
                    '<span class="dataStorageName" style="margin-left: 10px;">' + arr[i].storageName +
                    '</span>'+ '<span style="margin: 0 10px;">' + arr[i].batchNum +
                    '</span>'+ '<span>' + arr[i].localName +
                    '</span>'
                    +'</li>';

            }


        }
        $('.accord-sn-list').empty().append(str);


    }

    //工单下拉列表初始化（arr，flag）
    function gdsList(arr,flag){
        var str = '';


        if(flag){

            for(var i=0;i<arr.length;i++){

                str += '<li class="li-color" data-dds="' + arr[i].bxKeshiNum +
                    '"data-ddsName="' + arr[i].bxKeshi +
                    '" data-gd="' + arr[i].gdCode +
                    '">' +'<span class="dataGD">' +
                    arr[i].gdCode2 +'</span><span style="margin:0 10px;">' + arr[i].wxClNames +
                    '</span>' + '<span>' + arr[i].bxKeshi +
                    '</span>' + '</li>';
            }

        }else{

            for(var i=0;i<arr.length;i++){

                str += '<li data-dds="' + arr[i].bxKeshiNum +
                    '"data-ddsName="' + arr[i].bxKeshi +
                    '" data-gd="' + arr[i].gdCode +
                    '">' +'<span class="dataGD">' +
                    arr[i].gdCode2 +'</span><span style="margin:0 10px;">' + arr[i].wxClNames +
                    '</span>' + '<span>' + arr[i].bxKeshi +
                    '</span>' + '</li>';
            }

        }



        $('#workDone').find('.pinzhixx').eq(1).empty().append(str);
    }

    //格式化数字，排除infinity NaN 其他格式
    function formatNumber(num){
        if(num===Infinity){
            return 0.00;
        }
        if(+num===num){
            return num.toFixed(2);
        }
        return 0.00;
    }

    //根据工单号，获得备件详细信息
    function detailInfo(num,seccessFun){
        var prm = {
            'orderNum':num,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorageDetail',
            data:prm,
            timeout:_theTimes,
            async:false,
            beforeSend: function () {

                $('#theLoading').modal('show');
            },
            complete: function () {

                $('#theLoading').modal('hide');

            },
            success:function(result){
                seccessFun(result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //删除方法
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };


    //键盘事件封装-----------------------------------------------------------------------------------------------------------
    function upDown(ul,enterFun,inputFun){

        var e = e||window.event;

        var chils = ul.children();

        var lengths = 0;

        lengths = chils.length;

        //ul.show();

        if(e.keyCode == 40){

            if(_numIndex < lengths -1){

                _numIndex ++ ;

            }else{

                _numIndex = lengths -1;

            }

            ul.children().removeClass('li-color');

            ul.children().eq(_numIndex).addClass('li-color');

            //滚动条问题
            if(_numIndex> 4){

                var moveDis = (_numIndex - 4)*26;

                ul.scrollTop(moveDis);
            }

        }else if(e.keyCode == 38){

            if(_numIndex < 1){

                _numIndex =0;

            }else{

                _numIndex--;

            }

            ul.children().removeClass('li-color');

            ul.children().eq(_numIndex).addClass('li-color');

            //滚动条问题
            if(lengths-4>_numIndex){

                var moveDis = (_numIndex - 4)*26;

                ul.scrollTop(moveDis);

            }

        }else if(e.keyCode == 13){

            enterFun();

        }else if(e != 9){

            _numIndex = -1;

            inputFun();

        }
    }

    //输入事件
    function inputFun(value,_arr,attr,el,fun){

        var searchValue = $.trim(value);

        var isOnly = false;

        var arr = [];

        for(var i=0;i<_arr.length;i++){

            //完全相同
            if(searchValue == $.trim(_arr[i][attr])){

                isOnly = true;

                arr.push(_arr[i]);

            }else{

                if($.trim(_arr[i][attr]).indexOf(searchValue)>=0 ){

                    arr.push(_arr[i]);

                }

            }

        }


        if(isOnly){

            if(arr.length == 1){
                fun(arr,true);
            }else{
                fun(arr,false);
            }


        }else{

            fun(arr,false);

        }

        if(arr.length >0 ){

            el.show();

        }else{

            el.hide();

        }


    }

    //仓库回车事件
    var enterCK = function(){

        //首先清空后边所有相
        //RKCPInit(true,_tempRKArr);

        var color = $('#workDone').find('.pinzhixx').eq(0);

        var checkedLi = color.children('.li-color');


        //赋值
        putOutGoods.ck = checkedLi.attr('data-name');

        $('.cangku').attr('data-num',checkedLi.attr('data-num'));

        //确定库区的下拉列表
        reservoir(checkedLi.attr('data-num'));

        //确定物品编码
        _filterWPList.length = 0;

        for(var i=0;i<_wpListArr.length;i++){
            //仓库和库区都一致才可以
            if(_wpListArr[i].storageNum == $('.cangku').attr('data-num') && _wpListArr[i].localNum == '' ){

                _filterWPList.push(_wpListArr[i]);

            }

        }

        wpList(_filterWPList,$('#workDone').find('.accord-with-list'));


        //仓库下拉列表消失
        color.hide();

        _numIndex = -1;
    }

    //仓库输入事件(类似，用传参的方式实现)

    var inputCK = function(){

        inputFun(putOutGoods.ck,_ckArr,'storageName',$('#workDone').find('.pinzhixx').eq(0),ckList);

    }

    //库区回车事件
    var enterKQ = function(){

        var color = $('#workDone').find('.kuqu-list').eq(0);

        var checkedLi = color.children('.li-color');

        //赋值
        putOutGoods.kuwei =  checkedLi.html();

        $('#workDone').find('.kuwei').attr('data-num',checkedLi.attr('data-num'));

        //确定物品下拉列表
        _filterWPList.length = 0;

        for(var i=0;i<_wpListArr.length;i++){
            //仓库和库区都一致才可以
            if(_wpListArr[i].storageNum == $('.cangku').attr('data-num') && _wpListArr[i].localNum == $('.kuwei').attr('data-num') ){

                _filterWPList.push(_wpListArr[i]);

            }

        }

        wpList(_filterWPList,false);


        color.hide();

        _numIndex = -1;

    }

    //库区输入事件
    var inputKQ = function(){

        inputFun(putOutGoods.kuwei,_kqArr,'localName',$('#workDone').find('.kuqu-list').eq(0),kqList);

    }

    //物品输入事件
    var inputBM = function(){

        inputFun(putOutGoods.bianhao,_filterWPList,'itemNum',$('#workDone').find('.accord-with-list').eq(0),wpList);

        $('#workDone').find('.accord-with-list').eq(1).hide();

    }

    //物品名称输入事件
    var inputMC = function(){

        inputFun(putOutGoods.mingcheng,_filterWPList,'itemName',$('#workDone').find('.accord-with-list'),wpList);

        $('#workDone').find('.accord-with-list').eq(0).hide();

    }

    var enterMC = function(){

        RKCPInit(false,_tempRKArr);

        var color = $('#workDone').find('.accord-with-list').eq(1);

        var checkedLi = color.children('.li-color');

        //赋值
        putOutGoods.bianhao = checkedLi.children('.dataNum').html();

        putOutGoods.mingcheng = checkedLi.children('.dataName').html();

        //确定序列号列表（仓库，名字，编码）
        _snArr.length = 0;

        for(var i=0;i<_filterWPList.length;i++){

            if( $('.cangku').attr('data-num') == _filterWPList[i].storageNum && $('.kuwei').attr('data-num') == _filterWPList[i].localNum && putOutGoods.bianhao == _filterWPList[i].itemNum ){

                _snArr.push(_filterWPList[i]);

            }


        }

        if(_snArr.length == 1){

            snList(_snArr,true);

            //直接赋值
            putOutGoods.goodsId = checkedLi.attr('data-sn');

            putOutGoods.size = checkedLi.children('.dataSize').html();

            putOutGoods.picked = checkedLi.attr('data-durable');

            putOutGoods.unit = checkedLi.attr('data-unit');

            putOutGoods.quality = checkedLi.attr('data-quality');

            putOutGoods.warranty = checkedLi.attr('data-maintaindate');

            putOutGoods.redundant = checkedLi.attr('data-shengyu');

            if( putOutGoods.picked == 0 ){

                $('.inpus').parent('span').removeClass('checked');

                $('.inpus').parent('span').eq(1).addClass('checked');

                //数量自填
                putOutGoods.num = '';

                $('.number1').removeAttr('readonly').removeClass('disabled-block');

                $('.number1').parent('.input-blockeds').removeClass('disabled-block');

                //聚焦到工单选择
                setTimeout(function(){

                    $('#workDone').find('.number1').focus();

                },600)

            }else{

                $('.inpus').parent('span').removeClass('checked');

                $('.inpus').parent('span').eq(0).addClass('checked');

                //数量必须为1，并且不可操作
                putOutGoods.num = 1;

                $('.number1').attr('readonly','readonly').addClass('disabled-block');

                $('.number1').parent('.input-blockeds').addClass('disabled-block');

                //聚焦到工单选择
                setTimeout(function(){

                    $('#workDone').find('.gdCode').focus();

                },600)

            }

            var outPrice = 0;

            //计算物品单价
            if( Number(checkedLi.attr('data-num')) != 0 ){

                outPrice = Number(checkedLi.attr('data-amount')) / Number(checkedLi.attr('data-num'));

            }

            putOutGoods.outPrice = formatNumber(Number(outPrice));


        }else{

            snList(_snArr,false);

        }

        //编码影响工单号
        //console.log(_gdArr);

        //更改车站列表
        var str1 = '';

        var eligibleArr = [];

        var inconformityArr =[];
        //首先判断的是每个工单的材料id
        for(var i=0;i<_gdArr.length;i++){

            if(_gdArr[i].wxClIds){

                //将工单中缺某个选择出来
                var arrSplit = _gdArr[i].wxClIds.split(',');

                for(var j=0;j<arrSplit.length;j++){

                    if(putOutGoods.bianhao == arrSplit[j]){

                        eligibleArr.push(_gdArr[i]);

                    }
                }

                inconformityArr.push(_gdArr[i]);

            }
        }

        for(var i=0;i<eligibleArr.length;i++){
            str1 += '<div data-dds="' + eligibleArr[i].bxKeshiNum +
                '"data-ddsName="' + eligibleArr[i].bxKeshi +
                '" data-gd="' + eligibleArr[i].gdCode +
                '" style="background: #f5d38c;">' +'<span class="dataGD">' +
                eligibleArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + eligibleArr[i].wxClNames +
                '</span>' + '<span>' + eligibleArr[i].bxKeshi +
                '</span>' + '</div>';
        }
        for(var i=0;i<eligibleArr.length;i++){

            inconformityArr.removeByValue(eligibleArr[i].gdCode2,'gdCode2');

        }
        for(var i=0;i<inconformityArr.length;i++){

            str1 += '<div data-dds="' + inconformityArr[i].bxKeshiNum +
                '"data-ddsName="' + inconformityArr[i].bxKeshi +
                '" data-gd="' + inconformityArr[i].gdCode +
                '">' +'<span class="dataGD">' +
                inconformityArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + inconformityArr[i].wxClNames +
                '</span>' + '<span>' + inconformityArr[i].bxKeshi +
                '</span>' + '</div>';

        }

        $('.pinzhixx').eq(1).empty().append(str1);

        color.hide();

        _numIndex = -1;

    }

    //物品回车事件
    var enterBM = function(){

        RKCPInit(false,_tempRKArr);

        var color = $('#workDone').find('.accord-with-list').eq(0);

        var checkedLi = color.children('.li-color');

        //赋值
        putOutGoods.bianhao = checkedLi.children('.dataNum').html();

        putOutGoods.mingcheng = checkedLi.children('.dataName').html();

        //确定序列号列表（仓库，名字，编码）
        _snArr.length = 0;

        for(var i=0;i<_filterWPList.length;i++){

            if( $('.cangku').attr('data-num') == _filterWPList[i].storageNum && $('.kuwei').attr('data-num') == _filterWPList[i].localNum && putOutGoods.bianhao == _filterWPList[i].itemNum ){

                _snArr.push(_filterWPList[i]);

            }


        }

        if(_snArr.length == 1){

            snList(_snArr,true);

            //直接赋值
            putOutGoods.goodsId = checkedLi.attr('data-sn');

            putOutGoods.size = checkedLi.children('.dataSize').html();

            putOutGoods.picked = checkedLi.attr('data-durable');

            putOutGoods.unit = checkedLi.attr('data-unit');

            putOutGoods.quality = checkedLi.attr('data-quality');

            putOutGoods.warranty = checkedLi.attr('data-maintaindate');

            putOutGoods.redundant = checkedLi.attr('data-shengyu');

            if( putOutGoods.picked == 0 ){

                $('.inpus').parent('span').removeClass('checked');

                $('.inpus').parent('span').eq(1).addClass('checked');

                //数量自填
                putOutGoods.num = '';

                $('.number1').removeAttr('readonly').removeClass('disabled-block');

                $('.number1').parent('.input-blockeds').removeClass('disabled-block');

                //聚焦到工单选择
                setTimeout(function(){

                    $('#workDone').find('.number1').focus();

                },600)

            }else{

                $('.inpus').parent('span').removeClass('checked');

                $('.inpus').parent('span').eq(0).addClass('checked');

                //数量必须为1，并且不可操作
                putOutGoods.num = 1;

                $('.number1').attr('readonly','readonly').addClass('disabled-block');

                $('.number1').parent('.input-blockeds').addClass('disabled-block');

                var outMoney = Number(checkedLi.attr('data-amount')) / Number(checkedLi.attr('data-num'));

                putOutGoods.amount = outMoney.toFixed(2) ;

                //聚焦到工单选择
                setTimeout(function(){

                    $('#workDone').find('.gdCode').focus();

                },600)


            }

            var outPrice = 0;

            //计算物品单价
            if( Number(checkedLi.attr('data-num')) != 0 ){

                outPrice = Number(checkedLi.attr('data-amount')) / Number(checkedLi.attr('data-num'));

            }

            putOutGoods.outPrice = formatNumber(Number(outPrice));


        }else{

            snList(_snArr,false);

        }

        //更改车站列表
        var str1 = '';

        var eligibleArr = [];

        var inconformityArr =[];
        //首先判断的是每个工单的材料id

        console.log(_gdArr);

        for(var i=0;i<_gdArr.length;i++){
            //将工单中缺某个选择出来

            if(_gdArr[i].wxClIds){

                var arrSplit = _gdArr[i].wxClIds.split(',');

                for(var j=0;j<arrSplit.length;j++){

                    if(putOutGoods.bianhao == arrSplit[j]){

                        eligibleArr.push(_gdArr[i]);

                    }
                }

                inconformityArr.push(_gdArr[i]);

            }


        }
        for(var i=0;i<eligibleArr.length;i++){
            str1 += '<li data-dds="' + eligibleArr[i].bxKeshiNum +
                '"data-ddsName="' + eligibleArr[i].bxKeshi +
                '" data-gd="' + eligibleArr[i].gdCode +
                '" style="background: #f5d38c;">' +'<span class="dataGD">' +
                eligibleArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + eligibleArr[i].wxClNames +
                '</span>' + '<span>' + eligibleArr[i].bxKeshi +
                '</span>' + '</li>';
        }

        for(var i=0;i<eligibleArr.length;i++){

            inconformityArr.removeByValue(eligibleArr[i].gdCode2,'gdCode2');

        }
        for(var i=0;i<inconformityArr.length;i++){

            str1 += '<li data-dds="' + inconformityArr[i].bxKeshiNum +
                '"data-ddsName="' + inconformityArr[i].bxKeshi +
                '" data-gd="' + inconformityArr[i].gdCode +
                '">' +'<span class="dataGD">' +
                inconformityArr[i].gdCode2 +'</span><span style="margin:0 10px;">' + inconformityArr[i].wxClNames +
                '</span>' + '<span>' + inconformityArr[i].bxKeshi +
                '</span>' + '</li>';

        }

        $('.pinzhixx').eq(1).empty().append(str1);


        color.hide();

        _numIndex = -1;
    }

    //序列号输入事件
    var inputSN = function(){

        inputFun(putOutGoods.goodsId,_snArr,'sn',$('#workDone').find('.accord-sn-list'),snList);

    }

    //序列号回车事件
    var enterSN = function(){

        var color = $('#workDone').find('.accord-sn-list');

        var checkedLi = color.children('.li-color');

        //赋值
        putOutGoods.goodsId = checkedLi.children('.dataSn').html();

        putOutGoods.size = checkedLi.attr('data-size');
        //
        putOutGoods.picked = checkedLi.children('.dataIsSpare').attr('data-isspare');
        //
        putOutGoods.unit = checkedLi.attr('data-unit');
        //
        putOutGoods.quality = checkedLi.attr('data-quality');
        //
        putOutGoods.warranty = checkedLi.attr('data-warranty');
        //
        putOutGoods.redundant = checkedLi.children('.dataNum').html();

        var outPrice = 0;

        //计算物品单价
        if( Number(checkedLi.children('.dataNum').html()) != 0 ){

            outPrice = Number(checkedLi.attr('data-amount')) / Number(checkedLi.children('.dataNum').html());

        }

        putOutGoods.outPrice = formatNumber(Number(outPrice));

        color.hide();

        _numIndex = -1;

        if( putOutGoods.picked == 0 ){

            $('.inpus').parent('span').removeClass('checked');

            $('.inpus').parent('span').eq(1).addClass('checked');

            //数量自填
            putOutGoods.num = '';

            $('.number1').removeAttr('readonly').removeClass('disabled-block');

            $('.number1').parent('.input-blockeds').removeClass('disabled-block');

            setTimeout(function(){

                $('#workDone').find('.number1').focus();

            },600)


        }else{

            $('.inpus').parent('span').removeClass('checked');

            $('.inpus').parent('span').eq(0).addClass('checked');

            //数量必须为1，并且不可操作
            putOutGoods.num = 1;

            $('.number1').attr('readonly','readonly').addClass('disabled-block');

            $('.number1').parent('.input-blockeds').addClass('disabled-block');

            putOutGoods.amount = putOutGoods.outPrice;

            setTimeout(function(){
                $('#workDone').find('.gdCode').focus();
            },600)

        }


    }

    //工单输入事件
    var inputGD = function(){

        inputFun(putOutGoods.gdCode,_gdArr,'gdCode2',$('#workDone').find('.pinzhixx').eq(1),gdsList);

    }

    //工单回车事件
    var enterGD = function(){

        var color = $('#workDone').find('.pinzhixx').eq(1);

        var checkedLi = color.children('.li-color');

        //赋值
        putOutGoods.gdCode = checkedLi.children('.dataGD').html();

        $('#workDone').find('.gdCode').attr('gdcode',checkedLi.attr('data-gd'));

        //车站联动
        putOutGoods.chezhan = checkedLi.attr('data-ddsname');

        $('#workDone').find('.chezhan').attr('data-num',checkedLi.attr('data-dds'));

        $('#workDone').find('.chezhan').attr('data-name',checkedLi.attr('data-ddsname'));

        color.hide();

        _numIndex = -1;
    }

    //将物品添加到表格暂存区（第二层弹窗）
    function addTable(){

        //验证必填项(仓库，物品编号，物品名称，数量，出库单价，总金额，工单号，车站)
        if( putOutGoods.ck == '' || putOutGoods.bianhao == '' || putOutGoods.mingcheng == '' || putOutGoods.num == '' || putOutGoods.outPrice == '' || putOutGoods.amount == '' ){
            //提示框
            _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'请填写红色必填项!', '')
        }else{
            var o = $('.format-error')[0].style.display;
            var s = $('.format-error1')[0].style.display;
            var a = $('.format-error2')[0].style.display;
            var t = $('.format-error3')[0].style.display;
            var b = $('.format-error4')[0].style.display;

            //首先获取datatables的总量，
            //当前数量
            //遍历当前出库单的编码，序列号，仓库，库区，相同的物品的总数

            var arrNum = Number(putOutGoods.num);

            for(var i=0;i<_tempRKArr.length;i++){

                if( _tempRKArr[i].itemNum == putOutGoods.bianhao && _tempRKArr[i].sn == putOutGoods.goodsId && _tempRKArr[i].storageNum == $('.cangku').attr('data-num') && $('.kuwei').attr('data-num') == _tempRKArr[i].localNum ){

                    arrNum += Number(_tempRKArr[i].num);

                }

            }

            if(o == 'none' && s == 'none' && a == 'none' && t =='none' && b == 'none'){

                //首先判断输入过了没(根据仓库、库区、编号、序列号、工单号、车站判断是否添加了)
                var existFlag = false;

                for(var i=0;i<_tempRKArr.length;i++){

                    if(putOutGoods.bianhao == _tempRKArr[i].itemNum && $('.cangku').attr('data-num') == _tempRKArr[i].storageNum && $('.kuwei').attr('data-num') == _tempRKArr[i].localNum && putOutGoods.goodsId == _tempRKArr[i].sn && putOutGoods.gdCode == _tempRKArr[i].gdCode2 && $('#workDone').find('.chezhan').attr('data-num') == _tempRKArr[i].bxKeshiNum ){

                        existFlag = true;

                    }
                }
                if(existFlag){
                    //有
                    _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'已添加过!', '');
                }else{

                    if( putOutGoods.redundant >= arrNum ){

                        //数量满足，可添加
                        //无
                        //获取入库单信息创建对象，存入_rukuArr数组
                        //首先获取仓库的值
                        var rukuDan = {};
                        rukuDan.sn = putOutGoods.goodsId;
                        rukuDan.itemNum = putOutGoods.bianhao;
                        rukuDan.itemName = putOutGoods.mingcheng;
                        rukuDan.size = putOutGoods.size;
                        rukuDan.num = putOutGoods.num;
                        rukuDan.isSpare = putOutGoods.picked;
                        rukuDan.batchNum = putOutGoods.quality;
                        rukuDan.maintainDate = putOutGoods.warranty;
                        rukuDan.storageName = putOutGoods.ck;
                        rukuDan.storageNum = $('.cangku').attr('data-num');
                        rukuDan.unitName = putOutGoods.unit;
                        rukuDan.outPrice = putOutGoods.outPrice;
                        rukuDan.amount = putOutGoods.amount;
                        rukuDan.gdCode2 = putOutGoods.gdCode;
                        rukuDan.localNum = $('.kuwei').attr('data-num');
                        rukuDan.localName = putOutGoods.kuwei;
                        //车间
                        rukuDan.bxKeshi = (typeof $('.chezhan').attr('data-name') == 'undefined')?'':$('.chezhan').attr('data-name');
                        rukuDan.bxKeshiNum = (typeof $('.chezhan').attr('data-num') == 'undefined')?'':$('.chezhan').attr('data-num');
                        rukuDan.outMemo = putOutGoods.remark;
                        rukuDan.userID = _userIdNum;
                        rukuDan.userName = _userIdName;
                        rukuDan.shengyu = putOutGoods.redundant;
                        rukuDan.gdCode = $('.gdCode').attr('gdcode');
                        _tempRKArr.unshift(rukuDan);

                        _datasTable($('#wuPinListTable1'),_tempRKArr);

                        //共计
                        //数量
                        var num = 0;

                        //金额
                        var amount = 0;

                        for(var i=0;i<_tempRKArr.length;i++){

                            num += Number(_tempRKArr[i].num);

                            amount += Number(_tempRKArr[i].amount);

                        }

                        $('#wuPinListTable1 tfoot').find('.amount1').html(num);

                        $('#wuPinListTable1 tfoot').find('.count1').html(amount.toFixed(2));

                    }else{

                        //超出数量，不可添加
                        _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,'剩余数量不足，请修改出库物品的数量', '');

                    }


                }

            }else{

                _moTaiKuang($('#myModal2'),'提示','flag', 'istap' ,'请输入正确的数字', '');
            }
        }


    }

    //mouseover事件
    function mouseoverFun($this){

        $this.parent('ul').children('li').removeClass('li-color');

        $this.addClass('li-color');

        _numIndex = $this.parent('ul').find('.li-color').index();

    }

    //更改工单备件状(点击了登记之后循环访问，确定工单号)
    function applySparePart(arr,cl){
        if(arr.length){
            var prm = {
                "gdCodes": arr,
                "clStatusId": 100,
                "clStatus": '备件发货',
                "clLastUptInfo": '',
                'userID':_userIdNum,
                'userName':_userIdName,
                'b_UserRole':_userRole,
                'wxClNames':cl
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDUptMultiPeijStatus',
                data:prm,
                success:function(result){

                    _bjComplete = true;

                    if( result == 99 ){

                        _BjFlag = true;

                    }else{

                        _BjFlag = false;

                    }
                    addBJ();
                },
                error:function(jqXHR, textStatus, errorThrown){
                    _bjComplete = true;
                    console.log(jqXHR.responseText);
                }
            })
        }else{
            _BjFlag = '';

            if(_shSuccess){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'确认成功！', '');

                $('#myModal').modal('hide');

                conditionSelect();
            }else{
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'确认失败！', '');
            }
        }
    }

    //登记、备件发货成功执行
    function addBJ(){

        if( _shComplete && _bjComplete && _ldComplete){

            var str = '';

            if(_shSuccess){

                str += '审核成功，'

            }else{

                str += '审核失败，'

            }

            if(_BjFlag){

                str += '备件发货成功，'

            }else{

                str += '备件发货失败，'

            }

            if(_ldSuccess){

                str += '用料单生成成功！'

            }else{

                str += '用料单生成失败！'

            }

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,str, '');

            //刷新数据
            conditionSelect();

            //审核模态框消失
            $('#myModal').modal('hide');
        }
    }


    //获取数据方法---------------------------------------------------------------------------
    //条件查询工单号
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var realityStart = filterInput[1] + ' 00:00:00';
        var realityEnd = moment(filterInput[2]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        var ckArr = [];
        for(var i=0;i<_ckArr.length;i++){
            ckArr.push(_ckArr[i].storageNum);
        }
        var prm = {
            'st':realityStart,
            'et':realityEnd,
            'orderNum':filterInput[0],
            'outType':1,
            //'storageNums':ckArr,
            'storageNum':$('#conditionStroage').val(),
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorage',
            data:prm,
            success:function(result){
                _allData.length = 0;
                var confirm = [];
                var confirmed = [];
                for(var i=0;i<result.length;i++){
                    _allData.push(result[i]);
                    if(result[i].status == 0){
                        confirm.push(result[i])
                    }else if(result[i].status == 1){
                        confirmed.push(result[i])
                    }
                }
                _jumpNow($('#scrap-datatables1'),confirm);
                _jumpNow($('#scrap-datatables2'),confirmed);
                _jumpNow($('#scrap-datatables'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //出库类型
    function rkLX(){
        var prm = {
            "catType": 2,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetInOutCate',
            data:prm,
            success:function(result){

                //条件查询的出库类型选择

                var str = '<option value="">全部</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';

                }

                $('.tiaojian').empty().append(str);

                //增加出库单的出库类型
                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';

                }

                $('#rkleixing').empty().append(str);

                $('#rkleixing').val(1);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //仓库
    function warehouse(){
        var prm = {
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
            "hasLocation":1
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:prm,
            success:function(result){

                _ckArr.length = 0;

                var str = '<option value="">请选择</option>';

                var str1 = '';

                for(var i=0;i<result.length;i++){

                    _ckArr.push(result[i]);

                    str += '<option value="' + result[i].storageNum + '">' + result[i].storageName + '</option>';

                    str1 += '<option value="' + result[i].storageNum + '">' + result[i].storageName + '</option>';

                }
                $('#ckSelect1').empty().append(str);

                $('#ckselect').empty().append(str1);

                $('#conditionStroage').empty().append(str1);

                //加载数据
                conditionSelect();

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有库区
    function reservoir(num){
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetLocations',
            data:{
                'userID':_userIdNum,
                'userName':_userIdName,
                'b_UserRole':_userRole,
                'storageNum':num
            },
            success:function(result){
                _kqArr.length = 0;
                for(var i=0;i<result.length;i++){
                    _kqArr.push(result[i]);
                }

                kqList(result,false);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有物品列表
    function goodsList(){

        var ckarr = [];

        for(var i=0;i<_ckArr.length;i++){

            ckarr.push(_ckArr[i].storageNum);
        }
        var prm = {
            'ItemNum':$('.filterInput1').eq(0).val(),
            'itemName':$('.filterInput1').eq(1).val(),
            //'storageNum':$('#ckSelect').val(),
            'storageNums':ckarr,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
            'hasNum':1
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptItemStock',
            data:prm,
            success:function(result){
                _wpListArr.length = 0;

                for(var i=0;i<result.length;i++){

                    _wpListArr.push(result[i]);

                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //条件查询物品
    function goodsSelect(){

        var ckarr = [];

        for(var i=0;i<_ckArr.length;i++){

            ckarr.push(_ckArr[i].storageNum);
        }
        var prm = {
            'ItemNum':$('.filterInput1').eq(0).val(),
            'itemName':$('.filterInput1').eq(1).val(),
            'storageNum':$('#ckSelect').val(),
            'storageNums':ckarr,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
            'hasNum':1
        }
        if( $('#ckSelect1').val() == ''){
            prm.storageNum = '';
            prm.storageNums = ckarr;
        }else{
            prm.storageNum = $('#ckSelect1').val();
            prm.storageNums = [];
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptItemStock',
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },

            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                _datasTable($('#wuPinListTable'),result);


            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    }

    //获取所有工单
    //工单条件查询
    function GDselect(num,first){

        if($('.gdTime').eq(0).val() == ''){
            gdrealityStart = ''
        }else{
            gdrealityStart = moment($('.gdTime').eq(0).val()).format('YYYY/MM/DD') + ' 00:00:00'
        }
        if($('.gdTime').eq(1).val() == ''){
            gdrealityEnd = ''
        }else{
            gdrealityEnd = moment($('.gdTime').eq(1).val()).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        }

        var prm = {
            gdCode2:$('#gdcode').val(),
            gdSt:gdrealityStart,
            gdEt:gdrealityEnd,
            gdZht:num,
            userID:_userIdNum,
            userName:_userIdName,
            wxShiXNum:$('#xtlx').val(),
            gdCodeSrc:$('#gdly').val(),
            bxKeshiNum:$('#station').val(),
            gdJJ:0
        }

        if(first){

            prm.isApplyWxCl = 0

        }else{

            if($('#isExamine').parent('.checked').length != 0){

                prm.isApplyWxCl = 1

            }else{

                prm.isApplyWxCl = 0

            }

        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetZh3',
            data:prm,
            timeout:30000,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                _gdArr.length = 0;

                for(var i=0;i<result.length;i++){

                    _gdArr.push(result[i]);

                }
                _datasTable($('#gdTable'),result);

                gdsList(result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取车站
    function chezhan(flag){
        var prm = {
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
            'ddName':''
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDMGetDDs',
            data:prm,
            success:function(result){
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].ddNum + '">' + result[i].ddName + '</option>';
                }
                $('#station').empty().append(str);

                if(flag){

                    _cheArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _cheArr.push(result[i]);

                    }

                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //审核出库单
    function shenheFun(){

        var gdArr = [];

        var clArr = [];

        var wpArr = [];

        for(var i=0;i<_rukuArr.length;i++){

            if(_rukuArr[i].gdCode2){

                gdArr.push(_rukuArr[i].gdCode2);

                clArr.push(_rukuArr[i].itemName);
            }

            wpArr.push(_rukuArr[i]);
        }

        var prm = {
            'OrderNum':_$thisRKnum,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
            'auditMemo':putOutList.shRemarks,
            'auditTime':putOutList.shenheTime
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKConfirmOutStorage',
            data:prm,
            success:function(result){

                _shComplete = true;

                if(result == 99){

                    _shSuccess = true;

                    $(this).removeClass('shenhe');

                    //备件状态转换
                    applySparePart(gdArr,clArr);

                    //生成用料单
                    pickList(wpArr);

                }else{

                    _shSuccess = false;

                    _moTaiKuang($('#myModal2'), '提示','flag', 'istap' ,'确认失败，可能是库存不足的原因!', '');
                }

                addBJ();

            },
            error:function(jqXHR, textStatus, errorThrown){

                _shComplete = true;

                console.log(jqXHR.responseText);
            }
        })

    }

    //初始化------------------------------------------------------------------------------------
    //新增入库单初始化
    function RKDInit(arr){
        //出库单编号
        putOutList.bianhao = '';
        //出库类型
        putOutList.rkleixing = 1;
        //发货员名称
        putOutList.clymc = '';
        //发货员电话
        putOutList.clydh = '';
        //制单人
        putOutList.zhidanren = '';
        //制单时间
        putOutList.shijian = _initEnd;
        //备注
        putOutList.remarks = '';
        //审核备注
        putOutList.shRemarks = '';
        //审核时间
        putOutList.shenheTime = '';

        //默认修改物品按钮为不可操作

        var emptyArr = [];

        if(arr){

            //表格初始化
            _datasTable($('#personTable1'),arr);

            //共计
            //数量
            var num = 0;

            var amount = 0;

            for(var i=0;i<arr.length;i++){

                num += Number(arr[i].num);

                amount += Number(arr[i].amount);

            }

            $('#personTable1 tfoot').find('.totalnum').html(num);

            $('#personTable1 tfoot').find('.count').html(amount.toFixed(2));

        }else{

            //表格初始化
            _datasTable($('#personTable1'),emptyArr);

            $('#personTable1 tfoot').find('.totalnum').html('0');

            $('#personTable1 tfoot').find('.count').html('0.00');

        }

        //仓库可操作
        $('#ckselect').attr('disabled',false).removeClass('disabled-block');
    }

    //新增出库物品初始化
    function RKCPInit(flag,arr){

        if(flag){

            //仓库
            putOutGoods.ck = '';
            $('.cangku').removeAttr('data-num');

            //库区
            putOutGoods.kuwei = '';
            $('.kuwei').removeAttr('data-num').removeAttr('data-name');

        }

        //物品编号
        putOutGoods.bianhao = '';

        //物品名称
        putOutGoods.mingcheng = '';

        //物品序列号
        putOutGoods.goodsId = '';

        //规格型号
        putOutGoods.size = '';

        //是否耐用
        putOutGoods.picked = 0;

        //单位
        putOutGoods.unit = '';

        //品质
        putOutGoods.quality = '';

        //质保期
        putOutGoods.warranty = '';

        //剩余数量
        putOutGoods.redundant = '';

        //数量
        putOutGoods.num = '';

        //出库单价
        putOutGoods.outPrice = '';

        //总金额
        putOutGoods.amount = '';

        //工单号
        putOutGoods.gdCode = '';

        $('.gdCode').removeAttr('gdcode');

        //车站
        putOutGoods.chezhan = '';

        $('.chezhan').removeAttr('data-num').removeAttr('data-name');

        //备注
        putOutGoods.remark = '';

        //单选框初始化
        if(putOutGoods.picked == 0){

            $('.inpus').parent('span').removeClass('checked');

            $('.inpus').parent('span').eq(1).addClass('checked');

        }else if(putOutGoods.picked == 1){

            $('.inpus').parent('span').removeClass('checked');

            $('.inpus').parent('span').eq(0).addClass('checked');

        }

        //除了自动带入的信息（）其他均可编辑
        $('.initBJ').removeAttr('readonly').removeClass('disabled-block');

        $('.initBJ').parent('.input-blockeds').removeClass('disabled-block');

        var emptyArr = [];

        if(arr){

            _datasTable($('#wuPinListTable1'),arr);

            //共计
            //数量
            var num = 0;

            //金额
            var amount = 0;

            for(var i=0;i<arr.length;i++){

                num += Number(arr[i].num);

                amount += Number(arr[i].amount);

            }

            $('#wuPinListTable1 tfoot').find('.amount1').html(num);

            $('#wuPinListTable1 tfoot').find('.count1').html(amount.toFixed(2));

        }else{

            _datasTable($('#wuPinListTable1'),emptyArr);
        }

        //下拉框都确保隐藏
        $('.hidden1').hide();

        //操作框是否能操作
        $('#workDone').find('.initBJ').removeAttr('readonly').removeClass('disabled-block');

        $('#workDone').find('.initBJ').parent('.input-blockeds').removeAttr('disabled-block');

        //仓库始终不可编辑
        $('#workDone').find('.cangku').parent().addClass('disabled-block');

        $('#workDone').find('.cangku').attr('disabled',true).addClass('disabled-block');

    }

    //获取车站
    function stationData(stationHtml,ABCArr){

        var prm = {

            //当前用户id
            userID:_userIdNum,
            //当前用户名
            userName:_userIdName

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWDev/ywDMGetDDs',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _stationArr.length = 0;

                for(var i=0;i<result.length;i++){

                    _stationArr.push(result[i]);

                }

                //页面插入station选择框
                addStationDom($('#bumen').parent(),stationHtml,ABCArr);

                classifyArrByInitial(result,0,ABCArr);

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);
            }

        })

    }

    //字母排序的车站
    function stationType(){

        var ABC = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

        var ABC1 = ['A','B','C','D','E'];
        var ABC2 = ['F','G','H','I','J'];
        var ABC3 = ['K','L','M','N','O'];
        var ABC4 = ['P','Q','R','S','T'];
        var ABC5 = ['U','V','W','X','Y','Z'];

        //定义要插入的元素

        var stationHtml = '<div class="add-select-block">' +
                                '<div class="com_hotresults" id="thetable" style="width:440px">' +
                                    '<div class="ac_title">' +
                                        '<span>请根据拼音首字母进行选择</span>' +
                                        '<a class="ac_close" style="cursor:pointer" title="关闭" onclick=""></a>' +
                                    '</div>' +
                                    '<ul class="AbcSearch clx" id="abc">' +
                                        '<li index="1" method="liHotTab" onclick="" id="nav_list1" class="action">全部</li>' +
                                        '<li index="2" method="liHotTab" onclick="" id="nav_list2" class="">ABCDE</li>' +
                                        '<li index="3" method="liHotTab" onclick="" id="nav_list3" class="">FGHIJ</li>' +
                                        '<li index="4" method="liHotTab" onclick="" id="nav_list4" class="">KLMNO</li>' +
                                        '<li index="5" method="liHotTab" onclick="" id="nav_list5" class="">PQRST</li>' +
                                        '<li index="6" method="liHotTab" onclick="" id="nav_list6" class="">UVWXYZ</li>' +
                                    '</ul>' +
                                    '<div id="ul_list2" style="height: 270px; display: block;overflow-y: auto"></div>'
                                '</div>' +
                            '</div>'

        var ABCArr = [ABC,ABC1,ABC2,ABC3,ABC4,ABC5];

        stationData(stationHtml,ABCArr);


    }

    function addStationDom(dom,html,ABCArr){

        dom.after(html);

        //dom.hide();

        //控制显示隐藏
        $('#myModal1').on('click','#station-record',function(){

            $('.add-select-block').toggle();

        });

        //字母的tap切换
        $('.AbcSearch').on('click','li',function(){

            $('.AbcSearch li').removeClass('action');

            $(this).addClass('action');

            var index = $(this).index();

            classifyArrByInitial(_stationArr,index,ABCArr);

        });

        //关闭
        $('.ac_close').on('click',function(){

            $('.add-select-block').hide();
        });

        $('.ac_title button').on('click',function(){
            $('.add-input-select span').html('全部');
            $('.add-input-select span').attr('values','');
            $('#bumen').val('');
            $('.add-select-block').hide();
            //e.stopPropagation();
        });
    }

    //根据首字母对数组分类
    function classifyArrByInitial(arr,num,ABCArr){

        //新建存放根据首字母分类后数据的数组
        var classifyArr = [];
        var curArr = ABCArr[num];
        //新建存放拼接好的字符串的数组
        var showString = '';

        $(curArr).each(function(i,o){

            var obj = {};
            obj.key = o;
            obj.value = [];
            classifyArr.push(obj);
        });

        $(arr).each(function(i,o){
            //获取首字母
            var initial = o.ddPy.split('')[0];
            //判断当前首字母是否符合要求
            var index = curArr.indexOf(initial);
            if(index != -1){
                classifyArr[index].value.push(o);
            }

        });

        $(classifyArr).each(function(i,o){
            //获取当年的首字母
            var initial = o.key;
            var dataArr = o.value;
            if(dataArr.length == 0){
                return true;
            }

            //根据拼音顺序对车站进行排序
            dataArr.sort(function(a,b){
                if(b.ddPy > a.ddPy){
                    return -1
                }else{
                    return 1
                }

            });

            showString += '<ul class="popcitylist" style="overflow: auto; max-height: 260px; ">';
            showString += '<li class="ac_letter">'+initial+'</li>';

            $(dataArr).each(function(i,o){
                showString += '<li class="ac_even openLi" values="'+ o.ddNum+'" title="'+o.ddName+'" data="'+ o.ddPy+'">' +o.ddName+'</li>';
                if(i == dataArr.length -1){
                    showString += '</ul>'
                }
            });

        });

        $('#ul_list2').html(showString);

        $('.ac_even').off('click');

        $('.ac_even').on('click',function(){

            //赋值
            $('#workDone').find('.chezhan').attr('data-num',$(this).attr('values'));

            $('#workDone').find('.chezhan').attr('data-name',$(this).attr('title'));

            putOutGoods.chezhan = $(this).attr('title');

            $('.add-select-block').hide();

            //自动聚焦到下一个input
            $(this).parents('.gdList').next().find('input').focus();

        })
    }

    //生成用料单
    function pickList(arr){

        //审核通过之后创建物料单

        var wpArr1 = [];

        for(var i=0;i<arr.length;i++){

            var obj = {};
            //车站编号
            obj.bxKeshiNum = arr[i].bxKeshiNum;
            //工单号
            obj.gdCode2 = arr[i].gdCode2;
            //申请的物品编码
            obj.itemNum1 = arr[i].itemNum;
            //序列号
            obj.sn = arr[i].sn;
            //用户id
            obj.userID = _userIdNum;
            //用户名
            obj.userName = _userIdName;
            //出库单号
            obj.orderNum = _$thisRKnum;

            wpArr1.push(obj);

        }

        var prm1 = {

            prm:wpArr1

        };

        $.ajax({

            type:'post',

            url:_urls + 'YWCK/ywCKAddPickListII',

            timeout:_theTimes,

            data:prm1,

            success:function(result){

                _ldComplete = true;

                if(result == 99){

                    _ldSuccess = true;

                }else{

                    _ldSuccess = false;
                }

                addBJ();

            },

            error:function(jqXHR, textStatus, errorThrown){

                _ldComplete = true;

                console.log(jqXHR.responseText);

            }

        })

    }

})