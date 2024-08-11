import React, { Suspense } from 'react';
import { getAll } from '../data/db';

export default function Page() {
  return (
    <>
      <h1>Hello server component!</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <Albums />
      </Suspense>
    </>
  );
}

async function Albums() {
  const albums = await getAll();
  return (
    <ul>
      {albums.map((album) => (
        <li key={album.id}>
          <img src={album.cover} alt={album.title} />
          <div>
            <h3>{album.title}</h3>
            <p>{album.songs.length}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
