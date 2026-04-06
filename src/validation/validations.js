const Joi = require("joi");

const budgetSchema = Joi.object({
  budgetName: Joi.string().required(),
  amount: Joi.number().required(),
  categoryId: Joi.number().required(),

  budgetType: Joi.string().valid("monthly", "yearly", "range").required(),

  startDate: Joi.when("budgetType", {
    is: "range",
    then: Joi.date().required(),
    otherwise: Joi.date().optional().allow(null, ""),
  }),

  endDate: Joi.when("budgetType", {
    is: "range",
    then: Joi.date().required(),
    otherwise: Joi.date().optional().allow(null, ""),
  }),
});

const budgetEditSchema = Joi.object({
  budgetName: Joi.string(),
  amount: Joi.number(),
  categoryId: Joi.number(),

  budgetType: Joi.string().valid("monthly", "yearly", "range"),

  startDate: Joi.when("budgetType", {
    is: "range",
    then: Joi.date().required(),
    otherwise: Joi.date().optional().allow(null, ""),
  }),

  endDate: Joi.when("budgetType", {
    is: "range",
    then: Joi.date().required(),
    otherwise: Joi.date().optional().allow(null, ""),
  }),
});
module.exports = { budgetSchema };
