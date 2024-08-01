document.addEventListener('DOMContentLoaded', function() {
    const titleInput = document.getElementById('title_input');
    const contentInput = document.getElementById('content_input');
    const hashtagButtons = document.querySelectorAll('.hashtag-btn');
    const saveButton = document.getElementById('save_btn');

    let selectedHashtag = null;

    function updateSaveButtonState() {
        const isTitleFilled = titleInput.value.trim() !== '';
        const isContentFilled = contentInput.value.trim() !== '';
        const isHashtagSelected = selectedHashtag !== null;

        if (isTitleFilled && isContentFilled && isHashtagSelected) {
            saveButton.classList.add('active');
            saveButton.disabled = false;
        } else {
            saveButton.classList.remove('active');
            saveButton.disabled = true;
        }
    }

    titleInput.addEventListener('input', updateSaveButtonState);
    contentInput.addEventListener('input', updateSaveButtonState);

    hashtagButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (selectedHashtag === this) {
                selectedHashtag.classList.remove('selected');
                selectedHashtag = null;
            } else {
                if (selectedHashtag) {
                    selectedHashtag.classList.remove('selected');
                }
                selectedHashtag = this;
                selectedHashtag.classList.add('selected');
            }
            updateSaveButtonState();
        });
    });

    updateSaveButtonState();
});//이것은 모두 전송 버튼에 대한 활성화 , 비활성화를 두고 적은 코드임을 알아주세요 

//ajax 작성 시, saveButton을 눌렀을 때 POST 하면 되겠죠!!!!

