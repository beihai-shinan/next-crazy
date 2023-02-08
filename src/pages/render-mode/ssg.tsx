import { log } from 'console';
import dayjs from 'dayjs';
import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import DefaultLayout from '~/layouts';
import { delay } from '~/shared/delay';

import { Box, Button, Chip } from '@mui/material';

export default function SsgPage (props: {
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
    </DefaultLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  log("ssg getStaticProps");
  const _ = await delay(2000);
  return {
    props: { dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss') },
  };
};