/*---------- API ---------*/
HOST = "http://192.168.20.59:4389";

AGENT_LIST = '/alive/agent'
AGENT_CPU = '/alive/agentcpu'
TASK_PUBLIST = '/task/publish'
TASK_RESULT = '/task/result'
CER_UPLOAD = '/cer/upload'
CER_LIST = '/cer/list'
CONTACT_LIST = '/contact/list'
CONTACT_ADD = '/contact/add'
CONTACT_DELET = '/contact/delete'
CONTACT_EDIT = '/contact/edit'



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


//获取脚本列表
function request_get_task_publish(token,func) {
    $.get(HOST + TASK_PUBLIST,
        {token: token},
        function(data) {
            handler_response(data, func)
    }, "json")
}

//添加脚本
function request_post_task_publish(option ,func) {
    $.post(HOST + TASK_PUBLIST,
        option,
        function(data) {
            handler_response(data, func)
    }, "json")
}

//脚本执行结果
function request_task_result(task_id, func) {
    $.get(HOST + TASK_RESULT,
        {task_id: task_id},
        function(data) {
            handler_response(data, func)
    }, "json")
}

//上传新证书
function request_cer_upload(formData, func) {

    $.ajax({
        type:'POST',
        url:HOST + CER_UPLOAD,
        data:formData,
        processData: false,
        contentType : false,
        dataType: 'json',
        success: function(data) {
            handler_response(data, func)
        }
    })
}

//获取证书列表
function request_cer_list(func) {
    $.get(HOST + CER_LIST,
        function(data) {
            handler_response(data, func)
    }, "json")
}

//获取联系人列表
function request_contact_list(type, func) {
    $.get(HOST + CONTACT_LIST,
        type,
        function(data) {
            handler_response(data, func)
    }, "json")
}

//添加新的联系人
function request_contact_add(option, func) {
    $.post(HOST + CONTACT_ADD,
        option,
        function(data) {
            handler_response(data, func)
    }, "json")
}

//删除联系人
function request_contact_delete (_id,func) {
    $.post(HOST + CONTACT_DELET,
        {_id},
        function(data) {
            handler_response(data, func)
    }, "json")
}
//修改联系人
function retuqst_contact_edit (option, func) {
    $.post(HOST + CONTACT_EDIT,
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


