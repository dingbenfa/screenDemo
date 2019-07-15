
//var ipPort="61.160.64.132:8280";
//var ipPort = window.ganzhi.getApiHostPort();
//var apibaseUrl = 'http://'+ipPort+'/cy-boss/';

var apibaseUrl = '/cy-boss/';



$.ajaxSetup({timeout:20000});



var globalVars = {unloaded:false};
try {
    $(window).bind('beforeunload', function(){
        globalVars.unloaded = true;
    });
} catch (error) {
}

function buildUrlParam(data, url) {
    var urlParam = "";
    if (data) {
        for (var key in data) {
            if (urlParam) {
                urlParam += "&";
            } else {
                urlParam += "?";
            }
            urlParam = urlParam + key + "=";
            if (data[key]) {
                urlParam += encodeURI(data[key]);
            }
        }
    }
    return url ? url + urlParam : urlParam;
}




function apiCall(method,url,postData,errorCallBack,successCallBack, async){

    console.log("apiCall:"+JSON.stringify(postData));
    $.ajax({
        type:method,
        url:url,
        async: async !== false,
        dataType:'json',
        contentType: "application/json;charset=utf-8",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        data:JSON.stringify(postData),
        success:function(data){//数据提交成功时返回数据

            console.log("retData:"+JSON.stringify(data));
            if(data.success){
                successCallBack(data);
            }else{

                if(data.code == 403){
                    window.location.href="/cy-boss/assetoperator/page/login/login.html"
                }


                if(errorCallBack == null){
                   alert(data.message);
                }else{
                    //alert(data.message);
                    errorCallBack(data.message);
                }
            }
        },
        error:function(event,xhr,options,exc){
            console.log("apiCall ERROR:"+event.status);
            if (globalVars.unloaded)
                return;

            var msg = '网络错误请重试'
            if(errorCallBack == null){
                //alert(msg);
            }else{
                errorCallBack(msg);
            }
        }
    });
}


//企业信息
function apiGetEnterpriseInfo(enterpriseId,onSuccess,onError){
    var url = apibaseUrl + "back/assetEnterprise/assetEnterprise/getEnterpriseInfoForSuZhouLargeScreen.json?enterprise="+enterpriseId;
    apiCall('get',url,null,onError,onSuccess);
}

//设备运行
function apiGetMachineInfo(enterpriseId,onSuccess,onError){
    var url = apibaseUrl + "front/quickAssetDigitize/assetMachine/getMachineInfoForSuZhouLargeScreen.json?enterprise="+enterpriseId;
    apiCall('get',url,null,onError,onSuccess);
}

//企业用电
function apiGetElectricInfo(enterpriseId,onSuccess,onError){
    var url = apibaseUrl + "back/assetDataConverter/assetDataConverter/getElectricInfoForSuZhouLargeScreen.json?enterprise="+enterpriseId;
    apiCall('get',url,null,onError,onSuccess);
}

//生产状况
function apiGetDeviceSummaryInfo(enterpriseId,onSuccess,onError){
    var url = apibaseUrl + "back/assetDataConverter/assetDataConverter/getDataConverterNearlySevenDaysDetail.json?enterprise="+enterpriseId;
    apiCall('get',url,null,onError,onSuccess);
}
