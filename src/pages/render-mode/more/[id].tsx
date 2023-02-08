import dayjs from 'dayjs';
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import DefaultLayout from '~/layouts';
import { delay } from '~/shared/delay';

import { Box } from '@mui/material';

export default function MoreSsgPage ({pageId}: {pageId: string}) {
  return (
    <DefaultLayout>
      <Box>
        more ssg page id {pageId}
      </Box>
    </DefaultLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Array(1).fill(0).map((_, index) => {
    return {
      params: {
        id: String(index),
      },
    }
  })
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx.params?.id;
  console.log(ctx, 'dddd');
  
  console.log("more ssg getStaticProps");
  const _ = await delay(2000);
  return {
    props: { dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') ,pageId: id},
  };
};