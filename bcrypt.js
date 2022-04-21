var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("passw0rd123", salt);
var hash2 = bcrypt.hashSync("passw0rd123", salt);
console.log(hash);
console.log(hash);
console.log(salt);
