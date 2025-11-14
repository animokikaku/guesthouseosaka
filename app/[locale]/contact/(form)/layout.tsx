import { ContactNav } from '@/components/contact-nav'
import { PageNav } from '@/components/page-nav'

export default function Layout({ children }: LayoutProps<'/[locale]/contact'>) {
  return (
    <>
      <PageNav id="tabs">
        <ContactNav />
      </PageNav>
      {children}
    </>
  )
}
