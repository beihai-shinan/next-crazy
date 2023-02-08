import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Reg() {
  const router = useRouter();
  useEffect(() => {
    /**
     *
     *
     *
     */
    // /\[~alias:(.*?)\|\~accountid\\:(\d+)\]/.exec("")
    console.log('222');
    const str =
      'https://tb1.sayweee.net/zh/product/Luobawang-Luo-Si-Tomato-Rice-Noodles/63105 [~alias:@dan.hua |~accountid:7616787] https://tb1.sayweee.net/zh/product/Unif-Tung-I-Instant-Rice-Noodles--Chinese-Onion-Flavor/31758  https://tb1.sayweee.net/review/video/44828?is_link=1  https://tb1.sayweee.net/review/video/44832?is_link=1';
    const res = str.replace(
      /\[~alias:(.*?)\|\~accountid\:(\d+)]/,
      function (match, p1, p2, offset, string) {
        if (!!match && p1 && p2) {
          return `<a href="/lang/account/profile/${p2}">${p1}</a>`;
        }
        return string;
      }
    );
    // console.log(res, 'rrr');
    router.push('https://www.baidu.com');
  }, []);
  return <div>reg demo</div>;
}
