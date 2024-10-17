this.workoutCount = 0;
this.weightUnit = 'kg';

const workoutCardsSection = document.getElementById('workout-cards');
const noWorkoutsMessage = document.getElementById('no-workouts-message');
const newWorkoutForm = document.getElementById('new-workout-form');
const addWorkoutCard = document.getElementById('add-workout-card');
const showAddFormButton = document.getElementById('show-add-form');

showAddFormButton.addEventListener('click', function () {
    addWorkoutCard.style.display = 'block';
    noWorkoutsMessage.style.display = 'none';
});

newWorkoutForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const workoutName = document.getElementById('workout-name').value.trim();

    if (workoutName === '') {
        alert("Please enter a workout name!");
        return;
    }

    workoutCount++;
    const uniqueId = `workout-${workoutCount}`;

    const workoutCard = document.createElement('div');
    workoutCard.classList.add('workout-card');
    workoutCard.setAttribute('data-id', uniqueId);

    workoutCard.innerHTML = `
        <div class="workout-details">
            <p class="workout-count">0</p>
            <p class="workout-name">${workoutName}</p>
            <p class="workout-status">Unscheduled</p>
        </div>
        <div class="exercise-list" id="${uniqueId}-exercise-list" style="display: none;">
            <div class="exercise-form" style="display: block;">
                <h3 style="color: black;">Add New Set for <strong>${workoutName}</strong></h3>
                <form id="${uniqueId}-set-form">
                    <div class="input-group">
                        <input type="text" id="${uniqueId}-set-name" placeholder="Set Name" required>
                        <input type="number" id="${uniqueId}-number-of-sets" placeholder="Number of Sets" required>
                    </div>
                    <button type="button" id="${uniqueId}-add-set-button" class="submit-button">Add Set</button>
                    <div id="${uniqueId}-set-details" class="set-details"></div>
                </form>
            </div>
        </div>
    `;

    workoutCardsSection.appendChild(workoutCard);
    noWorkoutsMessage.style.display = 'none';
    document.getElementById('workout-name').value = '';
    addWorkoutCard.style.display = 'none';

    const addSetButton = document.getElementById(`${uniqueId}-add-set-button`);
    const setForm = document.getElementById(`${uniqueId}-set-form`);
    const setDetailsDiv = document.getElementById(`${uniqueId}-set-details`);
    const exerciseList = workoutCard.querySelector('.exercise-list');

    addSetButton.addEventListener('click', function () {
        const setName = document.getElementById(`${uniqueId}-set-name`).value.trim();
        const numberOfSets = parseInt(document.getElementById(`${uniqueId}-number-of-sets`).value);

        if (setName === '') {
            alert("Please enter a set name!");
            return;
        }

        if (isNaN(numberOfSets) || numberOfSets <= 0) {
            alert("Please enter a valid number of sets!");
            return;
        }

        setDetailsDiv.innerHTML = '';

        for (let i = 0; i < numberOfSets; i++) {
            const setInputDiv = document.createElement('div');
            setInputDiv.classList.add('set-input');
            setInputDiv.innerHTML = `
                <h4 style="color: black;">${setName} - Rep ${i + 1}</h4>
                <input type="number" id="${uniqueId}-reps-${i}" class="reps-input" placeholder="Reps" required>
                <input type="number" id="${uniqueId}-weight-${i}" class="weight-input" placeholder="Weight (${weightUnit})" required>
            `;
            setDetailsDiv.appendChild(setInputDiv);
        }

        const confirmSetButton = document.createElement('button');
        confirmSetButton.type = 'button';
        confirmSetButton.className = 'submit-button';
        confirmSetButton.textContent = 'Confirm Sets';
        setDetailsDiv.appendChild(confirmSetButton);

        confirmSetButton.addEventListener('click', function () {
            for (let i = 0; i < numberOfSets; i++) {
                const reps = document.getElementById(`${uniqueId}-reps-${i}`).value;
                const weight = document.getElementById(`${uniqueId}-weight-${i}`).value;

                // Find or create a set card for the given set name
                let setCard = exerciseList.querySelector(`.set-card[data-set-name="${setName}"]`);
                if (!setCard) {
                    setCard = document.createElement('div');
                    setCard.classList.add('set-card');
                    setCard.setAttribute('data-set-name', setName);
                    setCard.innerHTML = `
                        <div class="set-details">
                            <p class="set-name">${setName}</p>
                            <ul class="set-reps-and-weights"></ul>
                        </div>
                    `;
                    exerciseList.appendChild(setCard);
                }

                // Add reps and weight to the set card
                const setRepsAndWeightsList = setCard.querySelector('.set-reps-and-weights');
                const setItem = document.createElement('li');
                setItem.setAttribute('style', 'white-space: pre;');
                setItem.textContent = `Set ${i + 1} \r\n`;
                setItem.textContent += `Reps: ${reps} \r\n`;
                setItem.textContent += `Weight: ${weight} ${weightUnit}`;
                setRepsAndWeightsList.appendChild(setItem);
            }

            // Reset the form to its original state
            setForm.reset();
            setDetailsDiv.innerHTML = '';
        });
    });

    workoutCard.addEventListener('click', function (event) {
        if (!event.target.closest('input') && !event.target.closest('button')) {
            toggleExerciseForm(this);
        }
    });
});

function toggleExerciseForm(workoutCard) {
    const exerciseList = workoutCard.querySelector('.exercise-list');
    exerciseList.style.display = exerciseList.style.display === 'none' || exerciseList.style.display === '' ? 'block' : 'none';
}