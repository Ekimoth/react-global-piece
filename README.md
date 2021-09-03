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
- [What is "Regional state"?](#what-is-regional-state)
  - [Example](#example)
  - [React's own Context component](#reacts-own-context-component)
  - [The "region" prop/argument](#the-region-prop-of-piecefulprovider-and-the-region-argument-of-createstatepiece-and-usestatepiece)

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

Then you need to declare a "piece of state" in the same file with any component that's going to need it. It returns a hook that can be used for accessing and modifying that state by that component, or any other component for that matter. There are two arguments it requires:
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

Since the state it represents is going to be global for the entire tree wrapped by `PiecefulProvider`, the returned hook can be called from anywhere inside that tree. It returns an array of three elements as shown below:

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

`resetStateValue` is a function that resets the state to its _default value_. It accepts an optional _reducer function_ as an argument which lets you combine the _default value_ with some non-default value of your own choosing.

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

Let's imagine that by the time your component gets rendered you've already got some initial data you want to populate your state with, which can very possibly be different than its _default value_. You can overwrite the _default value_ simply by passing your preferred initial value as an argument to the hook we generated with `createStatePiece`:

```javascript
const [stateValue, setStateValue, resetStateValue] = useUserData({
  name: 'John Cleese',
  email: 'johncleese@mail.com',
});
```

### `useStatePiece`

In fact, you don't even have to generate your state hooks with `createStatePiece`. You can do the exact same thing with `useStatePiece` in runtime from your component's body.
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

## What is "Regional state"?

So-called "regional state" is state that is neither local, nor global. It only exists in a certain part of your React tree and, unlike typical global state, there can be multiple instances of it, all of which can have their own different values. So it's basically state that is global only to the tree it's on top of.

### Example
Consider having something like the following tree
```jsx
const App = () => (
  <PiecefulProvider>
    <Colors />
  </PiecefulProvider>
);

const Colors = () => {
  const [colors] = useStatePiece('colors', ['red', 'blue', 'white', 'yellow', 'green']);
  
  return (
    <>
      {colors.map((color) => <ColorfulComponent color={color} />}
    </>
  );
};

const ColorfulComponent = ({ color }) => {
  return (
    <TopComponent>
      <NestedComponent1 mainColor={color}>
        <NestedComponent2 backgroundColor={color}>
          ...............
            ...............
              ...............
                <NestedComponent9 fallbackColor={color}>
                  <NestedComponent10 textColor={color} />
                </NestedComponent9>
              ...............
            ...............
          ...............
        </NestedComponent2>
      </NestedComponent1>
    </TopComponent>
  );
};
```

And then imagine that each of the `NestedComponent1` through `NestedComponent10` have their own deeply nested elements and components that might need to use that single value of `color`. You'd either have to resort to "prop drilling" or to keep as many of those elements and components within the scope of a single component where `color` exists and then you'd still have to assign each of them with the `color` value separately, as we're already doing in the example above. Or we would eventually remember about the React `Context` component.

### React's own `Context` component
Of course, we've got React `Context` at our disposal. We would typically create a new `Context` with `createContext(...)`, export it so other components could retrieve its value with `useContext(Context)`, then render it inside a new wrapper component where we would assign it an initial value and craft its mutation logic from scratch.

But wait, why should we have to do all that if we're already using a global state management tool? We shouldn't. And this is where `React Pieceful State` comes with a unique and convenient solution out of the box.

### The `region` prop of `PiecefulProvider` and the `region` argument of `createStatePiece` and `useStatePiece`

Both the `region` prop and the `region` argument's default value is `root`. Whenever we use a custom value for any of them, what `React Pieceful State` is essentially doing under the hood is what was described in the [previous section](#the-region-prop-of-piecefulprovider-and-the-region-argument-of-createstatepiece-and-usestatepiece).

Let's go back to the `colors.map()` statement in `ColorfulComponent` and wrap each of its outputs with `PiecefulProvider`, only in this particular instance we give its `region` value a custom value of "myColor". That's everything `React Pieceful State` needs to spare us the trouble and create a new "regional" `Context` for us.

```jsx
return (
  <>
    {colors.map((color) => (
      <PiecefulProvider region="myColor">
        <Color color={color} />
      </PiecefulProvider>
    )}
  </>
);
```

Then go back inside `ColorfulComponent` and make the following modifications:

```javascript
export const useMyColor = createStatePiece('colorValue', '', 'myColor');

const ColorfulComponent = ({ color }) => {
  const [myColor] = useMyColor(color);
  ...
```

That's it, now each and every `NestedComponent1` through `NestedComponent10` that ever needs the `color` value can be spared from prop drilling and prop assignments with that value. All they need to do is refer to the `useMyColor` hook we just generated. Our tree now looks something like this:

```jsx
<TopComponent>
  <NestedComponent1>
    <NestedComponent2>
      ...............
        ...............
          ...............
            <NestedComponent9>
              <NestedComponent10 />
            </NestedComponent9>
          ...............
        ...............
      ...............
    </NestedComponent2>
  </NestedComponent1>
</TopComponent>
```
