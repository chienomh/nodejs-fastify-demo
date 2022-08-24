const bcrypt = require("bcryptjs");

async function checkPassword(passwordBody: String, passworDB: String) {
  return await bcrypt.compare(passwordBody, passworDB);
}

export { checkPassword };
