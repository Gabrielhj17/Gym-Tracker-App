document.getElementById('exercise-type').addEventListener('change', function(e) {
    const selected = e.target.value;
    document.querySelectorAll('.exercise-input').forEach(input => input.classList.add('hidden'));
    if (selected === 'sets') {
        document.getElementById('reps').classList.remove('hidden');
        document.getElementById('weight').classList.remove('hidden');
    } else if (selected === 'time') {
        document.getElementById('time').classList.remove('hidden');
    } else if (selected === 'distance') {
        document.getElementById('distance').classList.remove('hidden');
    }
});

document.getElementById('set-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const exercise = document.getElementById('exercise').value;
    const exerciseType = document.getElementById('exercise-type').value;
    let logEntry = exercise;

    if (exerciseType === 'sets') {
        const reps = document.getElementById('reps').value;
        const weight = document.getElementById('weight').value;
        logEntry += ` - ${reps} reps - ${weight} lbs`;
    } else if (exerciseType === 'time') {
        const time = document.getElementById('time').value;
        logEntry += ` - ${time} minutes`;
    } else if (exerciseType === 'distance') {
        const distance = document.getElementById('distance').value;
        logEntry += ` - ${distance} miles`;
    }

    const setItem = document.createElement('li');
    setItem.textContent = logEntry;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        setItem.remove();
    });

    setItem.appendChild(deleteButton);
    document.getElementById('set-list').appendChild(setItem);

    document.getElementById('set-form').reset();
});
const routines = [];

document.getElementById('routine-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const routineName = document.getElementById('routine-name').value;
    const routineSets = [...document.querySelectorAll('#set-list li')].map(li => li.textContent);
    routines.push({ name: routineName, sets: routineSets });
    alert(`${routineName} routine saved!`);
});
