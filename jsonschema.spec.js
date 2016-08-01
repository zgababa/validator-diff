"use strict";

const Ajv = require("ajv");
const Promise = require("bluebird");
const expect = require("chai").expect;

const release = require("./release.json");
const schema = require("./schema.json");

function getReleaseErrors() {
  const ajv = new Ajv({allErrors : true, verbose : true});
  const t = ajv.validate(schema, release);
  return ajv.errors;
}

function isAlreadyTreated(currentError) {
  return (error) => error.dataPath.includes(currentError.dataPath) && currentError.dataPath !== "";
}

function cleanErrors(errors, currentError) {
  const reducedErrors = errors.map((error) => isAlreadyTreated(error)(currentError) ? currentError : error);
  return reducedErrors.some(isAlreadyTreated(currentError)) ? reducedErrors : reducedErrors.concat(currentError);
}

function validateRelease() {
  const validationErrors = getReleaseErrors(release, schema);
  if (!validationErrors) {
    return Promise.resolve();
  }

  const error = JSON.stringify(validationErrors.reduce(cleanErrors, []), null, 2);
  return Promise.reject(error);
}


describe("JSON SCHEMA", () => {

  it("Should not have errors", () => {
    return expect(validateRelease());
  });
});
