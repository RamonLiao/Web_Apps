// EmailJS User ID
emailjs.init("uW8sf4GjjiyR8FyvC");

const sendBtn = document.querySelector(".send-btn");
const result = document.querySelector(".result");

sendBtn.addEventListener("click", sendEmail);

function sendEmail() {
  // Get the form data
  const to = document.getElementById("to").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  // Send email with EmailJS
  emailjs
    .send("service_xp54hlk", "template_tou68hi", {
      to_email: to,
      subject: subject,
      message: message,
    })
    .then(
      function () {
        result.innerHTML = "Email sent successfully!";
        result.style.opacity = 1;
      },
      function (error) {
        result.innerHTML = "Email sending failed!";
        result.style.opacity = 1;
        console.log(error);
      }
    );
}
