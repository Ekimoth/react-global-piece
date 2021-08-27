import React, { ComponentType } from 'react';

const withGlobalState =
  <OwnProps, HooksProps>(
    Component: ComponentType<OwnProps & HooksProps>,
    useHooks: (ownProps: OwnProps) => HooksProps
  ): ComponentType<OwnProps> =>
  (ownProps) => {
    const hooksResults = useHooks(ownProps);

    return <Component {...ownProps} {...hooksResults} />;
  };

export default withGlobalState;
