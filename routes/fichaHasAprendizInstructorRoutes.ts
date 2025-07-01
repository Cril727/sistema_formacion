import { Router } from "../dependencies/dependencies.ts";
import { getRelaciones, postRelacion, deleteRelacion } from "../controller/fichaHasAprendizInstructorController.ts";

const RelacionRouter = new Router();

RelacionRouter.get("/Relacion", getRelaciones);
RelacionRouter.post("/Relacion", postRelacion);
RelacionRouter.delete("/Relacion/:ficha_idficha/:aprendiz_idaprendiz", deleteRelacion);

export { RelacionRouter };
