import Image from "next/image"

export function PageLoading({ label }: { label: string }) {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="brand-loading">
      <div className="brand-loading-content">
        <div className="brand-loading-signature" aria-hidden="true">
          <Image
            src="/adakan-logo-v4.png"
            unoptimized
            alt=""
            width={64}
            height={64}
            preload
            className="brand-loading-mark"
          />
          <div className="brand-loading-wordmark">
            <span className="brand-loading-name">Adakan</span>
            <span className="brand-loading-descriptor">Software</span>
          </div>
        </div>
        <div className="brand-loading-track" aria-hidden="true">
          <span className="loading-progress" />
        </div>
        <p className="brand-loading-label"><span className="sr-only">Yükleniyor · Loading</span>{label}</p>
      </div>
    </div>
  )
}
