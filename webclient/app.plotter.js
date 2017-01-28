function addAxes(name, visiblity, index) {    ;
    var chart = $('#container').highcharts();
    if (visiblity == "hidden") {
        chart.addAxis({
            id: name,
            title: {
                text: name
            },            
            lineWidth: 1,
            lineColor: '#08F',
            opposite: false
        });
    } else {
        chart.get(name).remove();
    }
}

function SensorPlotter() {
    var t = 0;
    new Highcharts.Chart({
        title: {
            text: '',
            style: {
                display: 'none'
            }
        },
        colors: ['#0072BC', '#BFDAFF', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
        chart: {
            renderTo: 'container',
            type: 'line',
            alignTicks: true,
            animation: false,
            events: {
                load: function () {
                    var series = this.series[0];
                    var series1 = this.series[1];
                    var series2 = this.series[2];
                    setInterval(function () {
                        var shift = series.data.length > 200;
                        var time = t++;
                        //y1 = parseFloat(Math.random());
                        //y2 = parseFloat(Math.random() * 100);
                        y3 = parseFloat(Math.random() * 1000);
                        y1 = parseFloat(data.s1);
                        y2 = parseFloat(data.s2);

                        series.addPoint([time, y1], true, shift);
                        series1.addPoint([time, y2], true, shift);
                        series2.addPoint([time, y3], true, shift);
                    }, 100);
                }
            }
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                states: {
                    hover: {
                        enabled: false
                    }
                },
                animation: true,
                events: {
                    click: function () {
                    },
                    legendItemClick: function (event) {
                        var visibility = this.visible ? 'visible' : 'hidden';
                        addAxes(this.name, visibility, this.index);
                    }
                }
            },
            line: {
                allowPointSelect: false,
                marker: {
                    enabled: false
                }
            }
        },
        tooltip: {
            enabled: false,
            shared: false
        },
        yAxis: {
            title: {
                text: 'Gain'
            },
            lineWidth: 1,
            //lineColor: '#F33'
        },
        legend: {
            enabled: true
        },
        exporting: { enabled: false },
        series: [{
            name: 'Sensor A',
            data: [],
            visible: false,
            tooltip: { valueSuffix: "Sensor A" }
        }, {
            name: 'Sensor B',
            data: [],
            visible: false,
            tooltip: { valueSuffix: "Sensor B" }
        }, {
            name: 'Sensor C',
            data: [],
            visible: false,
            tooltip: { valueSuffix: "Sensor C" }
        }]
    });
}