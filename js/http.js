var httpRequest = function(method, api, param, async, cType, jType, dType, successCallback, errorCallBack, timeout) {
    method = method || "get"; //默认get方式
    async = async || false; //默认同步
    dType = dType || 'json'; //默认json
    cType = cType == 1 ? 'application/json;charset=utf-8' : 'application/x-www-form-urlencoded';
    param = jType == 1 ? JSON.stringify(param) : param;
    timeout = timeout ? timeout : 20000000;
    $.ajax({
        type: method,
        url: api,
        data: param,
        async: async,
        timeout: timeout,
        dataType: dType,
        contentType: cType,
        success: function(data) {
            if (data.code == "0000" || data.code == "0") {
                successCallback(data);
            } else {
                errorCallBack(data.code, data.message);
            }
        },
        error: function(jqXHR, data) {
            errorCallBack(data.code, data.message);
        }
    });
};