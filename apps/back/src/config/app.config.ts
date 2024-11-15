import * as Joi from 'joi';

export const defaults = {
  node: {
    env: 'development',
    port: 4000,
  },
  swagger: {
    url: '/dev/swagger',
  },
};

export const loadConfig = () => ({
  node: {
    env: (process.env.NODE_ENV as any) || defaults.node.env,
    port: (process.env.PORT as any) || defaults.node.port,
  },
  swagger: {
    url: process.env.SWAGGER_URL || defaults.swagger.url,
  },
  db: {
    name: process.env.MIKRO_ORM_DB_NAME,
    user: process.env.MIKRO_ORM_USER,
    password: process.env.MIKRO_ORM_PASSWORD,
    host: process.env.MIKRO_ORM_HOST,
    port: process.env.MIKRO_ORM_PORT,
  },
  s3: {
    accessKey: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
    bucketName: process.env.S3_BUCKET_NAME,
  },
  cloudfront: {
    url: process.env.CLOUDFRONT_URL,
    keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
  },
  adminJwtAuth: {
    accessTokenExpirationMs: process.env.ADMIN_AUTH_JWT_ACCESS_TOKEN_EXP_MS,
    refreshTokenExpirationMs: process.env.ADMIN_AUTH_JWT_REFRESH_TOKEN_EXP_MS,
    accessTokenSecret: process.env.ADMIN_AUTH_JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.ADMIN_AUTH_JWT_REFRESH_TOKEN_SECRET,
  },
});

export const validationSchemaOfEnvFile = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default(defaults.node.env),
  PORT: Joi.number().default(defaults.node.port),
  SWAGGER_URL: Joi.string().default(defaults.swagger.url),
  MIKRO_ORM_HOST: Joi.string().required(),
  MIKRO_ORM_PORT: Joi.number().required(),
  MIKRO_ORM_USER: Joi.string().required(),
  MIKRO_ORM_PASSWORD: Joi.string().required(),
  MIKRO_ORM_DB_NAME: Joi.string().required(),
  S3_ACCESS_KEY: Joi.string().required(),
  S3_SECRET_ACCESS_KEY: Joi.string().required(),
  S3_REGION: Joi.string().required(),
  S3_BUCKET_NAME: Joi.string().required(),
  CLOUDFRONT_URL: Joi.string().required(),
  CLOUDFRONT_KEY_PAIR_ID: Joi.string().required(),
  CLOUDFRONT_PRIVATE_KEY: Joi.string().required(),
  ADMIN_AUTH_JWT_ACCESS_TOKEN_EXP_MS: Joi.string().required(),
  ADMIN_AUTH_JWT_REFRESH_TOKEN_EXP_MS: Joi.string().required(),
  ADMIN_AUTH_JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  ADMIN_AUTH_JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
});

export const validationOptions: Joi.ValidationOptions = {
  abortEarly: true,
};
