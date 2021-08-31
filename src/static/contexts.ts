import { createContext, Dispatch, Context, SetStateAction } from 'react';

// types
import { ContextStateType } from '../types';

const createNewContext = () =>
  createContext([{}, () => {}] as [
    ContextStateType,
    Dispatch<SetStateAction<ContextStateType>>
  ]);

const contexts: Record<string, [Context<any>, ContextStateType]> = {
  root: [createNewContext(), {}],
};

export const getContext = (region: string) => {
  if (!contexts[region]) {
    const newContext = createNewContext();
    contexts[region] = [newContext, {} as ContextStateType];
  }

  return contexts[region] as [
    React.Context<
      [ContextStateType, Dispatch<SetStateAction<ContextStateType>>]
    >,
    ContextStateType
  ];
};

export const getContextDefaultState = (region: string) => {
  const [, defaultState] = getContext(region);

  return defaultState;
};

export const setDefaultStaticPiece = <T = ContextStateType>(
  region: string,
  base: string,
  defaultStaticPiece: T,
  suppressError = false
) => {
  const contextDefaultState = getContextDefaultState(region);

  if (!(base in contextDefaultState)) {
    contextDefaultState[base] = defaultStaticPiece;
  } else if (
    contextDefaultState[base] !== defaultStaticPiece &&
    !suppressError
  ) {
    console.error(
      `Base "${base}" in region "${region}" already has a default value and it can't be overwritten.`
    );
  }

  return contextDefaultState[base] as T;
};
