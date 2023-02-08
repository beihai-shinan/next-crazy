import qs from 'qs';
import { v4 as uuid } from 'uuid';
import nookies from 'nookies';
import { match } from 'path-to-regexp';

export enum PageNameV2 {
  mweb_bogo = 'mweb_bogo',
  mweb_rtg_home = 'mweb_rtg_home',
  mweb_rtg_vendor = 'mweb_rtg_vendor',
  mweb_rtg_product = 'mweb_rtg_product',
  mweb_rtg_search_result = 'mweb_rtg_search_result',
  mweb_home = 'mweb_home',
  mweb_category = 'mweb_category'
}

export const isServer: boolean = typeof window === 'undefined';

export function getPathNoLangOnClient(url?: string) {
  if (!window) return '';
  const pathname = url || window.location.pathname;
  const pathNoLang = pathname.replace(/^(\/)?(zht|zh|en|es|ko|ja|vi)?/, '');
  if (pathNoLang.indexOf('/') !== 0) {
    return '/' + pathNoLang;
  }
  return pathNoLang;
}

export const route2PVEventV2 = {
  '/': PageNameV2.mweb_home,
  '/category/:slug*': PageNameV2.mweb_category
};

function getPageEventNameByMapConfig(pathUrl: string, mapConfig: any) {
  let [urlStr = '/'] = pathUrl.split('?');

  const allRoutes = Object.keys(mapConfig);
  const matched = allRoutes.find(route => {
    try {
      const fn = match(route, { decode: decodeURIComponent });
      const res = fn(urlStr);

      return !!res;
    } catch (err) {
      return false;
    }
  });

  return matched ? mapConfig[matched] : '';
}

/**
 * 目前需要新老2套的PV映射关系, 这个是处理新的
 * @param pathUrl url
 * @returns matched route mapping
 */
export function getPageEventNameV2(pathUrl: string) {
  return getPageEventNameByMapConfig(pathUrl, route2PVEventV2);
}

/**
 * 获取cookies
 * @param key
 * @param ctx client端为空
 */
export const getCookie = (key: string, ctx?: any) => {
  const cookies = nookies.get(ctx || {}) || {};
  return cookies[key];
};

interface IPageContext {
  referer_page_url: string;
  referer_page_key: string;
  referer_view_id: string;
  page_url: string;
  page_key: string;
  view_id: string;
}
function getViewId() {
  return uuid().replace(/-/g, '');
}
class PageContext {
  private page_urls: string[] = [];
  private page_keys: string[] = [];
  private view_ids: string[] = [];

  constructor() {
    //首次加载的时候需要处理2种情况
    //1.有document.referer
    //2.没有referer, 需要从sessionStorage中获取
    if (!isServer) {
      const referer_page_url =
        sessionStorage.getItem('referer_page_url') || document.referrer;
      if (referer_page_url) {
        const pageKey = sessionStorage.getItem('referer_page_key');
        const referer_page_key = pageKey || this.getPageKey(referer_page_url);
        if (referer_page_key) {
          const referer_view_id =
            sessionStorage.getItem('view_id') || getViewId();
          this.addPage(referer_page_url, referer_page_key, referer_view_id);
        }
      }
    }
  }

  getPageKey(url: string, params?: Record<string, string>) {
    //如果在搜索页面没有关键词和搜索结果, 需要处理成别的page_key
    let _url: URL;
    try {
      _url = new URL(url);
    } catch (e) {
      return '';
    }

    return getPageEventNameV2(getPathNoLangOnClient(_url.pathname));
  }

  addPage(
    url: string,
    pageKey?: string,
    viewId?: string,
    params?: Record<string, any>
  ): IPageContext {
    const page_key = pageKey || this.getPageKey(url, params);

    this.page_urls.push(url);
    this.page_keys.push(page_key || '');
    this.view_ids.push(viewId || getViewId());
    return this.getPageContext();
  }

  getPageContext(): IPageContext {
    let len = this.page_keys.length;
    let index = len - 1;
    let lastPageKey = '';
    while (!lastPageKey && index >= 0) {
      index--;
      lastPageKey = this.page_keys[index];
    }

    return {
      referer_page_url: this.page_urls[index] || '',
      referer_page_key: lastPageKey || '',
      referer_view_id: this.view_ids[index] || '',
      page_url: this.page_urls[this.page_urls.length - 1] || '',
      page_key: this.page_keys[this.page_keys.length - 1] || '',
      view_id: this.view_ids[this.view_ids.length - 1] || ''
    };
  }
}

export default new PageContext();
