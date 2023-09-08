// import Image from 'next/image'
import styles from '../../styles/Home.module.css';
import Link from "next/link";

const Footer = () => (
  <footer className={styles.footer}>
    <div>
      <Link href="/">
        Made with 🤞 by Skygazers
      </Link>
    </div>
  </footer>
);

export default Footer;
