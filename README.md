# React Global Piece
A tiny mechanism for keeping and handling global state in React apps

-----------------

React Global Piece (RGP) is a ridiculously tiny, but straight-forward mechanism for state management in React. It uses what's already there in React - `Context` and `Hooks`, and is inspired by the APIs and conveniences offered by the `useState` and the `useReducer` hooks.

- Zero boilerplate or in-advance state setup
- Encourages having your state split into smaller pieces, closely wired with their own setters or reducers
- Makes it easy to search through your code what piece of state is no longer needed and can safely be deleted

The main two gears of RGP are the `RootProvider` component and the `useGlobalState` hook, along with the entirely optional, but recommended use of the `createStatePiece` factory function.

```javascript
import {
  RootProvider,
  useGlobalState,
  createStatePiece,
} from 'react-global-state';
```

## Installation
```sh
npm install react-global-piece
```
or
```sh
yarn add react-global-piece
```

## Usage
### `RootProvider`

First you need to wrap your app with the `RootProvider` component. That's it, no props needed.
```javascript
import { RootProvider } from 'react-global-state';

const App = () => {
  return (
    <RootProvider>
      <Main />
    </RootProvider>
  );
};
```

### `useGlobalState`
You use this hook almost the exact same way you would use `useState`. The only difference is its first argument `key` string, which will be the unique identifier for the piece of state it's used creating for. The second argument is `initialState` which can be any type of data of your own choosing.
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

And that's it, `personal-data` is now globally available, along with its setter function `setPersonalDataState`. Its only argument is a reducer function - again, similarly as it is with the `useState` hook.
```javascript
import { useGlobalState } from 'react-global-state';

const PersonalDataInputs = () => {
  const [, setPersonalDataState] = useGlobalState('personal-data', {
    name: 'John',
    surname: 'Smith',
  });

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

### Additional pointers and considerations with examples
Wait, why did I give `personal-data` state an initial state again? Don't worry, only the first-ever given initial value for `personal-data` will be taken into consideration.
Still seems like a tedious thing to be forced to do? You're right. You actually don't have to do that every time you need that exact piece of state.

There are two options for avoiding this, and since they're not mutually exclusive you'd probably end up using both:

1. Create a dedicated custom hook that would encapsulate a single piece of state
2. The `createStatePiece` factory function

#### Example 1: Creating a dedicated custom hook for one particular piece of state
```javascript
const usePersonalData = () => {
  const [personalDataState, setPersonalDataState] = useGlobalState('personal-data', {
    name: '',
    surname: '',
  });
  
  const setName = (name) => {
    setPersonalDataState((state) => ({
      ...state,
      name,
    }));
  };
  
  const setSurname = (surname) => {
    setPersonalDataState((state) => ({
      ...state,
      surname,
    }));
  };
  
  return [personalDataState, { setName, setSurname }];
};

const PersonalDataInputs = () => {
  const [{ name, surname }, { setName, setSurname }] = usePersonalData();

  const onChangeName = ({ target: { value } }) => {
    setName(value);
  };
  
  const onChangeSurname = ({ target: { value } }) => {
    setSurame(value);
  };

  return (
    <>
      <input type="text" name="name" onChange={onChangeName} />
      <input type="text" name="surname" onChange={onChangeSurname} />
    </>
  );
};
```

#### Example 2: The `createStatePiece` factory function
In all previous examples global state works fine as intended, but you might have noticed one thing - its initial state is set in runtime on first-run. That can also be avoided with the `createStatePiece` function, with which you give your `piece of state` an initial value before your app is rendered.
```javascript
import { createStatePiece } from 'react-global-state';

const usePersonalDataPiece = createStatePiece('personal-data', {
  name: '',
  surname: '',
});

const usePersonalDataState = () => {
  const [personalDataState, setPersonalDataState] = usePersonalDataPiece();
  
  const setName = (name) => {
    setPersonalDataState((state) => ({
      ...state,
      name,
    }));
  };
  
  const setSurname = (surname) => {
    setPersonalDataState((state) => ({
      ...state,
      surname,
    }));
  };
  
  return [personalDataState, { setName, setSurname }];
};
```

### Plans for the future
- Out-of-the-box support for class components
