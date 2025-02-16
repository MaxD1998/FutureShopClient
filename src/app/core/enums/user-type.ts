export enum UserType {
  superAdmin = 0,
  localAdmin = 1,
  user = 2,
  client = 3,
}

export class UserTypeExtension {
  public static GetPrivileges(userType: UserType): UserType[] {
    switch (userType) {
      case UserType.superAdmin:
        return [UserType.superAdmin, UserType.localAdmin, UserType.user, UserType.client];
      case UserType.localAdmin:
        return [UserType.localAdmin, UserType.user, UserType.client];
      case UserType.user:
        return [UserType.user, UserType.client];
      case UserType.client:
        return [UserType.client];
      default:
        return [];
    }
  }
}
