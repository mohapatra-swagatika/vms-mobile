import axios from 'axios';

import {config} from '../constants/config';

export const http = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
