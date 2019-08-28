import produce, { Draft } from 'immer';
import { Reducer } from 'redux';

export interface AppAction<TPayload> {
  type: string;
  payload: TPayload;
}

export type AppActionPayloadCreator<TPayload, TArgs extends any[]> = (
  ...args: TArgs
) => TPayload;

export type AppActionCreator<TArgs extends any[], TPayload> = (
  ...args: TArgs
) => AppAction<TPayload>;

export type AppActionHandler<TState, TPayload> = (
  draft: Draft<TState>,
  action: TPayload,
  state: TState
) => void;

export type AppSimpleActionHandler<TState> = (
  draft: Draft<TState>,
  state: TState
) => void;

export interface ActionBundle<
  TState,
  TActionCreatorArgs extends any[],
  TPayload
> {
  type: string;
  create: AppActionCreator<TActionCreatorArgs, TPayload>;
  handler: AppActionHandler<TState, TPayload>;
}

export function createActionBundle<
  TState,
  TPayload,
  TActionCreatorArgs extends any[]
>(
  type: string,
  create: AppActionPayloadCreator<TPayload, TActionCreatorArgs>,
  handler: AppActionHandler<TState, TPayload>
): ActionBundle<TState, TActionCreatorArgs, TPayload> {
  return {
    type,
    create: (...args: TActionCreatorArgs): AppAction<TPayload> => ({
      type,
      payload: create(...args)
    }),
    handler
  };
}

export function createSimpleActionBundle<TState>(
  type: string,
  handler: AppSimpleActionHandler<TState>
): ActionBundle<TState, [], undefined> {
  return createActionBundle<TState, undefined, []>(
    type,
    () => undefined,
    (draft, _action, state) => handler(draft, state)
  );
}

export function createReducer<TState>(
  initialState: TState,
  handlers: ActionBundle<TState, any, any>[]
): Reducer<TState, any> {
  const handlerMap = new Map<string, AppActionHandler<TState, any>>();
  handlers.forEach(handler => {
    handlerMap.set(handler.type, handler.handler);
  });

  return function reducer(
    state: TState = initialState,
    action: { type: string; payload: any }
  ) {
    if (!handlerMap.has(action.type)) return state;
    const handler = handlerMap.get(action.type)!;
    return produce(state, draft => handler(draft, action.payload, state));
  };
}
