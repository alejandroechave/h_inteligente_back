var pool = require('./bd');
var md5 = require('md5');

async function getUserByUsernameAndPassword(user, password) {
    try {
        var query = "select * from acceso where usuario = ? and password = ? limit 1";
        var rows = await pool.query(query, [user, md5(password)]);
        return rows[0];
    } catch (error) {
        console.log("Error en la consulta:", error);
        throw error; // Lanza el error para que se maneje en la ruta
    }
}

module.exports = { getUserByUsernameAndPassword };
