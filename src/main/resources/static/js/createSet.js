
async function createDataSet(event) {
    event.preventDefault();
    const setName = document.querySelector("#setName").value.trim();
    const setType = parseInt(document.querySelector("#setType").value);
    const userId = parseInt(document.querySelector("#userId").value);
    let useDates = parseInt(document.querySelector("#includeDates").value);
    const includeDates = useDates === 1 ? true : false;

    if(!setName) {
        return;
    }

    const response = await fetch("/datasets", {
        method: "POST",
        body: JSON.stringify({
            setName,
            setType,
            userId,
            includeDates
        }),
        headers: { "Content-Type": "application/json" }
    });

    if(response.ok) {
        window.location.replace("/dashboard");
    } else {
        alert(`Unable to create dataset - ${response.status}`);
    }
}

document.querySelector("#create-form").addEventListener("submit", createDataSet);