$(function(){
	//日期插件
	$('.datetimeStart').html(_ajaxStartTime);
	$('.datetimeEnd').html(_ajaxEndTime);
	//能耗种类
	$('.datetimepickereType').html(_ajaxStartTime +'到'+_ajaxStartTime);

	_energyTypeSel = new ETSelection();
	_energyTypeSel.initOffices($(".energy-types"),undefined,function(){
		getEcTypeWord();
	});
	//读取科室目录
	_objectSel = new ObjectSelection();
	_objectSel.initOffices($("#energyConsumption"),true);
	//搜索框功能
	var objSearch = new ObjectSearch();
	objSearch.initOfficeSearch($("#key"),$(".tipes"),"energyConsumption");
	//日历格式初始化
	_initDate();
	$('#datetimepicker').on('changeDate',function(e){
		dataType();
		_selectTime(_ajaxDataType);
	});
	//页面加载配置信息
	_setEnergyInfo();
	//换内容时，清空时间
	$('.types').change(function(){
		var bbaa = $('.types').find('option:selected').val();
		if(bbaa == '月'){
			_monthDate();
		}else if(bbaa == '年'){
			_yearDate();
		}else{
			_initDate();
		}
		$('.datetimepickereType').empty();
	})
	//点击确定选择的是哪个能耗种类；
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	});
	//用电量折线图
	myChart3 = echarts.init(document.getElementById('rheader-content'));
	// 指定图表的配置项和数据
	option3 = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:[],
			top:'30',
		},
		toolbox: {
			show: true,
			feature: {
				dataZoom: {
					yAxisIndex: 'none'
				},
				dataView: {readOnly: false},
				magicType: {type: ['line', 'bar']},
				restore: {},
				saveAsImage: {}
			}
		},
		xAxis:  {
			type: 'category',
			boundaryGap: false,
			data: []
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}'
			}
		},
		series: []
	};
	getBranchData();
	$('.btn').click(function(){
		myChart3 = echarts.init(document.getElementById('rheader-content'));
		getBranchData();
		getEcTypeWord();
		_setEnergyInfo();
	});
	$('body').mouseover(function(){
		if(myChart3){
			myChart3.resize();
		}
	})
})
window.onresize = function () {
	if(myChart3){
		myChart3.resize();
	}
}

//按日周月年
var _ajaxDataType='日';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	_ajaxDataType=dataType;
}
//选择日期对应的时间
var _ajaxDataType_1='小时';
//获得开始时间
var _ajaxStartTime = moment().subtract(1,'d').format("YYYY-MM-DD");
var _ajaxEndTime = moment().subtract(1,'d').format("YYYY-MM-DD");
var _ajaxStartTime_1 = moment().subtract(1,'d').format("YYYY/MM/DD");
var _ajaxEndTime_1 = moment().format("YYYY/MM/DD");
var _ajaxLastStartTime_1 = moment().subtract(2,'d').format("YYYY/MM/DD");
var _ajaxLastEndTime_1 = moment().subtract(1,'d').format("YYYY/MM/DD");
//设置getECType的初始值(文字，office时用);
var _ajaxEcTypeWord="电";
function getEcTypeWord(){
	_ajaxEcTypeWord=$('.selectedEnergy').children().html();
}
//获得科室数据
 function getBranchData(){
	 var ofs = _objectSel.getSelectedOffices(),officeID = [],officeNames = [];
	 if(ofs){
		 for(var i=0;i<ofs.length;i++){
			 officeID.push(ofs[i].f_OfficeID);
			 officeNames.push(ofs[i].f_OfficeName);
		 }
	 }
	 if(!officeID){ return; }
	 var allBranch=[];
	 var allBranchs=[];
	 var dataX=[];
	 var dataY=[];
	 var dataXx=[];
	 var lastAdds=0;
	 var lastAdd =0;
	 var growthRate=0;
	 for(var i=0;i<officeID.length;i++){
		 var nums = -1;
		 if(officeID.length != 1){
			 $('.L-right').hide();
			 $('.L-left').addClass('col-lg-12');
			 $('.L-left').removeClass('col-lg-8');
		 }else if(officeID.length == 1){
			 $('.L-right').show();
			 $('.L-left').addClass('col-lg-8');
			 $('.L-left').removeClass('col-lg-12');
		 }
		 var selects_ID=officeID[i];
		 var ecParams={
			 'startTime':_ajaxStartTime_1,
			 'endTime':_ajaxEndTime_1,
			 'dateType':_ajaxDataType_1,
			 'officeId':selects_ID,
			 'ecTypeId':_ajaxEcTypeWord
		 }
		 $.ajax({
			 type:'post',
			 url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
			 data:ecParams,
			 async:true,
			 success:function(result){
				 nums ++;
				 allBranch = [];
				 var datas,dataSplits,object;
				 allBranch.push(result);
				 for(var j=0;j<allBranch.length;j++){
					 datas = allBranch[j];
					 for(var z=0;z<datas.length;z++){
						 lastAdd += datas[z].data;
					 }
				 }
				 $('.total-power-consumption-value label').html(parseInt(lastAdd));
				 if(lastAdd != null && lastAdds != null){
					 if(lastAdds != 0){
						 growthRate = (lastAdd - lastAdds) / lastAdds * 100;
						 $('.rights-up-value').html(growthRate.toFixed(1) + '%');
					 }else if(lastAdds == 0){
						 $('.rights-up-value').html('-');
					 }
					 if(growthRate > 0){
						 $('.rights-up').css({
							 'background':'url(./resource/img/up2.png)no-repeat',
							 'background-size':'23px'
						 })
					 }else if(growthRate < 0){
						 $('.rights-up').css({
							 'background':'url(./resource/img/up.png)no-repeat',
							 'background-size':'23px'
						 })
					 }
				 };
				 lengths = allBranch[0];
				 if(lengths.length != null){
					 if(_ajaxDataType == '日'){
						 //x轴数据
						 for(var j=0;j<lengths.length;j++){
							 datas = lengths[j];
							 dataSplits = datas.dataDate.split('T')[1].slice(0,5);
							 if(dataX.indexOf(dataSplits)<0){
								 dataX.push(dataSplits);
							 }
						 }
						 dataX.sort();
						 //遍历出y轴数据
						 object={};
						 object.name=officeNames[nums];
						 object.type='line';
						 object.data=[];
						 for(var j=0;j<lengths.length;j++){
							 for(var z=0;z<dataX.length;z++){
								 if(lengths[j].dataDate.split('T')[1].slice(0,5) == dataX[z]){
									 object.data.push(lengths[j].data);
								 }
							 }
						 }
						 dataY.push(object);
					 }else if( _ajaxDataType == '周'){
						 dataX=['周一','周二','周三','周四','周五','周六','周日'];
						 //x轴数据
						 for(var j=0;j<lengths.length;j++){
							 datas = lengths[j];
							 dataSplits = datas.dataDate.split('T')[0];
							 if(dataXx.indexOf(dataSplits)<0){
								 dataXx.push(dataSplits);
							 }
						 }
						 //y轴数据
						 object = {};
						 object.name=officeNames[nums];
						 object.type = 'line';
						 object.data=[];
						 for(var j=0;j<lengths.length;j++){
							 for(var z=0;z<dataXx.length;z++){
								 if(lengths[j].dataDate.split('T')[0] == dataXx[z]){
									 object.data.push(lengths[j].data);
								 }
							 }
						 }
						 dataY.push(object);
					 }else if( _ajaxDataType == '月'  || _ajaxDataType == '年'){
						 //x轴数据
						 for(var j=0;j<lengths.length;j++){
							 datas = lengths[j];
							 dataSplits = datas.dataDate.split('T')[0];
							 if(dataX.indexOf(dataSplits)<0){
								 dataX.push(dataSplits);
							 }
						 }
						 //y周数据
						 object = {};
						 object.name = officeNames[nums];
						 object.type = 'line';
						 object.data = [];
						 for(var j=0;j<lengths.length;j++){
							 for(var z=0;z<dataX.length;z++){
								 if(lengths[j].dataDate.split('T')[0] == dataX[z]){
									 object.data.push(lengths[j].data);
								 }
							 }
						 }
						 dataY.push(object);
					 }
					 // 使用刚指定的配置项和数据显示图表。
					 option3.xAxis.data = dataX;
					 option3.legend.data = officeNames;
					 option3.series = dataY;
					 myChart3.setOption(option3);
				 }
			 },
			 error: function (xhr, text, err) {
				 console.log(JSON.parse(xhr.responseText).message);
			 }
		 })
	 }
	 //上一阶段的数据
	 for(var i=0;i<officeID.length;i++){
		 var selects_ID=officeID[i];
		 var ecParams={
			 'startTime':_ajaxLastStartTime_1,
			 'endTime':_ajaxLastEndTime_1,
			 'dateType':_ajaxDataType_1,
			 'officeId':selects_ID,
			 'ecTypeId':_ajaxEcTypeWord
		 }
		 $.ajax({
			 type:'post',
			 url:sessionStorage.apiUrlPrefix+'ecDatas/GetECByTypeAndOffice',
			 data:ecParams,
			 async:true,
			 success:function(result){
				 allBranchs.push(result);
				 for(var i=0;i<allBranchs.length;i++){
					 var datas = allBranchs[i];
					 for(var j=0;j<datas.length;j++){
						 lastAdds += datas[j].data;
					 }
				 };
				 $('.compared-with-last-time label').html(parseInt(lastAdds));
				 if(lastAdd != null && lastAdds != null){
					 if(lastAdds != 0){
						 growthRate = (lastAdd - lastAdds) / lastAdds * 100;
						 $('.rights-up-value').html(growthRate.toFixed(1) + '%');
					 }else if(lastAdds == 0){
						 $('.rights-up-value').html('-');
					 }
					 if(growthRate > 0){
						 $('.rights-up').css({
							 'background':'url(./resource/img/up2.png)no-repeat',
							 'background-size':'23px'
						 })
					 }else if(growthRate < 0){
						 $('.rights-up').css({
							 'background':'url(./resource/img/up.png)no-repeat',
							 'background-size':'23px'
						 })
					 }
				 }
			 },
			 error: function (xhr, text, err) {
				 console.log(JSON.parse(xhr.responseText).message);
			 }
		 })
	 }
 }