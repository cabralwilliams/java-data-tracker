
const fontColor = "#952065";
const dataEls = document.getElementsByClassName("dataValOne");
const dateEls = document.getElementsByClassName("dataDataDate");

const meanDiv = document.querySelector("#meanDiv");
const popStDevDiv = document.querySelector("#popStandDevDiv");
const sampleStDevDiv = document.querySelector("#sampleStandDevDiv");

meanDiv.innerHTML = `Mean Value: ${parseFloat(meanDiv.textContent.split(" ")[meanDiv.textContent.split(" ").length - 1]).toFixed(4)}`;
popStDevDiv.innerHTML = `Population Standard Deviation: ${parseFloat(popStDevDiv.textContent.split(" ")[popStDevDiv.textContent.split(" ").length - 1]).toFixed(4)}`;
sampleStDevDiv.innerHTML = `Sample Standard Deviation: ${parseFloat(sampleStDevDiv.textContent.split(" ")[sampleStDevDiv.textContent.split(" ").length - 1]).toFixed(4)}`;

const dataVals = Array.from(dataEls, el => {
    return parseFloat(el.textContent.split(" ")[el.textContent.split(" ").length - 1]);
});

let dataDates = Array.from(dateEls, el => {
    //Grab the date from the end of the textContent
    const dateStringArray = el.textContent.split(" ")[el.textContent.split(" ").length - 1].split("-");
    return {
        year: parseInt(dateStringArray[0]),
        month: parseInt(dateStringArray[1]),
        day: parseInt(dateStringArray[2])
    }
});

dataDates = dataDates.map(dateOb => {
    //Establish January 1, 1970 as zero point
    let adjustedYear = dateOb.year - 1970;
    let incrementsOfFour = Math.round(Math.abs(adjustedYear)/4);
    let yearDayAdjustment;
    if(adjustedYear < 0) {
        yearDayAdjustment = adjustedYear*365 - incrementsOfFour;
    } else {
        yearDayAdjustment = adjustedYear*365 + incrementsOfFour;
    }
    if(dateOb.year%4 === 2 && dateOb.month < 3) {
        yearDayAdjustment--;
    }
    let adjustedDay = yearDayAdjustment;
    let monthStr;
    switch(dateOb.month) {
        case 2:
            monthStr = "Feb";
            adjustedDay += 31;
            break;
        case 3:
            monthStr = "Mar";
            adjustedDay += 59;
            break;
        case 4:
            monthStr = "Apr";
            adjustedDay += 90;
            break;
        case 5:
            monthStr = "May";
            adjustedDay += 120;
            break;
        case 6:
            monthStr = "Jun";
            adjustedDay += 151;
            break;
        case 7:
            monthStr = "Jul";
            adjustedDay += 181;
            break;
        case 8:
            monthStr = "Aug";
            adjustedDay += 212;
            break;
        case 9:
            monthStr = "Sep";
            adjustedDay += 243;
            break;
        case 10:
            monthStr = "Oct";
            adjustedDay += 273;
            break;
        case 11:
            monthStr = "Nov";
            adjustedDay += 304;
            break;
        case 12:
            monthStr = "Dec";
            adjustedDay += 334;
            break;
        default:
            monthStr = "Jan";
            break;
    }
    adjustedDay += dateOb.day - 1;
    return { ...dateOb, adjustedDay, monthStr };
});

//console.log(dataEls);
//console.log(dataVals);



function getRegressionCoefficients(valueArray, dateObjectArray) {
    let valueSum = 0;
    let dateSum = 0;
    for(let i = 0; i < valueArray.length; i++) {
        valueSum += valueArray[i];
        dateSum += dateObjectArray[i].adjustedDay;
    }
    let valAvg = valueSum/valueArray.length;
    let dayAvg = dateSum/dateObjectArray.length;
//    console.log(dayAvg);
    let sumOfValSquares = 0;
    let sumOfDaySquares = 0;
    let sumOfCorrelation = 0;
    for(let i = 0; i < valueArray.length; i++) {
        sumOfValSquares += (valueArray[i] - valAvg)*(valueArray[i] - valAvg);
        sumOfDaySquares += (dateObjectArray[i].adjustedDay - dayAvg)*(dateObjectArray[i].adjustedDay - dayAvg);
        sumOfCorrelation += (valueArray[i] - valAvg)*(dateObjectArray[i].adjustedDay - dayAvg);
    }
//    console.log(sumOfValSquares);
//    console.log(sumOfDaySquares);
//    console.log(sumOfCorrelation);
    const correlation = sumOfCorrelation/Math.sqrt(sumOfValSquares*sumOfDaySquares);
    const slope = correlation*Math.sqrt(sumOfValSquares/sumOfDaySquares);
    const intercept = valAvg - slope*dayAvg;
    return { correlation, slope, intercept };
}

const regressionCos = getRegressionCoefficients(dataVals, dataDates);

document.querySelector("#correlationDiv").innerHTML = `Correlation Coefficient: ${regressionCos.correlation.toFixed(4)}`;
document.querySelector("#regressionDiv").innerHTML = `Regression Coefficients: Slope: <span>${regressionCos.slope.toFixed(3)}</span> | Intercept: <span>${regressionCos.intercept.toFixed(3)}</span>`;

//document.querySelector("#dataGraphics1").innerHTML = `<div>Date Object: ${JSON.stringify(dataDates)}</div><div>Regression Object: ${JSON.stringify(getRegressionCoefficients(dataVals, dataDates))}</div>`;

function getXVal(xOb, xPos, fontSize = 3) {
    let xText = `${xOb.monthStr}-${xOb.day}-${xOb.year}`;
    return `<text x='${xPos - 2.5*fontSize}' y='${1.2*fontSize}' font-size='${fontSize}'>${xText}</text>`;
}

function getYVal(yVal, yPos, fontSize = 10) {
    let convertedY;
    if(Math.abs(yVal) > 100) {
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
    let sortedX = array1.map(dateOb => dateOb.adjustedDay).sort((a,b) => a - b);
    let sortedY = [...array2];
    sortedY = sortedY.sort((a,b) => a - b);
    let minX = sortedX[0];
    let maxX = sortedX[sortedX.length - 1];
    console.log(`MinX: ${minX}`);
    console.log(`MaxX: ${maxX}`);
    let minY = (sortedY[0] > 0 && sortedY[0] < 10) ? 0 : sortedY[0];
    let maxY = sortedY[sortedY.length - 1];
    console.log(`MinY: ${minY}`);
    console.log(`MaxY: ${maxY}`);
    console.log(`Array 1: ${JSON.stringify(array1)}`);
    console.log(`Array 2: ${JSON.stringify(array2)}`);
    let outputStr = `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='-50 -330 600 360'>`;
    const offSetX = -minX;
    const scaleX = 450/(maxX - minX);
    //x-value is (array1[i] + offSetX)*scaleX
    const offSetY = -minY;
    const scaleY = 270/(maxY - minY);
    //y-value is (array2[i] + offSetY)*scaleY
    const scaledSlope = slope*scaleY/scaleX;
    let translatedIntercept = slope*minX + intercept;
    translatedIntercept = (translatedIntercept - minY)*scaleY;
//    console.log(`Translated Intercept: ${translatedIntercept}`);
//    const translatedZeroX = scaleX*offSetX;
//    console.log(`Translated ZeroX: ${translatedZeroX}`);
    let lineW = 0.75;
    let rad = 2;
    outputStr += `<rect x='0' y='-300' height='300' width='500' fill='none' stroke='black' stroke-width='${lineW}' />`;
    for(let i = 1; i < 10; i++) {
        outputStr += `<line x1='${i*50}' y1='-300' x2='${i*50}' y2='0' stroke='black' stroke-width='${0.9*lineW}' />
        <line y1='${-i*30}' x1='0' y2='${-i*30}' x2='500' stroke='black' stroke-width='${0.9*lineW}' />
        ${getYVal(minY + i*30/scaleY,i*30,10)}`;
    }
    //Later - may add grid lines and axis values
    const fontSize = 9;
    for(let i = 0; i < array1.length; i++) {
        outputStr += `<circle cx='${(array1[i].adjustedDay + offSetX)*scaleX}' cy='${-(array2[i] + offSetY)*scaleY}' r='${rad}' stroke='none' fill='blue' />`;
        outputStr += `${getXVal(array1[i], (array1[i].adjustedDay + offSetX)*scaleX, fontSize)}`;
    }
    outputStr += `<line x1='0' y1='${-translatedIntercept}' x2='450' y2='${-(scaledSlope*450 + translatedIntercept)}' stroke='red' stroke-width='${lineW}' />`;
    //Add more later
    outputStr += "</svg>";
    return outputStr;
};

document.querySelector("#dataGraphics1").innerHTML = generateLinearRegressionNoLabels(dataDates,dataVals,regressionCos.slope,regressionCos.intercept);

const generateLinearRegressionLabels = (array1,array2,slope,intercept,title,labelX,labelY) => {
    if(array1.length < 2) {
        return "Too few datapoints!  Add more to see the linear regression!";
    }
    let sortedX = array1.map(dateOb => dateOb.adjustedDay).sort((a,b) => a - b);
    let sortedY = [...array2];
    sortedY = sortedY.sort((a,b) => a - b);
    let minX = sortedX[0];
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
    let translatedIntercept = slope*minX + intercept;
    translatedIntercept = (translatedIntercept - minY)*scaleY;
//    console.log(`Translated Intercept: ${translatedIntercept}`);
    const translatedZeroX = scaleX*offSetX;
//    console.log(`Translated ZeroX: ${translatedZeroX}`);
    let lineW = 0.75;
    let rad = 2;
    outputStr += `<rect x='0' y='-300' height='300' width='500' fill='none' stroke='black' stroke-width='${lineW}' />`;
    for(let i = 1; i < 10; i++) {
        outputStr += `<line x1='${i*50}' y1='-300' x2='${i*50}' y2='0' stroke='black' stroke-width='${0.9*lineW}' />
        <line y1='${-i*30}' x1='0' y2='${-i*30}' x2='500' stroke='black' stroke-width='${0.9*lineW}' />
        ${getYVal(minY + i*30/scaleY,i*30,10)}`;
    }
    //Later - may add grid lines and axis values
    const fontSize = 9;
    for(let i = 0; i < array1.length; i++) {
        outputStr += `<circle cx='${(array1[i].adjustedDay + offSetX)*scaleX}' cy='${-(array2[i] + offSetY)*scaleY}' r='${rad}' stroke='none' fill='blue' />`;
        outputStr += `${getXVal(array1[i], (array1[i].adjustedDay + offSetX)*scaleX, fontSize)}`;
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
    document.querySelector("#dataGraphics1").innerHTML = generateLinearRegressionLabels(dataDates,dataVals,regressionCos.slope,regressionCos.intercept,chartTitle,xLabel,yLabel);
};

document.querySelector("#axesForm").addEventListener("submit", replaceChart);
toggleUpdateForm.addEventListener("click", () => {
    updateFormDiv.classList.toggle("notDisplayed");
});