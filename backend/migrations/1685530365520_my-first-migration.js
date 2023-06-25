/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createType('todo_status', ['pending', 'completed']);
  pgm.createTable('todosTable', {
    id: {
      type: 'text',
      notNull: true,
      unqiue: true,
      primaryKey: true,
    },
    title: {
      type: 'text',
      notNull: true,
    },
    date: {
      type: 'timestamp',
      notNull: true,
    },
    status: {
      type: 'todo_status',
      notNull: true,
    },
    todosorder: {
      type: 'integer',
      notNull: true,
    },
  });
  pgm.createIndex('todosTable', 'todosorder');
};

exports.down = (pgm) => {
  pgm.dropType('todo_status');
  pgm.dropIndex('todosTable', 'todosorder');
  pgm.dropTable('todosTable');
};
