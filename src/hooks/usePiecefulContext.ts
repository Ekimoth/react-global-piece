import {
  useMemo,
  useContext,
  createContext,
  Dispatch,
  useEffect,
  Context,
} from 'react';

// types
import { GlobalStateType } from '../types';

const createNewContext = () =>
  createContext([{}, () => {}] as [GlobalStateType, Dispatch<GlobalStateType>]);

export const contexts: Record<string, [Context<any>, GlobalStateType]> = {
  root: [createNewContext(), {}],
};

const usePiecefulContext = (region: string) => {
  const [ContextInstance, initialStaticState] = useMemo(() => {
    if (contexts[region]) {
      return contexts[region];
    }

    const newContext = createNewContext();

    contexts[region] = [newContext, {} as GlobalStateType];

    return contexts[region];
  }, [region]);

  const currentContextState = useContext(ContextInstance);

  useEffect(
    () => () => {
      delete contexts[region];
    },
    [region]
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
