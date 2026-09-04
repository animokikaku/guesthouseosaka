/** Renders the privacy policy trigger inline instead of opening a real dialog. */
export function LegalNoticeDialog({ children }: { children: React.ReactNode }) {
  return <div data-testid="legal-notice-dialog">{children}</div>
}
