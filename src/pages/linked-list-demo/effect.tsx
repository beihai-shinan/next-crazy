import { useCountDown } from 'ahooks';
import { useEffect, useState } from 'react';

/**
 * 问题: 首页倒计时组件会在一段时间之后出现 useEffect 钩子数量变少的问题
 * 猜想:
 * react 错误提示说我提前 return 了, 在代码中确实有 return 的情况, 但是都是在条件成立的情况下
 * 代码段:
 *
 * if (!(initialVisible && loading) && !visible) {
    return null;
  }
  if (!copyInfo?.show) {
    return null;
  }
  return (...)
 * 这里的代码希望验证这个猜想而解决问题
 * @returns {JSX.Element}
 */
export default function EffectLinkedError() {
  const [load, setLoad] = useState(true);
  const [timeStamp, formatted] = useCountDown({
    targetDate: new Date('2022-06-30'),
    interval: 1000,
    onEnd: () => {
      console.log('倒计时结束');
    }
  })
  useEffect(() => {
    setTimeout(() => {
      setLoad(!load);
    }, 2000)
  }, [])

  if(!load) {
    return null;
  }

  return (
    <div>
      <div>截止时间: {formatted.days}天:{formatted.hours}小时:{formatted.minutes}分:{formatted.seconds}秒</div>
      <Child1 />
    </div>
  )
}

function Child1 () {
  useEffect(() => {
    setInterval(() => {
      console.log('child1');
    }, 2000)
  }, [])
  return (
    <div>
      <div>Child1</div>
    </div>
  )
}