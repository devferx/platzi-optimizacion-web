import h from 'hyperscript'
import { fetchPopular, fetchHighestRated, fetchTrending } from './api'
import CarouselItem from './CarouselItem'

function imgLazyLoad() {
  const isIntersecting = intersectionEntry => intersectionEntry.isIntersecting

  let lazyImageObserver = new IntersectionObserver(entries => {
    entries.filter(isIntersecting).forEach(loadImage)
  })

  function loadImage(intersectionEntry) {
    const lazyImage = intersectionEntry.target
    lazyImage.src = lazyImage.dataset.src
    lazyImage.classList.remove('lazy')
    lazyImageObserver.unobserve(lazyImage)
  }

  const lazyImages = [...document.querySelectorAll('img.lazy')]
  lazyImages.forEach(lazyImage => lazyImageObserver.observe(lazyImage))
}

const SectionTitle = title => h('h3.carousel__title', title)

const Carousel = ({ itemsList = [] }) =>
  h(
    'section.carousel',
    h(
      'div.carousel__container',
      itemsList.map(
        ({
          attributes: { titles, posterImage, slug, youtubeVideoId, startDate },
        }) =>
          CarouselItem({
            imageUrl: posterImage.medium,
            title: titles.en,
            subtitle: titles.ja_jp,
            slug,
            youtubeVideoId,
            startDate,
          })
      )
    )
  )

!(async function(document) {
  const mountReference = document.querySelector('.main').lastElementChild

  if (!mountReference) {
    return 0
  }

  const trending = await fetchTrending()
  const popular = await fetchPopular()
  const highestRated = await fetchHighestRated()

  mountReference
    .insertAdjacentElement('afterend', SectionTitle('Trending Anime'))
    .insertAdjacentElement(
      'afterend',
      Carousel({
        itemsList: trending,
      })
    )
    .insertAdjacentElement('afterend', SectionTitle('Highest Rated Anime'))
    .insertAdjacentElement(
      'afterend',
      Carousel({
        itemsList: highestRated,
      })
    )
    .insertAdjacentElement('afterend', SectionTitle('Most Popular Anime'))
    .insertAdjacentElement(
      'afterend',
      Carousel({
        itemsList: popular,
      })
    )

  if (document.readyState === 'complete') {
    imgLazyLoad()
  } else {
    document.addEventListener('DOMContentLoaded', imgLazyLoad)
  }
})(document, window)
