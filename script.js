// Ngrok URL variable
const ngrokUrl = 'https://b85f-35-234-34-227.ngrok-free.app';  // Replace <your_ngrok_url> with your actual ngrok URL

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

function summarizeHistory() {
    const historyText = document.getElementById("historyText").value;
    fetch(`${ngrokUrl}/summarize`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ history: historyText })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("historySummary").innerText = data.summary;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("historySummary").innerText = 'Error occurred during summary';
    });
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
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById("treatmentSuggestions").innerText = data.suggestions;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById("treatmentSuggestions").innerText = 'Error occurred during treatment suggestion';
    });
}
