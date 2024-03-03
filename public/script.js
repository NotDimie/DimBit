document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit-button');
    const studyPlanContainer = document.getElementById('study-plan-container');

    submitButton.addEventListener('click', async () => {
        const grade = document.getElementById('grade').value;
        const topic = document.getElementById('topic').value;
        const time = document.getElementById('time').value;

        try {
            const response = await fetch('/generate_study_plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ grade, topic, time })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data && data.studyPlan) {
                studyPlanContainer.textContent = data.studyPlan;
            } else {
                throw new Error('No study plan returned from API');
            }
        } catch (error) {
            console.error('Error:', error);
            studyPlanContainer.textContent = 'Error generating study plan. Please try again later.';
        }
    });
});
