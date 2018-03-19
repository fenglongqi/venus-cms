(function($){
    $.extend({
        format : function(source,args){
            var result = source;
            if(typeof(args) == "object"){
                if(args.length==undefined){
                    for (var key in args) {
                        if(args[key]!=undefined){
                            var reg = new RegExp("({" + key + "})", "g");
                            result = result.replace(reg, args[key]);
                        }
                    }
                }else{
                    for (var i = 0; i < args.length; i++) {
                        if (args[i] != undefined) {
                            var reg = new RegExp("({[" + i + "]})", "g");
                            result = result.replace(reg, args[i]);
                        }
                    }
                }
            }
            return result;
        }
    })
})(jQuery);


function show_current_agents(agent_list) {


    for (var i = agent_list.length - 1; i >= 0; i--) {
        var agent = agent_list[i];
        var li = $("<li><a href=''>" + agent.info.remote_ip + "</a></li>");
        $(".js-agent-list").append(li)

        var agent_text = $.format("<div class=\"col-md-3 col-sm-6\">\n" +
                            "<div class=\"an-panel-main-info-single color-cyan with-shadow wow fadeIn\" id=\"{2}\" data-wow-delay=\".1s\">\n" +
                                "<h2>{1} <span class=\"info-identifier\">{0}</span></h2>\n" +
                                "<i class=\"icon-chart\"></i>\n" +
                            "</div>\n" +
                         "</div>", [agent.info.os + " (" + agent.info.version + ")", agent.info.remote_ip, agent.info.token]);

        $(".an-agent-info-item").append($(agent_text))
        
    }
    

    (function (agent_list) {
        $('.an-panel-main-info-single').on('click', function (e) {
            $('.an-panel-main-info-single').css('background','#70c1b3')
            $(this).css('background','rgb(196, 204, 86)')
            for (var i = agent_list.length - 1; i >= 0; i--) {
                var agent = agent_list[i];
                if (agent.token === $(this).attr("id")) {
                    show_agent_info(agent);
                    return;
                }
            }
        });
    })(agent_list);


}


/*
 * 刷新绘制CPU图表
 * */
function refresh_cpu_status(cpu_status) {

    var time_labels = [];
    var cpu_values = [];

    for (cpu_item in cpu_status) {
        var time = cpu_status[cpu_item].time;
        time_labels.push(time.slice(time.length - 8));

        cpu_values.push(cpu_status[cpu_item].per);
    }

    var data = {
        labels: time_labels,
        datasets: [
            {
                label: "CPU",
                fill: true,
                lineTension: 0.4,
                backgroundColor: "rgba(2,93,131,.3)",
                borderColor: "rgba(2,93,131,1)",
                borderWidth: 2,
                borderCapStyle: 'butt',
                borderJoinStyle: 'bevel',
                pointBorderColor: "rgba(2,93,131,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 2,
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(2,93,131,1)",
                pointHoverBorderColor: "rgba(2,93,131,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 4,
                pointHitRadius: 10,
                data: cpu_values,
                spanGaps: false,
            },

        ]
    }


    var options = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    max: 100,
                    stepSize: 10,
                    fontColor: "#ccc",
                    fontFamily:  '"Montserrat", sans-serif',

                },
                gridLines: {
                    drawTicks: true
                }
            }],
            xAxes:[{
                ticks: {
                    fontColor: "#ccc",
                    fontFamily:  '"Montserrat", sans-serif',
                }
            }]
        },
        legend: {
            display: false,
        }
    }

    var ctx = document.querySelector(".lineChart");

    if (ctx) {
        var myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        });

        document.querySelector('.js-legend').innerHTML = myChart.generateLegend();
    }
}

/*
 * 刷新磁盘监听状态
 * */
function refresh_disk_status(disk_info) {

    disk_used = disk_info.used / 1024.0 / 1024.0;
    disk_free = disk_info.free / 1024.0 / 1024.0;

    var disk_title = "磁盘监控(" + disk_info.per + "%)";
    $(".agent-disk-info-header").html(disk_title);

    // Doughnut chart
    var dataDoughnut = {
        labels: [
            "已用磁盘(" + disk_used.toFixed(2) + " MB)",
            "剩余磁盘(" + disk_free.toFixed(2) + " MB)"
        ],
        datasets: [{
            data: [disk_info.used, disk_info.free],
            backgroundColor: [
                "#f3ffbd",
                "#70c1b3",
            ],
            borderWidth: 0,
        }]
    };


    var optionsDoughnut = {
        legend: {
            display: false,
        },
    }

    var ctxDoughnut = document.querySelector(".doughNut-chart");

    if (ctxDoughnut) {
        var myDoughnutChart = new Chart(ctxDoughnut, {
            type: 'doughnut',
            data: dataDoughnut,
            options: optionsDoughnut
        });

        document.querySelector('.js-legendDoughnut').innerHTML = myDoughnutChart.generateLegend();
    }
}


/*
 *  刷新内存监控状态
 * */
function refresh_memory_status(mem_info) {
    mem_per = mem_info.used / (mem_info.used + mem_info.free);

    var circle = $('.js-circle');
    if (circle.length > 0) {
        circle.circleProgress({
            thickness: 5,
            value: mem_per.toFixed(2),
            size: 150,
            fill: {
                gradient: ['#025d83'],
            },
        })
            .on('circle-animation-progress', function (e, p, v) {
                $(this).children('.value').children('.value-holder').text((v * 100).toFixed() + '%');
            });
    }
}

/**
 * 脚本列表渲染
 */

 function reder_task(success, message, data) {
    if(!success) {
        alert(message)
        return
    }

    if(! Array.isArray(data)){
        data = [data]
    }

    if (data.length > 0) {
        var str = html_content(data) 
        $('.task-list').html('')
        $('.task-list').prepend(str)
    }
 }

 function html_content(data) {
    var str1 = ''
    var statusStr = ['被删除','等待下发','等待执行','正在执行','执行成功','执行失败','任务取消']
    for(var i = 0,len = data.length;i<len;i++) {
        var str = `<div class="list-user-single">
        <div class=" basis-30">
          <p class="task-id">${data[i]._id}</p>
        </div>
        <div class="list-date basis-30">
          <p>${data[i].updated_time}</p>
        </div>
        <div class="list-text basis-10">
          <p>${data[i].type}</p>
        </div>
        <div class="list-state basis-10">
          <p class="task-status">${statusStr[data[i].status]}</p>
        </div>
        <div class="list-action basis-20">
          <div class="btn-group">
            <button type="button" class="an-btn an-btn-icon small dropdown-toggle"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i class="icon-setting"></i>
            </button>
            <div class="dropdown-menu right-align">
              <ul class="an-basic-list">
                <li><a href="#">Mark as read</a></li>
                <li><a href="#">Mark as unread</a></li>
                <li><a href="#">Select</a></li>
              </ul>
            </div>
          </div>
          <button class="an-btn an-btn-icon small muted danger"><i class="icon-trash"></i></button>
        </div>
      </div>`
    str1 += str
    }

    return str1
 }

 function add_task(success, message,data) {
    if(!success) {
        alert(message)
        return
    }
    if(! Array.isArray(data)){
        data = [data]
    }
    if (data.length > 0) {
        var str = html_content(data)
        $('.task-list').prepend(str)
    }
 }

/**
 * 显示和隐藏新增脚本弹窗
 */
$('.add-script').on('click', function() {
    if($('#script-type').val() == 1||2||3 || 4) {
        $('.type1, .type2, .type3, .type4').removeClass('show');
        $('.type' + $('#script-type').val()).addClass('show');
    }
    $('#add-script-alert').show()
  })

  $('.add-script-close').on('click', function () {
    $('#add-script-alert').hide()
  })

/**
 * 区分不同类型脚本的填写样式
 */

 $('#script-type').on('change', function() {
    if($(this).val() == 1||2||3 || 4) {
        $('.type1, .type2, .type3, .type4').removeClass('show');
        $('.type' + $('#script-type').val()).addClass('show');
    }
 })

 /**
  * 新脚本上传
  */

$('#script-submit').on('click', function() {
    var option = {
        agent: $('#add-script-alert').data('token'),
        user: 1,
        type: '',
        cmd: '',
        cwd: '',
        async: 1,
        path: '',
        workspace: '',
        scheme: '',
        remote_url: '',
        branch: ''
    }
    var type = +$('#script-type').val(),
        path = $('#script-path').val(),
        workspace = $('#script-workspace').val(),
        scheme = $('#script-scheme').val(),
        remote_url = $('#script-remote_url').val(),
        branch = $('#script-branch').val(),
        cmd = $('#script-cmd').val(),
        cwd = $('#script-cwd').val(),
        async = $('#script-async').val(),
        cer_id = $('#script-cer-id').val(),
        cer_pass = $('#script-cer-pass').val(),
        agent_pass = $('#script-agent-pass').val();


    console.log(type, cer_id, cer_pass,agent_pass,scheme)
    if( type === 1) {
        if( path && workspace && scheme && cer_id && agent_pass) {
            option.type = 1
            option.path = path
            option.workspace = workspace
            option.scheme = scheme
            option.cer_id = cer_id
            option.cer_pass = cer_pass || ''
            option.agent_pass = agent_pass
            
        } else{
            alert('填写内容不全')
            return false
        }
    } else if(type === 3 && cmd && cwd) {
        if(cmd && cwd) {
            option.type = 3
            option.cmd = cmd
            option.cwd = cwd
        }else {
            alert('cmd或cwd未填写')
            return false
        }
    } else if(type === 4) {
        if(remote_url && branch && workspace && scheme && cer_id && agent_pass) {
            option.type = 1
            option.remote_url = remote_url
            option.branch = branch
            option.workspace = workspace
            option.scheme = scheme
            option.cer_id = cer_id
            option.cer_pass = cer_pass || ''
            option.agent_pass = agent_pass
        }else {
            alert('填写内容不全')
            return false
        }
        
    }
    // console.log(option)
    request_post_task_publish(option, function(success, message, data) {
        add_task(success, message, data)
        $('#add-script-alert').hide()
    })

})

/**
 * 脚本列表刷新
 */

 $('.script-reload').on('click', function() {
    request_get_task_publish($('#add-script-alert').data('token'), reder_task)
 })


 /**
  * 脚本执行结果查询
  */

$('.task-list').on('click','.list-user-single',function() {
    var status = $(this).find('.task-status').text()
    if( status == '执行成功' ||status == '执行失败') {
    request_task_result($(this).find('.task-id').text(), function (success, message, data) {
        if(!success) {
            alert(message)
            return;
        }
        $('.task-result-alert').show()
        $('.task-result-message').text(data)
    })
    }
})

$('.result-alert-close-btn').on('click', function() {
    $('.task-result-alert').hide()
})


/**
 * 添加证书
 */
$('#add-cer').on('click', function() {
    $('.add-cer').show()
  })
  $('.submit-cer').on('click', function() {
      console.log($('#cer-file').get(0).files[0])
      var formData = new FormData();
        formData.append("p12",$('#cer-file').get(0).files[0]);
      request_cer_upload(formData,function(success, msg, data) {
        if(!success) {
            alert(msg)
            $('.add-cer').hide()
            return false
        }
        var data = [data]
        $('#script-cer-id').append('<option value='+data._id+'>'+data.file_name+'</option>')
        alert('添加成功')
        $('.add-cer').hide()
      })
  })