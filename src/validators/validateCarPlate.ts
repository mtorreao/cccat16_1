export default function validateCarPlate(plate: string) {
	return !!plate.match(/[A-Z]{3}[0-9]{4}/);
}