export const normalizeEmail = (email: string): string => {
    return (email || '').trim().toLowerCase();
};

export const generateStableUserIdSync = (email: string): string => {
    const normalized = normalizeEmail(email);
    if (!normalized) return `mf_user_fallback_${Math.floor(Math.random() * 10000)}`;
    
    // djb2 hash fallback
    let hash = 5381;
    for (let i = 0; i < normalized.length; i++) {
        hash = ((hash << 5) + hash) + normalized.charCodeAt(i); /* hash * 33 + c */
    }
    
    let hashHex = (Math.abs(hash)).toString(16);
    while (hashHex.length < 16) hashHex += '0';
    return `mf_user_${hashHex.substring(0, 16)}`;
};

export const generateStableUserId = async (email: string): Promise<string> => {
    const normalized = normalizeEmail(email);
    if (!normalized) return `mf_user_fallback_${Math.floor(Math.random() * 10000)}`;
    
    try {
        const msgUint8 = new TextEncoder().encode(normalized);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return `mf_user_${hashHex.substring(0, 16)}`;
    } catch (e) {
        return generateStableUserIdSync(normalized);
    }
};

export const getFakeUsersRepository = () => {
    try {
        const data = localStorage.getItem('minders_fly_fake_users');
        if (data) {
            return JSON.parse(data);
        }
    } catch(e) {
        console.error("Error reading fake users repo", e);
    }
    return {};
};

export const saveFakeUsersRepository = (repo: any) => {
    try {
        localStorage.setItem('minders_fly_fake_users', JSON.stringify(repo));
    } catch(e) {
        console.error("Error saving fake users repo", e);
    }
};

export const createFakeUserFromEmail = async (email: string, extraData: any = {}) => {
    const normalized = normalizeEmail(email);
    const repo = getFakeUsersRepository();
    
    if (repo[normalized]) {
        // Return existing user
        const existing = repo[normalized];
        existing.lastLoginAt = new Date().toISOString();
        saveFakeUsersRepository(repo);
        return existing;
    }
    
    // Create new fake user
    const userId = await generateStableUserId(normalized);
    
    // Generate some fake info if not provided
    const nameParts = normalized.split('@')[0].split(/[._-]/);
    const firstName = extraData.firstName || (nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'Invitado');
    const lastName = extraData.lastName || (nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'Demo');
    
    const randomLoyalty = `MF${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newUser = {
        id: userId,
        amplitudeUserId: userId,
        email: normalized,
        firstName,
        lastName,
        loyaltyId: extraData.loyaltyId || randomLoyalty,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        countryCode: extraData.countryCode || '+57',
        phone: extraData.phone || '3000000000',
        isDemoUser: true,
        passwordSet: true // to fake that registration is complete
    };
    
    repo[normalized] = newUser;
    saveFakeUsersRepository(repo);
    return newUser;
};
