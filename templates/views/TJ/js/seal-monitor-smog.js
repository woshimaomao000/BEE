/**
 * Created by admin on 2018/10/21.
 */
/**
 * Created by admin on 2018/10/21.
 */
$(function(){

    //页面绘制极早烟雾报警
    drawSpaceData();

    //点击切换机房
    $('.top-title .userMonitor-name').on('click',function(){

        $('.top-title .userMonitor-name').removeClass('onChoose');

        $(this).addClass('onChoose');
    });

    //流程图上方切换系统图平面图
    $('.switchover').on('click',function(){

        //获取当前id
        var id = $(this).attr('data-id');


        if(id == 1){

            $(this).addClass('switchover1');

            $(this).attr('data-id','2');


        }else{


            $(this).removeClass('switchover1');

            $(this).attr('data-id','1');

        }

    });

    //切换左上角冷站或者空调时
    $('.left-title1 .userMonitor-name').on('click',function(){


        //获取当前流程图ID
        var userMonitorID = $(this).attr('data-monitor');

        sessionStorage.menuArg = '1,' + userMonitorID;

        //获取对应流程图
        userMonitor.init(false,false,1,$('.left-diagram'));

    });



});

//-----------------------------------极早烟雾报警-------------------------------------//


//定义数组长度
var spaceDataLength = 12;

//定义内容
var contentArr = ['通讯状态','故障状态','烟雾状态'];

//页面绘制极早烟雾报警
function drawSpaceData(){

    //定义存放页面中的字符串
    var dataHtml = '';

    for(var i=1; i<spaceDataLength; i++){

        var thisName = 'Y'+i;

        //定义内容字符串
        var contentHtml = '';

        $(contentArr).each(function(k,j){

            var num = Math.random();

            if(num > 0.3){

                contentHtml += '<p>'+j+'</p>';

            }else{

                contentHtml += '<p class="alarm-data">'+j+'</p>';

            }
        });


        dataHtml +=
            '<div class="data-container">' +
                '<h3>'+thisName+' 烟雾探头</h3>' + contentHtml +
            '</div>';


    }

    //页面赋值
    $('.right-navigation .bottom-data-container ').html(dataHtml);

}






