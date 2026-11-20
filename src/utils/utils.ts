import { isValidObjectId } from "mongoose";
import { MESSAGES_ERROR } from "../error/messages-error.ts";
import { AppError } from "../error/app-error.ts";

export const validarFormatoId = (id: string): void => {
    if (!isValidObjectId(id)) {
        throw new AppError(MESSAGES_ERROR.GERAL.ID_INVALIDO, 400);
    }
}
