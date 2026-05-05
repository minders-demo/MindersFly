import { Market } from '../types/market';
import { MARKETS } from './markets';
import { LATAM_CITIES } from './latamCities';
import { getCarImageByCategory } from '../lib/carImages';

// Deterministic random generator based on seed
const seededRandom = (seed: number) => {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
};

const randomChoice = <T>(arr: T[], seed: number): T => {
    return arr[Math.floor(seededRandom(seed) * arr.length)];
};

const randomInt = (min: number, max: number, seed: number) => {
    return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
};

export const generateUsers = (count: number) => {
    const users = [];
    const firstNames = ['Juan', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Laura', 'Diego', 'Sofia', 'Luis', 'Valentina'];
    const lastNames = ['Gonzalez', 'Rodriguez', 'Gomez', 'Fernandez', 'Lopez', 'Diaz', 'Martinez', 'Perez', 'Garcia', 'Sanchez'];
    const tiers: ('regular' | 'premium' | 'top_tier')[] = ['regular', 'regular', 'regular', 'premium', 'premium', 'top_tier'];
    
    const emailCounts = new Map<string, number>();
    
    for (let i = 0; i < count; i++) {
        const seed = i + 1000;
        const market = randomChoice(MARKETS, seed + 1);
        const firstName = randomChoice(firstNames, seed + 2);
        const lastName = randomChoice(lastNames, seed + 3);
        const tier = randomChoice(tiers, seed + 4);
        
        // Remove accents and special characters just in case, though the list doesn't have them
        const normalizeStr = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const baseEmail = `${normalizeStr(firstName)}.${normalizeStr(lastName)}`;
        const countForBase = emailCounts.get(baseEmail) || 0;
        emailCounts.set(baseEmail, countForBase + 1);
        const email = countForBase > 0 ? `${baseEmail}${countForBase + 1}@mail.com` : `${baseEmail}@mail.com`;
        
        users.push({
            id: `USR-${10000 + i}`,
            first_name: firstName,
            last_name: lastName,
            email: email,
            document_type: 'pasaporte',
            document_number: `AB${123456 + i}`,
            phone: `+57300${1000000 + i}`,
            country: market.country,
            market: market.market,
            language: market.language,
            user_tier: tier,
            loyalty_id: `LTY-${50000 + i}`,
            miles_balance: randomInt(0, 150000, seed + 5),
            preferred_airport: randomChoice(['BOG', 'SCL', 'GRU', 'LIM', 'EZE'], seed + 6),
            created_at: new Date(Date.now() - randomInt(0, 31536000000, seed + 7)).toISOString()
        });
    }
    return users;
};

export const futureDate = (daysFromNow: number, hour: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const generateFlights = (count: number) => {
    const flights = [];
    const airports = ['BOG', 'SCL', 'GRU', 'LIM', 'EZE', 'MIA', 'JFK', 'MAD', 'MEX', 'PTY', 'CUN', 'PUJ', 'CTG', 'ADZ', 'GIG', 'UIO', 'MDE'];
    
    const guaranteedRoutes = [
      { origin: 'BOG', destination: 'SCL' },
      { origin: 'BOG', destination: 'MIA' },
      { origin: 'SCL', destination: 'BOG' },
      { origin: 'LIM', destination: 'MIA' },
      { origin: 'GRU', destination: 'MIA' },
      { origin: 'EZE', destination: 'MIA' },
      // Duplicated to ensure multiple options
      { origin: 'BOG', destination: 'SCL' },
      { origin: 'BOG', destination: 'MIA' },
      { origin: 'SCL', destination: 'BOG' },
      { origin: 'LIM', destination: 'MIA' },
      { origin: 'GRU', destination: 'MIA' },
      { origin: 'EZE', destination: 'MIA' }
    ];

    for (let i = 0; i < count; i++) {
        const seed = i + 2000;
        let origin, dest;
        if (i < guaranteedRoutes.length) {
            origin = guaranteedRoutes[i].origin;
            dest = guaranteedRoutes[i].destination;
        } else {
            origin = randomChoice(airports, seed);
            dest = randomChoice(airports, seed + 1);
            let attempt = 0;
            while (dest === origin) {
                dest = randomChoice(airports, seed + 2 + attempt);
                attempt++;
            }
        }
        
        const direct = seededRandom(seed + 3) > 0.4;
        const priceUSD = randomInt(150, 1200, seed + 4);
        const daysFromNow = randomInt(7, 180, seed + 6);
        const hour = randomInt(6, 22, seed + 7);
        const stopsCount = direct ? 0 : randomInt(1, 2, seed + 15);
        
        flights.push({
            id: `FL-${5000 + i}`,
            flightNumber: `MF${100 + randomInt(0, 899, seed + 5)}`,
            origin,
            destination: dest,
            departureTime: futureDate(daysFromNow, hour),
            durationMinutes: randomInt(90, 720, seed + 8),
            direct,
            stops: stopsCount,
            cabin: randomChoice(['Economy', 'Premium Economy', 'Business'], seed + 9),
            basePriceUSD: priceUSD,
            milesAccumulated: Math.floor(priceUSD * 5),
            availableSeats: randomInt(2, 40, seed + 10)
        });
    }
    return flights;
};

export const generateTrips = (count: number) => {
    const trips = [];
    const airports = ['BOG', 'SCL', 'GRU', 'LIM', 'EZE'];
    for (let i = 0; i < count; i++) {
        const seed = i + 3000;
        const origin = randomChoice(airports, seed);
        let dest = randomChoice(airports, seed + 1);
        let attempt = 0;
        while (dest === origin) {
            dest = randomChoice(airports, seed + 2 + attempt);
            attempt++;
        }
        
        const daysFromNow = randomInt(1, 120, seed + 5);
        const hour = randomInt(6, 22, seed + 6);

        trips.push({
            id: `TRP-${80000 + i}`,
            pnr: `P${randomInt(10000, 99999, seed + 3).toString(36).toUpperCase()}`,
            origin,
            destination: dest,
            status: randomChoice(['confirmed', 'flown', 'cancelled'], seed + 4),
            departureDate: futureDate(daysFromNow, hour),
            passengers: randomInt(1, 4, seed + 7)
        });
    }
    return trips;
};

export const generatePackages = () => {
    const pkgs: any[] = [];
    const images = [
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534943441045-1009d7cb0bb9?q=80&w=1408&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1689850543263-01a52ccc6943?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1635153756203-cfea696035d4?q=80&w=1335&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581452292723-cd8d67c5e2ef?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531968840206-f13bc7500dcf?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=400&fit=crop',
      'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=400&fit=crop',
      'https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=400&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=400&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=400&fit=crop'
    ];

    let idCounter = 1;
    LATAM_CITIES.forEach((city, index) => {
        // Generate at least 2 packages per city
        for(let j = 0; j < 2; j++) {
            const seed = index * 10 + j + 4000;
            // Let's pick a random origin that is not the destination
            let originObj = randomChoice(LATAM_CITIES, seed + 1);
            let attempts = 0;
            while(originObj.id === city.id && attempts < 10) {
                 originObj = randomChoice(LATAM_CITIES, seed + 2 + attempts);
                 attempts++;
            }

            const img = randomChoice(images, seed + 3);
            const nights = randomInt(3, 14, seed + 4);
            const ppd = randomInt(80, 200, seed + 5);
            const flightCost = randomInt(150, 600, seed + 6);
            const pxTotal = flightCost + (nights * ppd);

            pkgs.push({
                id: `PKG-${idCounter++}`,
                name: `Escapada a ${city.city}`,
                originCity: originObj.city,
                originCountry: originObj.country,
                originCode: originObj.airportCode,
                destinationCity: city.city,
                destinationCountry: city.country,
                destinationCode: city.airportCode,
                destination: `${city.city}, ${city.country}`, // Backwards compat
                title: `Paquete a ${city.city} desde ${originObj.city}`,
                hotelName: `Hotel ${randomChoice(['Plaza', 'Grand', 'Resort', 'Boutique', 'Express', 'Royal', 'Imperial'], seed + 7)} ${city.city}`,
                hotelRating: randomChoice([4, 5], seed + 8),
                nights,
                startDate: futureDate(randomInt(10, 60, seed + 9), 10),
                endDate: futureDate(randomInt(10, 60, seed + 9) + nights, 14),
                flightType: 'Ida y vuelta',
                priceUSD: pxTotal, // Backwards compat
                pricePerPersonUSD: pxTotal,
                totalPriceUSD: pxTotal * 2,
                image: img,
                rating: randomChoice([4, 5], seed + 10),
                includesFlight: true,
                includesHotel: true,
                tags: ['Vuelo + Hotel', 'Acumula millas'],
                includes: ['Vuelo directo', 'Equipaje de mano', 'Desayuno incluido', 'Wifi gratis'],
                description: `Disfruta de unas vacaciones increíbles en ${city.city}. Incluye vuelos desde ${originObj.city} y alojamiento en hotel seleccionado con las mejores comodidades.`
            });
        }
    });

    return pkgs;
};

export const generateHotels = () => {
    const hotels: any[] = [];
    const types = ['Hotel', 'Apartamento', 'Resort', 'Villa', 'Hostal', 'Casa'];
    const amenitiesList = ['WiFi', 'Piscina', 'Desayuno incluido', 'Gimnasio', 'Parking', 'Transporte al aeropuerto', 'Aire acondicionado', 'Cocina', 'Pet friendly', 'Vista al mar', 'Cerca del centro'];
    const images = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2340&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2340&auto=format&fit=crop'
    ];

    let idCounter = 1;
    LATAM_CITIES.forEach((city, index) => {
        // At least 2 accommodations per city
        const count = randomInt(2, 5, index * 100);
        for(let j=0; j<count; j++) {
            const seed = index * 10 + j + 5000;
            const type = randomChoice(types, seed);
            
            const amCount = randomInt(3, 7, seed + 1);
            const amenities = [];
            for(let k=0; k<amCount; k++) {
                 amenities.push(randomChoice(amenitiesList, seed + 2 + k));
            }
            // Unique amenities
            const uniqueAmenities = Array.from(new Set(amenities));

            hotels.push({
                id: `HTL-${idCounter++}`,
                name: `${type} ${randomChoice(['Central', 'Plaza', 'View', 'Boutique', 'Oasis', 'Sunset', 'Royal'], seed + 3)} ${city.city}`,
                city: city.city,
                country: city.country,
                destination: city.city, // Backwards compat
                type,
                stars: randomChoice([4, 5], seed + 4),
                rating: randomChoice([4, 5], seed + 5),
                reviewScore: (8 + seededRandom(seed + 6) * 2).toFixed(1), // 8.0 to 10.0
                reviewLabel: randomChoice(['Fabuloso', 'Excepcional', 'Muy bien', 'Excelente'], seed + 7),
                reviewsCount: randomInt(10, 1500, seed + 8),
                distanceFromCenterKm: (seededRandom(seed + 9) * 5 + 0.1).toFixed(1),
                sizeM2: randomInt(20, 150, seed + 10),
                amenities: uniqueAmenities,
                pricePerNightUSD: randomInt(40, 400, seed + 11),
                image: randomChoice(images, seed + 12),
                description: `Excelente ${type.toLowerCase()} ubicado en ${city.city}, ideal para tus vacaciones o viajes de negocios. Cuenta con las mejores instalaciones y servicio de primera categoría.`
            });
        }
    });

    return hotels;
};

export const generateCars = () => {
    const cars: any[] = [];
    const categories = ['Compacto', 'Sedán', 'SUV', 'Premium', 'Van'];
    const providers = ['Hertz', 'Avis', 'Europcar', 'Localiza', 'Alamo'];
    const logos = {
        'Hertz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Hertz_logo.svg/512px-Hertz_logo.svg.png',
        'Avis': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Avis_logo.svg/512px-Avis_logo.svg.png',
        'Europcar': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Europcar_logo.svg/512px-Europcar_logo.svg.png',
        'Localiza': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Localiza_logo.svg/512px-Localiza_logo.svg.png',
        'Alamo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Alamo_Rent_A_Car_logo.svg/512px-Alamo_Rent_A_Car_logo.svg.png'
    };
    
    let idCounter = 1;
    LATAM_CITIES.forEach((city, index) => {
        // Generate at least 4 cars per city
        const count = randomInt(4, 7, index * 100);
        
        for(let j=0; j<count; j++) {
             const seed = index * 10 + j + 6000;
             const providerName = randomChoice(providers, seed + 1);
             const isDifferentDropoff = seededRandom(seed + 2) > 0.8;
             let returnCityObj = city;
             if (isDifferentDropoff) {
                  returnCityObj = randomChoice(LATAM_CITIES, seed + 3);
             }
             
             const category = randomChoice(categories, seed + 4);
             const image = getCarImageByCategory(category, seed + 5);

             cars.push({
                 id: `CAR-${idCounter++}`,
                 pickupCity: city.city,
                 pickupCountry: city.country,
                 returnCity: returnCityObj.city,
                 returnCountry: returnCityObj.country,
                 brand: randomChoice(['Toyota', 'Chevrolet', 'Nissan', 'Ford', 'Renault', 'Volkswagen'], seed + 6),
                 model: `Vehículo ${randomChoice(['Estándar', 'Superior', 'Aventurero', 'Familiar'], seed + 7)}`,
                 category,
                 passengers: randomInt(4, 7, seed + 8),
                 suitcases: randomInt(1, 4, seed + 9),
                 bags: randomInt(1, 4, seed + 9), // alias
                 transmission: randomChoice(['Automático', 'Manual'], seed + 10),
                 unlimitedMileage: seededRandom(seed + 11) > 0.3,
                 mileagePolicy: seededRandom(seed + 11) > 0.3 ? 'Kilometraje ilimitado' : 'Limitado a 200km/día',
                 airConditioning: true,
                 provider: providerName,
                 providerLogo: logos[providerName as keyof typeof logos],
                 pricePerDayUSD: randomInt(25, 120, seed + 12),
                 totalPriceUSD: 0, // calculated later
                 image
             });
        }
    });

    return cars;
};

export const generateAssistanceProducts = (count: number) => {
    const plans = [];
    const types = ['Domestic', 'Essential 60', 'Plus 150', 'Premium Global'];
    for (let i = 0; i < count; i++) {
        const seed = i + 7000;
        const type = randomChoice(types, seed);
        plans.push({
            id: `AST-${100 + i}`,
            name: type,
            coverage: `Hasta $${randomInt(10, 150, seed+1)},000`,
            priceUSD: randomInt(20, 120, seed + 2)
        });
    }
    return plans;
};

// Expose pre-generated datasets to be populated once
export const mockData = {
    users: generateUsers(120),
    flights: generateFlights(800),
    trips: generateTrips(120),
    packages: generatePackages(),
    destinations: [
        { id: 'DST-1', name: 'Cartagena', type: 'Destinos playeros', flightType: 'Ida y vuelta', priceUSD: 290, image: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=2340&auto=format&fit=crop', recommended: true },
        { id: 'DST-2', name: 'Miami', type: 'Destinos playeros', flightType: 'Ida y vuelta', priceUSD: 450, image: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?q=80&w=600&auto=format&fit=crop' },
        { id: 'DST-3', name: 'Madrid', type: 'Aventuras urbanas', flightType: 'Ida y vuelta', priceUSD: 850, image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2340&auto=format&fit=crop', recommended: true },
        { id: 'DST-4', name: 'Lima', type: 'Joyas arquitectónicas de LATAM', flightType: 'Solo ida', priceUSD: 180, image: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?q=80&w=2406&auto=format&fit=crop' },
        { id: 'DST-5', name: 'Ciudad de México', type: 'Joyas arquitectónicas de LATAM', flightType: 'Solo ida', priceUSD: 310, image: 'https://images.unsplash.com/photo-1584669727833-88b47506defb?q=80&w=2124&auto=format&fit=crop' },
        { id: 'DST-6', name: 'Buenos Aires', type: 'Vida nocturna', flightType: 'Ida y vuelta', priceUSD: 250, image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?q=80&w=600&auto=format&fit=crop' },
        { id: 'DST-7', name: 'Santiago', type: 'Naturaleza', flightType: 'Ida y vuelta', priceUSD: 210, image: 'https://images.unsplash.com/photo-1574972412534-111db079e5de?q=80&w=600&auto=format&fit=crop' },
        { id: 'DST-8', name: 'Río de Janeiro', type: 'Destinos playeros', flightType: 'Ida y vuelta', priceUSD: 390, image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=600&auto=format&fit=crop', recommended: true },
        { id: 'DST-9', name: 'Ciudad de México', type: 'Aventuras urbanas', flightType: 'Ida y vuelta', priceUSD: 310, image: 'https://images.unsplash.com/photo-1652073175063-402b831cc9b7?q=80&w=2340&auto=format&fit=crop' },
        { id: 'DST-10', name: 'San Andrés', type: 'Destinos playeros', flightType: 'Solo ida', priceUSD: 150, image: 'https://images.unsplash.com/photo-1578600925345-fb0341f25289?q=80&w=1335&auto=format&fit=crop' },
        { id: 'DST-11', name: 'Cusco', type: 'Naturaleza', flightType: 'Ida y vuelta', priceUSD: 240, image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=600&auto=format&fit=crop', recommended: true },
        { id: 'DST-12', name: 'Bogotá', type: 'Aventuras urbanas', flightType: 'Solo ida', priceUSD: 140, image: 'https://images.unsplash.com/photo-1720067392108-89b9485aa090?q=80&w=1285&auto=format&fit=crop' },
        { id: 'DST-13', name: 'Punta Cana', type: 'Destinos playeros', flightType: 'Ida y vuelta', priceUSD: 480, image: 'https://images.unsplash.com/photo-1569700946659-fe1941c71fe4?q=80&w=2340&auto=format&fit=crop' },
        { id: 'DST-14', name: 'Cancún', type: 'Destinos playeros', flightType: 'Ida y vuelta', priceUSD: 580, image: 'https://images.unsplash.com/photo-1630252452598-56d592ceec50?q=80&w=952&auto=format&fit=crop' },
        { id: 'DST-15', name: 'Medellín', type: 'Aventuras urbanas', flightType: 'Solo ida', priceUSD: 160, image: 'https://images.unsplash.com/photo-1697082390861-9f5186b44431?q=80&w=2340&auto=format&fit=crop', recommended: true },
        { id: 'DST-16', name: 'Quito', type: 'Joyas arquitectónicas de LATAM', flightType: 'Ida y vuelta', priceUSD: 230, image: 'https://images.unsplash.com/photo-1663480250376-3ee7069dce8d?q=80&w=2340&auto=format&fit=crop' },
        { id: 'DST-17', name: 'Montevideo', type: 'Vida nocturna', flightType: 'Ida y vuelta', priceUSD: 330, image: 'https://images.unsplash.com/photo-1602010101414-02b8dfb075c6?q=80&w=2340&auto=format&fit=crop' },
        { id: 'DST-18', name: 'Ciudad de Panamá', type: 'Aventuras urbanas', flightType: 'Ida y vuelta', priceUSD: 280, image: 'https://images.unsplash.com/photo-1675090696282-b97a00d22f07?q=80&w=2340&auto=format&fit=crop', recommended: true },
        { id: 'DST-19', name: 'San José', type: 'Naturaleza', flightType: 'Ida y vuelta', priceUSD: 360, image: 'https://images.unsplash.com/photo-1666606654536-6d4c20948779?q=80&w=2340&auto=format&fit=crop' },
        { id: 'DST-20', name: 'Santo Domingo', type: 'Joyas arquitectónicas de LATAM', flightType: 'Ida y vuelta', priceUSD: 420, image: 'https://images.unsplash.com/photo-1756585124302-360aac5f6bcb?q=80&w=2340&auto=format&fit=crop' },
        { id: 'DST-21', name: 'Aruba', type: 'Destinos playeros', flightType: 'Ida y vuelta', priceUSD: 520, image: 'https://images.unsplash.com/photo-1658760822636-bc3feb3fa793?q=80&w=2340&auto=format&fit=crop', recommended: true },
        { id: 'DST-22', name: 'Barcelona', type: 'Aventuras urbanas', flightType: 'Ida y vuelta', priceUSD: 920, image: 'https://images.unsplash.com/photo-1758471206484-0eaa2568320c?q=80&w=2340&auto=format&fit=crop' },
        { id: 'DST-23', name: 'París', type: 'Aventuras urbanas', flightType: 'Ida y vuelta', priceUSD: 980, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2340&auto=format&fit=crop', recommended: true },
        { id: 'DST-24', name: 'Roma', type: 'Joyas arquitectónicas de LATAM', flightType: 'Ida y vuelta', priceUSD: 940, image: 'https://images.unsplash.com/photo-1460722665083-c2599113f7e0?q=80&w=2340&auto=format&fit=crop' },
        { id: 'DST-25', name: 'Nueva York', type: 'Aventuras urbanas', flightType: 'Ida y vuelta', priceUSD: 690, image: 'https://images.unsplash.com/photo-1501503025393-9be51b4d662d?q=80&w=2340&auto=format&fit=crop', recommended: true },
        { id: 'DST-26', name: 'Orlando', type: 'Aventuras urbanas', flightType: 'Ida y vuelta', priceUSD: 530, image: 'https://images.unsplash.com/photo-1758464643041-a22da8403070?q=80&w=2340&auto=format&fit=crop' },
        { id: 'DST-27', name: 'Guayaquil', type: 'Joyas arquitectónicas de LATAM', flightType: 'Solo ida', priceUSD: 210, image: 'https://images.unsplash.com/photo-1628004550522-02dc9cb7456e?q=80&w=2340&auto=format&fit=crop' },
        { id: 'DST-28', name: 'La Paz', type: 'Naturaleza', flightType: 'Ida y vuelta', priceUSD: 260, image: 'https://images.unsplash.com/photo-1641736047534-afd0c9014a7c?q=80&w=2340&auto=format&fit=crop' },
        { id: 'DST-29', name: 'Punta del Este', type: 'Destinos playeros', flightType: 'Ida y vuelta', priceUSD: 370, image: 'https://images.unsplash.com/photo-1653918488348-17d2a707012f?q=80&w=2340&auto=format&fit=crop' }

    ],
    hotels: generateHotels(),
    cars: generateCars(),
    assistance: generateAssistanceProducts(120),
};
