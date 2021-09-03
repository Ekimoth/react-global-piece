import { useCallback, useMemo, useRef, useContext } from 'react';
import ContextFactory from './ContextFactory';
import { GlobalStateActionFunction } from './types';

const useStatePiece = <T>(base: string, initialValue: T, region = 'root') => {
  const regionRef = useRef(region);
  const baseRef = useRef(base);
  const initialValueRef = useRef(initialValue);

  const Context = useMemo(
    () => ContextFactory.getContext(regionRef.current),
    []
  );

  const [{ [baseRef.current]: currentValue }, setState, contextHolder] =
    useContext(Context);

  const defaultValueMemo = useMemo(
    () =>
      contextHolder?.setDefaultValue(
        baseRef.current,
        initialValueRef.current
      ) ?? initialValueRef.current,
    []
  );

  const initialValueMemo = useMemo(
    () =>
      contextHolder?.setInitialValue(
        baseRef.current,
        initialValueRef.current
      ) ?? initialValueRef.current,
    []
  );

  const value = useMemo(
    () => (currentValue as T) ?? initialValueMemo,
    [currentValue, initialValueMemo]
  );

  const setValue: GlobalStateActionFunction<T> = useCallback(
    (reducer) => {
      setState(
        ({
          [baseRef.current]: currentPiece = initialValueMemo,
          ...contextState
        }) => ({
          ...contextState,
          [baseRef.current]: reducer(currentPiece),
        })
      );
    },
    [setState, initialValueMemo]
  );

  const resetValue: GlobalStateActionFunction<T, void> = useCallback(
    (reducer) => {
      setState((contextState) => ({
        ...contextState,
        [baseRef.current]: reducer?.(defaultValueMemo) ?? defaultValueMemo,
      }));
    },
    [setState, defaultValueMemo]
  );

  return useMemo(
    () => [value, setValue, resetValue] as const,
    [value, setValue, resetValue]
  );
};

export default useStatePiece;
