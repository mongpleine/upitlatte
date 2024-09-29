// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function(n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

// Area Chart Example
let jsonData = JSON.parse(document.getElementById("jsonData").value);
let lineColors = [
    "rgba(78, 115, 223, 1)",
    "rgba(72, 209, 204, 1)",
    "rgba(255, 215, 0, 1)",
    "rgba(255, 99, 71, 1)",
    "rgba(238, 130, 238)",
    "rgba(134,134,134,0.24)",
    "rgba(83,124,107,0.59)",
    "rgba(8,234,13,0.95)",
    "rgb(248,240,8)",
    "rgb(255,255,255)",
    "rgba(134,134,134,0.24)",
]

let selectedData;
if (jsonData.selected !== "") {
    selectedData = jsonData.selected
} else {
    selectedData = jsonData.products[0];
}

let labels = selectedData.date;
let ranking = [];

for (let i = 0; i < selectedData.rankData.length; i++) {
    let color = lineColors[i];

    let rankArray = [];

    let keyword = "";
    selectedData.rankData[i].forEach(data => {
        keyword = selectedData.keyword_list[i];
        rankArray.push(data.rank === '-' ? 100 : data.rank);
    });

    ranking.push({
        label: keyword,
        lineTension: 0.3,
        borderColor: color,
        pointRadius: 3,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointHoverRadius: 3,
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: rankArray,
        fill: false,
    });
}

let ctx = document.getElementById("Chart-");
let myLineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: ranking,
    },
    options: {
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 25,
                top: 25,
                bottom: 0
            }
        },
        scales: {
            xAxes: [{
                time: {
                    unit: 'date'
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    maxTicksLimit: 7
                }
            }],
            yAxes: [{
                ticks: {
                    reverse: true,
                    min: 0,
                    max: 100,
                    maxTicksLimit: 5,
                    padding: 10,
                    // Include a dollar sign in the ticks
                    callback: function(value, index, values) {
                        return number_format(value);
                    }
                },
                gridLines: {
                    color: "rgb(234, 236, 244)",
                    zeroLineColor: "rgb(234, 236, 244)",
                    drawBorder: false,
                    borderDash: [2],
                    zeroLineBorderDash: [2]
                }
            }],
        },
        legend: {
            display: true
        },
        tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            intersect: false,
            caretPadding: 10,
            labelColors: lineColors,
            callbacks: {
                label: function(tooltipItem, chart) {
                    var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                    return ` ${datasetLabel}: ${number_format(tooltipItem.yLabel)}`;
                }
            }
        }
    }
});

$('#dateRangePicker').daterangepicker({
    "locale": {
        "format": "YYYY-MM-DD",
        "separator": " ~ ",
        "applyLabel": "확인",
        "cancelLabel": "취소",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
        "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
    },
    "drops": "auto"
}, function (start, end, label) {
    location.href = `/productDetail?product_id=${selectedData.product_id}&startDate=${start.format('YYYY-MM-DD')}&endDate=${end.format(('YYYY-MM-DD'))}`
});

$('select').selectpicker();

function productSelect(product_id) {
    let dateRange = document.getElementById('dateRangePicker').value.split(' ~ ');
    let startDate = dateRange[0];
    let endDate = dateRange[1];
    location.href = `/productDetail?product_id=${product_id}&startDate=${startDate}&endDate=${endDate}`;
}

$('select.selectpicker').on('change', function(){
    let selected = $('select').val();
    let selectedData = ranking.filter(x => selected.includes(x.label));
    myLineChart.data.datasets = selectedData;
    myLineChart.update();
});