import dynamic from "next/dynamic";
import Head from "next/head";
import Header from "../components/Header";
import DataGrid from "../components/DataGrid";

import styles from "../styles/Home.module.css";

import Loading from "../components/Loading";
const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => <Loading />,
});

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

        <DataGrid addlClassNames={styles.grid} />

        <Map />
      </main>

      <footer className={styles.footer}>
        David Mozdzanowski - C964 Capstone - COVID-19 vaccine resource allocator
      </footer>
    </div>
  );
}
