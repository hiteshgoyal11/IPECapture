export interface SignupFormData {
  // Screen 1
  firstName: string;
  lastName: string;
  dob: string;

  // Screen 2
  email: string;
  password: string;
  confirmPassword: string;

  // Screen 3
  course: string;
  branch: string;

  // Screen 4
  username: string;

  // Screen 5
  avatarUrl: string | null;
}