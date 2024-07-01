let ngrokUrl = '';

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Default open the Patient History tab
document.getElementsByClassName("tablinks")[0].click();

function fetchNgrokUrl() {
    fetch('/ngrok-url')
        .then(response => response.json())
        .then(data => {
            ngrokUrl = data.ngrok_url;
            console.log('Ngrok URL:', ngrokUrl);
        })
        .catch(error => console.error('Error fetching Ngrok URL:', error));
}

function summarizeHistory() {
    const historyText = document.getElementById("historyText").value;
    fetch(`${ngrokUrl}/summarize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ history: historyText })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("historySummary").innerText = data.summary;
    })
    .catch(error => console.error('Error:', error));
}

function suggestTreatment() {
    const symptomsText = document.getElementById("symptomsText").value;
    fetch(`${ngrokUrl}/suggest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ diagnosis: symptomsText })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("treatmentSuggestions").innerText = data.suggestions;
    })
    .catch(error => console.error('Error:', error));
}

// Fetch ngrok URL on page load
window.onload = fetchNgrokUrl;
