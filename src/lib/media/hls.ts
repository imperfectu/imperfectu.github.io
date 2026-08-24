import Hls, { type ErrorData, type Events } from 'hls.js';

export function isHlsUrl(url: string): boolean {
	return /\.m3u8($|\?)/i.test(url);
}

export type MediaAttachHandle = {
	/** Destroy HLS instance and clear src */
	destroy: () => void;
};

/**
 * Attach a progressive MP4 or HLS (.m3u8) source to a video element.
 * Uses native HLS on Safari; hls.js elsewhere when MediaSource is available.
 */
export function attachMediaSource(
	video: HTMLVideoElement,
	src: string,
	options?: {
		autoplay?: boolean;
		muted?: boolean;
		onFatalError?: (message: string) => void;
	}
): MediaAttachHandle {
	let hls: Hls | null = null;
	const { autoplay = false, muted, onFatalError } = options ?? {};

	if (typeof muted === 'boolean') {
		video.muted = muted;
	}

	const playIfNeeded = () => {
		if (!autoplay) return;
		void video.play().catch(() => {
			/* autoplay policies may block */
		});
	};

	const destroy = () => {
		if (hls) {
			hls.destroy();
			hls = null;
		}
		video.removeAttribute('src');
		video.load();
	};

	if (!src) {
		return { destroy };
	}

	if (isHlsUrl(src)) {
		if (Hls.isSupported()) {
			hls = new Hls({
				enableWorker: true,
				lowLatencyMode: false,
				backBufferLength: 90
			});
			hls.loadSource(src);
			hls.attachMedia(video);
			hls.on(Hls.Events.MANIFEST_PARSED, () => playIfNeeded());
			hls.on(Hls.Events.ERROR, (_event: Events.ERROR, data: ErrorData) => {
				if (!data.fatal || !hls) return;
				switch (data.type) {
					case Hls.ErrorTypes.NETWORK_ERROR:
						hls.startLoad();
						break;
					case Hls.ErrorTypes.MEDIA_ERROR:
						hls.recoverMediaError();
						break;
					default:
						onFatalError?.(data.details ?? 'HLS playback failed');
						destroy();
						break;
				}
			});
		} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
			video.src = src;
			video.addEventListener('loadedmetadata', playIfNeeded, { once: true });
		} else {
			onFatalError?.('HLS is not supported in this browser');
		}
	} else {
		video.src = src;
		video.addEventListener('loadedmetadata', playIfNeeded, { once: true });
	}

	return { destroy };
}
