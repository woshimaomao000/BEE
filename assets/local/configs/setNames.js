/**
 * Created by admin on 2017/12/10.
 */

var __names = {

    //区域
    area:"车务段1",

    //部门
    department:"车站1",

    //车间
    workshop: "车间1",

    //班组
    group:"维修班组1"

};

var __routeShow = true;

//定义需给页面中区域，部门等动态赋值的页面名称
var __pageArr = ['assetManagement-1.html','assetManagement-3.html','assetManagement-5.html','assetManagement-4.html','assetManagement-print.html','assetManagement-print-blue.html','assetManagement-history.html','gdMaintenanceParts.html',
    'productionOrder-1.html','productionOrder-3.html','productionOrder-2.html','productionOrder-7.html','productionOrder-5.html','productionOrder-4.html','productionOrder-8.html','productionOrder-9.html',
    'productionOrder-10.html','productionOrder-11.html','option.html','productionOrder_see.html','reworkTwoStore.html','wbDetails.html','fxDetails.html','reworkMajorStore.html','returnReport.html','reworkReport.html','dispatchCenterReport.html',
    'totalMaterialChange.html','outboundOrder.html','godownEntry.html','TransferOutOrder.html','godownEntry1.html','reportManagement-2.html','inspectionManagement-3.html','warehouseManagement-3.html'
];

function __setNames(){

    //获取当前页面url
    var pageName = window.location.href;

    //定义是否需要重新赋值
    var ifSetName = false;

    //判断需要给页面重新赋值
    $(__pageArr).each(function(i,o){

        //需要重新赋值
        if(pageName.indexOf(o) > -1){

            ifSetName = true;
            //终止循环
            return false;
        }

    });

    //当前页面不需重新赋值 终止函数
    if(ifSetName == false){

        return false;
    }

    //给页面赋值
    //区域
    $('.user-defined-area').html(__names.area);

    //部门
    $('.user-defined-department').html(__names.department);

    //车间
    $('.user-defined-workshop').html(__names.workshop);

    //班组
    $('.user-defined-group').html(__names.group);

}

__setNames();


//定义系统中的配置信息
var __systemConfigArr = [
    //驾驶舱配置信息
    {
        pageName :"驾驶舱",
        pageUrl :"new-nengyuanzonglan/new-index.html",
        //定义驾驶舱中右下角能好排名的配置项
        indexPageRandingObj : {

            btnMessage :[
                {
                    btnId:0,
                    btnName: "项目",
                    isShow:1
                },
                {
                    btnId:1,
                    btnName: "楼宇",
                    isShow:0
                },
                {
                    btnId:2,
                    btnName: "单位",
                    isShow:0
                }
            ]

        }
    },
    //报表管理配置信息
    {
        pageName :"报表管理",
        pageUrl :"new-baobiaoguanli/statementManagement.html",
        //定义报表管理中要展示报表的配置项
        showStatement :[
            {
                statementName:"总能耗报表",
                jumpUrl: "energyCollectStatement.html",
                addClass:'statement-contain',
                isShow:1
            },
            {
                statementName:"区域能耗报表",
                jumpUrl: "areaEnergyDataStatement.html",
                addClass:'statement-contain',
                isShow:1
            },
            {
                statementName:"部门能耗报表",
                jumpUrl: "officeEnergyDataManagement.html",
                addClass:'statement-contain1 statement-contain',
                isShow:1
            },
            {
                statementName:"水电气分科报表",
                jumpUrl: "officePQCCDataManagement.html",
                addClass:'statement-contain',
                isShow:1
            },
            {
                statementName:"变压器能耗报表",
                jumpUrl: "electroDetail.html",
                addClass:'statement-contain',
                isShow:1
            }
        ]
    }
];