import Head from 'next/head';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Stella Global Class</title>
        <meta name="description" content="Stella Global Class Production Server" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <h1 className="title">
          Welcome to <a href="#">Stella Global Class</a>
        </h1>

        <p className="description">
          This is the unified and enhanced production server.
        </p>
      </main>
    </div>
  );
}
