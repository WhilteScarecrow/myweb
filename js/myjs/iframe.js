$(function(){
})

function changePage(item) {
    // ;
    let href = item.getAttribute("href")
    // console.log(href);
    $("iframe").attr("src", href);
}