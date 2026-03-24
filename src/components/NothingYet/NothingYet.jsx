'use client'

import n from './NothingYet.module.css'

export default function NothingYet({
	message,
	cta,
	title = 'Awaiting Deployment',
	eyebrow = 'ChainBoi Intel',
}) {
	const resolvedMessage =
		String(message ?? '').trim() ||
		'Nothing has been deployed here yet. Check back soon.'

	return (
		<section className={n.emptyState} aria-live='polite'>
			<div className={n.panel}>
				<div className={n.art} aria-hidden='true'>
					<div className={n.starfield}></div>
					<div className={n.orbit}></div>
					<div className={n.orbitInner}></div>
					<div className={n.beacon}></div>
					<div className={n.signal}></div>
					<div className={`${n.ping} ${n.pingOne}`}></div>
					<div className={`${n.ping} ${n.pingTwo}`}></div>
					<div className={`${n.chip} ${n.chipTop}`}>NFT</div>
					<div className={`${n.chip} ${n.chipBottom}`}>READY</div>
				</div>

				<div className={n.copy}>
					<p className={n.eyebrow}>{eyebrow}</p>
					<h2 className={n.title}>{title}</h2>
					<p className={n.message}>{resolvedMessage}</p>
					{cta ? <div className={n.cta}>{cta}</div> : null}
				</div>
			</div>
		</section>
	)
}
