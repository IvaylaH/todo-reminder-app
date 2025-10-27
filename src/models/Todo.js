/**
 * Todo Model
 * Represents a TODO item in the application
 */
class Todo {
  constructor(todoId, description, name, authorId, assigneeId, deadline, status, createdAt) {
    this.todoId = todoId;
    this.description = description;
    this.name = name;
    this.authorId = authorId;
    this.assigneeId = assigneeId;
    this.deadline = deadline;
    this.status = status;
    this.createdAt = createdAt;
  }

  /**
   * Create a Todo instance from Supabase data
   * @param {Object} data - Data from Supabase
   * @returns {Todo} Todo instance
   */
  static fromSupabase(data) {
    return new Todo(
      data.todo_id,
      data.description,
      data.name,
      data.author_id,
      data.assignee_id,
      data.deadline,
      data.status,
      data.created_at
    );
  }

  /**
   * Convert Todo instance to Supabase format
   * @returns {Object} Object formatted for Supabase
   */
  toSupabase() {
    return {
      todo_id: this.todoId,
      description: this.description,
      name: this.name,
      author_id: this.authorId,
      assignee_id: this.assigneeId,
      deadline: this.deadline,
      status: this.status,
      created_at: this.createdAt,
    };
  }

  /**
   * Check if the TODO is overdue
   * @returns {boolean} True if deadline has passed and status is not DONE or CANCELLED
   */
  isOverdue() {
    if (!this.deadline || this.status === 'DONE' || this.status === 'CANCELLED') {
      return false;
    }
    return new Date(this.deadline) < new Date();
  }

  /**
   * Check if the TODO is completed
   * @returns {boolean} True if status is DONE
   */
  isCompleted() {
    return this.status === 'DONE';
  }

  /**
   * Check if the TODO is in progress
   * @returns {boolean} True if status is INPROGRESS
   */
  isInProgress() {
    return this.status === 'INPROGRESS';
  }
}

export default Todo;

