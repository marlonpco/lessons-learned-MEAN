export class AuthConstants{
  static readonly ROLE_ADMIN = "ADMIN";
  static readonly ROLE_USER = "USER";

  static readonly ROLES = [
    { key: AuthConstants.ROLE_ADMIN, value: "Administrator" },
    { key: AuthConstants.ROLE_USER, value: "User" }
  ];
}
