/* eslint-disable camelcase */
exports.up = pgm => {
    pgm.createTable('likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });
    pgm.addConstraint('likes', 'likes.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('likes', 'likes.comment_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('likes');
};
