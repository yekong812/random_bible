// 이미지 경로 배열을 수정하여 PNG와 JPG 파일을 모두 포함
/*const images = [
    ...Array.from({length: 150}, (_, i) => `images/image${i + 1}.jpg`),  // JPG 이미지
    ...Array.from({length: 150}, (_, i) => `images/image${i + 151}.png`)  // PNG 이미지
];
*/



if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    // 첫 페이지(index.html)에서만 실행될 코드
    const nameInput = document.getElementById('nameInput');
    const charCountElement = document.querySelector('.char-count');

    if (nameInput && charCountElement) {
        // 입력창 글자수 카운트
        nameInput.addEventListener('input', function() {
            const charCount = this.value.length;
            charCountElement.textContent = `(${charCount}/10)`;
        });

        // 플레이스홀더 제거 및 복원
        nameInput.addEventListener('focus', function() {
            this.dataset.placeholder = this.placeholder;
            this.placeholder = '';
        });

        nameInput.addEventListener('blur', function() {
            if (!this.value) {  // 입력값이 없을 때만 플레이스홀더 복원
                this.placeholder = this.dataset.placeholder;
            }
        });
    }
}

// 이름 입력 페이지, 말씀 뽑기 시작
function startRandomPick() {
    const nameInput = document.getElementById('nameInput');
    if (!nameInput) return;

    const userName = nameInput.value.trim();
    
    if (!userName) {
        alert('이름을 입력해주세요!');
        return;
    }

    // 이름을 localStorage에 저장
    localStorage.setItem('userName', userName);
    
    // 로딩 페이지로 이동
    window.location.href = 'loading.html';
}


// 로딩 아이콘 배열
const loadingIcons = [
    'images/loading_icon1.svg',
    'images/loading_icon2.svg',
    'images/loading_icon3.svg',
    'images/loading_icon4.svg',
    'images/loading_icon5.svg'
];

// 로딩 페이지에서 실행될 코드
if (window.location.pathname.includes('loading.html')) {
    // 랜덤 아이콘 선택
    const randomIconIndex = Math.floor(Math.random() * loadingIcons.length);
    const randomIcon = loadingIcons[randomIconIndex];
    
    // 아이콘 표시
    const loadingIcon = document.getElementById('loadingIcon');
    if (loadingIcon) {
        const iconImg = document.createElement('img');
        iconImg.src = randomIcon;
        iconImg.alt = '로딩 아이콘';
        loadingIcon.appendChild(iconImg);
    }

    // 저장된 사용자 이름 표시
    const userName = localStorage.getItem('userName');
    const userNameElement = document.getElementById('userName');
    if (userNameElement && userName) {
        userNameElement.textContent = userName;
    }

    // 3초 후 결과 페이지로 이동
    setTimeout(() => {
        window.location.href = 'result.html';
    }, 3000);
}



// 이미지 배열 정의
const images = [
    'images/image1.jpg',
    'images/image2.jpg',
    'images/image3.jpg',
    'images/image4.png'
];

// 결과 페이지에서 실행될 코드
if (window.location.pathname.includes('result.html')) {
    const savedImage = localStorage.getItem('selectedImage');
    
    if (savedImage) {
        // 저장된 이미지가 있으면 그것을 사용
        document.getElementById('randomImage').src = savedImage;
    } else {
        // 저장된 이미지가 없을 때만 새로 랜덤 선택
        const randomIndex = Math.floor(Math.random() * images.length);
        const randomImage = images[randomIndex];
        document.getElementById('randomImage').src = randomImage;
        // 선택된 이미지 저장
        localStorage.setItem('selectedImage', randomImage);
    }
}

// 처음으로 돌아가기 함수 수정
function goToHome() {
    // 저장된 이미지 삭제
    localStorage.removeItem('selectedImage');
    window.location.href = 'index.html';
}



// 이미지 저장 함수
function saveImage() {
    const resultCard = document.getElementById('resultCard');
    if (!resultCard) return;

    html2canvas(resultCard).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'random_verse.png';
        link.click();
    });
}
/*
function captureAndSave(fileExtension) {
    const resultContainer = document.querySelector('.result-container');
    const userName = localStorage.getItem('userName');

    html2canvas(resultContainer).then(canvas => {
        const link = document.createElement('a');
        link.download = `${userName}_random_image.${fileExtension}`;
        const imageType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
        link.href = canvas.toDataURL(imageType, 1.0);
        link.click();
    });
}

function resetPage() {
    document.getElementById('resultPage').style.display = 'none';
    document.getElementById('namePage').style.display = 'block';
    document.getElementById('userName').value = '';
}*/