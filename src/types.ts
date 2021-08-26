export type GlobalStateType<T = Record<string, any>> = T;

type GlobalStateReducer<T = GlobalStateType> = (currentState: T) => T;

export type GlobalStateActionFunction<T = GlobalStateType> = (
  fn: GlobalStateReducer<T>
) => void;
