export const lightBox = () => {
  let images = document.querySelectorAll('.main-content img')
  let modal = document.getElementById('modal')
  let modalImg = document.querySelector('#modal .modal-content img')
  let modalClose = document.querySelector('#modal .modal-content .close')

  if (images.length > 0) {
    images.forEach((img) => {
      img.addEventListener('click', (event) => {
        let src = event.target.getAttribute('src')
        modalImg.src = src
        modal.style.display = 'block'
      })
    })

    modalClose.addEventListener('click', () => {
      modal.style.display = 'none'
    })

    // When the user clicks anywhere outside of the modal, close it
    window.addEventListener('click', (event) => {
      if (event.target == modal) {
        modal.style.display = 'none'
      }
    })
  }
}
