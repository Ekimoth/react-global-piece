import { Context, createContext, Dispatch, SetStateAction } from 'react';

// types
import { ContextStateType } from '../types';

// class imports
import ContextHolderClone from './ContextHolderClone';

type ContextRegionDataType = [
  ContextStateType,
  Dispatch<SetStateAction<ContextStateType>>,
  ContextHolderClone | null
];

export default class ContextHolder {
  context: Context<ContextRegionDataType>;

  defaultState: ContextStateType = {};

  constructor(contextHolder?: ContextHolder) {
    if (contextHolder) {
      this.context = contextHolder.context;
      this.defaultState = contextHolder.defaultState;
    } else {
      this.context = createContext([
        {},
        () => {},
        null,
      ] as ContextRegionDataType);
    }
  }

  setDefaultBaseState = <T>(base: string, defaultBaseState: T) => {
    if (!(base in this.defaultState)) {
      this.defaultState[base] = defaultBaseState;
    }

    return this.defaultState[base] as T;
  };
}
