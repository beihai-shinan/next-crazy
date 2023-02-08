const path = require('path');
const withPlugins = require('next-compose-plugins');
const withModernizr = require('next-plugin-modernizr');
const withTM = require('next-transpile-modules')(['antd-mobile']);
const withAntdLess = require('./webpack-plugins/with-antd-mobile');
const withOptimizedImages = require('next-optimized-images');
// const { withSentryConfig } = require('@sentry/nextjs');


const plugins = [
  withModernizr,
  // withTranslate,
  withAntdLess,
  withTM,
  [
    withOptimizedImages,
    {
      optimizeImages: false,
      imagesPublicPath: `${process.env.CDN_HOST || process.env.NEXT_PUBLIC_CDN_HOST}/_next/static/images/`
    }
  ],
]

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  generateEtags: false,
  sentry: {
    hideSourceMaps: true,
  },
  // i18n: {
  //   localeDetection: false
  // },
  images: {
    disableStaticImages: true,
  },
  // assetPrefix: process.env.CDN_HOST || process.env.NEXT_PUBLIC_CDN_HOST,
  compress: true,
  pageExtensions: ['tsx', 'jsx', 'ts'],
  experimental: {
    legacyBrowsers: false,
    scrollRestoration: false,
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.tsx$/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: path.resolve('./webpack-loaders/enki-tokens-loader.js'),
        }]
    });
    return config;
  }
}

function getConfig() {
  //开发环境下不上传错误到 sentry
  // if (process.env.NODE_ENV !== 'development') {
  //   return withSentryConfig(nextConfig, {
  //     silent: true,
  //     cleanArtifacts: true
  //   });
  // }
  return nextConfig;
}

module.exports = withPlugins(plugins, getConfig(nextConfig));
