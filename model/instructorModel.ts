import { Conexion } from "./Conexion.ts";

interface InstructorData {
  idinstructor: number | null;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

export class Instructor {
  public _objInstructor: InstructorData | null;

  constructor(objInstructor: InstructorData | null = null) {
    this._objInstructor = objInstructor;
  }

  public async listarInstructores(): Promise<InstructorData[]> {
    try {
      const result = await Conexion.execute("SELECT * FROM instructor");

      if (!result || !result.rows) return [];
      return result.rows as InstructorData[];
    } catch (error) {
      console.error("Error al obtener instructores:", error);
      throw new Error("No se pueden obtener los datos");
    }
  }

  public async agregarInstructor(): Promise<{ success: boolean; message: string; instructor?: Record<string, unknown> }> {
    try {
      if (!this._objInstructor) throw new Error("Objeto no válido");

      const { nombre, apellido, email, telefono } = this._objInstructor;

      if (!nombre || !apellido || !email || !telefono) {
        throw new Error("Faltan campos requeridos");
      }

      await Conexion.execute("START TRANSACTION");
      const insert = await Conexion.execute(
        "INSERT INTO instructor(nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)",
        [nombre, apellido, email, telefono]
      );

      if (insert && insert.affectedRows && insert.affectedRows > 0) {
        const [instructor] = await Conexion.query("SELECT * FROM instructor WHERE idinstructor = LAST_INSERT_ID()");
        await Conexion.execute("COMMIT");
        return { success: true, message: "Instructor agregado correctamente", instructor };
      } else {
        throw new Error("Error al insertar el instructor");
      }
    } catch (error) {
      await Conexion.execute("ROLLBACK");
      return { success: false, message: error instanceof Error ? error.message : "Error interno" };
    }
  }

  public async actualizarInstructor(): Promise<{ success: boolean; message: string; instructor?: Record<string, unknown> }> {
    try {
      if (!this._objInstructor || !this._objInstructor.idinstructor) {
        throw new Error("ID del instructor no válido");
      }

      const { idinstructor, nombre, apellido, email, telefono } = this._objInstructor;

      if (!nombre || !apellido || !email || !telefono) {
        throw new Error("Faltan campos requeridos");
      }

      await Conexion.execute("START TRANSACTION");
      const update = await Conexion.execute(
        "UPDATE instructor SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE idinstructor = ?",
        [nombre, apellido, email, telefono, idinstructor]
      );

      if (update && update.affectedRows && update.affectedRows > 0) {
        const [instructor] = await Conexion.query("SELECT * FROM instructor WHERE idinstructor = ?", [idinstructor]);
        await Conexion.execute("COMMIT");
        return { success: true, message: "Instructor actualizado correctamente", instructor };
      } else {
        throw new Error("Error al actualizar instructor");
      }
    } catch (error) {
      await Conexion.execute("ROLLBACK");
      return { success: false, message: error instanceof Error ? error.message : "Error interno" };
    }
  }

  public async eliminarInstructor(idinstructor: number): Promise<{ success: boolean; message: string }> {
    try {
      await Conexion.execute("START TRANSACTION");

      const eliminar = await Conexion.execute("DELETE FROM instructor WHERE idinstructor = ?", [idinstructor]);

      if (eliminar && eliminar.affectedRows && eliminar.affectedRows > 0) {
        await Conexion.execute("COMMIT");
        return { success: true, message: "Instructor eliminado correctamente" };
      } else {
        throw new Error("No se pudo eliminar el instructor");
      }
    } catch (error) {
      await Conexion.execute("ROLLBACK");
      return { success: false, message: error instanceof Error ? error.message : "Error interno" };
    }
  }
}
