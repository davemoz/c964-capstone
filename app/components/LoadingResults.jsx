import React, { useEffect, useRef, useState } from "react";

import styles from "../styles/LoadingResults.module.scss";

const messages = [
  "Still loading...",
  "Your patience is appreciated...",
  "Almost there..."
]

const LoadingResults = () => {
  const [startCycle, setStartCycle] = useState(false);
  const messageRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setStartCycle(true);
    }, 8000);

    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => messageRef.current && messageRef.current.classList.add('cycle'), 3500);

    return () => clearTimeout(id);
  }, [startCycle]);

  return (
    <div className={styles.row_wrap}>
      {messages.map((message, idx) => {
        return (
          <div className={styles.message} id={`message-${idx}`} key={message} ref={messageRef}>
            {message}
          </div>
        )
      })}
    </div>
  )
};

export default LoadingResults;