'use client';

/**
 * FoodVideo — Reusable cinematic video component.
 *
 * Accepts a videoRef for external scroll-scrubbing control.
 * Used in every section that needs a video background or card.
 */

export default function FoodVideo({
  videoRef,
  src = '/videos/7sec-optimized.mp4',
  fallbackSrc = '/videos/7 sec.mp4',
  className = '',
  style = {},
  objectPosition = 'center',
  loop = false,
  autoPlay = false,
  muted = true,
  playsInline = true,
  preload = 'auto',
  onError,
}) {
  const handleError = (e) => {
    if (onError) {
      onError(e);
    } else if (videoRef?.current && !videoRef.current.src.includes('7%20sec') && !videoRef.current.src.includes('7 sec')) {
      videoRef.current.src = fallbackSrc;
    }
  };

  return (
    <video
      ref={videoRef}
      src={src}
      className={className}
      style={{
        objectFit: 'cover',
        objectPosition,
        ...style,
      }}
      muted={muted}
      playsInline={playsInline}
      loop={loop}
      autoPlay={autoPlay}
      preload={preload}
      onError={handleError}
    />
  );
}

