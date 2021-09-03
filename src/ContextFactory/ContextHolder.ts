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

  private defaultState: ContextStateType = {};

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

  setDefaultValue = <T>(base: string, defaultValue: T) => {
    if (!(base in this.defaultState)) {
      this.defaultState[base] = defaultValue;
    }

    return this.defaultState[base] as T;
  };
}
