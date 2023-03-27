export const getReferenceData = (name: string, length = 5): any[] => {
	return Array(length).fill('').map((_, index) => ({ id: index + 1, name }))
}