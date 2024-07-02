document.getElementById('ingredientForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'inline-block';

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/check_compatibility', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('result').innerText = `Compatibility: ${result.compatibility}`;
        } else {
            document.getElementById('result').innerText = 'Error checking compatibility.';
            console.error('Error:', result);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerText = 'Error checking compatibility.';
    } finally {
        loadingSpinner.style.display = 'none';
    }
});

