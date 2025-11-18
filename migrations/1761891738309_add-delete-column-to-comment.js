/* eslint-disable camelcase */
exports.up = pgm => {
    pgm.addColumn('comments', {
        is_delete: {
            type: 'TEXT',
            notNull: false
        },
    });
};

exports.down = pgm => {
    pgm.dropColumn('comments', 'is_delete');
};
