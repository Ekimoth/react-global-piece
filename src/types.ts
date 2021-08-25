type GlobalState<T = Record<string, any>> = T;

type GlobalStateReducer<T = GlobalState> = (currentState: T) => T;

export type GlobalStateActionFunction<T = GlobalState> = (
  fn: GlobalStateReducer<T>
) => void;
