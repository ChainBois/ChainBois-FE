'use client'

// async function getData() {
// 	await new Promise((resolve) => setTimeout(resolve, 999999)) // effectively infinite
// 	return {}
// }

export default async function Page() {
	throw new Error("Testing Error Page")
	return <></>
}
