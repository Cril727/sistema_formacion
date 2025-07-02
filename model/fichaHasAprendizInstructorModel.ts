import { Conexion } from "./Conexion.ts";

interface RelacionData {
  ficha_idficha: number;
  aprendiz_idaprendiz: number;
  instructor_idinstructor: number;
}

export class FichaHasAprendizInstructor {
  private _relacion: RelacionData | null;

  constructor(relacion: RelacionData | null = null) {
    this._relacion = relacion;
  }

  public async listarRelaciones(): Promise<RelacionData[]> {
    try {
      const result = await Conexion.execute(`SELECT
  
  f.idficha,
  f.codigo,
  f.fecha_inicio_lectiva,
  f.fecha_fin_lectiva,
  f.fecha_fin_practica,
  f.programa_idprograma,


  a.idaprendiz,
  a.nombre AS nombre_aprendiz,
  a.apellido AS apellido_aprendiz,
  a.email AS email_aprendiz,
  a.telefono AS telefono_aprendiz,

 
  i.idinstructor,
  i.nombre AS nombre_instructor,
  i.apellido AS apellido_instructor,
  i.email AS email_instructor,
  i.telefono AS telefono_instructor

FROM ficha_has_aprendiz_instructor fhai
JOIN ficha f ON fhai.ficha_idficha = f.idficha
JOIN aprendiz a ON fhai.aprendiz_idaprendiz = a.idaprendiz
JOIN instructor i ON fhai.instructor_idinstructor = i.idinstructor;
`);

      if (!result || !result.rows) {
        console.warn("No se encontraron relaciones");
        return [];
      }

      return result.rows as RelacionData[];
    } catch (error) {
      console.error("Error al listar relaciones:", error);
      throw new Error("No se pudieron obtener los datos");
    }
  }

  public async agregarRelacion(): Promise<{ success: boolean; message: string; relacion?: Record<string, unknown> }> {
    try {
      if (!this._relacion) {
        throw new Error("Datos de relación no válidos");
      }

      const { ficha_idficha, aprendiz_idaprendiz, instructor_idinstructor } = this._relacion;

      await Conexion.execute("START TRANSACTION");

      const insert = await Conexion.execute(
        "INSERT INTO ficha_has_aprendiz_instructor (ficha_idficha, aprendiz_idaprendiz, instructor_idinstructor) VALUES (?, ?, ?)",
        [ficha_idficha, aprendiz_idaprendiz, instructor_idinstructor]
      );

      if (insert && typeof insert.affectedRows === "number" && insert.affectedRows > 0) {
        await Conexion.execute("COMMIT");

        return {
          success: true,
          message: "Relación agregada correctamente",
         // relacion: this._relacion,
        };
      } else {
        throw new Error("Error al agregar la relación");
      }
    } catch (error) {
      await Conexion.execute("ROLLBACK");
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error interno",
      };
    }
  }

  public async eliminarRelacion(ficha_idficha: number, aprendiz_idaprendiz: number,instructor_idinstructor : number): Promise<{ success: boolean; message: string }> {
    try {
      await Conexion.execute("START TRANSACTION");

      const eliminar = await Conexion.execute(
        "DELETE FROM ficha_has_aprendiz_instructor WHERE ficha_idficha = ? AND aprendiz_idaprendiz = ? AND instructor_idinstructor =?",
        [ficha_idficha, aprendiz_idaprendiz,instructor_idinstructor]
      );

      if (eliminar && typeof eliminar.affectedRows === "number" && eliminar.affectedRows > 0) {
        await Conexion.execute("COMMIT");

        return {
          success: true,
          message: "Relación eliminada correctamente",
        };
      } else {
        throw new Error("No se encontró la relación para eliminar");
      }
    } catch (error) {
      await Conexion.execute("ROLLBACK");
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error interno al eliminar la relación",
      };
    }
  }

  public async actualizarRelacion(): Promise<{ success: boolean; message: string; fichaAprendizInstructor?: Record <string,unknown >;}> {
  try {
    if (!this._relacion || !this._relacion.aprendiz_idaprendiz || !this._relacion.ficha_idficha || !this._relacion.instructor_idinstructor) {
      throw new Error("Objeto no definida o ids no validas");
    }

    const { ficha_idficha, aprendiz_idaprendiz, instructor_idinstructor } = this._relacion;

    await Conexion.execute("START TRANSACTION");

    const update = await Conexion.execute(
  `UPDATE ficha_has_aprendiz_instructor
     SET instructor_idinstructor = ?
   WHERE ficha_idficha = ? AND aprendiz_idaprendiz = ?`,
  [ instructor_idinstructor, ficha_idficha, aprendiz_idaprendiz ]
);


    if (update && typeof update.affectedRows === "number" && update.affectedRows > 0) {
const [fichaAprendizInstructor] = await Conexion.query(
  `SELECT
     fhai.ficha_idficha,
     fhai.aprendiz_idaprendiz,
     fhai.instructor_idinstructor,
     f.codigo            AS codigo_ficha,
     a.nombre            AS nombre_aprendiz,
     i.nombre            AS nombre_instructor
   FROM ficha_has_aprendiz_instructor fhai
   JOIN ficha     f ON fhai.ficha_idficha        = f.idficha
   JOIN aprendiz  a ON fhai.aprendiz_idaprendiz  = a.idaprendiz
   JOIN instructor i ON fhai.instructor_idinstructor = i.idinstructor
   WHERE fhai.ficha_idficha       = ?
     AND fhai.aprendiz_idaprendiz = ?
     AND fhai.instructor_idinstructor = ?
   LIMIT 1`,
  [ ficha_idficha, aprendiz_idaprendiz, instructor_idinstructor ]
);

      await Conexion.execute("COMMIT");

      return {
        success: true,
        message: "Relación editada correctamente",
        fichaAprendizInstructor:fichaAprendizInstructor
      };
    } else {
      throw new Error("No se encontró la relación para actualizar" );
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

}
