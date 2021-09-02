// class imports
import ContextHolder from './ContextHolder';

// types
import { ContextStateType } from '../types';

export default class ContextHolderClone extends ContextHolder {
  initialState: ContextStateType = {};

  setInitialBaseState = <T>(base: string, initialState: T) => {
    if (!(base in this.initialState)) {
      this.initialState[base] = initialState;
    }

    return this.initialState[base] as T;
  };
}
