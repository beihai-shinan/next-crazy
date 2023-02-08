import WeeeAnalytics from '@weee-fe/weee-analytics';
import nookies from 'nookies';
import { v4 as uuid } from 'uuid';
import qs from 'qs';
import pageContext from './page-context';

export const getUa = (ctx?: any) => {
  const ua =
    typeof window === 'undefined'
      ? ctx?.req?.headers?.['user-agent']?.toLowerCase()
      : window?.navigator?.userAgent?.toLowerCase();
  return ua || '';
};

/**
 * 获取cookies
 * @param key
 * @param ctx client端为空
 */
export const getCookie = (key: string, ctx?: any) => {
  const cookies = nookies.get(ctx || {}) || {};
  return cookies[key];
};

/**
 * 獲取app的版本
 * @param ctx
 * @returns
 */
export const getAppVersion = (ctx?: any): string => {
  const ua = getUa(ctx);
  let appVersion = (ua?.match(/weeeapp ((\d+.){4})/i)?.[1] || '').trim() || '';
  return appVersion.split('.').slice(0, -1).join('.') || null;
};

/**
 * 判断是否app打开
 */
export const isSayWeeeApp = function (ctx?: any) {
  const ua = getUa(ctx);
  if (ua) {
    return ua.indexOf('weeeapp') > -1;
  } else {
    return false;
  }
};

/**
 * 是否是ios 不是ios就是安卓
 * @param ctx
 */
export const isIOS = function (ctx?: any) {
  const ua = getUa(ctx);
  if (ua) {
    return !!ua?.match(/(iPad|iPhone|iPod)/i);
  } else {
    return false;
  }
};

/**
 * weee app的安卓手机
 */
export function isWeeeAndroid(ctx?: any) {
  const result = isSayWeeeApp(ctx) && !isIOS(ctx);
  return result;
}

/**
 * 判断是否是手机浏览器
 */
export function isMobileBrowser(ctx?: any) {
  const ua = window.navigator.userAgent;
  // return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera|Mini/i.test(ua);
  return /mobile|nokia|iphone|android|samsung|htc|blackberry|WAP/i.test(ua);
}

export default class Tracker {
  static WeeeAnalytics: WeeeAnalyticsClass = null;

  constructor() {
    if (!Tracker.WeeeAnalytics) {
      try {
        Tracker.WeeeAnalytics = new WeeeAnalytics({
          baseParams: {
            platform: 'MWeb',
            screen_height: String(window.innerHeight),
            screen_width: String(window.innerWidth),
            user_agent: window.navigator.userAgent,
            app_version: getAppVersion(),
            device_id: getCookie('device-id')
          },
          eventItemParams: {
            id: this.getUniqueId(),
            time: Date.now(),
            type: 'init',
            view_id: '', //must use getUniqueId
            referer_view_id: '',
            referer_page_key: '',
            referer_page_url: '',
            page_key: '',
            page_url: '',
            session_id: getCookie('weee_session_token'),
            language: getCookie('site_lang'),
            store: getCookie('weee-store'),
            zipcode: getCookie('NEW_ZIP_CODE'),
            user_id: getCookie('user_id')
          }
        });
        const appContext = Tracker.WeeeAnalytics.getAppContext() || {};
        Tracker.WeeeAnalytics.setBaseParams({
          os_language: appContext.os_language || navigator.language,
          os_version: appContext.os_version || ''
        });
      } catch (err) {
        console.log(err, 'init WeeeAnalytics error');
      }
    }
  }

  getPlatform() {
    if (isSayWeeeApp()) {
      if (isIOS()) {
        return 'iOS';
      }
      if (isWeeeAndroid()) {
        return 'Android';
      }
    }
    if (isMobileBrowser()) {
      return 'MWeb';
    }
    return 'DWeb';
  }

  getUniqueId = () => {
    return uuid().replace(/-/g, '');
  };

  syncPageContext(pageKey?: any, params?: Record<string, any>) {
    const pageContextData = pageContext.getPageContext();

    if (pageContextData.page_url !== location.href || pageKey) {
      return pageContext.addPage(location.href, pageKey, '', params);
    }
    return pageContextData;
  }

  addPv(pageKey?: string, referer?: string, params?: Record<string, any>) {
    const pageContextData = this.syncPageContext(pageKey, params);

    sessionStorage.setItem('referrer_page_url', pageContextData.page_url);
    sessionStorage.setItem('referrer_page_key', pageContextData.page_key);
    sessionStorage.setItem('view_id', pageContextData.view_id);
    if (isSayWeeeApp()) {
      this.setAppContextToAppCall();
    }
    this.setEventItemParams();

    Tracker.WeeeAnalytics.addPv(pageKey || pageContextData.page_key, referer);

    return this;
  }

  addEvent(type: string, params: any) {
    this.syncPageContext(null, params);
    Tracker.WeeeAnalytics.addEvent(type, this.getCommonBizParams(type, params));
    return this;
  }

  setEventItemParams(params?: any) {
    const pageContextData = pageContext.getPageContext();
    const queryObject = qs.parse(window.location.search.substring(1));

    Tracker.WeeeAnalytics.setEventItemParams({
      referral_id: getCookie('referrer_id'),
      id: this.getUniqueId(),
      time: ~~(Date.now() / 1000),
      page_key: pageContextData.page_key || '',
      page_url: pageContextData.page_url,
      referer_page_key: pageContextData.referer_page_key,
      referer_page_url: pageContextData.referer_page_url,
      referer_view_id: pageContextData.referer_view_id,
      view_id: pageContextData.view_id,
      page_ctx_app: {},
      params: {
        ...params,
        source: params?.source || queryObject?.ws?.substring(0, 40)
      }
    });
  }

  getCommonBizParams(type: any, params?: any) {
    const queryObject = qs.parse(window.location.search.substring(1));
    const pageContextData = pageContext.getPageContext();
    const appContext = Tracker.WeeeAnalytics.getAppContext() || {};

    return {
      type,
      referral_id: getCookie('referrer_id'),
      id: this.getUniqueId(),
      time: ~~(Date.now() / 1000),
      source_store: getCookie('weee-store'),
      store: getCookie('weee-store'),
      user_id: getCookie('user_id'),
      page_key: pageContextData.page_key || '',
      page_url: pageContextData.page_url,
      referer_page_key: pageContextData.referer_page_key,
      referer_page_url: pageContextData.referer_page_url,
      referer_view_id: pageContextData.referer_view_id,
      view_id: pageContextData.view_id,
      page_ctx_app: appContext.page_ctx_app,
      params: {
        ...params,
        source:
          type.indexOf('t2') > -1
            ? undefined
            : params?.source || queryObject?.ws || ''
      }
    };
  }

  setAppContextToAppCall() {
    const appContext = Tracker.WeeeAnalytics.getAppContext() || {};
    const _pageContext = pageContext.getPageContext();
    if (_pageContext.page_key) {
      Tracker.WeeeAnalytics.setAppContext({
        ...appContext,
        page_key: _pageContext.page_key,
        page_url: _pageContext.page_url,
        view_id: _pageContext.view_id
      });
    }
  }

  send() {
    Tracker.WeeeAnalytics.send(this.getUniqueId());
  }
}
