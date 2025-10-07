import Joi from 'joi';

export const JoiEnvValidationSchema = Joi.object({
  MONGODB_URI: Joi.string().required(),
  PORT: Joi.number().default(3000),
  HOST: Joi.string().default(
    `http://localhost:${process.env.PORT || 3000}/api/v1`,
  ),
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  MAX_PDF_SIZE: Joi.number().default(50),
});
