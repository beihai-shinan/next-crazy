import { log } from 'console';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import DefaultLayout from '~/layouts';
import { delay } from '~/shared/delay';

import { Box, Chip, List, ListItem } from '@mui/material';

export default function SsrPage (props: {
  dateTime: string;
}) {
  const [buildTime, setBuildTime] = useState('');
  useEffect(() => {
    setBuildTime(dayjs().format('YYYY-MM-DD HH:mm:ss'));
  }, [])
  return (
    <DefaultLayout>
      <Box>
        <Chip label={`页面组件生成的时间:${props.dateTime}`} />
        <Chip label={`页面元素加载完成的时间:${buildTime}`} />
      </Box>
      <List>
        {
          Array(10000).fill(0).map((_, index) => {
            return (
              <ListItem key={index}>{index}</ListItem>
            )
          })
        }
      </List>
    </DefaultLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async () => {
  const dateTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  log('ssr getServerSideProps');
  const _ = await delay(2000);
  return {
    props: { dateTime },
  };
};
