import { t } from '../../.';

const Posts = t.struct({
  didInvalidate: t.Boolean,
  isFetching: t.Boolean,
  items: t.Array,
  lastUpdated: t.maybe(t.Number)
}, 'Posts');

const State = t.struct({
  postsByReddit: t.dict(t.String, Posts),
  selectedReddit: t.String
}, 'State');

export default State;
