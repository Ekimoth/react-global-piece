# React Global Piece
A tiny mechanism for keeping and handling global state in React apps

-----------------

`React Global Piece (RGP)` is a ridiculously tiny, but straight-forward mechanism for state management in React. It utilizes what's already there in React - contexts and hooks, and is inspired entirely by the interface and the convenience offered by the `useState` and the `useReducer` hooks.

Some of the benefits you're getting:
- Zero boilerplate or in-advance state setup
- Encourages having your state split into smaller pieces closely wired with their own setters or reducers, encapsulated in their own custom hooks
- Makes it easy to search through your code and detect what piece of state is no longer needed and can safely be deleted

## Installation
```sh
npm install react-global-piece
```
or
```sh
yarn add react-global-piece
```

## Overview
The main two gears of `RGP` are the `RootProvider` component and the `useGlobalState` hook.
Another two segments are the `createStatePiece` hook factory function and the `withGlobalState` HOC (if we have any `class components` still lying around).

```javascript
import {
  RootProvider,
  useGlobalState,
  createStatePiece,
  withGlobalState,
} from 'react-global-piece';
```

## Usage
### `RootProvider`
##### `<RootProvider>...</RootProvider>`

First you need to wrap your app with the `RootProvider` component. That's it, no props needed.
```javascript
import { RootProvider } from 'react-global-piece';

const App = () => {
  return (
    <RootProvider>
      <Main />
    </RootProvider>
  );
};
```

### `useGlobalState`
##### `useGlobalState(id: string, initialState: T) => [currentState: T, stateUpdater: (state: T) => T]`
You use this hook almost the exact same way you would use `useState`. The only difference is its first argument `key` (_string_), which will be the unique identifier for the piece of state it's used creating for. The second argument is `initialState` which can be of any type of data of your own choosing.
```javascript
const MainApp = () => {
  const [{ name, surname }, setPersonalDataState] = useGlobalState('personal-data', {
    name: 'John',
    surname: 'Smith',
  });
  
  return (
    <>
      <h3>{`Hello ${name} ${surname}`}</h3>
      <PersonalDataInputs />
    </>
  );
};
```

### `createStatePiece`
##### `createStatePiece(id: string, initialState: T) => (() => typeof useGlobalState(id, initialState))`
`useGlobalState` creates a piece of state and gives it an initial value, but it does it on first use in runtime. If we want to avoid that there's the `createStatePiece` hook factory at our disposal. It accepts the same arguments as `useGlobalState`. It initialized your piece of state before your app starts rendering and returns a hook which can later be used anywhere inside your app's body the same way as `useGlobalState`, only without passing the same arguments over and over.

```javascript
export const usePersonalDataPiece = createStatePiece('personal-data', {
  name: 'John',
  surname: 'Smith',
});

const MainApp = () => {
  const [{ name, surname }, setPersonalDataState] = usePersonalDataPiece();

  return (
    <>
      <h3>{`Hello ${name} ${surname}`}</h3>
      <PersonalDataInputs />
    </>
  );
};

// And that's it, `personal-data` is now globally available, along with its setter function which in
// this case we named `setPersonalDataState`. Its only argument is a reducer function - again, similarly
// as it's with the `useState` hook. Knowing that we can now test whether if we change any of its value
// from one component it's going to be reflected in another component. We can do so by having something
// like the following code and then observe what happens in the `MainApp` component when we start typing
// some text the `input` elements.

const PersonalDataInputs = () => {
  const [, setPersonalDataState] = usePersonalDataPiece();

  const onChange = ({ target: { name, value } }) => {
    setPersonalDataState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  return (
    <>
      <input type="text" name="name" onChange={onChange} />
      <input type="text" name="surname" onChange={onChange} />
    </>
  );
};
```

### `withGlobalState`
##### `withGlobalState(component: ComponentClass<OwnProps, HookOutputProps>, useHook: (ownProps: OwnProps) => HookOutputProps) => ComponentClass<OwnProps>`
You still have some `class component` that isn't going to be converted to `function component` any time soon? The `withGlobalState` higher-order-component `(HOC)` is here. It utilizes the same kind of hooks we've already looked into, or any kind of hooks actually:

```javascript
class MyClassComponent extends PureComponent {
  onChange = ({ target: { name, value } }) => {
    const { personalDataHook: [, setPersonalDataState] } = this.props;
  
    setPersonalDataState((state) => ({
      ...state,
      [name]: value,
    }));
  };
  
  render() {
    const { personalDataHook: [{ name, surname }] } = this.props;
    
    return (
      <>
        <p>`Hello ${name} ${surname}`</p>
        <input type="text" name="name" onChange={this.onChange} />
        <input type="text" name="surname" onChange={this.onChange} />
      </>
    );
  };
}

export default withGlobalState(MyClassComponent, (ownProps) => {
  personalDataHook: usePersonalDataPiece(),
});
```

#### Example
Let's now see how we can use what we learned.

```javascript
import { createStatePiece } from 'react-global-piece';

const useAuthState = createStatePiece('auth', {
  email: '',
  password: '',
  authToken: '',
  isLoading: false,
  isLoggedIn: false,
  error: '',
});

const useAuth = () => {
  const [authState, setAuthState] = useAuthState();
  
  const setInputValue = ({ target: { name, value } }) => {
    setAuthState((state) => ({
      ...state,
      [name]: value,
    }));
  };
  
  const logIn = async () => {
    const { email, password } = authState;
  
    setAuthState((state) => ({
      ...state,
      isLoading: true,
      error: '',
    }));
    
    try {
      const { authToken } = await someHttpsPostCall({ email, password });
      
      setAuthState((state) => ({
        ...state,
        authToken,
        isLoading: false,
        isLoggedIn: true,
      }));
    } catch(error) {
      setAuthState((state) => ({
        ...state,
        error,
        isLoading: false,
      }));
    }
  };
  
  return [authState, { setInputValue, logIn }];
};

const PersonalDataInputs = () => {
  const [{ email, password, isLoading, error }, { setInputValue, logIn }] = useAuth();

  return (
    <>
      {isLoading && <p>Submitting...</p>}
      {error && <p>{error}</p>}
      <input type="text" name="email" onChange={setInputValue} />
      <input type="password" name="password" onChange={setInputValue} />
      <button onClick={logIn}>Login</button>
    </>
  );
};
```

