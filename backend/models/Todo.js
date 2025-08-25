const { query } = require('../config/db');

class Todo {
  static async create(todoData) {
    const { text, user_id } = todoData;
    const result = await query(
      'INSERT INTO todos (text, user_id) VALUES (?, ?)',
      [text, user_id]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    return await query(
      'SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
  }

  static async update(id, updates) {
    const { text, completed } = updates;
    await query(
      'UPDATE todos SET text = ?, completed = ? WHERE id = ?',
      [text, completed, id]
    );
    return true;
  }

  static async delete(id) {
    await query('DELETE FROM todos WHERE id = ?', [id]);
    return true;
  }

  static async findByIdAndUserId(id, userId) {
    const todos = await query(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return todos[0];
  }
}

module.exports = Todo;