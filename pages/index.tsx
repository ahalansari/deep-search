import Head from 'next/head';
import SearchInterface from '../components/SearchInterface';

export default function Home() {
  return (
    <>
      <Head>
        <title>DeepSearch Engine - AI-Powered Search</title>
        <meta name="description" content="Enhanced AI-powered search with multi-round deep analysis capabilities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <SearchInterface />
      </main>
    </>
  );
}