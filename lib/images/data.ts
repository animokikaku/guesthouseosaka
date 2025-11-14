import { blobUrl } from '@/lib/utils/blob-storage'

/**
 * Image data with paths (URLs are constructed using blobUrl)
 */
const imageDataRaw = [
  {
    id: 0,
    src: 'uploads/apple/maps/0.jpg',
    width: 669,
    height: 715,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAKCAIAAADpZ+PpAAAACXBIWXMAAAsTAAALEwEAmpwYAAABI0lEQVR4nAEYAef+APz7+8fHxaSjo+Pj44SEhE5OTjQ0NNXV1cLCwgD9/v6hp6V0c3CsrKyVlZWIiIhQT1D////29vYATCgze2pumZeYoaKirKysi4yMLCwp2trby8vLACIAADsTH3ducFxgYBUPDDQyMUlIR8vLy97e3gDc3d20tracnZxiYmIQCQglIyNlYWKsrKzCwsIA1tbWZGNkgICA2tras7S1pqenfn9/yMjI4+PjAPHx8Z+fn2tra1paWpWVlWJiYgMDA6enp7CwsAD////////29vaamppnZ2eHh4eEhIOwsLDQ0NAA////+vr6////8fHxvr6+aWppGhoXc3NzhISEAP///////////9DQ0L6+vqOjo05OT////8vLy8bvpgvJ7xwZAAAAAElFTkSuQmCC',
    house: 'apple',
    category: 'maps'
  },
  {
    id: 1,
    src: 'uploads/apple/room/0.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AFZLJvbdedi6Xfzfff3ijfHWhevIc+zLddCyYrOUYgBxXzDUvWIyHgC5olbz2HjgwGbuzHr534rdwne3mG0AeWk94slsGwAAi4BJ7th+0LVe6tSC//6s6M6Gu55+AHppPOjNdldHEcKybNa9bWhIBdG6bfPensuyeMSojwByXzP/8Jn/3X7+3H7MsGJLMAO5pm/Pw6m3n3vEq5YAY0cV98Vj9MR5//Sswax0bUAAlnRMm3BbtZZuwq2dAHFbNv/9wv/764yIjJWKev3lsvnnw//uztG2ibWglPQ0gUMp3zk5AAAAAElFTkSuQmCC',
    alt: {
      en: 'All rooms with wood flooring.',
      fr: 'Toutes les chambres ont un sol en bois.',
      ja: 'すべての部屋に木の床があります。'
    },
    house: 'apple',
    category: 'room'
  },
  {
    id: 2,
    src: 'uploads/apple/room/1.jpg',
    width: 1000,
    height: 742,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AEY8Eo+Nbaqyp7TAuLvJvrjAsp2jjJSYcFpUMBcAAABNQR2MhlxHTT2cn5SvsJ45Qy5bYz+zt5RbXDcoIQAAUUcsi4doSlZN6e/z/f//T21taXNSxcu2VVMzMzAPAE5GLISEamN3d8XS2r/N111/fo+ZeMfOwEJAICkiAABKQSdoZ01AVVbb7fXl7vR1iYF6dlWpsqNHUUcSAAAAQDUZk4x7UWNnhZ6rsr7E/v/97OHWua2fmqWVXGFXACodAJ+Hk8ze5+bw8KevsUhLRFpZSnFpU3l7YF1fSW3kZo0oponZAAAAAElFTkSuQmCC',
    house: 'apple',
    category: 'room'
  },
  {
    id: 3,
    src: 'uploads/apple/room/2.jpg',
    width: 1000,
    height: 679,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AIhvQJJ5TaeOaa+adrOfedzJqs6vf8OQRf/JXv/rlwB3ZjydhWC3pom7p4Wzmmb//fbS0LS3s4Xpvm52SQ8AgHRSrqCLysW91tG+18inhHhUvbmU197IZkkjMxMAAIV3V6ueise9sMzApM24j4ZyQauhcb6+nU07IiQQAACEeFaklHjDtqbEr4m7nGC/pnmcgVd/Yjw0HwQVAAAAf3BMkXpbnop2ootwoodh2r6Oq5R+jXllTjYaFQEAAEUsF1k7GpJdJKBmKaBrM72ZaaqIXZx5S1kzDCELAPkiakaWcFz0AAAAAElFTkSuQmCC',
    house: 'apple',
    category: 'room'
  },
  {
    id: 4,
    src: 'uploads/apple/room/3.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA30lEQVR4nAXBPUgCAQCA0Q8CkSAJ9NBNc5EI8UAk/AtRCEQzEToHFavBvCH0jq4TwpyaGqWkXK6ppm5qaGkSFBEscm1raBcCJ32Pcx+qnZYLXaC5xsEGEQfcZzGTvOf4OKK/gyZy7IdPme8i8xeWS/OnQz9PIwpTmd82/6a4mNT+2jxX6WRhUOarwUxlmGdcoHtIr+bkNc2bxKiFKWGIXO9haEFuw3QLPJQ4E9A3ae7ydBmj7uUiwuMpSRsn61S2MfR9EnAVZ3RD2kMIcm7ulBRxC2ErSgLJRwBiLuTM1grEGj2aTFy3LwAAAABJRU5ErkJggg==',
    alt: {
      en: 'All rooms have toilet, shower and bathtub.',
      fr: 'Toutes les chambres ont des toilettes, une douche et une baignoire.',
      ja: 'すべての部屋にトイレ、シャワー、バスタブがあります。'
    },
    house: 'apple',
    category: 'room'
  },
  {
    id: 5,
    src: 'uploads/apple/room/4.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ACsTAM2xn//36Pro0Ozdw29dR2xfQn12WsKleuOyfwAsEQCagWLFtJDr27S0qI+Wak+PeVmWkHKMblGidk4AOBsNVFlAaG9B/uzMoZaBqItrkX9jrqWHinBUonNMADQYCUJLMXF4Tv/23qqci6ePbIJuV7Glio1xVotdOQAqEgBmZlOckGf83r/j1seXd1NgRS6Ad2B8YEN6UjMAHQAAua2q////997A7tK02MewqJiFZ1pIW0AoXjwiABsAAJ2aoKenrnVmWpiCadvHtMy3q6aRg1w/KVAzGRFHaleNhr/5AAAAAElFTkSuQmCC',
    house: 'apple',
    category: 'room'
  },
  {
    id: 6,
    src: 'uploads/apple/room/5.jpg',
    width: 683,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/ALaaXP399f7//sW8h1tLAJuJMfDQiQDGp2n08+P59ebSy5zRzJ7SxpDty4oA176Oa14yKBYAnItJ1M6f1MiY47h7ANa7iF1PACkOAJR7Lsi/hc/CjdStfQDSsXFwUgBsTgCjiz25sHnWyJOngVAAyqJehGctUjsVdlkUVDwAiWwsj2s5ALaJKd/FmsiveWJGGU8xAEAkAG1SKACtlGLkzJ/Cp3t9Zku1lG1cQBOBaEcAhlMP6tWy0sCfeWVGn4NfUzQAKAAAALttAN+5ieTCmq+AP4laAXA9AIpKAq1iapVQXU6FAAAAAElFTkSuQmCC',
    alt: {
      en: 'All rooms have kitchens.',
      fr: 'Toutes les chambres ont des cuisines.',
      ja: 'すべての部屋にキッチンがあります。'
    },
    house: 'apple',
    category: 'room'
  },
  {
    id: 7,
    src: 'uploads/apple/room/6.jpg',
    width: 857,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAKCAIAAADpZ+PpAAAACXBIWXMAAAsTAAALEwEAmpwYAAABI0lEQVR4nAEYAef+ALy2oYN9aXBoXaekl/by6IaBc6iilcXAutfU0AC+uqSGgW5+d22ZkoPLxrmUj4GyrKHLxsLc2NQAvbujiINwkouEh31sYVpMiIN3tK2jyMO/09DLAL28o3hyYnZtYG9pXVtXSYaCdrazq8vKxpSMhgBxcVpfXUxKRz1JSEBkY1aDgne2tK7HxMGnoJgAnqOHZmdObW5ooqOdsrSykZKOlpSMwMC9op2YALa5nj9CK4+Sjff59f39/J6foYF+ea2urpaSjQCeo4QzNh5wcm7u7+zv8e59fn1mZWKOj497d3IAjZN3IiUOUVVR2t/a4uTibW5sNjc2YGRlXlpVAHV9XwcHACsuK7i/ucLHxX1/emhpa1ZYWzYyLvSrlMI/s7fPAAAAAElFTkSuQmCC',
    alt: {
      en: 'There is a washing machine in the balcony.',
      fr: 'Il y a une machine à laver sur le balcon.',
      ja: 'バルコニーに洗濯機があります。'
    },
    house: 'apple',
    category: 'room'
  },
  {
    id: 8,
    src: 'uploads/apple/common-spaces/0.jpg',
    width: 1280,
    height: 1280,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAABQUlEQVR4nAE2Acn+AK9oAtqaPeusXNi2pHBecE1qtgZw5khjaFxgZVhcdgCxbAPgoU//yHP/4KfEpJp+X39ahM2CgVVpaj5iVmEAt3AD6rBR//m+9//7+fHniXV6oJeuxKK9VFQ0Tk4zAIJCAKpnFcWiZd3NuvnpwJR3YEA8SodyrGlYVFVUOABWMyGjalCKRgO9jFjRrHZ+X0k4PhgrPEdUVUdMRkkAIhQQlmlh0HRSoHlun35lWE9COzgZN0YfHycGKiUtAAkAACMRB00yKDofEks1CwAGACEcC0A1FSwdBR8bHgBcLiEqJiiqn6eQfnsgDgYFAQEBCwAPGAAsJgAmJQEAcD88PyYeLCAePCkqWTUrMBYMGhUPIzIVCiQAEh0AAF02OGI5NSwaGRoQETcgG1MvJUAjGjcuHx4oAwAWAJJEZbULqZdxAAAAAElFTkSuQmCC',
    alt: {
      en: 'Rooftop',
      fr: 'Toit-terrasse',
      ja: '屋上'
    },
    house: 'apple',
    category: 'common-spaces'
  },
  {
    id: 9,
    src: 'uploads/apple/common-spaces/1.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA4UlEQVR4nGP4X6H6f7bu/0b1/0lK//cm/v/a8v99wP/dpiCuqxTD/2zl/wv0/mcp//eS++8sC1J6wOz/In2QeJAcw/9Q2eseoj88JK+5yH6zE/8frfDNVeJ/oNz/dOX/oQoMj53EMtjZr+sLvg2TuuYk8t9Ycq8s7yYp7ivaAg9sRRliWdky2NkXiXPNUedq0eOcqc71TEN4nxxvvhhHFAsrQw4H+xQxLiMexiBx1mBuVms+pvWS3BeV+Y/I87XxczL4irPq8jEKMDCkqnAUaXFmaXJ48rHkcbJPEeYKY2EFAJfsTAOGuD3BAAAAAElFTkSuQmCC',
    house: 'apple',
    category: 'common-spaces'
  },
  {
    id: 10,
    src: 'uploads/apple/common-spaces/2.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA20lEQVR4nAXBwUrCAACA4R8ZBILooVBkMCEXEoEMZTo0m4HUpki41iGlPBhBUyG66cmDkIggSIeo48CDDKGr4KEHCLz6GL2Afh+73b+3mHafSvMqY4Vtz3+rCp1cqC8LM+uMlTcajl6rmvgZZ90veuXDPDyEcQQG8gFGSipdqtmYz7V9m7/e76SQhfsALYE3QNO1gm0lxdAHuFe8n5CHGtxBF1AM4/y5fSxFv2EJA0hAGUywAflCV+uPgfCRAQ24hiDocAMtQEqnT82KGPF/NflxWL+QipCBOgxhD0KUMVDrFOYZAAAAAElFTkSuQmCC',
    house: 'apple',
    category: 'common-spaces'
  },
  {
    id: 11,
    src: 'uploads/apple/common-spaces/3.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA0UlEQVR4nAXBvUtCURzH4c/vnJt4EMIcclFo0NZAaKgbQdIL1NDaGNQUmJd7hSBagmiIxqD+gztEBO1Be6s0lYNz9EJDIMm350ErpjX7jvnaQFder/vSsz7OdB+NE6O/y+cWP3MMK+jY6TbSYFtPs7r2OnLUi74xQezJCyh1unC6i5RHunTjzKiWQ/CU4QbUtd/UlNioZ3+Z6cBIS2RGO9CBwTwvdd7gEPZqPMRwDu8whEc48awGFo1JmIFpIG+xA5uw4GgUqAY6S5yukzRZnuIfyEZDBpA1/8EAAAAASUVORK5CYII=',
    alt: {
      en: 'You can enjoy the Apple TV and satellite channels on the large TV screen.',
      fr: "Vous pouvez profiter d'Apple TV et des chaînes satellite sur le grand écran de télévision.",
      ja: '大きなテレビ画面でApple TVと衛星チャンネルをお楽しみいただけます。'
    },
    house: 'apple',
    category: 'common-spaces'
  },
  {
    id: 12,
    src: 'uploads/apple/common-spaces/4.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AK1yEGQ8ACcHADscAE4yAbecX51xJQCtgCdEJQAwFgAlDgAiEQCfgTtiRRgAuYgAbVEAGQAAGQAANi4Am4ZGalIgAO20APvlPuXEAdSqAPbvxP767Gd2PgD1yi757278+pb88Wz///v38u5VVTYA+t5K/vyP+/Wq9+RD/v2M8+ODtmgyAO7OP+XNQpB0AJBwAMuxKu/RStyTAABqQACBYgBdRQA/JQB2XwDq0V/KoxwASQ8ATx4AdVwAjnMU2NCc++iJ36QtAEsbAEcAAEIPAGtOD+bcxfzsm+K1VmbXX/XjTgbEAAAAAElFTkSuQmCC',
    alt: {
      en: '3 gas cookers available.',
      fr: '3 cuisinières à gaz disponibles.',
      ja: 'ガスコンロ3台利用可能。'
    },
    house: 'apple',
    category: 'common-spaces'
  },
  {
    id: 13,
    src: 'uploads/apple/common-spaces/5.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ANiCI+6SJ/+nOf/pjP/7r/+5WeaPPFInDHY4EGcoAgDojSpyOQeQUxv3rWb/1Zz/u4LdkExSJQZ/QBptLQwAm2EfJwMAMQcAj1ZFvpOJvpWLuHxKTCICNwwAMAgAAEYaAEQeAVApEFo7LZ12XaN2V6xqNkYaACoGACcEAADkgyjukjOhVReobzDTfCSRPAOhVh1CGQAoAQApAgAAlyQClEgNQwAAn0IJwlsSwFIKqlMTNhEAIwAAHgAAAFAAAFcBAGkXAGUNAJ8wA+xzFKpJBiYAACQAABgAAE48QrqjTXiZAAAAAElFTkSuQmCC',
    house: 'apple',
    category: 'common-spaces'
  },
  {
    id: 14,
    src: 'uploads/apple/common-spaces/6.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AL2SKO3NdN2lJ++/Q+vCWf/+0JdrBgC7ghH74obNhQDViwD53ZPlwnObXgAA3qMi9M5j6Kc55aEq+t6Q1JQYn10AAM6QAPHEQfHEP/PKTPvjcue6NadjAADFfwDqsCP963H+7X343FX0zkWlYQAAwHcA1IcA46YM2JYA3JsA5qkXlE4AALNxALZvALtyANSQAKdYAKJKAHw2AACRTgCEQgBZIQCHQwB0NAChUQBqJwAAhUwAaikAPQAARAAAYAAAeikAVxMAAEYPAEMAAFcAAFIAAFwAAEYAADgAACHPWiMHP2u2AAAAAElFTkSuQmCC',
    alt: {
      en: 'Toilet with washlet in the lounge.',
      fr: 'Toilettes avec washlet dans le salon.',
      ja: 'ラウンジにウォシュレット付きトイレがあります。'
    },
    house: 'apple',
    category: 'common-spaces'
  },
  {
    id: 15,
    src: 'uploads/apple/common-spaces/7.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAx0lEQVR4nB3MvyuEcQCA8U+6/8Akg8GNFmW6zsagrAwICyUZDsfCZJBSd8UgBsPRYTK4gVJKitcgP0avG8TitVLEV97lWZ6ex33eOTssUWYl5SkfR9nfx0mvw55YZLTd2XxraaS5iwd+4kJ4X5bMqlPlZq0jKrbcrue22twRvg9CqHqb/q83ORnPHA/Y6LXANaE+EZIZz4Ni5uhrUM7pJk/EZ63z66JHPGWPWvqvMsQYV01eVhuTStZ+RokKh+ymrsg2l/2igj8iY0fW2fEQYgAAAABJRU5ErkJggg==',
    house: 'apple',
    category: 'common-spaces'
  },
  {
    id: 16,
    src: 'uploads/apple/common-spaces/9.jpg',
    width: 1000,
    height: 561,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/AOZ/Of+nP/+dHv+AFv93E/9hDv9oD/+kIP+/Pv/8cwD/xVT/tlX/khr/mx3/38X/rIjqWAb/pCD/u0j/62IA/81c/7tUy20Vm2AumrHdnIin6EIC/3ER/2sl/2IjAL9uMbFQF61iDbJQM7RTTm1HNctVI9BcF+MAAP8MBwCEOhyqYzrZgTn/b0L7Xk6HUUadWSiBURGAAACmJAgAunhA5611u0sb0kcAx0wAhT0AkTsAPBcAMgAAOAAAz3dVjjWzlcgAAAAASUVORK5CYII=',
    house: 'apple',
    category: 'common-spaces'
  },
  {
    id: 17,
    src: 'uploads/apple/building-features/0.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/ALdrI//6xfj3zd3Hk+fUqtTDk87AhwCQAAD/0qD/4L3W1KbDuIKvnmZeVDAAqgAAz3li+3hp/4FluppxHhkDDgAAAP82It+hcqSRQdtxV+6fgmRgMrOeXQD/Ry//zWn/+k//14T/za/u24T/+a0A/zEe/Hkhv4YcyXkk7rqY/+2e/+yqAP8rFMZDClw7AHY7AtyIabGZX62ETADREwa0TR+AcidiNgXWhmCHcko7KQ4ArQAAwW9G081+k3NAn2I97taY0riEAK0BC71qQNLRmM/PtdjFn/jmsP/mrtIhdQ3PjZT7AAAAAElFTkSuQmCC',
    alt: {
      en: 'We have an elevator so you can easily bring in heavy luggages.',
      fr: 'Nous avons un ascenseur pour que vous puissiez facilement transporter des bagages lourds.',
      ja: '重い荷物も簡単に運べるエレベーターがあります。'
    },
    house: 'apple',
    category: 'building-features'
  },
  {
    id: 18,
    src: 'uploads/apple/building-features/1.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AHZBJWY1Gok8GpNNHpRWI4tQJYdNJXdCJGk+JGxBKQBzQSQqCQcUAAIhFw4fEAYbDgcaEg0JAwIcCgdwOiIAfUUlaxEOfBIOVSwPhGMqiG40UDsbKRUObSIWm0MjAHNGJac8G/w6H9aLN//4cv/jcdqgTloqHL1PMp9BJABqPCPbLxj/QSOUOh91RyFdOx5jOCBiHBOgHRKgQicAeEAkuyUalCMXf0Qid0IddEYgYzkbUTQZZBMPkjklAFMyHX0oG10wGY9nLXdVJnJIIWpEHl84HSsUDV8sHfIhOgcUO2T/AAAAAElFTkSuQmCC',
    alt: {
      en: 'Bicycle parking space in front of the building.',
      fr: 'Espace de stationnement pour vélos devant le bâtiment.',
      ja: '建物の前に自転車駐輪場があります。'
    },
    house: 'apple',
    category: 'building-features'
  },
  {
    id: 19,
    src: 'uploads/apple/building-features/2.jpg',
    width: 738,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AP/WYf/jXv/bWv/SVf/OU+CbOJ5kGwD/22H/3Wj/1mP1qEDblTa3eidyRg4A/9Zc/92B//Sly34vqFUbbTYJQSEAAP+/S+iyT//mirVxJ5RDEGElAioKAADqqj+vfSvap0x2RRJoKANOFwApBgAA0JM2kGAdsX8vWzcJYCYBUB0AKQ0AAKxyKYBUFqd3J2Q5CWQyBEkiABkAAAC2ejB1SROWYh1qPg1cLwRFIQAaAgAArnUxhVYchFUafUwWcUQSXzoOQycGAJ9rMKpxMZxlJp5kJYpVHnNHGFs7E4AHUnBFn+iZAAAAAElFTkSuQmCC',
    alt: {
      en: 'Mailbox at the entrance.',
      fr: "Boîte aux lettres à l'entrée.",
      ja: '入口に郵便受けがあります。'
    },
    house: 'apple',
    category: 'building-features'
  },
  {
    id: 20,
    src: 'uploads/apple/building-features/3.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/APRpi/ApY/ArZfApZvAjY+4AVO4AVADdCk/kAADjABDpABrmAB3uAB/VAEUAy4uTrig6Kx8iSzs7YFddtK21sq+wAKqIkZkAC1YAADInHlJHSaOSltHHygCnbXozAABCAABxKyxbS0OfjJHb19sAxk5gVgAAJw4Ep3ZyrZ6XopOV5OLnANAOP3AAAFI8PbKIiszFv62jpOXk6gC0AT+deYK9ur7TwMPY19K7tLXh3+YAzMHJ5O7x6dXa8re67/b1z8zM3NveAPv7/vv7/P719vja3fj8/unp7Nvb4ECxdEcptaijAAAAAElFTkSuQmCC',
    house: 'apple',
    category: 'building-features'
  },
  {
    id: 21,
    src: 'uploads/apple/building-features/4.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AEJ9zTN2zAheuQBApjZ3wiptvwVat06H02eX36fE9AA7Q1Rpj8ipxfGDp96qwOyiu+qyxe2EqOGtyPKgoq4AOj1F293s+/v///3/8/T/9/n/7fX/vNT+6u36NjlDAF9lbtXb6cTI19DU4sDCzubo8pWbpn6FkoyJhistMwBLS01gYGJeYGZcVllRRkxVWF9cVUtdTztaTz81MywARUZRT01VPjs9MC4yX1ZVWE9JS05RUlljREtVLS0xADg6R0VETDgyNgUDAGJTSEo9MTkxKj09RUNLXSw5TkvIZ2JO3p/+AAAAAElFTkSuQmCC',
    alt: {
      en: 'The view from the rooftop balcony',
      fr: 'La vue depuis le balcon du toit-terrasse',
      ja: '屋上バルコニーからの眺め'
    },
    house: 'apple',
    category: 'building-features'
  },
  {
    id: 22,
    src: 'uploads/apple/building-features/5.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ALrS/wA6gXZ+lqOkrKeqtaenr9PS2725wXdYUK1mTAC90O5sd4l9hZF3eH4SAABPUFDHxMO0qq1KMCVWKhgAbIjCEShKVlxdi3J9XAAav77A//7/ubS2UzAjqWBGAEBgowAeYHJwcKagnxYAAi8aFm5WW4aAhDIAAGpKPADM2O6uuc7HzNbK0NGxqK+qoKe6rbCsnaSiko+jn6UA5/L+7PX/4eb009fm3+b02+Du2t7r1+Pu1+X01ePzAMTQ4cXO3sTK2cbM2svR3sHG1cLI18bM28TM3MTQ4vbdf8J1sn2cAAAAAElFTkSuQmCC',
    house: 'apple',
    category: 'building-features'
  },
  {
    id: 23,
    src: 'uploads/apple/building-features/6.jpg',
    width: 643,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAKCAIAAAAYbLhkAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyUlEQVR4nAG+AEH/AO3m2s7BsV9NQWRSPl1HKi0lGQD8/Pj///19bGJ9aUx6YjxiSSsA7vbs////joB3f2ZBiGk7aEwsAOXUxu/Y1J13cnhiQYNjOEcyGwCjcG+7en+hQkabQS9pVTAIAAAAr5yU+P3/lIF8rQAAbRYOAAMAAJmBdtHBv5JhXJEAEr0AAGYSBQB9XEGrk3p1OiZgAABiAABsAAAAaEYhimMycEogRgoAXQAASwAAAFU4F21IG2A/FkkmDzMNBE8AAL9kRzAp0du5AAAAAElFTkSuQmCC',
    house: 'apple',
    category: 'building-features'
  },
  {
    id: 24,
    src: 'uploads/apple/building-features/7.jpg',
    width: 1000,
    height: 510,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAIAAADzBuo/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAApklEQVR4nAGbAGT/AI6ekIWMfOr29sjXzcHLv5ypoMKkkP+6n/6ymLCDcwBOUUk1NjLS3divua6QmJSrmIX/j1z0fU69WDSafmwAT1NPBwMBoqifo6uin5iOv2A52mQ10GI7rEwsmXBcAExQTyEfGpSbkLa+tdza2tGbh7hZNrtkQctqR8RpRgC+w77z//q2vrLf6OD99vKunZji2tTImIewZkvHiXByy1gNMLVorAAAAABJRU5ErkJggg==',
    house: 'apple',
    category: 'building-features'
  },
  {
    id: 25,
    src: 'uploads/apple/neighborhood/0.jpg',
    width: 3497,
    height: 1794,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAIAAADzBuo/AAAACXBIWXMAACTpAAAk6QFQJOf4AAAApklEQVR4nAGbAGT/AN7gQdfXD+TmML3DdtDTcOXnbt3fafr7XPr9TfL3QABsenNWaGdfdXVthIN2jpByiox4j4tuiISNnZu9wLcAbGhLDwIAJSMOMSsaQjolLC4jKC0gW2FXsbu0///8AIV6YhoPACoeBDIqIGBMLykiDTYvI25wZ4aMjL68ugCuo6GQiIiag4J5fX6akpGVi4ipm5iup6aoqaqysrIcJkkLSdMN5QAAAABJRU5ErkJggg==',
    alt: {
      en: '24 hour open supermarket just by the guest house.',
      fr: "Supermarché ouvert 24h/24 juste à côté de la maison d'hôtes.",
      ja: 'ゲストハウスのすぐそばに24時間営業のスーパーマーケットがあります。'
    },
    house: 'apple',
    category: 'neighborhood'
  },
  {
    id: 26,
    src: 'uploads/apple/neighborhood/1.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA4klEQVR4nGPYsuvI+fNX16zZ8/TFm3//QeDfv38///z7/fvfn3//GRo7F0zq6SvNrm5s7Ng6e9alnWc+vPx84/7jM3fv3773gqGsaX5aVK67tmOMo395UERDaGZZXEV/x+RZ82fmFtcz6Jp7qai42pmH+fsG2xuZqwtJKHFymqtbeJvYerr5MoAAk6yQuKaQuKq0lKqotD6fuAq/srWklqOxXTiDkVuKhm24mK6ngLqbmKaHpK63mnWUjlOcvmuyrnMyg5xJEL+aC4ucDaeshYiqo6SWm6SWu6SOp7iel4S+PwBuBVMHnbTdQAAAAABJRU5ErkJggg==',
    alt: {
      en: '1 minute walk to another supermarket.',
      fr: "1 minute à pied d'un autre supermarché.",
      ja: '別のスーパーマーケットまで徒歩1分。'
    },
    house: 'apple',
    category: 'neighborhood'
  },
  {
    id: 27,
    src: 'uploads/apple/neighborhood/2.jpg',
    width: 1000,
    height: 622,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/AMXLx7mzn8XS5uXx/9Li/tLg+cbV773O7OTu/fr9/wDQyKqlnonQ4/q+0++Rhn61qJ/U6f/C0OnDydbO3fcAxLiVy8W3vcjSSUtUfW1oxJlyyL+21s7FfIqrAEWfALutiYV7ZkxGOkdHU2BYZaF6X5R8Xp15V4iAfn+JmABkVjpVPyErJRdcUTBiVD1lRC5vXklWRzEoJgEtLScASklFV0k1XE9LcFJIilpGlWNRiWJTX0M0FgAANzYoZYpguLAJfBEAAAAASUVORK5CYII=',
    alt: {
      en: '3 minutes walk to rotating sushi restaurant (kuru kuru sushi).',
      fr: "3 minutes à pied d'un restaurant de sushi tournant (kuru kuru sushi).",
      ja: '回転寿司店（くるくる寿司）まで徒歩3分。'
    },
    house: 'apple',
    category: 'neighborhood'
  },
  {
    id: 28,
    src: 'uploads/apple/neighborhood/3.jpg',
    width: 1000,
    height: 581,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/AMTFvbaEhlk1QX14hMCqtLeeqszP1bvDyPv9/728tgCfpqSqtraoqKanp6Our66pnJ+poKKomJPk1dDr7ecATEIycV5Jm5KLanN2oZyQoqCRYjYfdk86bmxnj46KAGVeUHhdUn9dU0AzGXJiSHxmWyoHAEU0JWZmaHV1dwBEOytYRzVaQidZQS91Y1x4aGVuYmJvYWRhWFtFQUIAQTs7VEpLY1xgZmJqbWJrc2pydGtyUTEwKhoNDgAAjt5Sl23L1k8AAAAASUVORK5CYII=',
    alt: {
      en: '¥100 shop just by the Daikokucho station.',
      fr: 'Magasin à 100¥ juste à côté de la gare de Daikokucho.',
      ja: '大国町駅のすぐそばに100円ショップがあります。'
    },
    house: 'apple',
    category: 'neighborhood'
  },
  {
    id: 29,
    src: 'uploads/apple/neighborhood/4.jpg',
    width: 1000,
    height: 581,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/AG6b3jWC3aK22P/twsi9ofPlxP/0zf/536OyzLbN9gB/jY9gmem9x9E1ODAiMT6/uKJTUkrPwqPd0bSkpaQAnKGJucLRybmWdHFmeHhwqpt7XFxRTE5OkYt6fG1aAGtsV3h4a6OAWls2EVQxD8OWU3A8G2pJKTYqGBYBAABZVEVDPCzQp2U2HwA4KxjkuXCicUaVb0NXSC41MScAi4Bqo5F42cCUnIpxppJ82ryOxKBruaB4wrSazcm+3UtdYuDm3KEAAAAASUVORK5CYII=',
    alt: {
      en: '3 minutes walk to a convenience store.',
      fr: "3 minutes à pied d'un combini.",
      ja: 'コンビニまで徒歩3分。'
    },
    house: 'apple',
    category: 'neighborhood'
  },
  {
    id: 30,
    src: 'uploads/apple/neighborhood/5.jpg',
    width: 1000,
    height: 639,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/AP3x7f+rgv++gP+nXP+qZv+maf+ibv+df//DoP+9lADw5t+3dlGGVCukUxylVSS2ZTSiUzeLSi69fUXxp38AxMC4wnlTs4pXrJFsw7emlHlco39Qe1Yxb1Mil3RXAKKalLVkP7iLXejDpP/79KSQer2mg5FiQqOIc5hkRgCJeGt/MQ8cAABpX1GKhXuDfXKnqKdKKhk0JhBfOCMA2tLQv6qozsTC7+fn7ejs3tre0tHWxL296ubn1NLaI25omy41TN8AAAAASUVORK5CYII=',
    alt: {
      en: '3 minutes walk to a post office.',
      fr: "3 minutes à pied d'un bureau de poste.",
      ja: '郵便局まで徒歩3分。'
    },
    house: 'apple',
    category: 'neighborhood'
  },
  {
    id: 31,
    src: 'uploads/apple/neighborhood/6.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AMHN3sXS4fL4/e71/PL2/fP4/fT5/QC9ydevwND0+P33+vz6+vv3+Pz5+v4As8HRnq/C3+fv/Pz7/Pz9+/z9+vz9ALrCxJOjsZuzx9ri6Nnc283OyKOnngCvvbuywMSrvshrfnlidleSnICio5cAr8nUn8TQaoOJOz81ABwADjgcS19BAJGqrlx4eERdWmhYRAAAAAARABUyIQAgWmFKf4hqiI5oVjsxMBkAJhYADwAAAC82co2RlKeqZIB5LFJFAB8cACkwAAAeMUNqfQpAUwAvQQA6TDZjd2CKogxwdTV2hZfZAAAAAElFTkSuQmCC',
    alt: {
      en: 'Namba PARKS.',
      fr: 'Namba PARKS.',
      ja: 'なんばパークス。'
    },
    house: 'apple',
    category: 'neighborhood'
  },
  {
    id: 32,
    src: 'uploads/apple/neighborhood/7.jpg',
    width: 1000,
    height: 662,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ALv3/7r0/8v//9H//83//83//83//8v//8f9/8H4/wCw5Pu26P297P6+7v/C7v+/6/+76/297/+67P256PsARJO9QJO9NY+6OpS+Up7HVZ/FYKjKVaHIU5/HU57GADhogTZphDhsijxykTJqjD9xh016iztviTNqhzxxjABLT0s9SkpgYl11dm1dY2Bucm15enJucWNwcmZ/em0AADBAHUdTMElMLkNEFzlDLDs6Oz42Nj0wR00+OTouACMLGhcADg8JHAAPKAAnRgA3VAorPgAjPAAlQgA5WkO3aLJSoQp5AAAAAElFTkSuQmCC',
    house: 'apple',
    category: 'neighborhood'
  },
  {
    id: 33,
    src: 'uploads/apple/floor-plan/0.jpg',
    width: 736,
    height: 525,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAr0lEQVR4nDXNkRbEMBCF4UB5X6BUygvUQrXQWCxPUKzVgrXBYHCsOFgsBoPFwdHi7jnt2Y//c68hImbOOU/T5L0HAFX9/plhGLqus9Z670MIAICIzKwPc11Xay2EsG1brbWU8nmklHLOprUmIkQkIu8gMyPivu+lFIOIRHTf93EcMcZa6xup6nmepu97a62IvC+qiojjOALAsixmnud1XQEgpeSc894752KMRNRa+wFR4HxdoLgQ0wAAAABJRU5ErkJggg==',
    alt: {
      en: 'Apple House floor plan',
      fr: "Plan d'étage d'Apple House",
      ja: 'アップルハウスの間取り図'
    },
    house: 'apple',
    category: 'floor-plan'
  },
  {
    id: 34,
    src: 'uploads/lemon/maps/0.jpg',
    width: 750,
    height: 592,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAIAAABPmPnhAAAACXBIWXMAAAsTAAALEwEAmpwYAAABA0lEQVR4nAH4AAf/AGlpaf///wQEBIuLi////7q6ul9fX/Pz8+7u7l9fXwBfX1/i4uIyMjKmpqbCwsKysrJ4eHjW1tbOzs5XV1cAUFBQVFRUeHh4SUlJX19fbW1tMjIxRkZGW1tbCQkJAIeHh2lpaT8/P1tbW7y7vMLCwEA/PcrKyvj39xkZGQDa2tpiYmJgX18WFBOFhoaTk5JVVFHOzs7u7u4yMjIAqqqqSUlJj4+PHhwcR0REbW1sPjw7ramrm5WVISIiAMLCwltbW21tbSIiIYyLi6qqq1NTUcHAtG1taEtMTADW1taTk5PCwsKqqqra2trOztFXWErT0Z/U1MhDQ0WfZnpHowtzBAAAAABJRU5ErkJggg==',
    alt: {
      en: 'Route map',
      fr: "Plan d'accès",
      ja: 'アクセス地図'
    },
    house: 'lemon',
    category: 'maps'
  },
  {
    id: 35,
    src: 'uploads/lemon/room/0.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AN7YkLavRszHaN3YgujimunhmdbFaMewQb6lM7ioRwDh5JjKyHPPynfRyGvNvlq/qTm2ojaWiDamo29wbCwA6fXF8/3X+PnK9PK3xcaFzcJpY10rARgAqsXgp6F9AOjwxebx1eTltuvvrLBpOsZ7Kb2fOmtxRLnItsW7gwDZ3Z3T4q7g6Kf//9XLYDiqHgDHu1P77KTw4pnq3JsAzcttwbtxuatpuLVskl8keDQAgno7k3xMzsCCvqpsAK+GCYFqAGB6ACNIABsjAB4SAAAPAB0tAExnFS4eAP2Ed8WjsXH5AAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'room'
  },
  {
    id: 36,
    src: 'uploads/lemon/room/1.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AHEvAKRhANeyGFAyE6GfpsLAx9TR2d7b4bS7z5mjuADQoE2dSQCETQBpRABOREaEgYq2pIbfy5bE1uKwuL8AtHozslcAhmYlgV4ylomL3vD/8fn/qbKax9jU1d3lALeRbd+ubIF6WFtEIrGcmHeUslh0Zp+ntNDW68jM0AD//ez19PPW1thySy6LcW2jq7ucq654f26FtiWYnosAp7LKop+lTSoGQhUAjmRHRCEAIRQAR2UCRH0AYlM/AH9sYDUAACYAAHNRT6uQgIJmVmlhXoWFhMDC0ZSPlUlCbbaPi4w1AAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'room'
  },
  {
    id: 37,
    src: 'uploads/lemon/room/2.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AODZk52HLsOvSNvHXObScOnahe3dhtzLdMi1Z7unVQDx867Ev16UhzaQhTGxpFLLvWCqn1HCr1fGr1bRxIAA4NKEzLuLbGZKAAkAipuUysq2ABcAl5tt9OOU29KKANO7eb1tR+KFRp+jdtHUsubmvo+AUdbEhe7YgNzNhQD3/8rw3qrVdDL/9MP457T28LLvvop9NwiTaBTZzowA7vav6M+QpygYf242sqBp1ceVfXdGXyEAlGsAgbYaAOryn8SdWZVeAFqhAEZgAD1EIx8sAC9IAJZ+AI1dAGzpdvGJ0byEAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'room'
  },
  {
    id: 38,
    src: 'uploads/lemon/room/3.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AO/qqfv53v//8/bzx+PajdzOdrqfJqiHFdG7ZdO+aAD8/Nf485/285/f24vY1H3s56Lc04a8oEjm2LPn4KoA+/zg9vSW8O6JwMyf6vPR2t3AoZNax6tZ6uW+36NZAPb7zfP0kfXuaJyVTsvbrt6SbKILAKeZLtvPf845AADy3ojowjLOsgCCdxitpjfUWCufAACZjyaxnCyvMQAAr44AdYMAKjgAHiwMDjwAYmEAxpBK1b9cwqM7q5EwAE10AASFAAYyAAASAFaEALK9V9zEcs2vWM6vW9WyX3FnezCrW02EAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'room'
  },
  {
    id: 39,
    src: 'uploads/lemon/room/4.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA3UlEQVR4nAXBMUgCAQBA0b845igN4S6pDR1CYIqYmBJigtUiiocgIkImSIIt3VCJiAaKKN7gULoV5CLCRUuLCC6ChTgIIRRNLhGc75E5oBqlEqZ4wlOWegQ5wd/sRv29WLZB3OXcSivGpMHrHUqJ0RXtnKD+eL6bIO4geegmmMp8PrDoMr9m/OxQ1aN/ZYOwidQ+l17MmzzmGSR5L7JQAqux/aMHexps4NrCr0dyM7ynfIobYjqkILjACwY4FjjUUvPx1UFJ0z+j4AQBzLANaROyn06IWwsvIm9xRCNrGaBHFxhMtPkAAAAASUVORK5CYII=',
    house: 'lemon',
    category: 'room'
  },
  {
    id: 40,
    src: 'uploads/lemon/room/5.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AM3YnOztm/b30fX40evsn+bdbuDbbNPNc8nBf6mqgwDU25Lo65jq7JPm5ITn4Gfd0ELbyzrUxEbAumF1fmQA4uey8fXQ7/OhwqYAoI4w3soQkmgAp5VFfoNXXGFOAPLz4/39//n/6pF1LmlUM97CAZRwAH1wZGlvWY6NYgD7/ev5++Lr5KV5VSF/bymfkjxyUAVMPT6FhVXOx38AjpGAr5RpjmU1XUkEUFMJCxEJMCkGRB8KbVY8fYFiABkXKFU1RjYeLBELGQUAEAkDDgAABh8QCFozKxMaHxTuauSoBFc0AAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'room'
  },
  {
    id: 41,
    src: 'uploads/lemon/room/6.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AIU9BlodAMRnENJ2Gc5uFpdCAKFUDACuTwKPRwBbIAB3MwDBehirWQS1YxMAwmMO14Ugnk4EwGoV/7k8xXUWxXEZAOCDIemTKKFYAcJxFPm5O9KBHdR9HAD/qzbplSmNQQDddxv/+mDnmyvciCMA/85J65oroVgB/8JC//hr6Jss448mAP/BQL59GCsAAHdCALRuD8qEHemVKQDanyuJVQBDAADbhSH/103WiCTijiYAwo0lgjUA6WMX/6U3//Ba4YYn14AmAJxfFrRQBO97If2YLv/CQtN3I8lxJd+DX9dCN4PqAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'room'
  },
  {
    id: 42,
    src: 'uploads/lemon/room/7.jpg',
    width: 1000,
    height: 664,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/APrUgqR+AHBKAJ92AMStLLOqMsC0R/HUhO/NguBzSAD42pStjDd9WACDXgCflEt9fACuqmD+3InVunn9xJIA/d2biG4uSC8AZUQAhGILcFwbfGwW9s1l4seJ//3PAPvZlaeHO4JgC8CUPa95F04zAGZPAOSyPr2sS//utAD935yUeT1qVBGEZCZNKgBJNwCFagzZpTLWu2//8LsA/t6ciG88NSYAIAAAOyIAJB4DPi8A06Uz4sB3/+erAPbXmr6UQpFiAItbCXpNAHlWC4NcDMaUJNm2af/fnfZxZjWt+L/BAAAAAElFTkSuQmCC',
    alt: {
      en: 'You are free to use all the tablewares.',
      fr: 'Vous pouvez utiliser librement toute la vaisselle.',
      ja: 'すべての食器を自由にご利用いただけます。'
    },
    house: 'lemon',
    category: 'room'
  },
  {
    id: 43,
    src: 'uploads/lemon/room/8.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AMTFp9rKi+XblOrkm+rmo+3tw/b36fj67e/w1NzkvQCrsJS2q3PYx3fn4Jrl3JPp5rHt7MXr7cXn7Mvp7dQAJC8tZm12ubGISltQT1RHKDU1gIRW9vbR+/z4///+AA0aHGlofd/at56md56ZcWxtZZGOgv//+5ebpYOAhgAADhtVVm+qj3qUYzZqY0eCe1inglHQsnZIODg4Jy8AAAAKJRQkf0sndWUOODoLaWsPkY8VdlUfPxcfMiIpAA8AEEg1HnR4HIOFGJuZG5eUHo6KI3FxI0IxHxoQHfF8a/V0iWbhAAAAAElFTkSuQmCC',
    alt: {
      en: 'AC and gas heater',
      fr: 'Climatisation et chauffage au gaz',
      ja: 'エアコンとガスヒーター'
    },
    house: 'lemon',
    category: 'room'
  },
  {
    id: 44,
    src: 'uploads/lemon/room/9.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AK+xn9rRh87CgsnAhKaYWYp/UsrKxwDHysr9/urj3p/UzYKrnELHwI/U1dEAvbmn7uKk5NmI18Viv69U5+fC0tLNAD5BJGJjMHRwLhkCALeubfP00NHRzABNRSh3fHOChmUYCQDHvH7t68zR0cwAr4Bn6L+V2MWGjl0b2syF6OjIzMzKAEU2Fi0nAD1NADsZAJqtRurixMfHxABKKgAZPQBbawCVOgCOaQDd3LvGxsUAbCkAtokAu3cAqUIApVMAy76RxMXLAF4kAKxgAKdVAI05AIEkAKqDQLzBw/MjcPSUlrC8AAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'room'
  },
  {
    id: 45,
    src: 'uploads/lemon/room/10.jpg',
    width: 635,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAKCAIAAAAYbLhkAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyUlEQVR4nAG+AEH/AP/cCP/zFP//gP//qv/2Ff7GAAD/4DL/6Q//3gr+wwD/1QX8uQAA/+Q4/+Ec/s4B/sQA/sQA+qoAAP/NB/3AFfuwAPmmAPqqAPeaAAD5owDxbgDtjgC9YQDQZQD0hQAA0okAQQ4APQQAMQAAhSkA83sAANiAAFQSAFgnACkAALRbAPJzAACWTgDknQDzxQBLGwCBSwDwaQAARRUAwXIA3ZQAilMAOiIAy10AAMZ2AGE/ACUbAFFRADMzAGQ5AHNBTmgd9GjdAAAAAElFTkSuQmCC',
    alt: {
      en: 'Bathroom with sink, toilet, shower, and bathtub',
      fr: 'Salle de bain avec lavabo, toilettes, douche et baignoire',
      ja: '洗面台、トイレ、シャワー、バスタブ付きバスルーム'
    },
    house: 'lemon',
    category: 'room'
  },
  {
    id: 46,
    src: 'uploads/lemon/room/11.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/APTFQPXOX/bVcfbSbPXOWO7BOue3HgD+zTv/1l751mL83HP92mT2zULsvSUA2IkA6rVC8MRC+dho/+WL/9xj/9VPAMhtAOXOi9bCWfrpqP/wqvHOY+/DRADVfgDCrz/b36f//vbYtWyRbRKVbAIA+LkHk4gnh4Fd4tWkxKlBrnElp3MqAO2vAdytAK54AJ6SOZl8SMJ8Jr57KgC6egDNlQBcMgBjVABxSw2fYRt4RAQAezMAdTEAbjUAaTMAVSoAiU4MSB8AAHQtAJuDAJmGAH1GAEYQADsRACgAAD1NamLXSLGTAAAAAElFTkSuQmCC',
    alt: {
      en: 'Kitchen with dishes, cutlery, cups and kitchenware, refrigerator, microwave, toaster, rice cooker',
      fr: 'Cuisine avec vaisselle, couverts, tasses et ustensiles de cuisine, réfrigérateur, micro-ondes, grille-pain, cuiseur à riz',
      ja: '食器、カトラリー、カップ、調理器具、冷蔵庫、電子レンジ、トースター、炊飯器付きキッチン'
    },
    house: 'lemon',
    category: 'room'
  },
  {
    id: 47,
    src: 'uploads/lemon/common-spaces/0.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/APn7+/T4+v///+zy+LnK3c/i8fX5/OPu+q/N767N7wD////4+fvV3Obl6vV4gpptan/7///R6/jD3vS20fEA/Pv80NbilKS9prHHYmp+QTZJjpSqoLDHuMrivsvbAKKiqJSjsI+brpifr1JZahwcLQ4UKzlCXIaYttLX4gCboq2irbmCjp2DiJdZXW4mIy4VESAhJzx4gYvEzNcAdn6LY216b3eCb3WDMTg+KSkxAAAADAscNTlESVReACc5VA8iOUtPYDVBVAkSGDMzQAAAFg0RFggbJRosJosccdpGYQ43AAAAAElFTkSuQmCC',
    alt: {
      en: '7 story building with 12 rooms',
      fr: 'Bâtiment de 7 étages avec 12 chambres',
      ja: '7階建て、12室の建物'
    },
    house: 'lemon',
    category: 'common-spaces'
  },
  {
    id: 48,
    src: 'uploads/lemon/common-spaces/1.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AFxQT1B2bnSalXllYHVlZ356hVxZZzw3PK6goefk8QBqYmCivK/K4dfEvbWqp6jFyNK0rajFuK//9f3s6vcAZF5fy76t7eHV1tHL2dna7Ojp0s7K9uPi/+Ll8uvzAF5aW4yEerCtp9nUzdLU0unn5NbU0/rm5P/j4f/7/AA/Oz4nIBlaV1WZmJejqqPBxb/EyMzGwMapjorfzMsAJiMmGhgZIiAgHhsbh4aKxMXHr7vJZG1+BAICHxweADY1QUtIVllVZjw4QD06Oz8/QisrLBgWFw8ODg0LDL2VdEdEWJlfAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'common-spaces'
  },
  {
    id: 49,
    src: 'uploads/lemon/common-spaces/2.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AI+Gfj00KjY2LjY0KnJxc36Fnnh2fAB8gIZWVk49QElSU1hsbXl2e5WfmZMAoYp6++HN7O7s6Ofo7u7u5uXl3NPHALSWg//47ubp5OTl5OLk6ePj5/fy5wCwnoTa3Nqoqa5SS1Onp6fg5e3QvacAiXRXqK+zkJSjJiIvjo2L4Obuspp5AGhbSePl4NfX2L7AwsTHzKKyx11tWAAqJCDd3t3a3NzK0NjF0N6pt812d3gACwkJwsvS1uj4y9/2wNj2orPHT09fAAAADl5kbXF6h2l2iFtofTdPWTE6Q76ofvnGiFwXAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'common-spaces'
  },
  {
    id: 50,
    src: 'uploads/lemon/common-spaces/3.jpg',
    width: 3888,
    height: 2184,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAACTpAAAk6QFQJOf4AAAAxUlEQVR4nAG6AEX/ANDJw3hpaqubm9jNyf/07cXk5UW1v0G1wkqHjnhwbQDx59+JhYOBfn6npaG6rarT1dTD2dqyycvEzMyfj48A/+TgrqOhqJeV4NvZqJqa4tXU5NjUyL67//n0a29vAP/r54RxcotkZs65uWBkaqqFguq2rN6vp+Wvp0A3NAD/9u+Gd3dlTlWtlpobJSSFZ2LLlo6/jobAj4krJyYA/+DTj3t4Qzc/fWxxAAQCYEhJqHp4n3RylW5uIyMkTkxsc0lVGrcAAAAASUVORK5CYII=',
    alt: {
      en: 'Laundromat',
      fr: 'Laverie',
      ja: 'コインランドリー'
    },
    house: 'lemon',
    category: 'common-spaces'
  },
  {
    id: 51,
    src: 'uploads/lemon/common-spaces/4.jpg',
    width: 1920,
    height: 1280,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAACTpAAAk6QFQJOf4AAAA5ElEQVR4nAHZACb/ABQtRDFRbnaEkMLExL7O3Nj//8H//6jx/5Pe/4/O/wCAjo9teYFzeXvJysG0o42jq7Sf3P+u6f+g3P9hnM8A5dKs/++sj39cs66Vr5xtl5dqP114aI62epSvfZ62APnZoeC7XaSJUMW0lLSWYM2tXH9+boyHcaKWTYCKfgCbeUltTCSEakSymWlJPB6Vd09BLydxXCq3nkY7MRcACwMACQYAWEolropdSTwabmEbPj0UJCERHBYMGxoDAB4XEI9yQqeETk83KDkuG1ZTD19dEyElCislHHppRm1oY9evEOQFAAAAAElFTkSuQmCC',
    alt: {
      en: 'Rooftop',
      fr: 'Toit-terrasse',
      ja: '屋上'
    },
    house: 'lemon',
    category: 'common-spaces'
  },
  {
    id: 52,
    src: 'uploads/lemon/neighborhood/0.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ANT2+8rt+bLBr7W/r8G5lb7Y3qXh9snQ1snHx8fHygD7///p9PZzczZaVQ9eWxh1d1TL3+3c3ePIxMR7hJQAwcrR3+DhbXZZFiAFSkglXF9Iu8LE7evt0cvN2NrfADQ9REpWYGp3eWBuXVBQRi8vMJCRkPPx89PT0cXFwAAdITEgJTdBR1V4fYM9PC8ZFRMAAApgYGbCvrKSoK8AAAAAAAYWIzNHNklgKzdKMDZBGCY7HCg5UFVgDCNAAAELGSAsPyc3TDA/Vi4+Vis8VTRFXzVFXDBAVxEnPk0HYRLAvLT1AAAAAElFTkSuQmCC',
    alt: {
      en: '8 minute walk from Nihonbashi Station Exit 8',
      fr: '8 minutes à pied de la gare de Nihonbashi, sortie 8',
      ja: '日本橋駅8番出口から徒歩8分'
    },
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 53,
    src: 'uploads/lemon/neighborhood/1.jpg',
    width: 1000,
    height: 627,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/AJ6015Sy4Iy06YOq5H6o5XKb0Y207HmdzYKn2pS57gC2tLLQ0dStv+Gbu+SaqsRggaODqtqgvufm8v/f6/wAvrWk49bHub7I0d/qkpeXP1JeJEZdgpqw9vT0/vz3ALCnirOjjWliWbuvm5ujojZGUDVFTYmNjHN5eYSIiwBcXFJHRkNMS0pmZmV7h5EiNkUkNUIwQUpcaG1FUlUAAAQZBRouDyg9CiM5BB41HDJGCiM5ByQ5CytDCi1HSGxcTCeGBlIAAAAASUVORK5CYII=',
    alt: {
      en: '2 minutes walk to a post office',
      fr: "2 minutes à pied d'un bureau de poste",
      ja: '郵便局まで徒歩2分'
    },
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 54,
    src: 'uploads/lemon/neighborhood/2.jpg',
    width: 1000,
    height: 627,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/ADRhmXin55nF/4W4/4O2/36y+IGy+Yi7+5C+/prF/wBVc5WmxO3G3/+00eamxeCv0/+w2f+02/+74P+y1/8AjJibn56YkX1ZfnUucmwkxMKvyt7y3+f08v//qr7XABwsGigqDTIrAFlWOIB8YJiSel9maEpPVXyCg2lxagAbLSEpOTMwQz49TUtRXl5GVFUQIxkAFAAAHQIAHgYAOkxTQVFWQVBTRFFTRFBVKzY1CxgNAAoAABcAABwAiS5VYEagGHAAAAAASUVORK5CYII=',
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 55,
    src: 'uploads/lemon/neighborhood/3.jpg',
    width: 1000,
    height: 666,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AI7B/2mu/12k/5vF//X//9bu/6zS//z//9/l+XOErQAxgtu+4v+23f9xqvSSwf+EoMOMosGRoLWVprkeTIYAACmMca/wXKHrYYnGp73ZlK3Si6rYdpW+eJjBDkaEAEZPYUBVaiI8WAkhNh8lKEBLWRg1VhEdJAAFHgAHKQAXM00YMkwYMlARLk0aNVBNYHIkPVcXLjwHJTwALE0AADNfADJcADBYAjBXBC9VACZLACZHAChPAS5SAC5SAAAhQwAhQgAhQQAhQQAgQAIhPgAbNwAYMwAYNQAbNye/UaP0TY2dAAAAAElFTkSuQmCC',
    alt: {
      en: '2 minutes walk to a supermarket',
      fr: "2 minutes à pied d'un supermarché",
      ja: 'スーパーマーケットまで徒歩2分'
    },
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 56,
    src: 'uploads/lemon/neighborhood/4.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AOPl7P/+/tLO0vv29/zz9fbv8M7S3c7V5M7g5JrX1ACJrMh+qbjF5+XY+/Dd6uKvurtgWn5ueYh/Y2ZyVH4ASWyAMWNzMlxpa6Sfcti6TKORAC8yGyYdeClKexNSACk6NFVngTU4Qjs8QVNQSo+RlU5NRxwWCSEyRX2StAAAAhQfNFAQJTwPHCoTHCUHFyUQGiQGGScGITghPWAAAAovABY0AB48AylIDSxKBCM/AB89ACJDACRFACtQAAATNAAVNAATMAATLwAVMAAWMwAWMwAVNAAQNAAZQM1zTIoADhOsAAAAAElFTkSuQmCC',
    alt: {
      en: '4 minutes walk to another supermarket',
      fr: "4 minutes à pied d'un autre supermarché",
      ja: '別のスーパーマーケットまで徒歩4分'
    },
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 57,
    src: 'uploads/lemon/neighborhood/5.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AP///+nn6+Ld4fv9//v7//3///b8+//87pqeo9HV2wD///+tnqi+vsjIztLu7+n87NHvt32QrVyBkJTX3OMAtbS3j5GJztTN2sWf5aZzynVci1hKAFJJY3R9q7TCAHNvd42jrXWBd1lORD08RCs0PRQsMDY3PTQ+TGJxgABNUGBYZXweN0EACQAvKCNLRDwhIR0hNjYjLDNQY3YAPllzNDM7IwAGAAAXGBcbIy4wW2NzdYKbVXSLVXubAHSKp191kz1ZcjxZdCAvQgAfM01XcH2AlDtbeR1cgQvFZ3pqi3/jAAAAAElFTkSuQmCC',
    alt: {
      en: '5 minutes walk to a discount shop',
      fr: "5 minutes à pied d'un magasin discount",
      ja: 'ディスカウントショップまで徒歩5分'
    },
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 58,
    src: 'uploads/lemon/neighborhood/6.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AEo1Q76bufPI5dexzJ6ElIVufK2OqABtXHN5X2j/8v//2vKDZnahiJa+pMIAqp+yZlhVxrW/69DfoHdsv5ecr4WVAJOJhr+iscV+ff+ur/+Eh/9zfr41QABtaF5+c2JoIBV0JSg4EBGngooTEhEAQ0U5LD0YCBAAKyssMSsdY1Y8hG5lABMWCiEjFpuDdigWGkArI2tUVWNIVgCHXk2bi2+orYk2OSsjHhlEPTAYFQ8Au6e7iYJ9Pz4iSRQTaBsgdUVIERAOACwoPV5VbINiZpsgE9U0G58iExEAAOYtVyppPCHRAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 59,
    src: 'uploads/lemon/neighborhood/7.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA4klEQVR4nGNYflv54vvez/9Pf/9/cO/T8o5DHqnrBKOW8wsnMcu7SzG0rJRfdz1i26P8TS8tyrYL+03hsW3i4Atj4nJjZFNmYNDWl0jqk7Xr4IxayJ86RdqzRETQn4nbkpFFhoFZmIHB1ITfK1XNIorLr5I9uMzFN8NZSJWBSZyBgZOBiYOBwdxIys5ezitI2jqQr3BKs19ChoAkO5sUE4c4K0i6qi42IsLE3F5V1kw5sDDXMSZSRldZXk1CQo6fgYWBoaI02tnT0szd0jbQ3ic9yiU+wszD2thSVUyMm4WVAQCtLDl/fNuTBQAAAABJRU5ErkJggg==',
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 60,
    src: 'uploads/lemon/neighborhood/8.jpg',
    width: 1000,
    height: 666,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AIFycqu83Huw63Ks6om27Xmx64zA76fS9Lrf+MXl+QDX0c/26d/g1dbY3urU4O+tyua+4vjH6/vV9/7H4/IAxb260LvEmXB8qpuUwaWm4NPU6vPzxdvmus3a8v//AHVxeUo5QGFbXhoZHxIAEk4/VmtdbIF2g4WEksLO2AAlMkIpLTxCUWwKI0EAGDkAHUQAGD0AGj4aNloALFUAADZgADFeACZVACVUACZRACNLABpHABhCABdCHSxZAAAZRAAYQQAVPAARNwAQNAAKMQAFMQAFMgA0YB5Nfj/NX+aLa4hQAAAAAElFTkSuQmCC',
    alt: {
      en: '6 minute walk to another supermarket',
      fr: "6 minutes à pied d'un autre supermarché",
      ja: '別のスーパーマーケットまで徒歩6分'
    },
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 61,
    src: 'uploads/lemon/neighborhood/9.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AKmSiLGObrqpn/P1+fHw8O7s7aeZmYVsam1baDgtOgBoTj+FalucfmXX1dT9/v/c2951YGCWfoKTeoCBZWcAd1xKPCgfhGlYjoJ/6+ztwa+vZU1Ni3V9inJ5aE5QADgmFjslGWZIMjwtKIJtaGVKRGZMRndcWWxLO0orGgBOJwcrGAgpFwQnHhZaQkIwIh4bFQVAJwmASRdjOhwALhkAKBgOGAoEOSgmTDk5Py0yEAMAIRkIgmA7eU8zABcAACYRCDklJzwqKkcvKmE3JzMeHRMGAAAAAFQ9NHfkSQ/0fHlcAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 62,
    src: 'uploads/lemon/neighborhood/10.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AMDY9cnf/MLZ98HZ+rLN9Zy/74+37Ymz74u5+Iyo0gCAnL7n9P/z/P/3///c7/+/2fmuz/efveZziqg+VnQAVXCReIOao6q73uHm9vr+5vj/2u3/e4CMY2hkXWBaAFxWR1ZccU9dcyMeLJWYqN3d3pKLf29mUUxCCDAuEwAxJCNAO0AuLDAMAAg6PU9iZ3IvMzosLC8aGg4bGxYAFSU7DiI4BhwzByI6EitJFS5OGC5IKjNDFyMyHCQyAAAYMQAYMQ0iOxotSRYiNxoiMwkVJx8lNB4kMhMdLBtBXRFoeIKMAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 63,
    src: 'uploads/lemon/neighborhood/11.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ANXj8cTL2uLw/+f4/9Xw/8Tk/7ve/6nS/57H+46dvQCnsbeprbmtnbK9nafv7fTt//+tx96gxOmtvdJuTjwAlJunwMLCjZuWVnCVyMnP8vv/jnmObVBiQjQuZEhCAI+Vobm5rIeMhGh1knF1hW9wb2FGTGxVX001KWhGSgBTYGZYZF9HVVc7Rk40OEJGSEc7NDoqHiY1MjgXBREAICcpHAgPFggGKxwXMCQhSD48OCskKBQJIhINAwEOACQuPA8XJhUbKxQZKRwiMjA1QisuOxwgLBgYIxYYJt7ZXGnFninqAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 64,
    src: 'uploads/lemon/neighborhood/12.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/ADs0MIx+f+LC3f/x/7S9y6KcntLLzQBCNi9WSUeqkpz/9v98bG2bk4/Ox8wAkXx6ZU1KaFZT/+3xhXJwiXp4gG1mAGA9IE40K2pXSbWUl5p8hW1bTm5bNgBULQAiDgBdSj2AZV2cfHqGbTyqhFwAYzwAQiQAUTIHeFpKf2Rdf29BnHdKAHE7ATgkEVI7JZKCgbCbn2dILHQWEQAuPHkMABWSg4bNxL+efYJKJik/PigAASVNXU1Psa2ty8XFj2lzbD0/VTsuAEZHT6+uscbDyMbDyX9qe2ZDUyYYI2doW+BtJIBvAAAAAElFTkSuQmCC',
    alt: {
      en: 'Walking distance to Doguyasuji, where you can find all sorts of cooking equipments',
      fr: "À distance de marche de Doguyasuji, où vous pouvez trouver toutes sortes d'équipements de cuisine",
      ja: '様々な調理器具が揃う道具屋筋まで徒歩圏内'
    },
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 65,
    src: 'uploads/lemon/neighborhood/13.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AJO7+5a9+aHI/8XV/tvj/+D7/+adxACew/6jzf/G0vPIrb+5xN/u///25+8Ass7/vdT2y7XBf32ThaXF4ODu4tviALa1ybqrwr6qtoR1glKJo5eIj5mFhQB/fpBTUV9+Z3OFcnEfbotFQT1AJBQAQENPCwYHXywqolNecUBfcD1BQCYKABULDiUAADoAAGIAHFgAC00ACx8FAAAHDBsREBoUDxoPDRIXGxooHB4xJCAAhoR8hoJ4cnFpf3ltnZSDnJSFn5eHANTNwMjBs8vEtsfAsamfi62jkLSsm117anNRhOPjAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 66,
    src: 'uploads/lemon/neighborhood/14.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AFuBrXh+j8re/9Lp/9br/9bp/9Ln/83k/8fe/8bd/wA4QVifpLXc8P/Q0NSyvNarvtXy/P/X6vva7v/T5/8AOClHlpq02trSpZ2ekZa5e5Ky/f7/7PL58vv/7/z/ACspPVxofp2UoZmbp4CVsldzk8jO3ff3+/L3/6KptgAuNDwuISs0MUZmdJJWXnxUX3mKiZakqbSIjZA1NC4AIBwpHhMkFBglDiQ5DyI2JCgvLC87HiQzODo8V1tgABclOBMhMxojMhYbKh4pPyIvRTBEYic2TgADFBAfMy5Zbr+TqAdXAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 67,
    src: 'uploads/lemon/neighborhood/15.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ANbArP/w1dnQ0F2b82Oc73qr9JK9+qjN/LrZ/9Dp/wCCdVn/+uSfv/BfnvV0q/mKuf2gx/u42v/L5//c8/8AlJFmw8PEl8r/ksX/bpG+f5/GuOD/xeb/0Ov/7v//ALm0nb3O5qPB5YGjwGFyfWBxeoOaq4aTpmJsf9Xb5QCDhIZscIJcW2I+ODxKQD9fVURRSUVKTlAeM0FRTVUAi4mDXlpUbWZVYl5NWVNLNjEkLScYJCEZIyEbCAMAAEhLRUhKMtXIrbisnouCejs5OQQFDQ0MChIQBgUHAHIpckZnbPp1AAAAAElFTkSuQmCC',
    alt: {
      en: 'Nankai Namba station',
      fr: 'Gare de Nankai Namba',
      ja: '南海なんば駅'
    },
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 68,
    src: 'uploads/lemon/neighborhood/16.jpg',
    width: 1000,
    height: 545,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAIAAADzBuo/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAApklEQVR4nAGbAGT/AG1BOpBnYb59YC4XFQECDxwQFg0PHgQLGS4+U19GVgD/7v+lgH3PqpNjTD4HDyRJLy5bd55txN9/2uZnU14A3sT0foWfimdNwqOAfYCuo46ira2qoP//esK7ZkJDACksM0NQS2BFJHNoTeTY1+bWzZeRak91ZkdSSSAXEQAxIxmhfVzFo5W0rp++0eb/7sC7wLpoioU8X1wjFg4Ly0SLhcKkLAAAAABJRU5ErkJggg==',
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 69,
    src: 'uploads/lemon/neighborhood/17.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AAAeTAAkVwAyagAxbgA1dg9CiBFFiwE5fgAucQAzdQAAPGkOR3sZUokzca8lXJ8fVZgbUZEoY6EpZqFIkMgAADVhEkx+E0mJH1SbH1SaNXO0TpLhTJDcNHWwHlmNADl8tRJNeVOV4mmr/2On/qz//5fn+GWp4mit2Dd7rgB+tugmbIqawvOPwfF9zOZelLCAg5RJZY8kWpRWk7sAmra4htLkT4yfO2+IXJ6jKVRQABUjABAkAA8nAAALABY9Vi5HXi1QYENpiSs8YBlAWQAHGA4JCzEmHQ4ADQM/UI9J51aOAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 70,
    src: 'uploads/lemon/neighborhood/18.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AMhoQdduNP6UQh4OBhIOBwgBAEY+On9saHh5bUw8LAD/u1L/o0r/zGUsHRMUDAcHAQBFPDCOqqZ6XVWbNh0A7pFY/+Bj/+10o4VfXEcrk1Y5qX1bt4BY71Ip/1UuAJhkZryGaf+0bf/CZv/cifOqgv94Rf9kMtBbJv9yOACySh2nWif5hjr/wFX/tV/HeTf/gzvPWiaSRBrrTCcArUwl94Q4/59H/6JH6406w24qzVwmnEAaMRQKfSgUAFQrGcRuKttxLrNYJJJLJHs+IncyH4k5I1UlFzARCDpEW5ig/VuQAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 71,
    src: 'uploads/lemon/neighborhood/19.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA20lEQVR4nGNgZOBgZOAGI15GBj4w4mVgZOBnZBBiZBBmZBBjZBCHIAYGRglGJllGZiVGZhVGZlUGRlUGRjUGRjYtRk4jBi5LRm5bRh5HRh5nZj5PBj5xbyG5BGnNEknlAlmVMgnlen+rUAZLDTdf+6zK7P4gx9ysgNY017AKTxUGdRExR3UFay3tDBfbWQlmG6rkN5dKMVgq8rpKsGcays3NCbvXqDk7WWRHiRRDT5hAtSHX7iCRL23qr9ss9szJWV7uyrA+X2qLu+CdBMn/eQr/96X9/3jo/9fTADAVMoveK1tcAAAAAElFTkSuQmCC',
    house: 'lemon',
    category: 'neighborhood'
  },
  {
    id: 72,
    src: 'uploads/lemon/floor-plan/0.jpg',
    width: 864,
    height: 664,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAIAAABPmPnhAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAiklEQVR4nD2OXRHAMAiDMTIT0zIBk1EDNYCBGogBFKAABVGAAnYru32PyeVH3H3O6e5mho2ZRYS7kxQAquruAOac932vtUiqKgD5cyTXWgAyE8AY47W7sKpIjk1EtPjaa1NVsamqzDSzXpF+0d7PdV1feUSQzEyS53mKiKoex/Fdy8xO+KaHuzkiHr6Ip1Agx7q+AAAAAElFTkSuQmCC',
    alt: {
      en: 'Lemon House floor plan',
      fr: "Plan d'étage de Lemon House",
      ja: 'レモンハウスの間取り図'
    },
    house: 'lemon',
    category: 'floor-plan'
  },
  {
    id: 73,
    src: 'uploads/orange/maps/0.jpg',
    width: 678,
    height: 664,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAABQUlEQVR4nAE2Acn+AP////Hx8fb29jQ0NB8eHqmpqfLx8f///8vMzOPj4wDXycDV0tG8vLvZ2tpTU1MDAgIAAAB8fHyIiIjHx8cAnHFcw52Sh3t3gICBr62rmpmVq6uqUk9QCQkIbWxsAPj5+K2srJKLjNHQ0OTh4sC+vsLCwP///4mKiJWVlAD///+5ubl/dXWtqqq9vLyPjo7Bv77j4+N+enzT0tIA////yMnJi4mJpKKiubW2h4aEgX17ube3V1NTjo6OAP///9fX16mpqba2ts3NzcXGxZGRkc7Pz316eq2qqgD////MzMyrq6vHx8fV1dW7u7teXVyGhoYvLyyJiIcA////xMTErq6u2tra6OjowMC+Xl1aeXl5Kiopo6OjAPT09GRkZFhYWIiIiJybnH+Af3d3dpeWl0dHRaCgnylKwDnIPIEjAAAAAElFTkSuQmCC',
    alt: {
      en: 'Route map',
      fr: "Plan d'accès",
      ja: 'アクセス地図'
    },
    house: 'orange',
    category: 'maps'
  },
  {
    id: 74,
    src: 'uploads/orange/room/0.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AMeRM8ORMcOTRMqjdeK8jdilWYVbG0YrAGNABuCkVQDftXnzxoHdrVjDkDPAlEfRqmmMajaAUAHEgSP/1ogAropa9tSk/+q78sqP/+rF/vnospJV/7w1/89O/9CKANGkZO7KlP/6z//vwNzKtsG5nlNBJiMAAL6ALv7GfgCScj2qjmL/4aqBZD1IMxpcQSM7JwYjAQB/Vxn4wngASDkOX1kDXU4fHg8AKiQAhW8Gdk4LJw4Ac00T5a9oAGJlAIWKEGBlACooACktAFBWAIFQBdKPG4BUAKqBQ3SiY/JtsfOxAAAAAElFTkSuQmCC',
    alt: {
      en: 'All rooms are set in traditional Japanese style.',
      fr: 'Toutes les chambres sont aménagées dans un style japonais traditionnel.',
      ja: 'すべての部屋は伝統的な和風スタイルです。'
    },
    house: 'orange',
    category: 'room'
  },
  {
    id: 75,
    src: 'uploads/orange/room/1.jpg',
    width: 1486,
    height: 1102,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AJ2vuZmZiWhVNlxLMot9c5+QgW1bRVFEOHt4eJ2bmwCVtc+53uiUg2VsWUXb6Pj/+/+FcV2fj3S9xMiur7YAdYehu+n9ioNwaVVA0MnN28vEiHFbqJ2NucfYrbS+AEtLVKSwsE5UVAoCAmJUQomCe4B2bpaUj5+yxZCbrABURzmHhHBjYFVRUVaTn6q+v8Wvtcdqb3dIUGA+PVMAiX1heW9JkI5ug3xdqqiggHx3bGBXOzg7FBIaIh4yAG1cOnpxS4SLc5aTerK0qYGDdmhgRyksLggFDg8MGHfBZoCMDvqfAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'room'
  },
  {
    id: 76,
    src: 'uploads/orange/room/2.jpg',
    width: 1000,
    height: 636,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/ANG1crGLJqB+HMCqbaaHPVszBIVUAO+9aP7fr/jdtAD/78Tp2Kze17v9/eampYyqkQDtwwD/5Z7/67v847QA9+Wx/e652tbM5Obam6mnRCYA1aQA/9qU/eOv+d+uAPjfnJ6CWjsnHl5XTH11ZS0AAHpLDf/bjfbco/XbpQCtj01FHQAlFgBBPCoyJRRrJwCaXwDEn1L73Jvz1poAy5IA5LYaiWIAtm0AZTcAg1YL/rwAwoUApIFA6ceMwg9kmey7vFUAAAAASUVORK5CYII=',
    house: 'orange',
    category: 'room'
  },
  {
    id: 77,
    src: 'uploads/orange/room/3.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ALOkX9fLn7+pX8qtZM2ygdGzddevYNSpSNqpMI5mCADn59Dg3cXJvoaEbzeZdSfOqlPnx3vsxXrru1u0hykA/f/r/vzrr6+LkYZS5rRN/9+f+ui7++Ot8c9/poAzAM3Loe/qz7KbaG5qPqp/Lf/qrvjpvfvpr6aJSzIUAAB9ck+tmnaKckdgUCdpRwmYdTvGpm7s05SMczsiAAAAjHg2jIAkPksAQTwAblUAc3wAn5sAsp0gjnAXGwAAAFRjAEVcADhIAFFjAIqdAIWUAHKPAJaWAMWaL39iBi2+bNGZRc7XAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'room'
  },
  {
    id: 78,
    src: 'uploads/orange/room/4.jpg',
    width: 663,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/ALWAKJNoJK+Wb//95v3t1/PYsJVsMwCzexuteinOnVX+5sX/8ebHmVq2gSsAyZY6wp1dz5o8uII9s300uoQevYkdAOvcxe7buaWHTGc+AMSGF+auTu25awD/9dv138B/cE2jfQ3/y2r/3Z3/3KMAjXFOsI5pZk0nPx8A2ppH/9qX/9ucAD0hAHRLDjciACQAADgTAMuTOtytaAC2hxzjrDNbOQA+FgBrPADRkxDOiQAA6ao6/85tknEmuoMp/+h3/9R17LZPAPGsMf/YbOS9a8GiWv/ni//ggf/ceBIndGmxLQmsAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'room'
  },
  {
    id: 79,
    src: 'uploads/orange/room/5.jpg',
    width: 1000,
    height: 657,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AK2BNbeKK65/QMaeg//69t67ociPUreINMaXUdWqfgDptnzWpF6odxiyeS3UmmDEjEyveyPYp2T1y5/uyqMA+c6Z/NKi36NUrHg538m2wptbvYpB7MWX/9208MygAPDEi//XoLCFUIdiQfnr2tSwe82gXbuZaf7aquzHlwDvwYP0xIhoQRxVOSPmuYfFm1aqiEqdgFT+05fowIsAx59dnWknRhIARjEnjnNnp4U01aMrkm8m3bJzy6NpAJVfAMR4BVQlAHY6AINJAJJvGfC1JOGhGJduFBsAAEMyday4oDW8AAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'room'
  },
  {
    id: 80,
    src: 'uploads/orange/room/6.jpg',
    width: 1706,
    height: 960,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/ANHQ1JWUkE9KQK2lp7eml2dfUHBtYpmRgpuShJ6VjADU0NKsq6ptbmn//Pr+9vZyeXiSk5C/v7i9vbWblZEAzs3Ls7Oza2lmm5CQtrvAjZSXrq+rxMO9t7aykYqIAMrJyLCtrU89Pl1PUqCSi3JoY0tHQ3dxbqKdl6SdmwDAwL64tLI1KiuBbmuAamc8LCUvIh92cG2yq6NjV1oAsrKvurm1Oislo4mDqJONaVBIW0E5ZVZRn5mSEgACf8Nhngv+uM0AAAAASUVORK5CYII=',
    house: 'orange',
    category: 'room'
  },
  {
    id: 81,
    src: 'uploads/orange/room/7.jpg',
    width: 1000,
    height: 750,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AMvOwJ+fkYB/eebt9ejt883LvsrJttjbzdjbzMnKuwC6vbGgo526vbr3//+ioKRsUzaMbUqUgWOqoIq/v64Ara6hpq2mu8DHsL3Yi5W8RzE1PikYYEQnWEMpnZ2LAJ+ik5ibjpeYmIWTsn5xiE9GUwAAABgFAFZLN6CikQCUlYaeopSKi4R4gps/RFkqKigTERMmGQ1lXkqdn44AdnRoU0M+XU1Ge4WdPEJcQz88NSshMiQWdXBej42AAC4ZFDQXEkQkHFZFSDUcHh0AABMAAB4RBWVjVn16be9MX/S0ln6bAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'room'
  },
  {
    id: 82,
    src: 'uploads/orange/room/8.jpg',
    width: 1000,
    height: 660,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ANa2kfDRrf/pyv/ry//rx//y0v/vzujIpNe2kMuqggDbu5Txz6X/4r3/68X/6sL/99D/6r7Cn3jYuZPProoA051f2pdL+rt4/82K/82J57aK0KJvWDkWrXk8z6RxALh9NMSCM8SMU5xyR6+BTceql6qZkGFOPINcLopMAQCfZRuSXB47JAsrFgAsGQGNfW1jVkxHNiJXPSRjKwAAhEYGOBYAIg8AZEIdPiUOWEg9Pi8hIBEAIwAAaDEAADsYACMEADMdA0EqEjwpGlhHOB4JACYTACkOAGAxA+WaYP/oSXXfAAAAAElFTkSuQmCC',
    alt: {
      en: 'Each room has both water and gas. There is also a gas cooker.',
      fr: "Chaque chambre dispose d'eau et de gaz. Il y a également une cuisinière à gaz.",
      ja: '各部屋に水道とガスがあります。ガスコンロも設置されています。'
    },
    house: 'orange',
    category: 'room'
  },
  {
    id: 83,
    src: 'uploads/orange/room/9.jpg',
    width: 776,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAKCAIAAAAGpYjXAAAACXBIWXMAAAsTAAALEwEAmpwYAAABBUlEQVR4nAH6AAX/AO+3cfW8dOu0c8eaZf/YnPzEfv/no//OigD0u3H9xHzmr3ONflv52LLbo1nnsmX/26wA5adb8K1Z3JRFiHlS6rRm6p8y8a1l/+vPAGE6B6NWAMJjAIBxVP/Lg//DeP/1vv/duQBNJQCMTga9cyhwVhfRrUC0ikCNXDXzxqAAUS4ClWMmsXw9kG07woMohkUAOAAAoWZAAEYpAYFUGZBeHF5BK3U/JY0lAJIpAH4kAAAlEgBoQw+KXyKJXSBuSxZQGgB7HABxGwAAOyIAXz0Db0kOmGomlmorOR4AVgkAaxUAAC8aAEAlAFY1AJNoJKN1OFU6DycAAEYCAHhPZyz/mN/TAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'room'
  },
  {
    id: 84,
    src: 'uploads/orange/room/10.jpg',
    width: 1000,
    height: 710,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AGRPAJyUXZBzBGRIAEsuAFM1AGI+ANCaMdOpR8qlSgCUjmSUkmaooXeSg1uAWhtrPQCvcgD2vUfit1XWslgA7v7/9f//7f/8zcy23p8N/7UZ+7If87tK571e27VdANLi2KKvrmZ/h6+umjcJAGg3AOKaGuW0Td+4XNa0XQDCzsApLCYABQVhXE87GwBHKACichXltlTWsljRrlcAVExBJQoAKw8APSYaQyoAUj4GmnEh3K5Q0a5VyqlTAGhdNHhpPHxtRW1hOWJIAFQ6AIpiDc2jR8mjUMGfTtI+YDF3A+GJAAAAAElFTkSuQmCC',
    alt: {
      en: 'You can use the closet as a desk as well. There is a lamp, bookshelf, and multiple wall outlets.',
      fr: 'Vous pouvez également utiliser le placard comme bureau. Il y a une lampe, une étagère et plusieurs prises murales.',
      ja: 'クローゼットを机としても使用できます。ランプ、本棚、複数のコンセントがあります。'
    },
    house: 'orange',
    category: 'room'
  },
  {
    id: 85,
    src: 'uploads/orange/common-spaces/0.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AJxDFtVcI+9jJ/+LNv+YPP95Mf+2Rv+VO/+INc51KAApCQAYAABPGgZ4Lg14MQ1uLAyDPRF5Nw4iAAA+JA0Ay10hiDwQVR0H6XMr/5k9/6RC/9BRsnUmq4pL//ytAIw7FN1kJbpYHa1cHN5rJ/+ONtqALfGVNv/GTP+3RACUQhJ2Jwx2Qg/OkTGVUxd8RBPEfCjOdijQXyLXdCgAIwwAEgAANhkBaDEMXRwIXBkIdikNY0IOvI0tx49DACUNAoctDicMABgGACcQACkSADAWADgZAkApB7ZWIAkYSTwirGJeAAAAAElFTkSuQmCC',
    alt: {
      en: 'Traditional Japanese style lounge. 100sq.m (1200sq.ft). Open 24 hours',
      fr: 'Salon de style japonais traditionnel. 100 m² (1200 pi²). Ouvert 24h/24',
      ja: '伝統的な和風ラウンジ。100平方メートル（1200平方フィート）。24時間開放'
    },
    house: 'orange',
    category: 'common-spaces'
  },
  {
    id: 86,
    src: 'uploads/orange/common-spaces/1.jpg',
    width: 1000,
    height: 664,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AMDN2Nj0/9Xt/9bu/8Do/5WvvdHVz87o+6nb/4rL/wC5lEvR5Pbk/P/k/P/c8Pi8spfBva/S5vTV8f/c8/8A1JsLxqhp1Nfc0tbem5CQZkY9ln17sa+y6///0uj3ANWaALyDAGhPOGxbZmZBQEw3MVZJV2ldWpWdnnmEiwDNlACgcCVUS05CWHc7NDxeV1NNSU9pZmpiT0VfSDMA2otIsqevSSMjWUE7amBaRjQvGhkfBzhWbGJPZjkDAKdxY56iqzcbFjw3LWRdTCksKwIDDhUsOGKUi09HKj8CbyjyITUqAAAAAElFTkSuQmCC',
    alt: {
      en: 'We were on a TV show by ABC, a Japanese broadcasting station',
      fr: "Nous sommes apparus dans une émission télévisée d'ABC, une chaîne de télévision japonaise",
      ja: '日本の放送局ABCのテレビ番組に出演しました'
    },
    house: 'orange',
    category: 'common-spaces'
  },
  {
    id: 87,
    src: 'uploads/orange/common-spaces/2.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AJRQEqFkFciILc2OOYpHFhkAAGg0Df+qK//3jv+0LgDNhyXjqDHgoTnWizDXmzm0fRuOWQ+5chX/qCv/pCkAkXJSomstrWkd1o8l86gp/6Mp4oYfl1QPkk0K0XoaAOO+fM2ROdaLH6piD5JRF82PH96WI6piD/O8Ob54HQCbfV5PJRGeXw7Jhxx+TQW4ehiqdyBWNwC7oDvltDAAhlQznE4biUYRjU4HfUwFilQIlmYOl1wMZAAAjyEOAHM5FYpDFpxOG5FDF0kfCEomAKQkEMgXGKMPFG8tENBPVMtme7oqAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'common-spaces'
  },
  {
    id: 88,
    src: 'uploads/orange/common-spaces/3.jpg',
    width: 1000,
    height: 750,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AGBKSUw4NDsrKjAmJisjHlFHO1pPQiUeGgsKCwkJDQCbfHiYfXZ2X1k1Ki1IPzhjWUdfVUk2LScODg0ODg8AzrWz//380sW7Sj03XlJBdGVQeGlTRD0uCwwMCwsMAK2Shta/rLqjhIt3Y39uXHBfSlVJNhQSDggJCgsLCgC+qYTTs3jOr3nMtpSwn4OUhGlgV0MICAgLCwsKCgoAuq2Pv7ORm4twjn5qjX1pf3FdNC4mAQIDDAwMCQkJAFxQQGBVRGZYSWVZTF5SRFRKPAoKCwUFBgoKCggICdfrQrVFMJ4sAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'common-spaces'
  },
  {
    id: 89,
    src: 'uploads/orange/common-spaces/4.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AKhfD9N/A+uWBPKhBfmtBvqxBvCsBvGvBu+pBfCoBQDCbQK4bQLUhAPyoQXypwXXfAPijwTyvAf1xAfvqAUA1HID13cDwG0Cy4MD7KMFzX4D6KwG7NKA7teT+cAIAMBpAqhfAq9xApxnB+ykBfi6B/3bH///4PvzwO6/KwDUigSdVQJiNQ1WMw+2dwLAfwPosgbXulHFp0jPfyAA4Y4E33IDZzcJBQMDlVYStF0D66cFY0YBXUQcr1wZAJxNDKBWEzYXAwMAAIhdDspxA85/A41YE5RfGMB3A7DgXoWxCy0wAAAAAElFTkSuQmCC',
    alt: {
      en: "The lounge is equipped with a large air conditioner, very comfortable whether it's summer or winter. There is also a sink.",
      fr: "Le salon est équipé d'un grand climatiseur, très confortable que ce soit en été ou en hiver. Il y a également un évier.",
      ja: 'ラウンジには大型エアコンが設置されており、夏でも冬でも快適です。シンクもあります。'
    },
    house: 'orange',
    category: 'common-spaces'
  },
  {
    id: 90,
    src: 'uploads/orange/common-spaces/5.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AOLIpN7Oqv/uuuzKlZ6CX7SYcZN5Xp13SpZxRYFgPACclHB5aDp6ZjngyJb/+L3x0pfKsYiJcFSEZEC1f0cAiIJV8daX/+yyvJ9gj3I9tJBawI5Tl3FEfFk2gVIlAFlTS2EmE6N5VbKTa7OOWk4wHhsOAVQ/I2ZHM5dxVQA2MywYAAAcBgA+KwlbQxlPLh10QiFiMxc4GApyUTMAfnFhWE08YlE3emM3eWI6gFYyl08le0EfPyYSRSkVAJN4WY9xUI1uS4tpR4ppQYZmPnZcN25SL2hJJ1c8HeETVqINtNt6AAAAAElFTkSuQmCC',
    alt: {
      en: 'We have a large collection of complete comic sets for you to enjoy.',
      fr: 'Nous avons une grande collection de séries de mangas complètes pour votre plaisir.',
      ja: 'お楽しみいただけるよう、完全な漫画セットを多数所蔵しています。'
    },
    house: 'orange',
    category: 'common-spaces'
  },
  {
    id: 91,
    src: 'uploads/orange/common-spaces/6.jpg',
    width: 1000,
    height: 664,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ANTQyaOZjqORgtvIuLyXi9u+rcOxoKiajNvWyv398AB5bF6UgG+jgW2YblaGX0eTaE+0iWytkoCPfnB2bmUASTQoUjkpUzosWj4vaUg2p3FLjFw4SzMnQDIoRjUsAIltUo5lUUcjFlEcFG1BOJNdQVIjEDgaEzUoIlpCOgB2SCx6YVbSp46VblWHZlCKYFGkak5LKRw8LiVaY2QAIwAAc3N4/+/RrWpSvmk8yotQgEw5VkQjAAgAOUAQABsPD2hXSenOrW9AKVcgBVsmE7WLb9/IpZ2Ic0lBHsefVnG6LomWAAAAAElFTkSuQmCC',
    alt: {
      en: 'We hold a party at lounge about every month.',
      fr: 'Nous organisons une fête au salon environ tous les mois.',
      ja: 'ラウンジで約1ヶ月ごとにパーティーを開催しています。'
    },
    house: 'orange',
    category: 'common-spaces'
  },
  {
    id: 92,
    src: 'uploads/orange/common-spaces/7.jpg',
    width: 1000,
    height: 664,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/APPcydi/sqeLfqOFc9C9xNrK0q+NeKeJe9bAs/LezQB9YEyfeF3KmnjfqoTLnn3So3/vtIbWonqngWCCZk0AaUgubkkrdkUdhEURfzwHdjUAgD8DfkofckspaUksACYAACoAADgFAFEbDaxgPLJtTY1ONDIFACwAAD0aAABtRjdqSDLIm5KqmJm4ppzNq5uKYlRzV1VXOy1dMg0AtJV3f4hLsL7Y9vv/vbOolWxicSslgG1+tamqfVY0AC0jGB4TBIV1cebNxrujmcOemuqJjMigm4iHhV1ZbSeOYdBirJZkAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'common-spaces'
  },
  {
    id: 93,
    src: 'uploads/orange/common-spaces/8.jpg',
    width: 960,
    height: 638,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AEtGQZyPg6WWimddViwgFykgGzEpJ2phW723tJyXlwCCgH1bWFRlXFKsopPfv57Ywqv+//+vr7KCg4ealZ4Aa1E9nIJtxaaKxaiPn3JZqXZWx7Km3NDK3NPNtaunAIpWL4lNFlMlFF4lE3Y1HYpUOoNROUQnG105KF9ANgB1RiNCFgAyFAiJiZO0tMbj19RmV1VgSEKadl8zGw4AJRcAGQAAVlJXpMvqosv1/Pz/oZmbbVhbpaSnT0tQAAEBABwVD2FYV3NoZX1pX497cpiGeH5lVldSVkZLXWPpXT/K0pbzAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'common-spaces'
  },
  {
    id: 94,
    src: 'uploads/orange/common-spaces/9.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AFMcAMpcENBqANZvANFqANZyANh1ANFrBsRmEIY9CgBQHADOYQTxmg78shfbdwDVbwDvlQzFawCfTQGLQAgAVB8A14QD/MQd/+Mn7KEQ6JsN4q8ZvY8LxZsarHkQAMN3AP/UJP/+Mv/yWf/LIf/OIdyRGNF9AN+dKMSIDwD+shjbmwu+aADVcALjgAPbgAKrRgB+MABpHgBoIwUAPBcALgQAjy0AoUIAbiwAQxMARhwAXCgDUCIDUiQEACIAACUAADYTACUAACYAADMOACsHAEIbAEgfAEceAeIqSc31oGakAAAAAElFTkSuQmCC',
    alt: {
      en: 'Coffee, tea, and Japanese tea available at the free drink section.',
      fr: 'Café, thé et thé japonais disponibles dans la section de boissons gratuites.',
      ja: '無料ドリンクコーナーでコーヒー、紅茶、日本茶をご利用いただけます。'
    },
    house: 'orange',
    category: 'common-spaces'
  },
  {
    id: 95,
    src: 'uploads/orange/common-spaces/10.jpg',
    width: 1000,
    height: 750,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ACAaFx0cFx8fFhkZEyccGR4bFiMfGCMfGCklHDAtIwAgHBpIKCtVLSobEw8rIh4jHhgeGxQeHBUiIRksKiAAhzJAyEJcozxIV0E0iHlafW5PHhgUKBsYLSAcKyggAI4uPnslNGofKIFxV7ekgmhfSzcTF0cQGTYQFiAaFwD638eLgHdZMy6TcVWbf15LPSlHHh4pChEQCA4NCQ0AkIV2ioFxiHld//vU3cujy6OCQCYfCQgOCgwQCQgOACAZEiwkGbOgevXmu9XEnrumfjYvIgUDCQsJCwgGC/qeN+/WL0AiAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'common-spaces'
  },
  {
    id: 96,
    src: 'uploads/orange/building-features/0.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AEkQDYIVDpYgCnQQCjUAADkBAI8qAP9nBaosFIIpFwB/SADquBDduRDImwhsQgAcAABjGADLOwWPJBByJRUAo2MA//Ie//8i//8i/+QbNiAALwAAjSEOfCIQgikVAGwYE50+AOqiL9yUCYlTADADAE8NAMA7DMQ7D748GgCSJg+jHxLUOADHOAB+AAmyAAadJAH0XAPeSgbEQR0AmygUvTcQ8lcD108BowAHyQAFqjkA+GoF3lAMyEkhAJkuF8E7F/BZA7xAAIAACJEAB4glBeleA9VMGcBHJWvAQp8YuuPqAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 97,
    src: 'uploads/orange/building-features/1.jpg',
    width: 667,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AP/vOf+7LNxcFdRMEc5IEM5NEchGDwD/9Tv/vi3obhnnbhnpexvxgh3SWBMA//Q6/8ww5nIZ6WYY/5Yj/64o9H4dAP/7PP/YM+SGHcpdE+B8G//cNPGGHgD//Dz/1jL4yoD72q3Rghz/0DLqgR0A/+k4/6wopnBBsqWbomIjzmoWw0sPAP+yKK9QDm84HY5RM4A1B85WEoAoBwBXJQVZFgRgEgR2GAadMAj/cR14IAYAHAQANwIAag0FahMFhh8H4kMRYRQFAA8BADcDAGMKBGIOBG0PBXETBjUIAPLhWMLxCfO9AAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 98,
    src: 'uploads/orange/building-features/2.jpg',
    width: 667,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AP7/+v797v//4/TmouXLeP/9nfvnZQD+//T+/e///+/5677VsDPKtEzVr0QA/v/2//rX9umy3Myj6r8w1ocA06AtAP7/2vXKXptDAEgOAK11EOV6ANKbKwD+/2jUmgqFNgOYaS67ly39uADJkCIA7uI4xXYAp1MAjD8Jg1MTzKolwIEGAHxOKnRYCoJtAB8AAAEAAHdWCLZvAABAFwBIGAAZAAATAAAxFwCYWQCVUQAAOBIARhgAPhoAKgkAqlsA7JIAmksAACwNAEohAF48ADwZAJQ+ANRvAKNEAGj6YRR0RmYLAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 99,
    src: 'uploads/orange/building-features/3.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AB4OCJJBISohGWkqFvlbKHc0F8puKP+fJ+91H2ElGwAsFRBHGQ84Eg84GA68SyF1NBlApTXrii7/jSOpTh8AGA4MPhsSdyIXlBoWbh0SZigVm4Qz3ZYb/34f/3kpACchGxcQDSIQDG0gFMQqGsUyGuZpIv+qHP+sHPZsHwBWV0NUT0A+NCkjGhYtFQ+IIhW2JxmWSBv2nBj/mxkAcG5aY2JJZWJJcGVOW0s7JhsXQxcMQBAOUCET3YMeAP/8+tzXzqymlH92XXZ5X3lFMJgiECoTDAQBBqVUH890RNBQV/TxAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 100,
    src: 'uploads/orange/building-features/4.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ABocKCsvOywyQy00Sx4qQiUvQh0oPBwmNhgeJg0UHAAABQA6EQeuXyvVmVaJY0YOCgAQDgQPDAUKCQIJCAIAAQEAPCIW882h//3Lo5R2AAECDw8OEQ8LDg0JDAoGAAAAAE02JdebiMiwo3JVREobAjUfDw0MCxUPCg0MBgBcAgKmZTvLqpSLi3/jl1b2YwzVZScfEwsMDQsPDQcAlBgDnjsfmWA/lWIu/5hN7FwK/6pdtXNCFwwECgoFAIcjA6w3BMdYGt9AB/d7I/SqbvSMYPttQJ9kQAoIA/DUOp7iy8dVAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 101,
    src: 'uploads/orange/building-features/5.jpg',
    width: 659,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/APvu5v/57uLp6bDG0r/Bvo+HeXl4cgD97t7//vPU2tSPn6K+wb+fj3mYn5sA5tnM6drO6tTJ39/l3dbV9PHwo6alANDf7t/LwPaQX/O+q/DW0vrZ06OcmQDKzdLO2OP42NT2n4D05eT/7uybl5cAvZNxzryswszQscPPrL3FobG2X2NhAMSSZeXAmGZubTFXcjlXbhguOiEiGQDEm3PXr4VtcG0tUGQuSlwdOUYLExMAuY1lxpZiX15WDy9CFCgxDh8oAhASAJlyUZtoNkpBOCNEVxgrNQoTFAAFBQbzeu/DQYYrAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 102,
    src: 'uploads/orange/building-features/6.jpg',
    width: 667,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/ABMHAxkJBBkMBBQLBBQJBBMJBBEJAwAdCgQTAwIPAQERAwISCgQUDAQTCgQANgwJXDQYvqJkqnorQA4MIQ4GFw0EAK87G9iXQf/1g4UzFpRBGctmKVAjEADfTiZrFRJiJBWVcFmFZUfFViTCVCMAsT4ccSgTTisX2LyexaqTl0Ya8nMzAGwkEjgYDCQTCb2fgsGxmFEnEn45GgBSGhAiDwYJAwGFdV5pXk0HAgEQCwgARxgOGgcDOzQovLSZX1xNAAAACggDADoWDBQFAlZMPPLmz5CEdAwFAgcHA+T9M6A5+49TAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 103,
    src: 'uploads/orange/building-features/7.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ABcAAHdXKndcLH9fKWVMFGlPCXRYAHBWABoAAKmaVgA9MiTv2KPYvIDGrWpBPhaGeCniwknu3ChYQQCWiV0ASjYk7N29VDcrQAAATwsATQAANwgA3L5LXkYAlIZfAEw8Lu/p11IpJm0AE2cABJEvMXdGOt3CbWtSF5WGYwBGQD779u+Icm1KHA1RJQVbNBGPcUjv25VzVyafiWcARkE//vv20tDMpogz3bMCqnYArYs++fLEZlAwmIRrAEVBQf//+8O+vJ+SY+zmhK2bMZl4R/r01l9PPJSEa7rSWi7x0KRTAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 104,
    src: 'uploads/orange/building-features/8.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AAAmkAAjjAAWgQAKdQANdgAJcQADbgAJcgAHcAAKcAAAPa5Qf+TA3v+Rsv+92v+wzf8ARbQAKJwAPKoAMqEARoTyean/3fv/udv/t9j/p8n/kbf/lbz/dKP/FWXUAHWZ3afL/5vA/5C8/3Sn/2ad/4Sz/63S/5bC/4u2/wAAGzoqSW5TcZh3krlOX4J3ia+XpsVzhqxxibIqPFoAACFHAC1VDz1lKFB4DidCfoOU2uT0zNbjsr3Og46fAAAAJwAFLgAjTg9AbQg8ahwqRr/H38/e/IefzkFbjzmPZ/BibwRSAAAAAElFTkSuQmCC',
    alt: {
      en: 'You can see Abeno Harukas from the rooftop',
      fr: 'Vous pouvez voir Abeno Harukas depuis le toit-terrasse',
      ja: '屋上からあべのハルカスが見えます'
    },
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 105,
    src: 'uploads/orange/building-features/9.jpg',
    width: 1000,
    height: 595,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAGCAIAAAB1kpiRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAxUlEQVR4nAG6AEX/AJW7xq3M1KrL18Db5c/k6eHv8+/2+vn6+/v8/Or09wCOqaajvr7E2tfH1dPh7u3t9fT2/Pvu8vLg5eTn7+4AYmlYdn9pOUU6JTMrUVlRRE9KZm9ij5SCRElCO0VAACIqHiAqHwAMAx4nFw0SABAdGwAXEA0bDQAGADNNTAAKGQgYJRc2PiUtKA4THBQoOjEeLScWJyMDGBMeKykAEBgMOkAmGR0QAAgBCxQMDxYPDRYOChcTABEOAAAAHNJGXZfnUU4AAAAASUVORK5CYII=',
    alt: {
      en: 'Showacho, the traditional area where houses have Japanese style tiled roofs',
      fr: 'Showacho, le quartier traditionnel où les maisons ont des toits en tuiles de style japonais',
      ja: '庄内町、日本風の瓦屋根の家がある伝統的なエリア'
    },
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 106,
    src: 'uploads/orange/building-features/10.jpg',
    width: 750,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AO7Xt/754f/86/326fbx6vbw8PD4+gCxj2imnoisnYf26s789eP27ury+vsAdVY3LTAqJiEaalxS08Wy+PDl+Pn0AM2cTFFQPDghFB4VF0Y7QOPVx/Ty7QDyxnFuWUFjQh9BMSMzLiivn4bV1dUAwpdHTTsnUzweSj4nMjMlTE87m5+dAIVoEhocCko+LC0yJhgpHSgzK2tydwB1Ww0ADgIdEAIGFQwBMSUfJyVLT1QAYk0dFBwcFxAJAAAAACUeNzs+c3+DADcoHg8RFwQDADE2OUdNUllncX2FjMMyWRDR6oZWAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 107,
    src: 'uploads/orange/building-features/11.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/APvPdMibbossDLl5VPvShPrKhfvMlv3m1P7////++QDWlEnHm4DftoXs27b85qb5wHn7ypf32MLh3+e+t7sAt2MYZgAAghYWmlNHy55y+L17+cCZ3aR9knJnXUQzALJcFm0AAIAAAGQAAI5LRb2TfnoiG3YwJbd8RfCiPQCUQBFqAAB+AAZ4AABaJCSLPTplAAAsAACKUin0kxkASgEAfQAAZwAAQw8EFAAAOgYANgQAmSdFgD47v3IcADIEAE4TBy0WBBgIACgMAG4eBksaDG+CqoNsa9qJHlBdWBa9o0F4AAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 108,
    src: 'uploads/orange/building-features/12.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AN66g72ledXU1OTn59XY187OzNrf4sfHxLytnsyoiwDYt4vRsYXg0sfz9/rj6u7W3eDd5ejV2NnS0M7e0s0AwaeIsJ+TlJuizcvL+Pf0/P//4Ont4ufr2+LnytPbAJWAZn9+fISjvk1ieKexyL/J4pSjtI6XorS3vaeprwCXhWxYPyVcZnA9SlsDDiIAABsQGigVGiIjJi9XUlIAuaF2xZ1MY0wtJyUmFxUUFA4HFRUZDg4PBAYLEBAUAM20g72hY3xqP0xBLxUHCRgQEBANCwoKCgwKCggKDJvnbelZfC5bAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 109,
    src: 'uploads/orange/building-features/13.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ALl4M9Ona//bhfKwQMd9TMB4Vr1yTua2df/jtvfz8wC2fT7rwYv/6K37xXTKiVigXEahXEDhsXX/8dT69/gA1KVx6cmr//bQ5q1yvndGu2I0u18t27OY//3w//75AOu+h93JyPfy+uK8os+Ya9qufN28mNS/t+Pt/+Px/AD21bJvaYUvSX2Hd3NxXExWPzugkop5ampPc6d9te8A+N/RUDgwAAAAblpKaldOYzcrlGhWZ1BIKyMeNz9JAO3WylE/PQUKDlxMRp58cpNlWaF2Zn9lXiQjIxwcG3sdeBOG3IGDAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'building-features'
  },
  {
    id: 110,
    src: 'uploads/orange/neighborhood/0.jpg',
    width: 1000,
    height: 690,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AK/S/6DH/5/F/pC39ISr53F1h51iSoNZVsrF5czf/wDl8//N6/+22v+v1v+u0f97WU6iW0SMWlLg1PDa7P8A7cy5//f24vP/2Ov/kYmWZTs2TighW05CxsvXmJSfAEw7M0s9NXFhVj4uJBoAABUHADEqIlxFPJuMh09HSAAqJy1RS0enmI6GeW5jVk1aSTpRSTtaSzdsVj9AOC0ArKWiwrat3M/H+u3i2s7GsqefwrCk2si40MCx2si4AKeelqifmqeemaaak7iqoMC0ramjn25lYJKGfY6FfghMd6ov+DFnAAAAAElFTkSuQmCC',
    alt: {
      en: "There's a supermarket nearby, only 5 minutes walk",
      fr: 'Il y a un supermarché à proximité, à seulement 5 minutes à pied',
      ja: '近くにスーパーマーケットがあり、徒歩5分です'
    },
    house: 'orange',
    category: 'neighborhood'
  },
  {
    id: 111,
    src: 'uploads/orange/neighborhood/1.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AMHX++Ps//b//9bb8Eo7PHZVO7mEZHc2KbU6Klk9PQDF0uzx/f/Ky9l2X1h3ZFWPYk2ANylkLiVcOSs5KyQA5d/d3dzmeWJcalBIMy0mOCIWRjMlQjUlNCUYLyUiAOXdyJmMgS8iHyYhHExCPScdGBECABcOBjMpJFA6MwCqkHitlH18allXSz1pVlZ1XlkrIhQYFA1hR0VeUEcAbEdHnnVtw6CRvqqYooZ6lG1iX0YzcFtLpntxTTYlAHVNSItdVohRSp9oXc2nm9bEtsGqnLWfkK+UgY1nUJ36WbWIeROGAAAAAElFTkSuQmCC',
    alt: {
      en: "There's also a supermarket by Showacho station.",
      fr: 'Il y a également un supermarché près de la gare de Showacho.',
      ja: '庄内町駅の近くにもスーパーマーケットがあります。'
    },
    house: 'orange',
    category: 'neighborhood'
  },
  {
    id: 112,
    src: 'uploads/orange/neighborhood/2.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/ABsnPCozRYGQqYuiw6u/087a5e7v8v79/fj4+OXl6AAZJDceJjeTn7ScttS2ytzZ4+zr6+z4+Pj4+PjLyc8AGBomODlEtMDQm6y/wNDexc3X7u/v+Pj46OfppaWwAAAAA3FycW1xciIAABkKCQQHCCsoKSglLjk6S1VUXQBSR0R4cGgtJCFVR0I6MixPSEViXFqFgICPjY84My4Asq2qbmZjkoyIpaKfsauoycPApp2aioJ+k4qKqqWhAJKMi352c5SOisbCwKOdmI2GgLu2tKijn2VcVrKvrasQcdBMNGXbAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'neighborhood'
  },
  {
    id: 113,
    src: 'uploads/orange/neighborhood/3.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AOvk5oJqXSAbGHBXSo1yYhULBks1KJpxVo1nWp256QD/+/eee2lmRjR/XEiWemlYQjpbRTtpUUU8Mi1EQkcAqqKfbVNFdVRAWVJNaE4/glM2l4R4rJmKPjIqEwEAAMStm3hfUmVGL4NxaLSTeKZmPmVALEEpHEQmGz8iGAC5qpuwm4fau6K/q52zqJzpyrDfvaG/oozKqY/ZuJ0Ao5SIr5+TuaebopOHpJOIyranvqqbkn5xpJGDuamaAJKGe5uMgaKTh62bkLGekaqZi6aTiHZjV15JP39yaHaxZTObVlhgAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'neighborhood'
  },
  {
    id: 114,
    src: 'uploads/orange/neighborhood/4.jpg',
    width: 1000,
    height: 667,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AG5qZFBCPC4eHDIkJRoAAEs7NpiQlaKcqNDQ2s7KzgA8MTFJQkRHNjRWQz9WUFAnGxgcAABLQkxiYWh+d3MANBoQHgAAIwAAJwwAPjEyHhIXIAoUYFBGNikuODI4AF1WVzYuMSQOASUHAFBGRjsjISgRG1ZQQTAmKSQgKAAkISMkFh0yMDoyNjwgHR9gUEZiX101PDygo5zQzccAR0hRKycqWVhehoaEqZiNh317OzxHWmRn2uTa+f/5ALWooMK3r9TFu9jGuLapn0RCTWlmbNbGu8i7sMvAuYLRSW1U4Yi5AAAAAElFTkSuQmCC',
    alt: {
      en: 'There are many stylish stores behind the station that were renovated from traditional Japanese tenement houses',
      fr: 'Il y a de nombreuses boutiques élégantes derrière la gare qui ont été rénovées à partir d’anciennes maisons japonaises traditionnelles',
      ja: '駅の裏には、伝統的な日本の長屋から改装されたおしゃれな店がたくさんあります'
    },
    house: 'orange',
    category: 'neighborhood'
  },
  {
    id: 115,
    src: 'uploads/orange/neighborhood/5.jpg',
    width: 1000,
    height: 665,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AP/87WpiWGVYUl1XVEpBPCojHhELBDw1KkI9NA4OBgD/+Od6cmY0KSM7Miw5NS0bFA4mIRxPTk0+PTwTDQkAYVdPPjYuBAIAMSMcTUVALSEbGA8LFBAQEA4LBgAAACUhHTovJR8YGYttUF9PPox7dWJXVC4rKzsvKxMLBABaWlxFMSEuICVcUECjm4He0tK5s68PDQsgGBQSCQMAUFFTOC0iGQ4MraqkmJKEbnFpko+DGRENJRsUDQYCACIhIkc7LyAfHHJuZ1lVTV9eY2RhYh4dHSomJRQQD1/jNiwiboAKAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'neighborhood'
  },
  {
    id: 116,
    src: 'uploads/orange/neighborhood/6.jpg',
    width: 662,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/ALujgbmolOPp9PP2/+7z/u7z/uzu/ADEqoTJwrbL29/m6/H2+f/w9f/x8/8Ar5d31tbWzdzc3OLo+Pr/+fz/193iAMGqjN/m7Nfh4Nvh5fT2//Hz/eXn7ADFuKzm7vfFzsZxaWOVhYKHf3+7v70ApJibmp+oaGRKOycQjHFWp5iXnJmaADQuGlVRPywvGkZAJXFjS62enkpKSgAhGgAgHQAABwBBOyI0NCFubmorMB0AgXloXFZJQTkoNTApPjkyFhUKFBcUAIp6arCdjpqOiU5JUE1ITWliZiYmLt8od4W5Ip5UAAAAAElFTkSuQmCC',
    alt: {
      en: '15 minutes walk to Abeno Harukas',
      fr: "15 minutes à pied d'Abeno Harukas",
      ja: 'あべのハルカスまで徒歩15分'
    },
    house: 'orange',
    category: 'neighborhood'
  },
  {
    id: 117,
    src: 'uploads/orange/neighborhood/7.jpg',
    width: 662,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AOjs6+vt7Ofq6dHW1MPHw+Pl5P78/gDu7+/p7ezr7ezw8/LU2tja3Nj+/v8A5enp6e3t6e3s7/T019va1tjW/Pz9AOPm5OXp5+Tq6bWhmczJxtba2Pv7+wDp7urw8/LZ1tC0oZLp7evNzs35+fkAsbat197draWXtq+k5OfoztHQ+Pj4AGVoU4WKe3VnTXJQPXRGMqaZi/X6+wBueFmUnYBsWj5YPSYlEwBJOixAQjQAPUUeTVEtdnFpgYB3BwMAJiQZJyUCAB8fAD0qIr64sZyUjQAAABMKADs4GOu8iIVTEAmJAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'neighborhood'
  },
  {
    id: 118,
    src: 'uploads/orange/neighborhood/8.jpg',
    width: 1000,
    height: 662,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/APj6/fr6+/v7+/v7+/Lz8/r6+vLz8vHy8f////7+/gD2+vv5+vr29vXt7Ozy8/P8/Pzt7Oq2srL19PX///8A8/b55+jpdXJxLxsT1cvG+///oJaRBwAAwbm7////APL3+dzj24iIeVU8Mb21rd7k46eaiyMQAKqjlPru5ADGzcu7x7uShWrIsqHQ1s7k5eR9dmskGwB/akzo1sgAztLLo5qQf11G0bmk2trSrqqdOC4ZEwIAkoht89S7AMvRyGVFP3pPQMKqks3FsmRdRiIaADYxCaOQaPXOqlQakbNiVKGgAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'neighborhood'
  },
  {
    id: 119,
    src: 'uploads/orange/neighborhood/9.jpg',
    width: 1000,
    height: 662,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AEg+Ni4gGmBWU9XZ5ebp8/X1+5intZOlr3KFhzlXXAA5LSg3JyBlWVPe4ezt7vb8/P+Um6ZbbXu7xMRBYGIAVktDLR4XZFZO6Ojv7Ovy7vD3Z3F6NEpSmqesd4yJADEkHEw+NWxfVnZsaZuUkevr8U9WXRUlKDlRVVZpaABfVk6nnZh6cW2DeXSDenekn59SUVM4PEBDR0pJR0YAp6KfcGVhQSwghnVsXVNOOjQ0NTIzKicoCwECDwkLAJqJhjonHx0SAFFEOU1HRxsaHQkCBCQiIyknKhsZIMJGV04D6U+iAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'neighborhood'
  },
  {
    id: 120,
    src: 'uploads/orange/neighborhood/10.jpg',
    width: 1000,
    height: 662,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AN3c3Pr6/Pb29fz8/P7+/v///6Kbm2VeWFxcUUlNQQCsn438/P3////4+PfV0cvRysRybGhgXVFISDgyMyUAgnNUgoFzrbCpxLy0087Hy8PAgHl0UlNDQD0wWVdLABIRADYyI2BYRVpSQLSvqZuUil9fUz49L3FoVmVcSwAJBQBqYlJdT0AZCwA1Kh07MyUREggmIRZTQC9JPjoAZ2FSfHVlWU9AOC0iXVJHa2NXKiQgDAAADgQAGBYRAIWAepaOiKCZkqedlrmyq7y0r5eNg3JpX2BaT2NeU6PrX2h2VUnyAAAAAElFTkSuQmCC',
    alt: {
      en: '12 minutes walk to the biggest shopping mall in Osaka "Q\'s mall"',
      fr: '12 minutes à pied du plus grand centre commercial d\'Osaka "Q\'s mall"',
      ja: "大阪最大のショッピングモール「Q's mall」まで徒歩12分"
    },
    house: 'orange',
    category: 'neighborhood'
  },
  {
    id: 121,
    src: 'uploads/orange/neighborhood/11.jpg',
    width: 1000,
    height: 690,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AJ+htISGmpeZrJ6huZWUm5KHeK2pj7q6r+b2/9rv/wCytcqHipuhqLlzbW1QQyhRRSM+NwJZTiS8uMHg7f8A+Pz/p6WvcG94HBYDTkk1PTogHxwALCkXRDs0j4iRAKyspggAAEpHQDkxJVVJMy0qGExDMm1qbn2DkJ+KgwAeFQMaFwRMOSNoNSFFGQwfAQAwFwo1KSZCOTJ0XE8AkH5ox7aq4Ma2lHNiVzUmHw8IHxEHEwwQEAsFEw8HAK2flKmZkbOhldTAssm2p6OThqSWjJmMg7SytL27vZ8MWY0gGQjMAAAAAElFTkSuQmCC',
    alt: {
      en: 'You can enjoy Hanami (cherry blossom festival) in Spring at Momogaike Park!',
      fr: 'Vous pouvez profiter du Hanami (festival des cerisiers en fleurs) au printemps au parc Momogaike !',
      ja: '春には桃ヶ池公園で花見（桜祭り）をお楽しみいただけます！'
    },
    house: 'orange',
    category: 'neighborhood'
  },
  {
    id: 122,
    src: 'uploads/orange/neighborhood/12.jpg',
    width: 1000,
    height: 690,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAHCAIAAAC+zks0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nAHZACb/AIJ3dYWChGtmW0tAL2VaUKOjo3JqPz01BXN5gWBoWQCEgXR2cWhtZlY/NigzMSitsrlqYk4QCgA9QUFQSkAAOTUaNzAfVlE/OzgqOCkaWDomgl9NKB8WFwkAPzQcAEM4J3dPM4BRMZFnRp91WpRhR6p5XUosHSkdFUwxGQBTRTStiW2pgWDHlHObd15tVECbhGFRPCAYDwscAAAAbl5Cn5BzqqOShoBu0JyLyamNXFg4CgYARUA0fndqAIVySfDQkP/30OTXwMeKd7mPeYd5YlZRLkA9Kqufjo2wTk4B8caTAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'neighborhood'
  },
  {
    id: 123,
    src: 'uploads/orange/floor-plan/0.jpg',
    width: 530,
    height: 295,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAFCAIAAADzBuo/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAiklEQVR4nB3LERoGIRAA0LhD7AU6QbA3SOOhIFqOx/MoWVoeyqNoPNoDrPw01P/tPn+KmVtrMUYAKKVc10VEzjmt9XmeChGZ2X/u+26tIaL33lq777vatu15nuM4AEBEeu9EVGvNOb8bAMYYKaUQgojMORHRGJNzZmaVUiKitZaIrLXGGL+Pcw4R/zKJWYYnEZ/1AAAAAElFTkSuQmCC',
    alt: {
      en: 'Orange House floor plan',
      fr: "Plan d'étage d'Orange House",
      ja: 'オレンジハウスの間取り図'
    },
    house: 'orange',
    category: 'floor-plan'
  },
  {
    id: 124,
    src: 'uploads/orange/facilities/0.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/ADcwFGVYIHhpIoR1IJCCIYByIz0zEAA8MxMzLA5KPxGUhhvp20G0oztGOyAANSkNSSgKPCEKMhkBkX8olIM9+vroAEUwDIBbJraSM//AQp1hF9e8U/zynwBHLQuDYSiSXRb/+lzrvleLTAxgNQYAKxgGpnAdik0R/70z1JYqYikFYDoNACkWB7t8KWdDFkEdBXhCD2c4ClMyCQAUCAGbczNeNRU3DwEVCQRQLAhQMAwACQMAdVAoZjcXlkIMJxQFCAUDMh4KABMMBXBHJF4zF3s7FywUBQQCAgMCAeMmPIWAK9LvAAAAAElFTkSuQmCC',
    alt: {
      en: 'There is a shower room behind the curtain',
      fr: 'Il y a une douche derrière le rideau',
      ja: 'カーテンの後ろにシャワールームがあります'
    },
    house: 'orange',
    category: 'facilities'
  },
  {
    id: 125,
    src: 'uploads/orange/facilities/1.jpg',
    width: 750,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/AJ6RcmFbRT05KlNPQ1pTRlhSRlpbVwDdzbB4c19APjFUU0dsaFt0cGeGiooA///uf3ljREM1U1NId3dslJeTmqSuAM/FqX98aUdHO1ZXUIeNiau2wKi70ADNvpiNjXxLUEpOU1VjaWxtdndJTU0AmJF4dXhxX250Mzo/HxwXGRQEDwIAAFpTPWx0cW2Ajm6EmoaZqJOjtXV6gQCBeF17g4FsgI54j6uVrceqv9yqvdgAppyEe4SCZXqIdY+pkafBo7XQpLnXAE5QRWJvb19ygGuGn4iet5yuyJqvzU+iY+1CWRTCAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'facilities'
  },
  {
    id: 126,
    src: 'uploads/orange/facilities/2.jpg',
    width: 636,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAKCAIAAAAYbLhkAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAyUlEQVR4nAG+AEH/AOeYFdySDeSgF+KTANOPJNywbADvrTr4yED+9Z75003UlSPjsmwA8ctV+uqa////9uafyKBO05dJAOvCUPfYdf3vjffOVda8gdGPOQDswIf2uVb4ryfsrDTIqHfKeiEA37R73J5A4qA50Js8tpViiE4VAFE1G6d0HsKKJLGFMXZYLj4kCAAbAACVZRvAexajbRtFLxFNJgEAEwAAaEojoHMzlm4yLyINQBoAACEQAFI1E1o3EVY8HBoRACkHAOrGVcnA1b3qAAAAAElFTkSuQmCC',
    alt: {
      en: 'Shower is available 24 hours, for free',
      fr: 'La douche est disponible 24h/24, gratuitement',
      ja: 'シャワーは24時間無料でご利用いただけます'
    },
    house: 'orange',
    category: 'facilities'
  },
  {
    id: 127,
    src: 'uploads/orange/facilities/3.jpg',
    width: 750,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5UlEQVR4nGP4/+fz7bP7b53bN39SbWywTUt5yqT2Eoa/39/fuXRkQntxbXF8ZUFMbXHCrN5ahhtnDm5eMbs4O2TmhKrGipT8jJD+1kKG/vby+vK0hvLktATP6BCb/Iygxso0htSEwKhQ98zUEB42BlsL1cwkn5LcKAYfd2s3RxNDPSUxIZBoTIRLZmIQg5Wlvo21obuTsZujkaONTqCPXUy4N4O+oY62vpaXh3V0mKejvbGro0mgjwODkrqqorqaqJSYgLiIpLSojZWus70Jg7CktLC0nIiEOAMzu7i0uLGxqqG+CgArP0hQdA45ggAAAABJRU5ErkJggg==',
    house: 'orange',
    category: 'facilities'
  },
  {
    id: 128,
    src: 'uploads/orange/facilities/4.jpg',
    width: 666,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/ALB9MaJuJdGUO+elSemnSOOgPsKGMQDfmz7/vk//uVH/ynX/1YjgpUrYmj4A7qpM05xNvpJNqodVlnxXoH9M/+3AANq0fcinbs63g4dtRnVJItWzidzQwAD23K/UtoXJq3XAnmSgbCi+mmnOsogA//rD17iKj203yKNs+7ha3K1q5smcAP/bnb+jdmlMI3FaO5RsOMKYXvbcsADovXaYf1hIMxQoHQ8BAAAxJhvKqngAw5RFMigaLiEPHRcPFxAMCgYCYE40AHpdKxEOCxsWDiMdFCMeFREMCBAMCpolZdBPMEZwAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'facilities'
  },
  {
    id: 129,
    src: 'uploads/orange/facilities/5.jpg',
    width: 1000,
    height: 791,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAICAIAAABPmPnhAAAACXBIWXMAAAsTAAALEwEAmpwYAAABA0lEQVR4nAH4AAf/AH43G859ONd8Muiocei4jouKnP/Dgc58L2BBMxwVDgD/VjTiXCi3jFy0kXv/8MXb6P//7qbqjjg7Jx80HBMA/1w4/4dB+rhq5Ztd8rl959jO/9CJ/9BW14I4/5tFAP9XNP95Pf/SXP/LYP/abv+8Xv+2Sv+0Sv+vSf+/TwBsJRRYJRP/o0WyaCWGTSX/lDyFTxpBIxSSVSX4mkAABwYLbUgZ/75PSiYSKBIQ/5c+Sy4UAAAFh1Ao/5hJAJRfIf/nX/eYPk4vFmI4Gv+gQTwlEAAAASkZEnNAJQB3SRyMUyNWIROtXCrqjj22Yi0zHREnFg8NCwoNDAzik207NaEqaQAAAABJRU5ErkJggg==',
    alt: {
      en: 'Equipped with washlet. Toilet seats are warm and comfortable even in the winter',
      fr: "Équipé d'un washlet. Les sièges de toilette sont chauds et confortables même en hiver",
      ja: 'ウォシュレット付き。冬でも便座が温かく快適です'
    },
    house: 'orange',
    category: 'facilities'
  },
  {
    id: 130,
    src: 'uploads/orange/facilities/6.jpg',
    width: 665,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAKCAIAAAD3rtNaAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA50lEQVR4nAHcACP/ANtVB/99Df5xDOhiCdFfC81sIYdUKAD/jCH/hA//bwzuYgnfdwqxXAtiVU4A///D/751+3kjtjgDsFgZt28kn4dzAP/unf/ug/+2FvhCB/8aBt99K5RpSQD/0Fz/kCL/Gwb/Gwb/FAb2hCnEikYAy38sn0QXsSYCggEBujoD/6Yl/qUyABoGBQkFBRYRCjkmEZdWCrlWBTMaCQAUDAcXCQSEURj/rS/1jRhwKgUCAQIAGQ4GYCkJYi0KbDQMfDcKMhUDIhQKADMbClspDTkbCCoOBV0mDWc4EEsqEqbxTBPl2+ySAAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'facilities'
  },
  {
    id: 131,
    src: 'uploads/orange/facilities/7.jpg',
    width: 1000,
    height: 1000,
    blurDataURL:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAIAAAACUFjqAAAACXBIWXMAAAsTAAALEwEAmpwYAAABHUlEQVR4nGP4H2mKgsKM/093+X8v6f/N5P+HAhn+h5kg5MJNQNKL3f8/z/h/L/X/Xn+G/746ICG4Cm+d/7Od/18M+38q5P9OP4b/HpogFd46lx3k5xhKOooI3m8yAsntD7hTostwyVH+Y55es6uSo4ywpawQAwP76UKt/4cC/89zUBLiY1iRpL0iU89TR1JPSECahyfHVe7/Rvf/BwMWxqiwsbIziPBxszCzi/JxcbJzNgYp/r8RAUJXw3z1RFhY2BgEeTjFBXn4eTikBHn/7/MGyZ0LfdJlrSzCL8DNzsDHxc7HzS7Gz+WtIvygxfT/Kted6ZoOsiJeyiJeysIM/FycKqJ8EbpitVaSwaoiOhJCulJCkrw8xhKCVgrCAPLkc3Jtnhs7AAAAAElFTkSuQmCC',
    house: 'orange',
    category: 'facilities'
  }
] as const

/**
 * Convert image data with blob storage URLs
 */
export const imageData = imageDataRaw.map((img) => ({
  ...img,
  src: blobUrl(img.src)
}))
