import { blobUrl } from './utils/blob-storage'

const url = (path: string) => {
  return blobUrl(path)
}

export const assets = {
  apple: {
    background: {
      src: url('bg_apple.webp'),
      width: 1600,
      height: 670,
      blurDataURL:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAECAIAAAA4WjmaAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAh0lEQVR4nAF8AIP/AP/Iav/fidc2ApNPBaJzOJBXGuFlLfGnW//AdvOyeACQSwCFSxREEwClYy+WRRpiBwDFgjnyp2bXklfmpXEAkVIdWiYALAAASx4AOAAAQRIAsX1O//vS/e7L0ad9AEgZAD0OAHFJJ3RMMcKLPs2aZWo/IP/7297ct/XLnwIGNlH1CHEfAAAAAElFTkSuQmCC',
      alt: 'Apple house background'
    },
    icon: {
      src: url('icon_apple.webp'),
      width: 66,
      height: 83,
      alt: 'Apple house icon'
    },
    map: {
      src: url('map_apple.webp'),
      width: 1024,
      height: 681,
      blurDataURL:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAA5ElEQVR4nAHZACb/AGNrkGBph5aanpSVm19eYX19f4eHisC9wKKbn4pgVgCalZebmZmeoZ+VlZkOAwBuaWOUkIzNx8aalJNPNC0ATE9iRUdRoKOinZCUeRssxa6x497f+vr8sKuqdU9FAEZRfTo+VaqooYJubiMQB3RrZldIQWA/SH98f00yLQA7SXY+Qlq0rqHEuro7LSlzTUw3FRtgQUqYlJVGHxkAQElZX2Zv7+/yur2+fn+Ei4ySlpuhlpqgdHZ7iImOAEdLUm1ydqGkp5SYnJOYn4+WnJqgp6m0u663wZSboJdsZ/GsByycAAAAAElFTkSuQmCC',
      alt: 'Apple house map'
    }
  },
  lemon: {
    background: {
      src: url('bg_lemon.webp'),
      width: 1600,
      height: 670,
      blurDataURL:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAECAIAAAA4WjmaAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAh0lEQVR4nAF8AIP/AE5SVmJmaUZISXJ0ddLc4fL09uzs7mJgY0hISzIrNgALEBFAQUVFRUVtcnDDvLD+/v77+/thYGY0NDkYFxwALSAANR0CIBcFOzQmjHpmq6ijdnZzT1BLJSckHSktABcAAD0vGD0zJk9IOk9KQl9eVlVfWzM/QxotNg8eIyczKty2MNsXAAAAAElFTkSuQmCC',
      alt: 'Lemon house background'
    },
    icon: {
      src: url('icon_lemon.webp'),
      width: 71,
      height: 69,
      alt: 'Lemon house icon'
    },
    map: {
      src: url('map_lemon.webp'),
      width: 1000,
      height: 665,
      blurDataURL:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAA5ElEQVR4nAHZACb/APv8/ff6/P7//+/0+rnG2Mrb6vf7/uPv+7bT87HP8QD8/P37/P3L1ePU2+l+h5tybYXk6/HN5vfC3va50/MA/Pz90djjo7LKp7LIY2l5UkVaipSqn6/Euc3jxdDdAKGgp5yntpCdspyjtFFWaC8uQSQtRUNLY4CTstHW3wCZoKqlr7uJlKSbobA8PEovKjonJjYhJTp+iJjCytUAgYiUbXWAbXV/d3+NPUFMNzxHAAAAGh0tT1NaWGNxAD1PaSs8UlhdbElVaRcYGTc7SQcAFR0eIxEfKx0vKUyEdbwV9zcSAAAAAElFTkSuQmCC',
      alt: 'Lemon house map'
    }
  },
  orange: {
    background: {
      src: url('bg_orange.webp'),
      width: 1600,
      height: 670,
      blurDataURL:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAECAIAAAA4WjmaAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAh0lEQVR4nAF8AIP/AKRfJK5lKY9QIWg1EpdWIeKJPuqVUe2SSMRyMLFpKgB5QReMSxuIOxnEdDqLRxqyZCvzlEj/olf/z43hikUAbTobWSgQwW1AuX1OXTEa/86X/8OMZjwjFwAA9rR5ADseCEsoDnhHGHRFF4lTIbB3Q//2yHRFGU0pE6tyQm0AMiAaDwLLAAAAAElFTkSuQmCC',
      alt: 'Orange house background'
    },
    icon: {
      src: url('icon_orange.webp'),
      width: 76,
      height: 76,
      alt: 'Orange house icon'
    },
    map: {
      src: url('map_orange.webp'),
      width: 1000,
      height: 665,
      blurDataURL:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAA5ElEQVR4nAHZACb/APv8/ff6/P7//+/0+rnG2Mrb6vf7/uPv+7bT87HP8QD8/P37/P3L1ePU2+l+h5tybYXk6/HN5vfC3va50/MA/Pz90djjo7LKp7LIY2l5UkVaipSqn6/Euc3jxdDdAKGgp5yntpCdspyjtFFWaC8uQSQtRUNLY4CTstHW3wCZoKqlr7uJlKSbobA8PEovKjonJjYhJTp+iJjCytUAgYiUbXWAbXV/d3+NPUFMNzxHAAAAGh0tT1NaWGNxAD1PaSs8UlhdbElVaRcYGTc7SQcAFR0eIxEfKx0vKUyEdbwV9zcSAAAAAElFTkSuQmCC',
      alt: 'Orange house map'
    }
  }
} as const
