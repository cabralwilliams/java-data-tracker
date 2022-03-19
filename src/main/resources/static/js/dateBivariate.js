
//Get the elements holding the initial data
const dataEls1 = document.getElementsByClassName("dataValOne");
const dataEls2 = document.getElementsByClassName("dataValTwo");
const dateEls = document.getElementsByClassName("dataDataDate");
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
const slope1 = parseFloat(slopeEl.textContent);
const intercept1 = parseFloat(interceptEl.textContent);
//Get these values so that they don't have to be calculated again
const mean1 = parseFloat(mean1El.textContent);
const mean2 = parseFloat(mean2El.textContent);
const squares1 = parseFloat(squares1El.textContent);
const squares2 = parseFloat(squares2El.textContent);

//Replace values with rounded versions
mean1El.textContent = parseFloat(mean1El.textContent).toFixed(3);
mean2El.textContent = parseFloat(mean2El.textContent).toFixed(3);
squares1El.textContent = parseFloat(squares1El.textContent).toFixed(3);
squares2El.textContent = parseFloat(squares2El.textContent).toFixed(3);
correlationEl.textContent = parseFloat(correlationEl.textContent).toFixed(5);
slopeEl.textContent = parseFloat(slopeEl.textContent).toFixed(3);
interceptEl.textContent = parseFloat(interceptEl.textContent).toFixed(3);

//First set of data converted to floats
const dataVals1 = Array.from(dataEls1, el => {
    return parseFloat(el.textContent.split(" ")[el.textContent.split(" ").length - 1]);
});

//Second set of data converted to floats
const dataVals2 = Array.from(dataEls2, el => {
    return parseFloat(el.textContent.split(" ")[el.textContent.split(" ").length - 1]);
})

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

//Get only the adjustedDays
const adjustedDays = dataDates.map(dateOb => dateOb.adjustedDay);

//Calculate the average day and sum of day square differences
let daySum = 0;
let daySquaresSum = 0;
for(let i = 0; i < dataDates.length; i++) {
    daySum += dataDates[i].adjustedDay;
}

const averageDay = daySum/dataDates.length;
for(let i = 0; i < dataDates.length; i++) {
    daySquaresSum += (dataDates[i].adjustedDay - averageDay)*(dataDates[i].adjustedDay - averageDay);
}

//data will be [datasetArray, mean, sumOfSquares]
//data1 will be treated as independent variable and data2 as dependent
function getRegressionCoefficients(data1, data2) {
    let sumOfCoSquares = 0;
    for(let i = 0; i < data1[0].length; i++) {
        sumOfCoSquares += (data1[0][i] - data1[1])*(data2[0][i] - data2[1]);
    }
    const correlation = sumOfCoSquares/Math.sqrt(data1[2]*data2[2]);
    const slope = correlation*Math.sqrt(data2[2]/data1[2]);
    const intercept = data2[1] - slope*data1[1];
    return { slope, intercept, correlation };
}

let regressionData1Date, regressionData2Date, regressionData12, regressionData21;

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

function getXValDate(xOb, xPos, fontSize = 3) {
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

function generateChartType1(series1, dateSeries, slope, intercept, title="", series1Label="", dateLabel="", dS=1) {
    if(series1.length < 2) {
        return "Too few datapoints!  Add more to see the linear regression!";
    }
    console.log(`Slope: ${slope}`);
    console.log(`Intercept: ${intercept}`);
    let sortedX = dateSeries.map(dateOb => dateOb.adjustedDay).sort((a,b) => a - b);
    let sortedY = [...series1];
    sortedY = sortedY.sort((a,b) => a - b);
    let minX = sortedX[0];
    let maxX = sortedX[sortedX.length - 1];
    console.log(`MinX: ${minX}`);
    console.log(`MaxX: ${maxX}`);
    let minY = (sortedY[0] > 0 && sortedY[0] < 10) ? 0 : sortedY[0];
    let maxY = sortedY[sortedY.length - 1];
    const offSetX = -minX;
    const scaleX = 450/(maxX - minX);
    //x-value is (array1[i] + offSetX)*scaleX
    const offSetY = -minY;
    const scaleY = 270/(maxY - minY);
    //y-value is (array2[i] + offSetY)*scaleY
    const scaledSlope = slope*scaleY/scaleX;
    const translatedIntercept = scaleY*(intercept + offSetY);
    let lineW = 0.75;
    let fontSize = 9;
    let rad = 2;
    let svgStr = title === "" ? `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='-50 -340 600 380'>` : `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='-65 -340 615 380'>`;
    if(title === "") {
        svgStr += `<text x='160.5' y='-314.5' font-size='15' fill='black'>Data Series ${dS} vs Date</text>`;
        svgStr += `<text x='160' y='-315' font-size='15' fill='${fontColor}'>Data Series ${dS} vs Date</text>`;
    } else {
        svgStr += `<text x='160.5' y='-314.5' font-size='15' fill='black'>${title}</text>`;
        svgStr += `<text x='160' y='-315' font-size='15' fill='${fontColor}'>${title}</text>`;
        svgStr += `<text x='125' y='27' font-size='12' fill='${fontColor}'>${dateLabel}</text>`;
        svgStr += `<text x='50' y='-45' font-size='12' fill='${fontColor}' transform='rotate(-90)'>${series1Label}</text>`;
    }
    svgStr += `<rect x='0' y='-300' height='300' width='500' fill='none' stroke='black' stroke-width='${lineW}' />`;
    for(let i = 1; i < 10; i++) {
        svgStr += `<line x1='${i*50}' y1='-300' x2='${i*50}' y2='0' stroke='black' stroke-width='${0.9*lineW}' />
        <line y1='${-i*30}' x1='0' y2='${-i*30}' x2='500' stroke='black' stroke-width='${0.9*lineW}' />
        ${getYVal(minY + i*30/scaleY,i*30,10)}`;
    }
    //Later - may add grid lines and axis values

    for(let i = 0; i < series1.length; i++) {
        svgStr += `<circle cx='${(dateSeries[i].adjustedDay + offSetX)*scaleX}' cy='${-(series1[i] + offSetY)*scaleY}' r='${rad}' stroke='none' fill='blue' />`;
        svgStr += `${getXValDate(dateSeries[i], (dateSeries[i].adjustedDay + offSetX)*scaleX, fontSize)}`;
    }
    svgStr += `<line x1='0' y1='${-(scaledSlope*minX*scaleX + translatedIntercept)}' x2='450' y2='${-(scaledSlope*maxX*scaleX + translatedIntercept)}' stroke='red' stroke-width='${lineW}' />`;
    //Add more later
    svgStr += "</svg>";
    return svgStr;
}

function generateChartType2(series1, series2, slope, intercept, title="", series1Label="", series2Label="") {
    if(series1.length < 2) {
        return "Too few datapoints!  Add more to see the linear regression!";
    }
    console.log(`Slope: ${slope}`);
    console.log(`Intercept: ${intercept}`);
    let sortedX = [...series2];
    let sortedY = [...series1];
    sortedY = sortedY.sort((a,b) => a - b);
    let minX = sortedX[0];
    let maxX = sortedX[sortedX.length - 1];
    console.log(`MinX: ${minX}`);
    console.log(`MaxX: ${maxX}`);
    let minY = (sortedY[0] > 0 && sortedY[0] < 10) ? 0 : sortedY[0];
    let maxY = sortedY[sortedY.length - 1];
    const offSetX = -minX;
    const scaleX = 450/(maxX - minX);
    //x-value is (array1[i] + offSetX)*scaleX
    const offSetY = -minY;
    const scaleY = 270/(maxY - minY);
    //y-value is (array2[i] + offSetY)*scaleY
    const scaledSlope = slope*scaleY/scaleX;
    const translatedIntercept = scaleY*(intercept + offSetY);
    let lineW = 0.75;
    let fontSize = 9;
    let rad = 2;
    let svgStr = title === "" ? `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='-50 -340 600 380'>` : `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='-65 -340 615 380'>`;
    if(title === "") {
        svgStr += `<text x='160.5' y='-314.5' font-size='15' fill='black'>Data Series 2 vs Date Series 1</text>`;
        svgStr += `<text x='160' y='-315' font-size='15' fill='${fontColor}'>Data Series 2 vs Date Series 1</text>`;
    } else {
        svgStr += `<text x='160.5' y='-314.5' font-size='15' fill='black'>${title}</text>`;
        svgStr += `<text x='160' y='-315' font-size='15' fill='${fontColor}'>${title}</text>`;
        svgStr += `<text x='125' y='27' font-size='12' fill='${fontColor}'>${series1Label}</text>`;
        svgStr += `<text x='50' y='-45' font-size='12' fill='${fontColor}' transform='rotate(-90)'>${series2Label}</text>`;
    }
    svgStr += `<rect x='0' y='-300' height='300' width='500' fill='none' stroke='black' stroke-width='${lineW}' />`;
    for(let i = 1; i < 10; i++) {
        svgStr += `<line x1='${i*50}' y1='-300' x2='${i*50}' y2='0' stroke='black' stroke-width='${0.9*lineW}' />
        <line y1='${-i*30}' x1='0' y2='${-i*30}' x2='500' stroke='black' stroke-width='${0.9*lineW}' />
        ${getXVal(minX + i*50/scaleX,i*50,10)}
        ${getYVal(minY + i*30/scaleY,i*30,10)}`;
    }
    //Later - may add grid lines and axis values

    for(let i = 0; i < series1.length; i++) {
        svgStr += `<circle cx='${(series2[i] + offSetX)*scaleX}' cy='${-(series1[i] + offSetY)*scaleY}' r='${rad}' stroke='none' fill='blue' />`;
    }
    svgStr += `<line x1='0' y1='${-(scaledSlope*minX*scaleX + translatedIntercept)}' x2='450' y2='${-(scaledSlope*maxX*scaleX + translatedIntercept)}' stroke='red' stroke-width='${lineW}' />`;
    //Add more later
    svgStr += "</svg>";
    return svgStr;
}

function changeChartLabels(event) {
    event.preventDefault();
    let setTitle = document.querySelector("#chart-title").value.trim();
    setTitle = setTitle ? setTitle : "";
    let label1 = document.querySelector("#x-axis").value.trim();
    label1 = label1 ? label1 : "";
    let label2 = document.querySelector("#y-axis").value.trim();
    label2 = label2 ? label2 : "";
    let dateLabel = document.querySelector("#dateLabel").value.trim();
    dateLabel = dateLabel ? dateLabel : "";
    const rD1Date = getRegressionCoefficients([adjustedDays, averageDay, daySquaresSum], [dataVals1, mean1, squares1]);
    const rD2Date = getRegressionCoefficients([adjustedDays, averageDay, daySquaresSum], [dataVals2, mean2, squares2]);
    const rD12 = getRegressionCoefficients([dataVals1, mean1, squares1], [dataVals2, mean2, squares2]);
    document.querySelector("#dataGraphics1").innerHTML = `${generateChartType1(dataVals1, dataDates, rD1Date.slope, rD1Date.intercept, setTitle, label1, dateLabel, 1)}
    <div class='padding-lr-tiny'>Slope: ${rD1Date.slope.toFixed(3)} | Intercept: ${rD1Date.intercept.toFixed(3)} | Correlation: ${rD1Date.correlation.toFixed(4)}</div>
    ${generateChartType1(dataVals2, dataDates, rD2Date.slope, rD2Date.intercept, setTitle, label2, dateLabel, 2)}
    <div class='padding-lr-tiny'>Slope: ${rD2Date.slope.toFixed(3)} | Intercept: ${rD2Date.intercept.toFixed(3)} | Correlation: ${rD2Date.correlation.toFixed(4)}</div>
    ${generateChartType2(dataVals2, dataVals1, rD12.slope, rD12.intercept, setTitle, label1, label2)}
    <div class='padding-lr-tiny'>Slope: ${rD12.slope.toFixed(3)} | Intercept: ${rD12.intercept.toFixed(3)} | Correlation: ${rD12.correlation.toFixed(4)}</div>`;
}

if(dataVals1.length >= 2) {
    regressionData1Date = getRegressionCoefficients([adjustedDays, averageDay, daySquaresSum], [dataVals1, mean1, squares1]);
    regressionData2Date = getRegressionCoefficients([adjustedDays, averageDay, daySquaresSum], [dataVals2, mean2, squares2]);
    regressionData12 = getRegressionCoefficients([dataVals1, mean1, squares1], [dataVals2, mean2, squares2]);
    regressionData21 = getRegressionCoefficients([dataVals2, mean2, squares2], [dataVals1, mean1, squares1]);
    document.querySelector("#dataGraphics1").innerHTML = `<div>Series 1 with Date: ${JSON.stringify(regressionData1Date)}</div>
    <div>Series 2 with Date: ${JSON.stringify(regressionData2Date)}</div>
    <div>Series 1 with Series 2: ${JSON.stringify(regressionData12)}</div>
    <div>Series 2 with Series 1: ${JSON.stringify(regressionData21)}</div>`;

    document.querySelector("#dataGraphics1").innerHTML = `${generateChartType1(dataVals1, dataDates, regressionData1Date.slope, regressionData1Date.intercept, "", "", "", 1)}
    <div class='padding-lr-tiny'>Slope: ${regressionData1Date.slope.toFixed(3)} | Intercept: ${regressionData1Date.intercept.toFixed(3)} | Correlation: ${regressionData1Date.correlation.toFixed(4)}</div>
    ${generateChartType1(dataVals2, dataDates, regressionData2Date.slope, regressionData2Date.intercept, "", "", "", 2)}
    <div class='padding-lr-tiny'>Slope: ${regressionData2Date.slope.toFixed(3)} | Intercept: ${regressionData2Date.intercept.toFixed(3)} | Correlation: ${regressionData2Date.correlation.toFixed(4)}</div>
    ${generateChartType2(dataVals2, dataVals1, regressionData12.slope, regressionData12.intercept, "", "", "")}
    <div class='padding-lr-tiny'>Slope: ${regressionData12.slope.toFixed(3)} | Intercept: ${regressionData12.intercept.toFixed(3)} | Correlation: ${regressionData12.correlation.toFixed(4)}</div>`;

    axesForm.addEventListener("submit", changeChartLabels);
}

toggleUpdateForm.addEventListener("click", () => {
    updateFormDiv.classList.toggle("notDisplayed");
});