document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    const loadingSpinner = document.getElementById('loadingSpinner');

    if (!file) {
        alert('Please select an image file.');
        return;
    }

    const apiKey = '2014efbbdf394c2f821fea7c56f80ccb';
    const endpoint = 'https://eju110624-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/70e73cce-656c-48f5-a8d9-8b8f2ad032e6/classify/iterations/Iteration1/image';

    loadingSpinner.style.display = 'inline-block';

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
        const info = getInfo(data);

        document.getElementById('result').innerText = `Fruit freshness: ${freshness}`;
        document.getElementById('result-info').innerText = `Model certainty: ${info}`;

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Error checking fruit freshness.';
    } finally {
        loadingSpinner.style.display = 'none';
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

function getInfo(data) {
    if (data.predictions && data.predictions.length > 0) {
        const pred = data.predictions[0].probability;
        return `${Number((pred * 100).toFixed(2))} %`;
    }
    return 'Unknown';
}
