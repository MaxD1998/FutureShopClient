export enum UserType {
  superAdmin = 0,
  employee = 1,
  customer = 2,
}

export class UserTypeExtension {
  public static GetPrivileges(userType: UserType): UserType[] {
    switch (userType) {
      case UserType.superAdmin:
        return [UserType.superAdmin, UserType.employee, UserType.customer];
      case UserType.employee:
        return [UserType.employee, UserType.customer];
      case UserType.customer:
        return [UserType.customer];
      default:
        return [];
    }
  }
}
