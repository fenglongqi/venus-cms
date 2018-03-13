/*---------- API ---------*/
HOST = "http://192.168.20.65:4389";

AGENT_LIST = "/alive/agent";
AGENT_CPU = "/alive/agentcpu";
TAST_PUBLIST = "/task/publish"

function request_agent_cpu(token, func) {
    $.get(HOST+AGENT_CPU, {token: token}, function (data) {
        handler_response(data, func)
    }, "json");
}


function request_alive_agent(func) {
    $.get(HOST+AGENT_LIST, function (data) {
        handler_response(data, func)
    }, "json");
}


function request_get_tast_publish(token,func) {
    $.get(HOST + TAST_PUBLIST,
        {token: token},
        function(data) {
            handler_response(data, func)
    }, "json")
}

function request_post_tast_publish(option ,func) {
    $.post(HOST + TAST_PUBLIST, 
        option,
        function(data) {
            handler_response(data, func)
    }, "json")
}


function handler_response(origin_data, func) {
    if (origin_data === null) {
        func(false, "响应数据为空", null)
    }else if(origin_data.code !== 200) {
        func(false, origin_data.message, null)
    }else{
        func(true, "响应成功", origin_data.data)
    }
}


