"use strict";
exports.__esModule = true;
var ImagePreview = function (_a) {
    var images = _a.images;
    return (React.createElement("div", { className: "image-preview-container" }, images.length > 0 ? (images.map(function (src, index) { return (React.createElement("div", { key: index, className: "image-preview" },
        React.createElement("img", { src: src, alt: "Uploaded Preview " + (index + 1) }))); })) : (React.createElement("p", null, "No images uploaded yet."))));
};
exports["default"] = ImagePreview;
