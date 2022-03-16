
const dataEls = document.getElementsByClassName("dataValOne");

const dataVals = Array.from(dataEls, el => {
    return parseFloat(el.textContent.split(" ")[el.textContent.split(" ").length - 1]);
});

//console.log(dataEls);
//console.log(dataVals);

document.querySelector("#dataGraphics1").innerHTML = JSON.stringify(dataVals);