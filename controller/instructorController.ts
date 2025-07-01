import { Context, RouterContext, z } from "../dependencies/dependencies.ts";
import { Instructor } from "../model/instructorModel.ts";

const InstructorSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  email: z.string().email(),
  telefono: z.string().min(1)
});

export const getInstructor = async (ctx: Context) => {
  const { response } = ctx;
  try {
    const obj = new Instructor();
    const list = await obj.listarInstructores();

    response.status = list.length > 0 ? 200 : 400;
    response.body = list.length > 0
      ? { success: true, data: list }
      : { success: false, message: "No existen instructores" };
  } catch (error) {
    response.status = 500;
    response.body = { success: false, message: "Error del servidor", error: String(error) };
  }
};

export const postInstructor = async (ctx: Context) => {
  const { request, response } = ctx;
  try {
    const body = await request.body.json();
    const validated = InstructorSchema.parse(body);

    const instructorData = { idinstructor: null, ...validated };
    const obj = new Instructor(instructorData);
    const result = await obj.agregarInstructor();

    response.status = result.success ? 200 : 400;
    response.body = result;
  } catch (error) {
    response.status = error instanceof z.ZodError ? 400 : 500;
    response.body = {
      success: false,
      message: "Error al procesar los datos",
      ...(error instanceof z.ZodError ? { errors: error.format() } : {})
    };
  }
};

export const putInstructor = async (ctx: Context) => {
  const { request, response } = ctx;
  try {
    const body = await request.body.json();
    const validated = InstructorSchema.parse(body);

    const instructorData = { idinstructor: body.idinstructor, ...validated };
    const obj = new Instructor(instructorData);
    const result = await obj.actualizarInstructor();

    response.status = result.success ? 200 : 400;
    response.body = result;
  } catch (error) {
    response.status = error instanceof z.ZodError ? 400 : 500;
    response.body = {
      success: false,
      message: "Error al procesar los datos",
      ...(error instanceof z.ZodError ? { errors: error.format() } : {})
    };
  }
};

export const deleteInstructor = async (ctx: RouterContext<"/Instructor/:id">) => {
  const { params, response } = ctx;

  try {
    const idinstructor = parseInt(params.id);

    if (!idinstructor || idinstructor <= 0) {
      response.status = 400;
      response.body = {
        success: false,
        message: "ID del instructor inválido",
      };
      return;
    }

    const objInstructor = new Instructor();
    const eliminar = await objInstructor.eliminarInstructor(idinstructor);

    if (eliminar.success) {
      response.status = 200;
      response.body = {
        success: true,
        message: "Instructor eliminado correctamente",
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        message: "Error al eliminar el instructor: " + eliminar.message,
      };
    }
  } catch (error) {
    response.status = 500;
    response.body = {
      success: false,
      message: "Error interno del servidor",
      error: String(error),
    };
  }
};
