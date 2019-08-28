import { Draft } from 'immer';
import { Reducer } from 'redux';
export interface AppAction<TPayload> {
    type: string;
    payload: TPayload;
}
export declare type AppActionPayloadCreator<TPayload, TArgs extends any[]> = (...args: TArgs) => TPayload;
export declare type AppActionCreator<TArgs extends any[], TPayload> = (...args: TArgs) => AppAction<TPayload>;
export declare type AppActionHandler<TState, TPayload> = (draft: Draft<TState>, action: TPayload, state: TState) => void;
export declare type AppSimpleActionHandler<TState> = (draft: Draft<TState>, state: TState) => void;
export interface ActionBundle<TState, TActionCreatorArgs extends any[], TPayload> {
    type: string;
    create: AppActionCreator<TActionCreatorArgs, TPayload>;
    handler: AppActionHandler<TState, TPayload>;
}
export declare function createActionBundle<TState, TPayload, TActionCreatorArgs extends any[]>(type: string, create: AppActionPayloadCreator<TPayload, TActionCreatorArgs>, handler: AppActionHandler<TState, TPayload>): ActionBundle<TState, TActionCreatorArgs, TPayload>;
export declare function createSimpleActionBundle<TState>(type: string, handler: AppSimpleActionHandler<TState>): ActionBundle<TState, [], undefined>;
export declare function createReducer<TState>(initialState: TState, handlers: ActionBundle<TState, any, any>[]): Reducer<TState, any>;
