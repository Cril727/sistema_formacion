import { Conexion } from "./Conexion.ts";

interface FichaData {
  idficha: number | null;
  codigo: string;
  fecha_inicio_lectiva: string;
  fecha_fin_lectiva: string;
  fecha_fin_practica: string;
  programa_idprograma: number;
}

export class Ficha {
  public _objFicha: FichaData | null;

  constructor(objFicha: FichaData | null = null) {
    this._objFicha = objFicha;
  }

  public async listarFichas(): Promise<FichaData[]> {
    try {
      const result = await Conexion.execute("SELECT * FROM ficha");
      return (result?.rows || []) as FichaData[];
    } catch (error) {
      console.error("Error al seleccionar fichas", error);
      throw new Error("No se pueden obtener los datos");
    }
  }


  public async agregarFicha(): Promise<{success:boolean, message: string, ficha?: Record<string,unknown> }>{
        try {
            if (!this._objFicha) {
                throw new Error("Objeto no valido")
            }

            const { codigo,fecha_inicio_lectiva,fecha_fin_lectiva,fecha_fin_practica,programa_idprograma } = this._objFicha;

            console.log("Objeto recibido en agregarFicha:", this._objFicha);
            if (!codigo || !fecha_inicio_lectiva || !fecha_fin_lectiva || !fecha_fin_practica || !programa_idprograma ==null) {
                    throw new Error("Faltan campos requeridos")
            }

            await Conexion.execute("START TRANSACTION");
            const sql = await Conexion.execute("INSERT INTO ficha(codigo,fecha_inicio_lectiva,fecha_fin_lectiva,fecha_fin_practica,programa_idprograma) values(?,?,?,?,?)",
                [codigo,fecha_inicio_lectiva,fecha_fin_lectiva,fecha_fin_practica,programa_idprograma],
            );

            if (sql && typeof sql.affectedRows === "number" && sql.affectedRows>0) {
                const[ficha] = await Conexion.query("SELECT * FROM ficha WHERE idficha = LAST_INSERT_ID()",)

                await Conexion.execute("COMMIT");

                return {
                    success: true,
                    message: "Ficha Agregado Correctamente",
                    ficha: ficha    
                };
                
            } else {
                throw new Error('Error al agregar la ficha')
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

 

  public async eliminarFicha(idficha: number): Promise<{ success: boolean; message: string }> {
    try {
      await Conexion.execute("START TRANSACTION");
      const eliminar = await Conexion.execute("DELETE FROM ficha WHERE idficha = ?", [idficha]);

      if (eliminar && eliminar.affectedRows && eliminar.affectedRows > 0) {
        await Conexion.execute("COMMIT");
        return { success: true, message: "Ficha eliminada correctamente" };
      } else {
        throw new Error("Error al eliminar la ficha");
      }
    } catch (error) {
      await Conexion.execute("ROLLBACK");
      return { success: false, message: error instanceof Error ? error.message : "Error interno del servidor" };
    }
  }
}

