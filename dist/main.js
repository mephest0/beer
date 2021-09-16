"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_static_1 = __importDefault(require("koa-static"));
const path_1 = require("path");
const relay_1 = require("./relay");
const PORT_NUMBER = 31337;
const app = new koa_1.default();
// timer-and-error middleware
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const time = Date.now();
    try {
        yield next();
    }
    catch (e) {
        ctx.body = (ctx.body || '') + '<span class="server">there was an error<br />' + (e.message || e.toString()) + '</span>';
        ctx.status = 400;
    }
    console.log(`Request to ${ctx.request.path} took ${Date.now() - time}ms`);
}));
// api call handler, or pass on to static file middleware
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    // all other requests than those for /api/* are passed on
    if (!ctx.request.path.startsWith('/api/'))
        return yield next();
    const path = ctx.request.path
        .replace(/^\/api\//, '')
        .replace(/\/$/, '');
    console.log('api path [' + path + ']');
    switch (path) {
        case 'now':
        case 'current':
            // TODO insert logic
            ctx.body = { 'probe0': 69 };
            break;
        case 'toggle':
            (0, relay_1.toggleRelay)();
            break;
        default:
            throw new Error(`API call for unsupported request [${path}]`);
    }
    ctx.response.type = 'application/json';
}));
// static file handler
app.use((0, koa_static_1.default)((0, path_1.join)('./static'), { defer: true }));
app.listen(PORT_NUMBER);
console.log(`all set up, listening on port ${PORT_NUMBER}`);
