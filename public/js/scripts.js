const navbar = document.getElementById('custnavbar');


window.addEventListener('scroll', function() {
  if (window.pageYOffset > 0) {
    navbar.classList.add('white-bg');
  } else {
    navbar.classList.remove('white-bg');
  }
});



var typeData = new Typed(".role", {
    strings: [
        "Full Stack Develpoer",
        "Web Developer",
        "UI-UX Designer",
        "Backend Developer",
        "Coder",
    ],
    loop: true,
    typeSpeed: 100,
    backSpeed: 80,
    BackDelay: 1000,
  });
  
  /*========== swiper ==========*/
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 50,
    loop: true,
    grabCursor: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  (() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  Browser