import React from 'react';
import type {} from 'react/experimental';

export const Uhyo: React.FC = async () => {
  const uhyoData = (
    await import('../../data/uhyo.json', {
      with: { type: 'json' },
    })
  ).default;
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return (
    <section>
      <h2>Hello, I'm {uhyoData.name}</h2>
      <p>I am {uhyoData.age}</p>
      <p>My favorite languages are:</p>
      <ul>
        {uhyoData.favoriteLanguages.map((lang, i) => (
          <li key={i}>{lang}</li>
        ))}
      </ul>
    </section>
  );
};
