function handleResizeHeight(textarea) {
    textarea.style.height = 'auto'; //height 초기화
    textarea.style.height = textarea.scrollHeight + 'px';
}

window.onload = () => {
    const panelFaqContainer = document.querySelectorAll("#collapse_btn_field"); // NodeList 객체

    // panel-faq-answer
    let panelFaqAnswer = document.querySelectorAll(".accordion-class");

    let product_no_field = document.querySelectorAll(".product_no_field");

    let collapse_btn_open = document.querySelectorAll("#collapse_btn_open");
    let collapse_btn_close = document.querySelectorAll("#collapse_btn_close");

    // btn-all-close
    const btnAllClose = document.querySelector("#btn-all-close");

    // 반복문 순회하면서 해당 제목 클릭시 콜백 처리
    for( let i=0; i < panelFaqContainer.length; i++ ) {
        panelFaqContainer[i].addEventListener('click', function() { // 클릭시 처리할 일
            // FAQ 제목 클릭시 -> 본문이 보이게끔 -> active 클래스 추가
            collapse_btn_open[i].classList.toggle('active');
            collapse_btn_close[i].classList.toggle('active');
            panelFaqAnswer[i].classList.toggle('active');
        });
    };
}

function modifyProduct(product_id) {
    let submit_name = `modify_${product_id}`;
    if(confirm("제품 정보를 수정합니다.") === true) {
        document[submit_name].submit();
    }
    else {
        return false;
    }
}

function delProduct(product_id) {
    if(confirm("제품 정보를 삭제할까요?") === true) {
        location.href = `/api/item/del?product_id=${product_id}`;
    }
    else {
        return false;
    }
}
function changeTitle(e) {
    if (e.firstElementChild.getAttribute("title") === "차트 보기") {
        e.firstElementChild.setAttribute("title", "접기")
    }
    else {
        e.firstElementChild.setAttribute("title", "차트 보기")
    }
}

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
        toFixedFix = function (n, prec) {
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
console.log(jsonData);
let lineColors = [
    "rgba(78, 115, 223, 1)",
    "rgba(72, 209, 204, 1)",
    "rgba(255, 215, 0, 1)",
    "rgba(255, 99, 71, 1)",
    "rgba(238, 130, 238)",
]

jsonData.forEach(data => {
    let labels = data.date;
    let ranking = [];
    let dataLimit = data.rankData.length >= 5 ? 5 : data.rankData.length;

    let ranking_ = [];

    for (let i = 0; i < data.rankData.length; i++) {
        let color = lineColors[i];

        let rankArray = [];

        let keyword = "";
        data.rankData[i].forEach(data => {
            keyword = data.keyword;
            rankArray.push(data.rank === '-' ? 100 : data.rank);
        });

        ranking_.push({
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

    data.rankData[0].forEach(rankData => {
        // labels.push(rankData.rank_date);
        ranking.push(rankData.rank === '-' ? 300 : rankData.rank);
    });

    let ctx = document.getElementById("Chart-" + data.product_no);
    let myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: ranking_,
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
                        callback: function (value, index, values) {
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
                display: false
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
                callbacks: {
                    label: function (tooltipItem, chart) {
                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                        return datasetLabel + ': ' + number_format(tooltipItem.yLabel);
                    },
                    labelColor: function (tooltipItem) {
                        return {
                            borderColor: lineColors[tooltipItem.datasetIndex],
                            backgroundColor: lineColors[tooltipItem.datasetIndex]
                        };
                    }
                }
            }
        }
    });
});