export default function validateEmail(email: string): boolean {
	return !!email.match(/^(.+)@(.+)$/);
}
