type FieldName =
  | "first_name"
  | "second_name"
  | "login"
  | "email"
  | "password"
  | "password_"
  | "phone"
  | "message";

type Errors = Partial<Record<FieldName, string>>;

const regex = {
  name: /^[A-ZА-ЯЁ][a-zа-яё-]+$/,
  login: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/,
  password: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,40}$/,
  phone: /^\+?\d{10,15}$/,
};

export function validateField(name: string, value: string): string | null {
  switch (name) {
    case "first_name":
    case "second_name":
      return regex.name.test(value)
        ? null
        : "Только буквы/дефис, первая — заглавная";

    case "login":
      return regex.login.test(value)
        ? null
        : "3–20 символов, латиница, цифры, _ или -, не только цифры";

    case "email":
      return regex.email.test(value)
        ? null
        : "Некорректный email";

    case "password":
      return regex.password.test(value)
        ? null
        : "Минимум 8 символов, 1 заглавная, 1 цифра";

    case "password_":
      return regex.password.test(value)
        ? null
        : "Минимум 8 символов, 1 заглавная, 1 цифра";

    case "phone":
      return regex.phone.test(value)
        ? null
        : "10–15 цифр, можно с +";

    case "message":
      return value.trim()
        ? null
        : "Поле не должно быть пустым";

    default:
      return null;
  }
}

export default function validateForm(formData: FormData): Errors {
  const errors: Errors = {};

  formData.forEach((value, key) => {
    const field = key as FieldName;

    // FormData может содержать File — приводим к строке безопасно
    const stringValue =
      typeof value === "string" ? value : value.name ?? "";

    const error = validateField(field, stringValue);

    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}
