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
<<<<<<< HEAD
}

/**
 * 脚本列表渲染
 */

 function reder_tast(success, message, data) {
    console.log(data.length)
    if(!success) {
        alert(message)
    }
    if (data.length > 0) {
        var str1 = ''
        for(var i = 0,len = data.length;i<len;i++) {
            var str = `<div class="list-user-single">
            <div class="list-name basis-20">
              <p>${data[i]._id}</p>
            </div>
            <div class="list-date basis-20">
              <p>${data[i].updated_time}</p>
            </div>
            <div class="list-text basis-10">
              <p>${data[i].type}</p>
            </div>
            <div class="list-state basis-10">
              <p>${data[i].cmd}</p>
            </div>
            <div class="list-state basis-20">
              <p>${data[i].cwd}</p>
            </div>
            <div class="list-state basis-10">
              <p>${data[i].status}</p>
            </div>
            <div class="list-action basis-10">
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
        $('.tast-list').append(str1)
    }
 }

/**
 * 区分不同类型脚本的填写样式
 */

 $('#script-type').on('change', function() {
    if($(this).val() == 1||2||3) {
        $('.type1, .type2, .type3').removeClass('show');
        $('.type' + $(this).val()).addClass('show');
    }
 })
=======
}
>>>>>>> 982ff581ec38ca17f4ded957586e99cb024040ad
