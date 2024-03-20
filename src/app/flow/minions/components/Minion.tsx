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
    <>
      <div className={styles.container} style={style}>
        <div className={styles.head}>
          <svg height={230} width={160}>
            <path
              d="M 0 80 Q 0 0 80 0 Q 160 0 160 80 Q 150 170 110 200 Q 100 220 80 220 Q 60 220 50 200 Q 10 170 0 80"
              fill="#916953"
              stroke="black"
              strokeWidth="8"
            />
          </svg>
          <div className={styles.eyebrow}>
            <svg height={40} width={30}>
              <path d="m 0 10 q 15 -10 30 0 v 5 q -15 -10 -30 0 v -5" />
            </svg>
          </div>
          <div className={styles.eye}></div>
          <div className={`${styles.eyebrow} ${styles["eyebrow-right"]}`}>
            <svg height={40} width={30}>
              <path d="m 0 10 q 15 -10 30 0 v 5 q -15 -10 -30 0 v -5" />
            </svg>
          </div>
          <div className={`${styles.eye} ${styles["eye-right"]}`}></div>
        </div>
        <div className={styles.body}>
          <svg height={370} width={250}>
            <path
              d="M 0 80 Q 0 0 80 0 Q 120 0 160 0 Q 240 0 240 80 Q 240 200 200 320 Q 180 360 160 360 Q 120 360 90 360 Q 70 360 50 320 Q 0 200 0 80"
              fill="#aad3df"
              stroke="black"
              strokeWidth="8"
            />
          </svg>
        </div>
      </div>
      {children}
    </>
  );
}
