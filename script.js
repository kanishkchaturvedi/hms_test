// Ngrok URL to your Flask server (update this with your actual Ngrok URL)
const ngrokUrl = 'https://b85f-35-234-34-227.ngrok-free.app';

function openTab(evt, tabName) {
    // Hide all elements with class="tabcontent" and remove the class "active"
    const tabcontents = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
    }

    // Show the specific tab content
    document.getElementById(tabName).style.display = "block";
}

async function summarizeHistory() {
    const historyInput = document.getElementById('historyInput').value.trim();
    if (!historyInput) {
        alert('Please enter patient history.');
        return;
    }

    try {
        const response = await fetch(`${ngrokUrl}/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ history: historyInput })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById('historySummary').innerText = data.summary;
    } catch (error) {
        console.error('Error summarizing history:', error);
    }
}

async function suggestTreatment() {
    const symptomsInput = document.getElementById('symptomsInput').value.trim();
    if (!symptomsInput) {
        alert('Please enter patient symptoms.');
        return;
    }

    try {
        const response = await fetch(`${ngrokUrl}/suggest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ diagnosis: symptomsInput })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById('treatmentSuggestions').innerText = data.suggestions;
    } catch (error) {
        console.error('Error suggesting treatment:', error);
    }
}

// Initial setup: Show default tab
document.getElementById('patientHistory').style.display = 'block';
