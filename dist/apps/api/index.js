var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/typia/lib/transformers/NoTransformConfigurationError.js
var require_NoTransformConfigurationError = __commonJS({
  "node_modules/typia/lib/transformers/NoTransformConfigurationError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoTransformConfigurationError = NoTransformConfigurationError;
    function NoTransformConfigurationError(name) {
      throw new Error([
        `Error on typia.${name}(): no transform has been configured.`,
        "",
        "Read and follow https://typia.io/docs/setup please.",
        "",
        [
          "If you've already completed the setup, it means there's",
          "a bug in your code. Run `tsc` command so that check what",
          "is wrong with your code."
        ].join(" ")
      ].join("\n"));
    }
  }
});

// node_modules/typia/lib/functional.js
var require_functional = __commonJS({
  "node_modules/typia/lib/functional.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assertFunction = assertFunction;
    exports.assertParameters = assertParameters;
    exports.assertReturn = assertReturn;
    exports.assertEqualsFunction = assertEqualsFunction;
    exports.assertEqualsParameters = assertEqualsParameters;
    exports.assertEqualsReturn = assertEqualsReturn;
    exports.isFunction = isFunction;
    exports.isParameters = isParameters;
    exports.isReturn = isReturn;
    exports.equalsFunction = equalsFunction;
    exports.equalsParameters = equalsParameters;
    exports.equalsReturn = equalsReturn;
    exports.validateFunction = validateFunction;
    exports.validateParameters = validateParameters;
    exports.validateReturn = validateReturn;
    exports.validateEqualsFunction = validateEqualsFunction;
    exports.validateEqualsParameters = validateEqualsParameters;
    exports.validateEqualsReturn = validateEqualsReturn;
    var NoTransformConfigurationError_1 = require_NoTransformConfigurationError();
    function assertFunction() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.assertFunction");
    }
    function assertParameters() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.assertParameters");
    }
    function assertReturn() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.assertReturn");
    }
    function assertEqualsFunction() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.assertEqualsFunction");
    }
    function assertEqualsParameters() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.assertEqualsParameters");
    }
    function assertEqualsReturn() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.assertEqualsReturn");
    }
    function isFunction() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.isFunction");
    }
    function isParameters() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.isParameters");
    }
    function isReturn() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.isReturn");
    }
    function equalsFunction() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.equalsFunction");
    }
    function equalsParameters() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.equalsParameters");
    }
    function equalsReturn() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.equalsReturn");
    }
    function validateFunction() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.validateFunction");
    }
    function validateParameters() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.validateParameters");
    }
    function validateReturn() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.validateReturn");
    }
    function validateEqualsFunction() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.validateEqualsFunction");
    }
    function validateEqualsParameters() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.validateEqualsParameters");
    }
    function validateEqualsReturn() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("functional.validateEqualsReturn");
    }
  }
});

// node_modules/typia/lib/http.js
var require_http = __commonJS({
  "node_modules/typia/lib/http.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formData = formData;
    exports.assertFormData = assertFormData;
    exports.isFormData = isFormData;
    exports.validateFormData = validateFormData;
    exports.query = query;
    exports.assertQuery = assertQuery;
    exports.isQuery = isQuery;
    exports.validateQuery = validateQuery;
    exports.headers = headers;
    exports.assertHeaders = assertHeaders;
    exports.isHeaders = isHeaders;
    exports.validateHeaders = validateHeaders;
    exports.parameter = parameter;
    exports.createFormData = createFormData;
    exports.createAssertFormData = createAssertFormData;
    exports.createIsFormData = createIsFormData;
    exports.createValidateFormData = createValidateFormData;
    exports.createQuery = createQuery;
    exports.createAssertQuery = createAssertQuery;
    exports.createIsQuery = createIsQuery;
    exports.createValidateQuery = createValidateQuery;
    exports.createHeaders = createHeaders;
    exports.createAssertHeaders = createAssertHeaders;
    exports.createIsHeaders = createIsHeaders;
    exports.createValidateHeaders = createValidateHeaders;
    exports.createParameter = createParameter;
    var NoTransformConfigurationError_1 = require_NoTransformConfigurationError();
    function formData() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.formData");
    }
    function assertFormData() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.assertFormData");
    }
    function isFormData() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.isFormData");
    }
    function validateFormData() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.validateFormData");
    }
    function query() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.query");
    }
    function assertQuery() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.assertQuery");
    }
    function isQuery() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.isQuery");
    }
    function validateQuery() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.validateQuery");
    }
    function headers() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.headers");
    }
    function assertHeaders() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.assertHeaders");
    }
    function isHeaders() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.isHeaders");
    }
    function validateHeaders() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.validateHeaders");
    }
    function parameter() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.parameter");
    }
    function createFormData() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.createFormData");
    }
    function createAssertFormData() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.createAssertFormData");
    }
    function createIsFormData() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.createIsFormData");
    }
    function createValidateFormData() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.createValidateFormData");
    }
    function createQuery() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.createQuery");
    }
    function createAssertQuery() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.createAssertQuery");
    }
    function createIsQuery() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.createIsQuery");
    }
    function createValidateQuery() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.createValidateQuery");
    }
    function createHeaders() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.createHeaders");
    }
    function createAssertHeaders() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.createAssertHeaders");
    }
    function createIsHeaders() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.createIsHeaders");
    }
    function createValidateHeaders() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.createValidateHeaders");
    }
    function createParameter() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("http.createParameter");
    }
  }
});

// node_modules/typia/lib/llm.js
var require_llm = __commonJS({
  "node_modules/typia/lib/llm.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.controller = controller;
    exports.application = application;
    exports.parameters = parameters;
    exports.schema = schema;
    var NoTransformConfigurationError_1 = require_NoTransformConfigurationError();
    function controller(..._args) {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("llm.controller");
    }
    function application() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("llm.application");
    }
    function parameters() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("llm.parameters");
    }
    function schema() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("llm.schema");
    }
  }
});

// node_modules/typia/lib/json.js
var require_json = __commonJS({
  "node_modules/typia/lib/json.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.schemas = schemas;
    exports.schema = schema;
    exports.assertParse = assertParse;
    exports.isParse = isParse;
    exports.validateParse = validateParse;
    exports.stringify = stringify;
    exports.assertStringify = assertStringify;
    exports.isStringify = isStringify;
    exports.validateStringify = validateStringify;
    exports.createIsParse = createIsParse;
    exports.createAssertParse = createAssertParse;
    exports.createValidateParse = createValidateParse;
    exports.createStringify = createStringify;
    exports.createAssertStringify = createAssertStringify;
    exports.createIsStringify = createIsStringify;
    exports.createValidateStringify = createValidateStringify;
    var NoTransformConfigurationError_1 = require_NoTransformConfigurationError();
    function schemas() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.schemas");
    }
    function schema() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.schema");
    }
    function assertParse() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.assertParse");
    }
    function isParse() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.isParse");
    }
    function validateParse() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.validateParse");
    }
    function stringify() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.stringify");
    }
    function assertStringify() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.assertStringify");
    }
    function isStringify() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.isStringify");
    }
    function validateStringify() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.validateStringify");
    }
    function createIsParse() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.createIsParse");
    }
    function createAssertParse() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.createAssertParse");
    }
    function createValidateParse() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.createValidateParse");
    }
    function createStringify() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.createStringify");
    }
    function createAssertStringify() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.createAssertStringify");
    }
    function createIsStringify() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.createIsStringify");
    }
    function createValidateStringify() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("json.createValidateStringify");
    }
  }
});

// node_modules/typia/lib/misc.js
var require_misc = __commonJS({
  "node_modules/typia/lib/misc.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.literals = literals;
    exports.clone = clone;
    exports.assertClone = assertClone;
    exports.isClone = isClone;
    exports.validateClone = validateClone;
    exports.prune = prune;
    exports.assertPrune = assertPrune;
    exports.isPrune = isPrune;
    exports.validatePrune = validatePrune;
    exports.createClone = createClone;
    exports.createAssertClone = createAssertClone;
    exports.createIsClone = createIsClone;
    exports.createValidateClone = createValidateClone;
    exports.createPrune = createPrune;
    exports.createAssertPrune = createAssertPrune;
    exports.createIsPrune = createIsPrune;
    exports.createValidatePrune = createValidatePrune;
    var NoTransformConfigurationError_1 = require_NoTransformConfigurationError();
    function literals() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.literals");
    }
    function clone() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.clone");
    }
    function assertClone() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.assertClone");
    }
    function isClone() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.isClone");
    }
    function validateClone() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.validateClone");
    }
    function prune() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.prune");
    }
    function assertPrune() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.assertPrune");
    }
    function isPrune() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.isPrune");
    }
    function validatePrune() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.validatePrune");
    }
    function createClone() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.createClone");
    }
    function createAssertClone() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.createAssertClone");
    }
    function createIsClone() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.createIsClone");
    }
    function createValidateClone() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.createValidateClone");
    }
    function createPrune() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.createPrune");
    }
    function createAssertPrune() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.createAssertPrune");
    }
    function createIsPrune() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.createIsPrune");
    }
    function createValidatePrune() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("misc.createValidatePrune");
    }
  }
});

// node_modules/typia/lib/notations.js
var require_notations = __commonJS({
  "node_modules/typia/lib/notations.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.camel = camel;
    exports.assertCamel = assertCamel;
    exports.isCamel = isCamel;
    exports.validateCamel = validateCamel;
    exports.pascal = pascal;
    exports.assertPascal = assertPascal;
    exports.isPascal = isPascal;
    exports.validatePascal = validatePascal;
    exports.snake = snake;
    exports.assertSnake = assertSnake;
    exports.isSnake = isSnake;
    exports.validateSnake = validateSnake;
    exports.createCamel = createCamel;
    exports.createAssertCamel = createAssertCamel;
    exports.createIsCamel = createIsCamel;
    exports.createValidateCamel = createValidateCamel;
    exports.createPascal = createPascal;
    exports.createAssertPascal = createAssertPascal;
    exports.createIsPascal = createIsPascal;
    exports.createValidatePascal = createValidatePascal;
    exports.createSnake = createSnake;
    exports.createAssertSnake = createAssertSnake;
    exports.createIsSnake = createIsSnake;
    exports.createValidateSnake = createValidateSnake;
    var NoTransformConfigurationError_1 = require_NoTransformConfigurationError();
    function camel() {
      return (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.camel");
    }
    function assertCamel() {
      return (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.assertCamel");
    }
    function isCamel() {
      return (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.isCamel");
    }
    function validateCamel() {
      return (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.validateCamel");
    }
    function pascal() {
      return (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.pascal");
    }
    function assertPascal() {
      return (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.assertPascal");
    }
    function isPascal() {
      return (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.isPascal");
    }
    function validatePascal() {
      return (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.validatePascal");
    }
    function snake() {
      return (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.snake");
    }
    function assertSnake() {
      return (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.assertSnake");
    }
    function isSnake() {
      return (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.isSnake");
    }
    function validateSnake() {
      return (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.validateSnake");
    }
    function createCamel() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.createCamel");
    }
    function createAssertCamel() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.createAssertCamel");
    }
    function createIsCamel() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.createIsCamel");
    }
    function createValidateCamel() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.createValidateCamel");
    }
    function createPascal() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.createPascal");
    }
    function createAssertPascal() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.createAssertPascal");
    }
    function createIsPascal() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.createIsPascal");
    }
    function createValidatePascal() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.createValidatePascal");
    }
    function createSnake() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.createSnake");
    }
    function createAssertSnake() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.createAssertSnake");
    }
    function createIsSnake() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.createIsSnake");
    }
    function createValidateSnake() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("notations.createValidateSnake");
    }
  }
});

// node_modules/typia/lib/protobuf.js
var require_protobuf = __commonJS({
  "node_modules/typia/lib/protobuf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.message = message;
    exports.decode = decode;
    exports.assertDecode = assertDecode;
    exports.isDecode = isDecode;
    exports.validateDecode = validateDecode;
    exports.encode = encode;
    exports.assertEncode = assertEncode;
    exports.isEncode = isEncode;
    exports.validateEncode = validateEncode;
    exports.createDecode = createDecode;
    exports.createIsDecode = createIsDecode;
    exports.createAssertDecode = createAssertDecode;
    exports.createValidateDecode = createValidateDecode;
    exports.createEncode = createEncode;
    exports.createIsEncode = createIsEncode;
    exports.createAssertEncode = createAssertEncode;
    exports.createValidateEncode = createValidateEncode;
    var NoTransformConfigurationError_1 = require_NoTransformConfigurationError();
    function message() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.message");
    }
    function decode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.decode");
    }
    function assertDecode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.assertDecode");
    }
    function isDecode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.isDecode");
    }
    function validateDecode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.validateDecode");
    }
    function encode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.encode");
    }
    function assertEncode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.assertEncode");
    }
    function isEncode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.isEncode");
    }
    function validateEncode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.validateEncode");
    }
    function createDecode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.createDecode");
    }
    function createIsDecode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.createIsDecode");
    }
    function createAssertDecode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.createAssertDecode");
    }
    function createValidateDecode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.createValidateDecode");
    }
    function createEncode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.createEncode");
    }
    function createIsEncode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.createIsEncode");
    }
    function createAssertEncode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.createAssertEncode");
    }
    function createValidateEncode() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("protobuf.createValidateEncode");
    }
  }
});

// node_modules/typia/lib/reflect.js
var require_reflect = __commonJS({
  "node_modules/typia/lib/reflect.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.metadata = metadata;
    exports.name = name;
    var NoTransformConfigurationError_1 = require_NoTransformConfigurationError();
    function metadata() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("reflect.metadata");
    }
    function name() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("reflect.name");
    }
  }
});

// node_modules/typia/lib/tags/Constant.js
var require_Constant = __commonJS({
  "node_modules/typia/lib/tags/Constant.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/ContentMediaType.js
var require_ContentMediaType = __commonJS({
  "node_modules/typia/lib/tags/ContentMediaType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/Default.js
var require_Default = __commonJS({
  "node_modules/typia/lib/tags/Default.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/Example.js
var require_Example = __commonJS({
  "node_modules/typia/lib/tags/Example.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/Examples.js
var require_Examples = __commonJS({
  "node_modules/typia/lib/tags/Examples.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/ExclusiveMaximum.js
var require_ExclusiveMaximum = __commonJS({
  "node_modules/typia/lib/tags/ExclusiveMaximum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/ExclusiveMinimum.js
var require_ExclusiveMinimum = __commonJS({
  "node_modules/typia/lib/tags/ExclusiveMinimum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/Format.js
var require_Format = __commonJS({
  "node_modules/typia/lib/tags/Format.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/JsonSchemaPlugin.js
var require_JsonSchemaPlugin = __commonJS({
  "node_modules/typia/lib/tags/JsonSchemaPlugin.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/Maximum.js
var require_Maximum = __commonJS({
  "node_modules/typia/lib/tags/Maximum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/MaxItems.js
var require_MaxItems = __commonJS({
  "node_modules/typia/lib/tags/MaxItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/MaxLength.js
var require_MaxLength = __commonJS({
  "node_modules/typia/lib/tags/MaxLength.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/Minimum.js
var require_Minimum = __commonJS({
  "node_modules/typia/lib/tags/Minimum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/MinItems.js
var require_MinItems = __commonJS({
  "node_modules/typia/lib/tags/MinItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/MinLength.js
var require_MinLength = __commonJS({
  "node_modules/typia/lib/tags/MinLength.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/MultipleOf.js
var require_MultipleOf = __commonJS({
  "node_modules/typia/lib/tags/MultipleOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/Pattern.js
var require_Pattern = __commonJS({
  "node_modules/typia/lib/tags/Pattern.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/Sequence.js
var require_Sequence = __commonJS({
  "node_modules/typia/lib/tags/Sequence.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/TagBase.js
var require_TagBase = __commonJS({
  "node_modules/typia/lib/tags/TagBase.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/Type.js
var require_Type = __commonJS({
  "node_modules/typia/lib/tags/Type.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/UniqueItems.js
var require_UniqueItems = __commonJS({
  "node_modules/typia/lib/tags/UniqueItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/tags/index.js
var require_tags = __commonJS({
  "node_modules/typia/lib/tags/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(require_Constant(), exports);
    __exportStar(require_ContentMediaType(), exports);
    __exportStar(require_Default(), exports);
    __exportStar(require_Example(), exports);
    __exportStar(require_Examples(), exports);
    __exportStar(require_ExclusiveMaximum(), exports);
    __exportStar(require_ExclusiveMinimum(), exports);
    __exportStar(require_Format(), exports);
    __exportStar(require_JsonSchemaPlugin(), exports);
    __exportStar(require_Maximum(), exports);
    __exportStar(require_MaxItems(), exports);
    __exportStar(require_MaxLength(), exports);
    __exportStar(require_Minimum(), exports);
    __exportStar(require_MinItems(), exports);
    __exportStar(require_MinLength(), exports);
    __exportStar(require_MultipleOf(), exports);
    __exportStar(require_Pattern(), exports);
    __exportStar(require_Sequence(), exports);
    __exportStar(require_TagBase(), exports);
    __exportStar(require_Type(), exports);
    __exportStar(require_UniqueItems(), exports);
  }
});

// node_modules/typia/lib/schemas/metadata/IJsDocTagInfo.js
var require_IJsDocTagInfo = __commonJS({
  "node_modules/typia/lib/schemas/metadata/IJsDocTagInfo.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/schemas/json/IJsonApplication.js
var require_IJsonApplication = __commonJS({
  "node_modules/typia/lib/schemas/json/IJsonApplication.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/schemas/json/IJsonSchemaCollection.js
var require_IJsonSchemaCollection = __commonJS({
  "node_modules/typia/lib/schemas/json/IJsonSchemaCollection.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/schemas/json/IJsonSchemaUnit.js
var require_IJsonSchemaUnit = __commonJS({
  "node_modules/typia/lib/schemas/json/IJsonSchemaUnit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/AssertionGuard.js
var require_AssertionGuard = __commonJS({
  "node_modules/typia/lib/AssertionGuard.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/IRandomGenerator.js
var require_IRandomGenerator = __commonJS({
  "node_modules/typia/lib/IRandomGenerator.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/IValidation.js
var require_IValidation = __commonJS({
  "node_modules/typia/lib/IValidation.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/TypeGuardError.js
var require_TypeGuardError = __commonJS({
  "node_modules/typia/lib/TypeGuardError.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypeGuardError = void 0;
    var TypeGuardError = class extends Error {
      /**
       * Creates a new TypeGuardError instance.
       *
       * @example
       *   ```typescript
       *   const error = new TypeGuardError({
       *     method: "typia.assert",
       *     path: "input.age",
       *     expected: "number & ExclusiveMinimum<19>",
       *     value: 18
       *   });
       *   ```;
       *
       * @param props - Object containing the properties needed to create the error
       */
      constructor(props) {
        var _a;
        super(props.message || `Error on ${props.method}(): invalid type${props.path ? ` on ${props.path}` : ""}, expect to be ${props.expected}`);
        const proto = new.target.prototype;
        if (Object.setPrototypeOf)
          Object.setPrototypeOf(this, proto);
        else
          this.__proto__ = proto;
        this.method = props.method;
        this.path = props.path;
        this.expected = props.expected;
        this.value = props.value;
        if (props.description || props.value === void 0)
          this.description = (_a = props.description) !== null && _a !== void 0 ? _a : [
            "The value at this path is `undefined`.",
            "",
            `Please fill the \`${props.expected}\` typed value next time.`
          ].join("\n");
      }
    };
    exports.TypeGuardError = TypeGuardError;
  }
});

// node_modules/typia/lib/Primitive.js
var require_Primitive = __commonJS({
  "node_modules/typia/lib/Primitive.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/Resolved.js
var require_Resolved = __commonJS({
  "node_modules/typia/lib/Resolved.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/CamelCase.js
var require_CamelCase = __commonJS({
  "node_modules/typia/lib/CamelCase.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/PascalCase.js
var require_PascalCase = __commonJS({
  "node_modules/typia/lib/PascalCase.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/SnakeCase.js
var require_SnakeCase = __commonJS({
  "node_modules/typia/lib/SnakeCase.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/IReadableURLSearchParams.js
var require_IReadableURLSearchParams = __commonJS({
  "node_modules/typia/lib/IReadableURLSearchParams.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// node_modules/typia/lib/module.js
var require_module = __commonJS({
  "node_modules/typia/lib/module.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    }();
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tags = exports.reflect = exports.protobuf = exports.notations = exports.misc = exports.json = exports.llm = exports.http = exports.functional = void 0;
    exports.assert = assert;
    exports.assertGuard = assertGuard;
    exports.is = is;
    exports.validate = validate;
    exports.assertEquals = assertEquals;
    exports.assertGuardEquals = assertGuardEquals;
    exports.equals = equals;
    exports.validateEquals = validateEquals;
    exports.random = random;
    exports.createAssert = createAssert;
    exports.createAssertGuard = createAssertGuard;
    exports.createIs = createIs;
    exports.createValidate = createValidate;
    exports.createAssertEquals = createAssertEquals;
    exports.createAssertGuardEquals = createAssertGuardEquals;
    exports.createEquals = createEquals;
    exports.createValidateEquals = createValidateEquals;
    exports.createRandom = createRandom;
    var NoTransformConfigurationError_1 = require_NoTransformConfigurationError();
    exports.functional = __importStar(require_functional());
    exports.http = __importStar(require_http());
    exports.llm = __importStar(require_llm());
    exports.json = __importStar(require_json());
    exports.misc = __importStar(require_misc());
    exports.notations = __importStar(require_notations());
    exports.protobuf = __importStar(require_protobuf());
    exports.reflect = __importStar(require_reflect());
    exports.tags = __importStar(require_tags());
    __exportStar(require_IJsDocTagInfo(), exports);
    __exportStar(require_IJsonApplication(), exports);
    __exportStar(require_IJsonSchemaCollection(), exports);
    __exportStar(require_IJsonSchemaUnit(), exports);
    __exportStar(require_AssertionGuard(), exports);
    __exportStar(require_IRandomGenerator(), exports);
    __exportStar(require_IValidation(), exports);
    __exportStar(require_TypeGuardError(), exports);
    __exportStar(require_Primitive(), exports);
    __exportStar(require_Resolved(), exports);
    __exportStar(require_CamelCase(), exports);
    __exportStar(require_PascalCase(), exports);
    __exportStar(require_SnakeCase(), exports);
    __exportStar(require_IReadableURLSearchParams(), exports);
    function assert() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("assert");
    }
    function assertGuard() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("assertGuard");
    }
    function is() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("is");
    }
    function validate() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("validate");
    }
    function assertEquals() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("assertEquals");
    }
    function assertGuardEquals() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("assertGuardEquals");
    }
    function equals() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("equals");
    }
    function validateEquals() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("validateEquals");
    }
    function random() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("random");
    }
    function createAssert() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("createAssert");
    }
    function createAssertGuard() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("createAssertGuard");
    }
    function createIs() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("createIs");
    }
    function createValidate() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("createValidate");
    }
    function createAssertEquals() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("createAssertEquals");
    }
    function createAssertGuardEquals() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("createAssertGuardEquals");
    }
    function createEquals() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("createEquals");
    }
    function createValidateEquals() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("createValidateEquals");
    }
    function createRandom() {
      (0, NoTransformConfigurationError_1.NoTransformConfigurationError)("createRandom");
    }
  }
});

// node_modules/typia/lib/index.js
var require_lib = __commonJS({
  "node_modules/typia/lib/index.js"(exports) {
    "use strict";
    var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || /* @__PURE__ */ function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    }();
    var __exportStar = exports && exports.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    var typia2 = __importStar(require_module());
    exports.default = typia2;
    __exportStar(require_module(), exports);
  }
});

// packages/contracts/src/enums/index.ts
var enums_exports = {};
__export(enums_exports, {
  ContactMethod: () => ContactMethod
});

// packages/contracts/src/enums/ContactMethod.ts
import { enumeration } from "smart-enums";
var input = {
  email: {
    link: (contactable) => `mailto:${contactable.email}`,
    handle: (contactable) => contactable.email
  },
  sms: {
    link: (contactable) => `sms:${contactable.sms}`,
    handle: (contactable) => contactable.sms
  },
  call: {
    link: (contactable) => `tel:${contactable.call}`,
    handle: (contactable) => contactable.call
  },
  other: { link: () => "#", handle: () => "" }
};
var ContactMethod = enumeration({
  input,
  enumType: "ContactMethod"
});

// packages/contracts/src/types/types.ts
var import_typia = __toESM(require_lib(), 1);
var validateUpsertContact = import_typia.default.createValidate();
var validateListContactsQuery = import_typia.default.createValidate();
var validateCreateTouch = import_typia.default.createValidate();
var validatePlanQuery = import_typia.default.createValidate();
var validateUpsertDailyGoal = import_typia.default.createValidate();

// packages/contracts/src/utils/smartEnumUtils.ts
var createSmartEnumJSONReviver = ({ Enums }) => {
  return (key, value) => {
    if (value && typeof value === "object" && "__smart_enum_type" in value && "value" in value) {
      const { __smart_enum_type, value: v } = value;
      const enumClass = Enums[__smart_enum_type];
      return enumClass?.tryFromValue(v) ?? value;
    }
    return value;
  };
};

// apps/api/src/container.ts
import { asFunction, asValue, createContainer } from "awilix";

// apps/api/src/knex.ts
import knex from "knex";

// apps/api/src/knexfile.ts
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname2 = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname2, "../.env") });
var ROOT = path.resolve(__dirname2, "..");
var MIGRATIONS_DIR = path.join(ROOT, "db/migrations");
var SEEDS_DIR = path.join(ROOT, "db/seeds");
var connection = {
  host: process.env.POSTGRES_HOST || "127.0.0.1",
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER || "postgres",
  password: String(process.env.POSTGRES_PASSWORD || ""),
  database: process.env.POSTGRES_DB || "network"
};
var knexConfig = {
  client: "pg",
  connection,
  migrations: {
    directory: MIGRATIONS_DIR,
    tableName: "knex_migrations",
    extension: "ts"
  },
  seeds: {
    directory: SEEDS_DIR,
    extension: "ts"
  }
};

// apps/api/src/knex.ts
var database = knex(knexConfig);
process.on("SIGINT", async () => {
  await database.destroy();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await database.destroy();
  process.exit(0);
});

// apps/api/src/container.ts
var container = createContainer({
  injectionMode: "PROXY"
});
container.register({
  connection: asValue(database)
});
container.register({
  smartEnumReviver: asFunction(createSmartEnumJSONReviver)
});
container.register({
  Enums: asValue(enums_exports),
  // Register the full Enums object for createSmartEnumJSONReviver
  ...Object.fromEntries(Object.entries(enums_exports).map(([key, value]) => [key, asValue(value)]))
});
container.loadModules(
  [
    "services/**/*.@(ts|js)",
    "repositories/**/*.@(ts|js)",
    "controllers/**/*.@(ts|js)",
    "middleware/**/*.@(ts|js)",
    "routes/**/*.@(ts|js)",
    "koaServer.@(ts|js)"
  ],
  {
    cwd: __dirname,
    resolverOptions: {
      register: asFunction
    },
    // Configure naming strategy to remove 'create' prefix
    formatName: (name) => {
      if (name.startsWith("create")) {
        return name.substring(6).charAt(0).toLowerCase() + name.substring(7);
      }
      return name;
    }
  }
);

// apps/api/src/index.ts
var PORT = process.env.PORT || 3e3;
var server = container.resolve("koaServer");
server.listen(PORT, () => {
  console.log(`\u{1F680} Server running on http://localhost:${PORT}`);
});
