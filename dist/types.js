"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskStatus = exports.differentRoles = void 0;
var differentRoles;
(function (differentRoles) {
    differentRoles["FRONTEND"] = "frontend developer";
    differentRoles["BACKEND"] = "backend developer";
    differentRoles["UX_UI"] = "ux/ui";
})(differentRoles || (exports.differentRoles = differentRoles = {}));
var taskStatus;
(function (taskStatus) {
    taskStatus["TODO"] = "todo";
    taskStatus["IN_PROGRESS"] = "in-progress";
    taskStatus["DONE"] = "done";
})(taskStatus || (exports.taskStatus = taskStatus = {}));
