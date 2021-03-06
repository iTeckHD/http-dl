import joi, { string } from "joi";

const HTTP_REGEX = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

const inputFileItemSchema = joi.object({
  url: string()
    .required()
    .pattern(HTTP_REGEX)
    .error(() => new Error("Must be an URL")),
  fileName: string(),
  filePath: string(),
});

export const inputFileSchema = joi.array().items(inputFileItemSchema);

export function isHttpString(url: string) {
  return HTTP_REGEX.test(url);
}
