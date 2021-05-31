import Head from "next/head";
import Header from "../components/Header";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>
          Dave Mozdzanowski - C964 Capstone - COVID-19 vaccine resource
          allocator
        </title>
        <meta
          name="description"
          content="A project to determine where vaccine resources should be allocated in NYC."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Header
          title="Dave Mozdzanowski - C964 Capstone - COVID-19 vaccine resource allocator"
          description="Use the interface below to view vaccine allocation data."
        />

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        David Mozdzanowski - C964 Capstone - COVID-19 vaccine resource allocator
      </footer>
    </div>
  );
}
