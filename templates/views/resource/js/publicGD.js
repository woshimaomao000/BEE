/*--------------------------------------------------查看工单报修图片------------------------------------*/

//工单报修图片的数量
var _imgNum = 0;

//备件图片数量
var _imgBJNum = 0;

//详情【查看图片】
$('#viewImage,.viewImage').click(function(){

    var o = $('.showImage').css('display');

    if(o == 'none'){

        if(_imgNum){
            var str = '';
            for(var i=0;i<_imgNum;i++){
                str += '<img class="viewIMG" src="' +
                    _replaceIP(_urlImg,_urls) + '?gdcode=' + _gdCode + '&no=' + i +
                    '">'
            }
            $('.showImage').html('');
            $('.showImage').append(str);
            $('.showImage').show();
        }else{
            $('.showImage').html('没有图片');
            $('.showImage').show();
        }

    }else{

        $('.showImage').hide();

    }

})

//图片放大
$('.showImage').on('click','.viewIMG',function(){

    _moTaiKuang($('#img-Modal'),'工单图片详情',true,'','','');

    var imgSrc = $(this).attr('src');

    $('#img-Modal').find('img').attr('src',imgSrc);

    //模态框位置
    $('#img-Modal').children().css({'marginTop':'30px'});

})

//备件图片放大
$('.bjImg').on('click','.bjImgList',function(){

    _moTaiKuang($('#img-Modal'),'备件图片详情',true,'','','');

    var imgSrc = $(this).attr('src');

    $('#img-Modal').find('img').attr('src',imgSrc);

    //模态框位置
    $('#img-Modal').children().css({'marginTop':'30px'});

})

//配置工单来源
_gdSource();

/*------------------------------------------------------工单来源----------------------------------------*/

//工单来源
function _gdSource(){

    var str = '';

    str = '<option value="1">'+ __names.department +'报修</option><option value="2">现场人员报修</option>';

    $('.gdly').empty().append(str);

}

/*------------------------------------------------------线路配置----------------------------------------*/

if( !__routeShow){

    $('.routeShow').hide();

}else{

    $('.routeShow').show();

}

