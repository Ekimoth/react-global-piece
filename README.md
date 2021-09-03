# React Pieceful State

A ridiculously tiny library for global and regional state management in React

---

`React Pieceful State` is a tiny, but straight-forward mechanism for state management in React. It offers management of global and [regional state](#regional-state) with the ease of simply calling a hook on the spot, wherever and whenever you need it.

Some of the benefits it offers:

- Zero boilerplate or in-advance global state setup necessary, it's entirely optional and "decentralized" to your components and hooks
- State data you no longer use will automatically never be even created in your app
- The so-called "[Regional state](#regional-state)" support offers a convenient way to avoid using selectors or tedious prop-drilling from non-global source
- It encourages having your state split into smaller pieces closely wired with their reducers/setters within their own hooks
- Makes it easy to search through your code and detect what piece of state is no longer used and can safely be deleted with no "leftovers"

## Overview
- [Installation](#installation)
- [Usage](#usage)
  - [PiecefulProvider](#piecefulprovider)
  - [useStatePiece](#usestatepiece)
  - [createStatePiece](#createstatepiece)
  - [withPiecefulState](#withpiecefulstate)
- What is "[Regional state](#regional-state)"?
- [Examples](#examples)

## Installation

```sh
npm install react-pieceful-state
```

or

```sh
yarn add react-pieceful-state
```

## Usage

The main two gears of `React Pieceful State` are the `PiecefulProvider` wrapper component and the `useStatePiece` hook.

```javascript
import {
  PiecefulProvider,
  useStatePiece,
} from 'react-pieceful-state';
```

### `PiecefulProvider`

First you need to wrap your app with the `PiecefulProvider` component. No props are required at this point.

```javascript
import { PiecefulProvider } from 'react-pieceful-state';

const App = () => {
  return (
    <PiecefulProvider>
      <Main />
    </PiecefulProvider>
  );
};
```

### `useStatePiece`

You use this hook almost the exact same way you would use `useState`. The only difference is its first argument `base` (_string_), which will be the unique identifier for the piece of state it's used creating for. The second argument is `initialState` which can be of any type of data of your own choosing.

```javascript
const MainApp = () => {
  const [{ name, surname }, setPersonalDataState] = useStatePiece(
    'personal-data',
    {
      name: 'John',
      surname: 'Smith',
    }
  );

  return (
    <>
      <h3>{`Hello ${name} ${surname}`}</h3>
      <PersonalDataInputs />
    </>
  );
};
```

Another two parts are the entirely optional `createStatePiece` hook factory function and the `withPiecefulState` wrapper for your `class components`, if you have any.

```javascript
import {
  createStatePiece,
  withPiecefulState,
} from 'react-pieceful-state';
```

### `createStatePiece`

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

### `withPiecefulState`

You still have some `class component` that isn't going to be converted to `function component` any time soon? The `withGlobalState` higher-order-component `(HOC)` is here. It utilizes the same kind of hooks we've already looked into, or any kind of hooks actually:

```javascript
class MyClassComponent extends PureComponent {
  onChange = ({ target: { name, value } }) => {
    const {
      personalDataHook: [, setPersonalDataState],
    } = this.props;

    setPersonalDataState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  render() {
    const {
      personalDataHook: [{ name, surname }],
    } = this.props;

    return (
      <>
        <p>
          `Hello ${name} ${surname}`
        </p>
        <input type="text" name="name" onChange={this.onChange} />
        <input type="text" name="surname" onChange={this.onChange} />
      </>
    );
  }
}

export default withPiecefulState(MyClassComponent, (ownProps) => ({
  personalDataHook: usePersonalDataPiece(),
}));
```

## Regional state

## Examples

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
    } catch (error) {
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
  const [{ email, password, isLoading, error }, { setInputValue, logIn }] =
    useAuth();

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
