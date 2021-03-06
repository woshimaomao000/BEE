$(function(){
    /*---------------------------------------------时间-----------------------------------------------------*/
    //时间插件
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间
    //设置初始时间
    var _initStart = moment().subtract(6,'months').format('YYYY/MM/DD');

    var _initEnd = moment().format('YYYY/MM/DD');

    //显示时间
    $('.min').val(_initStart);

    $('.max').val(_initEnd);

    //出库单条件搜索默认时间
    var _chuTime =  moment().format('YYYY/MM/DD');

    var _chuStartTime = moment().subtract(6,'months').format('YYYY/MM/DD');

    $('.chukumin').val(_chuStartTime);

    $('.chukumax').val(_chuTime);

    /*--------------------------------------------变量-----------------------------------------------------*/
    //存放当前所有入库单的数组
    var _allData = [];

    //入库类型方法
    rkLX(1);

    //出库类型方法
    rkLX(2);

    //存放所有仓库
    var _ckArr = [];

    //新增入库单vue对象
    var putInList = new Vue({
        el:'#myApp33',
        data:{
            bianhao:'',
            rkleixing:'',
            suppliermc:'',
            suppliercontent:'',
            supplierphone:'',
            ckselect:'',
            zhidanren:'',
            shijian:'',
            remarks:'',
            shremarks:'',
            documentNumber:'',
            shenheTime:''
        }
    })

    //入库产品vue对象
    var putInGoods = new Vue({
        el:'#workDone',
        data:{
            kuwei:'',
            bianhao:'',
            mingcheng:'',
            size:'',
            picked:'',
            goodsId:'',
            unit:'',
            quality:'',
            warranty:'',
            num:'',
            inprice:'',
            amount:'',
            remark:''
        },
        methods:{
            //验证方法：
            //数量正则
            addFun1:function(){
                var mny = /^[0-9]*[1-9][0-9]*$/;
                if(putInGoods.num != ''){
                    if(mny.test(putInGoods.num)){
                        $('.format-error').hide();
                    }else{
                        $('.format-error').show();
                    }
                }else{
                    $('.format-error').hide();
                }

                if( putInGoods.inprice != '' ){

                    var price = putInGoods.inprice;

                    putInGoods.inprice = formatNumber(Number(price),3);

                    var amount = Number(putInGoods.inprice) * Number(putInGoods.num);

                    putInGoods.amount = formatNumber(Number(amount),2);

                }else{

                    putInGoods.amount = '';

                }


            },
            //物品序列号是否重复
            isequal:function(){
                if(putInGoods.picked == 0){
                    if(putInGoods.bianhao == putInGoods.goodsId){
                        $('.isEqual').hide();
                    }else{
                        $('.isEqual').show();
                    }
                }else{
                    //获取数据，用于去重
                    getWPid();
                }
            },
            //入库单价格式是否正确
            addFun2:function(){
                var mny = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;

                if(putInGoods.inprice != ''){

                    if(mny.test(putInGoods.inprice)){

                        $('.format-error1').hide();

                    }else{

                        $('.format-error1').show();

                    }

                }else{

                    $('.format-error1').hide();

                }

                var amount = Number(putInGoods.inprice) * Number(putInGoods.num);

                putInGoods.amount = formatNumber(amount,2);

                //实际单价
                $('.inprice').attr('data-num',formatNumber(Number(putInGoods.inprice),3));
            },
            //输入总金额，自动推单价
            addFun3:function(){
                var mny = /^([1-9][0-9]*(\.[0-9]{1,2})?|0\.(?!0+$)[0-9]{1,4})$/;

                if(mny.test(putInGoods.amount)){

                    $('.format-error3').hide();

                    //根据总金额得出单价
                    var danjia =  Number(putInGoods.amount)/Number(putInGoods.num);

                    console.log(danjia);

                    //显示单价
                    putInGoods.inprice = formatNumber(danjia,2);

                    //实际单价
                    $('.inprice').attr('data-num',formatNumber(danjia,3));

                }else{

                    $('.format-error3').show();

                }
            },
            //总金额回车
            addFun5:function(){
                //总金额保留两位小时
                var amount = putInGoods.amount;

                putInGoods.amount = formatNumber(Number(amount),2);

                //再计算单价
                var mny = /^([1-9][0-9]*(\.[0-9]{1,3})?|0\.(?!0+$)[0-9]{1,4})$/;

                if(mny.test(putInGoods.amount)){

                    $('.format-error3').hide();

                    //根据总金额得出单价
                    var danjia =  Number(putInGoods.amount)/Number(putInGoods.num);

                    //显示金额
                    putInGoods.inprice = formatNumber(danjia,2);

                    //实际金额
                    $('.inprice').attr('data-num',formatNumber(danjia,3));


                }else{

                    $('.format-error3').show();

                }

            },
            //单选按钮
            radios:function(){
                $('.inpus').click(function(){
                    $('.inpus').parent('span').removeClass('checked');
                    $(this).parent('span').addClass('checked');
                })
            },
            //质保期聚焦日历插件显示
            focusFun:function(e){
                $('.pinzhixx').show();
            },
            //质保期失去焦点
            selectFun:function(e){

                upDown(e,$('.pinzhixx'),enterQualityName,inputQualityName);

            },
            //质保期选择
            time:function(){
                $('.datatimeblock').eq(4).datepicker({
                    language:  'zh-CN',
                    todayBtn: 1,
                    todayHighlight: 1,
                    format: 'yyyy/mm/dd',
                    autoclose:1
                });
            },
            //质保期失去焦点事件
            timeblur:function(){
            },
            //库区输入事件
            kuweiFun:function(e){
                upDown(e,$('.kuqu-list'),enterFQName,inputFQName);
            },
            //物品编码输入事件
            searchbm:function(e){

                upDown(e,$('.accord-with-list').eq(0),enterBMName,inputBMName);

            },
            //名称输入事件
            searchmc:function(e){

                upDown(e,$('.accord-with-list').eq(1),enterMCName,inputMCName);
            }


        }
    });

    //入库产品详情查看
    var rukuObject = new Vue({
        el:'#rukuObject',
        data:{
            bianhao:'',
            mingcheng:'',
            size:'',
            durable:0,
            goodsId:'',
            unit:'',
            quality:'',
            warranty:'',
            num:'',
            inPrice:'',
            amount:'',
            remark:''
        }
    });

    //验证必填项（非空）
    Vue.validator('requireds', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });

    //供货方名称
    getSupplier(true);

    //供货商旋转
    var _rotate;

    //记录是不是点击了新增物品按钮
    var _addGoods = false;

    //记录初始值
    var _numIndex = -1;

    //根据仓库，获得对应的库区
    var _kuquArr = [];

    //存放物品数组
    var _wpListArr = [];

    //存放入库物品的数组(点击选择之后)
    var _rukuArr = [];

    //暂时存放已选择的数组
    var _tempRukuArr = [];

    //入库产品要删除的物品id

    var _tempRKObj = [];

    //当前选中的入库单号
    var _ruCode = '';

    //当前选中的出库单号
    var _chukuD = '';

    //判断制单人和审核人是不是一样
    var _examineRen = false;

    //是否可以自己审核
    var _isShenHe = sessionStorage.getItem('ckAuditType');

    //当前选中的物品编码
    var _$thisWP = '';

    //物品编码分类
    wpClass();

    //批量添加数组
    var _batchArr = [];

    //批量添加耐用品之后，相同耐用品折叠起来的数组
    var _foldArr = [];

    //耐用品弹窗数组
    var _spareArr = [];

    //品质数组
    var _qualityArr = [

        {
            title:'新件',
            data:'1'
        },
        {
            title:'良品',
            data:'2'
        },
        {
            title:'坏件',
            data:'3'
        }

    ];


    /*--------------------------------------------表格初始化------------------------------------------------*/
    //入库单表格初始化（所有、待审核、已审核）
    var col = [
        {
            title:'入库单号',
            data:'orderNum',
            className:'orderNum',
            render:function(data, type, row, meta){

                if(row.inType == 1){

                    return '<a class="rukuBM" href="godownEntry.html?orderNum=' + row.orderNum +
                        '" target="_blank">' + row.orderNum + '</a>'

                }else if(row.inType == 3){

                    return '<a class="rukuBM" href="godownEntry1.html?orderNum=' + row.orderNum +
                        '" target="_blank">' + row.orderNum + '</a>'

                }else{

                    return '<span class="rukuBM">' + row.orderNum + '</span>'

                }


            }
        },
        {
            title:'入库类型',
            data:'inType',
            render:function(data, type, full, meta){
                if(data == 0){
                    return '出错'
                }else if(data == 1){
                    return '采购入库'
                }else if(data == 2){
                    return '暂估价入库'
                }else if(data == 3){
                    return '调拨入库'
                }else if(data == 4){

                    return '返修入库'

                }
            },
            className:'inType'

        },
        {
            title:'供货方名称',
            data:'supName'
        },
        {
            title:'仓库',
            data:'storageName'
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
            title:'操作',
            data:'status',
            className:'noprint',
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
    _tableInit($('.rukuTable'),col,'1','flag','','');

    //选择入库产品表格
    var col1 = [
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
            title:'单位',
            data:'unitName'
        },
        {
            title:'数量',
            data:'num',
            className:'right-justify'
        },
        {
            title:'入库单价',
            data:'showPrice',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = formatNumber(parseFloat(data),2);
                return data
            }
        },
        {
            title:'总金额',
            data:'amount',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = formatNumber(parseFloat(data),2);
                return data
            }
        },
        {
            title:'是否耐用',
            data:'isSpare',
            render:function(data, type, full, meta){
                if(data == 0){

                    return '否'

                }else if(data == 1){

                    return '是'

                }
            }
        },
        {
            title:'库区',
            data:'localName',
            className:'localName',
            render:function(data, type, full, meta){
                return '<span data-num="' + full.localNum +
                    '">'+ data + '</span>'
            }
        },
        {
            title:'品质',
            data:'batchNum'
        },
        {
            title:'质保期',
            data:'maintainDate'
        },
        {
            title:'备注',
            data:'inMemo'
        },
        {
            title:'物品序列号',
            data:'sn',
            className:'sn hiddenButton'
        },
        {
            title:'操作',
            "data": null,
            render:function(data, type, full, meta){

                if(full.isSpare == 0){

                    return "<span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>"

                }else if(full.isSpare == 1){

                    return "<span class='data-option option-seeSpare btn default btn-xs green-stripe' data-flag=1>查看</span><span class='data-option option-DelSpare btn default btn-xs green-stripe'>删除</span>"

                }else{

                    return ''

                }

            }
        }
    ];
    _tableInit($('#personTable1'),col1,'1','','','');

    //添加入库产品的表格
    var col2 = [
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
            title:'单位',
            data:'unitName'
        },
        {
            title:'数量',
            data:'num',
            className:'right-justify'
        },
        {
            title:'入库单价',
            data:'showPrice',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = formatNumber(parseFloat(data),2);
                return data
            }
        },
        {
            title:'总金额',
            data:'amount',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = formatNumber(parseFloat(data),2);
                return data
            }
        },
        {
            title:'物品序列号',
            data:'sn',
            className:'sn'
        },
        {
            title:'库区',
            data:'localName',
            className:'localName',
            render:function(data, type, full, meta){
                return '<span data-num="' + full.localNum +
                    '">'+ data + '</span>'
            }
        },
        {
            title:'品质',
            data:'batchNum'
        },
        {
            title:'备注',
            data:'inMemo'
        },
        {
            title:'操作',
            data:null,
            className:'table-option',
            render:function(data, type, full, meta){

                if(full.isSpare == 0){

                    return "<span class='data-option option-bianji btn default btn-xs green-stripe' data-flag=1>编辑</span><span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>"

                }else if(full.isSpare == 1){

                    return "<span class='data-option option-seeSpare btn default btn-xs green-stripe' data-flag=1>查看</span><span class='data-option option-bianji1 btn default btn-xs green-stripe' data-flag=1>编辑</span><span class='data-option option-DelSpare btn default btn-xs green-stripe'>删除</span>"

                }else{

                    return ''

                }

            }
        }
    ];
    _tableInit($('#wuPinListTable1'),col2,'1','','','');

    var colsSare = [
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
            title:'单位',
            data:'unitName'
        },
        {
            title:'数量',
            data:'num',
            className:'right-justify'
        },
        {
            title:'入库单价',
            data:'showPrice',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = formatNumber(parseFloat(data),2);
                return data
            }
        },
        {
            title:'总金额',
            data:'amount',
            className:'right-justify',
            render:function(data, type, full, meta){
                var data = formatNumber(parseFloat(data),2);
                return data
            }
        },
        {
            title:'物品序列号',
            data:'sn',
            className:'sn'
        },
        {
            title:'库区',
            data:'localName',
            className:'localName',
            render:function(data, type, full, meta){
                return '<span data-num="' + full.localNum +
                    '">'+ data + '</span>'
            }
        },
        {
            title:'品质',
            data:'batchNum'
        },
        {
            title:'备注',
            data:'inMemo'
        },
        {
            title:'操作',
            data:null,
            className:'table-option',
            render:function(data, type, full, meta){

                return "<span class='data-option option-DelSpare btn default btn-xs green-stripe'>删除</span>"

            }
        }
    ];

    _tableInit($('#spare-table'),colsSare,'1','','','');

    //出库单表格
    var col4 = [
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
                }if(data == 2){
                    return '借货出库'
                }if(data == 3){
                    return '借用还出'
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
            title:'创建时间',
            data:'createTime'
        },
        {
            title:'审核时间',
            data:'auditTime'
        },
        {
            title:'制单人',
            data:'createUserName'
        },
        {
            title:'备注',
            data:'remark'
        },
    ];
    _tableInit($('#scrap-datatables3'),col4,'','','','');

    //选择物品列表
    var col3 = [
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
            title:'分类名称',
            data:'cateName'
        },
        {
            title:'规格型号',
            data:'size'
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
            }
        },
        {
            title:'单位',
            data:'unitName'
        }
    ];
    _tableInit($('#wuPinListTable'),col3,'','','','');

    //表格数据
    warehouse();

    //获取所有物品列表
    wlList();

    //加载页面的时候，隐藏其他两个导出按钮
    for( var i=1;i<$('.excelButton').children().length;i++ ){

        $('.excelButton').children().eq(i).addClass('hidding');

    };

    /*-----------------------------------------------按钮事件-----------------------------------------------*/
    //状态选项卡（选择确定/待确定状态）
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

    //获取供应商
    //点击刷新
    $('#reSupplier').click(function(){

        getSupplier(false);

    })

    //条件查询--------------------------------------------------------------------------------------------

    //条件查询【查询】
    $('#selected').click(function(){

        conditionSelect();

    })

    //条件查询【重置】
    $('.resites').click(function(){
        //清空input框内容
        var parents = $(this).parents('.condition-query');

        var inputs = parents.find('input');

        inputs.val('');

        //时间置为今天
        $('.min').val(_initStart);

        $('.max').val(_initEnd);

        //入库类型重置为全部
        $('.tiaojian').val('');

    });

    //条件查询【新增】
    $('.creatButton').click(function(){

        //模态框显示
        _moTaiKuang($('#myModal'), '新增入库单', '', '' ,'', '新增');

        //初始化
        newButtonInit();

        rudEdit();

        //选择物品按钮名称
        $('.zhiXingRenYuanButton').html('新增物品').show();

        //选择出库单按钮名称
        $('.chukuDan').show();

        //添加登记类
        $('#myModal').find('.btn-primary').removeClass('bianji').removeClass('shanchu').addClass('dengji');

        $('#myModal1').find('.mergeBtn').removeClass('bianji').addClass('dengji');

        //审核备注消失
        $('.shRemarks').hide();

        //自动填写的都置灰
        $('#myApp33').find('.automatic').attr('readonly','readonly').addClass('disabled-block');

        //提示消息不显示
        $('#myModal').find('.modal-footer').children('.colorTip').hide();

    });

    //入库单操作-------------------------------------------------------------------------------------------

    //入库单【查看】
    $('.main-contents-table .table tbody')
        .on('click','.option-see',function(){

            //初始化
            newButtonInit();

            //修改物品按钮消失
            $('.zhiXingRenYuanButton').hide();

            //导入入库单按钮消失
            $('.chukuDan').hide();

            //样式
            var $this = $(this).parents('tr');

            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

            $this.addClass('tables-hover');

            var $thisDanhao = $(this).parents('tr').find('.rukuBM').html();

            _ruCode = $thisDanhao;

            _moTaiKuang($('#myModal'), '查看', 'flag', '' ,'', '');

            //绑定数据
            bindData($thisDanhao);

            //入库产品详情
            function detailTable(data){

                _rukuArr.length = 0;

                for(var i=0;i<data.length;i++){

                    //增加显示单价
                    data[i].showPrice = Number(data[i].inPrice).toFixed(2);

                    _rukuArr.push(data[i]);

                }

                var spareArr = [];

                foldFun(spareArr,data);

                _datasTable($('#personTable1'),spareArr);

                $('#personTable1').find('.option-DelSpare,.option-shanchu').addClass('hiddenButton');


                //共计
                //数量
                var num = 0;

                var amount = 0;

                for(var i=0;i<spareArr.length;i++){

                    num += Number(spareArr[i].num);

                    amount += Number(spareArr[i].amount);

                }

                $('#personTable1 tfoot').find('.amount').html(num);

                $('#personTable1 tfoot').find('.count').html(amount.toFixed(2));

            }

            detailInfo($thisDanhao,detailTable);

            //不可操作
            rudNotEdit();

            //审核备注消失
            $('.shRemarks').show();

            //提示消息不显示
            $('#myModal').find('.modal-footer').children('.colorTip').hide();

        })
        //入库单【编辑】(首先判断是已审核还是未审核的入库单，已审核之后，就不能编辑，未审核的情况下可以编辑)；
        .on('click','.option-edit',function(){

            //初始化
            newButtonInit();

            //新增物品显示-->修改物品
            $('.zhiXingRenYuanButton').show().html('修改物品');

            //导入入库单按钮显示
            $('.chukuDan').show();

            //样式
            var $this = $(this).parents('tr');

            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

            $this.addClass('tables-hover');

            var $thisDanhao = $(this).parents('tr').find('.rukuBM').html();

            _ruCode = $thisDanhao;

            //绑定数据
            bindData(_ruCode);

            //入库产品详情
            function detailTable1(data){

                _rukuArr.length = 0;

                for(var i=0;i<data.length;i++){

                    //增加显示单价
                    data[i].showPrice = Number(data[i].inPrice).toFixed(2);

                    _rukuArr.push(data[i]);

                }

                var spareArr = [];

                foldFun(spareArr,data);

                _datasTable($('#personTable1'),spareArr);

                //共计
                //数量
                var num = 0;

                var amount = 0;

                for(var i=0;i<spareArr.length;i++){

                    num += Number(spareArr[i].num);

                    amount += Number(spareArr[i].amount);

                }

                $('#personTable1 tfoot').find('.amount').html(num);

                $('#personTable1 tfoot').find('.count').html(amount.toFixed(2));

            }

            //获取入库产品信息
            detailInfo($thisDanhao,detailTable1);

            //添加编辑类
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('shenhe').removeClass('shanchu').addClass('bianji');

            $('#myModal1').find('.mergeBtn').removeClass('dengji').addClass('bianji');

            //所有项可编辑
            rudEdit();

            //审核备注消失
            $('.shRemarks').hide();

            //判断状态是已确认还是待确定
            if( $(this).next().html() == '已审核' ){

                //所有输入框不可操作；
                $('#myApp33').find('input').attr('readonly','readonly').addClass('disabled-block');

                $('#myApp33').find('input').parent('.input-blockeds').addClass('disabled-block');

                $('#myApp33').find('select').attr('readonly','readonly').addClass('disabled-block');

                $('#myApp33').find('textarea').attr('readonly','readonly');

                //入库单号、审核人、审核时间態修改
                $('.automatic').attr('readonly','readonly').addClass('disabled-block');

                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').hide();

                //导入出库单按钮也要隐藏
                $('.chukuDan').hide();

                //模态框
                _moTaiKuang($('#myModal'), '编辑', 'flag', '' ,'', '');


            }else if( $(this).next().html() == '待审核' ){

                //所有输入框不可操作；
                $('#myApp33').find('input').removeAttr('readonly').removeClass('disabled-block');

                $('#myApp33').find('input').parent('.input-blockeds').removeClass('disabled-block');

                $('#myApp33').find('select').removeAttr('readonly').removeClass('disabled-block');

                $('#myApp33').find('textarea').removeAttr('readonly');

                //入库单号、审核人、审核时间態修改
                $('.automatic').attr('readonly','readonly').addClass('disabled-block');

                //新增物品按钮隐藏
                $('.zhiXingRenYuanButton').html('修改物品').show();

                //倒入出库单按钮显示
                $('.chukuDan').show();

                //模态框
                _moTaiKuang($('#myModal'), '编辑', '', '' ,'', '保存');

            }

            //审核备注无法修改，只可查看
            $('.shRemarks').find('textarea').attr('readonly','readonly').addClass('disabled-block');

            //提示消息不显示
            $('#myModal').find('.modal-footer').children('.colorTip').hide();

        })
        //入库单【审核】
        .on('click','.option-confirm',function(){

            //初始化
            newButtonInit()

            //修改物品按钮消失
            $('.zhiXingRenYuanButton').hide();

            //导入入库单按钮消失
            $('.chukuDan').hide();

            //样式
            var $this = $(this).parents('tr');

            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

            $this.addClass('tables-hover');

            var $thisDanhao = $(this).parents('tr').find('.rukuBM').html();

            _ruCode = $thisDanhao;

            _moTaiKuang($('#myModal'), '审核', '', '' ,'', '审核');

            //绑定数据
            bindData(_ruCode);

            //入库产品详情
            function detailTable2(data){

                _rukuArr.length = 0;

                for(var i=0;i<data.length;i++){

                    //增加显示单价
                    data[i].showPrice = Number(data[i].inPrice).toFixed(2);

                    _rukuArr.push(data[i]);

                }

                var spareArr = [];

                foldFun(spareArr,data);

                _datasTable($('#personTable1'),spareArr);

                $('#personTable1').find('.option-DelSpare,.option-shanchu').addClass('hiddenButton');

                //共计
                //数量
                var num = 0;

                var amount = 0;

                for(var i=0;i<spareArr.length;i++){

                    num += Number(spareArr[i].num);

                    amount += Number(spareArr[i].amount);

                }

                $('#personTable1 tfoot').find('.amount').html(num);

                $('#personTable1 tfoot').find('.count').html(amount.toFixed(2));
            }

            //获取入库产品信息
            detailInfo($thisDanhao,detailTable2);

            //不可操作
            rudNotEdit();

            //审核备注显示
            $('.shRemarks').show();

            $('.shRemarks').find('textarea').removeAttr('readonly').removeClass('disabled-block');

            $('.shRemarks').find('input').removeAttr('readonly').removeClass('disabled-block');

            $('.shRemarks').find('.input-blockeds').removeAttr('readonly').removeClass('disabled-block');

            //添加审核类
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('shanchu').removeClass('bianji').addClass('shenhe');

            //提示消息不显示
            $('#myModal').find('.modal-footer').children('.colorTip').hide();

            putInList.shenheTime = moment().format('YYYY/MM/DD');

        })
        //入库单【删除】
        .on('click','.option-delete',function(){

            //初始化
            newButtonInit();

            //修改物品按钮消失
            $('.zhiXingRenYuanButton').hide();

            //导入入库单按钮消失
            $('.chukuDan').hide();

            //样式
            var $this = $(this).parents('tr');

            $('.main-contents-table .table tbody').children('tr').removeClass('tables-hover');

            $this.addClass('tables-hover');

            var $thisDanhao = $(this).parents('tr').find('.rukuBM').html();

            _ruCode = $thisDanhao;

            _moTaiKuang($('#myModal'), '确定要删除吗？', '', '' ,'', '删除');

            //添加删除类
            $('#myModal').find('.btn-primary').removeClass('dengji').removeClass('shenhe').removeClass('bianji').addClass('shanchu');

            //绑定数据
            bindData($thisDanhao);

            //入库产品详情
            function detailTable(data){

                _rukuArr.length = 0;

                for(var i=0;i<data.length;i++){

                    //增加显示单价
                    data[i].showPrice = Number(data[i].inPrice).toFixed(2);

                    _rukuArr.push(data[i]);

                }

                var spareArr = [];

                foldFun(spareArr,data);

                _datasTable($('#personTable1'),spareArr);

                $('#personTable1').find('.option-DelSpare,.option-shanchu').addClass('hiddenButton');

                //共计
                //数量
                var num = 0;

                var amount = 0;

                for(var i=0;i<spareArr.length;i++){

                    num += Number(spareArr[i].num);

                    amount += Number(spareArr[i].amount);

                }

                $('#personTable1 tfoot').find('.amount').html(num);

                $('#personTable1 tfoot').find('.count').html(amount.toFixed(2));
            }

            detailInfo($thisDanhao,detailTable);

            //不可操作
            rudNotEdit();

            //审核备注消失
            $('.shRemarks').show();

            //提示消息显示
            $('#myModal').find('.modal-footer').children('.colorTip').show();

        })

    //入库单【登记】【编辑】【删除】确定按钮
    $('#myModal')
        .on('click','.dengji',function(){

            djOrBj('YWCK/ywCKAddInStorage',false,'添加成功！','添加失败！')

        })
        .on('click','.bianji',function(){

            djOrBj('YWCK/ywCKEditInStorage',true,'编辑成功！','编辑失败！');

        })
        .on('click','.shanchu',function(){

            ShOrSc('YWCK/ywCKDelInStorage',false,'删除成功！','删除失败！');

        })
        .on('click','.shenhe',function(){

                ShOrSc('YWCK/ywCKConfirmInStorage',true,'确认成功！','确认失败！');

        })

    //耐用品编辑
    $('#wuPinListTable1 tbody').on('click','.option-bianji1',function(){

        //获取到
        //本身表格样式修改
        $('#wuPinListTable1 tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //按钮本身改为'保存'
        $(this).html('保存').removeClass('option-bianji1').addClass('option-save1');

        //编辑的时候，库区、编码、名称、规格型号、是否耐用、单位不可操作。
        $('#workDone').find('.not-editable').attr('readonly','readonly').addClass('disabled-block');

        $('#workDone').find('.not-editable').parents('.input-blockeds').addClass('disabled-block');

        //获取当前的物品编码，库位编码，还有物品序列号来判断选中的是哪一项
        var wpNum = $(this).parents('tr').children('.bianma').html();

        var kwNum = $(this).parents('tr').children('.localName').children('span').attr('data-num');

        //console.log(_tempRukuArr);

        //选中的耐用品的数组
        var thisSpareArr = [];

        //遍历已选中的数组，来确定当前行选中的信息
        for(var i=0;i<_tempRukuArr.length;i++){

            //物品编码、库区、序列号相同的话，赋值
            if(_tempRukuArr[i].itemNum == wpNum && _tempRukuArr[i].localNum == kwNum && _tempRukuArr[i].isSpare == 1){

                thisSpareArr.push(_tempRukuArr[i]);

            }

        }

        //赋值
        //库位名称
        putInGoods.kuwei = thisSpareArr[0].localName;
        //库位编号
        $('.kuwei').attr('data-num',thisSpareArr[0].localNum);
        //物品编号
        putInGoods.bianhao = thisSpareArr[0].itemNum;
        //物品名称
        putInGoods.mingcheng = thisSpareArr[0].itemName;
        //规格型号
        putInGoods.size = thisSpareArr[0].size;
        //是否耐用
        putInGoods.picked = thisSpareArr[0].isSpare;
        //物品序列号
        //putInGoods.goodsId = _tempRukuArr[i].sn;
        //单位
        putInGoods.unit = thisSpareArr[0].unitName;
        //品质
        putInGoods.quality = thisSpareArr[0].batchNum;
        //质保期
        putInGoods.warranty = thisSpareArr[0].maintainDate;
        //数量
        //putInGoods.num = thisSpareArr[0].num;
        //入库单价
        //putInGoods.inprice = _tempRukuArr[i].inPrice;
        //总金额
        //putInGoods.amount = _tempRukuArr[i].amount;
        //备注
        putInGoods.remark = thisSpareArr[0].inMemo;

        //单选设置(消耗品的时候，序列号可以改变，耐用品的时候，序列号不可以改变)

        $('.inpus').parents('span').removeClass('checked');

        if( putInGoods.picked == 0 ){

            $('.inpus').eq(1).parent('span').addClass('checked');

            //数量可改变
            $('#workDone').find('.rknum').removeAttr('readonly').removeClass('disabled-block');

            $('#workDone').find('.rknum').parents('.input-blockeds').removeClass('disabled-block');

        }else if( putInGoods.picked == 1 ){

            $('.inpus').eq(0).parent('span').addClass('checked');

            //数量不可改变
            $('#workDone').find('.rknum').attr('readonly','readonly').addClass('disabled-block');

            $('#workDone').find('.rknum').parents('.input-blockeds').addClass('disabled-block');

        }

        //给表格赋值(确定序列号，总金额，单价)

        //序列号
        var snSpareStr = '';

        //总金额
        var spareAmount = 0;

        for(var i=0;i<thisSpareArr.length;i++){

            //将耐用品的字符串拼接，放入序列号中
            if(i == thisSpareArr.length-1){

                snSpareStr += thisSpareArr[i].sn;

            }else{

                snSpareStr += thisSpareArr[i].sn + ',';

            }

            //计算总金额
            spareAmount += Number(thisSpareArr[i].inPrice);

        }

        //序列号赋值
        putInGoods.goodsId = snSpareStr;

        //数量
        putInGoods.num = thisSpareArr.length;

        //总金额
        putInGoods.amount = spareAmount.toFixed(2);

        //单价
        var sparePrince = putInGoods.amount / putInGoods.num;

        //显示单价
        putInGoods.inprice = sparePrince.toFixed(2);

        //实际单价
        $('.inprice').attr('data-num',thisSpareArr[0].inPrice);

    })

    //耐用品保存
    $('#wuPinListTable1 tbody').on('click','.option-save1',function(){

        //判断格式
        //入库单价格式
        var s = $('.format-error1')[0].style.display;
        //总金额格式
        var a = $('.format-error3')[0].style.display;

        if( s != 'none' || a != 'none' ){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'输入有误！', '');

        }else{

            //将修改的（品质、质保期、单价、总金额、备注）直接将_tempRukuArr中的响应属性改掉
            //按钮本身改为'保存'
            $(this).html('保存').removeClass('option-save1').addClass('option-bianji1').html('编辑');

            for(var i=0;i<_tempRukuArr.length;i++){

                if(_tempRukuArr[i].itemNum == putInGoods.bianhao && _tempRukuArr[i].localNum == $('.kuwei').attr('data-num')){

                    //修改每个符合条件的耐用品的品质
                    _tempRukuArr[i].batchNum = putInGoods.quality;

                    //修改每个符合条件的耐用品的质保期
                    _tempRukuArr[i].maintainDate = putInGoods.warranty;

                    //修改每个符合条件的耐用品的单价(实际)
                    _tempRukuArr[i].inPrice = $('.inprice').attr('data-num');

                    ////修改每个符合条件的耐用品的单价(显示)
                    _tempRukuArr[i].showPrice = putInGoods.inprice;

                    //修改每个符合条件的耐用品的单价
                    _tempRukuArr[i].amount = putInGoods.inprice;

                }

            }

            var spareArr = [];

            foldFun(spareArr,_tempRukuArr);

            _datasTable($('#wuPinListTable1'),spareArr);

            //初始化input
            newGoodsInit();

        }

    })

    //新增入库产品的时候直接添加入库单
    $('#myModal1')
        .on('click','.dengji',function(){

            _rukuArr.length = 0;

            for(var i=0;i<_tempRukuArr.length;i++){

                _rukuArr.push(_tempRukuArr[i]);

            }

            djOrBj('YWCK/ywCKAddInStorage',false,'添加成功！','添加失败！',true);

        })
        .on('click','.bianji',function(){

            _rukuArr.length = 0;

            for(var i=0;i<_tempRukuArr.length;i++){

                _rukuArr.push(_tempRukuArr[i]);

            }

            djOrBj('YWCK/ywCKEditInStorage',true,'编辑成功！','编辑失败！',true);

        })
    //第一层弹窗-------------------------------------------------------------------------------------------

    //【删除】'shanchu'删除入库单.'xiaoShanchu'删除入库产品（第一层）.'removeButton'删除入库产品（第二层）；

    //入库单【新增物品】
    $('.zhiXingRenYuanButton').click(function(){

        //是否已选中仓库
        if(putInList.ckselect == '' || putInList.rkleixing == ''){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择红色必填项！', '');

        }else{
            //模态框显示
            _moTaiKuang($('#myModal1'), '新增入库产品', '', '' ,'');

            _addGoods = true;

            getKQ(putInList.ckselect);

            _tempRukuArr.length = 0;

            for(var i=0;i<_rukuArr.length;i++){

                _tempRukuArr.push(_rukuArr[i]);

            }

            var spareArr = [];

            //数组去重
            foldFun(spareArr,_tempRukuArr);

            //将已选中的入库产品填入表格中
            _datasTable($('#wuPinListTable1'),spareArr);

            //共计
            //数量
            var num = 0;

            var amount = 0;

            for(var i=0;i<spareArr.length;i++){

                num += Number(spareArr[i].num);

                amount += Number(spareArr[i].amount);

            }

            $('#wuPinListTable1 tfoot').find('.amount1').html(num);

            $('#wuPinListTable1 tfoot').find('.count1').html(amount.toFixed(2));

            //初始化
            newGoodsInit(true);

        }



    })

    //点击【新增物品】模态框出现后执行的方法
    $('#myModal1').on('shown.bs.modal',function(){

        if(_addGoods){

            $('.warranty').focus();

            if($('.datepicker:visible')){

                $('.datepicker').hide();

            }

            //自动聚焦
            newGoodsInit(true);

            _addGoods = false;
        }

    })

    //第一层【查看】【删除】
    $('#personTable1')
        .on('click','.option-see1',function(){

            var $thisBM = $(this).parents('tr').children('.bianma').html();

            var $thisKQ= $(this).parents('tr').children('.localName').children().attr('data-num');

            var $thisSN = $(this).parents('tr').children('.sn').html();

            //模态框
            _moTaiKuang($('#myModal6'), '入库产品详情', 'flag', '' ,'', '');

            //初始化
            seeDetail();

            //赋值
            function secondView(data) {

                for (var i = 0; i < data.length; i++) {

                    if ($thisBM == data[i].itemNum && $thisKQ == data[i].localNum && $thisSN == data[i].sn) {

                        //物品编号
                        rukuObject.bianhao = data[i].itemNum;
                        //物品名称
                        rukuObject.mingcheng = data[i].itemName;
                        //规格型号
                        rukuObject.size = data[i].size;
                        //是否耐用
                        rukuObject.durable = data[i].isSpare;
                        //序列号
                        rukuObject.goodsId = data[i].sn;
                        //单位
                        rukuObject.unit = data[i].unitName;
                        //品质
                        rukuObject.quality = data[i].batchNum;
                        //质保期
                        rukuObject.warranty = data[i].maintainDate;
                        //数量
                        rukuObject.num = data[i].num;
                        //入库单价
                        rukuObject.inPrice = formatNumber(Number(data[i].inPrice),3);
                        //金额
                        rukuObject.amount = formatNumber(Number(data[i].amount),2);
                        //备注
                        rukuObject.remark = data[i].inMemo;


                    }

                }

                //单选按钮
                if (rukuObject.durable == 0) {

                    $('.durable').parent('span').removeClass('checked');

                    $('#second').parent('span').addClass('checked');

                } else {

                    $('.durable').parent('span').removeClass('checked');

                    $('#first').parent('span').addClass('checked');
                }

            }

            detailInfo(_ruCode,secondView);

        })
        .on('click','.option-shanchu',function(){

            removeRK($(this),_rukuArr);

            //修改类名
            $('#myModal2').find('.btn-primary').removeClass('daShanchu').removeClass('removeButton').addClass('xiaoShanchu');

        })

    //第一层【删除】,耐用品
    $('#personTable1').on('click','.option-DelSpare',function(){

        //模态框
        _moTaiKuang($('#spareRKD-del'),'确定要删除吗？','','istap','确定要删除此组耐用品吗？','删除');

        var $thisBM = $(this).parents('tr').children('.bianma').html();

        var $thisMC = $(this).parents('tr').children('.bianma').next().html();

        var $thisKQ = $(this).parents('tr').children('.localName').children().attr('data-num');

        _spareArr.length = 0;

        for(var i=0;i<_rukuArr.length;i++){

            if(_rukuArr[i].isSpare == 1 && _rukuArr[i].itemNum == $thisBM && _rukuArr[i].itemName == $thisMC && _rukuArr[i].localNum == $thisKQ){

                _spareArr.push(_rukuArr[i]);

            }

        }

    })

    //删除确定按钮
    $('#spareRKD-del').find('.btn-primary').click(function(){

        for(var i=0;i<_rukuArr.length;i++){

            for(var j=0;j<_spareArr.length;j++){

                _rukuArr.remove(_spareArr[j]);

            }

        }

        var spareArr = [];

        foldFun(spareArr,_rukuArr);

        _datasTable($('#personTable1'),spareArr);

        $('#spareRKD-del').modal('hide');

    })

    //第一层【查看】，耐用品
    $('#personTable1').on('click','.option-seeSpare',function(){

        _moTaiKuang($('#spare-modal'),'耐用品列表','flag','','','');

        var $thisBM = $(this).parents('tr').children('.bianma').html();

        var $thisMC = $(this).parents('tr').children('.bianma').next().html();

        var $thisKQ = $(this).parents('tr').children('.localName').children().attr('data-num');

        _spareArr.length = 0;

        for(var i=0;i<_rukuArr.length;i++){

            if(_rukuArr[i].isSpare == 1 && _rukuArr[i].itemNum == $thisBM && _rukuArr[i].itemName == $thisMC && _rukuArr[i].localNum == $thisKQ){

                _spareArr.push(_rukuArr[i]);

            }

        }

        _datasTable($('#spare-table'),_spareArr);

        $('#spare-table').find('.table-option').addClass('hiddenButton');

    })

    //刷新物品列表
    $('#reGoods').on('click',function(){

        var prm = {
            'ItemNum':'',
            'itemName':'',
            'cateName':'',
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItems',
            data:prm,
            beforeSend:function(){
                //刷新按钮旋转
                var i=0;
                _rotate = setInterval(function(){
                    i++;
                    var deg = i;
                    $('.refresh').eq(1).css({
                        'transform':'rotate(' + deg + 'deg)'
                    },1000)
                })
            },
            success:function(result){

                clearInterval(_rotate);

                _wpListArr.length = 0;

                for(var i=0;i<result.length;i++){

                    _wpListArr.push(result[i]);

                }

                var str = '';

                //给物品编码和物品名称的列表赋初始值
                arrList(str,result,false);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    })

    //倒入出库单-------------------------------------------------------------------------------------------

    $('.chukuDan').click(function(){

        _moTaiKuang($('#myModal7'), '出库单', '', '' ,'', '确定');

        chuInit();

    })

    //查询出库单
    $('#selected1').click(function(){

        chukuList();

    })

    //选中入库单，写入表格
    $('#scrap-datatables3 tbody').on('click','tr',function(){

        //样式改变
        $('#scrap-datatables3 tbody').find('tr').css({'background':'#ffffff'});

        $(this).css({'background':'#FBEC88'});

        _chukuD = $(this).children('.orderNum').children('a').html();
    })

    //选中出库单确定按钮
    $('#myModal7').on('click','.btn-primary',function(){

        $('#myModal7').modal('hide');
        //出去出库单的详情
        var prm = {
            orderNum:_chukuD,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorageDetail',
            data:prm,
            success:function(result){

                //_rukuArr = [];
                for(var i=0;i<result.length;i++){
                    var obj = {};
                    obj.sn = result[i].sn;
                    obj.itemNum = result[i].itemNum;
                    obj.itemName = result[i].itemName;
                    obj.size = result[i].size;
                    obj.isSpare = result[i].isSpare;
                    obj.unitName = result[i].unitName;
                    obj.batchNum = result[i].batchNum;
                    obj.maintainDate = result[i].maintainDate;
                    obj.num = result[i].num;
                    obj.inPrice = result[i].outPrice;
                    obj.amount = result[i].amount;
                    obj.inMemo = result[i].outMemo;
                    obj.userID=_userIdNum;
                    obj.userName = _userIdName;
                    obj.storageName = result[i].storageName;
                    obj.storageNum = result[i].storageNum;
                    obj.localName = result[i].localName;
                    obj.localNum = result[i].localNum;
                    _rukuArr.push(obj);
                }

                var spareArr = [];

                foldFun(spareArr,_rukuArr);

                _datasTable($('#personTable1'),spareArr);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    })


    //第二层弹窗-------------------------------------------------------------------------------------------

    //添加入库产品【添加】
    $('#addRK').click(function(){

        rukuTable(true);

    });

    //添加入库产品【重置】
    $('#addReset').click(function(){

        //初始化
        newGoodsInit(true);

    });

    //添加入库产品【编辑】
    $('#wuPinListTable1')
        .on('click','.option-bianji',function(){

            //本身表格样式修改
            $('#wuPinListTable1 tbody').children('tr').removeClass('tables-hover');

            $(this).parents('tr').addClass('tables-hover');

            //按钮本身改为'保存'
            $(this).html('保存').removeClass('option-bianji').addClass('option-save');

            //编辑的时候，库区、编码、名称、规格型号、是否耐用、单位不可操作。
            $('#workDone').find('.not-editable').attr('readonly','readonly').addClass('disabled-block');

            $('#workDone').find('.not-editable').parents('.input-blockeds').addClass('disabled-block');

            //获取当前的物品编码，库位编码，还有物品序列号来判断选中的是哪一项
            var wpNum = $(this).parents('tr').children('.bianma').html();

            var kwNum = $(this).parents('tr').children('.localName').children('span').attr('data-num');

            var snNum = $(this).parents('tr').children('.sn').html();

            //遍历已选中的数组，来确定当前行选中的信息
            for(var i=0;i<_tempRukuArr.length;i++){

                if( _tempRukuArr[i].itemNum == wpNum && _tempRukuArr[i].localNum == kwNum && _tempRukuArr[i].sn == snNum ){
                    //赋值
                    //库位名称

                    putInGoods.kuwei = _tempRukuArr[i].localName;
                    //库位编号
                    $('.kuwei').attr('data-num',_tempRukuArr[i].localNum);
                    //物品编号
                    putInGoods.bianhao = _tempRukuArr[i].itemNum;
                    //物品名称
                    putInGoods.mingcheng = _tempRukuArr[i].itemName;
                    //规格型号
                    putInGoods.size = _tempRukuArr[i].size;
                    //是否耐用
                    putInGoods.picked = _tempRukuArr[i].isSpare;
                    //物品序列号
                    putInGoods.goodsId = _tempRukuArr[i].sn;
                    //单位
                    putInGoods.unit = _tempRukuArr[i].unitName;
                    //品质
                    putInGoods.quality = _tempRukuArr[i].batchNum;
                    //质保期
                    putInGoods.warranty = _tempRukuArr[i].maintainDate;
                    //数量
                    putInGoods.num = _tempRukuArr[i].num;
                    //入库单价（显示）
                    putInGoods.inprice = _tempRukuArr[i].showPrice;
                    //入库单价（实际）
                    $('.inprice').attr('data-num',_tempRukuArr[i].inPrice);
                    //总金额
                    putInGoods.amount = _tempRukuArr[i].amount;
                    //备注
                    putInGoods.remark = _tempRukuArr[i].inMemo;

                    //单选设置(消耗品的时候，序列号可以改变，耐用品的时候，序列号不可以改变)

                    $('.inpus').parents('span').removeClass('checked');

                    if( putInGoods.picked == 0 ){

                        $('.inpus').eq(1).parent('span').addClass('checked');

                        //数量可改变
                        $('#workDone').find('.rknum').removeAttr('readonly').removeClass('disabled-block');

                        $('#workDone').find('.rknum').parents('.input-blockeds').removeClass('disabled-block');

                    }else if( putInGoods.picked == 1 ){

                        $('.inpus').eq(0).parent('span').addClass('checked');

                        //数量不可改变
                        $('#workDone').find('.rknum').attr('readonly','readonly').addClass('disabled-block');

                        $('#workDone').find('.rknum').parents('.input-blockeds').addClass('disabled-block');

                    }

                }
            }

        })
        .on('click','.option-save',function(){

            //将input中的内容填写到表格中
            //rukuTable(false);
            //验证数量正则
            var o = $('.format-error')[0].style.display;
            //入库单价格式
            var s = $('.format-error1')[0].style.display;
            //不耐用时，物品id要与物品编码一致
            var a = $('.isEqual')[0].style.display;
            //序列号是否唯一
            var b = $('.isEnabled')[0].style.display;

            if( o!='none' && s!='none' && a!='none' && b!='none' ){

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'输入有误！', '');

            }else{

                //判断数量是否输入大于0
                if( putInGoods.num != '' && putInGoods.num > 0 ){

                    //获取入库单信息创建对象，存入_tempRukuArr数组
                    var rukuDan = {};
                    //库区、物品编号、物品名称、规格型号、是否耐用、物品序列号、单位、品质、质保期、数量、入库单价、总金额、备注
                    //var price = putInGoods.inprice;
                    var price = $('.inprice').attr('data-num');

                    if(Number(price) == ''){

                        price = 0.00

                    }else{

                        price = formatNumber(Number(price),3);

                    }

                    var showPrice = putInGoods.inprice;

                    if(Number(showPrice) == ''){

                        showPrice = 0.00

                    }else{

                        showPrice = formatNumber(Number(price),3);

                    }
                    rukuDan.localNum = $('.kuwei').attr('data-num');
                    rukuDan.localName = putInGoods.kuwei;
                    rukuDan.itemNum = putInGoods.bianhao;
                    rukuDan.itemName = putInGoods.mingcheng;
                    rukuDan.size = putInGoods.size;
                    rukuDan.isSpare = putInGoods.picked;
                    rukuDan.sn = putInGoods.goodsId;
                    rukuDan.unitName = putInGoods.unit;
                    rukuDan.batchNum = putInGoods.quality;
                    rukuDan.maintainDate = putInGoods.warranty;
                    rukuDan.num = putInGoods.num;
                    //实际数据
                    rukuDan.inPrice = price;
                    //显示数据
                    rukuDan.showPrice = showPrice;
                    rukuDan.amount = putInGoods.amount;
                    rukuDan.inMemo = putInGoods.remark;


                    //判断仓库、如果没有选择的话直接填''
                    var ckName = '';

                    if($('#ckselect').val() == ''){
                        ckName = ''
                    }else{
                        ckName = $('#ckselect').children('option:selected').html();
                    }

                    rukuDan.storageName = ckName;

                    rukuDan.storageNum = $('#ckselect').val();


                    for(var i=0;i<_tempRukuArr.length;i++){

                        if( _tempRukuArr[i].itemNum == rukuDan.itemNum &&  _tempRukuArr[i].sn == rukuDan.sn && _tempRukuArr[i].localNum == rukuDan.localNum ){

                            //修改(可修改的有库位、品质、质保期、数量、入库单价、总金额、备注)
                            //库位编码
                            //_tempRukuArr[i].localNum = $('.kuwei').attr('data-num');
                            //库位名称
                            //_tempRukuArr[i].localName = putInGoods.kuwei;
                            //品质
                            _tempRukuArr[i].batchNum = putInGoods.quality;
                            //质保期
                            _tempRukuArr[i].maintainDate = putInGoods.warranty;
                            //数量
                            _tempRukuArr[i].num = putInGoods.num;
                            //单价
                            _tempRukuArr[i].inPrice = putInGoods.inprice;
                            //总金额
                            _tempRukuArr[i].amount = putInGoods.amount;
                            //备注
                            _tempRukuArr[i].inMemo = putInGoods.remark;

                            //console.log( _tempRukuArr[i] );
                        }
                    }

                    var spareArr = [];

                    foldFun(spareArr,_tempRukuArr);

                    _datasTable($('#wuPinListTable1'),spareArr);

                    //共计
                    //数量
                    var num = 0;

                    var amount = 0;

                    for(var i=0;i<spareArr.length;i++){

                        num += Number(spareArr[i].num);

                        amount += Number(spareArr[i].amount);

                    }

                    $('#wuPinListTable1 tfoot').find('.amount1').html(num);

                    $('#wuPinListTable1 tfoot').find('.count1').html(amount.toFixed(2));

                    //清空
                    newGoodsInit();

                }else{

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'输入有误！', '');

                }

            }


        })
        .on('click','.option-shanchu',function(){

            removeRK($(this),_tempRukuArr);

            //修改类名
            $('#myModal2').find('.btn-primary').removeClass('daShanchu').removeClass('xiaoShanchu').addClass('removeButton');

            var wpNum = $(this).parents('tr').children('.bianma').html();

            var kwNum = $(this).parents('tr').children('.localName').children('span').attr('data-num');

            var snNum = $(this).parents('tr').children('.sn').html();

            //库位编码、物品编码、物品序列号一致才能删除
            for(var i=0;i<_rukuArr.length;i++){

                if( _rukuArr[i].itemNum == wpNum && _rukuArr[i].localNum == kwNum && _rukuArr[i].sn == snNum ){

                    _$thisRemoveRowXiao = _rukuArr[i].itemNum;

                    _moTaiKuang($('#myModal2'), '提示', '', 'istap' ,'确定要删除吗？', '删除');

                    //弹出框增加类（daShanchu是入库单删除、xiaoShanchu是第一层已选中的入库产品删除、removeButton是第二层已选中入库产品删除）
                    $('#myModal2').find('.btn-primary').removeClass('daShanchu').removeClass('xiaoShanchu').addClass('removeButton');

                }
            }


        })

    //添加入库产品【编辑】，耐用品
    $('#wuPinListTable1').on('click','.option-editSpare',function(){

        //本身表格样式修改
        $('#wuPinListTable1 tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //按钮本身改为'保存'
        $(this).html('保存').removeClass('option-editSpare').addClass('option-saveSpare');

        //编辑的时候，库区、编码、名称、规格型号、是否耐用、单位不可操作。
        $('#workDone').find('.not-editable').attr('readonly','readonly').addClass('disabled-block');

        $('#workDone').find('.not-editable').parents('.input-blockeds').addClass('disabled-block');

        //数量也不能修改
        $('.rknum').attr('readonly','readonly').addClass('disabled-block');

        $('.rknum').parent('.input-blockeds').addClass('disabled-block');

        //获取当前的物品编码，库位编码，还有物品序列号来判断选中的是哪一项
        var wpNum = $(this).parents('tr').children('.bianma').html();

        var kwNum = $(this).parents('tr').children('.localName').children('span').attr('data-num');

        for(var i=0;i<_foldArr.length;i++){

            if(_foldArr[i].itemNum == wpNum && _foldArr[i].localNum == kwNum && _foldArr[i].isSpare == 1){

                //遍历_tempRukuArr,确定定序列号
                var str = '';

                var arr = [];

                for(var j=0;j<_tempRukuArr.length;j++){

                    //将库区、物品编码一致的放到arr中
                    if(_tempRukuArr[j].itemNum == _foldArr[i].itemNum && _tempRukuArr[j].localNum == _foldArr[i].localNum && _tempRukuArr[j].isSpare == _foldArr[i].isSpare){

                        arr.unshift(_tempRukuArr[j])

                    }

                }

                for(var j=0;j<arr.length;j++){

                    if(j == arr.length-1){

                        str += arr[j].sn;

                    }else{

                        str += arr[j].sn + ',';

                    }


                }

                //绑定数据
                //库位名称
                putInGoods.kuwei = _foldArr[i].localName;
                //库位编号
                $('.kuwei').attr('data-num',_foldArr[i].localNum);
                //物品编号
                putInGoods.bianhao = _foldArr[i].itemNum;
                //物品名称
                putInGoods.mingcheng = _foldArr[i].itemName;
                //规格型号
                putInGoods.size = _foldArr[i].size;
                //是否耐用
                putInGoods.picked = _foldArr[i].isSpare;
                //物品序列号
                putInGoods.goodsId = str;
                //单位
                putInGoods.unit = _foldArr[i].unitName;
                //品质
                putInGoods.quality = _foldArr[i].batchNum;
                //质保期
                putInGoods.warranty = _foldArr[i].maintainDate;
                //数量
                putInGoods.num = _foldArr[i].num;
                //入库单价
                putInGoods.inprice = _foldArr[i].inPrice;
                //总金额
                putInGoods.amount = _foldArr[i].amount;
                //备注
                putInGoods.remark = _foldArr[i].inMemo;

            }

        }

    })

    //添加入库产品【保存】，耐用品
    $('#wuPinListTable1').on('click','.option-saveSpare',function() {

        ////格式验证
        var o = $('.format-error')[0].style.display;
        //入库单价格式
        var s = $('.format-error1')[0].style.display;
        //不耐用时，物品id要与物品编码一致
        var a = $('.isEqual')[0].style.display;
        //序列号是否唯一
        var b = $('.isEnabled')[0].style.display;

        if (o != 'none' && s != 'none' && a != 'none' && b != 'none') {

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'输入有误！', '');

        }else{

            //判断数量是否输入大于0
            if(putInGoods.num != '' && putInGoods.num > 0){

                //首先判断修改的是哪些东西(修改_tempRuKuArr的东西)
                //根据库区，物品编码来确定
                for(var i=0;i<_tempRukuArr.length;i++){

                    if(_tempRukuArr[i].localNum == $('.kuwei').attr('data-num') && _tempRukuArr[i].itemNum == putInGoods.bianhao && _tempRukuArr[i].isSpare == 1){

                        //品质
                        _tempRukuArr[i].batchNum = putInGoods.quality;

                        //质保期
                        _tempRukuArr[i].maintainDate = putInGoods.warranty;

                        //单价
                        _tempRukuArr[i].inPrice = putInGoods.inprice;

                        //总价
                        _tempRukuArr[i].amount = putInGoods.inprice;

                        //备注
                        _tempRukuArr[i].inMemo = putInGoods.remark;

                    }

                }

                console.log(_tempRukuArr);

                _foldArr.length = 0;

                foldFun(_foldArr,_tempRukuArr);

                _datasTable($('#wuPinListTable1'),_foldArr);

                //重新计算总金额和数量

                var goodsNum = 0;

                var goodsAmount = 0;

                for(var i=0;i<_foldArr.length;i++){

                    goodsNum += Number(_foldArr[i].num);

                    goodsAmount += Number(_foldArr[i].amount);

                }

                $('.amount1').html(goodsNum);

                $('.count1').html(goodsAmount.toFixed(2));

            }else{

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'输入有误！', '');

            }

        }

    })

    //入库产品第二层弹框【删除】
    $('#myModal2')
        .on('click','.removeButton',function(){

            sureRemoveRK($('#wuPinListTable1'),_tempRukuArr,_tempRKObj[0]);

            $(this).removeClass('removeButton');

        })
        //入库产品第一层
        .on('click','.xiaoShanchu',function(){


            sureRemoveRK($('#personTable1'),_rukuArr,_tempRKObj[0]);

            //var spareArr = [];
            //
            //spareArr = foldFun(spareArr,_rukuArr);


            $(this).removeClass('xiaoShanchu');

        })

    //确定入库产品第二层【选择】
    $('#myModal1').on('click','.ruku',function(){

        _rukuArr.length = 0;

        //将暂存的数组传给_rukuArr;
        for(var i=0;i<_tempRukuArr.length;i++){

            _rukuArr.push(_tempRukuArr[i]);

        }

        var spareArr = [];

        //去重数组

        foldFun(spareArr,_rukuArr);

        _datasTable($('#personTable1'),spareArr);

        //共计
        //数量
        var num = 0;

        var amount = 0;

        for(var i=0;i<spareArr.length;i++){

            num += Number(spareArr[i].num);

            amount += Number(spareArr[i].amount);

        }

        $('#personTable1 tfoot').find('.amount').html(num);

        $('#personTable1 tfoot').find('.count').html(amount.toFixed(2));

        $('#myModal1').modal('hide');

    })

    //点击按钮选择入库--------------------------------------------------------------------------------------
    //选择入库物品
    $('.tianJiaruku').click(function(){

        //初始化
        selectWPInit()

        //模态框
        _moTaiKuang($('#myModal4'),'选择入库产品', '', '' ,'', '选择');

    })

    //选择入库物品条件查询
    $('#selected2').click(function(){

        var prm = {
            'ItemNum':$('#myModal4').find('.filterInput1').val(),
            'itemName':$('#myModal4').find('.filterInput2').val(),
            'cateName':$('#myModal4').find('#filterInput3').children('option:checked').html(),
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItems',
            data:prm,
            success:function(result){
                _datasTable($("#wuPinListTable"),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    })

    //点击表格，选择物品
    //选择物品列表
    $('#wuPinListTable tbody').on('click','tr',function(){

        $('#wuPinListTable tbody').children('tr').removeClass('tables-hover');

        $(this).addClass('tables-hover');

        _$thisWP = $(this).children('.bianma').html();
    });

    //确定选中的物品
    $('#myModal4').on('click','.btn-primary',function(){

        //首先初始化
        newGoodsInit(true);

        //确定选中的物品，并且赋值
        for(var i=0;i<_wpListArr.length;i++){

            if(_$thisWP == _wpListArr[i].itemNum){

                //赋值
                //物品编码
                putInGoods.bianhao = _wpListArr[i].itemNum;
                //物品名称
                putInGoods.mingcheng = _wpListArr[i].itemName;
                //规格型号
                putInGoods.size = _wpListArr[i].size;
                //是否耐用
                putInGoods.picked = _wpListArr[i].isSpare;
                //单位
                putInGoods.unit = _wpListArr[i].unitName;
                //是否耐用分情况
                $('.inpus').parents('span').removeClass('checked');

                if(putInGoods.picked == 0){

                    //消耗品
                    $('#twos').parents('span').addClass('checked');

                    //序列号等于物品编号（并且不可操作）
                    putInGoods.goodsId = putInGoods.bianhao;

                    $('.goodsId').attr('readonly','readonly').addClass('disabled-block');

                    $('.goodsId').parent().addClass('disabled-block');

                    //数量
                    $('.rknum').removeAttr('readonly').removeClass('disabled-block');

                    $('.rknum').parent().removeClass('disabled-block');

                    //数量置为空
                    putInGoods.num = '';


                }else{

                    //耐用品
                    $('#ones').parents('span').addClass('checked');

                    //序列号需要填写、数量必须为1且不可编辑

                    putInGoods.num = '1';

                    $('.rknum').attr('readonly','readonly').addClass('disabled-block');

                    $('.rknum').parent().addClass('disabled-block');

                    //序列号可填
                    $('.goodsId').removeAttr('readonly','readonly').removeClass('disabled-block');

                    $('.goodsId').parent().removeClass('disabled-block');

                }
            }

        }

        //模态框消失
        $('#myModal4').modal('hide');

    });

    //批量增加sn--------------------------------------------------------------------------------------------

    $('#batch-add').click(function(){

        //首先判断库区和物品是否选择了
        if( $('#workDone').find('.kuwei').attr('data-num') == '' || putInGoods.bianhao == ''){

            _moTaiKuang($('#myModal2'),'提示',true,'istap','请先选择仓库和物品','');

        }else{

            if(putInGoods.picked == 1){

                //模态框
                _moTaiKuang($('#batchSn-modal'),'批量添加序列号','','','','添加');

                _batchArr.length = 0;

                $('#batchSn-modal').find('ul').empty();

                $('#batchSn-modal').find('input').val('');

                //将已选中的序列号提示出来

                var str = '';

                for(var i=0;i<_tempRukuArr.length;i++){

                    if(_tempRukuArr[i].localNum == $('#workDone').find('.kuwei').attr('data-num') && _tempRukuArr[i].itemNum == putInGoods.bianhao && _tempRukuArr[i].itemName == putInGoods.mingcheng){

                        str += _tempRukuArr[i].sn + '、';

                    }

                }

                $('.selected-sn').empty().append(str);

                //重复提示框隐藏
                $('#batchSn-modal').find('.colorTip').hide();

                //判断是否有已选中的序列号，有显示，无隐藏

                if($.trim($('.selected-sn').text()) == '' ){

                    $('.selected-sn').parent().hide();

                    $('.title-num').children().eq(0).children('span').html(0);

                    $('.title-num').children().eq(1).children('span').html(0);

                }else{

                    var temp = $.trim($('.selected-sn').text()).split('、').length-1;

                    $('.title-num').children().eq(1).children('span').html(temp);

                    $('.title-num').children().eq(0).children('span').html(0);

                    $('.selected-sn').parent().show();

                }

            }else if(putInGoods.picked == 0){

                return false;

            }



        }

    })

    //批量添加静态添加操作（放大镜）
    $('#batchSn-modal').on('click','#addSn',function(){

        batchFun();

    })

    //批量添加键盘回车操作
    $('#batchSn-modal').on('keyup','input',function(e){

        if(e.keyCode == 13){

            batchFun();

        }

    })

    //批量删除操作
    $('#batchSn-modal').on('click','.subBatch',function(){

        var value = $(this).parent().children('.subSn').html();

        _batchArr.remove(value);

        var str = '';

        for(var i=0;i<_batchArr.length;i++){

            str += '<li style="line-height: 30px;"><span class="subSn">' + _batchArr[i] + '</span><span class="subBatch"></span></li>'

        }

        $('#batchSn-modal').find('ul').empty().append(str);

    })

    //批量添加（填入入库产品input中）
    $('#batchSn-modal').on('click','.btn-primary',function(){

        $('#batchSn-modal').modal('hide');

        var str = '';

        for(var i=0;i<_batchArr.length;i++){

            if(i == _batchArr.length-1){

                str += _batchArr[i];

            }else{

                str += _batchArr[i] + ',';

            }



        }

        $('.goodsId').empty().append(str);

        putInGoods.goodsId = str;

        //根据字符串来确定数量

        var numArr = putInGoods.goodsId.split(',');

        putInGoods.num = numArr.length;

        //总价清空
        putInGoods.amount = '';

        //根据数量和单价计算总价
        putInGoods.amount = formatNumber(putInGoods.num * putInGoods.inprice,2);

    })

    //批量添加的表格按钮--------------------------------------------------------------------------------------

    //查看
    $('#wuPinListTable1 tbody').on('click','.option-seeSpare',function(){

        //模态框
        _moTaiKuang($('#spare-modal'),'耐用品列表','flag','','','');

        //初始化表格
        var arr = [];

        _datasTable($('#spare-table'),arr);

        //比较相同的库区，编号，名称，将耐用品挑选中出

        var $thisBM = $(this).parents('tr').children('.bianma').html();

        var $thisMC = $(this).parents('tr').children('.bianma').next().html();

        var $thisKQ = $(this).parents('tr').children('.localName').children().attr('data-num');

        _spareArr.length = 0;

        for(var i=0;i<_tempRukuArr.length;i++){

            if(_tempRukuArr[i].isSpare == 1 && _tempRukuArr[i].itemNum == $thisBM && _tempRukuArr[i].itemName == $thisMC && _tempRukuArr[i].localNum == $thisKQ){

                _spareArr.push(_tempRukuArr[i]);

            }

        }

        _datasTable($('#spare-table'),_spareArr);

        $('#spare-table').find('.table-option').removeClass('hiddenButton');

        //查看按钮隐藏
        $('#spare-table tbody').find('.option-seeSpare').addClass('hiddenButton');

        $('#spare-table tbody').find('.option-editSpare').addClass('hiddenButton');
    })

    //删除
    $('#wuPinListTable1 tbody').on('click','.option-DelSpare',function(){

        _moTaiKuang($('#spare-del'),'确定要删除吗？','','istap','确定要删除此组耐用品吗?','删除');

        //比较相同的库区，编号，名称，将耐用品挑选中出

        var $thisBM = $(this).parents('tr').children('.bianma').html();

        var $thisMC = $(this).parents('tr').children('.bianma').next().html();

        var $thisKQ = $(this).parents('tr').children('.localName').children().attr('data-num');

        _spareArr.length = 0;

        for(var i=0;i<_tempRukuArr.length;i++){

            if(_tempRukuArr[i].isSpare == 1 && _tempRukuArr[i].itemNum == $thisBM && _tempRukuArr[i].itemName == $thisMC && _tempRukuArr[i].localNum == $thisKQ){

                _spareArr.push(_tempRukuArr[i]);

            }

        }

    })

    //删除耐用品组的确定按钮
    $('#spare-del').on('click','.btn-primary',function(){

        //删除_tempRukuArr,_foldArr

        for(var i=0;i<_spareArr.length;i++){

            _tempRukuArr.remove(_spareArr[i]);

        }

        _foldArr.length = 0;

        foldFun(_foldArr,_tempRukuArr);

        _datasTable($('#wuPinListTable1'),_foldArr);

        $('#spare-del').modal('hide');


    })

    var _$this = '';

    //删除单个的某个耐用品
    $('#spare-table tbody').on('click','.option-DelSpare',function(){

        //样式修改
        $('#spare-table tbody').children('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        _moTaiKuang($('#spare-delTip'),'确定要删除吗？','','istap','确定要删除吗？','删除');

        _$this = $(this);

    })

    //删除单个的某个耐用品【确定】
    $('#spare-delTip').find('.btn-primary').click(function(){

        //确定库区，序列号，编码，名称
        var $thisBM = _$this.parents('tr').children('.bianma').html();

        var $thisMC = _$this.parents('tr').children('.bianma').next().html();

        var $thisKQ = _$this.parents('tr').children('.localName').children().attr('data-num');

        var $thisSN = _$this.parents('tr').children('.sn').html();

        var obj = {};

        for(var i=0;i<_spareArr.length;i++){

            if(_spareArr[i].isSpare == 1 && _spareArr[i].itemNum == $thisBM && _spareArr[i].itemName == $thisMC && _spareArr[i].localNum == $thisKQ && _spareArr[i].sn == $thisSN){

                obj = _spareArr[i];

                _tempRukuArr.remove(obj);

            }

        }

        for(var i=0;i<_spareArr.length;i++){

            if(_spareArr[i].isSpare == 1 && _spareArr[i].itemNum == $thisBM && _spareArr[i].itemName == $thisMC && _spareArr[i].localNum == $thisKQ && _spareArr[i].sn == $thisSN){

                obj = _spareArr[i];

                _spareArr.remove(obj);

            }

        }

        _datasTable($('#spare-table'),_spareArr);

        //查看按钮隐藏
        $('#spare-table tbody').find('.option-seeSpare').addClass('hiddenButton');


        $('#spare-table tbody').find('.option-editSpare').addClass('hiddenButton');

        $('#spare-delTip').modal('hide');

        //刷新表格数据
        _foldArr.length = 0;

        foldFun(_foldArr,_tempRukuArr);

        _datasTable($('#wuPinListTable1'),_foldArr);




    })

    /*------------------------------------------------入库产品键盘事件--------------------------------------*/

    //敲击回车，自动换行
    $('.inputType').keyup(function(e){

        var e = e||window.event;

        if(e.keyCode == 13 ){

            _numIndex = -1;

            if( $(this).parents('.gdList').next('li').find('.inputType').attr('id') == 'addRK' ){

                //当前如果是添加按钮的话，敲击回车，自动想表格添加数据
                //首先判断非空(库位、编号、名称、数量)
                if( putInGoods.kuwei == '' || putInGoods.bianhao == '' || putInGoods.mingcheng == '' || putInGoods.num == '' ){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项!', '');

                }else{

                    rukuTable(true);

                }

            }else{
                $(this).parents('.gdList').next('li').find('.inputType').focus();
            }

        }else{

            return false

        }


    })

    /*------------------------------------------------入库产品点击事件-------------------------------------*/
    //点击其他地方所有下拉框都消失
    $(document).click(function(e){

        var e = e||window.event;

        if(e.srcElement){

            if(e.srcElement.className.indexOf('focusEle')>=0){

            $('.hidden1').hide();

            var el = $(e.srcElement);

            if(el.parent().attr('class').indexOf('disabled-block')>=0){

                return false;

            }else{

                el.next().next().show();

            }

        }else if( e.srcElement.className.indexOf('selectBlock')>=0 ){

            if($(this).parent('.input-blockeds').hasClass('disabled-block')){

                        return false;

                    }else{


                        if( $(this).next('.kuqu-list').length != 0 ){

                            //库区

                            //过滤后的下拉列表
                            inputFQName();

                        }else if($(this).next('.wpbm').length != 0){

                            //物品编码

                            //过滤后的下拉列表
                            inputBMName();

                        }else if( $(this).next('.wpmc').length != 0 ){

                            //物品名称

                            //过滤后的下拉列表
                            inputMCName();

                        }

                        var this1 = $(e.srcElement);

                        if( this1.next()[0].style.display == 'none' ){

                            this1.next().show();

                        }else if( this1.next()[0].style.display != 'none' ){

                            this1.next().hide();

                        }

                    }

        }else if( e.srcElement.className.indexOf('quality')>=0 ){

            $('.hidden1').hide();

            var this1 = $(e.srcElement);


            this1.next().next().show();

        }else{

            $('.hidden1').hide();

        }

        }
    });

    //所有下拉框的mouseover事件
    $('.hidden1').on('mouseover','li,div',function(){

        $(this).parents('.hidden1').children().removeClass('li-color');

        $(this).addClass('li-color');

        _numIndex = $(this).index();

    })

    //库位选择
    $('.kuqu-list').on('click','li',function(){

        enterFQName();

    })

    //物品编号选择
    $('.wpbm').on('click','li',function(){

        enterBMName();

    })

    //物品名称
    $('.wpmc').on('click','li',function(){

        enterMCName();

    })

    //品质选择
    $('.pinzhixx').on('click','li',function(){

        enterQualityName();

    })


    /*------------------------------------------------其他方法----------------------------------------------*/
    //条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var realityStart = filterInput[1] + ' 00:00:00';
        var realityEnd = moment(filterInput[2]).add(1,'d').format('YYYY/MM/DD') + ' 00:00:00';
        //var ckArr = [];
        //for(var i=0;i<_ckArr.length;i++){
        //    ckArr.push(_ckArr[i].storageNum);
        //}
        var prm = {
            'st':realityStart,
            'et':realityEnd,
            'orderNum':filterInput[0],
            'inType':$('.tiaojian').val(),
            //'storageNums':ckArr,
            'storageNum':$('#conditionStroage').val(),
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,

        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetInStorage',
            data:prm,
            success:function(result){
                //状态为待确认的数组
                var confirm = [];
                var confirmed = [];
                _allData = [];
                for(var i=0;i<result.length;i++){
                    _allData.push(result[i]);
                }
                for(var i=0;i<result.length;i++){
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

    //根据数组，生成物品下拉框(用flag来区分输入值是否和列表值完全相同，true相同 false不同)；
    function arrList(str,arr,flag){

        for(var i=0;i<arr.length;i++){
            if(flag){

                str += '<li class="li-color" data-durable="' + arr[i].isSpare +
                    '"' + 'data-unit="' + arr[i].unitName +
                    '"data-quality="' + arr[i].batchNum +
                    '"data-maintainDate="' +  arr[i].maintainDate +
                    '"' + 'data-sn="' + arr[i].sn +
                    '"' +
                    'data-shengyu="' + arr[i].num +
                    '"' +
                    '>' + '<span class="dataNum">' + arr[i].itemNum +'</span>' +
                    '<span class="dataName" style="margin-left: 20px;">' +  arr[i].itemName +'</span>' +
                    '<span class="dataSize" style="margin-left: 20px;">' +
                    arr[i].size+'</span>' +
                    '</li>'

            }else{

                str += '<li data-durable="' + arr[i].isSpare +
                    '"' + 'data-unit="' + arr[i].unitName +
                    '"data-quality="' + arr[i].batchNum +
                    '"data-maintainDate="' +  arr[i].maintainDate +
                    '"' + 'data-sn="' + arr[i].sn +
                    '"' +
                    'data-shengyu="' + arr[i].num +
                    '"' +
                    '>' + '<span class="dataNum">' + arr[i].itemNum +'</span>' +
                    '<span class="dataName" style="margin-left: 20px;">' +  arr[i].itemName +'</span>' +
                    '<span class="dataSize" style="margin-left: 20px;">' +
                    arr[i].size+'</span>' +
                    '</li>'
            }

        }

        $('.accord-with-list').eq(0).empty().append(str);

        $('.accord-with-list').eq(1).empty().append(str);
    }

    //添加入库产品的时候，给表格赋值,true的时候，是添加，false的时候，是保存
    function rukuTable(flag){

        //验证数量正则
        var o = $('.format-error')[0].style.display;
        //入库单价格式
        var s = $('.format-error1')[0].style.display;
        //不耐用时，物品id要与物品编码一致
        var a = $('.isEqual')[0].style.display;
        //序列号是否唯一
        var b = $('.isEnabled')[0].style.display;

        if( o!='none' || s!='none' || a!='none' || b!='none' ){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'输入有误！', '');

        }else{

            //判断数量是否输入大于0
            if( putInGoods.num != '' && putInGoods.num > 0 && putInGoods.inprice > 0 ){

                //判断当前数据是否已添加过（库位和编号相同的时候，说明添加过）
                var existFlag = false;

                if(flag){

                    //分为两种情况，批量添加序列号的时候，单独添加序列号的时候

                    _batchArr.length = 0;

                    var temp = putInGoods.goodsId.split(',');

                    for(var i = 0;i<temp.length;i++){

                        _batchArr.push(temp[i]);


                    }

                    if(_batchArr.length == 1){

                        for(var i=0;i<_tempRukuArr.length;i++){

                            if(putInGoods.bianhao == _tempRukuArr[i].itemNum && $('.kuwei').attr('data-num') == _tempRukuArr[i].localNum && putInGoods.goodsId == _tempRukuArr[i].sn ){

                                existFlag = true;

                                break

                            }

                        }

                    }else{

                        for(var i=0;i<_tempRukuArr.length;i++){

                            if( putInGoods.bianhao == _tempRukuArr[i].itemNum && $('.kuwei').attr('data-num') == _tempRukuArr[i].localNum && putInGoods.picked == _tempRukuArr[i].isSpare ){

                                for(var j=0;j<_batchArr.length;j++){

                                    if(_batchArr[j] == _tempRukuArr[i].sn){

                                        existFlag = true;

                                        break

                                    }

                                }

                            }

                        }
                    }



                }

                //添加过的话，提示已添加过，否则添加
                if(existFlag){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'已添加过！', '');

                }else{

                    //给——batch重新赋值，是因为避免选择了物品序列号之后，又点击批量增加。
                    _batchArr.length = 0;

                    var temp = putInGoods.goodsId.split(',');

                    for(var i = 0;i<temp.length;i++){

                        _batchArr.push(temp[i]);


                    }

                    if(_batchArr.length == 1){

                        //获取入库单信息创建对象，存入_tempRukuArr数组
                        var rukuDan = {};

                        //库区、物品编号、物品名称、规格型号、是否耐用、物品序列号、单位、品质、质保期、数量、入库单价、总金额、备注
                        //var price = putInGoods.inprice;

                        var price = $('.inprice').attr('data-num');

                        if(Number(price) == 0){

                            price = 0.00

                        }else{

                            price = formatNumber(Number(price),3);

                        }

                        var showPrice = putInGoods.inprice;

                        if(Number(showPrice) == 0){

                            showPrice = 0.00

                        }else{

                            showPrice = formatNumber(Number(price),2);

                        }

                        rukuDan.localNum = $('.kuwei').attr('data-num');
                        rukuDan.localName = putInGoods.kuwei;
                        rukuDan.itemNum = putInGoods.bianhao;
                        rukuDan.itemName = putInGoods.mingcheng;
                        rukuDan.size = putInGoods.size;
                        rukuDan.isSpare = putInGoods.picked;
                        rukuDan.sn = putInGoods.goodsId;
                        rukuDan.unitName = putInGoods.unit;
                        rukuDan.batchNum = putInGoods.quality;
                        rukuDan.maintainDate = putInGoods.warranty;
                        //实际单价
                        rukuDan.inPrice = price;
                        //显示单价
                        rukuDan.showPrice = showPrice;

                        //判断是否为耐用品，如果是耐用品，强制为1
                        if(rukuDan.isSpare == 1){

                            rukuDan.num = 1;

                            rukuDan.amount = price;

                        }else if(rukuDan.isSpare == 0){

                            rukuDan.num = putInGoods.num;

                            rukuDan.amount = putInGoods.amount;

                        }

                        rukuDan.inMemo = putInGoods.remark;


                        //判断仓库、如果没有选择的话直接填''
                        var ckName = '';

                        if($('#ckselect').val() == ''){
                            ckName = ''
                        }else{
                            ckName = $('#ckselect').children('option:selected').html();
                        }

                        rukuDan.storageName = ckName;

                        rukuDan.storageNum = $('#ckselect').val();

                        if(flag){

                            _tempRukuArr.unshift(rukuDan);

                        }else{

                            return false;

                        }

                    }else{

                        for(var i=0;i<_batchArr.length;i++){

                            //获取入库单信息创建对象，存入_tempRukuArr数组
                            var rukuDan = {};
                            //库区、物品编号、物品名称、规格型号、是否耐用、物品序列号、单位、品质、质保期、数量、入库单价、总金额、备注
                            var price = $('.inprice').attr('data-num');

                            if(Number(price) == 0){

                                price = 0.00

                            }else{

                                price = formatNumber(Number(price),3);

                            }

                            var showPrice = putInGoods.inprice;

                            if(Number(showPrice) == 0){

                                showPrice = 0.00

                            }else{

                                showPrice = formatNumber(Number(price),2);

                            };

                            rukuDan.localNum = $('.kuwei').attr('data-num');

                            rukuDan.localName = putInGoods.kuwei;

                            rukuDan.itemNum = putInGoods.bianhao;

                            rukuDan.itemName = putInGoods.mingcheng;

                            rukuDan.size = putInGoods.size;

                            rukuDan.isSpare = putInGoods.picked;

                            rukuDan.sn = _batchArr[i];

                            rukuDan.unitName = putInGoods.unit;

                            rukuDan.batchNum = putInGoods.quality;

                            rukuDan.maintainDate = putInGoods.warranty;

                            //实际单价
                            rukuDan.inPrice = price;
                            //显示单价
                            rukuDan.showPrice = showPrice;

                            //判断是否为耐用品，如果是耐用品，强制为1
                            if(rukuDan.isSpare == 1){

                                rukuDan.num = 1;

                                rukuDan.amount = price;

                            }else if(rukuDan.isSpare == 0){

                                rukuDan.num = putInGoods.num;

                                rukuDan.amount = putInGoods.amount;

                            }

                            rukuDan.inMemo = putInGoods.remark;

                            //判断仓库、如果没有选择的话直接填''
                            var ckName = '';

                            if($('#ckselect').val() == ''){
                                ckName = ''
                            }else{
                                ckName = $('#ckselect').children('option:selected').html();
                            }

                            rukuDan.storageName = ckName;

                            rukuDan.storageNum = $('#ckselect').val();

                            if(flag){

                                _tempRukuArr.unshift(rukuDan);

                                //_datasTable($('#wuPinListTable1'),_tempRukuArr);

                            }else{

                                return false;
                            }

                        }

                    }

                    //将库区，编号，名称，是否耐用的分组

                    if(flag){

                        _foldArr.length = 0;

                        foldFun(_foldArr,_tempRukuArr);

                        _datasTable($('#wuPinListTable1'),_foldArr);

                        //共计
                        //数量
                        var num = 0;

                        var amount = 0;

                        for(var i=0;i<_foldArr.length;i++){

                            num += Number(_foldArr[i].num);

                            amount += Number(_foldArr[i].amount);

                        }

                        $('#wuPinListTable1 tfoot').find('.amount1').html(num);

                        $('#wuPinListTable1 tfoot').find('.count1').html(amount.toFixed(2));

                    }

                //聚焦到第一个
                $('#workDone').find('.inputType').eq(0).focus();

                }

            }else{

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'输入有误！', '');

            }

        }
    }

    //折叠方法
    function foldFun(arr,arr1){

        arr.length = 0;
        if(arr1.length==0){return;}
        var newItem = {};       //复制第一个元素
        for(var item in arr1[0]){
            newItem[item] = arr1[0][item];
        }
        arr.push(newItem);
        for(var i=1;i<arr1.length;i++){

                for(var j=0;j<arr.length;j++){
                    if(arr[j].localNum == arr1[i].localNum && arr[j].itemNum == arr1[i].itemNum && arr[j].isSpare == arr1[i].isSpare && arr[j].itemName == arr1[i].itemName){
                        break;
                    }else if(j == arr.length - 1){
                        var newItem = {};       //复制元素
                        for(var item in arr1[i]){
                            newItem[item] = arr1[i][item];
                        }
                        arr.push(newItem);
                    }
                }
        }

        for(var i=0;i<arr.length;i++){

            var num = 0;

            var amount = 0;

            for(var j=0;j<arr1.length;j++){

                if( arr[i].localNum == arr1[j].localNum && arr[i].itemNum == arr1[j].itemNum && arr[i].isSpare == arr1[j].isSpare && arr[i].itemName == arr1[j].itemName ){

                    num += Number(arr1[j].num);

                    if(arr1[j].isSpare == 1){

                        amount += Number(arr1[j].inPrice);

                    }else{

                        amount += Number(arr1[j].amount);

                    }



                }

            }

            arr[i].num = num;

            arr[i].amount = amount;

        }

    }

    //表格入库产品删除按钮
    function removeRK($this,arr){

        var wpNum = $this.parents('tr').children('.bianma').html();

        var kwNum = $this.parents('tr').children('.localName').children('span').attr('data-num');

        var snNum = $this.parents('tr').children('.sn').html();

        _tempRKObj.length = 0;

        //库位编码、物品编码、物品序列号一致才能删除
        for(var i=0;i<arr.length;i++){

            if( arr[i].itemNum == wpNum && arr[i].localNum == kwNum && arr[i].sn == snNum ){

                _tempRKObj.push(arr[i]);

                _moTaiKuang($('#myModal2'), '提示', '', 'istap' ,'确定要删除吗？', '删除');

            }
        }
    }


    //表格入库产品删除确定按钮
    function sureRemoveRK(tableId,arr,obj){

        //_rukuArr.removeByValue(_$thisRemoveRowXiao,'itemNum');

        arr.remove(obj);

        var spareArr = [];

        foldFun(spareArr,arr);

        _datasTable(tableId,spareArr);

        //共计
        //数量
        var num = 0;

        var amount = 0;

        for(var i=0;i<spareArr.length;i++){

            num += Number(spareArr[i].num);

            amount += Number(spareArr[i].amount);

        }

        if( tableId.attr('id') == 'personTable1' ){

            tableId.find('tfoot').find('.amount').html(num);

            tableId.find('tfoot').find('.count').html(amount.toFixed(2));

        }else{

            tableId.find('tfoot').find('.amount1').html(num);

            tableId.find('tfoot').find('.count1').html(amount.toFixed(2));

        }

        $('#myModal2').modal('hide');

    }


    //入库单赋值
    function bindData(num){

        for(var i=0;i<_allData.length;i++){
            //绑定数据
            if(_allData[i].orderNum == num){

                //入库单号
                putInList.bianhao = _allData[i].orderNum;
                //入库单类型
                putInList.rkleixing = _allData[i].inType;
                //供货方名称
                putInList.suppliermc = _allData[i].supNum;
                //供货方联系人
                putInList.suppliercontent = _allData[i].contactName;
                //供货方联系电话
                putInList.supplierphone = _allData[i].phone;
                //仓库
                putInList.ckselect = _allData[i].storageNum;
                //制单人
                putInList.zhidanren = _allData[i].createUserName;

                var zhidanTime = '';

                if(_allData[i].createTime){

                    zhidanTime = _allData[i].createTime.split(' ')[0]

                }

                //制单时间
                putInList.shijian = zhidanTime;
                //备注
                putInList.remarks = _allData[i].remark;
                //审核备注
                putInList.shremarks = _allData[i].auditMemo;

                var shenheTime = '';

                if(_allData[i].auditTime){

                    shenheTime = _allData[i].auditTime.split(' ')[0];

                }

                //审核时间
                putInList.shenheTime = shenheTime;
                //单据号
                putInList.documentNumber = _allData[i].orderNum2;

                //供货商
                $('.add-input-select').children('span').attr('values',_allData[i].supNum);

                $('.add-input-select').children('span').attr('data-content',_allData[i].contactName);

                $('.add-input-select').children('span').attr('data-phone',_allData[i].phone);

                $('.add-input-select').children('span').html(_allData[i].supName);

                //判断创建入库单的人是否是本人
                if( _allData[i].createUser == _userIdNum ){

                    _examineRen = false;

                }else{

                    _examineRen = true;

                }
            }
        }

    }

    //入库产品详情
    function detailInfo(num,seccessFun){

        var prm = {
            'orderNum':num,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        };
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetInStorageDetail',
            data:prm,
            timeout:_theTimes,
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

    //入库单登记、编辑(true,编辑,false,登记)
    function djOrBj(url,flag,successMeg,errorMeg,directAdd){

        //验证非空
        if( putInList.rkleixing == '' ){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项', '');

        }else{

            //入库产品数组
            var inStoreDetails = [];

            for(var i=0;i<_rukuArr.length;i++){

                var obj = {};
                //序列号
                obj.sn = _rukuArr[i].sn;
                //是否耐用
                obj.isSpare = _rukuArr[i].isSpare;
                //入库产品编号
                obj.itemNum = _rukuArr[i].itemNum;
                //入库产品名称
                obj.itemName = _rukuArr[i].itemName;
                //品质
                obj.batchNum = _rukuArr[i].batchNum;
                //数量
                obj.num = _rukuArr[i].num;
                //入库价格
                obj.inPrice = _rukuArr[i].inPrice;
                //总金额
                obj.amount = _rukuArr[i].amount;
                //仓库编号
                obj.storageNum = _rukuArr[i].storageNum;
                //仓库名称
                obj.storageName = _rukuArr[i].storageName;
                //规格型号
                obj.size = _rukuArr[i].size;
                //单位
                obj.unitName = _rukuArr[i].unitName;
                //备注
                obj.inMemo = _rukuArr[i].inMemo;
                //质保期
                obj.maintainDate = _rukuArr[i].maintainDate;
                //库区编号
                obj.localNum = _rukuArr[i].localNum;
                //库区名称
                obj.localName = _rukuArr[i].localName;
                //用户id
                obj.userID=_userIdNum;
                //用户名
                obj.userName = _userIdName;

                inStoreDetails.push(obj);

            }

            //仓库选择
            var ckName = '';
            if($('#ckselect').val() == ''){

                ckName = ''

            }else{

                ckName = $('#ckselect').children('option:selected').html();

            }

            var name = '';

            if( typeof $('.add-input-select').children('span').attr('values') == 'undefined' ){

                name = '';

            }else{

                name = $('.add-input-select').children('span').html();

            }

            var prm = {

                //入库类型
                inType:putInList.rkleixing,
                //供应方编号
                supNum:$('.add-input-select').children('span').attr('values'),
                //供应方名称
                supName:name,
                //供应方联系人
                contactName:putInList.suppliercontent,
                //供应方联系电话
                phone:putInList.supplierphone,
                //仓库名称
                storageName:ckName,
                //仓库编码
                storageNum:putInList.ckselect,
                //制单时间
                createTime:putInList.shijian,
                //入库物品
                inStoreDetails:inStoreDetails,
                //备注
                remark:putInList.remarks,
                //用户id
                userID:_userIdNum,
                //用户名称
                userName:_userIdName,
                //角色
                b_UserRole:_userRole,
                //单据号
                orderNum2:putInList.documentNumber

            };

            if(flag){

                prm.orderNum = _ruCode;

            };

            $.ajax({

                type:'post',
                url:_urls + url,
                timeout:_theTimes,
                data:prm,
                beforeSend: function () {
                    $('#theLoading').modal('show');
                },
                complete: function () {
                    $('#theLoading').modal('hide');
                },
                success:function(result){

                    if( result == 99 ){

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,successMeg, '');

                        if(directAdd){

                            $('#myModal').modal('hide');

                            $('#myModal1').modal('hide');

                        }else{

                            $('#myModal').modal('hide');
                        }

                        conditionSelect();

                    }else{

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,errorMeg, '');

                    }

                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(jqXHR.responseText);
                }
            })

        }

    }

    //入库单审核、删除(true,审核,false,删除)
    function ShOrSc(url,flag,successMeg,errorMeg){
        var prm ={
            orderNum:_ruCode,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }

        if( flag ){

            prm.auditMemo = putInList.shremarks;

            prm.auditTime = putInList.shenheTime;

        }

        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            beforeSend: function () {
                $('#theLoading').modal('show');
            },
            complete: function () {
                $('#theLoading').modal('hide');
            },
            success:function(result){

                if(result==99){

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,successMeg, '');

                    $('#myModal').modal('hide');

                    conditionSelect();

                }else{

                    _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,errorMeg, '');
                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })
    }

    //入库单不可编辑
    function rudNotEdit(){

        //所有input框不可操作，并且置灰
        $('#myApp33').find('input').attr('readonly','readonly').addClass('disabled-block');

        $('#myApp33').find('input').parents('.input-blockeds').addClass('disabled-block');

        //所有select框不可操作，并且置灰
        $('#myApp33').find('select').attr('diasbled',true).addClass('disabled-block');

        $('#myApp33').find('select').parents('.input-blockeds').addClass('disabled-block');

        //所有textarea框不可操作，并且置灰
        $('#myApp33').find('textarea').attr('readonly','readonly').addClass('disabled-block');

        $('.add-input-select').attr('diasbled',true).addClass('disabled-block');

        $('.add-input-select').parent().attr('diasbled',true).addClass('disabled-block');

    }

    //入库单可编辑
    function rudEdit(){

        //所有input框不可操作，并且置灰
        $('#myApp33').find('input').removeAttr('readonly').removeClass('disabled-block');

        $('#myApp33').find('input').parents('.input-blockeds').removeClass('disabled-block');

        //所有select框不可操作，并且置灰
        $('#myApp33').find('select').removeAttr('diasbled').removeClass('disabled-block');

        $('#myApp33').find('select').parents('.input-blockeds').removeClass('disabled-block');

        //所有textarea框不可操作，并且置灰
        $('#myApp33').find('textarea').removeAttr('readonly').removeClass('disabled-block');

        $('.add-input-select').attr('diasbled',false).removeClass('disabled-block');

        $('.add-input-select').parent().attr('diasbled',false).removeClass('disabled-block');

    }

    //批量增加
    function batchFun(){

        //将表格化中存在的耐用品并且库区，编码，名称都一致的情况下，放入数组中；如果序列号相同，则不能添加。

        //标识表格中的耐用品是否有这个序列号，是true，否false;
        var isExist = false;

        var addContent = $.trim($('#batchSn-modal').find('.input-blocked').children().val());

        //首先判断需要添加的input的值是否为空，不为空的话，比较库区，编码，名称， 实现序列号唯一
        if(addContent != ''){

            //判断表格中是否有耐用品；
            if(_tempRukuArr.length == 0){

                if(_batchArr.indexOf(addContent)<0){

                    $('#batchSn-modal').find('.colorTip').hide();

                    _batchArr.push(addContent);

                }else{

                    $('#batchSn-modal').find('.colorTip').show();

                }

            }else{

                for(var i=0;i<_tempRukuArr.length;i++){

                    //首先判断是不是耐用品
                    if(_tempRukuArr[i].isSpare == 1){

                        //判断库区，物品编码，物品名称是否一致
                        if(_tempRukuArr[i].localNum == $('#workDone').find('.kuwei').attr('data-num') && _tempRukuArr[i].itemNum == putInGoods.bianhao && _tempRukuArr[i].itemName == putInGoods.mingcheng){

                            if(_tempRukuArr[i].sn == addContent){

                                isExist = true;

                            }

                        }

                    }

                    if(isExist){

                        $('#batchSn-modal').find('.colorTip').show();


                    }else{

                        $('#batchSn-modal').find('.colorTip').hide();

                        //相同情况下，要添加的input值是否和数组中的重复
                        if(_batchArr.indexOf(addContent)<0){

                            _batchArr.push(addContent);

                        }

                    }

                }
            }


            var str = '';

            for(var i=0;i<_batchArr.length;i++){

                str += '<li style="line-height: 30px;"><span class="subSn">' + _batchArr[i] + '</span><span class="subBatch"></span></li>'

            }

            $('#batchSn-modal').find('ul').empty().append(str);

            //当前输入
            var lengths = $('#batchSn-modal').find('ul').children().length;

            $('.title-num').children('div').eq(0).children('span').html(lengths);

            var temp = [];

            var totalLength = 0;

            if( $.trim($('.selected-sn').text()) != '' ){

                temp = $.trim($('.selected-sn').text()).split('、');

                totalLength = Number(temp.length) + Number(lengths) -1;

            }else{

                temp = [];

                totalLength = Number(temp.length) + Number(lengths);

            }

            $('.title-num').children('div').eq(1).children('span').html(totalLength);

        }

    }

    //按钮初始化-----------------------------------------------------------------------------------------------

    //新增按钮初始化
    function newButtonInit(){
        putInList.bianhao = '';

        putInList.rkleixing = '';

        putInList.suppliermc = '';

        putInList.suppliercontent = '';

        putInList.supplierphone = '';

        putInList.ckselect = '';

        putInList.zhidanren = '';

        putInList.shijian = _initEnd;

        putInList.remarks = '';

        putInList.shremarks = '';

        putInList.documentNumber = '';

        putInList.shenheTime = '';

        //表格数据初始化
        _rukuArr = [];

        _datasTable($('#personTable1'),_rukuArr);

        $('#personTable1 tfoot').find('.amount').html('0');

        $('#personTable1 tfoot').find('.count').html('0.00');

        //提示消息不显示
        $('#myModal').find('.modal-footer').children('.colorTip').hide();

        //选择供货方隐藏
        $('.add-select-block').hide();

    }

    //新增物品初始化flag的时候，初始化库区；
    function newGoodsInit(flag){

        if(flag){

            putInGoods.kuwei = '';

        }

        putInGoods.bianhao = '';

        putInGoods.mingcheng = '';

        putInGoods.size = '';

        putInGoods.picked = 0;

        putInGoods.goodsId = '';

        putInGoods.unit = '';

        putInGoods.quality = '';

        putInGoods.warranty = '';

        putInGoods.num = '';

        putInGoods.inprice = '';

        putInGoods.amount = '';

        putInGoods.remark = '';

        $('.inpus').parent('span').removeClass('checked');

        if( putInGoods.picked == 0 ){

            $('.inpus').eq(1).parent('span').addClass('checked');

        }else if( putInGoods.picked == 1 ){

            $('.inpus').eq(0).parent('span').addClass('checked');

        }

        //所有输入框清空，并且除了品质下拉框，所有的属性清空

        $('#workDone').find('.inputType').removeAttr('readonly').removeClass('disabled-block');

        $('#workDone').find('.inputType').parents('.input-blockeds').removeClass('disabled-block');

        //库位选中下拉框的清空
        $('.kuqu-list').children().removeClass('li-color');

        if(flag){

            //库位清空属性
            $('.kuwei').removeAttr('data-num');

        }

        //聚焦
        $('#workDone').find('.inputType').eq(0).focus();

        //清楚单价
        $('.inprice').attr('data-num',0);

    }

    //入库产品详情初始化
    function seeDetail(){

        //物品编号
        rukuObject.bianhao =  '';
        //物品名称
        rukuObject.mingcheng =  '';
        //规格型号
        rukuObject.size = '';
        //是否耐用
        rukuObject.durable = 0;
        //序列号
        rukuObject.goodsId = '';
        //单位
        rukuObject.unit = '';
        //品质
        rukuObject.quality = '';
        //质保期
        rukuObject.warranty = '';
        //数量
        rukuObject.num = 0;
        //入库单价
        rukuObject.inPrice = 0.00;
        //金额
        rukuObject.amount = 0.00;
        //备注
        rukuObject.remark = '';

    }

    //出库单模态框初始化
    function chuInit(){

        $('.chukuHao').val('');

        //开始时间
        $('.chukumin').val(_chuStartTime);

        //结束时间
        $('.chukumax').val(_chuTime);

    }

    //选择物品模态框初始化
    function selectWPInit(){

        //物品编码
        $('#myModal4').find('.filterInput1').val('');

        //物品名称
        $('#myModal4').find('.filterInput2').val('');

        //分类名称
        $('#myModal4').find('#filterInput3').val('');

        //表格数据
        _datasTable($('#wuPinListTable'),_wpListArr);

    }

    //键盘方法--------------------------------------------------------------------------------------------------

    //键盘事件方法
    function upDown(e,ul,enterFun,inputFun){

        var e = e||window.event;

        if(e.target.parentElement.className.indexOf('disabled-block')>=0){

            return false;

        }else{

            var chils = ul.children();

            var lengths = 0;

            lengths = chils.length;

            //ul.show();

            if(e.keyCode == 40){

                //console.log('向下');

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

                //console.log('向上');

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

                //console.log('回车');

                enterFun();

            }else if(e != 9){

                _numIndex = -1;

                inputFun();

            }

        }

    }

    //库区回车事件
   var enterFQName =  function(){

       //input框赋值
        putInGoods.kuwei = $('.kuqu-list').children('.li-color').html();

       //通过data-num来绑定库位编码

        $('.kuwei').attr('data-num',$('.kuqu-list').children('.li-color').attr('data-num'));

       //选择框消失
        $('.kuqu-list').hide();

    }

    //库区输入事件
    var inputFQName = function(){

        var searchValue = putInGoods.kuwei;

        var str = '';

        var arr = [];

        for(var i=0;i<_kuquArr.length;i++){
            //完全相同的情况下
            if( searchValue == _kuquArr[i].localName || searchValue == _kuquArr[i].localNum ){


                str += '<li class="li-color" data-num="' + _kuquArr[i].localNum + '">' + _kuquArr[i].localName + '</li>'

            }else{

                if(_kuquArr[i].localName.indexOf(searchValue)>=0 || _kuquArr[i].localNum.indexOf(searchValue)>=0){

                    arr.push(_kuquArr[i]);

                    str += '<li data-num="' + _kuquArr[i].localNum + '">' + _kuquArr[i].localName + '</li>'
                }
            }
        }

        $('.kuqu-list').empty().append(str);

        if(arr.length){

            $('.kuqu-list').show();

        }

    }

    //编码输入事件
    var inputBMName = function(){

        var searchValue = putInGoods.bianhao;

        var str = '';

        var arr = [];

        var isWho = false;

        for(var i=0;i<_wpListArr.length;i++){

            if( searchValue ==  _wpListArr[i].itemNum ){

                arr.push(_wpListArr[i]);

                isWho = true;


            }else{

                if( _wpListArr[i].itemNum.indexOf(searchValue)>=0 ){

                    arr.push(_wpListArr[i]);

                }
            }
        }


        if(isWho){

            arrList(str,arr,true);

        }else{

            arrList(str,arr,false);

        }

        if(arr.length>0){

            $('.accord-with-list').eq(0).show();

        }

    }

    //编码回车事件(选中编码后，将名称、规格型号、是否耐用、单位、序列号自动填写);
    var enterBMName = function(){

        newGoodsInit(false);

        //input框赋值
        //物品编码
        putInGoods.bianhao = $('.accord-with-list').eq(0).children('.li-color').children('.dataNum').html();

        //物品名称
        putInGoods.mingcheng = $('.accord-with-list').eq(0).children('.li-color').children('.dataName').html();

        //规格型号
        putInGoods.size = $('.accord-with-list').eq(0).children('.li-color').children('.dataSize').html();

        //是否耐用
        var isDurable = $('.accord-with-list').eq(0).children('.li-color').attr('data-durable');

        //单位
        putInGoods.unit = $('.accord-with-list').eq(0).children('.li-color').attr('data-unit');

        putInGoods.picked = isDurable;

        //是否耐用单选框初始化
        $('.inpus').parents('span').removeClass('checked');


        //是否为耐用品，耐用品的=1，消耗品=0，耐用品的情况下，数量只能为1（并且不能编辑），物品序列号需要自填，消耗品的情况下序列号等于物品编号
        if( isDurable == 0 ){

            $('#twos').parents('span').addClass('checked');

            //序列号等于物品编号（并且不可操作）
            putInGoods.goodsId = putInGoods.bianhao;

            $('.goodsId').attr('readonly','readonly').addClass('disabled-block');

            $('.goodsId').parent().addClass('disabled-block');

            //数量
            $('.rknum').removeAttr('readonly').removeClass('disabled-block');

            $('.rknum').parent().removeClass('disabled-block');

            //数量置为空
            putInGoods.num = '';

        }else if( isDurable == 1 ){

            $('#ones').parents('span').addClass('checked');

            //序列号需要填写、数量必须为1且不可编辑

            putInGoods.num = '1';

            $('.rknum').attr('readonly','readonly').addClass('disabled-block');

            $('.rknum').parent().addClass('disabled-block');

            //序列号可填
            $('.goodsId').removeAttr('readonly','readonly').removeClass('disabled-block');

            $('.goodsId').parent().removeClass('disabled-block');


        }

        //物品编号、物品名称、规格型号、是否耐用、单位置为不可操作（置灰）

        $('.auto-input').attr('readonly','readonly').addClass('disabled-block');

        $('.auto-input').parents('.input-blockeds').addClass('disabled-block');

        $('.accord-with-list').hide();

        //确定聚焦位置
        setTimeout(function(){

            if( putInGoods.mingcheng == '' ){

                $('.inputType').eq(3).focus();

            }else{

                $('.hidden1').hide();

                if(putInGoods.goodsId != ''){

                    $('.inputType').eq(8).focus();

                }else{

                    $('.inputType').eq(6).focus();

                }

            }

        },300);

        //初始化



    }

    //名称输入事件
    var inputMCName = function(){

        var searchValue = putInGoods.mingcheng;

        var str = '';

        var arr = [];

        var isWho = false;

        for(var i=0;i<_wpListArr.length;i++){

            if( searchValue ==  _wpListArr[i].itemName ){

                arr.push(_wpListArr[i]);


            }else{

                if( _wpListArr[i].itemName.indexOf(searchValue)>=0 ){

                    arr.push(_wpListArr[i]);

                }
            }
        }

        if(arr.length == 1){

            isWho = true;

        }else{

            isWho = false;

        }

        if(isWho){

            arrList(str,arr,true);

        }else{

            arrList(str,arr,false);

        }

        if(arr.length>0){

            $('.accord-with-list').eq(1).show();

        }

    }

    //名称回车事件
    var enterMCName = function(){

        newGoodsInit(false);

        //input框赋值
        //物品编码
        putInGoods.bianhao = $('.accord-with-list').eq(1).children('.li-color').children('.dataNum').html();

        //物品名称
        putInGoods.mingcheng = $('.accord-with-list').eq(1).children('.li-color').children('.dataName').html();

        //规格型号
        putInGoods.size = $('.accord-with-list').eq(1).children('.li-color').children('.dataSize').html();

        //是否耐用
        var isDurable = $('.accord-with-list').eq(1).children('.li-color').attr('data-durable');

        //单位
        putInGoods.unit = $('.accord-with-list').eq(1).children('.li-color').attr('data-unit');

        putInGoods.picked = isDurable;

        //是否耐用单选框初始化
        $('.inpus').parents('span').removeClass('checked');


        //是否为耐用品，耐用品的=1，消耗品=0，耐用品的情况下，数量只能为1（并且不能编辑），物品序列号需要自填，消耗品的情况下序列号等于物品编号
        if( isDurable == 0 ){

            $('#twos').parents('span').addClass('checked');

            //序列号等于物品编号（并且不可操作）
            putInGoods.goodsId = putInGoods.bianhao;

            $('.goodsId').attr('readonly','readonly').addClass('disabled-block');

            $('.goodsId').parent().addClass('disabled-block');

            //数量
            $('.rknum').removeAttr('readonly').removeClass('disabled-block');

            $('.rknum').parent().removeClass('disabled-block');

            //数量置为空
            putInGoods.num = '';

        }else if( isDurable == 1 ){

            $('#ones').parents('span').addClass('checked');

            //序列号需要填写、数量必须为1且不可编辑

            putInGoods.num = '1';

            $('.rknum').attr('readonly','readonly').addClass('disabled-block');

            $('.rknum').parent().addClass('disabled-block');

            //序列号可填
            $('.goodsId').removeAttr('readonly','readonly').removeClass('disabled-block');

            $('.goodsId').parent().removeClass('disabled-block');


        }

        //物品编号、物品名称、规格型号、是否耐用、单位置为不可操作（置灰）

        $('.auto-input').attr('readonly','readonly').addClass('disabled-block');

        $('.auto-input').parents('.input-blockeds').addClass('disabled-block');

        $('.accord-with-list').hide();

        //确定聚焦位置
        setTimeout(function(){

            if( putInGoods.mingcheng == '' ){

                $('.inputType').eq(3).focus();

            }else{

                if(putInGoods.goodsId != ''){

                    $('.inputType').eq(8).focus();

                }else{

                    $('.inputType').eq(6).focus();

                }

            }
        },300);


    }

    //品质输入事件
    var inputQualityName = function(){

        var searchValue = putInGoods.quality;

        var str = '';

        var arr = [];

        var isWho = false;

        for(var i=0;i<_qualityArr.length;i++){

            if( searchValue ==  _qualityArr[i].title ){

                arr.push(_qualityArr[i]);


            }else{

                if( _qualityArr[i].title.indexOf(searchValue)>=0 ){

                    arr.push(_qualityArr[i]);

                }
            }
        }

        if(arr.length == 1){

            isWho = true;

        }else{

            isWho = false;

        }

        if(isWho){

            for(var i=0;i<arr.length;i++){

                str += '<li class="li-color" data-value="' + arr[i].data + '">' + arr[i].title +'</li>'

            }

        }else{

            for(var i=0;i<arr.length;i++){

                str += '<li data-value="' + arr[i].data + '">' + arr[i].title +'</li>'

            }

        }

        $('.pinzhixx').eq(0).empty().append(str);

        if(arr.length>0){

            $('.pinzhixx').eq(0).show();

        }

    }

    //品质回车事件
    var enterQualityName = function(){

        putInGoods.quality = $('.pinzhixx').children('.li-color').html();

        $('.quality').attr('data-pznum',$('.pinzhixx').children('.li-color').attr('data-value'));

        $('.pinzhixx').hide();

    }

    //页面加载时获取数据方法------------------------------------------------------------------------------------

    //获取入库类型(type是区别入库和出库的，入库=1，出库=2)
    function rkLX(type){
        var prm = {
            "catType": type,
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetInOutCate',
            data:prm,
            success:function(result){

                if(type == 1){

                    var str = '<option value="">全部</option>';

                    for(var i=0;i<result.length;i++){

                        str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';

                    }

                    $('.tiaojian').empty().append(str);

                    var str1 = '<option value="">请选择</option>';

                    for(var i=0;i<result.length;i++){

                        str1 += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';

                    }

                    $('#rkleixing').empty().append(str1);

                }else{
                    var str = '<option value="">全部</option>';

                    for(var i=0;i<result.length;i++){

                        str += '<option value="' + result[i].catNum  + '">' + result[i].catName + '</option>';

                    }

                    $('#ckType').empty().append(str);

                    //chukuList();

                }

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //仓库列表
    function warehouse(){
        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
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

                    str += '<option value="' + result[i].storageNum + '">' +  result[i].storageName + '</option>';

                    str1 += '<option value="' + result[i].storageNum + '">' +  result[i].storageName + '</option>';

                }

                $('#ckselect').empty().append(str);

                $('#conditionStroage').empty().append(str1);

                //条件查询
                conditionSelect();

                //获取出库单
                chukuList();

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //供货方列表
    var SupplierArr = [];

    //供货方名称
    function getSupplier(flag){

        $.ajax({
            type:'get',
            url:_urls + 'YWCK/GetAllYWCKSupplier',
            data:{
                supName:''
            },
            beforeSend:function(){
                //刷新按钮旋转
                var i=0;
                _rotate = setInterval(function(){
                    i++;
                    var deg = i;
                    $('.refresh').eq(0).css({
                        'transform':'rotate(' + deg + 'deg)'
                    },1000)
                })
            },
            timeout:_theTimes,
            success:function(result){

                clearInterval(_rotate);
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].supNum +'"' + 'data-Content="' + result[i].linkPerson + '"' + 'data-phone="' + result[i].phone + '">'
                        + result[i].supName + '</option>';
                }
                $('#supplier').empty().append(str);

                SupplierArr.length = 0;

                for( var i=0;i<result.length;i++ ){

                    var obj = result[i];

                    obj.pinyin = codefans_net_CC2PY(result[i].supName);

                    SupplierArr.push(result[i]);

                }

                if(flag){

                    addStationDom($('#supplier').parent(),true);

                }else{

                    addStationDom($('#supplier').parent(),false);

                }


            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取物品id
    function getWPid(){
        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItemSN',
            data:prm,
            success:function(result){
                for(var i=0;i<result.length;i++){

                    //if(result[i] == workDone.goodsId){
                    //    console.log('重复')
                    //    $('.isEnabled').show();
                    //}else{
                    //    console.log('不重复')
                    //    $('.isEnabled').hide();
                    //}
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有库区
    function getKQ(data){
        //获取仓库，获得对应的库区
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:{
                'storageNum':data,
                'hasLocation':1,
                'userID':_userIdNum,
                'userName':_userIdName,
                b_UserRole:_userRole,
            },
            timeout:_theTimes,
            success:function(result){
                var str = '';
                _kuquArr = [];
                for(var i=0;i<result.length;i++){
                    for(var j=0;j<result[i].locations.length;j++){
                        _kuquArr.push(result[i].locations[j]);
                        str += '<li data-num="' + result[i].locations[j].localNum + '">' + result[i].locations[j].localName + '</li>'
                    }
                }
                $('.kuqu-list').empty().append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有物品列表
    function wlList(){
        var prm = {
            'ItemNum':'',
            'itemName':'',
            'cateName':'',
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItems',
            data:prm,
            success:function(result){

                _wpListArr.length = 0;

                for(var i=0;i<result.length;i++){

                    _wpListArr.push(result[i]);

                }

                var str = '';

                //给物品编码和物品名称的列表赋初始值
                arrList(str,result,false);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取出库列表
    function chukuList(){

        var ck = [];

        for(var i=0;i<_ckArr.length;i++){

            ck.push(_ckArr[i].storageNum);

        }

        var prm = {
            "st": $('.chukumin').val(),
            "et": moment($('.chukumax').val()).add(1,'d').format('YYYY/MM/DD'),
            "orderNum": $('.chukuHao').val(),
            "outType": $('#ckType').val(),
            "userID":_userIdNum,
            "userName":_userIdName,
            "b_UserRole":_userRole,
            "storageNums":ck
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetOutStorage',
            data:prm,
            success:function(result){
                var arr = [];
                for(var i=0;i<result.length;i++){
                    if(result[i].status == 1){
                        arr.push(result[i]);
                    }
                }
                _datasTable($('#scrap-datatables3'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取物品编码分类
    function wpClass(){

        var prm = {

            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole

        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItemCate',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">全部</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].cateNum +
                        '">' + result[i].cateName + '</option>'

                }

                $('#myModal4').find('#filterInput3').empty().append(str);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }

        })

    }

    //格式化数字，排除infinity NaN 其他格式
    function formatNumber(num,dig){

        if(num===Infinity){

            return 0.00;

        }

        if(+num===num){

            return num.toFixed(dig);

        }

        return 0.00;
    }

    /*---------------------------------------------------------供货方字母选择形式--------------------------------------*/
    var ABC = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    var ABC1 = ['A','B','C','D','E'];
    var ABC2 = ['F','G','H','I','J'];
    var ABC3 = ['K','L','M','N','O'];
    var ABC4 = ['P','Q','R','S','T'];
    var ABC5 = ['U','V','W','X','Y','Z'];

    //定义要插入的元素
    var stationHtml = '<div class="add-input-father" style="margin-left:10px">' +
        '    <div class="add-input-block" style="margin-left:0">' +
        '        <div type="text" class="add-input add-input-select" style="">' +
        '            <span>请选择</span>' +
        '            <div class="add-input-arrow"></div>' +
        '        </div>' +
        '    </div>' +
        '    <div class="add-select-block" style="">' +
        '        <div class="com_hotresults" id="thetable" style="width:440px">' +
        '            <div class="ac_title">' +
        '                <span>请根据拼音首字母进行选择</span>' +
        '                <a class="ac_close" style="cursor:pointer" title="关闭" onclick=""></a>' +
        '            </div>' +
        '            <ul class="AbcSearch clx" id="abc">' +
        '                <li index="1" method="liHotTab" onclick="" id="nav_list1" class="action">全部</li>' +
        '                <li index="2" method="liHotTab" onclick="" id="nav_list2" class="">ABCDE</li>' +
        '                <li index="3" method="liHotTab" onclick="" id="nav_list3" class="">FGHIJ</li>' +
        '                <li index="4" method="liHotTab" onclick="" id="nav_list4" class="">KLMNO</li>' +
        '                <li index="5" method="liHotTab" onclick="" id="nav_list5" class="">PQRST</li>' +
        '                <li index="6" method="liHotTab" onclick="" id="nav_list6" class="">UVWXYZ</li>' +
        '            </ul>' +
        '            <div id="ul_list2" style="height: 270px; display: block;overflow-y: auto"></div>' +
        '        </div>' +
        '    </div>' +
        '</div>';

    var ABCArr = [ABC,ABC1,ABC2,ABC3,ABC4,ABC5];

    function addStationDom(dom,flag){

        if(flag){

            dom.after(stationHtml);

            dom.hide();

        }
        $('.add-input-block').off();
        //标签页选项卡事件
        $('.add-input-block').on('click',function(){

            if( $(this).attr('diasbled') == 'false'){

                $('.add-select-block').toggle();

            }else{

                return false;

            }

        });

        //默认
        classifyArrByInitial(SupplierArr,0);

        //选中加载本页的数据
        $('.AbcSearch').on('click','li',function(){
            $('.AbcSearch li').removeClass('action');
            $(this).addClass('action');
            var index = $(this).index();
            classifyArrByInitial(SupplierArr,index);
        });

        $('.ac_close').on('click',function(){

            $('.add-select-block').hide();
        });

    }

    //根据首字母对数组分类
    function classifyArrByInitial(arr,num){
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
            var initial = o.pinyin.slice(0,1);

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
                if(b.pinyin > a.pinyin){
                    return -1
                }else{
                    return 1
                }

            });

            showString += '<ul class="popcitylist" style="overflow: auto; max-height: 260px; ">';
            showString += '<li class="ac_letter">'+initial+'</li>';

            $(dataArr).each(function(i,o){
                showString += '<li class="ac_even openLi" values="'+ o.supName+'" title="'+o.supName+'" data="'+ o.supNum+'" data-content="' + o.linkPerson + '" data-phone="' + o.phone + '">' +o.supName+'</li>';
                if(i == dataArr.length -1){
                    showString += '</ul>'
                }
            });

        });

        $('#ul_list2').html(showString);

        $('.ac_even').off('click');
        $('.ac_even').on('click',function(){
            $('.add-input-select span').html($(this).html());
            //供货方编号
            $('.add-input-select span').attr('values',$(this).attr('data'));
            //供货方联系人
            $('.add-input-select span').attr('data-content',$(this).attr('data-content'));

            putInList.suppliercontent = $(this).attr('data-content');

            //供货方联系电话
            $('.add-input-select span').attr('data-phone',$(this).attr('data-phone'));

            phone:putInList.supplierphone = $(this).attr('data-phone');

            $('.add-select-block').hide();

        })
    }


})