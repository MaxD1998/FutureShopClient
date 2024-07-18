export enum UserType {
  superAdmin = 0,
  localAdmin = 1,
  manager = 2,
  employee = 3,
  client = 4,
}

export class UserTypeExtension {
  public static GetPrivileges(userType: UserType): UserType[] {
    switch (userType) {
      case UserType.superAdmin:
        return [UserType.superAdmin, UserType.localAdmin, UserType.manager, UserType.employee, UserType.client];
      case UserType.localAdmin:
        return [UserType.localAdmin, UserType.manager, UserType.employee, UserType.client];
      case UserType.manager:
        return [UserType.manager, UserType.employee, UserType.client];
      case UserType.employee:
        return [UserType.employee, UserType.client];
      case UserType.client:
        return [UserType.client];
      default:
        return [];
    }
  }
}
