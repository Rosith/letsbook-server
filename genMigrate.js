const fs = require('fs');

let args = process.argv[2] || '';

const migrationsFolder = './migrations/';

const round = (number) => {
  return Number(number) < 10 ? `0${number}` : number;
};

const getTimeStamp = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = round(currentDate.getMonth() + 1);
  const day = round(currentDate.getDate());
  const hour = round(currentDate.getHours());
  const minute = round(currentDate.getMinutes());
  const second = round(currentDate.getSeconds());

  return `${year}${month}${day}${hour}${minute}${second}`;
};

/* eslint-disable no-console */
const createFile = filePath => {
  fs.writeFile(filePath, '', (err) => {
    if (err) {
      console.log(err);
    }
    console.log(`Migration script ${filePath} created!`);
  });
};

(scriptName => {
  if (scriptName) {
    scriptName = scriptName.replace(/^./, str => str.toLowerCase()).replace(/\s+./g, str => str.trim().toUpperCase());

    let timeStamp = getTimeStamp();//`${year}${month}${day}${hour}${minute}${second}`;
    let doFile = `${migrationsFolder}${timeStamp}.do.${scriptName}.sql`;
    let undoFile = `${migrationsFolder}${timeStamp}.undo.${scriptName}.sql`;
    createFile(doFile);
    createFile(undoFile);
  }
  else {
    console.log('Invalid script name!');
  }

})(args);

/* eslint-enable no-console */
