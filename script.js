const exercises = {};
let weightUnit = 'kg'; // Default unit

// Function to handle weight unit toggle in the exercise form
document.getElementById('weight-toggle').addEventListener('click', function() {
    weightUnit = weightUnit === 'kg' ? 'lbs' : 'kg'; // Toggle the unit
    const toggleButton = document.getElementById('weight-toggle');
    toggleButton.textContent = weightUnit === 'kg' ? 'Switch to lbs' : 'Switch to kg'; // Update button text
    document.getElementById('weight').placeholder = `Weight (${weightUnit})`; // Update placeholder text
});

// Modify the existing form submission to convert weights if needed
document.getElementById('exercise-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const exerciseName = document.getElementById('exercise').value;
    const reps = document.getElementById('reps').value;
    const weightInput = document.getElementById('weight').value;

    // Convert weight to kg if the unit is lbs
    let weight = weightInput;
    if (weightUnit === 'lbs') {
        weight = (weightInput * 0.453592).toFixed(2); // Convert lbs to kg
    }

    // Initialize exercise if it doesn't exist
    if (!exercises[exerciseName]) {
        exercises[exerciseName] = [];
    }

    // Add the set to the specific exercise
    exercises[exerciseName].push({ reps, weight });

    // Update the exercise list UI
    updateExerciseList();

    // Reset the form
    document.getElementById('exercise-form').reset();
});

// Update the exercise list UI
function updateExerciseList() {
    const setList = document.getElementById('set-list');
    setList.innerHTML = ''; // Clear current set list

    for (const exercise in exercises) {
        const li = document.createElement('li');
        li.textContent = `${exercise} - ${exercises[exercise].length} sets`;
        li.classList.add('exercise-item');
        li.onclick = function () {
            displaySets(exercise);
        };
        setList.appendChild(li);
    }
}

// Display sets for a selected exercise
function displaySets(exerciseName) {
    const setList = document.getElementById('set-list');
    setList.innerHTML = ''; // Clear current set list

    // Populate the set list with sets of the selected exercise
    exercises[exerciseName].forEach((set) => {
        const li = document.createElement('li');
        li.textContent = `${set.weight} ${weightUnit} - ${set.reps} reps`; // Use the current weight unit
        setList.appendChild(li);
    });
}

// Toggle the exercise form and set list visibility
function toggleExerciseForm(workoutCard) {
    const exerciseList = workoutCard.nextElementSibling; // Get the exercise list associated with the clicked workout
    exerciseList.style.display = exerciseList.style.display === 'none' || exerciseList.style.display === '' ? 'block' : 'none'; // Toggle visibility

    // Always show the add set button at the top
    const addSetButton = exerciseList.querySelector('#add-set-button');
    addSetButton.style.display = 'block'; // Ensure add set button is visible

    // Clear set list if visible
    const setList = exerciseList.querySelector('#set-list');
    if (setList.innerHTML !== '') {
        setList.innerHTML = ''; // Clear displayed sets if they are currently shown
    }
}

// Get the "+" button and form elements
const addButton = document.getElementById('show-add-form');
const newWorkoutForm = document.getElementById('add-workout-card'); // Corrected to reference the right ID

// Add click event listener to the "+" button
addButton.addEventListener('click', function() {
    // Toggle the display of the workout form
    if (newWorkoutForm.style.display === 'none' || newWorkoutForm.style.display === '') {
        newWorkoutForm.style.display = 'block'; // Show the form
        addButton.textContent = '-'; // Change to minus if form is shown
    } else {
        newWorkoutForm.style.display = 'none'; // Hide the form
        addButton.textContent = '+'; // Change back to plus if hidden
    }
});


// Handle form submission for new workouts
newWorkoutForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent page reload

    // Get the workout name from the input field
    const workoutName = document.getElementById('workout-name').value;

    // Create a new workout card
    const workoutCard = document.createElement('div');
    workoutCard.classList.add('workout-card');
    workoutCard.onclick = function() { toggleExerciseForm(this); };

    workoutCard.innerHTML = `
        <div class="workout-details">
            <p class="workout-count">0</p>
            <p class="workout-name">${workoutName}</p>
            <p class="workout-status">Unscheduled</p>
        </div>
        <button class="options-icon" aria-label="More Options">&#8942;</button>
        <div class="exercise-list" style="display: none;">
            <div class="exercise-form" style="display: block;">
                <h3>Add New Set</h3>
                <form id="exercise-form">
                    <div class="input-group">
                        <input type="text" id="exercise" placeholder="Exercise Name" required>
                    </div>
                    <div class="input-group">
                        <input type="number" id="reps" placeholder="Reps" required>
                    </div>
                    <div class="input-group">
                        <label for="weight">Weight</label>
                        <button id="weight-toggle" type="button">Switch to lbs</button>
                        <input type="number" id="weight" placeholder="Weight (kg)" required>
                    </div>
                    <button type="submit" class="submit-button">Add Set</button>
                </form>
            </div>
            <div id="set-list"></div> <!-- Container for sets -->
        </div>
    `;

    // Append the new workout card to the workout cards section
    document.querySelector('.workout-cards').appendChild(workoutCard);

    // Clear the input field
    document.getElementById('workout-name').value = '';
});
