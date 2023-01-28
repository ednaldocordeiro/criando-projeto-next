import { GetStaticProps } from 'next';
import { ReactElement } from 'react';
import { FiUser } from 'react-icons/fi';
import { TiCalendarOutline } from 'react-icons/ti';

import Link from 'next/link';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({
  postsPagination: { results, next_page },
}: HomeProps): ReactElement {
  async function handleLoadMorePosts(): Promise<void> {
    fetch('https://space-traveling-ign.cdn.prismic.io/api/v2/')
      .then(res => res.json())
      .then(data => console.log(data));
  }

  return (
    <main className={commonStyles.main}>
      <div className={styles.postsContainer}>
        {results?.map(result => (
          <div
            className={styles.post}
            key={`${result.uid}-${result.first_publication_date}`}
          >
            <Link href={`/post/${result.uid}`}>
              <a>
                <h1>{result.data.title}</h1>
              </a>
            </Link>
            <p>{result.data.subtitle}</p>
            <div className={commonStyles.info}>
              <span>
                <TiCalendarOutline size={20} style={{ marginRight: '.5rem' }} />
                {format(new Date(result.first_publication_date), 'd MMM YYY', {
                  locale: ptBR,
                })}
              </span>
              <span>
                <FiUser size={20} style={{ marginRight: '.5rem' }} />
                {result.data.author}
              </span>
            </div>
          </div>
        ))}

        {next_page && (
          <button
            type="button"
            onClick={() => handleLoadMorePosts()}
            className={styles.loadMorePosts}
          >
            Carregar mais posts
          </button>
        )}
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('publication', {
    pageSize: 10,
  });

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        results,
        next_page: postsResponse.next_page,
      },
    } as HomeProps,
    revalidate: 60 * 30, // 30 minutes
  };
};
