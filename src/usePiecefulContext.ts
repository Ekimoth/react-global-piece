import {
  useMemo,
  useContext,
  createContext,
  Dispatch,
  useEffect,
  Context,
} from 'react';

import { GlobalStateType } from './types';

const createNewContext = () =>
  createContext([{}, () => {}] as [GlobalStateType, Dispatch<GlobalStateType>]);

export const contexts: Record<string, [Context<any>, GlobalStateType]> = {
  root: [createNewContext(), {}],
};

const usePiecefulContext = (contextKey: string) => {
  const [ContextInstance, initialStaticState] = useMemo(() => {
    if (contexts[contextKey]) {
      return contexts[contextKey];
    }

    const newContext = createNewContext();

    contexts[contextKey] = [newContext, {} as GlobalStateType];

    return contexts[contextKey];
  }, [contextKey]);

  const currentContextState = useContext(ContextInstance);

  useEffect(
    () => () => {
      delete contexts[contextKey];
    },
    [contextKey]
  );

  return useMemo(
    () => ({
      Provider: ContextInstance.Provider,
      initialStaticState,
      currentContextState,
    }),
    [ContextInstance, initialStaticState, currentContextState]
  );
};

export default usePiecefulContext;
