const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  navToggle.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offset = 100;
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

const nav = document.querySelector(".nav");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    nav.style.padding = "15px 0";
    nav.style.backgroundColor = "rgba(10, 22, 40, 0.98)";
    nav.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
  } else {
    nav.style.padding = "20px 0";
    nav.style.backgroundColor = "rgba(10, 22, 40, 0.95)";
    nav.style.boxShadow = "none";
  }

  lastScroll = currentScroll;
});

// Notification system for better UX
function showNotification(type, message) {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-message">${message}</div>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto remove after 6 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 300);
  }, 6000);
}

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -100px 0px",
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      fadeInObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply fade-in animation to sections
const animatedSections = document.querySelectorAll(
  ".about, .services, .projects, .testimonials, .contact, .contact-info-section, .contact-form-section, .why-contact, .office-section"
);
animatedSections.forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(30px)";
  section.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
  fadeInObserver.observe(section);
});

// Stats counter animation
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          const target = stat.textContent;
          const isPlus = target.includes("+");
          const numericValue = Number.parseInt(target.replace(/\D/g, ""));
          animateValue(stat, 0, numericValue, 2000, isPlus);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const statsBar = document.querySelector(".stats-bar");
if (statsBar) {
  statsObserver.observe(statsBar);
}

function animateValue(element, start, end, duration, isPlus = false) {
  let startTimestamp = null;

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value + (isPlus ? "+" : "");
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}

// Parallax scroll effect
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector(".hero-background");
  if (heroBackground && scrolled < window.innerHeight) {
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Service card hover effect
const serviceCards = document.querySelectorAll(".service-card");
serviceCards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
  });
});

// Project card overlay effect
const projectCards = document.querySelectorAll(".project-card");
projectCards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    const overlay = this.querySelector(".project-overlay");
    if (overlay) {
      overlay.style.background =
        "linear-gradient(to bottom, rgba(10, 22, 40, 0.3) 0%, rgba(10, 22, 40, 0.95) 100%)";
    }
  });

  card.addEventListener("mouseleave", function () {
    const overlay = this.querySelector(".project-overlay");
    if (overlay) {
      overlay.style.background =
        "linear-gradient(to bottom, transparent 0%, rgba(10, 22, 40, 0.9) 100%)";
    }
  });
});

// Page load animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease-in";
    document.body.style.opacity = "1";
  }, 100);
});

// EmailJS Setup - Safe load with fallback
document.addEventListener("DOMContentLoaded", () => {
  if (typeof emailjs === "undefined") {
    console.error("EmailJS failed to load. Check CDN or network.");
    showNotification(
      "error",
      "Contact form not loaded. Please refresh the page."
    );
    return;
  }

  emailjs.init({
    publicKey: "qaMtidYJGplfn6A4t", // Use object format (recommended for v4)
  });

  const contactForm = document.querySelector(".contact-form");

  if (!contactForm) {
    console.error("Contact form not found!");
    return;
  }

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    if (!submitBtn) return;

    const originalText = submitBtn.textContent;

    // Collect values
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const service = document.getElementById("service").value;
    const budget = document.getElementById("budget").value || "Not specified";
    const message = document.getElementById("message").value.trim();
    const consent = document.getElementById("consent").checked;

    // Validation
    if (!name || !phone || !email || !service || !message || !consent) {
      showNotification(
        "error",
        "Please fill all required fields and agree to be contacted."
      );
      return;
    }

    // Sending state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    submitBtn.style.opacity = "0.7";

    try {
      await emailjs.send("service_28h81ff", "template_zv3col2", {
        to_email: "emekaejiogu400@gmail.com",
        from_name: name,
        from_email: email,
        phone_number: phone,
        service_type: service,
        budget_range: budget,
        message: message,
      });

      showNotification(
        "success",
        `Thank you, ${name}! Your message was sent successfully.`
      );
      contactForm.reset();

      submitBtn.textContent = "✓ Message Sent!";
      submitBtn.style.backgroundColor = "#28a745";

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = "";
        submitBtn.style.opacity = "1";
        submitBtn.disabled = false;
      }, 3000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      showNotification(
        "error",
        "Failed to send message. Please try again or call 070-6546-5517."
      );

      submitBtn.textContent = "Failed – Try Again";
      submitBtn.style.backgroundColor = "#dc3545";

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.backgroundColor = "";
        submitBtn.style.opacity = "1";
        submitBtn.disabled = false;
      }, 3000);
    }
  });
});
