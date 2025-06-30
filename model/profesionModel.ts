import { Conexion } from "./Conexion.ts";

interface ProfesionData {
    idprofesion : number | null,
    nombre_profesion : string
}

export class Profesion{

    public _objProfesion : ProfesionData | null;

    constructor(ObjProfesion: ProfesionData | null = null){
        this._objProfesion = ObjProfesion;
    }

    public async listarProfesiones ():Promise<ProfesionData[]>{
        try {
            const result = await Conexion.execute("SELECT * FROM profesion");

            if(!result || !result.rows){
                console.warn("No ha devuelto datos la consulta");
                return [];
            }

            return result.rows as ProfesionData[];

        } catch (error) {
            console.log("Error al obtener las profesiones" + error);
            throw new Error("Error al obtener las profesiones")
        }
    }


    public async agregarProfesion():Promise<{success:boolean, message:string, profesion?: Record <string, unknown>}>{
        try {

            if(!this._objProfesion){
                throw new Error("Objeto no valido")
            }

            const { nombre_profesion } = this._objProfesion;

            await Conexion.execute("START TRANSACTION")
            const agregar = await Conexion.execute("INSERT INTO profesion(nombre_profesion) VALUES (?)", [nombre_profesion],)

            if(agregar && typeof agregar.affectedRows === "number" && agregar.affectedRows>0){
                const [profesion] = await Conexion.query("SELECT * FROM profesion WHERE idprofesion = LAST_INSERT_ID()",);

                await Conexion.execute("COMMIT");

                return {
                    success:true,
                    message:"Pofesion agregada correctamente",
                    profesion: profesion
                }
            }else{
                throw new Error("Error al agregar la profesion")
            }
        } catch (error) {
            await Conexion.execute("ROLLBACK")
            if(error instanceof Error){
                return{
                    success:false,
                    message: error.message
                }
            }else{
                return{
                    success:false,
                    message:"Error de servidor"
                }
            }
        }
    }


    public async actualizarProfesion():Promise<{success:boolean, message:string, profesion?: Record<string,unknown>}>{
        try {

            if(!this._objProfesion || !this._objProfesion.idprofesion){
                throw new Error("Objeto no valido o Id no valido")
            }

            const {idprofesion,nombre_profesion} = this._objProfesion; 

            await Conexion.execute("START TRANSACTION");
            const update = await Conexion.execute(
                "UPDATE profesion SET nombre_profesion = ? WHERE idprofesion = ?"
                ,[
                    nombre_profesion,
                    idprofesion
                ],);

            if(update && typeof update.affectedRows === "number" && update.affectedRows > 0){
                const [profesion] = await Conexion.query("SELECT * FROM profesion WHERE idprofesion = ?",[idprofesion],)

                await Conexion.execute("COMMIT");

                return{
                    success:true,
                    message:"Profesion actualizada correctamente",
                    profesion:profesion
                }
            }else{
                throw new Error("Error al actualizar la profesion")
            }

        } catch (error) {
            if(error instanceof Error){
                return{
                    success:false,
                    message: error.message
                }
            }else{
                return{
                    success:false,
                    message:"Error de servidor"
                }
            }
        }
    }
}