export class User {
  constructor({
    id = null,
    name_user = null,
    lastname = null,
    username = null,
    email = null,
    password = null,
    id_country = null,
    role = 'user',
    identification = null,
    company = null,
    created_at = new Date(),
  } = {}) {
    this.id = id;
    this.name_user = name_user;
    this.lastname = lastname;
    this.username = username;
    this.email = email;
    this.password = password;         // not safe to expose
    this.id_country = id_country;
    this.role = role;
    this.identification = identification;
    this.company = company;
    this.created_at = created_at;
  }

  // build a User instance from a request body
  static fromRequest(body = {}) {
    return new User({
      name_user: body.name_user,
      lastname: body.lastname,
      username: body.username,
      email: body.email,
      password: body.password,
      id_country: body.id_country,
      role: body.role,               // dont trust client input
      identification: body.identification,
      company: body.company,
    });
  }

  // Validation according to role
  validateForRole(role = this.role) {
    const errors = [];
    // mandatory fields
    if (!this.email) errors.push('email is required');
    if (!this.password) errors.push('password is required');
    // rol rules
    if (role === 'creator') {
      if (!this.identification) errors.push('identification is required for company role');
    }
    return { valid: errors.length === 0, errors };
  }

  // 
  toJSON() {
    const { password, ...safe } = this;
    return safe;
  }

  updateFrom(body = {}) {
    Object.keys(body).forEach(k => {
      if (k in this && k !== 'id') this[k] = body[k];
    });
  }
}