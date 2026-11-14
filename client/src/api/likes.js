import { get, post } from './requester'

const ENDPOINT = '/data/likes'

export const getForTrail = (trailId) =>
  get(`${ENDPOINT}?where=${encodeURIComponent(`trailId="${trailId}"`)}`)

export const like = (trailId) => post(ENDPOINT, { trailId })