import React, { FC, ComponentType } from 'react';

const withPiecefulState =
  <OwnProps, HooksProps>(
    Component: ComponentType<OwnProps & HooksProps>,
    useHooks: (ownProps: OwnProps) => HooksProps
  ): FC<OwnProps> =>
  (ownProps) => {
    const hooksOutputs = useHooks(ownProps);
    return <Component {...ownProps} {...hooksOutputs} />;
  };

export default withPiecefulState;
