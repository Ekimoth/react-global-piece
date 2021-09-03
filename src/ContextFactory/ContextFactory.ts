import ContextHolder from './ContextHolder';
import ContextHolderClone from './ContextHolderClone';

export default class ContextFactory {
  private static contexts: Record<string, ContextHolder> = {
    root: new ContextHolder(),
  };

  private static getContextHolder = (region: string) => {
    if (!ContextFactory.contexts[region]) {
      ContextFactory.contexts[region] = new ContextHolder();
    }

    return ContextFactory.contexts[region];
  };

  static getContextHolderClone = (region: string) => {
    const originalContext = ContextFactory.getContextHolder(region);
    return new ContextHolderClone(originalContext);
  };

  static getContext = (region: string) =>
    ContextFactory.getContextHolder(region).context;

  static setDefaultStatePiece = <T>(region: string, base: string, value: T) =>
    ContextFactory.getContextHolder(region).setDefaultBaseState(base, value);
}
