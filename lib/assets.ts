import { url } from './utils/blob-storage'

export const assets = {
  notFound: {
    src: url('404.svg'),
    width: 750,
    height: 500,
    alt: 'Not found'
  },
  openGraph: {
    home: {
      src: url('opengraph/home.jpg'),
      width: 1200,
      height: 637,
      alt: 'Share House Osaka'
    },
    apple: {
      src: url('opengraph/apple.jpg'),
      width: 1200,
      height: 502,
      alt: 'Apple House'
    },
    orange: {
      src: url('opengraph/orange.jpg'),
      width: 1200,
      height: 502,
      alt: 'Orange House'
    },
    lemon: {
      src: url('opengraph/lemon.jpg'),
      width: 1200,
      height: 502,
      alt: 'Lemon House'
    },
    contact: {
      src: url('opengraph/contact.jpg'),
      width: 1200,
      height: 352,
      alt: 'Contact Page'
    },
    faq: {
      src: url('opengraph/faq.jpg'),
      width: 1200,
      height: 352,
      alt: 'FAQ Page'
    }
  },
  logo: {
    sho: {
      src: url('logo.png'),
      width: 322,
      height: 209,
      alt: 'Share House Osaka logo'
    },
    orange: {
      src: url('logo/orange.png'),
      width: 326,
      height: 151,
      alt: 'Orange House logo'
    },
    apple: {
      src: url('logo/apple.png'),
      width: 334,
      height: 166,
      alt: 'Apple House logo'
    },
    lemon: {
      src: url('logo/lemon.png'),
      width: 306,
      height: 200,
      alt: 'Lemon House logo'
    }
  },
  apple: {
    icon: {
      src: url('icon_apple.webp'),
      width: 66,
      height: 83,
      alt: 'Apple house icon'
    }
  },
  lemon: {
    icon: {
      src: url('icon_lemon.webp'),
      width: 71,
      height: 69,
      alt: 'Lemon house icon'
    }
  },
  orange: {
    icon: {
      src: url('icon_orange.webp'),
      width: 76,
      height: 76,
      alt: 'Orange house icon'
    }
  }
} as const
