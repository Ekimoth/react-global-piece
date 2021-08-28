import { PiecefulProvider } from 'react-pieceful-state';

import Inputs from 'components/Inputs';
import Presentational from 'components/Presentational';
import MyClassComponent from 'components/MyClassComponent';

function App() {
  return (
    <PiecefulProvider>
      <Inputs />
      <Presentational />
      <MyClassComponent name="Romeo" />
    </PiecefulProvider>
  );
}

export default App;
