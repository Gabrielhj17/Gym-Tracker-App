let workoutCount = 0; // Counter to create unique IDs for workout cards
let exercises = {}; // Object to store exercises
let weightUnit = 'kg'; // Default weight unit

// References to DOM elements
const workoutCardsSection = document.getElementById('workout-cards'); // Section where workout cards will be appended
const noWorkoutsMessage = document.getElementById('no-workouts-message'); // Message to be hidden when a workout is added
const newWorkoutForm = document.getElementById('new-workout-form'); // Reference to the workout form
const addWorkoutCard = document.getElementById('add-workout-card'); // Form container (hidden by default)
const showAddFormButton = document.getElementById('show-add-form'); // "+" button to show the form

// Show the "Add Workout" form when "+" button is clicked
showAddFormButton.addEventListener('click', function () {
    addWorkoutCard.style.display = 'block'; // Show the form
    noWorkoutsMessage.style.display = 'none'; // Hide the "no workouts" message
});

// Listen for form submission to add a new workout
newWorkoutForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from reloading the page

    // Get the workout name from the input field
    const workoutName = document.getElementById('workout-name').value.trim(); // Use trim() to remove extra spaces

    // Check if the workout name is provided
    if (workoutName === '') {
        alert("Please enter a workout name!");
        return; // Stop if workout name is empty
    }

    // Increment the workout count to create a unique ID
    workoutCount++;
    const uniqueId = `workout-${workoutCount}`;

    // Create a new workout card
    const workoutCard = document.createElement('div');
    workoutCard.classList.add('workout-card');
    workoutCard.setAttribute('data-id', uniqueId); // Use a data attribute for reference

    // Workout card structure
    workoutCard.innerHTML = `
        <div class="workout-details">
            <p class="workout-count">0</p>
            <p class="workout-name">${workoutName}</p>
            <p class="workout-status">Unscheduled</p>
        </div>
        <div class="exercise-list" id="${uniqueId}-exercise-list" style="display: none;">
            <div class="exercise-form" style="display: block;">
                <h3>Add New Set</h3>
                <form id="${uniqueId}-set-form">
                    <div class="input-group">
                        <input type="text" id="${uniqueId}-set-name" placeholder="Set Name" required>
                    </div>
                    <div class="input-group">
                        <input type="number" id="${uniqueId}-number-of-sets" placeholder="Number of Sets" required>
                    </div>
                    <button type="submit" class="submit-button">Add Sets</button>
                </form>
            </div>
            <div id="${uniqueId}-set-list"></div> <!-- Unique set list ID -->
        </div>
    `;

    // Append the new workout card to the workout cards section
    workoutCardsSection.appendChild(workoutCard);

    // Hide the "no workouts" message if it's visible
    noWorkoutsMessage.style.display = 'none';

    // Clear the input field after the workout is added
    document.getElementById('workout-name').value = '';

    // Hide the form after adding the workout
    addWorkoutCard.style.display = 'none';

    // Add event listener for the new set form
    document.getElementById(`${uniqueId}-set-form`).addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent page reload

        const setName = document.getElementById(`${uniqueId}-set-name`).value.trim();
        const numberOfSets = parseInt(document.getElementById(`${uniqueId}-number-of-sets`).value);

        // Check if the set name and number of sets are valid
        if (setName === '' || isNaN(numberOfSets) || numberOfSets <= 0) {
            alert("Please enter valid set information!");
            return;
        }

        // Create an array to store weights for each set
        let setWeights = [];
        for (let i = 1; i <= numberOfSets; i++) {
            setWeights.push({ reps: 0, weight: 0 });
        }

        // Create input forms for each set
        setWeights.forEach((_, index) => {
            const setInputDiv = document.createElement('div');
            setInputDiv.classList.add('set-input');

            setInputDiv.innerHTML = `
                <h4>${setName} Set ${index + 1}</h4>
                <input type="number" placeholder="Reps" class="${uniqueId}-reps" required>
                <label for="${uniqueId}-weight">Weight</label>
                <button type="button" class="${uniqueId}-weight-toggle" data-set-index="${index}">Switch to lbs</button>
                <input type="number" placeholder="Weight (kg)" class="${uniqueId}-weight" required>
            `;

            document.getElementById(`${uniqueId}-set-list`).appendChild(setInputDiv);
        });

        // Reset the form
        document.getElementById(`${uniqueId}-set-form`).reset();

        // Add event listeners to all weight toggle buttons and add set buttons
        setWeights.forEach((_, index) => {
            const weightToggleButton = setInputDiv.querySelector(`.${uniqueId}-weight-toggle[data-set-index="${index}"]`);
            const addSetButton = setInputDiv.querySelector(`.${uniqueId}-add-set[data-set-index="${index}"]`);

            weightToggleButton.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent click event from bubbling up
                weightUnit = weightUnit === 'kg' ? 'lbs' : 'kg'; // Toggle the unit
                this.textContent = weightUnit === 'kg' ? 'Switch to lbs' : 'Switch to kg'; // Update button text
                setInputDiv.querySelector(`.${uniqueId}-weight`).placeholder = `Weight (${weightUnit})`; // Update placeholder text
            });

            addSetButton.addEventListener('click', function() {
                const reps = setInputDiv.querySelector(`.${uniqueId}-reps`).value;
                const weightInput = setInputDiv.querySelector(`.${uniqueId}-weight`).value;

                // Convert weight to kg if the unit is lbs
                let weight = weightInput;
                if (weightUnit === 'lbs') {
                    weight = (weightInput * 0.453592).toFixed(2); // Convert lbs to kg
                }

                // Add the set to the specific exercise
                exercises[setName] = exercises[setName] || []; // Initialize exercise if it doesn't exist
                exercises[setName].push({ reps, weight }); // Store the set details

                // Update the exercise list UI for this specific workout
                updateExerciseList(uniqueId);

                // Reset the input fields
                setInputDiv.querySelector(`.${uniqueId}-reps`).value = '';
                setInputDiv.querySelector(`.${uniqueId}-weight`).value = '';
            });
        });
    });

    // Attach click event to workout card
    workoutCard.addEventListener('click', function (event) {
        // Only toggle if the click is not on an input or button
        if (!event.target.closest('input') && !event.target.closest('button')) {
            toggleExerciseForm(this);
        }
    });
});

// Update the exercise list UI for a specific workout
function updateExerciseList(uniqueId) {
    const setList = document.getElementById(`${uniqueId}-set-list`);
    setList.innerHTML = ''; // Clear current set list

    for (const exercise in exercises) {
        const li = document.createElement('li');
        li.textContent = `${exercise} - ${exercises[exercise].length} sets`;
        li.classList.add('exercise-item');
        li.onclick = function () {
            displaySets(exercise, uniqueId);
        };
        setList.appendChild(li);
    }
}

// Display sets for a selected exercise
function displaySets(exerciseName, uniqueId) {
    const setList = document.getElementById(`${uniqueId}-set-list`);
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
    const exerciseList = workoutCard.querySelector('.exercise-list'); // Get the exercise list associated with the clicked workout
    exerciseList.style.display = exerciseList.style.display === 'none' || exerciseList.style.display === '' ? 'block' : 'none'; // Toggle visibility
}
