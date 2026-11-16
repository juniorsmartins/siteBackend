import { Router } from "express";
import { NewsGetController } from "../controllers/news/news-get-controller.ts";

const newsRouter = Router();
const newsGetController = new NewsGetController();

newsRouter.get("/:id", newsGetController.buscarPorId);

export { newsRouter };
