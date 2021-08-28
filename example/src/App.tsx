import { RootProvider } from 'react-pieceful-state';

import Inputs from 'components/Inputs';
import Presentational from 'components/Presentational';
import MyClassComponent from 'components/MyClassComponent';

function App() {
  return (
    <RootProvider>
      <Inputs />
      <Presentational />
      <MyClassComponent name="Romeo" />
    </RootProvider>
  );
}

export default App;
