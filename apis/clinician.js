import request from '@/utils/request';

export function fetchList(query) {
  return request({
    url: `/api/clinicians${query}`,
    method: 'get',
  });
}

export function fetch(id) {
  return request({
    url: `/api/clinicians/${id}`,
    method: 'get',
  });
}

export function deleteRecord(id) {
  return request({
    url: `/api/clinicians/${id}`,
    method: 'delete',
  });
}

export function deleteMultiple(data) {
  return request({
    url: `/api/remove-clinicians`,
    method: 'post',
    data
  });
}

import axios from "axios";

export function create(data) {
  return axios.create({
    baseUrl: defaultUrl,
  });
}

