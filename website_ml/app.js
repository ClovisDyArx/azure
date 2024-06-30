document.getElementById('ingredientForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const ingredient1 = document.getElementById('ingredient1').value;
    const ingredient2 = document.getElementById('ingredient2').value;
    const ingredient3 = document.getElementById('ingredient3').value;
    const loadingSpinner = document.getElementById('loadingSpinner');

    const apiKey = 'YDKjIN0aEDzMZN4mGbdD7uI927ypGnhU';
    const endpoint = 'http://9057999d-f5f9-4d00-a70b-2ce2a017952b.francecentral.azurecontainer.io/score';

    const data = {
        "Inputs": {
            "input1": [
                {
                    "Ingredient 1": ingredient1,
                    "Ingredient 2": ingredient2,
                    "Ingredient 3": ingredient3
                }
            ]
        },
        "GlobalParameters": {}
    };

    loadingSpinner.style.display = 'inline-block';

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        const result = responseData.Results.WebServiceOutput0[0]["Classification Output"];

        document.getElementById('result').innerText = `Compatibility: ${result}`;

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Error checking compatibility.';
    } finally {
        loadingSpinner.style.display = 'none';
    }
});
