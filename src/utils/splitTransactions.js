/**
 * Split a list of transactions into smaller batches to avoid hitting the
 * transaction maximum (currently 16).
 * @param {Array<algosdk.Transaction>} txns - The list of transactions to split.
 * @param {number} batchCount - The maximum number of transactions to include in
 * each batch. Defaults to 16.
 * @returns {Array<Array<algosdk.Transaction>>} - An array of arrays of
 * transactions, where each sub-array contains up to `batchCount` transactions.
 */
export const splitTransactions = (txns, batchCount = 16) => {
	const batch_ = txns
	const batchLen_ = batch_.length
	const steps_ = Math.ceil(batchLen_ / batchCount)
	let step_ = 1
	const wrapperTxn = []
	while (step_ <= steps_) {
		const point = (step_ - 1) * batchCount
		const end = step_ * batchCount
		const stop = end > batchLen_ ? batchLen_ : end
		let i = point
		const txns = []
		while (i < stop) {
			txns.push(batch_[i])
			i++
		}
		wrapperTxn.push(txns)
		step_++
	}

	return wrapperTxn
}
