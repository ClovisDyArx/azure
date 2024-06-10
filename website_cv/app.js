document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image file.');
        return;
    }
    
    const apiKey = 'YOUR_AZURE_API_KEY';
    const endpoint = 'YOUR_AZURE_ENDPOINT';
    const apiUrl = `${endpoint}/vision/v3.0/analyze?visualFeatures=Description`;
    
    const reader = new FileReader();
    
    reader.onloadend = async function() {
        const imageData = reader.result.split(',')[1];
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Ocp-Apim-Subscription-Key': apiKey
                },
                body: file
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            const freshness = determineFreshness(data);
            
            document.getElementById('result').innerText = `Fruit freshness: ${freshness}`;
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('result').innerText = 'Error checking fruit freshness.';
        }
    };
    
    reader.readAsDataURL(file);
});

function determineFreshness(data) {
    // TODO: regarder le format de la réponse de azure cv et adapter ce code.
    if (data.description && data.description.captions.length > 0) {
        const caption = data.description.captions[0].text;
        if (caption.includes('fresh')) {
            return 'Fresh';
        } else if (caption.includes('rotten')) {
            return 'Rotten';
        }
    }
    return 'Unknown';
}

