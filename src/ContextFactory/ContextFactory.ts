import ContextHolder from './ContextHolder';
import ContextHolderClone from './ContextHolderClone';

class ContextFactory {
  private static contexts: Record<string, ContextHolder> = {
    root: new ContextHolder(undefined, 'root'),
  };

  private static getContextHolder = (region: string) => {
    if (!ContextFactory.contexts[region]) {
      ContextFactory.contexts[region] = new ContextHolder(undefined, region);
    }

    return ContextFactory.contexts[region];
  };

  static getContextHolderClone = (region: string) => {
    const originalContext = ContextFactory.getContextHolder(region);
    return new ContextHolderClone(originalContext);
  };

  static getContext = (region: string) =>
    ContextFactory.getContextHolder(region).context;

  static setRegionalBaseDefaultValue = <T>(
    region: string,
    base: string,
    value: T
  ) => ContextFactory.getContextHolder(region).setDefaultValue(base, value);
}

export default ContextFactory;
