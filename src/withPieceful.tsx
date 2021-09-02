import React, { ComponentType } from 'react';

const withPieceful =
  <OwnProps, HooksProps>(
    Component: ComponentType<OwnProps & HooksProps>,
    useHooks: (ownProps: OwnProps) => HooksProps
  ): ComponentType<OwnProps> =>
  (ownProps) => {
    const hooksOutputs = useHooks(ownProps);
    return <Component {...ownProps} {...hooksOutputs} />;
  };

export default withPieceful;
