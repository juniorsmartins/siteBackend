import { Router } from "express";
import { NewsGetController } from "../controllers/news/news-get-controller.ts";
import { NewsCreateController } from "../controllers/news/news-create-controller.ts";

const newsRouter = Router();
const newsGetController = new NewsGetController();
const newsCreateController = new NewsCreateController();

newsRouter.get("/:id", newsGetController.buscarPorId);
newsRouter.post("/", newsCreateController.criar);

export { newsRouter };
