document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit-button');

    submitButton.addEventListener('click', async () => {
        // Get the input values
        const gradeValue = document.getElementById('grade').value;
        const topicValue = document.getElementById('topic').value;
        const timeValue = document.getElementById('time').value;

        // Construct the text to copy to clipboard
        const textToCopy = `I'm in Grade ${gradeValue} and I would like to revise this topic "${topicValue}" in ${timeValue} minutes.`;

        try {
            // Copy text to clipboard
            await navigator.clipboard.writeText(textToCopy);

            // Redirect to the GPT link
            window.location.href = 'https://chat.openai.com/g/g-bgc7pXzhy-educator-explainer';
        } catch (error) {
            // Handle errors, if any
            console.error('Failed to copy text to clipboard:', error);
            alert('Error: Failed to copy text to clipboard. Please try again.');
        }
    });
});
