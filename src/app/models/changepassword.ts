
export class ChangePassword {
    userId: number;
    oldPassword: string;
    password: string;
    confirmPassword: string;
    userOldPassword?: string;
    userPassword?: string;
    userConfirmPassword?: string;
}
