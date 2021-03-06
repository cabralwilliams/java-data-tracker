
const toggleEdit = document.querySelector("#toggle_edit");
const datasetEditDiv = document.querySelector("#datasetEditDiv");

toggleEdit.addEventListener("click", () => {
    datasetEditDiv.classList.toggle("notDisplayed");
});

async function updateSetName(event) {
    event.preventDefault();
    const setName = document.querySelector('#setName').value.trim();
    const publicity = parseInt(document.querySelector("#publicity").value);

    if(setName === "" || setName === null) {
        return;
    }

    const datasetId = parseInt(window.location.toString().split("/")[window.location.toString().split("/").length - 1]);

    const response = await fetch(`/api/datasets/${datasetId}`, {
        method: "PUT",
        body: JSON.stringify({ setName, publicity }),
        headers: { "Content-Type": "application/json" }
    });

    if(response.ok) {
        window.location.reload();
    } else {
        alert(`An error happened while trying to change the dataset name - ${response.status}`);
    }
}

document.querySelector("#changeSetName").addEventListener("submit", updateSetName);

const deleteDataSet = async event => {
    event.preventDefault();
    const id = parseInt(window.location.toString().split("/")[window.location.toString().split("/").length - 1]);
    const response = await fetch(`/api/datasets/${id}`, {
        method: "DELETE"
    });

    if(response.ok) {
        window.location.replace("/dashboard");
    } else {
        alert(`Could not delete dataset - ${response.status}`);
    }
}

document.querySelector("#deleteSet").addEventListener("submit", deleteDataSet);