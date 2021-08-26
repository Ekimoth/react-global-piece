import { useEffect } from 'react';

import useAccess from 'state-hooks/useAccess';
import useAuth from 'state-hooks/useAuth';
import useNames from 'state-hooks/useNames';

const Inputs = () => {
  const [{ name, email, isAdmin }, { setName, setEmail }] = useAuth();
  const [, { toggleAccess }] = useAccess();
  const [{ names }, { addName }] = useNames();

  useEffect(() => {
    addName('John');
  }, [addName]);

  return (
    <>
      <style>
        {`
          .inputs {
            margin: 5em auto;
            width: 30em;
          }

          .input {
            width: 100%;
          }
        `}
      </style>
      <div className="inputs">
        <div>
          <input
            className="input"
            type="text"
            placeholder="Name"
            defaultValue={name}
            onChange={setName}
          />
        </div>
        <div>
          <input
            className="input"
            type="text"
            placeholder="E-mail"
            defaultValue={email}
            checked={isAdmin}
            onChange={setEmail}
          />
        </div>
        <div>
          <ul>
            {names.map((name, i) => (
              <li key={`${name}-${i}`}>{name}</li>
            ))}
          </ul>
        </div>
        <button type="button" onClick={toggleAccess}>
          Toggle Access
        </button>
      </div>
    </>
  );
};

export default Inputs;
