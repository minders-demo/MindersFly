export interface Flight {
    id: string;
    flightNumber: string;
    origin: string;
    destination: string;
    departureTime: string;
    durationMinutes: number;
    direct: boolean;
    cabin: string;
    basePriceUSD: number;
    milesAccumulated: number;
    availableSeats: number;
}
