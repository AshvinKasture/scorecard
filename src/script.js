const { ipcRenderer } = require('electron');

document.querySelector('#insert').addEventListener('click', (e) => {
  let newScore = {
    name: document.querySelector('#nameinp').value,
    score: parseInt(document.querySelector('#scoreinp').value),
  };

  ipcRenderer.send('add', newScore);
  updateDB();
});

const updateDB = () => {
  ipcRenderer.send('getScores', '');
};

ipcRenderer.on('update', (event, args) => {
  console.log('got reply');
  let response = args;
  console.log(response);
  if (response.length > 0) {
    document.querySelector('#no-records').style.display = 'none';
  } else {
    document.querySelector('#no-records').style.display = 'block';
  }
  let currentRecords = document.querySelector('tbody').children;
  console.log(`current records are`);
  console.log(`current records are ${currentRecords.length}`);
  //   for (let i = 0; i < currentRecords.length; i++) {
  //     console.log(`removing record ${i}`);
  //     currentRecords[0].remove();
  //   }
  while (currentRecords.length > 0) {
    currentRecords[0].remove();
  }
  console.log(`after removing, ${currentRecords.length} remoan`);
  for (let i = 0; i < response.length; i++) {
    let newRow = document.createElement('tr');
    let name = document.createElement('td');
    let nameText = document.createTextNode(response[i].name);
    name.appendChild(nameText);
    let score = document.createElement('td');
    let scoreText = document.createTextNode(response[i].score);
    score.appendChild(scoreText);
    newRow.appendChild(name);
    newRow.appendChild(score);
    document.querySelector('tbody').appendChild(newRow);
    console.log(`appended ${i}`);
  }
});

document.querySelector('#reset').addEventListener('click', () => {
  ipcRenderer.send('reset', '');
  setTimeout(updateDB, 1000);
});

updateDB();
