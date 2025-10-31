"use strict";
exports.__esModule = true;
var react_1 = require("react");
var ImageUploadForm_1 = require("./ImageUploadForm");
var UploadPage = function () {
    return (react_1["default"].createElement("div", { className: "upload-page" },
        react_1["default"].createElement("h1", null, "Upload Client Images"),
        react_1["default"].createElement(ImageUploadForm_1["default"], null)));
};
exports["default"] = UploadPage;
