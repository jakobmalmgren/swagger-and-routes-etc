import joi from "joi";

const productSchema = joi.object({
  title: joi.string().min(3).required(),
  price: joi.number().integer().min(2).required(),
  shortDesc: joi.string().required(),
  category: joi.string().required(),
  longDesc: joi.string().required(),
  imgFile: joi.string().required(),
  serial: joi.string().required(),
});

export default productSchema;
