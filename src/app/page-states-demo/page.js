// Create this file: app/page-states-demo/page.js
'use client'

import { useState } from 'react'
import { cf } from '@/utils'
import s from '@/styles'
import ErrorPage from '../error'
import NotFoundPage from '../not-found'
import LoadingPage from '../loading'

export default function PageStatesDemo() {
	const [currentView, setCurrentView] = useState('demo')

	// Loading Page Variations
	const showBasicLoading = () => setCurrentView('loading-basic')
	const showCustomLoading = () => setCurrentView('loading-custom')
	const showProgressLoading = () => setCurrentView('loading-progress')

	// Error Page Variations
	const showBasicError = () => setCurrentView('error-basic')
	const showCustomError = () => setCurrentView('error-custom')
	const showNetworkError = () => setCurrentView('error-network')

	// 404 Page
	const show404 = () => setCurrentView('404')

	// Reset to demo
	const resetDemo = () => setCurrentView('demo')

	// Render based on current view
	switch (currentView) {
		case 'loading-basic':
			return <LoadingPage />

		case 'loading-custom':
			return (
				<LoadingPage
					message='Loading Legendary Warriors...'
					subMessage='Preparing the ultimate battle experience'
					customMessages={[
						'Summoning heroes from the blockchain...',
						'Loading weapons arsenal...',
						'Preparing battle arena...',
						'Connecting to the metaverse...',
						'Almost ready for combat!',
					]}
				/>
			)

		case 'loading-progress':
			return (
				<LoadingPage
					message='Installing Game Update...'
					subMessage='Please wait while we enhance your experience'
					showProgress={true}
				/>
			)

		case 'error-basic':
			return <ErrorPage />

		case 'error-custom':
			return (
				<ErrorPage
					errorCode={503}
					title='Battle Servers Offline'
					message='Our legendary battle servers are currently under maintenance. The warriors are sharpening their weapons and will return soon!'
					showRetry={false}
				/>
			)

		case 'error-network':
			return (
				<ErrorPage
					errorCode={408}
					title='Connection Timeout'
					message='Unable to connect to the ChainBois network. Check your internet connection and try again, legendary warrior.'
					showRetry={true}
				/>
			)

		case '404':
			return <NotFoundPage />

		default:
			return (
				<div
					className={cf(s.vHMax, s.flex, s.flexCenter, s.flex_dColumn)}
					style={{ background: '#0a0a0a', color: 'white', padding: '50px' }}
				>
					<div
						className={cf(s.flex, s.flex_dColumn, s.flexCenter, s.g34)}
						style={{ maxWidth: '800px' }}
					>
						<h1
							style={{
								fontSize: '3rem',
								textAlign: 'center',
								marginBottom: '2rem',
								color: '#dc2626',
							}}
						>
							ChainBois Page States Demo
						</h1>

						<p
							style={{
								textAlign: 'center',
								fontSize: '1.2rem',
								marginBottom: '3rem',
								color: '#a1a1aa',
							}}
						>
							Click the buttons below to test different page states
						</p>

						{/* Loading Pages Section */}
						<div
							className={cf(s.flex, s.flex_dColumn, s.g20)}
							style={{ width: '100%' }}
						>
							<h2 style={{ color: '#10b981', fontSize: '1.5rem' }}>
								🔄 Loading Pages
							</h2>
							<div
								className={cf(s.flex, s.flexCenter, s.g15)}
								style={{ flexWrap: 'wrap' }}
							>
								<button
									onClick={showBasicLoading}
									className='demo-button'
								>
									Basic Loading
								</button>
								<button
									onClick={showCustomLoading}
									className='demo-button'
								>
									Custom Messages
								</button>
								<button
									onClick={showProgressLoading}
									className='demo-button'
								>
									With Progress Bar
								</button>
							</div>
						</div>

						{/* Error Pages Section */}
						<div
							className={cf(s.flex, s.flex_dColumn, s.g20)}
							style={{ width: '100%' }}
						>
							<h2 style={{ color: '#dc2626', fontSize: '1.5rem' }}>
								❌ Error Pages
							</h2>
							<div
								className={cf(s.flex, s.flexCenter, s.g15)}
								style={{ flexWrap: 'wrap' }}
							>
								<button
									onClick={showBasicError}
									className='demo-button'
								>
									Basic Error (500)
								</button>
								<button
									onClick={showCustomError}
									className='demo-button'
								>
									Server Offline (503)
								</button>
								<button
									onClick={showNetworkError}
									className='demo-button'
								>
									Network Timeout (408)
								</button>
							</div>
						</div>

						{/* 404 Page Section */}
						<div
							className={cf(s.flex, s.flex_dColumn, s.g20)}
							style={{ width: '100%' }}
						>
							<h2 style={{ color: '#3b82f6', fontSize: '1.5rem' }}>
								🔍 404 Page
							</h2>
							<div className={cf(s.flex, s.flexCenter, s.g15)}>
								<button
									onClick={show404}
									className='demo-button'
								>
									Show 404 Page
								</button>
							</div>
						</div>

						{/* Instructions */}
						<div
							style={{
								background: 'rgba(31, 41, 55, 0.6)',
								padding: '20px',
								borderRadius: '8px',
								border: '1px solid rgba(55, 65, 81, 0.5)',
								marginTop: '2rem',
							}}
						>
							<h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>
								💡 Pro Tips:
							</h3>
							<ul style={{ color: '#d1d5db', lineHeight: '1.6' }}>
								<li>
									Loading pages will auto-advance after a few seconds in real
									usage
								</li>
								<li>
									Error pages include retry functionality and navigation options
								</li>
								<li>
									All pages are fully responsive and match your game&apos;s theme
								</li>
								<li>
									You can customize messages, colors, and animations via props
								</li>
							</ul>
						</div>
					</div>

					<style jsx>{`
						.demo-button {
							padding: 14px 24px;
							background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
							color: white;
							border: none;
							border-radius: 8px;
							font-size: 14px;
							font-weight: 600;
							cursor: pointer;
							transition: all 0.3s ease;
							box-shadow: 0 4px 14px rgba(220, 38, 38, 0.3);
						}

						.demo-button:hover {
							transform: translateY(-2px);
							box-shadow: 0 8px 20px rgba(220, 38, 38, 0.4);
							background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
						}

						.demo-button:active {
							transform: translateY(0);
						}
					`}</style>
				</div>
			)
	}
}
