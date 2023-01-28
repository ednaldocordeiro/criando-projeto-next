import { ReactElement } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import styles from './header.module.scss';

export default function Header(): ReactElement {
  return (
    <div className={styles.headerContainer}>
      <header>
        <Link href="/">
          <a>
            <Image src="/logo.svg" alt="logo" width={250} height={50} />
          </a>
        </Link>
      </header>
    </div>
  );
}
