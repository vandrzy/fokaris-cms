const { JWT } = require('google-auth-library');
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config({ path: '.env.local' });

async function testRead() {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['akun'];
    const rows = await sheet.getRows();
    console.log(rows[0].toObject()); // let's see properties
    console.log("direct properties:", Object.keys(rows[0]));
    console.log("username via .get():", rows[0].get('username'));
    console.log("username direct:", rows[0].username);
  } catch(e) {
    console.error(e);
  }
}
testRead();
