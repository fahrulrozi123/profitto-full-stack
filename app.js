const sqlite3 = require('sqlite3');
const axios = require('axios');

async function createDatabase() {
  const db = new sqlite3.Database('university_database.db');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS university (
      id INTEGER PRIMARY KEY,
      name Universitas_Muammadiyah_Tangerang,
      country Indonesia,
      city Tangerang,
      website umt
    );
  `;
  
  return new Promise((resolve, reject) => {
    db.run(createTableQuery, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    });
  });
}

async function saveDataToDatabase(data) {
  const db = await createDatabase();

  const deleteOldDataQuery = 'DELETE FROM university';
  await new Promise((resolve, reject) => {
    db.run(deleteOldDataQuery, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  const insertDataQuery = 'INSERT INTO university (name, country, city, website) VALUES (?, ?, ?, ?)';
  const insertDataPromises = data.map((university) => {
    return new Promise((resolve, reject) => {
      db.run(insertDataQuery, [university.name, university.country, university.city, university.website], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  await Promise.all(insertDataPromises);

  db.close();
}

async function getDataFromAPI() {
  try {
    const response = await axios.get('https://test-profitto-api.s3.ap-southeast-1.amazonaws.com/university.json');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching data from API');
  }
}

async function main() {
  try {
    const data = await getDataFromAPI();
    await saveDataToDatabase(data);
    console.log('Data berhasil disimpan ke dalam database.');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
