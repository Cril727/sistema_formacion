import { Conexion } from "./Conexion.ts";

interface InstructorProfesionData {
  instructor_id: number | null;
  instructor_nombre: string;
  instructor_apellido: string;
  instructor_email: string;
  profesion_id: number | null;
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
}
