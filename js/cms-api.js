/*---------- API ---------*/
<<<<<<< HEAD
HOST = "http://192.168.20.65:4389";

AGENT_LIST = "/alive/agent";
AGENT_CPU = "/alive/agentcpu";
TAST_PUBLIST = "/task/publish"
=======
HOST = "http://127.0.0.1:4389";

AGENT_LIST = "/alive/agent";
AGENT_CPU = "/alive/agentcpu";
>>>>>>> 982ff581ec38ca17f4ded957586e99cb024040ad

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

function request_post_tast_publish(func) {
    $.post(HOST + TAST_PUBLIST, 
        {
            agent: '187c61e0fa49d079460f4c48becc26b2',
            user: 1,
            type: 2,
            cmd: '',
            cwd: '~/Desktop/proj/',
            async: 1
        }, 
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


