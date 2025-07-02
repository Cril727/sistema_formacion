import { Context, RouterContext } from "../dependencies/dependencies.ts";
import { FichaHasAprendizInstructor } from "../model/fichaHasAprendizInstructorModel.ts";



export const getRelaciones = async (ctx: Context) => {
  try {
    const obj = new FichaHasAprendizInstructor();
    const data = await obj.listarRelaciones();

    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data,
    };
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: error instanceof Error ? error.message : "Error interno del servidor",
    };
  }
};

export const postRelacion = async (ctx: Context) => {
  const { request, response } = ctx;

  try {
    const body = await request.body.json();

    const obj = new FichaHasAprendizInstructor(body);
    const resultado = await obj.agregarRelacion();

    if (resultado.success) {
      response.status = 200;
      response.body = resultado;
    } else {
      response.status = 400;
      response.body = resultado;
    }
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      message: error instanceof Error ? error.message : "Error interno del servidor",
    };
  }
};

export const updateRelacion = async (ctx: Context) => {
  const {request, response} = ctx;
  try {
    const contentLen = request.headers.get("Content-Length");

    if (!contentLen) {
      response.status = 400;
      response.body = {
        succes:false,
        message: "El cuerpo de la solicitud esta vacio"
      }
      return;
    }
    const body = await request.body.json();

    const dataFichaHasInstructor = {
      ficha_idficha:Number(body.fichaId),
      aprendiz_idaprendiz:Number(body.aprendizId),
      instructor_idinstructor:Number(body.instructorId),
      ...body
    }

    const objFichaHasInstructor = new FichaHasAprendizInstructor(dataFichaHasInstructor);
    const editar = await objFichaHasInstructor.actualizarRelacion();

    if(editar.success){
            response.status = 201;
            response.body = {
                success: true,
                message: "Relacion editada correctamnete",
                relacion: editar.fichaAprendizInstructor
            }
        } else {
            response.status = 400;
            response.body = {
                success: false,
                message: editar.message
            };
        }
  } catch (error) {
    console.error(error);
    response.status = 500;
    response.body = {
        success: false,
        message: "Erro al interno del servidor" + error
    }
  }
}

export const deleteRelacion = async (ctx: RouterContext<"/Relacion/:ficha_idficha/:aprendiz_idaprendiz/:instructor_idinstructor">) => {
  const { ficha_idficha, aprendiz_idaprendiz,instructor_idinstructor } = ctx.params;

  try {
    const ficha = parseInt(ficha_idficha);
    const aprendiz = parseInt(aprendiz_idaprendiz);
    const instructor = parseInt(instructor_idinstructor);

    if (!ficha || !aprendiz || !instructor) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        message: "IDs inválidos",
      };
      return;
    }

    const obj = new FichaHasAprendizInstructor();
    const resultado = await obj.eliminarRelacion(ficha, aprendiz, instructor);

    ctx.response.status = resultado.success ? 200 : 400;
    ctx.response.body = resultado;
  } catch (error) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: error instanceof Error ? error.message : "Error interno",
    };
  }
};
