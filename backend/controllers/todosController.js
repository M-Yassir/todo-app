const Todo = require('../models/Todo');

const todosController = {
  getAllTodos: async (req, res) => {
    try {
      const todos = await Todo.findByUserId(req.user.id);
      res.json(todos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createTodo: async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: 'Text is required' });
      }

      const todoId = await Todo.create({
        text,
        user_id: req.user.id
      });

      res.status(201).json({ 
        message: 'Todo created successfully',
        id: todoId,
        text,
        completed: false,
        user_id: req.user.id
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateTodo: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Verify todo belongs to user
      const todo = await Todo.findByIdAndUserId(id, req.user.id);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      await Todo.update(id, updates);
      res.json({ message: 'Todo updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteTodo: async (req, res) => {
    try {
      const { id } = req.params;

      // Verify todo belongs to user
      const todo = await Todo.findByIdAndUserId(id, req.user.id);
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      await Todo.delete(id);
      res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = todosController;