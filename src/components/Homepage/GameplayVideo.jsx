'use client'

import { useRef, useState, useCallback, useEffect, memo } from 'react'
import YouTube from 'react-youtube'
import {
	BsPlayFill,
	BsPauseFill,
	BsVolumeUpFill,
	BsVolumeMuteFill,
} from 'react-icons/bs'
import s from '@/styles'
import { cf } from '@/utils'
import g from './Gameplay.module.css'

function GameplayVideo({ videoId }) {
	const playerRef = useRef(null)
	const intervalRef = useRef(null)
	const touchTimeoutRef = useRef(null)

	const [isPlaying, setIsPlaying] = useState(false)
	const [isMuted, setIsMuted] = useState(true)
	const [isHovered, setIsHovered] = useState(false)
	const [progress, setProgress] = useState(0)

	const opts = {
		playerVars: {
			autoplay: 0,
			controls: 0,
			modestbranding: 1,
			rel: 0,
			iv_load_policy: 3,
			mute: 1,
			playsinline: 1,
			disablekb: 1,
		},
	}

	const onReady = useCallback((e) => {
		playerRef.current = e.target
		e.target.mute()
	}, [])

	const onStateChange = useCallback((e) => {
		const playing = e.data === 1
		setIsPlaying(playing)
		if (playing) {
			intervalRef.current = setInterval(() => {
				if (!playerRef.current) return
				const dur = playerRef.current.getDuration()
				const cur = playerRef.current.getCurrentTime()
				setProgress(dur ? (cur / dur) * 100 : 0)
			}, 500)
		} else {
			clearInterval(intervalRef.current)
		}
	}, [])

	const togglePlay = useCallback(() => {
		if (!playerRef.current) return
		isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo()
	}, [isPlaying])

	const toggleMute = useCallback(
		(e) => {
			e.stopPropagation()
			if (!playerRef.current) return
			if (isMuted) {
				playerRef.current.unMute()
				setIsMuted(false)
			} else {
				playerRef.current.mute()
				setIsMuted(true)
			}
		},
		[isMuted],
	)

	const handleSeek = useCallback((e) => {
		e.stopPropagation()
		if (!playerRef.current) return
		const rect = e.currentTarget.getBoundingClientRect()
		const pct = (e.clientX - rect.left) / rect.width
		playerRef.current.seekTo(pct * playerRef.current.getDuration())
		setProgress(pct * 100)
	}, [])

	// Mobile: tap to reveal controls, auto-hide after 3s
	const handleTouch = useCallback(() => {
		setIsHovered(true)
		clearTimeout(touchTimeoutRef.current)
		touchTimeoutRef.current = setTimeout(() => setIsHovered(false), 3000)
	}, [])

	useEffect(() => {
		return () => {
			clearInterval(intervalRef.current)
			clearTimeout(touchTimeoutRef.current)
		}
	}, [])

	return (
		<div
			className={cf(s.p_absolute, g.gameplayBg, g.videoWrapper)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onTouchStart={handleTouch}
		>
			<YouTube
				videoId={videoId}
				opts={opts}
				onReady={onReady}
				onStateChange={onStateChange}
				className={g.youtubeEmbed}
				iframeClassName={g.youtubeIframe}
			/>

			{/* Sits above iframe to intercept pointer events */}
			<div
				className={g.videoClickOverlay}
				onClick={togglePlay}
			/>

			<div
				className={cf(g.videoControls, isHovered ? g.videoControlsVisible : '')}
			>
				<button
					className={g.videoBtn}
					onClick={togglePlay}
					aria-label={isPlaying ? 'Pause' : 'Play'}
				>
					{isPlaying ? <BsPauseFill /> : <BsPlayFill />}
				</button>

				<div
					className={g.videoProgress}
					onClick={handleSeek}
					role='slider'
					aria-label='Seek'
					aria-valuenow={Math.round(progress)}
				>
					<div
						className={g.videoProgressFill}
						style={{ width: `${progress}%` }}
					/>
					<div
						className={g.videoProgressThumb}
						style={{ left: `${progress}%` }}
					/>
				</div>

				<button
					className={g.videoBtn}
					onClick={toggleMute}
					aria-label={isMuted ? 'Unmute' : 'Mute'}
				>
					{isMuted ? <BsVolumeMuteFill /> : <BsVolumeUpFill />}
				</button>
			</div>
		</div>
	)
}

const GameplayVideoExport = memo(GameplayVideo)
export default GameplayVideoExport
