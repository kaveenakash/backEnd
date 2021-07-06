const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const templateSchema = new Schema(
  {
    title: { type: String },
    document: { type: String },
    content: { type: String },
  },
  { timestamps: true }
);

templateSchema.plugin(uniqueValidator);

const Template = mongoose.model("Template", templateSchema);

module.exports = Template;
