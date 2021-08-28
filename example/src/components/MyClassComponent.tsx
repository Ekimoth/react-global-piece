import { PureComponent } from 'react';
import { withPieceful } from 'react-pieceful-state';

import useNames from 'state-hooks/useNames';
import useNumber from 'state-hooks/useNumber';

const useHooks = ({ name }: OwnProps) => ({
  namesHook: useNames(name),
  numberHook: useNumber(),
});

interface OwnProps {
  name: string;
}

type HooksProps = ReturnType<typeof useHooks>;

type Props = OwnProps & HooksProps;

class MyClassComponent extends PureComponent<Props> {
  increaseNumber = () => {
    const {
      namesHook: [, { addName }],
    } = this.props;

    addName();
  };

  render() {
    const {
      numberHook: [number],
      name,
    } = this.props;

    return (
      <div>
        {`The number is ${number} for ${name}`}
        <button onClick={this.increaseNumber}>Click me</button>
      </div>
    );
  }
}

export default withPieceful(MyClassComponent, useHooks);
