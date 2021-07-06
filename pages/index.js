import dynamic from "next/dynamic";
import Head from "next/head";
import Header from "../components/Header";
import DataGrid from "../components/DataGrid";
import Loading from "../components/Loading";
const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => <Loading />,
});

import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>
          Dave Mozdzanowski - C964 Capstone - COVID-19 Resource Allocation Data
          Product
        </title>
        <meta
          name="description"
          content="A project to determine where vaccine resources should be allocated in NYC."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Header
          title="Dave Mozdzanowski - C964 Capstone - COVID-19 Resource Allocation Data Product"
          description="Use the interface below to sort and view data."
        />
        <DataGrid addlClassNames={styles.grid} />
      </main>

      <footer className={styles.footer}>
        David Mozdzanowski - C964 Capstone - COVID-19 Resource Allocation Data
        Product
      </footer>
    </div>
  );
}
