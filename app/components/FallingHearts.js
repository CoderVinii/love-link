export default function FallingHearts({ count = 18, className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className="lovelink-falling-heart"
          style={{
            left: `${(index * 37) % 100}%`,
            animationDelay: `${index * -1.3}s`,
            animationDuration: `${10 + (index % 6) * 1.8}s`,
            opacity: 0.12 + (index % 5) * 0.035,
            '--heart-size': `${18 + (index % 5) * 7}px`,
            '--heart-drift': `${index % 2 === 0 ? 24 : -24}px`,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  )
}
