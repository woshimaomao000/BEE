$(function(){
    /*-----------------------------------------全局变量------------------------------------------*/
    //获得用户名
    var _userIdName = sessionStorage.getItem('userName');

    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");

    //验证必填项（非空）
    Vue.validator('notempty', function (val) {
        //获取内容的时候先将首尾空格删除掉；
        val=val.replace(/^\s+|\s+$/g,'');
        return /[^.\s]{1,500}$/.test(val)
    });

    //新增用户登记对象
    var user = new Vue({
        el:'#user',
        data:{
            username:'',
            jobnumber:'',
            password:'',
            confirmpassword:'',
            name:'',
            email:'',
            fixedtelephone:'',
            mobilephone:'',
            department:'',
            role:'',
            remarks:'',
            order:''
        }
    });

    //获取部门
    getDepartment();

    //获取角色
    getRole();

    //存放所有员工列表的数组
    var _allPersonalArr = [];
    /*----------------------------------------表格初始化-----------------------------------------*/
    var table = $('#personal-table').DataTable({
        "autoWidth": false,  //用来启用或禁用自动列的宽度计算
        "paging": true,   //是否分页
        "destroy": true,//还原初始化了的datatable
        "searching": true,
        "ordering": false,
        "pagingType":"full_numbers",
        "bStateSave":true,
        'language': {
            'emptyTable': '没有数据',
            'loadingRecords': '加载中...',
            'processing': '查询中...',
            'lengthMenu': '每页 _MENU_ 条',
            'zeroRecords': '没有数据',
            'info': '第_PAGE_页/共_PAGES_页/共 _TOTAL_ 条数据',
            'infoEmpty': '没有数据',
            'paginate':{
                "previous": "上一页",
                "next": "下一页",
                "first":"首页",
                "last":"尾页"
            }
        },
        'buttons': [
            {
                extend: 'excelHtml5',
                text: '导出',
                className:'saveAs'
            }
        ],
        "dom":'t<"F"lip>',
        "columns": [
            {
                title:'用户名',
                data:'userName'
            },
            {
                title:'工号',
                data:'userNum',
                className:'userNum'
            },
            {
                title:'部门',
                data:'departName'
            },
            {
                title:'角色',
                data:'roleName'
            },
            {
                title:'邮箱',
                data:'email'
            },
            {
                title:'手机',
                data:'mobile'
            },
            {
                title:'固定电话',
                data:'mobile'
            },
            {
                title:'备注',
                data:'remark'
            },
            {
                title:'排序',
                data:'sort'
            },
            {
                title:'操作',
                "targets": -1,
                "data": null,
                "defaultContent": "<span class='data-option option-see btn default btn-xs green-stripe'>查看</span>" +
                "<span class='data-option option-edit btn default btn-xs green-stripe'>编辑</span>" +
                "<span class='data-option option-delete btn default btn-xs green-stripe'>删除</span>"

            }
        ]
    });

    table.buttons().container().appendTo($('.excelButton'),table.table().container());

    //数据
    conditionSelect();
    /*----------------------------------------按钮事件-------------------------------------------*/
    //查询按钮
    $('#selected').click(function(){
        conditionSelect();
    })

    //新增按钮
    $('.creatButton').click(function(){
        //添加类名
        $('#myModal').find('.btn-primary').addClass('dengji').removeClass('bianji').removeClass('shanchu');
        //登记模态框出现
        moTaiKuang($('#myModal'),'新增');
        //初始化登记表
        user.username='';
        user.jobnumber='';
        user.password='';
        user.confirmpassword='';
        user.name='';
        user.email='';
        user.fixedtelephone='';
        user.mobilephone='';
        user.department='';
        user.role='';
        user.remarks='';
        user.order= '';
    });

    //操作确定按钮
    $('#myModal')
        //登记确定按钮功能
        .on('click','.dengji',function(){
            //发送请求
            editOrView('RBAC/rbacAddUser','登记成功!','登记失败!');
        })
        //编辑确定按钮功能
        .on('click','bianji',function(){
            //发送请求
            editOrView('RBAC/rbacUptUser','编辑成功!','编辑失败!');
        })
        //删除确定按钮功能
        .on('click','shanchu',function(){
            //发送请求
            editOrView('RBAC/rbacDelUser','删除成功!','删除失败!','false');
        })
    //表格操作
    $('#personal-table tbody')
        //查看详情
        .on('click','.option-see',function(){
            //详情框
            moTaiKuang($('#myModal'),'查看','flag');
            $('#myModal').find('.btn-primary').addClass('bianji').removeClass('dengji').removeClass('shanchu');
            //绑定数据
            bindingData($(this),'flag');
        })
        //编辑
        .on('click','.option-edit',function(){
            //详情框
            moTaiKuang($('#myModal'),'编辑');
            $('#myModal').find('.btn-primary').addClass('bianji').removeClass('dengji').removeClass('shanchu');
            //绑定数据
            bindingData($(this));
        })
        //删除
        .on('click','.option-delete',function(){
            //详情框
            moTaiKuang($('#myModal'),'确定要删除吗？');
            $('#myModal').find('.btn-primary').addClass('shanchu').removeClass('dengji').removeClass(('bianji'));
            //绑定数据
            bindingData($(this),'flag');
        })
    /*---------------------------------------其他方法--------------------------------------------*/
    //模态框自适应
    function moTaiKuang(who,title,flag){
        who.modal({
            show:false,
            backdrop:'static'
        })
        who.modal('show');
        var markHeight = document.documentElement.clientHeight;
        var markBlockHeight = who.find('.modal-dialog').height();
        var markBlockTop = (markHeight - markBlockHeight)/2;
        who.find('.modal-dialog').css({'margin-top':markBlockTop});
        who.find('.modal-title').html(title);
        if(flag){
            who.find('.btn-primary').hide();
        }else{
            who.find('.btn-primary').show();
        }
    };

    //修改提示信息
    function tipInfo(who,title,meg,flag){
        moTaiKuang(who,title,flag);
        who.find('.modal-body').html(meg);
    }

    //获取条件查询
    function conditionSelect(){
        //获取条件
        var filterInput = [];
        var filterInputValue = $('.condition-query').eq(0).find('.input-blocked').children('input');
        for(var i=0;i<filterInputValue.length;i++){
            filterInput.push(filterInputValue.eq(i).val());
        }
        var prm = {
            "userName":filterInput[0],
            "userNum":filterInput[1],
            "departNum":$('#rybm').val(),
            "roleNum":$('#ryjs').val(),
            "userID": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetUsers',
            data:prm,
            success:function(result){
                _allPersonalArr = [];
                for(var i=0;i<result.length;i++){
                    _allPersonalArr.push(result[i]);
                }
                datasTable($('#personal-table'),result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                console.log(info);
            }
        })
    }

    //表格赋值
    function datasTable(tableId,arr){
        var table = tableId.dataTable();
        if(arr.length == 0){
            table.fnClearTable();
            table.fnDraw();
        }else{
            table.fnClearTable();
            table.fnAddData(arr);
            table.fnDraw();
        }
    }

    //编辑、登记方法
    function editOrView(url,successMeg,errorMeg,flag){
        //判断是编辑、登记、还是删除
        var prm = {};
        if(flag){
            prm = {
                "userName": user.username,
                "userNum": user.jobnumber,
                "userID":_userIdName
            };
        }else{
            prm = {
                "userName":user.username,
                "userNum":user.jobnumber,
                "password":user.password='',
                //"":user.name,
                "email":user.email,
                "phone":user.fixedtelephone,
                "mobile":user.mobilephone,
                "departNum":user.department,
                "roleNum":user.role,
                "remark":user.remarks,
                "sort":user.order,
                "userID":_userIdName
            };
        }
        //发送数据
        $.ajax({
            type:'post',
            url:_urls + url,
            data:prm,
            success:function(result){
                if(result == 99){
                    //提示登记成功
                    tipInfo($('#myModal1'),'提示',successMeg,'flag');
                    $('#myModal').modal('hide');
                }else if(result == 3){
                    //提示登记失败
                    tipInfo($('#myModal1'),'提示',errorMeg,'flag');
                }
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                console.log(info);
            }
        })
    }

    //查看、删除绑定数据
    function bindingData(el,flag){
        var thisBM = el.parents('tr').children('.userNum').html();
        //根据工号绑定数据
        for(var i=0;i<_allPersonalArr.length;i++){
            if(_allPersonalArr[i].userNum == thisBM){
                //绑定数据
                user.username = _allPersonalArr[i].userName;
                user.jobnumber = _allPersonalArr[i].userNum;
                user.password = _allPersonalArr[i].password;
                user.confirmpassword = _allPersonalArr[i].password;
                user.email = _allPersonalArr[i].email;
                user.fixedtelephone = _allPersonalArr[i].phone;
                user.mobilephone = _allPersonalArr[i].mobile;
                user.department = _allPersonalArr[i].departNum;
                user.role = _allPersonalArr[i].roleNum;
                user.remarks = _allPersonalArr[i].remark;
                user.order = _allPersonalArr[i].sort;
            }
        }
        //查看不可操作
        var disableArea = $('#user').find('.input-blockeds');
        if(flag){
            disableArea.children('input').attr('disabled',true).addClass('disabled-block');
            disableArea.children('select').attr('disabled',true).addClass('disabled-block');
            disableArea.children('textarea').attr('disabled',true).addClass('disabled-block');
        }else{
            disableArea.children('input').attr('disabled',false).removeClass('disabled-block');
            disableArea.children('select').attr('disabled',false).removeClass('disabled-block');
            disableArea.children('textarea').attr('disabled',false).removeClass('disabled-block');
        }
        //调用查看详情接口
        /*var prm = {

        }
        $.ajax({
            type:'post',
            url:_urls + '',
            data:prm,
            success:function(result){
                //获取数据
                //绑定数据
                user.username='';
                user.jobnumber='';
                user.password='';
                user.confirmpassword='';
                user.name='';
                user.email='';
                user.fixedtelephone='';
                user.mobilephone='';
                user.department='';
                user.role='';
                user.remarks='';
                user.order='';
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                console.log(info);
            }
        })*/
    }

    //获取部门
    function getDepartment(){
        var prm = {
            "departNum": "",
            "departName": "",
            "userID": _userIdName
        }
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetDeparts',
            data:prm,
            success:function(result){
                var str = '<option value="0">全部</option>'
                for(var i=0;i<result.length;i++){
                    str += '<option value="' + result[i].departNum +
                        '">' + result[i].departName + '</option>'
                }
                $('#rybm').append(str);
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                console.log(info);
            }
        })
    }

    //获取角色
    function getRole(){
        var prm = {
            "roleNum": "",
            "roleName": "",
            "userID": _userIdName
        };
        $.ajax({
            type:'post',
            url:_urls + 'RBAC/rbacGetRoles',
            data:prm,
            success:function(result){
                //console.log(result);
            },
            error:function(jqXHR, textStatus, errorThrown){
                var info = JSON.parse(jqXHR.responseText).message;
                console.log(info);
            }
        })
    }
})