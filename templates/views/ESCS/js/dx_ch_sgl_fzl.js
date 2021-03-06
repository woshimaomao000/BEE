﻿var dx_ch_sgl_fzl = function () {

    var chart_View_Chiller_SGL_FZL_Main = null;

    var chart_View_Ch_SGL_FZL_Analysis_Main = null;

    window.onresize = function () {
        if (chart_View_Chiller_SGL_FZL_Main) {
            chart_View_Chiller_SGL_FZL_Main.resize();
        }
        if (chart_View_Ch_SGL_FZL_Analysis_Main) {
            chart_View_Ch_SGL_FZL_Analysis_Main.resize();
        }
    };

    var INIT_DX_Ch_SGL_FZL_ANALYSIS_CHARTVIEW = function (chsglm) {
        var br = parseFloat(chsglm.dxChSGLFZLBadRatio).toFixed(2);//告警值
        var wr = parseFloat(chsglm.dxChSGLFZLWellRatio).toFixed(2);//正常值
        var or = parseFloat(100 - br - wr).toFixed(2);//一般值
        var dataAys = [];
        dataAys.push({ value: br, name: '告警(' + br + '%)' });
        dataAys.push({ value: wr, name: '良好(' + wr + '%)' });
        dataAys.push({ value: or, name: '一般(' + or + '%)' });
        chart_View_Ch_SGL_FZL_Analysis_Main = echarts.init(document.getElementById('chart_View_Ch_SGL_FZL_Analysis_Main'));
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
                {
                    name: '统计',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    //data: [
                    //    { value: 20, name: '正常(20%)' },
                    //    { value: 30, name: '一般(30%)' },
                    //    { value: 50, name: '告警(50%)' }
                    //]
                    data: dataAys
                }
            ]
        };
        chart_View_Ch_SGL_FZL_Analysis_Main.setOption(option);
    }

    function getQueryStr(name, ispe) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            var rs = r[2];
            if (ispe) {
                var pe = unescape(rs);
                return pe;
            }
            else {
                return rs;
            }
        }
        return null;
    }

    return {

        init: function () {

            $('#spanDxDT').html(sessionStorage.DxDT);

            var chsgId = getQueryStr("DxChSGLID", true);//单台冷机标记

            var chsgls = JSON.parse(sessionStorage.DxChSGLs);//单台冷机诊断集

            var chsglms = _.where(chsgls, { dxChSGLID: chsgId });//单台冷机诊断结果

            var chsglm = chsglms[0];

            var backUrl = "dx_ch_sgl_index.html?DxChSGLID=" + chsglm.dxChSGLID;

            $('#FZLBackToSGLBtn').attr('href', backUrl)

            $('#spanDxTitle').html(chsglm.dxChSGLNt + '负载率诊断');

            //$('#span_dxchsgl_item_FZL_std').html();//诊断值

            //$('#span_dxchsgl_item_FZL_acv').html();//实际值

            //$('#span_dxchsgl_item_FZL_ofs').html();//偏差值

            if (chsglm.DxChSGLFZLSte === "0")//异常
            {
                //$('#reasugBox').show();
                $('.boxhgt').show();
                $('#spanDxSte').html('异常');
                $('.ellipse').css('background-color', '#ffc000');
            }
            else {
                //$('#reasugBox').hide();
                $('.boxhgt').hide();
                $('#spanDxSte').html('良好');
                $('.ellipse').css('background-color', '#1caf9a');
            }

            INIT_DX_Ch_SGL_FZL_ANALYSIS_CHARTVIEW(chsglm);

            var dxchsglFZLs = JSON.stringify(chsglm.dxChSGLFZLDs);

            var dataXY = JSON.parse(dxchsglFZLs);
            var data = [];
            for (var i = 0; i < dataXY.length; i++) {
                var XY = [];
                XY.push(dataXY[i].x);
                XY.push(dataXY[i].y);
                data.push(XY);
            }

            chart_View_Chiller_SGL_FZL_Main = echarts.init(document.getElementById('chart_View_Chiller_SGL_FZL_Main'));

            option = {
                title: {
                    text: '负载率',
                    textStyle:{

                        fontWeight:'normal',

                        fontSize:16

                    }

                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    axisLabel: {
                        rotate: 15,
                        margin: 20
                    },
                    data: data.map(function (item) {
                        return item[0];
                    })
                },
                yAxis: {
                    splitLine: {
                        show: true
                    }
                },
                visualMap: {
                    top: 10,
                    right: 10,
                    pieces: [{
                        gt: 0,
                        lte: parseFloat(chsglm.dxChSGLFZLBadStd),
                        color: '#ff9933'
                    }, {
                        gt: parseFloat(chsglm.dxChSGLFZLBadStd),
                        lte: parseFloat(chsglm.dxChSGLFZLWellStd),
                        color: '#ffde33'
                    }, {
                        gt: parseFloat(chsglm.dxChSGLFZLWellStd),
                        color: '#096'
                    }],
                    outOfRange: {
                        color: '#999'
                    },

                    orient:"horizontal"
                },
                series: {
                    name: '负载率',
                    type: 'line',
                    data: data.map(function (item) {
                        return item[1];
                    }),
                    markLine: {
                        silent: true,
                        data: [{
                            yAxis: parseFloat(chsglm.dxChSGLFZLBadStd)
                        }, {
                            yAxis: parseFloat(chsglm.dxChSGLFZLWellStd)
                        }]
                    }
                }
            }

            chart_View_Chiller_SGL_FZL_Main.setOption(option);

        }

    }

}();