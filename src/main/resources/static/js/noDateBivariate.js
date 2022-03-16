
const dataEls1 = document.getElementsByClassName("dataValOne");
const dataEls2 = document.getElementsByClassName("dataValTwo");
let slope = parseFloat(document.querySelector("#slopeCo").textContent);
let intercept = parseFloat(document.querySelector("#intCo").textContent);

const dataVals1 = Array.from(dataEls1, el => {
    return parseFloat(el.textContent.split(" ")[el.textContent.split(" ").length - 1]);
});

const dataVals2 = Array.from(dataEls2, el => {
    return parseFloat(el.textContent.split(" ")[el.textContent.split(" ").length - 1]);
})

//console.log(dataEls);
//console.log(dataVals);

//document.querySelector("#dataGraphics1").innerHTML = JSON.stringify(dataVals);

const generateLinearRegressionNoLabels = (array1,array2,slope,intercept) => {
    if(array1.length < 2) {
        return "Too few datapoints!  Add more to see the linear regression!";
    }
    let sortedX = array1.sort((a,b) => a - b);
    let sortedY = array2.sort((a,b) => a - b);
    let minX = (sortedX[0] > 0 && sortedX[0] < 10) ? 0 : sortedX[0];
    let maxX = sortedX[sortedX.length - 1];
    let minY = (sortedY[0] > 0 && sortedY[0] < 10) ? 0 : sortedY[0];
    let maxY = sortedY[sortedY.length - 1];
    let outputStr = `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='-30 -330 560 360'>`;
    const offSetX = -minX;
    const scaleX = 450/(maxX - minX);
    //x-value is (array1[i] + offSetX)*scaleX
    const offSetY = -minY;
    const scaleY = 270/(maxY - minY);
    //y-value is (array2[i] + offSetY)*scaleY
    const scaledSlope = slope*scaleY/scaleX;
    const translatedIntercept = scaleY*(intercept + offSetY);
    const translatedZeroX = scaleX*offSetX;
    let lineW = 0.75;
    let rad = 1.5;
    outputStr += `<rect x='0' y='-300' height='300' width='500' fill='none' stroke='black' stroke-width='${lineW}' />`;
    //Later - may add grid lines and axis values
    for(let i = 0; i < array1.length; i++) {
        outputStr += `<circle cx='${(array1[i] + offSetX)*scaleX}' cy='${-(array2[i] + offSetY)*scaleY}' r='${rad}' stroke='none' fill='blue' />`;
    }
    outputStr += `<line x1='0' y1='${-translatedIntercept}' x2='450' y2='${-(scaledSlope*450 + translatedIntercept)}' stroke='red' stroke-width='${lineW}' />`;
    //Add more later
    outputStr += "</svg>";
    return outputStr;
};

document.querySelector("#dataGraphics1").innerHTML = generateLinearRegressionNoLabels(dataVals1,dataVals2,slope,intercept);