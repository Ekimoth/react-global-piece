import { createContext, Dispatch, Context } from 'react';

// types
import { ContextStateType } from '../types';

const createNewContext = () =>
  createContext([{}, () => {}] as [
    ContextStateType,
    Dispatch<ContextStateType>
  ]);

const contexts: Record<string, [Context<any>, ContextStateType]> = {
  root: [createNewContext(), {}],
};

export const getContext = (region: string) => {
  if (!contexts[region]) {
    const newContext = createNewContext();
    contexts[region] = [newContext, {} as ContextStateType];
  }

  return contexts[region];
};

export const getContextDefaultState = (region: string) => {
  const [, defaultState] = getContext(region);

  return defaultState;
};

export const setAndReturnBaseDefaultState = <T = ContextStateType>(
  region: string,
  base: string,
  defaultBaseState: T,
  suppressError = false
) => {
  const [, contextDefaultState] = getContext(region);

  if (!contextDefaultState[base]) {
    contextDefaultState[base] = defaultBaseState;
  } else if (contextDefaultState[base] !== defaultBaseState && !suppressError) {
    console.error(
      `Base "${base}" in region "${region}" already has a default value and it can't be overwritten.`
    );
  }

  return contextDefaultState[base];
};
