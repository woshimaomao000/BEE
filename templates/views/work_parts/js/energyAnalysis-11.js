$(function(){
	var EnItdata=JSON.parse(sessionStorage.getItem('energyItems'));
	//获得分支目录
	getBranches();
	//读目录
	getSessionStoragePointer();
	//分项支路
	//datetimepicker
	$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(_ajaxStartTime+'-'+_ajaxEndTime))
	//时间默认值
	$('#datetimepicker').val(_ajaxStartTime);
	//监测每次的select值，将选项清零
	$('.types').change(function(){
		$('.datetimepickereType').empty();
	})
	//能耗种类
	$('.electricity').click(function(){
		$(this).css({
			"background":"url(./work_parts/img/electricity_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.water').css({
			"background":"url(./work_parts/img/water.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.gas').css({
			"background":"url(./work_parts/img/gas.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	})
	$('.water').click(function(){
		$(this).css({
			"background":"url(./work_parts/img/water_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.electricity').css({
			"background":"url(./work_parts/img/electricity.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.gas').css({
			"background":"url(./work_parts/img/gas.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	})
	$('.gas').click(function(){
		$(this).css({
			"background":"url(./work_parts/img/gas_hover.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.electricity').css({
			"background":"url(./work_parts/img/electricity.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
		$('.water').css({
			"background":"url(./work_parts/img/water.png)no-repeat",
			"background-size":"50px",
			"background-position":"top center"
		})
	})
	//确定能耗种类类型
	//点击确定选择的是哪个能耗种类；
	$('.typee').click(function(){
		$('.typee').removeClass('selectedEnergy')
		$(this).addClass('selectedEnergy');
	})
	//datetimepicker
	timeDisposal();
	$('.btns').click(function(){
		//确定选中的楼宇id
		getPointerId();
		treeObject1()
		getEcType();
		dataType();
		timeDisposal();
		//ajax需要传的参数:能耗类型_ajaxEcType.选择的ID_ajaxPointerId.按日月年_ajaxDataType.日期选择：datetimepickereType.html()
		console.log("能耗类型："+_ajaxEcType);
		console.log("ID："+_ajaxPointerId);
		console.log("选中的分支的id："+_ajaxBranchId);
		console.log("按"+_ajaxDataType);
		console.log("开始时间为："+_ajaxStartA);
		console.log("结束时间为："+_ajaxEndA);
	})
	/*//日历的默认值
	$('#datetimepicker').val(_ajaxStartTime)*/
	//echarts
	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
	option11 = {
		title: {
			text: '未来一周气温变化',
			subtext: '纯属虚构'
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:['最高气温','最低气温']
		},
		xAxis:  {
			type: 'category',
			boundaryGap: false,
			data: [11, 11, 15, 13, 12, 13, 10],
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}'
			}
		},
		series: [
			{
				name:'最高气温',
				type:'line',
				data:[11, 11, 15, 13, 12, 13, 10],
				markPoint: {
					data: [
						{type: 'max', name: '最大值'},
						{type: 'min', name: '最小值'}
					]
				},
				markLine: {
					data: [
						{type: 'average', name: '平均值'}
					]
				}
			},
			{
				name:'最低气温',
				type:'line',
				data:[1, -2, 2, 5, 3, 2, 0],
				markPoint: {
					data: [
						{name: '周最低', value: -2, xAxis: 1, yAxis: -1.5}
					]
				},
				markLine: {
					data: [
						{type: 'average', name: '平均值'},
						[{
							symbol: 'arrow',
							label: {
								normal: {
									formatter: '最大值'
								}
							},
							type: 'max',
							name: '最大值'
						}, {
							symbol: 'circle',
							x: '60%',
							y: '50%'
						}]
					]
				}
			}
		]
	};
	myChart11.setOption(option11);
})
var myChart11;
//让echarts自适应
window.onresize = function () {
	myChart11.resize();
}
//_ajax数据传参  dataType，id，按日月年，时间
//发送请求时的pointerId
var _ajaxPointerId;
var _allPointerId=[0];
//存放选中分支的节点的数组；
var _ajaxBranchId=01;
function treeObject1(){
	var treeObject1=$.fn.zTree.getZTreeObj('energyConsumption');
	var nodes1 = treeObject1.getCheckedNodes(true);
	//console.log(nodes1)
	var select_ID=[];
	for(var i=0;i<nodes1.length;i++){
		select_ID=nodes1[i].id;
	}
	//console.log(select_ID + select_Name)
	_ajaxBranchId=select_ID;
	//console.log(_ajaxBranchId)
}
//新建数组存放楼宇id
function getPointerId(){
	_ajaxPointerId=$("#selectPointer").val();
	//console.log(_ajaxPointerId)
}
//首先将sessionStorage的内容写入html中
function getSessionStoragePointer(){
	var jsonText1=sessionStorage.getItem('pointers');
	var htmlTxet1 = JSON.parse(jsonText1);
	var _allSter1 ='<option value="'+htmlTxet1[0].pointerID+'">'+htmlTxet1[0].pointerName+'</option>';
	for(var i=1;i<htmlTxet1.length;i++){
		_allSter1 +='<option value="'+htmlTxet1[i].pointerID+'">'+htmlTxet1[i].pointerName+'</option>';
	}
	//console.log(_allSter1)
	for(var i=0;i<htmlTxet1.length;i++){
		_allPointerId.push(htmlTxet1[i].pointerID)
	}
	//console.log(_allPointerId)
	$('#selectPointer').append(_allSter1);
}
//选中的能耗种类
var _ajaxEcType=01;
function getEcType(){
	//首先判断哪个含有selectedEnergy类
	/*$('.selectedEnergy').attr('value');
	if($('.selectedEnergy').attr('value')==01){
		$('.header-one').html('电');
	}else if($('.selectedEnergy').attr('value')==211){
		$('.header-one').html('水');
	}else if($('.selectedEnergy').attr('value')==311){
		$('.header-one').html('气');
	}*/
	//console.log($('.selectedEnergy').attr('value'));
	_ajaxEcType=$('.selectedEnergy').attr('value');
	//console.log(_ajaxEcType)
}
//获取dataType
var _ajaxDataType='日';
function dataType(){
	var dataType;
	dataType = $('.types').val();
	//console.log(dataType)
	_ajaxDataType=dataType;
	//console.log(_ajaxDataType);
}
//设置开始和结束初始值
var _ajaxStartTime=moment().format("YYYY-MM-DD");
var _ajaxEndTime=moment().add(1,'d').format("YYYY-MM-DD");
var aaaa=[];  //2016/08/01格式 开始日期
var bbbb=[];  //结束日期
var _ajaxStartA=[];
var _ajaxEndA=[];
//选中时间处理
function timeDisposal(){
	aaaa=[];
	bbbb=[];
	var arr=[];
	var end;
	var inputValue;
	//console.log(_ajaxDataType)
	$('#datetimepicker').on('focus',function(){
		dataType();
		//console.log(_ajaxDataType);
		inputValue = $('#datetimepicker').val();
		for(var i=0;i<arr.length;i++){
			if(arr[i] == inputValue){
				return
			}
		}
		arr.push(inputValue);
		if(_ajaxDataType=="日"){
			inputValue = $('#datetimepicker').val();
			var startDay=moment(inputValue).startOf('day').format("YYYY-MM-DD");
			var endDay=moment(inputValue).add(1,'d').format("YYYY-MM-DD");
			end = startDay+'-'+endDay;
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startDay;
			_ajaxEndTime=endDay;
			if(_ajaxStartTime.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(startDay)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}
			_ajaxDataType_1='小时';
		}else if(_ajaxDataType=="周"){
			var startWeek=moment(inputValue).startOf('week').format("YYYY-MM-DD");
			var endWeek=moment(inputValue).endOf('week').add(1,'d').format("YYYY-MM-DD");
			end =startWeek + "-" +endWeek;
			//通过查找arr，判断目前选的与数组里的是不是重复
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startWeek;
			_ajaxEndTime=endWeek;
			if(_ajaxStartTime.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}
			_ajaxDataType_1='日'
		}else if(_ajaxDataType=="月"){
			var startMonth=moment(inputValue).startOf('month').format("YYYY-MM-DD");
			var endMonth=moment(inputValue).endOf('month').format("YYYY-MM-DD");
			end =startMonth+"-"+endMonth;
			//console.log(end)
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startMonth;
			_ajaxEndTime=endMonth;
			if(_ajaxStartTime.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}
			_ajaxDataType_1='日';
		}else if(_ajaxDataType=="年"){
			var startYear=moment(inputValue).startOf('year').format("YYYY-MM-DD");
			var endYear=moment(inputValue).endOf('year').format("YYYY-MM-DD");
			end = startYear+"-"+endYear;
			var aa = $('.datetimepickereType').text();
			_ajaxStartTime=startYear;
			_ajaxEndTime=endYear;
			if(_ajaxStartTime.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)){
				if(aa.indexOf(end)<0){
					$('.datetimepickereType').append($('<p class="selectTime" title="点击删除选项">').html(end));
				}
			}
			_ajaxDataType_1='月';
		}
		$('.datetimepickereType').delegate('.selectTime','click',function(){
			$(this).remove();
		})
	})
	for(var i=0;i<$('.selectTime').length;i++){
		aaaa.push($('.selectTime').eq(i).html().split('-')[0]+'/'+$('.selectTime').eq(i).html().split('-')[1]+'/'+$('.selectTime').eq(i).html().split('-')[2])
		bbbb.push($('.selectTime').eq(i).html().split('-')[3]+'/'+$('.selectTime').eq(i).html().split('-')[4]+'/'+$('.selectTime').eq(i).html().split('-')[5])
	}
	_ajaxStartA = aaaa;
	_ajaxEndA = bbbb;
	//console.log(_ajaxStartA);
	//console.log(_ajaxEndA)
}
function _ajaxGetPointer(){
	timeDisposal();
	var _allData=[];
	var dataX=[];
	var dataY=[];
	//存放最大/最小值的数组
	var maxArr=[];
	var minArr=[];
	var maxArr_1=0;
	var minArr_1=0;
	var maxTime;
	var minTime;
	var _totalY=0;
	var average=0;
	for(var i=0;i<_ajaxStartA.length;i++){
		startsTimess = _ajaxStartA[i];
		endsTimess=_ajaxEndA[i];
		var ecParams={
			'ecTypeId':_ajaxBranchId,
			'pointerId':_ajaxPointerId,
			'startTime':startsTimess,
			'endTime':endsTimess,
			'dateType':_ajaxDataType_1
		}
		$.ajax({
			type:'post',
			url:'http://211.100.28.180/BEEWebAPI/api/ecDatas/GetECByTypeAndPointer',
			data:ecParams,
			async:false,
			success:function(result){
				//console.log(result);
				_allData.push(result);
			},
			error:function(){
				alert('未获取到数据')
			}
		})
	}
	//console.log(_allData)
	if(_ajaxDataType=="日"){
		for(var i=0;i<_allData.length;i++){
			var datas=_allData[i];
			//console.log(datas);
			for(var j=0;j<datas.length;j++){
				if(dataX.indexOf(datas[j].dataDate.split('T')[1].slice(0,5))<0){
					dataX.push(datas[j].dataDate.split('T')[1].slice(0,5));
				}
			}
		}
		dataX.sort();
		//console.log(dataX);
		//遍历y轴
		for(var i=0;i<_allData.length;i++){
			//循环创建对象
			maxArr=[];
			minArr=[];
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[1].slice(0,5) == dataX[z]){
						object.data.push(datas[j].data);
						maxArr.push(datas[j].data);
						minArr.push(datas[j].data);
					}
				}
				if(z === datas.length){
					object.data.push(0)
				}
			}
			dataY.push(object);
			maxArr_1=maxArr.sort(function compare(a,b){return b-a})[0];
			minArr_1=minArr.sort(function compare(a,b){return a-b})[0];
			//确定最大最小值出现的时间；
			for(var x=0;x<_allData.length;x++){
				var datas=_allData[x];
				for(var j=0;j<datas.length;j++){
					if(maxArr_1==datas[j].data){
						maxTime=datas[j].dataDate.split('T')[1].slice(0,5);
					}
					if(minArr_1==datas[j].data){
						minTime=datas[j].dataDate.split('T')[1].slice(0,5);
					}
				}
			}
			//总能耗
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//console.log(_totalY)
			//平均值
			average=_totalY/object.data.length;
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}else if(_ajaxDataType=="周"){
		dataX=['周日','周一','周二','周三','周四','周五','周六'];
		//console.log(_allData);
		for(var i=0;i<_allData.length;i++){
			maxArr=[];
			minArr=[];
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<datas.length;z++){
				object.data.push(datas[z].data);
				maxArr.push(datas[z].data);
				minArr.push(datas[z].data);
			}
			if(dataX.length === datas.length){
				object.data.push(0);
			}
			dataY.push(object);
			maxArr_1=maxArr.sort(function compare(a,b){return b-a})[0];
			minArr_1=minArr.sort(function compare(a,b){return a-b})[0];
			//确定最大最小值出现的时间；
			for(var x=0;x<_allData.length;x++){
				var datas=_allData[x];
				for(var j=0;j<datas.length;j++){
					if(maxArr_1==datas[j].data){
						maxTime=datas[j].dataDate.split('T')[0];
					}
					if(minArr_1==datas[j].data){
						minTime=datas[j].dataDate.split('T')[0];
					}
				}
			}
			//总能耗
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			//console.log(selectTime);
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
		//console.log(dataY)
	}else if(_ajaxDataType=="月"){
		//console.log(_allData)
		for(var i=0;i<_allData.length;i++){
			var datas=_allData[i];
			for(var j=0;j<datas.length;j++){
				//console.log(datas[j]);
				if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataX.push(datas[j].dataDate.split('T')[0])
				}
				//console.log(dataX);
			}
		}
		for(var i=0;i<_allData.length;i++){
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[0] == dataX[z]){
						object.data.push(datas[j].data);
						maxArr.push(datas[j].data);
						minArr.push(datas[j].data);
					}
				}
				if(z === datas.length){
					object.data.push(0);
				}
			}
			dataY.push(object);
			maxArr_1=maxArr.sort(function compare(a,b){return b-a})[0];
			minArr_1=minArr.sort(function compare(a,b){return a-b})[0];
			//确定最大最小值出现的时间；
			for(var x=0;x<_allData.length;x++){
				var datas=_allData[x];
				for(var j=0;j<datas.length;j++){
					if(maxArr_1==datas[j].data){
						maxTime=datas[j].dataDate.split('T')[0];
					}
					if(minArr_1==datas[j].data){
						minTime=datas[j].dataDate.split('T')[0];
					}
				}
			}
			//总能耗
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;
			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}else if(_ajaxDataType=="年"){
		//console.log(_allData)
		for(var i=0;i<_allData.length;i++){
			var datas = _allData[i];
			for(var j=0;j<datas.length;j++){
				//console.log(datas[j])
				if(dataX.indexOf(datas[j].dataDate.split('T')[0])<0){
					dataX.push(datas[j].dataDate.split('T')[0]);
				}
			}
			//console.log(dataX)
		}
		for(var i=0;i<_allData.length;i++){
			var object={};
			object.name=$('.selectTime').eq(i).html();
			object.type='line';
			object.data=[];
			var datas=_allData[i];
			for(var z=0;z<dataX.length;z++){
				for(var j=0;j<datas.length;j++){
					if(datas[j].dataDate.split('T')[0] == dataX[z]){
						object.data.push(datas[j].data);
						maxArr.push(datas[j].data);
						minArr.push(datas[j].data);
					}
				}
				if(z === datas.length){
					object.data.push(0)
				}
			}
			dataY.push(object);
			maxArr_1=maxArr.sort(function compare(a,b){return b-a})[0];
			minArr_1=minArr.sort(function compare(a,b){return a-b})[0];
			//确定最大最小值出现的时间；
			for(var x=0;x<_allData.length;x++){
				var datas=_allData[x];
				for(var j=0;j<datas.length;j++){
					if(maxArr_1==datas[j].data){
						maxTime=datas[j].dataDate.split('T')[0];
					}
					if(minArr_1==datas[j].data){
						minTime=datas[j].dataDate.split('T')[0];
					}
				}
			}
			//总能耗
			for(var x=0;x<object.data.length;x++){
				_totalY+=object.data[x];
			}
			//平均值
			average=_totalY/object.data.length;

			$('#tbody').append('<tr><td>'+selectTime[i]+'</td><td>'+unitConversion(_totalY)+'</td><td>'+unitConversion(maxArr_1)+'</td><td>'+maxTime+'</td><td>'+unitConversion(minArr_1)+'</td><td>'+minTime+'</td><td>'+unitConversion(average)+'</td></tr>')
		}
	}
	getPointerName();
	//console.log(selectTime)
	myChart11 = echarts.init(document.getElementById('rheader-content-14'));
	option11 = {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data:selectTime
		},
		xAxis:  {
			type: 'category',
			boundaryGap: false,
			data: dataX
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value}'
			}
		},
		series: dataY
	};
	myChart11.setOption(option11);
}
//获取支路用电环比ajax
var ztreeSettings = {
	check: {
		enable: true,
		chkStyle: "radio",
		radioType: "all"
	},
	data: {
		key: {
			title: "title"
		},
		simpleData: {
			enable: true
		}
	},
	view: {
		showIcon: false
	}

};
//存放支路的数组
var branchArr=[];
var zNodes=[];
function getBranches() {
	//var isTreeResult = $("#cbTree")[0].checked;
	var bmParams = {
		"pointerId": "8909180101",
		"serviceType": "100"
	};
	$.ajax(
		{
			url: "http://211.100.28.180/BEEWebAPI/api/Branch/GetAllBranches",
			type: "post",
			data: bmParams,
			success: function (data) {
				//sessionStorage.setItem("key",data);
					for(var i=0;i<data.length;i++){
						branchArr.push(data[i])
					}
				for (var i =0; i<branchArr.length; i++) {
					if (i==0) {
						var isChecked = true;
					}else{
						var isChecked = false;
					}
					zNodes.push({ id:branchArr[i].f_ServiceId, pId:branchArr[i].f_ParentId, name:branchArr[i].f_ServiceName,open:true,checked:isChecked});
					//console.log(branchArr[i].f_ServiceId)
				}
				//console.log(zNodes)
					//console.log(branchArr)
					$.fn.zTree.init($("#energyConsumption"), ztreeSettings, zNodes);  //ul的id
			},
			error: function (xhr, text, err) {
				alert(text);
			}
		}
	);
}