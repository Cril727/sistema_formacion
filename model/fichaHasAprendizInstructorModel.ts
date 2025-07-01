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
      const result = await Conexion.execute("SELECT * FROM ficha_has_aprendiz_instructor");

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
          relacion: this._relacion,
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

  public async eliminarRelacion(ficha_idficha: number, aprendiz_idaprendiz: number): Promise<{ success: boolean; message: string }> {
    try {
      await Conexion.execute("START TRANSACTION");

      const eliminar = await Conexion.execute(
        "DELETE FROM ficha_has_aprendiz_instructor WHERE ficha_idficha = ? AND aprendiz_idaprendiz = ?",
        [ficha_idficha, aprendiz_idaprendiz]
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
}
