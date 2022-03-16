
let datapoints = [];

function storeDatapoint(event) {
    event.preventDefault();
    const includeDates = !!document.querySelector("#dataDate");
    const pointOb = {
        valueOne: parseFloat(document.querySelector("#valueOne").value),
        valueTwo: parseFloat(document.querySelector("#valueTwo").value)
    };
    pointOb.dataDate = includeDates ? document.querySelector("#dataDate").value : null;
    datapoints.push(pointOb);
    document.querySelector("#stored-points").innerHTML = "";
    for(let i = 0; i < datapoints.length; i++) {
        const nextDiv = document.createElement("div");
        let textVal = `Value 1: ${datapoints[i].valueOne} | Value 2: ${datapoints[i].valueTwo}`;
        if(includeDates) {
            textVal += ` | Date: ${datapoints[i].dataDate}`;
        }
        nextDiv.textContent = textVal;
        document.querySelector("#stored-points").appendChild(nextDiv);
    }
}

document.querySelector("#datapoint-form").addEventListener("submit", storeDatapoint);

function dropDatapoint() {
    if(datapoints.length > 0) {
        datapoints = datapoints.slice(0,datapoints.length - 1);
        document.querySelector("#stored-points").innerHTML = "";
        for(let i = 0; i < datapoints.length; i++) {
            const nextDiv = document.createElement("div");
            let textVal = `Value 1: ${datapoints[i].valueOne} | Value 2: ${datapoints[i].valueTwo}`;
            if(includeDates) {
                textVal += ` | Date: ${datapoints[i].dataDate}`;
            }
            nextDiv.textContent = textVal;
            document.querySelector("#stored-points").appendChild(nextDiv);
        }
    }
}

document.querySelector("#deleteLast").addEventListener("click", dropDatapoint);

async function storeDatapoints(event) {
    event.preventDefault();
    if(datapoints.length > 0) {
        const datasetId = parseInt(window.location.toString().split("/")[window.location.toString().split("/").length - 1]);
        for(let i = 0; i < datapoints.length; i++) {
            const datapoint = datapoints[i];
            datapoint.datasetId = datasetId;
            const response = await fetch("/api/datapoints", {
                method: "POST",
                body: JSON.stringify(datapoint),
                headers: { "Content-Type": "application/json" }
            });

            if(!response.ok) {
                alert(`Could not complete the operation of adding datapoint ${i} (0 indexed) of your dataset.`);
            }
        }
        window.location.reload();
    }
}

document.querySelector("#save-points").addEventListener("submit", storeDatapoints);