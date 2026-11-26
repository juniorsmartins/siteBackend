import { Router } from "express";
import { NewsFindController } from "../controllers/news/news-find-controller.ts";
import { NewsCreateController } from "../controllers/news/news-create-controller.ts";
import { NewsDeleteController } from "../controllers/news/news-delete-controller.ts";
import { NewsUpdateController } from "../controllers/news/news-update-controller.ts";
import { validateSchemaMiddleware } from "../middlewares/validate-schema-middleware.ts";
import { newsSchemaUpdateValidation, newsSchemaCreateValidation, idParamValidation } from "../validation/news-schema-validation.ts";
import { NewsSearchController } from "../controllers/news/news-search-controller.ts";

const newsRouter = Router();
const newsFindController = new NewsFindController();
const newsDeleteController = new NewsDeleteController();
const newsUpdateController = new NewsUpdateController();
const newsCreateController = new NewsCreateController();
const newsSearchController = new NewsSearchController();

newsRouter.get("/:id", validateSchemaMiddleware(idParamValidation, "params"), newsFindController.findById);
newsRouter.delete("/:id", validateSchemaMiddleware(idParamValidation, "params"), newsDeleteController.deleteById);
newsRouter.put("/:id", validateSchemaMiddleware(idParamValidation, "params"), validateSchemaMiddleware(newsSchemaUpdateValidation), newsUpdateController.updateById);
newsRouter.post("/", validateSchemaMiddleware(newsSchemaCreateValidation), newsCreateController.create);
newsRouter.get("/", newsSearchController.searchOffsetBased);

export { newsRouter };
