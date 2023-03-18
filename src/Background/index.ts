import Browser from 'webextension-polyfill';
import { executeInit } from '../utils/question-fetch';

executeInit();

Browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') Browser.tabs.create({ url: 'options.html' });
});
