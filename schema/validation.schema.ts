import * as Joi from 'joi';

export const validationSchema = Joi.object({
  STAGE: Joi.string()
    .required()
    .valid('development', 'production')
    .default('development'),
  PG_HOST: Joi.string().required().default('localhost'),
  PG_PORT: Joi.number().required().default(5432),
  PG_USERNAME: Joi.string().required(),
  PG_PASSWORD: Joi.string().required(),
  PG_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.number().required(),
});
