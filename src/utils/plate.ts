export function searchPlate(plate: string): string|undefined {
    const regex = /^[A-Z]{3}\d{1}[A-Z]?\d{2}$/;
    if (regex.test(plate)) {
        return plate;
    }
    
    return undefined;
}