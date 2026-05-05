export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const isAmex = /^3[47]/.test(v);
  
  if (isAmex) {
    // 4-6-5 format
    const p1 = v.slice(0, 4);
    const p2 = v.slice(4, 10);
    const p3 = v.slice(10, 15);
    let res = p1;
    if (p2) res += ' ' + p2;
    if (p3) res += ' ' + p3;
    return res;
  }
  
  // standard 4-4-4-4
  const matches = v.match(/\d{1,4}/g);
  return matches ? matches.join(' ') : v;
};

export const formatCardExpiry = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (v.length >= 3) {
    return `${v.slice(0, 2)}/${v.slice(2, 6)}`;
  }
  return v;
};

export const formatPhone = (value: string, countryCode?: string): string => {
  const v = value.replace(/\D/g, '');
  return v; // Basic raw numeric format, countryCode handled separately
};
