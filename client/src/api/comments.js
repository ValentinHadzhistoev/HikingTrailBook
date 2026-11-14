import { get, post } from './requester'

const ENDPOINT = '/data/comments'

export const getForTrail = (trailId) =>
  get(`${ENDPOINT}?where=${encodeURIComponent(`trailId="${trailId}"`)}&sortBy=_createdOn%20desc`)

export const create = (trailId, text, authorEmail) =>
  post(ENDPOINT, { trailId, text, authorEmail })