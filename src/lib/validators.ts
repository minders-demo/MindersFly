export const validators = {
  validateEmail: (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(email);
  },
  validateRequired: (val: any) => {
    return val !== null && val !== undefined && val.toString().trim() !== '';
  },
  validateDocumentNumber: (doc: string) => {
    return doc.length > 5;
  },
  validatePassport: (passport: string) => {
    return passport.length >= 6;
  },
  validatePhone: (phone: string, countryCode?: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  },
  validateName: (name: string) => {
    return name.trim().length >= 2;
  },
  validateBirthDate: (dateString: string) => {
    const d = new Date(dateString);
    return !isNaN(d.getTime()) && d < new Date();
  },
  validateCreditCardNumber: (cc: string) => {
    const digits = cc.replace(/\D/g, '');
    const valid = /^[0-9]{16}$/.test(digits);
    
    let brand: 'visa' | 'mastercard' | 'amex' | 'unknown' = 'unknown';
    if (/^4/.test(digits)) brand = 'visa';
    else if (/^5[1-5]/.test(digits)) brand = 'mastercard';
    else if (/^3[47]/.test(digits)) brand = 'amex';
    
    return { valid, brand };
  },
  validateCardExpiry: (expiry: string) => {
    const match = expiry.match(/^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/);
    if (!match) return false;
    let [_, monthStr, yearStr] = match;
    const month = parseInt(monthStr, 10);
    let year = parseInt(yearStr, 10);
    if (year < 100) year += 2000;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
  },
  validateCVV: (cvv: string, brand?: 'visa' | 'mastercard' | 'amex' | 'unknown') => {
    const digits = cvv.replace(/\D/g, '');
    if (brand === 'amex') return digits.length === 4;
    return digits.length === 3 || digits.length === 4;
  },
  validatePassword: (password: string) => {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  }
};
