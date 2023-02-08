// import { useTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

const SecondPage = () => {

  // const { t } = useTranslation(['common', 'footer'])

  return (
    <>
      <main>
        <Link href='/'>
          <button
            type='button'
          >
            back-to-home
          </button>
        </Link>
        <footer>footer</footer>
      </main>
    </>
  )
}

export const getStaticProps = async ({ locale }:any) => ({
  props: {
    // ...await serverSideTranslations(locale, ['common', 'footer']),
  },
})

export default SecondPage