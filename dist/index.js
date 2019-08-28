"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = require("immer");
function createActionBundle(type, create, handler) {
    return {
        type,
        create: (...args) => ({
            type,
            payload: create(...args)
        }),
        handler
    };
}
exports.createActionBundle = createActionBundle;
function createSimpleActionBundle(type, handler) {
    return createActionBundle(type, () => undefined, (draft, _action, state) => handler(draft, state));
}
exports.createSimpleActionBundle = createSimpleActionBundle;
function createReducer(initialState, handlers) {
    const handlerMap = new Map();
    handlers.forEach(handler => {
        handlerMap.set(handler.type, handler.handler);
    });
    return function reducer(state = initialState, action) {
        if (!handlerMap.has(action.type))
            return state;
        const handler = handlerMap.get(action.type);
        return immer_1.default(state, draft => handler(draft, action.payload, state));
    };
}
exports.createReducer = createReducer;
