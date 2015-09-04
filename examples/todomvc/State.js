import { t } from '../../lib';

const Todo = t.struct({
  id: t.Number,
  text: t.String,
  completed: t.Boolean
}, 'Todo');

export default t.list(Todo, 'State');
