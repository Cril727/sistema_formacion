import console from "node:console";
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
            console.error("Error al seleccionar los aprendices" + error);
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


    public async actualizarAprendiz():Promise<{success:boolean, message:string, aprendiz?:Record<string,unknown>}>{
        try {

            if(!this._objAprendiz || !this._objAprendiz.idaprendiz){
                throw new Error("Objeto no valido O ID del aprendiz no valido")
            }


            const {idaprendiz,nombre,apellido,email,telefono} = this._objAprendiz;

            if(!idaprendiz || !nombre || !apellido || !email || !telefono){
                throw new Error("Hacen falta campos requeridos")
            }

            await Conexion.execute("START TRANSACTION");
            const update = await Conexion.execute("UPDATE aprendiz SET nombre = ?,apellido = ?,email = ?,telefono = ? WHERE idaprendiz = ?",
                [nombre,apellido,email,telefono,idaprendiz],
            )

            if(update && typeof update.affectedRows === "number" && update.affectedRows > 0){
                const [aprendiz] = await Conexion.query("SELECT * FROM aprendiz WHERE idaprendiz = ?",[idaprendiz],)

                await Conexion.execute("COMMIT");

                return {
                    success: true,
                    message:"Usuario actualizado correctamente",
                    aprendiz: aprendiz
                }
            }else{
                throw new Error("Error al agregar el aprendiz")
            }

        } catch (error) {
            await Conexion.execute("ROLLBACK")
            if(error instanceof Error){
                return{
                    success:false,
                    message:error.message
                }
            }else{
                return{
                    success:false,
                    message:"Error de seridor al actualizar ususario"
                }
            }
        }
    }


    public async eliminarAprendiz(idaprendiz:number):Promise<{success:boolean, message:string}>{
        try {
            await Conexion.execute("START TRANSACTION");

            const eliminar = await Conexion.execute("DELETE FROM aprendiz WHERE idaprendiz = ?",[idaprendiz])

            if(eliminar && typeof eliminar.affectedRows === "number" && eliminar.affectedRows>0){
                await Conexion.execute("COMMIT");

                return{
                    success:true,
                    message:"Aprendiz eliminado correctamente",
                }
            }else{
                throw new Error("Erro al  eliminar el usuario")
            }
        } catch (error) {
            await Conexion.execute("ROLLBACK");
            if(error instanceof Error){
                return{
                    success:false,
                    message:error.message
                }
            }else{
                return{
                    success:false,
                    message:"Error interno del servidor"
                }
            }
        }
    }

}