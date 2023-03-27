export const getReferenceData = (name: string, length = 5) => {
	return Array(length).fill('').map((_, index) => ({ id: index + 1, name }))
}