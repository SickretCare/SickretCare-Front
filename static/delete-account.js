document.addEventListener("DOMContentLoaded", function () {
  const passwordInputs = document.querySelectorAll(
    '.form-input[type="password"]'
  );
  const passwordInput = passwordInputs[0];
  const passwordConfirmInput = passwordInputs[1];
  const pwMsg = document.getElementById("pw-msg-2");
  const deleteAccountBtn = document.querySelector(".delete-account-btn");

  pwMsg.style.display = "none";

  function validatePasswords() {
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    if (password && passwordConfirm) {
      if (password !== passwordConfirm) {
        pwMsg.style.display = "inline";
        deleteAccountBtn.disabled = true;
        deleteAccountBtn.style.backgroundColor = "#9E9E9E";
      } else {
        pwMsg.style.display = "none";
        deleteAccountBtn.disabled = false;
        deleteAccountBtn.style.backgroundColor = "#3B89FF";
      }
    } else {
      pwMsg.style.display = "none";
      deleteAccountBtn.disabled = true;
      deleteAccountBtn.style.backgroundColor = "#9E9E9E";
    }
  }

  passwordInput.addEventListener("input", validatePasswords);
  passwordConfirmInput.addEventListener("input", validatePasswords);

  deleteAccountBtn.addEventListener("click", function (event) {
    if (deleteAccountBtn.disabled) {
      event.preventDefault();
    } else {
      alert("회원 탈퇴가 완료되었습니다.");
      window.location.href = "./login.html";
    }
  });

  validatePasswords();
});
