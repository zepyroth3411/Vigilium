// backend/utils/cronConexiones.js
const db = require('../db')

async function verificarDispositivosConectados() {
  const sql = `
    UPDATE dispositivos d
    LEFT JOIN (
      SELECT id_dispositivo, MAX(fecha_hora) AS ultima_fecha
      FROM eventos
      GROUP BY id_dispositivo
    ) e ON d.id_dispositivo = e.id_dispositivo
    SET d.estado = 'desconectado'
    WHERE TIMESTAMPDIFF(MINUTE, e.ultima_fecha, NOW()) > 3
      OR e.ultima_fecha IS NULL
  `

  try {
    const [result] = await db.promise().query(sql)
    console.log(`🔄 Dispositivos actualizados: ${result.affectedRows}`)
  } catch (err) {
    console.error('❌ Error actualizando estado de conexión:', err)
  }
}

module.exports = verificarDispositivosConectados
