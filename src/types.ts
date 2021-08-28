export type ContextStateType<T = Record<string, any>> = T;

type ContextReducer<T = ContextStateType> = (currentState: T) => T;

export type GlobalStateActionFunction<T = ContextStateType> = (
  fn: ContextReducer<T>
) => void;
