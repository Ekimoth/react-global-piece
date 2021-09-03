import ContextHolder from './ContextHolder';
import { ContextStateType } from '../types';

export default class ContextHolderClone extends ContextHolder {
  private initialState: ContextStateType = {};

  setInitialValue = <T>(base: string, initialValue: T) => {
    if (!(base in this.initialState)) {
      this.initialState[base] = initialValue;
    }

    return this.initialState[base] as T;
  };
}
