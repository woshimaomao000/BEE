$(function(){
    /*---------------------------------------------时间---------------------------------------------------*/

    //时间设置
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间（7天）
    var et = moment().format('YYYY/MM/DD');

    var st =moment().subtract(7,'d').format('YYYY/MM/DD');

    $('.datatimeblock').eq(0).val(st);

    $('.datatimeblock').eq(1).val(et);

    /*--------------------------------------------变量----------------------------------------------------*/
    //仓库列表
    var _ckArr = [];

    //报修vue变量
    var gdObj = new Vue({
        el:'#myApp33',
        data:{
            'gdtype':'1',
            'xttype':'1',
            'bxtel':'',
            'bxkesh':'',
            'bxren':'',
            'pointer':'',
            'gztime':'',
            'sbtype':'',
            'sbnum':'',
            'sbname':'',
            'azplace':'',
            'gzplace':'',
            'wxshx':'',
            'wxbz':'',
            'wxcontent':'',
        },
        methods:{
            time:function(){
                _timeHMSComponentsFun($('.datatimeblock').eq(2),1);
            },
            timeblur:function(){
                setTimeout(function(){
                    $('.datepicker').hide();
                },200)
            },
        }
    });

    //快速创建对象
    var gdObj1 = new Vue({
        el:'#myApp331',
        data:{
            'gdtype':'1',
            'xttype':'',
            'bxtel':'',
            'bxkesh':'',
            'bxren':'',
            'pointer':'',
            'gztime':'',
            'sbtype':'',
            'sbnum':'',
            'sbname':'',
            'azplace':'',
            'gzplace':'',
            'wxshx':'',
            'wxbz':'',
            'wxcontent':'',
        },
        methods:{
            time:function(){
                _timeHMSComponentsFun($('.datatimeblock').eq(2),1);
            },
            timeblur:function(){
                setTimeout(function(){
                    $('.datepicker').hide();
                },200)
            },
        }
    });

    //验证vue非空（空格不算）
    Vue.validator('isEmpty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val = val.replace(/^\s+|\s+$/g, '');
        return /[^.\s]{1,500}$/.test(val)
    });

    //添加材料vue
    var clObj = new Vue({
        el:'#goods',
        data:{
            'mc':'',
            'bm':'',
            'dw':'',
            'sl':'',
            'dj':'',
            'je':'',
            'size':''
        },
        methods:{
            addFun1:function(){
                var mny = /^[0-9]*[1-9][0-9]*$/;
                if(clObj.sl != 0){
                    if(mny.test(clObj.sl)){
                        $('.errorSL').hide();
                        //如果单价有数，自动计算总价
                        if(clObj.dj > 0){
                            var amount = Number(clObj.dj) * Number(clObj.sl);
                            clObj.je = amount.toFixed(2);
                            $('.errorJE').hide();
                        }
                    }else{
                        $('.errorSL').show();
                    }
                }else{
                    $('.errorSL').show();
                }
            },
            addFun2:function(){
                var mny = /^((?:-?0)|(?:-?[1-9]\d*))(?:\.\d{1,2})?$/;
                if(clObj.dj != '' && clObj.dj != 0){
                    if( mny.test(clObj.dj) ){
                        $('.errorDJ').hide();
                        //如果单价有数，自动计算总价
                        if(clObj.sl > 0){
                            var amount = Number(clObj.dj) * Number(clObj.sl);
                            clObj.je = amount.toFixed(2);
                            $('.errorJE').hide();
                        }
                    }else{
                        $('.errorDJ').show();
                    }
                }else{
                    $('.errorDJ').show();
                }
            },
            addFun3:function(){
                var mny = /^((?:-?0)|(?:-?[1-9]\d*))(?:\.\d{1,2})?$/;
                if(clObj.je != '' && clObj.je != 0){
                    if( mny.test(clObj.je) ){
                        $('.errorJE').hide();
                        //根据总金额得出单价
                        var danjia =  Number(clObj.je)/Number(clObj.sl);
                        clObj.dj = danjia.toFixed(2);
                    }else{
                        $('.errorJE').show();
                    }
                }else{
                    $('.errorJE').show();
                }
            }
        }
    })

    //添加工时费用vue
    var feeObj = new Vue({
        el:'#GS',
        data:{
            //项目名称
            'mc':'',
            //项目编码
            'bm':'',
            //项目类别
            'lb':'',
            //费用
            'fee':'',
            //数量
            'sl':'',
            //备注
            'remark':''
        },
        methods:{

            numFun:function(){

                var mny = /^[0-9]*[1-9][0-9]*$/;

                if(mny.test(feeObj.sl)){

                    $('.errorFee').hide();

                }else{

                    $('.errorFee').show();

                }

            }

        }
    })

    //标记当前打开的是不是报修按钮
    var _isDeng = false;

    //执行人数组
    var _fzrArr = [];

    //存放报修科室数组
    var _allBXArr = [];

    //存放系统类型数组
    var _allXTArr = [];

    //选中的备件对象
    var _bjObject = {};

    //存放当前工单号
    var _gdCode = '';

    //记录当前状态值
    var _gdZht = '';

    //记录当前
    var _gdCircle = '';

    //所有部门
    var _departArr = [];

    //存放所有材料数组
    var _allWLArr = [];

    //维修事项（车站）
    bxKShiData();
    //ksAndBm('YWDev/ywDMGetDDsII', _allBXArr, $('#bxkesh'), 'ddName', 'ddNum');

    //系统类型
    ajaxFun('YWDev/ywDMGetDSs', _allXTArr, $('#sbtype'), 'dsName', 'dsNum');

    //获取所有部门
    //getDpartment();

    //暂存选中备件的数组
    var _selectedBJ = [];

    //总费用
    var _totalFree = 0;

    //添加材料是否完成
    var _clIsComplete = false;

    //添加材料是否成功
    var _clIsSuccess = '';

    //执行人是否完成
    var _zxrIsComplete = false;

    //执行人是否执行成功
    var _zxrIsSuccess = '';

    //工时费是否执行完成
    var _gsfIsComplete = false;

    //工时费是否执行成功
    var _gsfIsSuccess = '';

    //申请关闭是否完成
    var _gbIsComplete = false;

    //申请关闭是否成功
    var _gbIsSuccess = false;

    //物品分类
    //classification();

    //仓库
    warehouse();

    //存放员工信息数组
    var _workerArr = [];

    //获得员工信息方法

    workerData1();

    //部门
    getDepartment();

    //负责人数组
    var _fzrArr = [];


    //是不是工长
    var _isFZR = false;

    //获取所有部门
    getDpartment();

    //所有执行人
    var _allWorkers = [];

    //已选中的执行人
    var _exeWorker = [];

    //记录当前选中的执行人是否改变了
    var _primaryWork = [];

    var _isChange = true;

    //项目费用类别获取
    feeClass();

    //所有项目费用列表
    var _feeArr = [];

    //获取所有维修费用列表
    feeConditionSelect(true);

    //第二层模态框的费用数组
    var _secondFeeArr = [];

    //第一层模态框费用数组
    var _firstFeeArr = [];

    /*-------------------------------------------------按钮事件-----------------------------------------*/

    //tab切换
    $('.table-title span').click(function(){

        var $this = $(this);

        $this.parent('.table-title').children('span').removeClass('spanhover');

        $this.addClass('spanhover');

        var tabDiv = $(this).parents('.table-title').next().children('div');

        tabDiv.addClass('hide-block');

        tabDiv.eq($(this).index()).removeClass('hide-block');

    });

    //报修按钮
    $('.creatButton').click(function(){

        _isDeng = true;

        //显示模态框
        _moTaiKuang($('#myModal6'), '快速报修', '', '' ,'', '报修');

        //增加报修类
        $('#myModal6').find('.btn-primary').removeClass('jiedan').addClass('dengji');

        //选择部门不显示
        $('.bumen').hide();

        //维修班组不显示
        $('.autoFile').hide();

        //初始化
        dataInit();

        //维修内容显示
        $('.wxnr').show();

        //所有input框不能操作，select也不能操作
        $('.single-block').children('input').removeAttr('readOnly').removeClass('disabled-block');

        //所有select不能操作
        $('.single-block').children('select').attr('disabled',false).removeClass('disabled-block');

        //故障描述不可操作
        $('.gzDesc').removeAttr('readOnly').removeClass('disabled-block');

        //报修人信息不可操作
        $('.note-edit2').attr('disabled',true).addClass('disabled-block');

        //电话信息可编辑
        $('.bx-choose').removeAttr('disabled').removeClass('disabled-block');

    });

    //点击报修模态框显示的回调函数
    $('#myModal6').on('shown.bs.modal', function () {

        if(_isDeng){

            //绑定报修人信息
            //if(_workerArr.length > 0){
            //    for(var i=0;i<_workerArr.length;i++){
            //        if(_workerArr[i].userNum == _userIdNum){
            //
            //            console.log(_workerArr[i]);
            //
            //            gdObj1.bxtel = _workerArr[i].mobile;
            //
            //            gdObj1.bxkesh = _workerArr[i].departNum;
            //
            //            gdObj1.bxren = _workerArr[i].userName;
            //        }
            //    }
            //}

            //让日历插件首先失去焦点
            $('.datatimeblock').eq(2).focus();

            //发生时间默认
            var aa = moment().format('YYYY-MM-DD HH:mm:ss');

            $('.datatimeblock').eq(2).val(aa);

            if($('.datetimepicker:visible')){

                $('.datetimepicker').hide();

            }

            $('.datatimeblock').eq(2).blur();

            //获取维修人员信息

            var obj = {};

            obj.userNum = _userIdNum;

            obj.userName = _userIdName;

            obj.mobile = '';

            _fzrArr.length = 0;

            _fzrArr.push(obj);

            _datasTable($('#fzr-list1'),_fzrArr);

        }

        _isDeng = false;
    });

    //报修确定按钮
    $('#myModal6').on('click','.dengji',function(){

        //验证必填项
        if(gdObj1.bxtel == ''|| gdObj1.bxkesh == '' || gdObj1.bxren == '' || gdObj1.gzplace == '' || gdObj1.wxshx == '' || gdObj1.wxcontent == ''){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');

        }else{
            //工单维修人
            var arr = [];
            var obj = {};
            obj.wxRen = _fzrArr[0].userNum;
            obj.wxRName = _fzrArr[0].userName;
            obj.wxRDh = _fzrArr[0].mobile;
            arr.push(obj);
            var str = ' ';
            if(gdObj1.sbtype == ''){
                str = ' ';
            }else{
                str = $('#sbtype').children('option:selected').html();
            }

            //报修
            var prm = {
                'gdJJ':gdObj1.gdtype,
                'gdRange':gdObj1.xttype,
                'bxDianhua':gdObj1.bxtel,
                'bxKeshi':$('#bxkesh').children('option:selected').html(),
                'bxKeshiNum':gdObj1.bxkesh,
                'bxRen':gdObj1.bxren,
                //'':gdObj.pointer,
                'gdFsShij':$('.datatimeblock').eq(2).val(),
                'wxShiX':1,
                'wxShiXNum':1,
                'wxXm':gdObj1.wxshx,
                'wxXmNum':$('#metter').attr('data-num'),
                //设备类型
                'DCName':str,
                'DCNum':gdObj1.sbtype,
                'wxShebei':gdObj1.sbnum,
                'dName':gdObj1.sbname,
                'installAddress':gdObj1.azplace,
                'wxDidian':gdObj1.gzplace,
                'bxBeizhu':$('.gzDesc').val(),
                'userID': _userIdNum,
                'userName': _userIdName,
                'b_UserRole':_userRole,
                'gdSrc': 1,
                'gdZht':4,
                'wxKeshiNum':_userBM,
                'wxKeshi':_userBMName,
                'wxBeizhu':gdObj1.wxcontent,
                'gdWxRs':arr,
            }

            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDCreQuickDJ',
                data:prm,
                timeout:_theTimes,
                success:function(result){

                    if(result == 99){

                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'快速报修成功！', '');

                        $('#myModal6').modal('hide');

                        $('#myModal2').off('shown.bs.modal').on('shown.bs.modal',function(){

                            conditionSelect(false,true);

                        })

                    }else{
                        _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'快速报修失败！', '');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText);
                }
            })

        }
    });

    //表格复选框点击事件
    $('#fzr-list').on('click','input',function(){

        if($(this).parent('.checked').length == 0){
            //console.log('没有选中');
            $(this).parent('span').addClass('checked');
            $(this).parents('tr').addClass('tables-hover');
        }else{
            //console.log('选中');
            $(this).parent('span').removeClass('checked');
            $(this).parents('tr').removeClass('tables-hover');
        }
    });

    //查询
    $('#selected').click(function(){
        conditionSelect(true);
    })

    //重置
    $('.resites').click(function(){

        //input清空
        $('.filterInput').val('');

        //时间重置
        $('.datatimeblock').eq(0).val(st);

        $('.datatimeblock').eq(1).val(et);
    })

    //关单
    $('#waiting-list,#dai-waiting-list').on('click','.option-close',function(){

        //各项初始化
        gdInit();

        //确定工单号
        _gdCode = $(this).parents('tr').children('.gdCode').children('span').children('a').html();

        //模态框显示
        _moTaiKuang($('#myModal'), '申请关单', '', '' ,'', '申请关单');

        //添加类名
        $('#myModal').find('.btn-primary').removeClass('dengji').addClass('closeGD');

        //绑定信息
        bindData($(this),$('#waiting-list'));

        //input不可操作；
        $('.no-edit1').find('.single-block').children('input').attr('readOnly','readOnly').addClass('disabled-block');

        //select不可操作
        $('.no-edit1').find('.single-block').children('select').attr('disabled',true).addClass('disabled-block');

        //故障描述
        $('.gzDesc').attr('readOnly','readOnly').addClass('disabled-block');

        //部门不可操作
        $('#depart').attr('disabled',true).addClass('disabled-block');

        //清空材料
        _selectedBJ = [];

        //总计
        _totalFree = 0;

    })

    //添加材料按钮
    $('.addCL').click(function(){

        //模态框显示
        _moTaiKuang($('#myModal1'), '添加材料', '', '' ,'', '添加材料');

        //console.log(_selectedBJ);

        //表格数据
        _datasTable($('#cl-selecting'),_selectedBJ);

        //初始化
        clInit();

        //所有提示信息隐藏
        $('.errorJE').hide();

        $('.errorDJ').hide();

        $('.errorSL').hide();

    })

    //选择材料
    $('.selectCL').click(function(){

        //初始化
        //物品编码
        $('#wpbms').val('');
        //物品名称
        $('#wpmcs').val('');
        //仓库
        $('#flmcs').val('');
        //表格初始化
        _datasTable($('#weiXiuCaiLiaoTable'),_allWLArr);

        //模态框显示
        _moTaiKuang($('#myModal5'), '选择材料', '', '' ,'', '确定');

    })

    //选择材料条件搜索
    $('.tianJiaSelect').click(function(){

        //warehouse();
        CLStok();


    });

    //选择材料点击事件
    $('#weiXiuCaiLiaoTable tbody').on('click','tr',function(){
        var $this = $(this);
        var tableTr = $this.parents('.table').find('tr');
        tableTr.css('background','#ffffff');
        $this.css('background','#FBEC88');
        _bjObject.flmc = $this.children('.flmc').html();
        _bjObject.wpbm = $this.children('.wlbm').html();
        _bjObject.wpmc = $this.children('.wlmc').html();
        _bjObject.size = $this.children('.size').html();
        _bjObject.unit = $this.children('.unit').html();
        _bjObject.money = $this.children('.money').html();
    });

    //选择材料点击事件的确定按钮
    $('.addWL').click(function(){

        //赋值
        clObj.mc = _bjObject.wpmc;
        clObj.bm = _bjObject.wpbm;
        clObj.dw = _bjObject.unit;
        clObj.size = _bjObject.size;
        clObj.sl = '';
        clObj.dj = _bjObject.money;
        clObj.je = '';

        //模态框关闭
        $('#myModal5').modal('hide');

    })

    //添加材料【添加】按钮
    $('#addRK').click(function(){
        if(clObj.mc == '' || clObj.bm == '' || clObj.sl == '' ){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请填写红色必填项！', '');

        }else{
            var obj = {};
            obj.bm = clObj.bm;
            obj.mc = clObj.mc;
            obj.size = clObj.bm;
            obj.dw = clObj.dw;
            obj.sl = clObj.sl;
            obj.size = clObj.size;
            var dj = 0;
            if(clObj.dj == ''){
                dj = 0.00;
            }else{
                dj = parseFloat(clObj.dj);
            }
            obj.dj = dj.toFixed(2);
            var je = 0;
            if(clObj.je == ''){
                je = 0.00
            }else{
                je = parseFloat(clObj.je);
            }
            if(isNaN(dj) || isNaN(je)){
                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请输入正确金额或单价！', '');
                return false
            }
            obj.je = je.toFixed(2);
            _selectedBJ.unshift(obj);
            _datasTable($('#cl-selecting'),_selectedBJ);
            //添加之后初始化
            clInit();
        }

    })

    //添加材料【重置】按钮
    $('#addReset').click(function(){
        clInit();
    })

    //添加材料编辑按钮
    $('#cl-selecting')

        .on('click','.option-bianji',function(){

            //样式
            $('#cl-selecting tbody').children('tr').removeClass('tables-hover');

            $(this).parents('tr').addClass('tables-hover');

            //类名
            $(this).html('保存');

            $(this).removeClass('option-bianji').addClass('option-save');

            //将表格中的值赋给input框
            var $thisBM = $(this).parents('tr').find('.bjbm').html();

            for(var i=0;i<_selectedBJ.length;i++){
                if(_selectedBJ[i].bm == $thisBM){
                    clObj.mc = _selectedBJ[i].mc;
                    clObj.bm = _selectedBJ[i].bm;
                    clObj.dw = _selectedBJ[i].dw;
                    clObj.sl = _selectedBJ[i].sl;
                    clObj.dj = _selectedBJ[i].dj;
                    clObj.je = _selectedBJ[i].je;
                    clObj.size = _selectedBJ[i].size;
                }
            }

            //名称和编码不能修改
            $('.no-edit').attr('disabled',true);
        })

        .on('click','.option-save',function(){

            //样式
            $('#cl-selecting tbody').children('tr').removeClass('tables-hover');

            $(this).parents('tr').addClass('tables-hover');

            //类名
            $(this).html('保存');

            $(this).removeClass('option-save').addClass('option-bianji');

            //将修改的值给了_selectedBJ中
            for(var i=0;i<_selectedBJ.length;i++){
                if(clObj.bm == _selectedBJ[i].bm){
                    _selectedBJ[i].sl = clObj.sl;
                    _selectedBJ[i].dj = clObj.dj;
                    _selectedBJ[i].je = clObj.je;
                }
            }

            _datasTable($('#cl-selecting'),_selectedBJ);

            //初始化
            clInit();

        })

        .on('click','.option-shanchu',function(){

            var value = $(this).parents('tr').children('.bjbm').html();

            _selectedBJ.removeByValue(value,'bm');

            _datasTable($('#cl-selecting'),_selectedBJ);

        })

    //选中的材料
    $('#appendTo').click(function(){

        $('#myModal1').modal('hide');

        _datasTable($('#cl-list'),_selectedBJ);

        _totalFree = 0;

        //计算共计费用
        for(var i=0;i<_selectedBJ.length;i++){

            _totalFree += parseFloat(_selectedBJ[i].je);

        }

        var total = Number($('#hourFee').val()) + Number(_totalFree);

        $('#total').val(total.toFixed(2));

        //关联总费用
        var zFee = Number($('#total').val()) + Number($('#totalGS').val());

        $('#zFee').val(zFee.toFixed(2))
    })

    //外层材料选择删除
    $('#cl-list').on('click','.option-outshanchu',function(){

        var value = $(this).parents('tr').children('.bjbm').html();

        _selectedBJ.removeByValue(value,'bm');

        _datasTable($('#cl-list'),_selectedBJ);

        _totalFree = 0;

        //再次计算合计金额
        for(var i=0;i<_selectedBJ.length;i++){

            _totalFree += parseFloat(_selectedBJ[i].je);
        }

        $('#total').val(_totalFree.toFixed(2));

    });

    //填写工时费，自动计算合计金额
    $('#hourFee').keyup(function(){


       var free = Number($('#hourFee').val()) + Number(_totalFree);


        $('#total').val(free.toFixed(2));
    })

    //申请关单
    $('#myModal').on('click','.closeGD',function(){

        //首先要验证材料费用和维修费用还有总费用是不是数字

        if( $('#total').val() == 'NaN' || $('#totalGS').val() == 'NaN' || $('#zFee').val() == 'NaN' ){

            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请确保数字格式正确！', '');

        }else{

            //提示是否执行申请关单操作
            _moTaiKuang($('#confirm-Modal'), '提示', '', 'istap' ,'执行申请关单操作？', '确定');

            //添加类
            $('#confirm-Modal').find('.modal-footer').children('.btn-primary').addClass('closeGD1');

        }

    })


    //确认关单
    $('#confirm-Modal').on('click','.closeGD1',function(){

        $('#theLoading').modal('show');

        //维修材料
        addCL();

        //执行人
        addWorks();

        //维修工时费
        feeFun();

        //关闭申请
        closingApplication();

        return false;

        if( $('#receiver').val() == '' ){

            _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,'请选择验收人！', '');

            $('#confirm-Modal').modal('hide');

        }else{



        }

    })

    //历史工单
    $('#in-execution').on('click','.option-see',function(){

        //绑定数据
        bindData($(this),$('#in-execution'));

        //模态框
        _moTaiKuang($('#myModal'), '查看详情', 'flag', '' ,'', '');

    })

    //选择设备数据
    //选择设备弹窗打开后
    $('#choose-equipment').on('shown.bs.modal', function () {

        _datasTable($('#choose-equip'),equipmentArr);

    });

    //选择设备确定按钮
    $('#choose-equipment .btn-primary').on('click',function() {

        var dom = $('#choose-equip tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {
                //seekArr.push(dom.eq(i).children().eq(1).html())
                //获取地址
                $('#equip-address').val(dom.eq(i).children().eq(5).find('span').html());
                //获取设备名称
                $('#equip-name').val(dom.eq(i).children().eq(2).html());
                //获取设备编码
                $('#equip-num').val(dom.eq(i).children().eq(3).html());
                //获取设备类型
                $('#sbtype').val(dom.eq(i).children().eq(4).find('span').attr('data-num'));

                $('#choose-equipment').modal('hide');

                //设备编码
                gdObj1.sbnum = dom.eq(i).children().eq(3).html();

                //设备名称
                gdObj1.sbname = dom.eq(i).children().eq(2).html();

                //安装地点
                gdObj1.azplace = dom.eq(i).children().eq(5).find('span').html();

                //设备类型
                gdObj1.sbtype = dom.eq(i).children().eq(4).find('span').attr('data-num');

                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应设备', '')

    });

    $('#choose-metter').on('click','.tableCheck',function(){

        $(".tableCheck").attr("checked",false);

        $(this).attr("checked",true);

    });

    //选择维修事项确定按钮
    $('#choose-building .btn-primary').on('click',function() {
        var dom = $('#choose-metter tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {
                //seekArr.push(dom.eq(i).children().eq(1).html())
                $('#metter').val(dom.eq(i).children().eq(3).find('span').html());

                $('#metter').attr('data-num',dom.eq(i).children().eq(2).html());

                gdObj1.wxshx = dom.eq(i).children().eq(3).find('span').html();

                $('#choose-building').modal('hide');

                return false
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应维修事项', '')

    });

    //选择维修事项弹窗打开后
    $('#choose-building').on('shown.bs.modal', function () {
        $('#add-select').val(' ');

        getMatter();

    });

    //选择故障地点弹窗打开后
    $('#choose-area').on('shown.bs.modal', function () {
        getArea();
    });

    $('#choose-area').on('click','.tableCheck',function(){

        $(".tableCheck").attr("checked",false);

        $(this).attr("checked",true);
    });

    //选择故障地点确定按钮
    $('#choose-area .btn-primary').on('click',function() {
        var dom = $('#choose-area-table tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {
                //seekArr.push(dom.eq(i).children().eq(1).html())

                gdObj1.gzplace = dom.eq(i).children().eq(3).find('span').html();

                $('#choose-area').modal('hide');

                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择对应故障地点', '')

    });

    //点击维修事项查询按钮
    $('#selected1').on('click',function(){
        //获取维修类别
        var type = $('#add-select').find("option:selected").text();
        if(type == '全部'){
            type = '';
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDWxxmGetAll',
            data:{
                "wxnum": "",
                "wxname": "",
                "wxclassname":type
            },
            success:function(result){
                //return false;
                _datasTable($('#choose-metter'),result);
            }
        })
    });

    //选择维修人
    $('#choose-people').on('click','.btn-primary',function(){

        var dom = $('#choose-people tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {

                gdObj1.bxren = dom.eq(i).find('.adjust-comment').html();

                gdObj1.bxtel = dom.eq(i).find('.r_mobile').html();

                gdObj1.bxkesh = dom.eq(i).find('.r_depNum').html();

                $('#choose-people').modal('hide');

                return false;
            }
        }

    })

    //选择维修科室
    $('#choose-department .btn-primary').on('click',function() {

        var dom = $('#choose-department-table tbody tr');
        var length = dom.length;

        for (var i = 0; i < length; i++) {
            if (dom.eq(i).find("input[type='checkbox']").is(':checked')) {

                gdObj1.bxkesh = dom.eq(i).find('.adjust-comment').html();

                $('#choose-department').modal('hide');

                return false;
            }
        }

        _moTaiKuang($('#myModal2'),'提示', false, 'istap' ,'请选择报修科室！', '')

    });

    //电话选择
    $('#choose-people-table,#choose-department-table').on('click','.tableCheck',function(){

        $(".tableCheck").attr("checked",false);

        $(this).attr("checked",true);
    });

    //选择执行人
    $('#choose-worker-table tbody').on('click','input',function(){

        var $thisRow = $(this).parents('tr');

        if($(this).parent('.checked').length != 0){

            $(this).parent('span').removeClass('checked');

            $thisRow.removeClass('tables-hover');

        }else{

            $(this).parent('span').addClass('checked');

            $thisRow.addClass('tables-hover');

        }

    })


    //打开执行人弹窗之后
    $('#executor-choose').on('show.bs.modal',function(){

        $('#choose-worker-table tbody').children('tr').removeClass('tables-hover');

        $('#choose-worker-table tbody').find('input').parents('span').removeClass('checked');

        //首先获取已有的执行人信息

        var $tr = $('#choose-worker-table tbody').children('tr');

        //遍历表格，将已选中的行是选中状态
        for(var i=0;i<$tr.length;i++){

            for(var j=0;j<_exeWorker.length;j++){

                var $thisNum = $tr.eq(i).children('.workNum');

                if( $thisNum.html() ==  _exeWorker[j].userNum){

                    $tr.eq(i).addClass('tables-hover');

                    $tr.eq(i).find('input').parents('span').addClass('checked');

                }
            }

        }



    })

    //执行人条件查询
    $('#worker-choose1').click(function(){

        servicPerson();

    })

    //选中执行人
    $('.addExecutor').click(function(){

        //获取选中的执行人

        var arr = [];

        var allPerson = $('.checker');

        var allWorkNum = $('#choose-worker-table tbody').find('.workNum');

        for(var i=0;i<allPerson.length;i++){
            if(allPerson.eq(i).children('.checked').length != 0){
                for(var j=0;j<_allWorkers.length;j++){
                    if(allWorkNum.eq(i).html() == _allWorkers[j].userNum){
                        arr.push(_allWorkers[j]);
                    }
                }
            }
        }

        _exeWorker.length = 0;

        for(var i=0;i<arr.length;i++){

            _exeWorker.push(arr[i]);

        }

        _datasTable($('#fzr-list'),_exeWorker);

        $('#executor-choose').modal('hide');

        if( _exeWorker.length == _primaryWork.length){

            for(var i=0;i<_exeWorker.length;i++){

                for(var j=0;j<_primaryWork.length;j++){

                    if( _exeWorker[i].userNum != _primaryWork[j].userNum ){

                            _isChange = false;

                            break;
                    }else{

                        _isChange = true;

                    }

                }

            }

        }else{

            _isChange = false;

        }

    })

    //添加工时费用
    $('.addGS').click(function(){

        //初始化
        _secondFeeArr.length = 0;

        for(var i=0;i<_firstFeeArr.length;i++){

            _secondFeeArr.push(_firstFeeArr[i]);

        }
        feeNumInit(_secondFeeArr);
        //模态框显示
        _moTaiKuang($('#fee-Modal'),'添加维修费用', false, '' ,'', '添加费用');

    })

    //添加工时费用确定按钮
    $('#appendToGS').click(function(){

        //模态框消失
        $('#fee-Modal').modal('hide');

        //_second传给first
        _firstFeeArr = [];

        for(var i = 0;i<_secondFeeArr.length;i++){

            _firstFeeArr.push(_secondFeeArr[i]);

        }

        //给第一层的工时费用表格赋值
        _datasTable($('#gs-list'),_firstFeeArr);

        //合计金额
        var amount = 0;

        for(var i=0;i<_firstFeeArr.length;i++){

            var fee = Number(_firstFeeArr[i].workfee) * Number(_firstFeeArr[i].workhour);

            amount += fee;

        }

        //给总金额赋值
        $('#totalGS').val(Number(amount).toFixed(2));

        //关联总费用
        var zFee = Number($('#total').val()) + Number($('#totalGS').val());

        $('#zFee').val(zFee.toFixed(2));

    })

    //项目费用选择
    $('.selectFY').click(function(){

        //初始化
        feeListInit();

        //模态框显示
        _moTaiKuang($('#fee-ModalList'),'添加维修费用', false, '' ,'', '添加费用');

    })

    //条件查询工时费
    $('.tianJiaFee').click(function(){

        feeConditionSelect();

    })

    //点击项目费用表格，选择费用
    $('#gsTable tbody').on('click','tr',function(){

        $('#gsTable tbody').find('tr').removeClass('tables-hover');

        $(this).addClass('tables-hover');

    })

    //选择费用确定按钮
    $('.addGS1').click(function(){

        //将选中的表格值赋值
        var info = $('#gsTable tbody').find('.tables-hover')

        //项目名称
        feeObj.mc = info.children().eq(1).html();
        //项目编码
        feeObj.bm = info.children().eq(0).html();
        //项目类别
        feeObj.lb = info.children().eq(2).html();
        //费用
        feeObj.fee = info.children().eq(3).html();
        //数量
        feeObj.sl = '';

        //模态框消失
        $('#fee-ModalList').modal('hide');

    })

    //给工时费添加数量(第一层模态框的数组叫first，二second)；
    $('#addRKFee').click(function(){

        //将填写好的数量等等写入secondArr；
        var currentObj = {};
        //项目名称
        currentObj.wxname = feeObj.mc;
        //项目编码
        currentObj.wxnum = feeObj.bm;
        //项目类别
        currentObj.wxclassname = feeObj.lb;
        //费用（元）
        currentObj.workfee = feeObj.fee;
        //数量
        currentObj.workhour = feeObj.sl;
        //备注
        currentObj.memo = feeObj.remark;

        //验证非空
        if(feeObj.mc == '' || feeObj.bm == '' || feeObj.lb == '' || feeObj.fee == '' || feeObj.sl == '' ){

            //提示
            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请填写红色必填项', '');

        }else{

            //验证格式
            var o = $('.errorFee').css('display');

            if( o != 'none'){

                _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请填写格式正确的内容', '');

            }else{

                //验证通过，将对象的值付给表格
                if( _secondFeeArr.length == 0 ){

                    _secondFeeArr.push(currentObj);

                }else{

                    var isExist = false;

                    for(var i=0;i<_secondFeeArr.length;i++){

                        if(_secondFeeArr[i].wxnum === currentObj.wxnum){

                            isExist = true;

                            break;

                        }

                    }

                    if(!isExist){

                        _secondFeeArr.push(currentObj);

                    }else{

                        _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'已经添加过', '');

                    }

                }

                _datasTable($('#gs-selecting'),_secondFeeArr);

                //初始化input框
                //项目名称
                feeObj.mc = '';
                //项目编码
                feeObj.bm = '';
                //项目类别
                feeObj.lb = '';
                //费用
                feeObj.fee = '';
                //数量
                feeObj.sl = '';
                //备注
                feeObj.remark = '';

            }


        }

    })

    //给工时费添加数量重置按钮
    $('#addResetFee').click(function(){

        //项目名称
        feeObj.mc = '';
        //项目编码
        feeObj.bm = '';
        //项目类别
        feeObj.lb = '';
        //费用
        feeObj.fee = '';
        //数量
        feeObj.sl = '';
        //备注
        feeObj.remark = '';
        //可否编辑
        $('#GS').find('.no-edit').removeClass('disabled-block').attr('disabled',false);

    })

    //第二层模态框表格的编辑操作
    $('#gs-selecting tbody').on('click','.option-bianji',function(){

        //样式
        $('#gs-selecting tbody').children().removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //项目框自动赋值
        $('#GS').find('.no-edit').addClass('disabled-block').attr('disabled',true);

        //按钮变为保存
        $(this).html('保存').removeClass('option-bianji').addClass('option-baocun');

        //赋值
        var thisData = $(this).parents('tr');
        //项目名称
        feeObj.mc = thisData.children().eq(1).html();
        //项目编码
        feeObj.bm = thisData.children().eq(0).html();
        //项目类别
        feeObj.lb = thisData.children().eq(2).html();
        //费用
        feeObj.fee = thisData.children().eq(3).html();
        //数量
        feeObj.sl = thisData.children().eq(4).html();
        //备注
        feeObj.remark = thisData.children().eq(5).html();

    })

    //第二层模态框表格的保存操作
    $('#gs-selecting tbody').on('click','.option-baocun',function(){

        var currentObj = {};

        //根据项目编码，修改数量
        //项目名称
        currentObj.wxname = feeObj.mc;
        //项目编码
        currentObj.wxnum = feeObj.bm;
        //项目类别
        currentObj.wxclassname = feeObj.lb;
        //费用（元）
        currentObj.workfee = feeObj.fee;
        //数量
        currentObj.workhour = feeObj.sl;
        //备注
        currentObj.memo = feeObj.remark;

        //验证非空
        if(feeObj.mc == '' || feeObj.bm == '' || feeObj.lb == '' || feeObj.fee == '' || feeObj.sl == '' ){

            //提示
            _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请填写红色必填项', '');

        }else{

            //验证格式
            var o = $('.errorFee').css('display');

            if( o != 'none' ){

                _moTaiKuang($('#myModal2'), '提示', true, 'istap' ,'请填写格式正确的内容', '');

            }else{

                for(var i=0;i<_secondFeeArr.length;i++){

                    if(_secondFeeArr[i].wxnum == currentObj.wxnum){

                        //重新赋值
                        //项目编码
                        _secondFeeArr[i].wxnum = currentObj.wxnum;
                        //项目名称
                        _secondFeeArr[i].wxname = currentObj.wxname;
                        //项目类别
                        _secondFeeArr[i].wxclassname = currentObj.wxclassname;
                        //费用
                        _secondFeeArr[i].workfee = currentObj.workfee;
                        //数量
                        _secondFeeArr[i].workhour = currentObj.workhour;
                        //备注
                        _secondFeeArr[i].memo = currentObj.memo;

                    }

                }

                _datasTable($('#gs-selecting'),_secondFeeArr);

                //input框充值
                //项目名称
                feeObj.mc = '';
                //项目编码
                feeObj.bm = '';
                //项目类别
                feeObj.lb = '';
                //费用
                feeObj.fee = '';
                //数量
                feeObj.sl = '';
                //备注
                feeObj.remark = '';
                //可否编辑
                $('#GS').find('.no-edit').removeClass('disabled-block').attr('disabled',false);

            }

        }

    })

    //第二层模态框表格的删除操作
    $('#gs-selecting tbody').on('click','.option-shanchu',function(){

        //样式
        //样式
        $('#gs-selecting tbody').children().removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //模态框删除

        var str = $(this).parents('tr').children(1).html();

        _moTaiKuang($('#second-Del'), '确定要删除吗？', false, 'istap' ,str, '删除');

    })

    //删除确定按钮
    $('#second-Del').on('click','.btn-primary',function(){

        //删除
        var str = $('#second-Del').find('.modal-body').html();

        var obj = {};

        for(var i=0;i<_secondFeeArr.length;i++){

            if(_secondFeeArr[i].wxnum == str){

                obj = _secondFeeArr[i];

            }

        }

        _secondFeeArr.remove(obj);

        _datasTable($('#gs-selecting'),_secondFeeArr);

        //模态框消失
        $('#second-Del').modal('hide');

    })

    //输入材料小计或者维修费用小计的时候，自动计算总费用
    $('#total').keyup(function(){

        //关联总费用
        var zFee = Number($('#total').val()) + Number($('#totalGS').val());

        $('#zFee').val(zFee.toFixed(2))

    })

    $('#total').blur(function(){

      var values = Number($('#total').val()).toFixed(2);

      $('#total').val(values)

    })

    $('#totalGS').keyup(function(){

        //关联总费用
        var zFee = Number($('#total').val()) + Number($('#totalGS').val());

        $('#zFee').val(zFee.toFixed(2))

    })

    $('#totalGS').blur(function(){

        var values = Number($('#totalGS').val()).toFixed(2);

        $('#totalGS').val(values)

    })


    /*------------------------------------------------表格初始化------------------------------------------*/

    //执行中表格
    var waitingListCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '"data-gdCircle="' + full.gdCircle +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        //{
        //    title:'工单类型',
        //    data:'gdJJ',
        //    render:function(data, type, full, meta){
        //        if(data == 0){
        //            return '普通'
        //        }else{
        //            return '快速'
        //        }
        //    }
        //},
        //{
        //    title:'设备类型',
        //    data:'wxShiX'
        //},
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'维修事项',
            data:'wxXm',
            className:'WXSX'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'报修时间',
            data:'gdShij'
        },
        //{
        //    title:'受理时间',
        //    data:'shouLiShij'
        //},
        {
            title:'接单时间',
            data:'paiGongShij'
        },
        {
            title:'维修科室',
            data:'wxKeshi',
            className:'WXBZ'
        },
        {
            title:'报修科室',
            data:'bxKeshi'
        },
        {
            title:'报修人',
            data:'bxRen'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-close btn default btn-xs green-stripe'>申请关单</span>" +
            "<span class='data-option option-callback btn default btn-xs green-stripe'>回退</span>" +
            "<span class='data-option option-cancel btn default btn-xs green-stripe'>取消</span>"
        }
    ];

    _tableInit($('#waiting-list'),waitingListCol,'2','','','');

    //等待资源
    var waitingMaterial = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '"data-gdCircle="' + full.gdCircle +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'维修事项',
            data:'wxXm',
            className:'WXSX'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'报修时间',
            data:'gdShij'
        },
        {
            title:'接单时间',
            data:'paiGongShij'
        },
        {
            title:'维修科室',
            data:'wxKeshi',
            className:'WXBZ'
        },
        {
            title:'等待原因',
            data:'dengyy',
            render:function(data, type, full, meta){

                if(data == 1){

                    return '等待技术支持'

                }else if(data == 2){

                    return '等待配件'

                }else if( data == 3 ){

                    return '等待外委施工'

                }
            }
        },
        {
            title:'预计完成时间',
            data:'yjShij'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看记录</span>" +
            "<span class='data-option option-callback btn default btn-xs green-stripe'>回退</span>" +
            "<span class='data-option option-cancel btn default btn-xs green-stripe'>取消</span>"
        }
    ]

    _tableInit($('#waiting-material'),waitingMaterial,'2','','','');

    //待关单表格
    var daiWaitingListCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){
                return '<span data-zht="' + full.gdZht +
                    '" data-circle="' + full.gdCircle +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        //{
        //    title:'工单类型',
        //    data:'gdJJ',
        //    render:function(data, type, full, meta){
        //        if(data == 0){
        //            return '普通'
        //        }else{
        //            return '快速'
        //        }
        //    }
        //},
        //{
        //    title:'设备类型',
        //    data:'wxShiX'
        //},
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'维修事项',
            data:'wxXm'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'报修时间',
            data:'gdShij'
        },
        //{
        //    title:'受理时间',
        //    data:'shouLiShij'
        //},
        {
            title:'接单时间',
            data:'paiGongShij'
        },
        {
            title:'报修科室',
            data:'bxKeshi'
        },
        {
            title:'报修人',
            data:'bxRen'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'执行人',
            data:'wxUserNames'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-close btn default btn-xs green-stripe'>申请关单</span>"

        }
    ];

    var _tables = $('#dai-waiting-list').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        "columnDefs":[
            {
                //设置第一列不参与搜索
                //"targets":[0,1,2,3,4,5,6,7,8,10],
                "targets":[3],
                "searchable":false
            }
        ],
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'sSearch':'查询执行人：',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'ft<"F"lip>',
        'buttons': [
            {
                text:'新增',
                className:'saveAs addFun btn btn-success'
            }
        ],
        'columns':daiWaitingListCol,
        'aoColumnDefs':[
            {
                sDefaultContent: '',
                aTargets: [ '_all' ]
            }
        ],
    });

    //添加搜索框
    $('#search-zxr').bind('input propertychange', function() {
        //获取input中的值
        var arg = $(this).val();

        _tables
            .column(9)
            .search( arg )
            .draw();
    });

    //_tableInit($('#dai-waiting-list'),daiWaitingListCol,'2','','','');

    //历史表格
    var inExecutionCol = [
        {
            title:'工单号',
            data:'gdCode',
            className:'gdCode',
            render:function(data, type, full, meta){

                return '<span data-zht="' + full.gdZht +
                    '" data-circle="' + full.gdCircle +
                    '">' + '<a href="gdDetails.html?gdCode=' + full.gdCode + '&gdCircle=' + full.gdCircle +
                    '"target="_blank">' + data + '</a>' +
                    '</span>'
            }
        },
        //{
        //    title:'工单类型',
        //    data:'gdJJ',
        //    render:function(data, type, full, meta){
        //        if(data == 0){
        //            return '普通'
        //        }else{
        //            return '快速'
        //        }
        //    }
        //},
        //{
        //    title:'设备类型',
        //    data:'wxShiX'
        //},
        {
            title:'故障位置',
            data:'wxDidian'
        },
        {
            title:'维修事项',
            data:'wxXm'
        },
        {
            title:'故障描述',
            data:'bxBeizhu'
        },
        {
            title:'报修时间',
            data:'gdShij'
        },
        //{
        //    title:'受理时间',
        //    data:'shouLiShij'
        //},
        {
            title:'接单时间',
            data:'paiGongShij'
        },
        {
            title:'报修科室',
            data:'bxKeshi'
        },
        {
            title:'报修人',
            data:'bxRen'
        },
        {
            title:'联系电话',
            data:'bxDianhua'
        },
        {
            title:'执行人',
            data:'wxUserNames'
        }
        //{
        //    title:'操作',
        //    data:null,
        //    defaultContent: "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>"
        //}
    ];

    _tableInit($('#in-execution'),inExecutionCol,'2','','','');

    //执行人表格
    var fzrListCol = [
        {
            title:'工号',
            data:'userNum',
            className:'workNum'
        },
        {
            title:'执行人名称',
            data:'userName'
        },
        //{
        //    title:'职位',
        //    data:'pos'
        //},
        {
            title:'联系电话',
            data:'mobile'
        }
    ];

    tableInit($('#fzr-list'),fzrListCol,'2','','','');

    tableInit($('#fzr-list1'),fzrListCol,'2','','','');

    //材料列表
    var clListCol = [
        {
            title:'编码',
            data:'bm',
            className:'bjbm'
        },
        {
            title:'名称',
            data:'mc',
        },
        {
            title:'规格型号',
            data:'size'
        },
        {
            title:'单位',
            data:'dw'
        },
        {
            title:'数量',
            data:'sl'
        },
        {
            title:'单价（元）',
            data:'dj'
        },
        {
            title:'金额（元）',
            data:'je'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-bianji btn default btn-xs green-stripe'>编辑</span><span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>"
        }
    ];

    tableInit($('#cl-selecting'),clListCol,'2','','','');

    //外层材料列表
    var outClListCol = [
        {
            title:'序号',
            data:'mc',
            render:function(data, type, full, meta){

                return meta.row + 1
            }
        },
        {
            title:'名称',
            data:'mc'
        },
        {
            title:'规格型号',
            data:'size',
            className:'bjbm'
        },
        {
            title:'单位',
            data:'dw'
        },
        {
            title:'数量',
            data:'sl'
        },
        {
            title:'单价（元）',
            data:'dj'
        },
        {
            title:'金额（元）',
            data:'je'
        }
    ];

    tableInit($('#cl-list'),outClListCol,'2','','','');

    //材料选择列表
    var clSelectList =  [
        {
            title:'仓库',
            data:'storageName',
            className:'flmc'
        },
        {
            title:'物料编码',
            data:'itemNum',
            className:'wlbm'
        },
        {
            title:'物料名称',
            data:'itemName',
            className:'wlmc'
        },
        {
            title:'型号',
            data:'size',
            className:'size'
        },
        {
            title:'单价',
            className:'money',
            render:function(data, type, full, meta){

                var prince = Number(full.amount)/Number(full.num);

                return prince.toFixed(2);

            }

        },
        {
            title:'单位',
            data:'unitName',
            className:'unit'
        }
    ];

    _tableInit($('#weiXiuCaiLiaoTable'),clSelectList,'2','','','');

    //负责人数据
    fzrFun();

    //条件刷新
    //conditionSelect(true);

    //验收人
    //receiverData();

    //选择设备表格
    var equipTable = $('#choose-equip').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',
            'search':'搜索:',
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
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'id',
                data:'id',
                class:'theHidden'
            },
            {
                title:'设备名称',
                data:'dName'
            },
            {
                title:'设备编码',
                data:'dNewNum'
            },
            {
                title:'设备类型',
                data:'dsName',
                render:function(data, type, row, meta){
                    return '<span data-num="'+row.dsNum+'">'+data+'</span>'
                }
            },
            {
                title:'安装位置',
                data:'installAddress',
                class:'adjust',
                render:function(data, type, full, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            }
        ]
    });

    //选择维修事项表格
    var matterTable = $('#choose-metter').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
            'search':'搜索:',
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
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'id',
                data:'id',
                class:'theHidden'
            },
            {
                title:'维修项目编号',
                data:'wxnum',
                class:'theHidden'
            },
            {
                title:'维修项目名称',
                data:'wxname',
                class:'adjust-comment',
                render:function(data, type, full, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            },
            {
                title:'项目类别名称',
                data:'wxclassname'
            },
            {
                title:'备注',
                data:'memo'
            }
        ]
    });

    //故障地点表格
    var areaTable = $('#choose-area-table').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
            'search':'搜索:',
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
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'id',
                data:'id',
                class:'theHidden'
            },
            {
                title:'地点编号',
                data:'locnum',
                class:'theHidden'
            },
            {
                title:'地点名称',
                data:'locname',
                class:'adjust-comment',
                render:function(data, type, full, meta){
                    return '<span title="'+data+'">'+data+'</span>'
                }
            },
            {
                title:'部门名称',
                data:'departname'
            },
            {
                title:'楼栋名称',
                data:'ddname'
            }
        ]
    });

    //报修人表格
    var peopleTable = $('#choose-people-table').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
            'search':'搜索:',
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
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'用户名称',
                data:'userName',
                class:'adjust-comment'
            },
            {
                title:'职位',
                data:'pos'
            },
            {
                title:'电话',
                data:'mobile',
                className:'r_mobile'
            },
            {
                title:'部门',
                data:'departName',
                className:'r_dep'
            },
            {
                title:'部门编码',
                data:'departNum',
                className:'r_depNum'
            }
        ]
    });

    //报修科室表格
    var departTable = $('#choose-department-table').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
            'search':'搜索:',
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
                "targets": -1,
                "data": null,
                "defaultContent": "<input type='checkbox' class='tableCheck'/>"
            },
            {
                title:'部门编号',
                data:'departNum',
                class:'adjust-comment'
            },
            {
                title:'部门名称',
                data:'departName'
            }
        ]
    });

    //表格初始化
    var workTable = $('#choose-worker-table').DataTable({
        'autoWidth': false,  //用来启用或禁用自动列的宽度计算
        'paging': true,   //是否分页
        'destroy': true,//还原初始化了的datatable
        'searching': true,
        'ordering': false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第 _PAGE_ 页 / 总 _PAGES_ 页 总记录数为 _TOTAL_ 条',
            'search':'搜索:',
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
                className:'checkeds',
                data:null,
                defaultContent:"<div class='checker'><span class=''><input type='checkbox'></span></div>"
            },
            {
                title:'工号',
                data:'userNum',
                className:'workNum'
            },
            {
                title:'姓名',
                data:'userName'
            },
            {
                title:'部门',
                data:'departName'
            },
            {
                title:'职位',
                data:'pos'
            },
            {
                title:'联系电话',
                data:'mobile'
            }
        ]
    });

    //获取维修人员
    servicPerson();

    //项目费用list
    var feeCol = [

        {
            title:'项目编码',
            data:'wxnum'
        },
        {
            title:'项目名称',
            data:'wxname'
        },
        {
            title:'项目类别',
            data:'wxclassname'
        },
        {
            title:'工作费用',
            data:'workfee',
            render:function(data, type, full, meta){

                return Number(data).toFixed(2)

            }
        }

    ]

    _tableInit($('#gsTable'),feeCol,'2','','','');

    //费用添加数量时的表格
    var feeNumCol = [

        {
            title:'项目编码',
            data:'wxnum'
        },
        {
            title:'项目名称',
            data:'wxname'
        },
        {
            title:'项目类别',
            data:'wxclassname'
        },
        {
            title:'工作费用',
            data:'workfee',
            render:function(data, type, full, meta){

                return Number(data).toFixed(2)

            }
        },
        {
            title:'数量',
            data:'workhour'
        },
        {
            title:'备注',
            data:'memo'
        },
        {
            title:'操作',
            data:null,
            defaultContent: "<span class='data-option option-bianji btn default btn-xs green-stripe'>编辑</span><span class='data-option option-shanchu btn default btn-xs green-stripe'>删除</span>"
        }

    ]

    _tableInit($('#gs-selecting'),feeNumCol,'2','','','','');

    //第一层费用表格
    var feefirstCol = [

        {
            title:'项目编码',
            data:'wxnum'
        },
        {
            title:'项目名称',
            data:'wxname'
        },
        {
            title:'项目类别',
            data:'wxclassname'
        },
        {
            title:'工作费用',
            data:'workfee'
        },
        {
            title:'数量',
            data:'workhour'
        },
        {
            title:'备注',
            data:'memo'
        }

    ]

    _tableInit($('#gs-list'),feefirstCol,'2','','','',true);

    /*------------------------------------------------其他方法--------------------------------------------*/

    var equipmentArr = [];
    getEuipment('');
    //获取设备类型
    function getEuipment(dsNum){

        $.ajax({
            type:'post',
            url:_urls + 'YWDev/ywDIGetDevs',
            data:{
                userID:_userIdNum,
                dsNum:dsNum
            },
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

            },
            success:function(result){
                //console.log(result);
                $('#theLoading').modal('hide');
                $(result).each(function(i,o){
                    equipmentArr.push(o);
                })
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#theLoading').modal('hide');
                console.log(jqXHR.responseText);
            }
        })
    };

    //初始化
    function dataInit(){
        gdObj1.gdtype = '1';
        gdObj1.xttype = '';
        gdObj1.bxtel = '';
        gdObj1.bxkesh = '';
        gdObj1.bxren = '';
        gdObj1.pointer = '';
        gdObj1.gztime = '';
        gdObj1.sbtype = '';
        gdObj1.sbnum = '';
        gdObj1.sbname = '';
        gdObj1.azplace = '';
        gdObj1.gzplace = '';
        gdObj1.wxshx = '';
        gdObj1.wxbz = '';
        gdObj1.wxcontent = '';
        $('.gzDesc').val('');

    };

    //选材料初始化
    function clInit(){
        clObj.mc='';
        clObj.bm='';
        clObj.dw='';
        clObj.sl='';
        clObj.dj='';
        clObj.je='';
        clObj.size = '';
        $('.no-edit').attr('disabled',false);
    }

    //关单申请初始化
    function gdInit(){

        //维修材料表格初始化
        var arr = [];

        _datasTable($('#cl-list'),arr);

        //工时费初始化
        $('#hourFee').val('');

        //合计金额初始化
        $('#total').val('');

        //维修内容初始化
        $('.wxcontent').val('');

        //执行人初始化
        $('#depart').val('');

        _datasTable($('#fzr-list'),arr);

        //验收人
        $('#receiver').val('');

        //维修费用
        _datasTable($('#gs-list'),arr);

        //工时小计
        $('#totalGS').val('');

        //总费用
        $('#zFee').val('');

    }

    //条件查询
    function conditionSelect(flag,part){

        var prm = {};

        var st = $('.min').val();

        var et = moment($('.max').val()).add(1,'d').format('YYYY/MM/DD');

        if(_isFZR){

            prm = {
                'gdCode':$('.filterInput').val(),
                'gdSt':st,
                'gdEt':et,
                'userID': _userIdNum,
                'userName': _userIdName,
                'b_UserRole':_userRole,
                'wxKeshiNum':_userBM,
                'wxKeshi':_userBMName
            }

        }else{

            prm = {
                'gdCode':$('.filterInput').val(),
                'gdSt':st,
                'gdEt':et,
                'userID': _userIdNum,
                'userName': _userIdName,
                'b_UserRole':_userRole,
                'wxRenId':_userIdNum
            }

        }

        //如果part为假的话，模态框的情况下刷新数据，真的话，模态框情况下不刷新数据
        if(!part){

            if($('.modal-backdrop').length > 0){

                theTimeout = setTimeout(function(){

                    conditionSelect(true);

                },refreshTime);

                return false;
            }

        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDJ',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {
                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

                if($('.modal-backdrop').length > 0){

                    $('div').remove('.modal-backdrop');

                    $('#theLoading').hide();
                }

            },
            success:function(result){

                //根据状态值给表格赋值
                var zht=[],zht5=[],my=[],other=[];

                for(var i=0;i<result.length;i++){

                    if(result[i].gdZht == 4){

                        var reg = ',' + _userIdNum + ',';

                        if(result[i].wxUserIDs.indexOf(reg)>=0){

                            my.push(result[i]);

                        }else{

                            other.push(result[i]);

                        }

                    }else if(result[i].gdZht == 5){

                        zht5.push(result[i]);

                    }else{

                        zht.push(result[i]);

                    }
                }

                //执行中
                _datasTable($('#waiting-list'),my);
                //待执行中
                _datasTable($('#dai-waiting-list'),other);
                //历史
                _datasTable($('#in-execution'),zht);
                //等待资源
                _datasTable($('#waiting-material'),zht5);

                //定时刷新
                if(flag){
                    theTimeout = setTimeout(function(){

                        conditionSelect(true);

                    },refreshTime);
                }

                $('#theLoading').modal('hide');

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //车站数据(报修科室)
    function ajaxFun(url, allArr, select, text, num) {
        var prm = {
            'userID': _userIdNum
        }
        prm[text] = '';
        $.ajax({
            type: 'post',
            url: _urls + url,
            timeout:30000,
            data: prm,
            success: function (result) {
                //给select赋值
                var str = '<option value="">请选择</option>';
                for (var i = 0; i < result.length; i++) {
                    str += '<option' + ' value="' + result[i][num] + '">' + result[i][text] + '</option>'
                    allArr.push(result[i]);
                }
                select.empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //报修科室与部门联动
    function ksAndBm(url, allArr, select, text, num){
        var prm = {
            'userID': _userIdNum
        }
        prm[text] = '';
        $.ajax({
            type: 'post',
            url: _urls + url,
            timeout:30000,
            data: prm,
            success: function (result) {
                //给select赋值
                var str = '<option value="">请选择</option>';
                for (var i = 0; i < result.length; i++) {
                    str += '<option' + ' value="' + result[i][num] + '"data-num=' + result[i]['departNum'] +'>' + result[i][text] + '</option>'
                    allArr.push(result[i]);
                }
                select.empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //绑定信息
    function bindData(num,tableId){
        //样式
        tableId.children('tbody').children('tr').removeClass('tables-hover');

        num.parents('tr').addClass('tables-hover');

        _gdCode = num.parents('tr').children('.gdCode').children('span').children('a').html();

        _gdZht = num.parents('tr').children('.gdCode').children('span').attr('data-zht');

        _gdCircle = num.parents('tr').children('.gdCode').children('span').attr('data-circle');

        //请求数据
        var prm = {
            'gdCode':_gdCode,
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':_userRole,
            'gdCircle':num.parents('tr').children('.gdCode').children('span').attr('data-circle'),
            'gdZht':num.parents('tr').children('.gdCode').children('span').attr('data-zht')
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            data:prm,
            timeout:_theTimes,
            beforeSend: function () {

                $('#theLoading').modal('hide');

                $('#theLoading').modal('show');
            },

            complete: function () {

                $('#theLoading').modal('hide');

                //if($('.modal-backdrop').length > 0){
                //
                //    $('div').remove('.modal-backdrop');
                //
                //    $('#theLoading').hide();
                //}

            },
            success:function(result){
                //赋值
                gdObj.bxtel = result.bxDianhua;
                gdObj.bxkesh = result.bxKeshiNum;
                gdObj.bxren = result.bxRen;
                //gdObj.pointer = '';
                gdObj.gztime = result.gdFsShij;
                gdObj.gzplace = result.wxDidian;
                gdObj.wxshx=result.wxXm;
                //gdObj.sbtype = result.
                gdObj.sbnum = result.wxShebei;
                gdObj.sbname = result.dName;
                gdObj.azplace = result.installAddress;
                $('.gzDesc').val(result.bxBeizhu);

                $('.wxcontent').val(result.wxBeizhu);

                _exeWorker.length = 0;

                _primaryWork.length = 0;

                //执行人信息
                var arr = [];
                for(var i=0;i<result.wxRens.length;i++){
                    var obj = {};
                    obj.userNum = result.wxRens[i].wxRen;
                    obj.userName = result.wxRens[i].wxRName;
                    obj.mobile = result.wxRens[i].wxRDh;
                    arr.push(obj);
                    _exeWorker.push(obj);
                    _primaryWork.push(obj);
                }
                _datasTable($('#fzr-list'),arr);

                //验收人
                receiverData(gdObj.bxkesh);

                //绑定部门信息
                $('#depart').val(result.wxKeshiNum);

                //维修班组
                $('#wxbz').val($('#depart').children('option:selected').html());

                $('#wxbz').attr('data-bm',result.wxKeshiNum);

                //物料详情
                var arr1 = [];
                _datasTable($('#cl-list'),arr1);

                $('#hourFee').val('');

                $('#total').val('');

                manHourFee(result.wxXmNum);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有部门
    function getDpartment(){

        var prm = {
            'departName':'',
            'userID':_userIdNum,
            'userName':_userIdName
        }

        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>'

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].departNum +
                        '">' + result[i].departName + '</option>'
                }

                $('#department-select').empty().append(str);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有物品列表
    function ClListData(){
        var str = '';

        if($('#flmcs').val() == ''){
            str = '';
        }else{
            str = $('#flmcs').children('option:selected').html();
        }

        var prm = {
            itemNum : $.trim($('#wpbms').val()),
            itemName: $.trim($('#wpmcs').val()),
            cateName: str,
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKRptItemStock',
            data:prm,
            success:function(result){
                _allWLArr.length = 0;
                for(var i=0;i<result.length;i++){
                    _allWLArr.push(result[i]);
                }
                _datasTable($('#weiXiuCaiLiaoTable'),result)
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有仓库
    function warehouse(){
        var prm = {
            'userID':_userIdNum,
            'userName':_userIdName,
            'b_UserRole':'admin',
            "hasLocation":1
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetStorages',
            data:prm,
            success:function(result){

                _ckArr.length = 0;

                var str = '<option value="">请选择</option>';

                for(var i=0;i<result.length;i++){

                    _ckArr.push(result[i]);

                    str += '<option value="' + result[i].storageNum + '">' + result[i].storageName + '</option>';

                }
                $('#flmcs').empty().append(str);

                CLStok(true);

            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取所有物品库存
    function CLStok(flag){

        var prm = {

            //仓库
            //storageNums:$('#flmcs').val(),
            //物品编码
            itemNum : $.trim($('#wpbms').val()),
            //物品名称
            itemName: $.trim($('#wpmcs').val()),
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //部门
            b_UserRole:_userRole,
            //hasNum
            hasNum:1

        }

        var arr = [];

        if($('#flmcs').val() == '' || $('#flmcs').val() == null ){


            for(var i=0;i<_ckArr.length;i++){

                arr.push(_ckArr[i].storageNum);

            }

            prm.storageNums = arr;

        }else{

            prm.storageNum = $('#flmcs').val();

        }

        $.ajax({

            type:'post',

            url:_urls + 'YWCK/ywCKRptItemStock',

            timeout:_theTimes,

            data:prm,

            success:function(result){

                if(flag){

                    _allWLArr.length = 0;

                    for(var i=0;i<result.length;i++){

                        _allWLArr.push(result[i]);

                    }

                }


                _datasTable($('#weiXiuCaiLiaoTable'),result)

            },

            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);
            }

        })

    }

    //添加物料方法
    function addCL(){
        //当没有选择物料的时候，完成_clIsComplete = true;
        if(_selectedBJ.length == 0){

            _clIsComplete = true;

        }else{

            var arr = [];
            for(var i=0;i<_selectedBJ.length;i++){
                var obj = {};
                obj.wxCl = _selectedBJ[i].bm;
                obj.wxClName = _selectedBJ[i].mc;
                obj.clShul = _selectedBJ[i].sl;
                obj.wxClPrice = _selectedBJ[i].dj;
                obj.wxClAmount = _selectedBJ[i].je;
                obj.gdCode = _gdCode;
                arr.push(obj);
            }

            var prm = {
                gdCode:_gdCode,
                gdWxCls:arr,
                userID:_userIdNum,
                userName:_userIdName,
                b_UserRole:_userRole
            }

            $.ajax({
                type:'post',
                url:_urls + 'YWGD/ywGDAddWxCl',
                data:prm,
                timeout:_theTimes,
                success:function(result){

                    _clIsComplete = true;

                    if(result == 99){

                        _clIsSuccess = 'true';

                    }else{
                        _clIsSuccess = 'false';
                    }

                    isComplete();
                },
                error:function(jqXHR, textStatus, errorThrown){

                    _clIsComplete = true;

                    //执行出错
                    _clIsSuccess = 'false';

                    console.log(jqXHR.responseText);
                }
            })

        }

    }

    //关单申请
    function closingApplication(){
        var prm = {
            gdCode:_gdCode,
            gdZht:6,
            wxBeizhu:$('.wxcontent').val(),
            yanShouRen:$('#receiver').val(),
            yanShouRenName:$('#receiver').children('option:selected').html() == '请选择'?'':$('#receiver').children('option:selected').html(),
            //工单总费用
            gdFee:$('#zFee').val(),
            //维修项目总费用
            gongShiFee:$('#totalGS').val(),
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDReqWang',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _gbIsComplete = true;

                if(result==99){

                    _gbIsSuccess = 'true';

                }else{

                    _gbIsSuccess = 'false';

                }

                isComplete();
            },
            error:function(jqXHR, textStatus, errorThrown){

                _gbIsComplete = true;

                _gbIsSuccess = 'false';

                console.log(jqXHR.responseText);

            }
        })
    }

    //判断添加物品和关单申请和工时费是否完成
    function isComplete(){
        if( _clIsComplete && _gbIsComplete  && _zxrIsComplete && _gsfIsComplete){

                var str = '';

                if( _clIsSuccess == 'true' ){

                    str += '添加物品成功！'

                }else if( _clIsSuccess == 'false' ){

                    str += '添加物品失败！'

                }else if( _clIsSuccess == '' ){

                    str += ''

                }
                if( _zxrIsSuccess == 'true' ){

                    str += '添加执行人成功！'

                }else if( _zxrIsSuccess == 'false' ){

                    str += '添加执行人失败！'

                }else if( _zxrIsSuccess == '' ){

                    str += ''

                }
                if( _gbIsSuccess == 'true'){

                    str += '申请关单成功！';

                    BEE.modificationImportInfo();

                }else if( _gbIsSuccess == 'false' ){

                    str += '申请关单失败！'
                }

                if( _gsfIsSuccess == 'true' ){

                    str += '添加维修工时费成功！'

                }else if(_gsfIsSuccess == 'false'){

                    str += '添加维修工时费失败！'

                }else{

                    str += ''

                }


                $('#theLoading').modal('hide');

                $('#myModal').modal('hide');

                $('#confirm-Modal').modal('hide');

                _moTaiKuang($('#myModal2'), '提示', 'flag', 'istap' ,str, '');

                $('#myModal2').off('shown.bs.modal').on('shown.bs.modal',function(){

                    conditionSelect(false,true);

                })
            }
    }

    //验收人
    function receiverData(data){
        var prm = {
            userId:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole,
            departNum:data
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDGetYanShouRen',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].userNum +
                        '">' + result[i].userName + '</option>'

                }
                $('#receiver').empty().append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);

            }
        })
    }

    //保修科室
    function bxKShiData(){
        var prm = {
            'departName':'',
            'userID':_userIdNum,
            'userName':_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            timeout:_theTimes,
            success:function(result){
                _allBXArr.length = 0;
                var str = '<option value="">请选择</option>';
                for(var i=0;i<result.length;i++){

                    _allBXArr.push(result[i]);

                    str += '<option value="' + result[i].departNum +
                        '">' + result[i].departName + '</option>>';
                }

                $('#bxkesh').empty().append(str);

                $('#depart').empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //表格初始化
    function tableInit(tableId,col,buttons,flag,fnRowCallback,drawCallback){
        var buttonVisible = [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs'
            }
        ];
        var buttonHidden = [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs hiddenButton'
            }
        ];
        if(buttons == 1){
            buttons = buttonVisible;
        }else{
            buttons =  buttonHidden;
        }
        var _tables = tableId.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": false,   //是否分页
            "destroy": true,//还原初始化了的datatable
            "searching": false,
            "ordering": false,
            "iDisplayLength":50,//默认每页显示的条数
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '',
                'info': '',
                'infoEmpty': '',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                }
            },
            "dom":'t<"F"lip>',
            'buttons':buttons,
            "columns": col,
            "fnRowCallback": fnRowCallback,
            "drawCallback":drawCallback
        });
        if(flag){
            _tables.buttons().container().appendTo($('.excelButton'),_tables.table().container());
        }

    }

    //分类
    function classification(){
        var prm = {
            cateNum:'',
            cateName:'',
            userID:_userIdNum,
            userName:_userIdName,
            b_UserRole:_userRole
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWCK/ywCKGetItemCate',
            data:prm,
            success:function(result){
                var str = '<option value="">请选择</option>'
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].cateNum +
                        '">' + result[i].cateName + '</option>>'
                }
                $('#flmcs').empty().append(str);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //获取故障位置
    function getArea(){
        //获取报修科室
        var departnum = $('#bxkesh').val();
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/SysLocaleGetAll',
            data:{
                "locname": "",
                "departnum": departnum,
                "departname": "",
                "ddname": ""
            },
            success:function(result){

                //return false;
                _datasTable($('#choose-area-table'),result);
            }
        })
    };

    //获取维修事项
    function getMatter(){

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDWxxmGetAll',
            data:{
                "wxnum": ""
            },
            success:function(result){
                //console.log(result);
                //return false;
                _datasTable($('#choose-metter'),result);
            }
        })
    };

    getMatterType();

    //获取项目类别
    function getMatterType(){
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDwxxmClassGetAll',
            data:{
                "wxnum": ""
            },
            success:function(result){
                //return false;
                var html = '<option value=" ">全部</option>'
                $(result).each(function(i,o){
                    html += '<option value="'+o.wxclassnum+'">'+ o.wxclassname+'</option>'
                })
                $('#add-select').html(html);
            }
        })

    }

    //获取工时费
    function manHourFee(data){

        if(data){

            $.ajax({

                type:'post',
                url:_urls + 'YWGD/ywGDWxxmGetAll',
                data:{
                    userID:_userIdNum,
                    userName:_userIdName,
                    b_UserRole:_userRole,
                    wxnum:data
                },
                timeout:_theTimes,
                success:function(result){

                    if(result && result.length>0){

                        $('#hourFee').val(result[0].workfee)

                        $('#total').val(result[0].workfee)

                    }



                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR.responseText);
                }

            })
        }
    }

    //人员
    function workerData1(){
        var prm = {
            userID:_userIdNum,
            userName:_userIdName,
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetUsers',
            data:prm,
            timeout:_theTimes,
            success:function(result){

                _workerArr.length = 0;

                for(var i=0;i<result.length;i++){
                    _workerArr.push(result[i])
                }

                _datasTable($('#choose-people-table'),result);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //部门
    function getDepartment(){

        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:{
                'userID':_userIdNum,
                'userName':_userIdName,
            },
            timeout:_theTimes,
            success:function(result){

                _datasTable($('#choose-department-table'),result);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })

    }

    //获取负责人
    function fzrFun(){
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetWXLeaders',
            data:{
                userID:_userIdNum,
                userName:_userIdName
            },
            success:function(result){
                _fzrArr.length=0;

                for(var i=0;i<result.length;i++){
                    _fzrArr.push(result[i]);
                }

                for(var i=0;i<_fzrArr.length;i++){

                    if(_fzrArr[i].userNum == _userIdNum){

                        _isFZR = true;

                        break
                    }

                }
                if(_isFZR){

                    $('.content-main-contents').eq(2).addClass('hide-block');

                    $('.table-title').children('span').eq(2).show();

                }else{

                    $('.content-main-contents').eq(2).addClass('hide-block');

                    $('.table-title').children('span').eq(2).hide();

                }

                conditionSelect(true,true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //获得维修人
    function servicPerson(){
        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGetWXRens',
            data:{
                departNum:$('#department-select').val(),
                userID:_userIdNum,
                userName:_userIdName,
                b_UserRole:_userRole
            },
            timeout:_theTimes,
            success:function(result){

                _allWorkers.length = 0;

                for(var i=0;i<result.length;i++){

                    _allWorkers.push(result[i]);
                }

                _datasTable($('#choose-worker-table'),result);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
            }
        })
    }

    //添加执行人
    function addWorks(){

        if( _isChange ){

            _zxrIsComplete = true;

        }else{

            if( _exeWorker.length == 0 ){

                _zxrIsComplete = true;

            }else{
                var zxrArr = [];

                for(var i=0;i<_exeWorker.length;i++){
                    var obj = {};
                    obj.wxRen = _exeWorker[i].userNum;
                    obj.wxRName = _exeWorker[i].userName;
                    obj.wxRDh = _exeWorker[i].mobile;
                    obj.gdCode = _gdCode;
                    zxrArr.push(obj);
                }

                var prm = {
                    gdCode : _gdCode,
                    gdWxRs : zxrArr,
                    userID : _userIdNum,
                    userName : _userIdName,
                    gdZht:_gdZht,
                    gdCircle:_gdCircle
                }

                $.ajax({
                    type:'post',
                    url:_urls + 'YWGD/ywGDAddWxR',
                    data:prm,
                    success:function(result){

                        _zxrIsComplete = true;

                        if(result == 99){

                            _zxrIsSuccess = 'true';

                        }else{

                            _zxrIsSuccess = 'false';

                        }

                        isComplete();

                    },
                    error: function (jqXHR, textStatus, errorThrown) {

                        _zxrIsComplete = true;

                        _zxrIsSuccess = 'false';

                        console.log(jqXHR.responseText);
                    }
                })


            }

        }

    }

    //隐藏分页
    $('#choose-metter_length').hide();
    $('#choose-area-table_length').hide();
    $('#choose-equip_length').hide();
    $('#choose-people-table_length').hide();
    $('#choose-department-table_length').hide();
    $('#choose-worker-table_length').hide();

    //记录当前回退工单的状态
    var _thisStateNum = '';

    var _thisState = '';

    //记录当前回退工单的工单号
    var _thisCodeNum = '';

    //记录当前工单维修事项
    var _thisWXSX = '';

    //记录当前工单维修班组
    var _thisWXBZ = '';

    //当前工单重发值
    var _thisCFZ = '';

    //当前负责人数组
    var _fuZeRen = [];

    //当前执行人数组
    var _zhixingRens = [];

    //删除负责人是否成功
    var delFzrIsSuccess = false;

    //删除执行人是否成功
    var delZxrIsSuccess = false;

    //工单回退功能
    $('.table').on('click','.option-callback',function(){

        //样式
        $(this).parents('tbody').find('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //初始化
        $('#Fallback-Modal').find('.modal-body').find('input').val('');

        $('#Fallback-Modal').find('.modal-body').find('textarea').val('');

        //首先判断是是能回退

        _thisStateNum = $(this).parents('tr').find('.gdCode').children().attr('data-zht');

        _thisState = GDDes(_thisStateNum);

        _thisCodeNum = $(this).parents('tr').find('.gdCode').find('a').html();

        _thisWXSX = $(this).parents('tr').children('.WXSX').html();

        _thisWXBZ = $(this).parents('tr').children('.WXBZ').html();

        _thisCFZ = $(this).parents('tr').find('.gdCode').children().attr('data-gdcircle');

        $('#gdCode1').val(_thisCodeNum);

        $('#gdStatus1').val(_thisState);

        $('#gdWxItem1').val(_thisWXSX);

        $('#gdWxClass1').val(_thisWXBZ);

        _moTaiKuang($('#Fallback-Modal'), '您确定要进行回退操作吗？', '', '' ,'', '确定');

        //调详情
        var prm = {
            //工单号
            gdCode:_thisCodeNum,
            //用户id
            userID:_userIdNum,
            //用户名
            userName:_userIdName,
            //所属部门
            b_UserRole:_userBM,
            //重发值
            gdCircle:_thisCFZ,
            //状态
            gdZht:_thisStateNum

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWGD/ywGDGetDetail',
            data:prm,
            success:function(result){

                _fuZeRen = result.gdWxLeaders;

                _zhixingRens = result.wxRens;

            },
            error:function(){

            }

        })

    })

    //回退确定功能
    $('#Fallback-Modal').on('click','.btn-primary',function(){

        var htState = 0;

        if(_thisStateNum == 2){

            htState = 1;//回退工长和状态

        }else if( _thisStateNum == 4 || _thisStateNum == 5 ){

            htState = 2;//回退执行人、状态、材料

        }

        var gdInfo = {

            "gdCode": _thisCodeNum,

            "gdZht": htState,

            "userID": _userIdNum,

            'userName':_userIdName,

            'backReason':$('#returnDes').val()
        }

        $.ajax({
            type:'post',
            url:_urls + 'YWGD/ywGDUptZht',
            data:gdInfo,
            success:function(result){

                if(result == 99){

                    if(htState == 1){
                        //删除该工单负责人
                        if(_fuZeRen.length>0){

                            manager('YWGD/ywGDDelWxLeader','flag');

                        }else{

                            var str = '回退成功！';

                            _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,str, '');

                            $('#Fallback-Modal').modal('hide');

                            $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                                conditionSelect(false,true);

                            })

                        }
                    }else if(htState == 2){
                        //删除该工单的执行人
                        if(_zhixingRens.length>0){

                            Worker('YWGD/ywGDDelWxR','flag');

                        }else{

                            var str = '回退成功！';

                            _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,str, '');

                            $('#Fallback-Modal').modal('hide');

                            $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                                conditionSelect(false,true);

                            })

                        }

                    }

                }else{
                    var str = '退回失败！';

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,str, '');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);

            }
        })

    })

    //工单状态
    function GDDes(data){

        if(data == 1){
            return '待下发'
        }if(data == 2){
            return '待分派'
        }if(data == 3){
            return '待执行'
        }if(data == 4){
            return '执行中'
        }if(data == 5){
            return '等待资源'
        }if(data == 6){
            return '待关单'
        }if(data == 7){
            return '任务关闭'
        }if(data == 999){
            return '任务取消'
        }if(data == 11){
            return '申诉'
        }

    }

    //删除责任人
    function manager(url,flag){
        var fzrArrr = [];
        for(var i=0;i<_fuZeRen.length;i++){
            var obj = {};
            if(flag){
                obj.wxrID = _fuZeRen[i].wxrID;
            }
            obj.wxRen = _fuZeRen[i].wxRen;
            obj.wxRName = _fuZeRen[i].wxRName;
            obj.wxRDh = _fuZeRen[i].wxRDh;
            obj.gdCode = _gdCode;
            fzrArrr.push(obj);
        }
        var gdWR = {
            gdCode:_thisCodeNum,
            gdWxRs:fzrArrr,
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + url,
            data:gdWR,
            async:false,
            success:function(result){

                if(result == 99){

                    delFzrIsSuccess = true;

                }else{

                    delFzrIsSuccess = false;

                }

                if( delFzrIsSuccess ){

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,'回退成功！', '');

                    $('#Fallback-Modal').modal('hide');

                    $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                        conditionSelect(false,true);

                    })

                }else{

                    var str = '工长删除失败,退回成功！';

                    $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                        conditionSelect(false,true);

                    })

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,str, '');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);
            }
        })
    }

    //删除执行人方法
    function Worker(url,flag){
        var workerArr = [];
        for(var i=0; i<_zhixingRens.length;i++){
            var obj = {};
            if(flag){
                obj.wxrID = _zhixingRens[i].wxrID;
            }
            obj.wxRen = _zhixingRens[i].wxRen;
            obj.wxRName = _zhixingRens[i].wxRName;
            obj.wxRDh = _zhixingRens[i].wxRDh;
            obj.gdCode = _gdCode;
            workerArr.push(obj);
        }
        var gdWR = {
            gdCode :_gdCode,
            gdWxRs:workerArr,
            userID:_userIdNum,
            userName:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + url,
            data:gdWR,
            success:function(result){

                if(result == 99){

                    delZxrIsSuccess = true;

                }else{

                    delZxrIsSuccess = false;

                }

                if( delZxrIsSuccess ){

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,'回退成功！', '');

                    $('#Fallback-Modal').modal('hide');

                    $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                        conditionSelect(false,true);

                    })

                }else{

                    var str = '执行人删除失败,退回成功！';

                    $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                        conditionSelect(false,true);

                    })

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,str, '');

                }

            },
            error:function(jqXHR, textStatus, errorThrown){

                console.log(jqXHR.responseText);
            }
        });
    }

    //取消
    $('.table').on('click','.option-cancel',function(){

        //样式
        $(this).parents('tbody').find('tr').removeClass('tables-hover');

        $(this).parents('tr').addClass('tables-hover');

        //初始化
        $('#Cancel-Modal').find('.modal-body').find('input').val('');

        $('#Cancel-Modal').find('.modal-body').find('textarea').val('');

        //首先判断是是能回退

        _thisStateNum = $(this).parents('tr').find('.gdCode').children().attr('data-zht');

        _thisState = GDDes(_thisStateNum);

        _thisCodeNum = $(this).parents('tr').find('.gdCode').find('a').html();

        _thisWXSX = $(this).parents('tr').children('.WXSX').html();

        _thisWXBZ = $(this).parents('tr').children('.WXBZ').html();

        _thisCFZ = $(this).parents('tr').find('.gdCode').children().attr('data-gdcircle');

        $('#gdCode2').val(_thisCodeNum);

        $('#gdStatus2').val(_thisState);

        $('#gdWxItem2').val(_thisWXSX);

        $('#gdWxClass2').val(_thisWXBZ);

        _moTaiKuang($('#Cancel-Modal'), '您确定要进行取消操作吗？', '', '' ,'', '确定');

    })

    //取消确定按钮
    $('#Cancel-Modal').on('click','.btn-primary',function(){

        var gdInfo = {
            //工单号
            "gdCode": _thisCodeNum,

            "userID": _userIdNum,

            'userName':_userIdName,

            "delReason":$('#cancelDes').val()
        }

        $.ajax({
            type:'post',
            url: _urls + 'YWGD/ywGDDel',
            data:gdInfo,
            success:function(result){
                if(result == 99){

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,'工单取消成功！', '');

                    $('#Cancel-Modal').hide();

                    $('#myModal3').off('shown.bs.modal').on('shown.bs.modal',function(){

                        conditionSelect(false,true);

                    })

                }else{

                    _moTaiKuang($('#myModal3'), '提示', 'flag', 'istap' ,'工单取消失败！', '');

                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        })

    })

    //工时费的时候，类别获取
    function feeClass(){

        $.ajax({

            type:'post',

            url:_urls + 'YWGD/ywGDwxxmClassGetAll',

            success:function(result){

                var str = '<option value="">全部</option>';

                for(var i=0;i<result.length;i++){

                    str += '<option value="' + result[i].wxclassname + '">' + result[i].wxclassname +'</option>';

                }

                $('#flmcs1').empty().append(str);

            },

            error:function(XMLHttpRequest, textStatus, errorThrown){



            }

        })

    }

    //条件查询工时费
    function feeConditionSelect(flag){

        var prm = {

            //项目编码
            wxnum:$('#feeBM').val(),
            //项目名称
            wxname:$('#feeMC').val(),
            //项目分类
            wxclassname:$('#flmcs1').val()
        }

        _mainAjaxFun('post','YWGD/ywGDWxxmcostGetAll',prm,function(result){

            if(flag){

                _feeArr.length = 0;

                for(var i=0;i<result.length;i++){

                    _feeArr.push(result[i])

                }

                console.log(result);

            }else{

                _datasTable($('#gsTable'),result);

            }


        })

    }

    //选择查询工时费初始化
    function feeListInit(){

        //项目编码
        $('#feeBM').val('');

        //项目名称
        $('#feeMC').val();

        //项目分类
        $('#flmcs1').val();

        //表格
        _datasTable($('#gsTable'),_feeArr);

    }

    //给工时费添加数量模态框初始化
    function feeNumInit(arr){

        //项目名称
        feeObj.mc = '';
        //项目编码
        feeObj.bm = '';
        //项目类别
        feeObj.lb = '';
        //费用
        feeObj.fee = '';
        //数量
        feeObj.sl = '';

        _datasTable($('#gs-selecting'),arr);

    }

    //工时费接口
    function feeFun(){

        if(_firstFeeArr.length == 0){

            _gsfIsComplete = true;

        }else{

            var prm =   {

                //工单号
                gdCode:_gdCode,
                //工时费
                gdWxxmlist:_firstFeeArr,
                //用户id
                userID:_userIdNum,
                //用户名
                userName:_userIdName,
                //角色
                b_UserRole:_userRole,
                //部门
                b_DepartNum:_userBM

            }

            $.ajax({

                type:'post',

                url:_urls + 'YWGD/ywGDAddWxxm',

                data:prm,

                timeout:_theTimes,

                success:function(result){

                    //console.log(result);

                    _gsfIsComplete = true;

                    if(result == 99){

                        _gsfIsSuccess = 'true';

                    }else{

                        _gsfIsSuccess = 'false';

                    }

                    isComplete();

                },

                error:function(XMLHttpRequest, textStatus, errorThrown){

                    _gsfIsComplete = true;

                    if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                        console.log('超时');

                    }else{

                        console.log('请求失败');

                    }

                }

            })

        }



    }

})