import React, { FC, ComponentType } from 'react';

const withPiecefulState = <OwnProps, HooksProps>(
  Component: ComponentType<OwnProps & HooksProps>,
  useHooks: (ownProps: OwnProps) => HooksProps
) => {
  const displayName = `withPiecefulState(${
    Component.displayName || Component.name || 'Component'
  })`;

  const WrapperComponent: FC<OwnProps> = (ownProps) => {
    const hooksOutputs = useHooks(ownProps);
    return <Component {...ownProps} {...hooksOutputs} />;
  };

  WrapperComponent.displayName = displayName;

  return WrapperComponent;
};

export default withPiecefulState;
