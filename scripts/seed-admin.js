// scripts/seed-admin.js
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { JWT } = require('google-auth-library');

async function seedAdmin() {
  try {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth);

    await doc.loadInfo();
    console.log(`Terhubung ke dokumen: ${doc.title}`);

    let akunSheet = doc.sheetsByTitle['akun'];

    if (!akunSheet) {
      console.log('Sheet "akun" belum ada. Membuat sheet baru...');
      akunSheet = await doc.addSheet({ title: 'akun', headerValues: ['username', 'password'] });
    } else {
      console.log('Sheet "akun" ditemukan.');
    }

    const rows = await akunSheet.getRows();
    const adminRow = rows.find(r => r.get('username') === 'admin');

    const pass = process.env.SEED_ADMIN_PASSWORD;
    if (!pass) throw new Error("SEED_ADMIN_PASSWORD wajib di-set");
    
    const hashedPass = await bcrypt.hash(pass, 12);

    if (adminRow) {
      console.log('Akun admin sudah ada di spreadsheet. Melakukan migrasi/reset password...');
      adminRow.set('password', hashedPass);
      await adminRow.save();
      console.log('Password admin berhasil direset dengan bcrypt hash!');
    } else {
      console.log('Menambahkan akun admin...');
      await akunSheet.addRow({ username: 'admin', password: hashedPass });
      console.log('Akun admin berhasil ditambahkan!');
    }

  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
}

seedAdmin();
