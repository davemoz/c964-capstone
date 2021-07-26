import Head from "next/head";
import Header from "../components/Header";
import DataGrid from "../components/DataGrid";

import styles from "../styles/Home.module.scss";

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
        <Header title="Dave Mozdzanowski - C964 Capstone - COVID-19 Resource Allocation Data Product" />
        <DataGrid addlClassNames={styles.grid} />
      </main>

      <div className={styles.source}>
        Data source:{" "}
        <a
          className={styles.source_link}
          href="https://data.cityofnewyork.us/Health/COVID-19-Daily-Counts-of-Cases-Hospitalizations-an/rc75-m7u3"
          target="_blank"
          rel="noreferrer"
        >
          https://data.cityofnewyork.us/Health/COVID-19-Daily-Counts-of-Cases-Hospitalizations-an/rc75-m7u3
        </a>
      </div>

      <footer className={styles.footer}>
        David Mozdzanowski - C964 Capstone - COVID-19 Resource Allocation Data
        Product
      </footer>
    </div>
  );
}
