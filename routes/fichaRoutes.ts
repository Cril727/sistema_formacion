import { Router } from "../dependencies/dependencies.ts";
import { getFicha, postFicha } from "../controller/fichaController.ts";

const FichaRouter = new Router()

FichaRouter.get("/Fichas",getFicha)
FichaRouter.post("/Ficha",postFicha)

export{FichaRouter}