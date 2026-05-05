export function getCarImageByCategory(category?: string, seed?: number): string {
    const images: Record<string, string[]> = {
        'Compacto': [
            'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1364&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1621007947382-bb3c399b52c5?q=80&w=1364&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1580274455191-1c62238fa333?q=80&w=1364&auto=format&fit=crop'
        ],
        'Sedán': [
            'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1364&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=1364&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1364&auto=format&fit=crop'
        ],
        'SUV': [
            'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1364&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1364&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1364&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1568844293986-8d0400ba4715?q=80&w=1364&auto=format&fit=crop'
        ],
        'Premium': [
            'https://images.unsplash.com/photo-1621002446700-11110b91d227?q=80&w=1364&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1503376713846-bccc203c9b74?q=80&w=1364&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1364&auto=format&fit=crop'
        ],
        'Van': [
            'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=1364&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1559404060-63ce60408ebd?q=80&w=1364&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?q=80&w=1364&auto=format&fit=crop'
        ]
    };

    const cat = category && images[category] ? category : 'SUV';
    const arr = images[cat];
    
    if (seed !== undefined) {
        // pseudo-random logic with seed
        const x = Math.sin(seed) * 10000;
        const randomObj = x - Math.floor(x);
        return arr[Math.floor(randomObj * arr.length)];
    }
    
    return arr[Math.floor(Math.random() * arr.length)];
}
