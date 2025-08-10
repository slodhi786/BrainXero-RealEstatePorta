export type PasswordPolicy = {
  minLength: number;
  requireDigit: boolean;
  requireLowercase: boolean;
  requireUppercase: boolean;
  requireNonAlphanumeric: boolean;
};

export const defaultIdentityPolicy: PasswordPolicy = {
  minLength: 6,
  requireDigit: true,
  requireLowercase: true,
  requireUppercase: true,
  requireNonAlphanumeric: true,
};

export function validatePassword(pw: string, policy = defaultIdentityPolicy) {
  const errs: string[] = [];

  if (pw.length < policy.minLength)
    errs.push(`At least ${policy.minLength} characters`);

  if (policy.requireDigit && !/[0-9]/.test(pw))
    errs.push("At least one digit");

  if (policy.requireLowercase && !/[a-z]/.test(pw))
    errs.push("At least one lowercase letter");

  if (policy.requireUppercase && !/[A-Z]/.test(pw))
    errs.push("At least one uppercase letter");

  if (policy.requireNonAlphanumeric && !/[^A-Za-z0-9]/.test(pw))
    errs.push("At least one symbol");

  return { ok: errs.length === 0, errors: errs };
}
