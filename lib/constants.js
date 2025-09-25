exports.userRoles = {
    INSPECTION_MANAGER: "inspection_manager",
    ADMIN: "admin",
    PROCUREMENT_MANAGER: "procurement_manager",
    CLIENT: "client",
}

exports.statusCode = {
    BAD_REQUEST: 400,
    UN_AUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    OK: 200,
    CREATED: 201,
    FORBIDDEN: 403
}

exports.PERMISSIONS = {
  // user management
  CREATE_USER: /post:\/api\/users/,
  GET_USERS: /get:\/api\/users/,
  GET_INSPECTION_MANAGERS: /get:\/api\/users\/inspection/,
  ASSIGN_PRECUREMENT: /patch:\/api\/users\/assign-procurement/,

  // orders
  CREATE_ORDER: /post:\/api\/orders/,
  VIEW_ORDERS: /get:\/api\/orders/,
  VIEW_ORDER: /get:\/api\/orders\/[a-zA-Z0-9]+/,
  UPDATE_ORDER: /put:\/api\/orders\/[a-zA-Z0-9]+/,
  UPDATE_ORDER_STATUS: /patch:\/api\/orders\/[a-zA-Z0-9]+\/status/,
  DELETE_ORDER: /delete:\/api\/orders\/[a-zA-Z0-9]+/,

  // checklists & answers
  READ_CHECKLIST: /get:\/api\/checklists/,
  CREATE_CHECKLIST: /post:\/api\/checklists/,
  UPDATE_CHECKLIST: /put:\/api\/checklists\/[a-zA-Z0-9]+$/,
  DELETE_CHECKLIST: /delete:\/api\/checklists\/[a-zA-Z0-9]/,
  UPDATE_CHECKLIST_STATUS: /patch:\/api\/checklists\/[a-zA-Z0-9]+\/status/,

  SUBMIT_ANSWER: /post:\/api\/answers/,
  UPLOAD_FILE_ANSWER:/post:\/api\/answers\/upload/,
};

exports.ROLE_PERMISSIONS = {
  [this.userRoles.ADMIN]: [
    this.PERMISSIONS.CREATE_USER,
    this.PERMISSIONS.GET_USERS,
    this.PERMISSIONS.VIEW_ORDERS,
    this.PERMISSIONS.UPDATE_ORDER_STATUS,
    this.PERMISSIONS.READ_CHECKLIST,
    this.PERMISSIONS.ASSIGN_PRECUREMENT,
    this.PERMISSIONS.VIEW_ORDER
  ],
  [this.userRoles.PROCUREMENT_MANAGER]: [
    this.PERMISSIONS.CREATE_ORDER,
    this.PERMISSIONS.VIEW_ORDER,
    this.PERMISSIONS.UPDATE_ORDER,
    this.PERMISSIONS.VIEW_ORDERS,
    this.PERMISSIONS.UPDATE_ORDER_STATUS,
    this.PERMISSIONS.GET_USERS,
    this.PERMISSIONS.GET_INSPECTION_MANAGERS,
    this.PERMISSIONS.CREATE_USER, 
    this.PERMISSIONS.CREATE_CHECKLIST,
    this.PERMISSIONS.READ_CHECKLIST,
    this.PERMISSIONS.UPDATE_CHECKLIST,
    this.PERMISSIONS.DELETE_CHECKLIST,
    this.PERMISSIONS.UPLOAD_FILE_ANSWER,
  ],
  [this.userRoles.INSPECTION_MANAGER]: [
    this.PERMISSIONS.VIEW_ORDERS,
    this.PERMISSIONS.UPDATE_ORDER_STATUS,
    this.PERMISSIONS.UPDATE_CHECKLIST_STATUS,
    this.PERMISSIONS.READ_CHECKLIST,
    this.PERMISSIONS.SUBMIT_ANSWER,
    this.PERMISSIONS.UPLOAD_FILE_ANSWER,
    this.PERMISSIONS.VIEW_ORDER,
  ],
  [this.userRoles.CLIENT]: [
    this.PERMISSIONS.VIEW_ORDERS,
    this.PERMISSIONS.VIEW_ORDER,
  ],
};

exports.rolesAllowedWithEmail = [this.userRoles.ADMIN, this.userRoles.PROCUREMENT_MANAGER, this.userRoles.CLIENT];

exports.rolesAllowedWithMobile = [this.userRoles.INSPECTION_MANAGER];

