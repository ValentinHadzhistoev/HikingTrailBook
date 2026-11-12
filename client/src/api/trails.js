import { get, post, put, del } from './requester'

const ENDPOINT = '/data/trails'

export const getAll = () => get(`${ENDPOINT}?sortBy=_createdOn%20desc`)

export const getOne = (trailId) => get(`${ENDPOINT}/${trailId}`)

export const getByOwner = (ownerId) =>
  get(`${ENDPOINT}?where=${encodeURIComponent(`_ownerId="${ownerId}"`)}`)

export const create = (data) => post(ENDPOINT, data)

export const update = (trailId, data) => put(`${ENDPOINT}/${trailId}`, data)

export const remove = (trailId) => del(`${ENDPOINT}/${trailId}`)