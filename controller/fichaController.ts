import { Context, z, RouterContext } from "../dependencies/dependencies.ts";
import { Ficha } from "../model/fichaModel.ts";

const FichaSchema = z.object({
  codigo: z.string().min(1, "El nombre del código es obligatorio"),
  fecha_inicio_lectiva: z.string().min(1, "La fecha de inicio lectiva es obligatoria"),
  fecha_fin_lectiva: z.string().min(1, "La fecha de fin lectiva es obligatoria"),
  fecha_fin_practica: z.string().min(1, "La fecha del fin de prácticas es obligatoria"),
  programa_idprograma: z.string().min(1)
});

export const getFicha = async (ctx: Context) => {
  const { response } = ctx;
  try {
    const objFicha = new Ficha();
    const ListaFichas = await objFicha.listarFichas();

    if (!ListaFichas || ListaFichas.length === 0) {
      response.status = 400;
      response.body = {
        success: false,
        message: "No existen fichas"
      };
      return;
    }

    response.status = 200;
    response.body = {
      success: true,
      data: ListaFichas
    };
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      message: "Error del servidor",
      error: String(error)
    };
  }
};


export const postFicha = async (ctx:Context)=>{
    const {request , response} = ctx;

    try {
        const contenLen = request.headers.get("Content-Length");

        if(contenLen === "0"){
            response.status = 400;
            response.body = {
                success:false,
                message:"Cuerpo de la solicitud vacia"
            };
            return;
        }

        const body = await request.body.json();
        const validated = FichaSchema.parse(body);

        const fichaData = {
        idficha: null,
        ...validated,
         programa_idprograma: Number(validated.programa_idprograma)
        };

        const objFicha = new Ficha(fichaData)
        const agregar = await objFicha.agregarFicha();

        if (agregar.success) {
            response.status = 200;
            response.body = {
                success:true,
                message:"Ficha agregada correctamente",
                ficha:agregar.ficha
            }
        }else{
            response.status = 400;
            response.body = {
                success:false,
                message:agregar.message
            }
        }
    } catch (error) {
         if(error instanceof z.ZodError){
            response.status = 400;
            response.body = {
                success: false,
                message:"Datos invalios",
                errors: error.format(),
            }
        }else{
            response.status = 500;
            response.body = {
                success:false,
                message:"Datos invalidos",
            }
        }
    }

}

// export const putFicha = async (ctx: Context) => {
//   const { response, request } = ctx;
//   try {
//     const contenLen = request.headers.get("Content-Length");
//     if (contenLen === "0") {
//       response.status = 400;
//       response.body = {
//         success: false,
//         message: "Cuerpo de la solicitud vacío"
//       };
//       return;
//     }

//     const body = await request.body.json();
//     const fichaData = {
//       ...body,
//       programa_idprograma: Number(body.programa_idprograma),
//       idficha: Number(body.idficha)
//     };

//     const objFicha = new Ficha(fichaData);
//     const update = await objFicha.actualizarFicha();

//     if (update.success) {
//       response.status = 200;
//       response.body = {
//         success: true,
//         message: "Actualizado correctamente",
//         ficha: update.ficha
//       };
//     } else {
//       response.status = 400;
//       response.body = {
//         success: false,
//         message: "Error al actualizar la ficha: " + update.message
//       };
//     }
//   } catch (error) {
//     response.status = 500;
//     response.body = {
//       success: false,
//       message: "Error interno del servidor"
//     };
//   }
// };

export const deleteFicha = async (ctx: RouterContext<"/Ficha/:id">) => {
  const { params, response } = ctx;
  try {
    const idficha = parseInt(params.id);
    if (!idficha || idficha <= 0) {
      response.status = 400;
      response.body = {
        success: false,
        message: "ID de ficha inválido"
      };
      return;
    }

    const objFicha = new Ficha();
    const eliminar = await objFicha.eliminarFicha(idficha);

    if (eliminar.success) {
      response.status = 200;
      response.body = {
        success: true,
        message: "Ficha eliminada correctamente"
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        message: "Error al eliminar la ficha: " + eliminar.message
      };
    }
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      message: "Error interno del servidor"
    };
  }
};

