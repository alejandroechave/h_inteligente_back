var pool = require('./bd');

// Función para obtener todos los productos
async function getProductos() {
    var query = "SELECT * FROM productos ORDER BY id DESC";
    var rows = await pool.query(query);
    return rows;
}

// Función para insertar un nuevo producto
async function insertProducto(obj) {
    try {
        var query = "INSERT INTO productos SET ?";
        var rows = await pool.query(query, [obj]);
        return rows;
    } catch (error) {
        console.log("Error al insertar producto:", error);
        throw error;
    }
}

// Función para eliminar un producto por su ID
async function deleteProductoById(id) {
    var query = "DELETE FROM productos WHERE id = ?";
    var rows = await pool.query(query, [id]);
    return rows;
}

// Función para obtener un producto por ID
async function getProductoById(id) {
    const query = 'SELECT * FROM productos WHERE id = ?';
    const rows = await pool.query(query, [id]);
    return rows[0]; // Retorna la primera fila (producto) encontrada
}

// Función para actualizar un producto
async function updateProducto(id, data) {
    const query = 'UPDATE productos SET titulo = ?, descripcion = ?, img_id = ? WHERE id = ?';
    await pool.query(query, [data.titulo, data.descripcion, data.img_id, id]);
}

module.exports = { 
    getProductos, 
    insertProducto, 
    deleteProductoById, 
    getProductoById, 
    updateProducto 
};
