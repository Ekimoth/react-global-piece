import { RootProvider } from 'react-global-state';

import Inputs from 'components/Inputs';
import Presentational from 'components/Presentational';

function App() {
  return (
    <RootProvider>
      <Inputs />
      <Presentational />
    </RootProvider>
  );
}

export default App;
