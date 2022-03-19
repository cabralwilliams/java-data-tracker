//Get the values from the summary statistics so that decimal values can be cut off
const meanDiv = document.querySelector("#meanDiv");
const popStandDevDiv = document.querySelector("#popStandDevDiv");
const sampleStandDevDiv = document.querySelector("#sampleStandDevDiv");

const fontColor = "#952065";

const meanVal = parseFloat(meanDiv.textContent.split(" ")[meanDiv.textContent.split(" ").length - 1]);
const popStDev = parseFloat(popStandDevDiv.textContent.split(" ")[popStandDevDiv.textContent.split(" ").length - 1]);
const sampStDev = parseFloat(sampleStandDevDiv.textContent.split(" ")[sampleStandDevDiv.textContent.split(" ").length - 1]);

meanDiv.textContent = `Mean Value: ${meanVal.toFixed(3)}`;
popStandDevDiv.textContent = `Population Standard Deviation: ${popStDev.toFixed(4)}`;
sampleStandDevDiv.textContent = `Sample Standard Deviation: ${sampStDev.toFixed(4)}`;

const dataEls = document.getElementsByClassName("dataValOne");

const dataVals = Array.from(dataEls, el => {
    return parseFloat(el.textContent.split(" ")[el.textContent.split(" ").length - 1]);
});

let sortedVals = [...dataVals];
sortedVals = sortedVals.sort((a,b) => a - b);
let median;

if(sortedVals.length%2 === 0) {
    median = (sortedVals[sortedVals.length/2 - 1] + sortedVals[sortedVals.length/2])/2;
} else {
    median = sortedVals[Math.floor(sortedVals.length/2)];
}

document.querySelector("#medianDiv").textContent = `Median Value: ${median.toFixed(4)}`;

const range = sortedVals[sortedVals.length - 1] - sortedVals[0];

function getCutoffs(low,high) {
    const range = high - low;
    return { lowest: { value: low + range/5, points: 0}, lower: { value: low + range*0.4, points: 0}, mid: { value: low + range*0.6, points: 0}, higher: { value: low + range*0.8, points: 0}, highest: { value: high, points: 0} };
}

function createHistogram(datapoints) {
    let sorted = [...datapoints];
    sorted = sorted.sort((a,b) => a - b);
    const cutoffs = getCutoffs(sorted[0], sorted[sorted.length - 1]);
    let yScale;
    let allEqual = false;
    let maxPoints = 0;
    if(cutoffs.lowest.value === cutoffs.highest.value) {
        yScale = 270/datapoints.length;
        allEqual = true;
        maxPoints = datapoints.length;
    } else {
        for(let i = 0; i < datapoints.length; i++) {
            if(datapoints[i] <= cutoffs.lowest.value) {
                cutoffs.lowest.points++;
            } else if(datapoints[i] <= cutoffs.lower.value) {
                cutoffs.lower.points++;
            } else if(datapoints[i] <= cutoffs.mid.value) {
                cutoffs.mid.points++;
            } else if(datapoints[i] <= cutoffs.higher.value) {
                cutoffs.higher.points++;
            } else {
                cutoffs.highest.points++;
            }
        }
        maxPoints = Math.max(cutoffs.lowest.points,cutoffs.lower.points,cutoffs.mid.points,cutoffs.higher.points,cutoffs.highest.points);
        yScale = 270/maxPoints;
    }
    let outputStr = `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='-50 -330 600 360'>`;
    let lineW = 0.75;
    let fontSize = 10;
    outputStr += `<rect x='0' y='-300' height='300' width='500' fill='none' stroke='black' stroke-width='${lineW}' />`;
    let pointDifferential;
    if(maxPoints < 10) {
        pointDifferential = 1;
    } else if(maxPoints < 20) {
        pointDifferential = 2;
    } else {
        pointDifferential = 5;
    }
    //Draw gridlines
    for(let i = pointDifferential; i <= maxPoints; i += pointDifferential) {
        outputStr += `<line x1='0' y1='${-i*yScale}' x2='500' y2='${-i*yScale}' stroke='black' stroke-width='${lineW}' />
        <text x='${-2.5*fontSize}' y='${-i*yScale + fontSize*0.4}' font-size='${fontSize}'>${i}</text>`;
    }
    const colorArray = ["#731C98","#f39218","#cccccc","#952065","#25c0f5"];
    if(!allEqual) {
        for(let i = 0; i < 5; i++) {
            let nextPoints;
            let nextValue;
            switch(i) {
                case 0:
                    nextPoints = cutoffs.lowest.points;
                    nextValue = cutoffs.lowest.value.toFixed(2);
                    break;
                case 1:
                    nextPoints = cutoffs.lower.points;
                    nextValue = cutoffs.lower.value.toFixed(2);
                    break;
                case 2:
                    nextPoints = cutoffs.mid.points;
                    nextValue = cutoffs.mid.value.toFixed(2);
                    break;
                case 3:
                    nextPoints = cutoffs.higher.points;
                    nextValue = cutoffs.higher.value.toFixed(2);
                    break;
                case 4:
                    nextPoints = cutoffs.highest.points;
                    nextValue = cutoffs.highest.value.toFixed(2);
                    break;
                default:
                    nextPoints = cutoffs.lowest.points;
                    nextValue = cutoffs.lowest.value.toFixed(2);
                    break;
            }
            outputStr += `<rect x='${250/3*(i + 1) - 35}' y='${-nextPoints*yScale}' width='70' height='${nextPoints*yScale}' stroke='black' stroke-width='${lineW}' fill='${colorArray[i]}' />
            <text x='${250/3*(i + 1) - 25}' y='${1.5*fontSize}' font-size='${fontSize}'>${'<= '}${nextValue}</text>`;
        }
    } else {
        outputStr += `<rect x='200' y='-270' width='100' height='270' stroke='black' stroke-width='${lineW}' fill='${colorArray[Math.floor(Math.random()*5)]}' />
        <text x='225' y='${1.5*fontSize}' font-size='${fontSize}'>= ${datapoints[0].toFixed(2)}</text>`;
    }
    outputStr += `</svg>`;
    return outputStr;
}
//console.log(dataEls);
//console.log(dataVals);

document.querySelector("#dataGraphics1").innerHTML = createHistogram(dataVals);

function updateHistogram(datapoints, chartTitle, xLabel) {
    let sorted = [...datapoints];
    sorted = sorted.sort((a,b) => a - b);
    const cutoffs = getCutoffs(sorted[0], sorted[sorted.length - 1]);
    let yScale;
    let allEqual = false;
    let maxPoints = 0;
    if(cutoffs.lowest.value === cutoffs.highest.value) {
        yScale = 270/datapoints.length;
        allEqual = true;
        maxPoints = datapoints.length;
    } else {
        for(let i = 0; i < datapoints.length; i++) {
            if(datapoints[i] <= cutoffs.lowest.value) {
                cutoffs.lowest.points++;
            } else if(datapoints[i] <= cutoffs.lower.value) {
                cutoffs.lower.points++;
            } else if(datapoints[i] <= cutoffs.mid.value) {
                cutoffs.mid.points++;
            } else if(datapoints[i] <= cutoffs.higher.value) {
                cutoffs.higher.points++;
            } else {
                cutoffs.highest.points++;
            }
        }
        maxPoints = Math.max(cutoffs.lowest.points,cutoffs.lower.points,cutoffs.mid.points,cutoffs.higher.points,cutoffs.highest.points);
        yScale = 270/maxPoints;
    }
    let outputStr = `<svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='-65 -340 615 380'>`;
    let lineW = 0.75;
    let fontSize = 10;
    outputStr += `<rect x='0' y='-300' height='300' width='500' fill='none' stroke='black' stroke-width='${lineW}' />`;
    outputStr += `<text x='160.5' y='-314.5' font-size='15' fill='black'>${chartTitle}</text>`;
    outputStr += `<text x='160' y='-315' font-size='15' fill='${fontColor}'>${chartTitle}</text>`;
    outputStr += `<text x='125' y='27' font-size='12' fill='${fontColor}'>${xLabel}</text>`;
    outputStr += `<text x='60' y='-35' font-size='12' fill='${fontColor}' transform='rotate(-90)'>Frequency</text>`;
    let pointDifferential;
    if(maxPoints < 10) {
        pointDifferential = 1;
    } else if(maxPoints < 20) {
        pointDifferential = 2;
    } else {
        pointDifferential = 5;
    }
    //Draw gridlines
    for(let i = pointDifferential; i <= maxPoints; i += pointDifferential) {
        outputStr += `<line x1='0' y1='${-i*yScale}' x2='500' y2='${-i*yScale}' stroke='black' stroke-width='${lineW}' />
        <text x='${-2.5*fontSize}' y='${-i*yScale + fontSize*0.4}' font-size='${fontSize}'>${i}</text>`;
    }
    const colorArray = ["#731C98","#f39218","#cccccc","#952065","#25c0f5"];
    if(!allEqual) {
        for(let i = 0; i < 5; i++) {
            let nextPoints;
            let nextValue;
            switch(i) {
                case 0:
                    nextPoints = cutoffs.lowest.points;
                    nextValue = cutoffs.lowest.value.toFixed(2);
                    break;
                case 1:
                    nextPoints = cutoffs.lower.points;
                    nextValue = cutoffs.lower.value.toFixed(2);
                    break;
                case 2:
                    nextPoints = cutoffs.mid.points;
                    nextValue = cutoffs.mid.value.toFixed(2);
                    break;
                case 3:
                    nextPoints = cutoffs.higher.points;
                    nextValue = cutoffs.higher.value.toFixed(2);
                    break;
                case 4:
                    nextPoints = cutoffs.highest.points;
                    nextValue = cutoffs.highest.value.toFixed(2);
                    break;
                default:
                    nextPoints = cutoffs.lowest.points;
                    nextValue = cutoffs.lowest.value.toFixed(2);
                    break;
            }
            outputStr += `<rect x='${250/3*(i + 1) - 35}' y='${-nextPoints*yScale}' width='70' height='${nextPoints*yScale}' stroke='black' stroke-width='${lineW}' fill='${colorArray[i]}' />
            <text x='${250/3*(i + 1) - 25}' y='${1.5*fontSize}' font-size='${fontSize}'>${'<= '}${nextValue}</text>`;
        }
    } else {
        outputStr += `<rect x='200' y='-270' width='100' height='270' stroke='black' stroke-width='${lineW}' fill='${colorArray[Math.floor(Math.random()*5)]}' />
        <text x='225' y='${1.5*fontSize}' font-size='${fontSize}'>= ${datapoints[0].toFixed(2)}</text>`;
    }
    outputStr += `</svg>`;
    return outputStr;
}

function updateChart(event) {
    event.preventDefault();
    const newChart = updateHistogram(dataVals, document.querySelector("#x-axis").value.trim(), document.querySelector("#chart-title").value.trim());
    document.querySelector("#dataGraphics1").innerHTML = newChart;
}

document.querySelector("#axesForm").addEventListener("submit", updateChart);
toggleUpdateForm.addEventListener("click", () => {
    updateFormDiv.classList.toggle("notDisplayed");
});