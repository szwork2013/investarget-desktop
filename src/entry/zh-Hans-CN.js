import '../../public/index.html';
import appLocaleData from 'react-intl/locale-data/zh';
import zhMessages from '../../locales/zh.json';

window.appLocale = {
  messages: {
    ...zhMessages,
  },
  antd: null,
  locale: 'zh-Hans-CN',
  data: appLocaleData,
};
