export const validateEmail = (email: string): string | null => {
  if (!email) return "El email es obligatorio.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(String(email).toLowerCase())) {
    return "Por favor, ingrese un email válido.";
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "La contraseña es obligatoria.";
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }
  if (!re.test(password)) {
     return "Debe incluir mayúscula, minúscula y número.";
  }
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (password !== confirmPassword) {
    return "Las contraseñas no coinciden.";
  }
  return null;
};

export const validateNumber = (value: string | number, fieldName: string = 'El valor'): string | null => {
  if (isNaN(Number(value))) {
    return `${fieldName} debe ser un número.`;
  }
  if (Number(value) <= 0) {
     return `${fieldName} debe ser mayor a cero.`;
  }
  return null;
};
