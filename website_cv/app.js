document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select an image file.');
        return;
    }
    
    const apiKey = '2014efbbdf394c2f821fea7c56f80ccb';
    const endpoint = 'https://eju110624-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/70e73cce-656c-48f5-a8d9-8b8f2ad032e6/classify/iterations/Iteration1/image';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Prediction-Key': apiKey
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
});

function determineFreshness(data) {
    if (data.predictions && data.predictions.length > 0) {
        const topPrediction = data.predictions[0];
        if (topPrediction.tagName.toLowerCase().includes('fresh')) {
            return 'Fresh';
        } else if (topPrediction.tagName.toLowerCase().includes('rotten')) {
            return 'Rotten';
        }
    }
    return 'Unknown';
}

