
const dataEls1 = document.getElementsByClassName("dataValOne");
const dataEls2 = document.getElementsByClassName("dataValTwo");
const updateFormDiv = document.querySelector("#updateFormDiv");
const axesForm = document.querySelector("#axesForm");
const toggleUpdateForm = document.querySelector("#toggleUpdateForm");
const fontColor = "#952065";

//Get the summary statistics elements so that the initial values can be rounded values can be rounded
const mean1El = document.querySelector("#mean1");
const mean2El = document.querySelector("#mean2");
const squares1El = document.querySelector("#squares1");
const squares2El = document.querySelector("#squares2");
const correlationEl = document.querySelector("#correlation");
const slopeEl = document.querySelector("#slopeCo");
const interceptEl = document.querySelector("#intCo");

//Get the slope and intercept values from their respective elements
const slope = parseFloat(slopeEl.textContent);
const intercept = parseFloat(interceptEl.textContent);

//Replace values with rounded versions
mean1El.textContent = parseFloat(mean1El.textContent).toFixed(3);
mean2El.textContent = parseFloat(mean2El.textContent).toFixed(3);
squares1El.textContent = parseFloat(squares1El.textContent).toFixed(3);
squares2El.textContent = parseFloat(squares2El.textContent).toFixed(3);
correlationEl.textContent = parseFloat(correlationEl.textContent).toFixed(5);
slopeEl.textContent = parseFloat(slopeEl.textContent).toFixed(3);
interceptEl.textContent = parseFloat(interceptEl.textContent).toFixed(3);

const dataVals1 = Array.from(dataEls1, el => {
    return parseFloat(el.textContent.split(" ")[el.textContent.split(" ").length - 1]);
});

const dataVals2 = Array.from(dataEls2, el => {
    return parseFloat(el.textContent.split(" ")[el.textContent.split(" ").length - 1]);
})

//console.log(dataEls);
//console.log(dataVals);

//document.querySelector("#dataGraphics1").innerHTML = JSON.stringify(dataVals);

function getXVal(xVal, xPos, fontSize = 3) {
    let convertedX;
    if(Math.abs(xVal) > 20) {
        convertedX = Math.round(xVal);
    } else if(Math.abs(xVal) > 5) {
        convertedX = xVal.toFixed(1);
    } else if(Math.abs(xVal) > 1) {
        convertedX = xVal.toFixed(2);
    } else {
        convertedX = xVal.toFixed(3);
    }
    return `<text x='${xPos - 0.75*fontSize}' y='${1.2*fontSize}' font-size='${fontSize}'>${convertedX}</text>`;
}

function getYVal(yVal, yPos, fontSize = 10) {
    let convertedY;
    if(Math.abs(yVal) > 20) {
        convertedY = Math.round(yVal);
    } else if(Math.abs(yVal) > 5) {
        convertedY = yVal.toFixed(1);
    } else if(Math.abs(yVal) > 1) {
        convertedY = yVal.toFixed(2);
    } else {
        convertedY = yVal.toFixed(3);
    }
    return `<text x='${-2.9*fontSize}' y='${-yPos + 0.5*fontSize}' font-size='${fontSize}'>${convertedY}</text>`;
}

const generateLinearRegressionNoLabels = (array1,array2,slope,intercept) => {
    if(array1.length < 2) {
        return "Too few datapoints!  Add more to see the linear regression!";
    }
    let sortedX = [...array1];
    sortedX = array1.sort((a,b) => a - b);
    let sortedY = [...array2];
    sortedY = array2.sort((a,b) => a - b);
    let minX = (sortedX[0] > 0 && sortedX[0] < 10) ? 0 : sortedX[0];
    let maxX = sortedX[sortedX.length - 1];
    let minY = (sortedY[0] > 0 && sortedY[0] < 10) ? 0 : sortedY[0];
    let maxY = sortedY[sortedY.length - 1];
    let outputStr = `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='-50 -330 600 360'>`;
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
    let rad = 2;
    outputStr += `<rect x='0' y='-300' height='300' width='500' fill='none' stroke='black' stroke-width='${lineW}' />`;
    for(let i = 1; i < 10; i++) {
        outputStr += `<line x1='${i*50}' y1='-300' x2='${i*50}' y2='0' stroke='black' stroke-width='${0.9*lineW}' />
        <line y1='${-i*30}' x1='0' y2='${-i*30}' x2='500' stroke='black' stroke-width='${0.9*lineW}' />
        ${getXVal(minX + i*50/scaleX,i*50,10)}
        ${getYVal(minY + i*30/scaleY,i*30,10)}`;
    }
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

const generateLinearRegressionLabels = (array1,array2,slope,intercept,title,labelX,labelY) => {
    if(array1.length < 2) {
        return "Too few datapoints!  Add more to see the linear regression!";
    }
    let sortedX = [...array1];
    sortedX = array1.sort((a,b) => a - b);
    let sortedY = [...array2];
    sortedY = array2.sort((a,b) => a - b);
    let minX = (sortedX[0] > 0 && sortedX[0] < 10) ? 0 : sortedX[0];
    let maxX = sortedX[sortedX.length - 1];
    let minY = (sortedY[0] > 0 && sortedY[0] < 10) ? 0 : sortedY[0];
    let maxY = sortedY[sortedY.length - 1];
    let outputStr = `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='-65 -340 615 380'>`;
    outputStr += `<text x='160.5' y='-314.5' font-size='15' fill='black'>${title}</text>`;
    outputStr += `<text x='160' y='-315' font-size='15' fill='${fontColor}'>${title}</text>`;
    outputStr += `<text x='125' y='27' font-size='12' fill='${fontColor}'>${labelX}</text>`;
    outputStr += `<text x='50' y='-45' font-size='12' fill='${fontColor}' transform='rotate(-90)'>${labelY}</text>`;
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
    let rad = 2;
    outputStr += `<rect x='0' y='-300' height='300' width='500' fill='none' stroke='black' stroke-width='${lineW}' />`;
    for(let i = 1; i < 10; i++) {
        outputStr += `<line x1='${i*50}' y1='-300' x2='${i*50}' y2='0' stroke='black' stroke-width='${0.9*lineW}' />
        <line y1='${-i*30}' x1='0' y2='${-i*30}' x2='500' stroke='black' stroke-width='${0.9*lineW}' />
        ${getXVal(minX + i*50/scaleX,i*50,10)}
        ${getYVal(minY + i*30/scaleY,i*30,10)}`;
    }
    //Later - may add grid lines and axis values
    for(let i = 0; i < array1.length; i++) {
        outputStr += `<circle cx='${(array1[i] + offSetX)*scaleX}' cy='${-(array2[i] + offSetY)*scaleY}' r='${rad}' stroke='none' fill='blue' />`;
    }
    outputStr += `<line x1='0' y1='${-translatedIntercept}' x2='450' y2='${-(scaledSlope*450 + translatedIntercept)}' stroke='red' stroke-width='${lineW}' />`;
    //Add more later
    outputStr += "</svg>";
    return outputStr;
};

function replaceChart(event) {
    event.preventDefault();
    const chartTitle = document.querySelector("#chart-title").value.trim();
    const xLabel = document.querySelector("#x-axis").value.trim();
    const yLabel = document.querySelector("#y-axis").value.trim();
    document.querySelector("#dataGraphics1").innerHTML = generateLinearRegressionLabels(dataVals1,dataVals2,slope,intercept,chartTitle,xLabel,yLabel);
};

document.querySelector("#axesForm").addEventListener("submit", replaceChart);
toggleUpdateForm.addEventListener("click", () => {
    updateFormDiv.classList.toggle("notDisplayed");
});