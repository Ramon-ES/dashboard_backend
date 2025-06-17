import bcrypt from 'bcryptjs';

async function hashPassword() {
  const plainText = 'eerstewachtwoord'; // change this to your desired password
  const hashed = await bcrypt.hash(plainText, 12);
  console.log('Hashed password:', hashed);
}

hashPassword();