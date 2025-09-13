import { COLLECTION_RE } from '@/constants'

function getBasePath(path) {
	const firstSlash = path.indexOf('/')
	const secondSlash = path.indexOf('/', firstSlash + 1)

	if (secondSlash === -1) {
		return path
	}

	return path.substring(0, secondSlash)
}

/**
 * Checks if a given link is focused based on the current pathname.
 *
 * If useStrictHome is true, the "/" link is only focused when the pathname is
 * exactly "/". Otherwise, the "/" link is focused if the pathname starts with
 * any of the paths in the paths array or if it matches the COLLECTION_RE regex.
 *
 * If the link is not "/", it is focused if the pathname starts with the link.
 *
 * @param {object} options
 * @param {string} options.pathname - the current pathname
 * @param {string} options.link - the link to check
 * @param {Array<string>} [options.paths = ['/auctions', '/shuffles']] - an array of paths
 * @param {boolean} [options.useStrictHome = false] - whether to use strict matching for the home page
 * @param {boolean} [options.testForCollection = true] - whether to test for a collection ID
 * @returns {boolean} true if the link is focused, false otherwise
 */
export function isFocused({
	pathname = '',
	link = '/',
	paths = ['/auctions', '/shuffles'],
	useStrictHome = false,
	testForCollection = true,
} = {}) {
	// “/” should be focused when on Auctions, Shuffles or a 24-hex collection ID
	if (link === '/') {
		if (pathname !== link && testForCollection) {
			const path = getBasePath(pathname)
			return COLLECTION_RE.test(path)
		}

		return useStrictHome
			? pathname === link
			: paths?.length
			? paths.some((p) => pathname.startsWith(p))
			: pathname.startsWith(link)
	}
	return pathname.startsWith(link)
}
