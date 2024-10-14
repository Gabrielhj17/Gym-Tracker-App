const exercises = {};

document.getElementById('exercise-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const exerciseName = document.getElementById('exercise').value;
    const reps = document.getElementById('reps').value;
    const weight = document.getElementById('weight').value;

    // Initialize exercise if it doesn't exist
    if (!exercises[exerciseName]) {
        exercises[exerciseName] = [];
    }

    // Add the set to the specific exercise
    exercises[exerciseName].push({ reps, weight });

    // Update the exercise list UI
    updateExerciseCards();

    // Reset the form
    document.getElementById('exercise-form').reset();
});

function updateExerciseCards() {
    const exerciseCardsContainer = document.getElementById('exercise-cards-container');
    exerciseCardsContainer.innerHTML = ''; // Clear current cards

    for (const exercise in exercises) {
        const exerciseCard = document.createElement('div');
        exerciseCard.classList.add('exercise-card');
        exerciseCard.innerHTML = `
            <h4>${exercise}</h4>
            <ul>
                ${exercises[exercise].map(set => `<li>${set.weight} kg - ${set.reps} reps</li>`).join('')}
            </ul>
        `;
        exerciseCardsContainer.appendChild(exerciseCard);
    }
}


// Add event listener to the add set button
document.getElementById('add-set-button').addEventListener('click', function() {
    const selectedExercise = document.querySelector('.selected-exercise');

    // Check if there is a selected exercise
    if (selectedExercise) {
        const exerciseName = selectedExercise.textContent.trim();
        const setList = document.getElementById('set-list');
        
        // If sets are currently displayed, clear them
        if (setList.innerHTML !== '') {
            setList.innerHTML = ''; // Clear displayed sets
            return; // Exit to prevent adding another set
        }

        // Display sets for the selected exercise
        displaySets(exerciseName); 
    }
});

// Update the exercise list UI
function updateExerciseList() {
    const exerciseList = document.getElementById('exercise-list');
    exerciseList.innerHTML = ''; // Clear current list

    for (const exercise in exercises) {
        const li = document.createElement('li');
        li.textContent = exercise;
        li.classList.add('exercise-item');
        li.onclick = function () {
            displaySets(exercise);
        };
        exerciseList.appendChild(li);
    }
}

// Display sets for a selected exercise
function displaySets(exerciseName) {
    const setList = document.getElementById('set-list');
    setList.innerHTML = ''; // Clear current set list

    // Populate the set list with sets of the selected exercise
    exercises[exerciseName].forEach((set) => {
        const li = document.createElement('li');
        li.textContent = `${set.weight} kg - ${set.reps} reps`;
        setList.appendChild(li);
    });

    // Mark the clicked exercise as selected
    const exerciseItems = document.querySelectorAll('.exercise-item');
    exerciseItems.forEach(item => item.classList.remove('selected-exercise')); // Remove any existing selection
    const selectedItem = [...exerciseItems].find(item => item.textContent.trim() === exerciseName);
    if (selectedItem) {
        selectedItem.classList.add('selected-exercise'); // Add selected class to the clicked item
    }

    // Show the exercise form
    const exerciseForm = document.querySelector('.exercise-form');
    exerciseForm.style.display = 'block'; // Show the form
}

// Toggle the exercise form and set list visibility
function toggleExerciseForm(workoutCard) {
    const exerciseList = workoutCard.nextElementSibling; // Get the exercise list associated with the clicked workout
    const displayStyle = exerciseList.style.display;

    // Toggle visibility of the exercise list
    exerciseList.style.display = displayStyle === 'none' || displayStyle === '' ? 'block' : 'none';

    // Always show the add set button at the top
    const addSetButton = exerciseList.querySelector('#add-set-button');
    addSetButton.style.display = 'block'; // Ensure add set button is visible

    // Clear set list if visible
    const setList = exerciseList.querySelector('#set-list');
    if (setList.innerHTML !== '') {
        setList.innerHTML = ''; // Clear displayed sets if they are currently shown
    }
}
