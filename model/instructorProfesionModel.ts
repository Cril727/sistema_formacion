import { Conexion } from "./Conexion.ts";

interface InstructorProfesionData {
    instructor_idinstructor: number | null;
    instructor_nombre: string;
    instructor_apellido: string;
    instructor_email: string;
    profesion_idprofesion: number | null;
    profesion_nombre: string;
}

export class InstructorProfesion {
    public _objInstructorProfesion: InstructorProfesionData | null = null;

    constructor(ObjInstructorProfesion: InstructorProfesionData | null = null) {
        this._objInstructorProfesion = ObjInstructorProfesion;
    }

    public async listarInstructorProfesion(): Promise<InstructorProfesionData[]> {
        try {
            const result = await Conexion.execute(
                `SELECT
         i.idinstructor           AS instructor_idinstructor,
         i.nombre                AS instructor_nombre,
         i.apellido              AS instructor_apellido,
         i.email                 AS instructor_email,
         p.idprofesion           AS profesion_idprofesion,
         p.nombre_profesion      AS profesion_nombre
       FROM instructor_has_profesion ip
       JOIN instructor i ON ip.instructor_idinstructor = i.idinstructor
       JOIN profesion  p ON ip.profesion_idprofesion  = p.idprofesion`
            );

            if (!result || !result.rows) {
                console.warn("La consolta no devuelve datos");
                return [];
            }

            return result.rows as InstructorProfesionData[];
        } catch (error) {
            console.log("Error al mostrar los datos" + error);
            throw new Error("Error del servidor no se pueden optener los datos");
        }
    }

    public async agregarInstructorProfesion(): Promise<{ success: boolean; message: string; instructorProfesion?: Record<string, unknown>; }> {
        try {
            if (!this._objInstructorProfesion) {
                throw new Error("Objeto invalido");
            }

            const { instructor_idinstructor, profesion_idprofesion } =
                this._objInstructorProfesion;

            await Conexion.execute("START TRANSACTION");
            const agregar = await Conexion.execute(
                "INSERT INTO instructor_has_profesion (instructor_idinstructor, profesion_idprofesion) VALUES (?, ?)",
                [
                    instructor_idinstructor,
                    profesion_idprofesion,
                ],
            );

            if (
                agregar && typeof agregar.affectedRows === "number" &&
                agregar.affectedRows > 0
            ) {
                const [instructorProfesion] = await Conexion.query(
                    "SELECT i.idinstructor AS instructor_idinstructor, i.nombre AS instructor_nombre, i.apellido AS instructor_apellido, i.email AS instructor_email, p.idprofesion AS profesion_idprofesion, p.nombre_profesion AS profesion_nombre FROM instructor_has_profesion ip JOIN instructor i ON ip.instructor_idinstructor = i.idinstructor JOIN profesion p ON ip.profesion_idprofesion = p.idprofesion WHERE ip.instructor_idinstructor = ? AND ip.profesion_idprofesion = ? LIMIT 1",
                    [instructor_idinstructor, profesion_idprofesion],
                );

                await Conexion.execute("COMMIT");

                return {
                    success: true,
                    message:
                        "Se ha guardado correctamente la realcion entre instructor y profesion",
                    instructorProfesion: instructorProfesion,
                };
            } else {
                throw new Error(
                    "Error al crear la relacion entre el instructor y la profesion",
                );
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
                    message: "Error del servidor",
                };
            }
        }
    }


  public async actualizarInstructorProfesion(): Promise<{success: boolean;message: string;instructorProfesion?: Record<string, unknown>;}> {
    try {

      if (!this._objInstructorProfesion ||!this._objInstructorProfesion.instructor_idinstructor ||!this._objInstructorProfesion.profesion_idprofesion) {
        throw new Error(
          "Objeto no válido o faltan instructor_idinstructor, oldProfesionId o profesion_idprofesion"
        );
      }

      const {instructor_idinstructor,profesion_idprofesion} = this._objInstructorProfesion;

      if(!instructor_idinstructor || !profesion_idprofesion){
        throw new Error("Faltan datos")
      }

      await Conexion.execute("START TRANSACTION");

        const update = await Conexion.execute(
        `UPDATE instructor_has_profesion
           SET profesion_idprofesion = ?
         WHERE instructor_idinstructor = ?`,
        [profesion_idprofesion, instructor_idinstructor],
        );

      if (update &&typeof update.affectedRows === "number" &&update.affectedRows > 0) {

        const [instructorProfesion] = await Conexion.query(
        `SELECT
            i.idinstructor           AS instructor_idinstructor,
            i.nombre                AS instructor_nombre,
            i.apellido              AS instructor_apellido,
            i.email                 AS instructor_email,
            p.idprofesion           AS profesion_idprofesion,
            p.nombre_profesion      AS profesion_nombre
        FROM instructor_has_profesion ip
        JOIN instructor i ON ip.instructor_idinstructor = i.idinstructor
        JOIN profesion p  ON ip.profesion_idprofesion  = p.idprofesion
        WHERE ip.instructor_idinstructor = ?
        LIMIT 1`,
        [instructor_idinstructor]
        );

        await Conexion.execute("COMMIT");
        return {
          success: true,
          message: "Relación actualizada correctamente",
          instructorProfesion,
        };
      } else {
        throw new Error("Error al actualizar la relación");
      }
    } catch (error) {
      await Conexion.execute("ROLLBACK");

      if (error instanceof Error) {
        return { success: false, message: error.message };
      } else {
        return {success: false,message: "Error del servidor al actualizar relación",};
      }
    }
    }


    public async eliminarInstructorProfesion(instructor_idinstructor:number, profesion_idprofesion:number):Promise<{success:boolean, message:string}>{
    try {
        await Conexion.execute("START TRANSACTION");

        const eliminar = await Conexion.execute(
        `DELETE FROM instructor_has_profesion
         WHERE instructor_idinstructor = ?
           AND profesion_idprofesion = ?`,
        [instructor_idinstructor, profesion_idprofesion],
        );

       if(eliminar && typeof eliminar.affectedRows === "number" && eliminar.affectedRows>0){
            await Conexion.execute("COMMIT");

            return{
             success:true,
             message:"Relacion entre instructor y profesion eliminada"
            }
       }else{
        throw new Error("Error al eliminar la relacion")
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


