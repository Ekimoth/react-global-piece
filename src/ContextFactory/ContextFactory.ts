import ContextHolder from './ContextHolder';
import ContextHolderClone from './ContextHolderClone';

export default class ContextFactory {
  static contexts: Record<string, ContextHolder> = {
    root: new ContextHolder(),
  };

  static getContextHolder = (region: string) => {
    if (!ContextFactory.contexts[region]) {
      ContextFactory.contexts[region] = new ContextHolder();
    }

    return ContextFactory.contexts[region];
  };

  static getContext = (region: string) =>
    ContextFactory.getContextHolder(region).context;

  static cloneContextHolder = (region: string) => {
    return new ContextHolderClone(ContextFactory.getContextHolder(region));
  };
}
