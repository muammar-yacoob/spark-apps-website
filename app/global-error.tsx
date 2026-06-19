'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: '#000',
          color: '#fff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/imgs/500.png"
            alt="Server error"
            style={{ width: 220, height: 220, objectFit: 'contain' }}
          />

          <h1 style={{ fontSize: 26, fontWeight: 700, marginTop: 28, marginBottom: 8 }}>
            It&apos;s not your fault!
          </h1>
          <p
            style={{
              color: '#9ca3af',
              marginBottom: 8,
              textAlign: 'center',
              maxWidth: 400,
              lineHeight: 1.6,
            }}
          >
            Our servers had a moment. Totally on us.
          </p>
          {error.digest && (
            <p style={{ fontSize: 12, color: '#4b5563', marginBottom: 32 }}>
              Error ID: {error.digest}
            </p>
          )}
          {!error.digest && <div style={{ marginBottom: 32 }} />}

          <button
            type="button"
            onClick={reset}
            style={{
              padding: '10px 24px',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: 8,
              fontWeight: 500,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
