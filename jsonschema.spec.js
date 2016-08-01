"use strict";

const jsonschema = require("jsonschema").Validator;
const Promise = require("bluebird");
const expect = require("chai").expect;

const release = require("./release.json");
const schema = require("./schema.json");

describe.only("JSON schema", () => {
  it("Should not have errors", () => {
    const v = new jsonschema();
    const validation = v.validate(release, schema);
    if (validation.errors.length) {
      console.log(validation.errors);
    }
    expect(validation.errors).to.be.empty;
  });
});
