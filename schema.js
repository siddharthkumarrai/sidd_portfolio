const joi = require("joi");

module.exports.clientSchema = joi.object({
    client: joi.object({
        name:joi.string().required(),
        description:joi.string().required(),
        subject:joi.string().required(),
        email:joi.string().required(),
        phoneNr:joi.number().required(),
    }).required()
})

