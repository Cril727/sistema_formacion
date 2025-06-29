import { error } from "node:console";
import { Conexion } from "./Conexion.ts";

interface ProgramaData {
    idprograma: number | null;
    nombre_programa: string;
}

export class Programa {
    public _objPrograma: ProgramaData | null;

    constructor(Objprograma: ProgramaData | null = null) {
        this._objPrograma = Objprograma;
    }

    public async listarPrograma(): Promise<ProgramaData[]> {
        try {
            const result = await Conexion.execute("SELECT * FROM programa");

            if (!result || !result.rows) {
                console.warn("La consulta no trae datos");

                return [];
            }

            return result.rows as ProgramaData[];
        } catch (error) {
            console.log("Error al traer los datos" + error);
            throw new Error("No se pueden traer los datos");
        }
    }

    public async agregarPrograma(): Promise<{ success: boolean; message: string; programa?: Record<string, unknown> }> {
        try {
            if (!this._objPrograma) {
                throw new Error("Objeto no valido");
            }

            const { nombre_programa } = this._objPrograma;

            await Conexion.execute("START TRANSACTION");
            const sql = await Conexion.execute(
                "INSERT INTO programa (nombre_programa) values (?)",
                [nombre_programa],
            );

            if (sql && typeof sql.affectedRows === "number" && sql.affectedRows > 0) {
                const [programa] = await Conexion.query(
                    "SELECT * FROM programa WHERE idprograma = LAST_INSERT_ID()",
                );

                await Conexion.execute("COMMIT");

                return {
                    success: true,
                    message: "Programa agregado correctamento",
                    programa: programa,
                };
            } else {
                throw new Error("Error al agregar el programa");
            }
        } catch (error) {
            await Conexion.execute("ROLLBACK");
            if (error instanceof Error) {
                return {
                    success: false,
                    message: error.message,
                };
            } else {
                return {
                    success: false,
                    message: "Error interno del servidor",
                };
            }
        }
    }

    public async actualizarPrograma(): Promise<{ success: boolean; message: string; programa?: Record<string, unknown>}> {
        try {
            if (!this._objPrograma || !this._objPrograma.idprograma) {
                throw new Error("Objeto no valido O ID no valido");
            }

            const { idprograma, nombre_programa } = this._objPrograma;

            await Conexion.execute("START TRANSACTION");
            const actualizar = await Conexion.execute(
                "UPDATE programa SET nombre_programa = ? WHERE idprograma = ?",
                [nombre_programa, idprograma],
            );

            if(actualizar && typeof actualizar.affectedRows === "number" && actualizar.affectedRows > 0){
                const [programa] = await Conexion.query("SELECT * FROM programa WHERE idprograma = ?",[idprograma],)

                await Conexion.execute("COMMIT")

                return{
                    success:true,
                    message:"Programa actualizado correctamente",
                    programa:programa
                }
            }else{
                throw new  Error("Error al actualizar el programa")
            }
        } catch (error) {
            Conexion.execute("ROLLBACK")
            if(error instanceof Error){
                return{
                    success:false,
                    message:error.message
                }
            }else{
                return{
                    success:false,
                    message:"Error del servidor"
                }
            }
        }
    }
    
}
