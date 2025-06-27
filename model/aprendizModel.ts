import { Conexion } from "./Conexion.ts";

interface AprendizData {
    idaprendiz: number | null;
    nombre: string,
    apellido: string,
    email: string,
    telefono: string
}


export class Aprendiz {
    public _objAprendiz: AprendizData | null;

    constructor(ObjAprendiz: AprendizData | null = null) {
        this._objAprendiz = ObjAprendiz
    }

    public async listarAprendices(): Promise<AprendizData[]> {

        try {
            const result = await Conexion.execute("SELECT * FROM aprendiz")

            if (!result || !result.rows) {
                console.warn("La consulta no devuelve datos");
                return [];
            }

            return result.rows as AprendizData[];
        } catch (error) {
            console.error("Error al seleccionaer usuario" + error);
            throw new Error("No se pueden obtener los datos")
        }
    }


    public async agregarAprendiz(): Promise<{ success: boolean, message: string, aprendiz?: Record<string, unknown> }> {
        try {
            if (!this._objAprendiz) {
                throw new Error("Objeto no valido")
            }

            const { nombre, apellido, email, telefono } = this._objAprendiz;

            if (!nombre || !apellido || !email || !telefono) {
                throw new Error("Faltan campos requeridos")
            }

            await Conexion.execute("START TRANSACTION");
            const sql = await Conexion.execute("INSERT INTO aprendiz(nombre,apellido,email,telefono) VALUES (?,?,?,?)",
                [nombre, apellido, email, telefono],
            );

            if (sql && typeof sql.affectedRows === "number" && sql.affectedRows > 0) {
                const [aprendiz] = await Conexion.query("SELECT * FROM aprendiz WHERE idaprendiz = LAST_INSERT_ID()",)

                await Conexion.execute("COMMIT");

                return {
                    success: true,
                    message: "Aprendiz Agregado Correctamente",
                    aprendiz: aprendiz
                };
            } else {
                throw new Error('Erro al agregar el aprendiz')
            }

        } catch (error) {
            await Conexion.execute("ROLLBACK");
            if (error instanceof Error) {
                return { success: false, message: error.message };
            } else {
                return { success: false, message: "error interno del servidor" };
            }
        }
    }

}