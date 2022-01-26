import Head from 'next/head'
import Header from '../components/Header'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Gitman Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      {/* banner */}
      <div className='flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0'>
        <div className='px-10 space-y-5 '>
          <h1 className='text-6xl font-serif'> <span className='underline decoration-black decoration-4'>Medium</span> is a place to write, read and connect</h1>
    
          <h2>
            It's easy and free to post your thinking on any topic and connect with millions of readers.
          </h2>
        </div>

        <img className="hidden md:inline-flex h-32 lg:h-min " src="bannerlogo.png" alt="" />
      </div>

      {/* posts */}
       
    </div>
  )
}
