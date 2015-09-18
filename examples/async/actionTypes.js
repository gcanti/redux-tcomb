import { t } from '../../.';

//
// actions
//

const Reddit = t.String;

export const REQUEST_POSTS = t.struct({
  reddit: Reddit
}, 'REQUEST_POSTS');

export const RECEIVE_POSTS = t.struct({
  reddit: Reddit,
  posts: t.list(t.Object),
  receivedAt: t.Number
}, 'RECEIVE_POSTS');

export const SELECT_REDDIT = t.struct({
  reddit: Reddit
}, 'SELECT_REDDIT');

export const INVALIDATE_REDDIT = t.struct({
  reddit: Reddit
}, 'INVALIDATE_REDDIT');
