$(function(){

    /*----------------------------------------------------变量---------------------------------------------*/

    //日历插件
    _dataComponentsFun($('.datatimeblock'));

    //默认时间为半年
    var now = moment().format('YYYY-MM-DD');

    var st = moment(now).startOf('months').format('YYYY-MM-DD');

    $('.min').val(st);

    $('.max').val(now);

    //获取所有部门
    _getProfession('RBAC/rbacGetDeparts',$('#dep'),false,'departNum','departName');
    //_WxBanzuStationData(_BZList($('#dep')));

    //导出
    $('.excelButton11').eq(0).on('click',function(){

        _FFExcel($('#reporting')[0]);

        //_exportExecl($('#reporting'));

    });

    //查询
    $('#selected').click(function(){

        conditionSelect();

    })

    //重置
    $('.resites').click(function(){

        //input清空
        $('.condition-query1').eq(0).find('input').val('');

        //时间初始化
        $('.min').val(st);

        $('.max').val(now);

        //select
        $('#state').val(-1);

    })

    /*---------------------------------------------------表格初始化---------------------------------------*/

    var col = [

        {
            title:'所属部门',
            data:'departName'
        },
        {
            title:'值班编码',
            data:'zbCode'
        },
        {
            title:'值班人',
            data:'watchUserName'
        },
        {
            title:'值班时间',
            data:'watchDate'
        },
        {
            title:'上班时间',
            data:'shangbantime'
        },
        {
            title:'签到时间',
            data:'qiandaotime'
        },
        {
            title:'下班时间',
            data:'xiabantime'
        },
        {
            title:'签退时间',
            data:'qiantuitime'
        },
        {
            title:'班次',
            data:'bcname'
        },
        {
            title:'记迟到时间',
            data:'jcdtime'
        },
        {
            title:'记早退时间',
            data:'jzttime'
        }

    ]

    _tableInit($('#reporting'),col,1,true,'','');

    conditionSelect();
    /*---------------------------------------------------其他方法-----------------------------------------*/

    function conditionSelect(){

        var prm = {

            //部门编号
            departNum:_loginUser.departNum,
            //值班人姓名
            watchUserName:$('.onDutyName').val(),
            //开始时间
            begintime:$('.min').val(),
            //结束时间
            endtime:moment($('.max').val()).add(1,'d').format('YYYY-MM-DD'),
            //状态
            status:$('#state').val()

        }

        $.ajax({

            type:'post',
            url:_urls + 'YWFZ/KQStatistics',
            data:prm,
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
            timeout:_theTimes,
            success:function(result){

                _datasTable($('#reporting'),result);

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                $('#theLoading').modal('hide');

                if (textStatus == 'timeout') {//超时,status还有success,error等值的情况

                    myAlter("超时");

                }else{

                    myAlter("请求失败！");

                }

            }

        })

    }

})