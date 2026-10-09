import type { ReactNode } from "react";
import MicrositeHeader from "../components/MicrositeHeader";
import MicrositeFooter from "../components/MicrositeFooter";
import { ToastProvider } from "../components/Toast";
import styles from "../styles/microsite.module.css";

type MicrositeLayoutProps = {
  children: ReactNode;
};

/**
 * The provider sits here, at the root of the microsite, rather than around each
 * screen. A toast confirming a delete has to outlive the dialog that triggered it,
 * and one confirming a save has to survive the navigation that follows - both of
 * which unmount the page that asked for it.
 */
const MicrositeLayout = ({ children }: MicrositeLayoutProps) => {
  return (
    <ToastProvider>
      <div className={styles.shell}>
        <MicrositeHeader />
        <main className={styles.main}>{children}</main>
        <MicrositeFooter />
      </div>
    </ToastProvider>
  );
};

export default MicrositeLayout;
