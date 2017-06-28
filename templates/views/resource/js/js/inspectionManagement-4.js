$(function(){
    /*--------------------------------------------全局变量----------------------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    //时间插件
    $('.datatimeblock').datepicker({
        language:  'zh-CN',
        todayBtn: 1,
        todayHighlight: 1,
        format: 'yyyy/mm/dd'
    });
    var showStartTime = moment().format('YYYY/MM/DD');
    var showEndTime = moment().add(7,'d').format('YYYY/MM/DD');
    $('.datatimeblock').eq(0).val(showStartTime);
    $('.datatimeblock').eq(1).val(showEndTime);
    //获取设备类型
    var prm = {
        "dcNum": "",
        "dcName": "",
        "dcPy": "",
        "userID": "mch"
    };
    $.ajax({
        type:'post',
        url:_urls + 'YWDev/ywDMGetDCs',
        data:prm,
        success:function(result){
            var str = '<option value="">全部</option>';
            for(var i=0;i<result.length;i++){
                str += '<option value="' + result[i].dcNum + '">' + result[i].dcName + '</option>'
            }
            $('#sblx').append(str);
        }
    });
    //存放所有数据的列表
    var _allDataArr = [];
    //接单页面vue对象
    var workDone = new Vue({
        el:'#workDone',
        data:{
            sfqy:0,
            rwdh:'',
            rwmc:'',
            sbmc:'',
            sbbm:'',
            zrdwbm:'',
            fzr:'',
            zxr:'',
            zysm:'',
            jhbm:''
        }
    });
    var workDone1 = new Vue({
        el:'#workDone1',
        data:{
            sfqy:0,
            rwdh:'',
            rwmc:'',
            sbmc:'',
            sbbm:'',
            zrdwbm:'',
            fzr:'',
            zxr:'',
            zysm:'',
            jhbm:''
        }
    });
    var tmtable = new Vue({
        el:'#tmtable',
        data:{
            tmbm:'',
            tmmc:'',
            tmckz:'',
            bjgx:'',
            xjjg:'',
            jgjl:'',
            ycms:''
        }
    })
    //设备条目
    var _tiaoMuArr = [];
    var prm = {
        ditName:'',
        dcNum:'',
        userID:_userIdName
    };
    $.ajax({
        type:'post',
        url: _urls + 'YWDevIns/YWDIGetDIItems',
        data:prm,
        async:false,
        success:function(result){
            _tiaoMuArr = [];
            for(var i=0;i<result.length;i++){
                _tiaoMuArr.push(result[i]);
            }
        },
        error:function(jqXHR, textStatus, errorThrown){
            console.log(JSON.parse(jqXHR.responseText).message);
            if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
            }
        }
    });
    //选中的数组
    var _allXJSelect = [];
    //记住填写的巡检结果的index值
    var _index = 0;
    /*-------------------------------------------表格初始化-------------------------------------------*/
    var _tables =  $('.main-contents-table').find('.table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": false,
        "ordering": false,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        "dom":'t<"F"lip>',
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs btn btn-success'
            }
        ],
        "columns": [
            {
                title:'任务单号',
                data:'itkNum',
                className:'bianma'
            },
            {
                title:'任务名称',
                data:'itkName'
            },
            {
                title:'设备名称',
                data:'dName'
            },
            {
                title:'设备编码',
                data:'dNum'
            },
            {
                title:'责任单位部门',
                data:'dipKeshi'
            },
            {
                title:'责任人',
                data:'manager'
            },
            {
                title:'执行人',
                data:'itkRen'
            },
            {
                title:'操作',
                "data": 'status',
                "render":function(data, type, full, meta){
                    if(data == 0){
                        return "<span class='data-option option-see btn default btn-xs green-stripe'>接单</span>"
                    }if(data ==1){
                        return "<span class='data-option option-sees btn default btn-xs green-stripe'>执行中</span>"
                    }if(data ==2){
                        return "<span class='data-option option-sees btn default btn-xs green-stripe'>完成</span>"
                    }
                }
            }
        ]
    });
    //数据为空时，禁止弹框
    $.fn.dataTable.ext.errMode = function(s,h,m){
        console.log('');
    }
    //巡检条目已选结果表格
    var col1=[
        {
            title:'设备类型',
            data:'dcName'
        },
        {
            title:'条目编码',
            data:'ditNum',
            className:'bianma'
        },
        {
            title:'条目名称',
            data:'ditName'
        },
        {
            title:'条目参考值',
            data:'stValue'
        },
        {
            title:'报警关系',
            data:'relation'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-delete btn default btn-xs green-stripe' disabled='disabled'>删除</span>"
        }
    ];
    tableInit($('#personTable1'),col1);
    var col5 = [
        {
            title:'执行人员',
            data:'dipRen'
        },
        {
            title:'工号',
            data:'dipRenNum'
        },
        {
            title:'联系电话',
            data:'dipDh'
        }
    ];
    //添加执行人员表格
    tableInit($('#personTable2'),col5);
    //执行中的条目表格
    var col2 = [
        {
            title:'条目编码',
            data:'ditNum',
            className:'bianma'
        },
        {
            title:'条目名称',
            data:'ditName'
        },
        {
            title:'条目参考值',
            data:'stValue'
        },
        {
            title:'报警关系',
            data:'relation'
        },
        {
            title:'巡检结果',
            className:'tableInputBlock',
            data:'xjjg',
            render:function(data, type, full, meta){
                if(data == 1){
                    return '正常'
                }if(data ==2){
                    return '异常'
                }
            }
        },
        {
            title:'结果记录',
            className:'tableInputBlock',
            data:'jgjl'
        },
        {
            title:'异常故障描述',
            className:'tableInputBlock',
            data:'ycms'
        },
        {
            title:'操作',
            "targets": -1,
            "data": null,
            "defaultContent": "<span class='data-option option-edite btn default btn-xs green-stripe'>编辑</span>"
                /*"<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"*/
        }
    ];
    tableInit($('#personTable1s'),col2);
    //初始数据
    conditionSelect();
    /*-------------------------------------------按钮事件---------------------------------------------*/
    $('#selected').click(function(){
        conditionSelect();
    })
    $('.main-contents-table').find('.table')
        .on('click','.option-see',function(){
            //样式
            var $thisTable = $(this).parents('.main-contents-table').find('.table');
            var $thiss = $(this).parents('tr');
            $thisTable.find('tr').removeClass('tables-hover');
            $thiss.addClass('tables-hover');

            var $thisBM = $(this).parents('tr').children('.bianma').html();
            moTaiKuang($('#myModal'));
            //赋值
            console.log(_allDataArr);
            for(var i=0;i<_allDataArr.length;i++){
                if(_allDataArr[i].itkNum == $thisBM){
                    workDone.sfqy = _allDataArr[i].isActive;
                    workDone.rwdh = _allDataArr[i].itkNum;
                    workDone.rwmc = _allDataArr[i].itkName;
                    workDone.sbmc = _allDataArr[i].dName;
                    workDone.sbbm = _allDataArr[i].dNum;
                    workDone.zrdwbm = _allDataArr[i].dipKeshi;
                    workDone.fzr = _allDataArr[i].manager;
                    workDone.zxr = _allDataArr[i].itkRen;
                    workDone.jhbm = _allDataArr[i].dipNum;
                    $('#jdsj').val(_allDataArr[i].tkRecTime);
                    $('#kssj').val(_allDataArr[i].tkTime);
                    $('#wcsj').val(_allDataArr[i].tkCompTime);
                    $('#beizhu').val(_allDataArr[i].remark);
                }
            }
            //加载表格下属条目和执行人
            var prm = {
                dipNum:workDone.jhbm,
                userID:_userIdName
            }
            $.ajax({
                type:'post',
                url:_urls + 'YWDevIns/YWDIPGetItemAndMembers',
                data:prm,
                success:function(result){
                    //找到存放所有巡检条目的数组，比较
                    _allXJSelect = [];
                    for(var j=0;j<_tiaoMuArr.length;j++){
                        for(var i=0;i<result.dipItems.length;i++){
                            if( result.dipItems[i].ditNum == _tiaoMuArr[j].ditNum ){
                                _allXJSelect.push(_tiaoMuArr[j]);
                            }
                        }
                    }
                    datasTable($('#personTable1'),_allXJSelect);
                    datasTable($('#personTable2'),result.dipMembers);
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(JSON.parse(jqXHR.responseText).message);
                    if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                    }
                }
            });
        })
        .on('click','.option-sees',function(){
            //样式
            var $thisTable = $(this).parents('.main-contents-table').find('.table');
            var $thiss = $(this).parents('tr');
            $thisTable.find('tr').removeClass('tables-hover');
            $thiss.addClass('tables-hover');
            var $thisBM = $(this).parents('tr').children('.bianma').html();
            moTaiKuang($('#myModal1'));
            //赋值
            for(var i=0;i<_allDataArr.length;i++){
                if(_allDataArr[i].itkNum == $thisBM){
                    workDone1.sfqy = _allDataArr[i].isActive;
                    workDone1.rwdh = _allDataArr[i].itkNum;
                    workDone1.rwmc = _allDataArr[i].itkName;
                    workDone1.sbmc = _allDataArr[i].dName;
                    workDone1.sbbm = _allDataArr[i].dNum;
                    workDone1.zrdwbm = _allDataArr[i].dipKeshi;
                    workDone1.fzr = _allDataArr[i].manager;
                    workDone1.zxr = _allDataArr[i].itkRen;
                    workDone1.jhbm = _allDataArr[i].dipNum;
                    $('#jdsjs').val(_allDataArr[i].tkRecTime);
                    $('#kssjs').val(_allDataArr[i].tkTime);
                    $('#wcsjs').val(_allDataArr[i].tkCompTime);
                    $('#beizhus').val(_allDataArr[i].remark);
                }
            };
            var prm = {
                dipNum:workDone1.jhbm,
                userID:_userIdName
            }
            console.log(prm);
            $.ajax({
                type:'post',
                url:_urls + 'YWDevIns/YWDIPGetItemAndMembers',
                data:prm,
                success:function(result){
                    _allXJSelect = [];
                    //找到存放所有巡检条目的数组，比较
                    for(var j=0;j<_tiaoMuArr.length;j++){
                        for(var i=0;i<result.dipItems.length;i++){
                            if( result.dipItems[i].ditNum == _tiaoMuArr[j].ditNum ){
                                var obj = {};
                                obj.id = _tiaoMuArr[j].id;
                                obj.dcName = $.trim(_tiaoMuArr[j].dcName);
                                obj.dcNum = _tiaoMuArr[j].dcNum;
                                obj.desc = _tiaoMuArr[j].desc;
                                obj.ditName = _tiaoMuArr[j].ditName;
                                obj.ditNum = _tiaoMuArr[j].ditNum;
                                obj.relation = _tiaoMuArr[j].relation;
                                obj.remark = _tiaoMuArr[j].remark;
                                obj.stValue = _tiaoMuArr[j].stValue;
                                obj.xjjg = ' ';
                                obj.jgjl = ' ';
                                obj.ycms = ' ';
                                _allXJSelect.push(obj);
                            }
                        }
                    }
                    datasTable($('#personTable1s'),_allXJSelect);
                },
                error:function(jqXHR, textStatus, errorThrown){
                    console.log(JSON.parse(jqXHR.responseText).message);
                    if( JSON.parse(jqXHR.responseText).message == '没有数据' ){
                    }
                }
            });
        })
    $('#personTable1s tbody')
        .on('click','.option-edite',function(){
            //样式
            var $this = $(this).parents('tr');
            $('#personTable1s tbody').children('tr').removeClass('tables-hover');
            $this.addClass('tables-hover');

            _index = $(this).parents('tr').index();
            moTaiKuang($('#myModal3'));
            var $thisBM = $(this).parents('tr').children('.bianma').html();
            for(var i=0;i<_tiaoMuArr.length;i++){
                if( _tiaoMuArr[i].ditNum == $thisBM ){
                    tmtable.tmbm = _tiaoMuArr[i].ditNum;
                    tmtable.tmmc = _tiaoMuArr[i].ditName;
                    tmtable.tmckz = _tiaoMuArr[i].stValue;
                    tmtable.bjgx = _tiaoMuArr[i].relation;
                    tmtable.xjjg = '';
                    tmtable.jgjl = '';
                    tmtable.ycms = '';
                }
            }
        })
    $('#myModal3').on('click','.selectSBMC',function(){
        for(var i=0;i<_allXJSelect.length;i++){
            _allXJSelect[_index].xjjg = tmtable.xjjg;
            _allXJSelect[_index].jgjl = tmtable.jgjl;
            _allXJSelect[_index].ycms = tmtable.ycms;
        }
        $(this).parents('.modal').modal('hide');
        datasTable($('#personTable1s'),_allXJSelect);
    })
    //tab选项卡
    $('.table-title span').click(function(){
        var $this = $(this);
        $this.parent('.table-title').children('span').removeClass('spanhover');
        $this.addClass('spanhover');
        var tabDiv = $(this).parents('.table-title').next().children('div');
        tabDiv.addClass('hide-block');
        tabDiv.eq($(this).index()).removeClass('hide-block');
    });
    //接单
    $('#myModal').on('click','.jiedan',function(){
        var prm = {
            itkNum:workDone.rwdh,
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/ywITKRecTask',
            data:prm,
            success:function(result){
                if(result == 99){
                    moTaiKuang($('#myModal5'));
                    $('#myModal5').find('.modal-body').html('接单成功！');
                    $('#myModal').modal('hide');
                    conditionSelect();
                }
            }
        })
    });
    //执行
    $('#myModal1').on('click','.zhixing',function(){
        var tableRow = [];
        for(var i=0;i<_allXJSelect.length;i++){
            var obj = {};
            obj.id = _allXJSelect[i].id;
            obj.dipNum = workDone1.jhbm;
            obj.itkNum = workDone1.rwdh;
            obj.ditNum = _allXJSelect[i].ditNum;
            obj.res = _allXJSelect[i].xjjg;
            obj.record = _allXJSelect[i].jgjl;
            obj.exception = _allXJSelect[i].ycms;
            tableRow.push(obj);
        }
        var prm = {
            "itkNum": workDone1.rwdh,
            "remark": $('#beizhus').val(),
            "items": tableRow,
            "userID": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/ywITKFinishTask',
            data:prm,
            success:function(result){
                if(result == 99){
                    moTaiKuang($('#myModal5'));
                    $('#myModal5').find('.modal-body').html('执行成功！');
                    $('#myModal1').modal('hide');
                    conditionSelect();
                }
            }
        })
    });
    //弹窗关闭按钮
    $('.confirm').click(function(){
        $(this).parents('.modal').modal('hide');
    })
    /*--------------------------------------------其他方法--------------------------------------------*/
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var realStartTime = showStartTime;
        var realEndTime = moment(showEndTime).add(1,'d').format('YYYY/MM/DD');
        var prm = {
            itkNum:filterInput[0],
            itkName:filterInput[1],
            dcNum:$('#sblx').val(),
            dNum:filterInput[2],
            dName:filterInput[3],
            dipKeshi:filterInput[4],
            manager:filterInput[5],
            ditST:realStartTime,
            ditET:realEndTime,
            isAllData:0,
            userID:_userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'YWDevIns/YWDITGetTasks',
            data:prm,
            success:function(result){
                console.log(result);
                _allDataArr = [];
                var jiedanArr = [];
                var zhixingArr = [];
                for(var i=0;i<result.length;i++){
                    _allDataArr.push(result[i]);
                    if(result[i].status == 0){
                        jiedanArr.push(result[i]);
                    }else if(result[i].status == 1){
                        zhixingArr.push(result[i]);
                    }
                }
                datasTable($('#scrap-datatables'),result);
                datasTable($('#scrap-datatables1'),jiedanArr);
                datasTable($('#scrap-datatables2'),zhixingArr);
            }
        })
    }
    //dataTables表格填数据
    function datasTable(tableId,arr){
        if(arr.length == 0){
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnDraw();
        }else{
            var table = tableId.dataTable();
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }
    //确定新增弹出框的位置
    function moTaiKuang(who){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
    }
    //表格初始化
    function tableInit(tableId,col){
        tableId.DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "paging": true,   //是否分页
            "destroy": true,//还原初始化了的datatable
            "searching": false,
            "ordering": false,
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
                'infoEmpty': '没有数据',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                }
            },
            "dom":'B<"clear">lfrtip',
            'buttons':[
                {
                    extend: 'excelHtml5',
                    text: '导出',
                    className:'saveAs hidding'
                }
            ],

            "columns": col
        })
    }
})