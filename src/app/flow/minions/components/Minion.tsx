import { type CSSProperties, type ReactNode } from "react";
import styles from "./minion.module.css";

export default function Minion({
  children,
  style,
}: {
  children?: ReactNode;
  style?: CSSProperties;
}) {
  // console.log({ styles });

  return (
    <div className={styles.container} style={style}>
      <div className={styles.head}>
        <svg height={240} width={180}>
          <path
            d="m 10 90 q 0 -80 80 -80 q 80 0 80 80 q -10 90 -50 120 q -10 20 -30 20 q -20 0 -30 -20 q -40 -30 -50 -120"
            fill="#916953"
            stroke="black"
            strokeWidth="8"
          />
        </svg>

        <div className={styles.eye}>
          <div className={styles.eyebrow}>
            <svg height={40} width={30}>
              <path d="m 0 10 q 15 -10 30 0 v 5 q -15 -10 -30 0 v -5" />
            </svg>
          </div>
        </div>

        <div className={`${styles.eye} ${styles["eye-right"]}`}>
          <div className={`${styles["eyebrow-right"]}`}>
            <svg height={40} width={30}>
              <path d="m 0 10 q 15 -10 30 0 v 5 q -15 -10 -30 0 v -5" />
            </svg>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <svg height={380} width={260}>
          <path
            d="m 10 90 q 0 -80 80 -80 q 40 0 80 0 q 80 0 80 80 q 0 120 -40 240 q -20 40 -40 40 q -40 0 -70 0 q -20 0 -40 -40 q -50 -120 -50 -240"
            fill="#aad3df"
            stroke="black"
            strokeWidth="8"
          />
        </svg>
      </div>
      {children}
    </div>
  );
}
