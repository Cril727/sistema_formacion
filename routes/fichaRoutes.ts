import { Router } from "../dependencies/dependencies.ts";
import { getFicha, postFicha, putFicha, deleteFicha } from "../controller/fichaController.ts";

const FichaRouter = new Router();

FichaRouter.get("/Ficha", getFicha);
FichaRouter.post("/Ficha", postFicha);
FichaRouter.put("/Ficha", putFicha);
FichaRouter.delete("/Ficha/:id", deleteFicha);

export { FichaRouter };
