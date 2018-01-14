/**
 * Created by admin on 2017/9/7.
 */
$(document).ready(function(){
    //获得用户名
    var _userName = sessionStorage.getItem('realUserName');
    //获取本地url
    var _urls = sessionStorage.getItem("apiUrlPrefixYW");
    getGodownMessage();
    //获取入库单信息
    function getGodownMessage(){
        //从路径中获取入库单号
        var godownNum = window.location.search.split('=')[1];

        if(!godownNum){
            return false;
        }
        console.log(_urls);
        $.ajax({
            type: 'post',
            url: _urls + "YWCK/ywCKGetInStorageDetailFold",
            timeout: theTimes,
            data:{
                "orderNum": godownNum,
                "userID": _userIdName,
                "userName": _userName
            },
            success: function (data) {
                //要插入的html
                var html = '';
                //总价
                var countNum = 0;
                $(data).each(function(i,o){
                    html +=' <tr>' +
                        '     <td>'+ o.itemNum+'</td>' +
                        '     <td>'+ o.itemName+'</td>' +
                        '     <td>'+ o.size+'</td>' +
                        '     <td>'+ o.unitName+'</td>' +
                        '     <td>'+ o.num+'</td>' +
                        '     <td>'+ o.inPrice.toFixed(2)+'</td>' +
                        '     <td>'+ o.amount.toFixed(2)+'</td>'+
                        '     <td class="small-size">'+ o.inMemo+'</td>' +
                        ' </tr>';
                    countNum += o.amount;
                })

                $('.goods-message').after(html);
                $('#entry-datatables .small-count').html(countNum.toFixed(2));
                $('#entry-datatables .big-count').html(smalltoBIG(countNum));
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        });

        $.ajax({
            type: 'post',
            url: _urls + "YWCK/ywCKGetInStorage",
            timeout: theTimes,
            data:{
                "orderNum": godownNum,
                "igStorage":1,
                "userID": _userIdName,
                "userName": _userName
            },
            success: function (data) {
                //console.log(data);
                var inType = data[0].inType;
                var inTypeName = '';
                //获取入库类型
                var prm = {
                    "catType": 1,
                    "userID": _userIdName,
                    "userName": _userName
                };

                $.ajax({
                    type:'post',
                    url:_urls + 'YWCK/ywCKGetInOutCate',
                    data:prm,
                    timeout:theTimes,
                    success:function(result){
                        for(var i=0;i<result.length;i++){
                            if(inType == result[i].catNum){
                                inTypeName = result[i].catName;
                            }
                        }
                        //title
                        $('.top-title').children('span').html(inTypeName);
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR.responseText);
                    }
                })
                //单据号
                $('.document-num b').html(data[0].orderNum2);
                //获取自编号
                $('.self-num b').html(data[0].orderNum);
                //获取制单人
                $('.creat-name b').html(data[0].createUserName);
                //获取审核人
                $('.top-message span b').eq(3).html(data[0].auditUserName);
                //获取制单日期
                $('.top-message span b').eq(4).html(data[0].auditTime.split(' ')[0]);
                //获取备注
                $('.top-message span b').eq(5).html(data[0].remark);
                //获取供货单位
                $('#entry-datatables .unit-name').html(data[0].supName);
                //获取联系人
                $('#entry-datatables .linkman-name').html(data[0].contactName);
            },
            error:function(jqXHR, textStatus, errorThrown){
                console.log(jqXHR.responseText);
            }
        });
    }
});

/** 数字金额大写转换(可以处理整数,小数,负数) */
function smalltoBIG(n)
{
    var fraction = ['角', '分'];
    var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    var unit = [ ['元', '万', '亿'], ['', '拾', '佰', '仟']  ];
    var head = n < 0? '欠': '';
    n = Math.abs(n);

    var s = '';

    for (var i = 0; i < fraction.length; i++)
    {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);

    for (var i = 0; i < unit[0].length && n > 0; i++)
    {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++)
        {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零')  + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}