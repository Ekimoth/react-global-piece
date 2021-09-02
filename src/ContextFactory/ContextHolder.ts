import { Context, createContext, Dispatch, SetStateAction } from 'react';
import ContextHolderClone from './ContextHolderClone';
import { ContextStateType } from '../types';

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
