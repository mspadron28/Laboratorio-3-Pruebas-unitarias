import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    JWT_SECRET: string;
    ENCRYPTION_KEY: string;
    IV_KEY: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    JWT_SECRET: joi.string().required(),
    ENCRYPTION_KEY: joi.string().required(), 
    IV_KEY: joi.string().required(), 
})
.unknown(true);

const { error, value } = envsSchema.validate({ ...process.env });

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    JWT_SECRET: envVars.JWT_SECRET,
    ENCRYPTION_KEY: envVars.ENCRYPTION_KEY,
    IV_KEY: envVars.IV_KEY,
};
