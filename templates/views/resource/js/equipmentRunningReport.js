$(function(){

    /*---------------------------------------------------------时间插件--------------------------------------------------*/

    //默认按日初始化
    _timeYMDComponentsFun($('.datatimeblock'));

    //默认时间
    var nowTime = moment().format('YYYY/MM/DD');

    //开始时间
    var et = moment(nowTime).subtract(1,'days').format('YYYY/MM/DD');

    var st = moment(et).subtract(7,'days').format('YYYY/MM/DD');

    $('.min').val(st);

    $('.max').val(et);

    /*-------------------------------------------------------表格初始化---------------------------------------------------*/
    var col = [

        {
            title:'设备名称',
            data:'devName',
            render:function(data, type, full, meta){

                return '<a href="oneEquipmentRunningReport.html?a=' + full.DevNum + '" target="_blank">' + full.devName + '</a>'

            }

        },
        {
            title:'开机率',
            data:'rate'
        },
        {
            title:'开机时长',
            data:'onTime'
        }

    ]

    _tableInit($('#all-reporting'),col,2,false,'','','','',10,'');

    conditionSelect();

    /*------------------------------------------------------按钮事件-----------------------------------------------------*/

    $('#selected').click(function(){

        conditionSelect();

    })

    //导出
    $('.excelButton').click(function(){

        _FFExcel($('#all-reporting')[0]);

    })

    //打印
    $('.dataTables_length').parent().addClass('noprint');

    /*-----------------------------------------------------其他方法------------------------------------------------------*/

    function conditionSelect(){

        //开始时间
        var st = $('.min').val();
        //结束时间
        var et = $('.max').val();

        var prm = {

            'reportID':'102',
            'requesparameters':[

                //开始时间
                {
                    name:'st',

                    value:st
                },
                //结束时间
                {

                    name:'et',

                    value:et

                }
            ]

        }

        _mainAjaxFun('post','YWFZ/GetFroms',prm,successFun);

        function successFun(result){

            if(result != null){

                var dataArr = _packagingTableData(result[1]);

                console.log(dataArr);

                _jumpNow($('#all-reporting'),dataArr);

            }

        }


    }

})