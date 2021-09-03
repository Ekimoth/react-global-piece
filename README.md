# React Pieceful State
A ridiculously tiny library for global and regional state management in React

----

`React Pieceful State` is a tiny, but straight-forward mechanism for state management in React. It offers management of global and [regional state](#regional-state) with the ease of simply calling a hook on the spot, wherever and whenever you need it.

Some of the benefits it offers:

- [x] Zero boilerplate or in-advance global state setup necessary - it's entirely optional and "decentralized" to your components and hooks
- [x] State data you no longer use will automatically never be even created in your app
- [x] So-called "[regional state](#regional-state)" support
- [x] It encourages having your state split into smaller pieces
- [x] Makes it easy to search through your code and detect what piece of state is no longer used and can safely be deleted with no "leftovers"

## Overview
- [Installation](#installation)
- [Usage](#usage)
  - [PiecefulProvider](#piecefulprovider)
  - [createStatePiece](#createstatepiece)
  - [useStatePiece](#usestatepiece)
  - [withPiecefulState](#withpiecefulstate)
- What is "[Regional state](#regional-state)"?

## Installation

```sh
npm install react-pieceful-state
```

or

```sh
yarn add react-pieceful-state
```

## Usage

There are four `React Pieceful State` exports at your disposal:
- [PiecefulProvider](#piecefulprovider)
- [createStatePiece](#createstatepiece)
- [useStatePiece](#usestatepiece)
- [withPiecefulState](#withpiecefulstate)

```javascript
import {
  PiecefulProvider,
  createStatePiece,
  useStatePiece,
  withPiecefulState,
} from 'react-pieceful-state';
```

### `PiecefulProvider`

First you need to wrap your app with the `PiecefulProvider` component. No props are required at this point.

<sub>There is also an optional _string_ prop called `region`, which is explained in the [Regional state](#regional-state) section</sub>

```jsx
import { PiecefulProvider } from 'react-pieceful-state';

const App = () => {
  return (
    <PiecefulProvider>
      <Main />
    </PiecefulProvider>
  );
};
```

### `createStatePiece`

`createStatePiece` is a function used for declaring a "piece of state" before your app gets rendered. It returns a hook that can later be used for accessing and modifying that state from your app. There are two arguments it requires:
- `base` _string_ - this will be the unique identifier of the "piece of state" we're creating
- `defaultValue` _any_ - its _default value_ (not to confuse it with _initial value_)

<sub>There is also a third optional _string_ argument called `region`, which is explained in the [Regional state](#regional-state) section</sub>

```javascript
const useUserData = createStatePiece('user-data', {
  name: '',
  email: '',
});

const SomeComponent = () => {
  ...
};
```

Since the state it represents is going to be global for the entire tree wrapped by the `PiecefulProvider` component, the returned hook can be called from anywhere inside that tree. It returns an array of three elements as shown below:

```javascript
import useUserData from 'your-path-to-the/useUserData';

const AnyComponentOrHook = () => {
  const [currentStateValue, setStateValue, resetStateValue] = useUserData();
  // or destructure it directly: const [{ name, email }, setStateValue, resetStateValue] = useUserData();
};
```

`setStateValue` is a state setter function that only requires a single _reducer function_ as an argument:

```javascript
setStateValue((state) => ({
  ...state,
  name: 'John Smith',
}));
```

`resetStateValue` is a function that resets the state to its _default value_. It accepts an optional _reducer function_ as an argument which lets combine the _default value_ with some non-default value of your own choosing.

```javascript
// sets the state to its default value
resetStateValue();

// also sets the state to its default value
resetStateValue((defaultState) => ({ ...defaultState }));

// sets the state to its default value combined with your own specific modifications
resetStateValue((defaultState) => ({
  ...defaultState,
  name: '[name was deleted]',
}));
```

Let's imagine that by the time your component gets rendered you've already got some initial data you want to populate your state with, which can very possibly be different than its _default value_. This is why the hook we generated with `createStatePiece` accepts an optional argument `initialState` for overriding the _default state_.

```javascript
const [stateValue, setStateValue, resetStateValue] = useUserData({
  name: 'John Cleese',
  email: 'johncleese@mail.com',
});
```

### `useStatePiece`

In fact, you don't even have to generate your state hooks with `createStatePiece`. You can do the exact same thing with `useStatePiece` in runtime.
It accepts the same two mandatory arguments as the former: `base` and `default value`, which in this case will serve as `initial value` as well.

<sub>Again, there is the third, optional _string_ argument called `region`, which is explained in the [Regional state](#regional-state) section</sub>

```javascript
const [{ name, email }, setStateValue, resetStateValue] = useStatePiece('user-data', {
  name: someNameInputValue || '',
  email: someEmailInputValue || '',
});
```

To avoid retyping this hook call along with all of its required arguments across your app, it's recommended that you wrap it in your own custom hook and then reuse that hook, like so: 

```javascript
import { useStatePiece } from 'react-pieceful-state';

const useUserData = (initialName, initialEmail) => {
  const [{ name, email }, setStateValue] = useStatePiece('user-data', {
    name: initialName || '',
    email: initialEmail || '',
  });

  const setName = (name) => {
    setStateValue((state) => ({ ...state, name }));
  };
  
  const setEmail = (email) => {
    setStateValue((state) => ({ ...state, email }));
  };
  
  return [{ name, email }, { setName, setEmail }];
};

export default useUserData;
```

### `withPiecefulState`

`withPiecefulState` is a component wrapper function that makes it possible for `class components` to use hooks. It accepts two arguments:
- The class component to be wrapped
- A function whose only argument are the wrapped component's own props, which may or may not return an unlimited number of hook outputs, which would otherwise be impossible to do from the body of a `class component`.

```javascript
class MyClassComponent extends PureComponent {
  constructor(props) {
    super(props);
    
    // how you would destructure hooks' output
    const {
      userDataHook: [{ name, email }, { setName, setEmail }],
      someOtherHook: [someStateValue, setSomeStateValue],
    } = props;
  }

  onNameChange = ({ target: { value } }) => {
    const {
      userDataHook: [, { setName }],
    } = this.props;

    setName(value);
  };
  
  onEmailChange = ({ target: { value } }) => {
    const {
      userDataHook: [, { setEmail }],
    } = this.props;

    setEmail(value);
  };

  render() {
    const {
      userDataHook: [{ name, email }],
    } = this.props;

    return (
      <>
        <p>
          {`Hello ${name} (${email})`}
        </p>
        <input type="text" name="name" onChange={this.onNameChange} />
        <input type="email" name="email" onChange={this.onEmailChange} />
      </>
    );
  }
}

export default withPiecefulState(MyClassComponent, (ownProps) => {
  // any code can be run here, just as with any hook or function in general
  // including void hook calls, such as useEffect()

  return {
    userDataHook: useUserData(ownProps.initialName, ownProps.initialEmail),
    someOtherHook: useState(false),
  };
});
```

## Regional state

{{no text yet}}
