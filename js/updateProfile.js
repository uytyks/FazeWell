function getCheckIns(){
    return JSON.parse(localStorage.getItem('checkIns')) || [];
}

window.addEventListener("load", function(){
    let checkIns = getCheckIns();
    let feed = document.getElementById("pf");
    for(let i = 0; i < checkIns.length; i++){
        let month = checkIns[i].dateTime.substring(8,10);
        let year = checkIns[i].dateTime.substring(0,4);
        let day = checkIns[i].dateTime.substring(5,7);
        let html = "<div class='post'>"+
        `<h2>${checkIns[i].restaurant}</h2>`+
        `<p>${checkIns[i].order}</p>`+
        "<div class='metadata'>"+
            `Posted on ${month}/${day}/${year} by Me`+
        "</div>"+
    "</div>"
    feed.insertAdjacentHTML("afterbegin", html);
    }
})