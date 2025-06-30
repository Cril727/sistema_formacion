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
        "SELECT i.nombre AS instructor_nombre, i.apellido AS instructor_apellido, i.email AS instructor_email, p.nombre_profesion AS profesion_nombre FROM instructor_has_profesion ip JOIN instructor i ON ip.instructor_idinstructor = i.idinstructor JOIN profesion p ON ip.profesion_idprofesion = p.idprofesion",
      );

      if(!result || !result.rows){
        console.warn("La consolta no devuelve datos");
        return [];
      }

      return result.rows as InstructorProfesionData[];
    } catch (error) {
        console.log("Error al mostrar los datos" + error);
        throw new Error("Error del servidor no se pueden optener los datos")
    }
  }


  public async agregarInstructorProfesion():Promise<{success:boolean, message:string, instructorProfesion?:Record<string,unknown>}>{
    try {
        if(!this._objInstructorProfesion){
            throw new Error("Objeto invalido")
        }

        const {instructor_idinstructor,profesion_idprofesion} = this._objInstructorProfesion;

        await Conexion.execute("START TRANSACTION");
        const agregar = await Conexion.execute("INSERT INTO instructor_has_profesion (instructor_idinstructor, profesion_idprofesion) VALUES (?, ?)",
            [
                instructor_idinstructor,
                profesion_idprofesion
            ],
        );

        if(agregar && typeof agregar.affectedRows === "number" && agregar.affectedRows >0){
            const [instructorProfesion] = await Conexion.query("SELECT i.idinstructor AS instructor_idinstructor, i.nombre AS instructor_nombre, i.apellido AS instructor_apellido, i.email AS instructor_email, p.idprofesion AS profesion_idprofesion, p.nombre_profesion AS profesion_nombre FROM instructor_has_profesion ip JOIN instructor i ON ip.instructor_idinstructor = i.idinstructor JOIN profesion p ON ip.profesion_idprofesion = p.idprofesion WHERE ip.instructor_idinstructor = ? AND ip.profesion_idprofesion = ? LIMIT 1",
                [instructor_idinstructor, profesion_idprofesion],
            )

            await Conexion.execute("COMMIT");

            return{
                success:true,
                message:"Se ha guardado correctamente la realcion entre instructor y profesion",
                instructorProfesion:instructorProfesion
            }
        }else{
            throw new Error("Error al crear la relacion entre el instructor y la profesion")
        }

    } catch (error) {
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
