import { Schema } from 'jsonschema';

const registerSchema: Schema = {
    type: 'object',
    properties: {
        login: {
            type: 'string',
            minLength: 4,
        },
        password: {
            type: 'string',
            minLength: 6,
        },
    },
    required: ['login', 'password'],
    additionalProperties: false,
};

const loginSchema: Schema = {
    type: 'object',
    properties: {
        login: {
            type: 'string',
            minLength: 4,
        },
        password: {
            type: 'string',
            minLength: 5,
        },
    },
    required: ['login', 'password'],
    additionalProperties: false,
};

export {
    registerSchema,
    loginSchema,
};
