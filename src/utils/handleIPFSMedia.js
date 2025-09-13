
/**
 * @description
 * Takes a URL that could be an IPFS CID and if it is, converts it to a URL that can be used in a web browser.
 * @param {string} media The URL to be processed.
 * @returns {string} The processed URL.
 */
export const handleIPFSMedia = (media) => {
	if (!media || typeof media !== 'string') return null
	const urlParts = media.split('/')
	const cid = urlParts[urlParts.length - 1]
	const x = urlParts[urlParts.length - 3]
	if (media.includes('https://ipfs.algonode.dev')) {
		return media.replace('https://ipfs.algonode.dev', 'https://gateway.ipfs.io')
	}
	if (x.includes('ipfs')) {
		return 'https://ipfs.io/ipfs/' + cid + '#x-ipfs-companion-no-redirect'
	} else return media
}