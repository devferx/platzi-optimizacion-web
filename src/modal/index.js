export const modalListener = event => {
  event.preventDefault()
  const img = event.target
  const link = img.parentElement.href
  console.log(link)
}
