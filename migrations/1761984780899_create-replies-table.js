/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.createTable('replies', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        date: {
            type: 'TEXT',
            notNull: true
        },
        is_delete: {
            type: 'TEXT',
            notNull: false
        },
    });
    pgm.addConstraint('replies', 'replies.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('replies', 'replies.comment_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');

};

exports.down = (pgm) => {
    pgm.dropTable('replies');
};
