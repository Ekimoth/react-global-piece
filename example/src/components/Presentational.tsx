import { useEffect } from 'react';
import useAccess from 'state-hooks/useAccess';
import useAuth from 'state-hooks/useAuth';
import useNames from 'state-hooks/useNames';

const Presentational = () => {
  const [{ name, email }] = useAuth();
  const [{ hasAccess }] = useAccess();
  const [{ names, numberOfNames }, { addName }] = useNames();

  useEffect(() => {
    addName('Aleksandra');
  }, [addName]);

  return (
    <>
      <style>
        {`
        .gray-background {
          background: lightgray;
          padding: 1em;
          margin: auto;
          width: 30em;
        }
      `}
      </style>
      <div className="gray-background">
        <p>{name}</p>
        <p>{email}</p>
        <p>{`Has access? ${hasAccess ? 'Yes' : 'No'}.`}</p>
      </div>
      <div>
        <ul>
          {names.map((name, i) => (
            <li key={`${name}-${i}`}>{name}</li>
          ))}
        </ul>
      </div>
      <div>{numberOfNames}</div>
    </>
  );
};

export default Presentational;
