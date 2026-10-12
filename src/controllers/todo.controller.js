import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    // Your code here
    const data = req.body;
    const todo = await Todo.create(data);
    return res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    // Your code here
    const { page = 1, limit = 10, completed, priority, search } = req.query;
    const pageNum = Number(page);
    const limitNum = Number(limit);

    filter = {};
    if (completed !== undefined) filter.completed = completed === "true";
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: "i" };

    const total = await Todo.countDocuments(filter);
    const pages = Math.ceil(total / limitNum);

    const todoList = await Todo.find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    const paginatedData = {
      data: todoList,
      meta: {
        total,
        page,
        limit,
        pages,
      },
    };

    return res.json(paginatedData)
  } catch (error) {
    next(error);
  }
}
/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */

// Dont know how to extract the todoId
export async function getTodo(req, res, next) {
  try {
    const id = req.params.id;
    if (!id) return res.status(404);

    const todo = await Todo.findById(id);

    return res.status(200).json(todo);

    // Your code here
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    const id = req.params.id;
    if (!id) return res.status(404);

    const todo = await Todo.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    return res.status(200).json(todo);

    // Your code here
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    const id = req.params.id;
    if (!id) return res.status(404);

    const todo = await Todo.findById(id);
    todo.completed = !todo.completed;

    await Todo.save();

    return res.status(201).json("Toggled the completed");
    // Your code here
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    // Your code here
    const id = req.params.id;
    if (!id) return res.status(404);

    const todo = await Todo.findByIdAndDelete(id);
    return res.status(204).json(todo);
  } catch (error) {
    next(error);
  }
}
