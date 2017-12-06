$(function(){
    var _prm = window.location.search;
    if(_prm == ''){
        //表格初始化
        table = $('#datatables').DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "destroy": true,//还原初始化了的datatable
            "searching": true,
            "ordering": true,
            //"scrollY": 200,
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第_PAGE_页/共_PAGES_页',
                'infoEmpty': '没有数据',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                },
                'search':'搜索'

            },
            "order": [7,'desc'],
            "dom":'B<"clear">lfrtip',
            'buttons': [
                {
                    extend:'csvHtml5',
                    text:'保存csv格式'
                },
                {
                    extend: 'excelHtml5',
                    text: '保存为excel格式'
                },
                {
                    extend: 'pdfHtml5',
                    text: '保存为pdf格式'
                }
            ],
            "columns": [
                {
                    "title":"时间",
                    "orderable": false,
                    "data":"dataDate",
                    "render":function(data,type,row,meta){

                        if(data){
                            return data.split('T')[0] + ' ' + data.split('T')[1];
                        }
                    }
                },
                {
                    "title": "支路",
                    "orderable": false,
                    "class":"cname",
                    "data":"cName"
                },
                {
                    "title": "单位",
                    "orderable": false,
                    "data":"pointerName"
                },
                {
                    "title": "报警类型",
                    "orderable": false,
                    "data":"cDtnName"
                },
                {
                    "title": "报警条件",
                    "orderable": false,
                    "data":"expression"
                },
                {
                    "title": "此时数据",
                    "orderable": false,
                    "data":"data"
                },
                {
                    "title": "单位房间",
                    "orderable": false,
                    "data":"rowDetailsExcDatas"
                },
                {
                    "title": "报警等级",
                    "class":'hidden',
                    "data":"priorityID"
                },
                {
                    "title": "报警等级",
                    "orderable": false,
                    "data":"priority"
                },

                {
                    "title": "阅读选择",
                    "orderable": false,
                    "class":'L-checkbox',
                    "targets": -1,
                    "data": "flag",
                    "render":function(data,type,row,meta){
                        if(data==1){
                            return "<div class='checker'><span class='checked'><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div><span class='yuedu'>已阅读</span>";
                        }else{
                            return "<div class='checker'><span><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div><span class='yuedu'>未阅读</span>";
                        }
                    }
                },
                {
                    "title":'id',
                    "class":"alaLogID alaLogIDs",
                    "orderable": false,
                    "data":"alaLogID",
                    "visible":false,
                    "render":function(data,type,row,meta){

                        return '<span data-pointerID="' + row.pointerID +
                            '"data-cdataID = "' + row.cdataID +
                            '"  +>' + data +
                            '</span>'

                    }
                },
                {
                    "class":"alaLogID pointerID",
                    "orderable": false,
                    "data":"pointerID",
                    "visible":"false"
                },
                {
                    "title": "查看",
                    "orderable": false,
                    "class":'L-button',
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button class='btn btn-success details-control' data-alaLogID=''>显示/隐藏历史</button>"
                },
                {
                    "title": "处理备注",
                    "orderable": false,
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button class='btn btn-success clickButtons' data-toggle='modal' data-target='#myModal'>点击处理</button>"
                }
            ]
        });
    }else{
        //表格初始化
        table = $('#datatables').DataTable({
            "autoWidth": false,  //用来启用或禁用自动列的宽度计算
            "destroy": true,//还原初始化了的datatable
            "searching": false,
            "ordering": true,
            "paging":true,
            'language': {
                'emptyTable': '没有数据',
                'loadingRecords': '加载中...',
                'processing': '查询中...',
                'lengthMenu': '每页 _MENU_ 条',
                'zeroRecords': '没有数据',
                'info': '第_PAGE_页/共_PAGES_页',
                'infoEmpty': '没有数据',
                'paginate':{
                    "previous": "上一页",
                    "next": "下一页",
                    "first":"首页",
                    "last":"尾页"
                },
                'search':'搜索'

            },
            "order": [7,'desc'],
            "dom":'B<"clear">lfrtip',
            'buttons': [
                {
                    extend:'csvHtml5',
                    text:'保存csv格式',
                    className:'hiddenButton'
                },
                {
                    extend: 'excelHtml5',
                    text: '保存为excel格式',
                    className:'hiddenButton'
                },
                {
                    extend: 'pdfHtml5',
                    text: '保存为pdf格式',
                    className:'hiddenButton'
                }
            ],
            "columns": [
                {
                    "title":"时间",
                    "orderable": false,
                    "data":"dataDate",
                    "render":function(data,type,row,meta){

                        if(data){
                            return data.split('T')[0] + ' ' + data.split('T')[1];
                        }
                    }
                },
                {
                    "title": "支路",
                    "orderable": false,
                    "class":"cname",
                    "data":"cName"
                },
                {
                    "title": "单位",
                    "orderable": false,
                    "data":"pointerName"
                },
                {
                    "title": "报警类型",
                    "orderable": false,
                    "data":"cDtnName"
                },
                {
                    "title": "报警条件",
                    "orderable": false,
                    "data":"expression"
                },
                {
                    "title": "此时数据",
                    "orderable": false,
                    "data":"data"
                },
                {
                    "title": "单位房间",
                    "orderable": false,
                    "data":"rowDetailsExcDatas"
                },
                {
                    "title": "报警等级",
                    "class":'hidden',
                    "data":"priorityID"
                },
                {
                    "title": "报警等级",
                    "orderable": false,
                    "data":"priority"
                },

                {
                    "title": "阅读选择",
                    "orderable": false,
                    "class":'L-checkbox',
                    "targets": -1,
                    "data": "flag",
                    "render":function(data,type,row,meta){
                        if(data==1){
                            return "<div class='checker'><span class='checked'><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div><span class='yuedu'>已阅读</span>";
                        }else{
                            return "<div class='checker'><span><input data-alaLogID='" + row.alaLogID + "' class='choice' type='checkbox'></span></div><span class='yuedu'>未阅读</span>";
                        }
                    }
                },
                {
                    "title":'id',
                    "class":"alaLogID alaLogIDs",
                    "orderable": false,
                    "data":"alaLogID",
                    "visible":false,
                    "render":function(data,type,row,meta){

                        return '<span data-pointerID="' + row.pointerID +
                            '"data-cdataID = "' + row.cdataID +
                            '"  +>' + data +
                            '</span>'

                    }
                },
                {
                    "class":"alaLogID pointerID",
                    "orderable": false,
                    "data":"pointerID",
                    "visible":"false"
                },
                {
                    "title": "查看",
                    "orderable": false,
                    "class":'L-button',
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button class='btn btn-success details-control' data-alaLogID=''>显示/隐藏历史</button>"
                },
                {
                    "title": "处理备注",
                    "orderable": false,
                    "targets": -1,
                    "data": null,
                    "defaultContent": "<button class='btn btn-success clickButtons' data-toggle='modal' data-target='#myModal'>点击处理</button>"
                }
            ]
        });

        $('.hiddenButton').hide();
        $('#datatables_length').hide();
    }

    //显示时间；
    $('.real-time').html(showStartRealTime + '到' + showStartRealTime);
    //指定楼宇为全部；
    getPointerID();


    //获取历史警报
    alarmHistory();
    //setData();
    $('#datatables tbody').on( 'click', 'input', function () {
        var $this = $(this);
        if($(this).parents('.checker').children('.checked').length == 0){
            $(this).parent($('span')).addClass('checked');
        }else{
            $(this).parent($('span')).removeClass('checked');
        }
    } );
    $('.logoToRead').click(function(){
        logoToRead();
    });
    $('#datatables tbody').on('click', 'td .details-control', function () {
        var $this = $(this);
        var cnames = $this.parents('tr').children('.cname').html();
        var pointerIDs = $this.parents('tr').children('.pointerID').html();
        var historyArr = [];

        for(var i=0;i<totalArr.length;i++){
            if(totalArr[i].cName == cnames && totalArr[i].pointerID == pointerIDs){
                historyArr.push(totalArr[i]);
            }
        }
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
        }
    } );

    $('#datatables').on('click','.clickButtons',function(){

        var $this = $(this);

        //遍历所有数据，通过pointerID和cdataID来确定数组

        var pointerID = $this.parents('tr').children('.alaLogIDs').children().attr('data-pointerid');

        var cdataID = $this.parents('tr').children('.alaLogIDs').children().attr('data-cdataid');

        _alaLogId = $this.parents('tr').children('.alaLogIDs').children().html();

        _currentStr = '';

        _currentArr = [];

        for(var i=0;i<_history.length;i++){

            if(_history[i].pointerID == pointerID && _history[i].cdataID == cdataID){

                _currentArr.push(_history[i].alaLogID);

            }

        }

        for(var i=0;i<_currentArr.length;i++){

            if(i == _currentArr.length-1){

                _currentStr += _currentArr[i];

            }else{

                _currentStr += _currentArr[i] + ',';

            }

        }

    })


    //获得备注内容
    $('#myModal').on('click','.submitNote',function(){

        _texts = $(this).parents('.modal-content').children('.modal-body').children().val();

        processingNote();

    });
});
//指定能耗种类的类型为全部；
var _ajaxEcType = " ";
//指定全部报警类型为全部；
var excTypeInnderId = " ";
var pointerID = [];
function getPointerID(){
    var getPointers = JSON.parse(sessionStorage.getItem('pointers'));
    if(getPointers){
        for(var i=0;i<getPointers.length;i++){
            pointerID.push(getPointers[i].pointerID)
        }
    }
}
//实时数据（开始）；
var startRealTime = moment().format('YYYY/MM/DD') + " 00:00:00";
var endRealTime = moment().add(1,'d').format('YYYY/MM/DD') + " 00:00:00";
var showStartRealTime = moment().format('YYYY-MM-DD');
//获取历史数据
var dataArr = [];
var totalArr = [];
//获取所有数据
var _history = [];
function alarmHistory(){
    var prm = {
        'st' : startRealTime,
        'et' : endRealTime,
        'pointerIds' : pointerID,
        'excTypeInnderId' : excTypeInnderId,
        'energyType' : _ajaxEcType,
    };
    $.ajax({
        type:'post',
        url:sessionStorage.apiUrlPrefix + 'Alarm/GetAllExcData',
        data:prm,
        beforeSend: function () {
            $('#theLoading').modal('show');
        },

        complete: function () {
            $('#theLoading').modal('hide');
        },
        success:function(result){
            _history.length = 0;

            var dataArr = [];
            var pcids = [];
            var showArr = [];

            for(var i=0;i<result.length;i++){

                _history.push(result[i]);

            }

            $(result).each(function(i,o){
                if(o.flag == 2 || o.flag == 0){
                    showArr.push(o)
                }
            });
            for(var i=0;i<showArr.length;i++){

                totalArr.push(showArr[i]);

                if(!existItem(pcids,showArr[i])){  //没有存在相同的pointerID&&cdataID；确保pcids数组中所有pointerID和csataID不同
                    pcids.push({"pointerID":showArr[i].pointerID,"cdataID":showArr[i].cdataID});
                }
            }
            for(var i= 0,len=pcids.length,lenD=showArr.length;i<len;i++){ //推荐写法
                for(var j= 0;j<lenD;j++){ //遍历pcids里的pointerID和cdataID属性
                    if(pcids[i].pointerID==showArr[j].pointerID && pcids[i].cdataID== showArr[j].cdataID){
                        dataArr.push(showArr[j]);  //因为后台返回的数据是降序，所以只要有一个就push到dataArr中
                        break;  //跳处循环；
                    }
                }
            }
            datasTable($("#datatables"),dataArr);
            //console.log(dataArr);
        }
    });
}
//去重
function existItem(arr,item){ //遍历数组中的所有数，如果有相同的pointerID&&cdataID，返回true，如果没有的话返回false；
    for(var i= 0,len=arr.length;i<len;i++){
        if(arr[i].pointerID==item.pointerID && arr[i].cdataID==item.cdataID){
            return true;
        }
    }
    return false;
}
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
//标识阅读功能
var logoToReadID = [];
function logoToRead (){
    logoToReadID = [];
    var pitchOn = $('.choice').parent('.checked'); //包含结果的数组的object
    for(var i=0;i<$('.choice').length;i++){
        //if($('.choice').eq(i).parent('.checked'))
        if($('.choice').eq(i).parent('.checked').length != 0){
            logoToReadID.push($('.choice').eq(i).parent('.checked').parents('tr').children('.alaLogID').html())
        }
    }
    var alaLogIDs = {
        '':logoToReadID
    }
    $.ajax(
        {
            'type':'post',
            'url':sessionStorage.apiUrlPrefix + 'Alarm/UpdateAlarmReaded',
            'async':false,
            'data':alaLogIDs,
            'success':function(result){

            }
        }
    )
}
//显示隐藏
function format ( d ) {

    var theader = '<table class="table">' +
        '<thead><tr><td>时间</td><td>支路</td><td>单位</td><td>报警类型</td><td>报警条件</td><td>此时数据</td><td>单位房间</td><td>报警等级</td></tr></thead>';
    var theaders = '</table>';
    var tbodyer = '<tbody>'
    var tbodyers = '</tbody>';
    var str = '<tr><td>' + d[1].dataDate.split('T')[0] + ' ' + d[1].dataDate.split('T')[1] +
        '</td><td>' + d[1].cName +
        '</td><td>' + d[1].pointerName +
        '</td><td>' + d[1].cDtnName +
        '</td><td>' + d[1].expression +
        '</td><td>' + d[1].data +
        '</td><td>' + d[1].sysLogID +
        '</td><td>' + d[1].priority +
        '</td></tr>';
    for(var i=2;i< d.length;i++){
        var atime = d[i].dataDate.split('T')[0] + ' ' + d[i].dataDate.split('T')[1];
        str += '<tr><td>' + atime +
            '</td><td>' + d[i].cName +
            '</td><td>' + d[i].pointerName +
            '</td><td>' + d[i].cDtnName +
            '</td><td>' + d[i].expression +
            '</td><td>' + d[i].data +
            '</td><td>' + d[i].sysLogID +
            '</td><td>' + d[i].priority +
            '</td></tr>'
    }
    return theader + tbodyer + str + tbodyers + theaders;
}
//userId msgTime alaLogId alaMessage
//用户名  当前时间（获取） alaLogId  input.val()
var userId,_alaLogId,_texts,_currentArr = [],_currentStr='';
var nowDays = moment().format('YYYY/MM/DD') + ' 00:00:00';
function processingNote (){
    //获取当前用户名
    var prm = {
        'userId':_userIdNum,
        'msgTime':nowDays,
        'alaLogId':_currentStr,
        'alaMessage':_texts
    };

    $.ajax(
        {
            'type':'post',
            'url':sessionStorage.apiUrlPrefix + 'Alarm/SetAlarmMessage',
            'async':false,
            'data':prm,
            success:function(result){
                if(result == true){

                    _moTaiKuang($('#myModal2'),'提示','false','istap','操作成功!','');

                    $("#myModal").modal('hide');

                    $('.choice[data-alaLogID="' + _alaLogId  + '"]').parent().addClass('checked');

                    $('.choice[data-alaLogID="' + _alaLogId  + '"]').parents('.L-checkbox').children('.yuedu').html('已阅读');


                }else{

                    _moTaiKuang($('#myModal2'),'提示','false','istap','操作失败!','');

                }


            }
        }
    )
}