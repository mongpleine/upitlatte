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