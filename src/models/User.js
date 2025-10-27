/**
 * User Model
 * Represents a user in the application
 */
class User {
  constructor(id, firstName, lastName, createdAt) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.createdAt = createdAt;
  }

  /**
   * Get the full name of the user
   * @returns {string} Full name (firstName lastName)
   */
  getFullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  /**
   * Create a User instance from Supabase data
   * @param {Object} data - Data from Supabase
   * @returns {User} User instance
   */
  static fromSupabase(data) {
    return new User(
      data.id,
      data.first_name,
      data.last_name,
      data.created_at
    );
  }

  /**
   * Convert User instance to Supabase format
   * @returns {Object} Object formatted for Supabase
   */
  toSupabase() {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      created_at: this.createdAt,
    };
  }
}

export default User;

