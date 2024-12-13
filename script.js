// 이미지 경로 배열을 수정하여 PNG와 JPG 파일을 모두 포함
/*const images = [
    ...Array.from({length: 150}, (_, i) => `images/image${i + 1}.jpg`),  // JPG 이미지
    ...Array.from({length: 150}, (_, i) => `images/image${i + 151}.png`)  // PNG 이미지
];
*/



if (window.location.pathname.includes('input.html')) {
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

// 성경 구절 파싱 함수
async function getBibleVerses() {
    try {
        const response = await fetch('bible.txt');
        const text = await response.text();
        
        // 정규식을 사용하여 큰따옴표로 둘러싸인 부분을 추출
        const verses = text.match(/"([^"]*)"/g)
            .map(verse => {
                // 따옴표 제거 및 쉼표로 구절과 위치 분리
                const [content, location] = verse.slice(1, -1).split(',').map(s => s.trim());
                return { content, location };
            });
        
        return verses;
    } catch (error) {
        console.error('성경 구절을 불러오는데 실패했습니다:', error);
        return [];
    }
}

// 배경 이미지 배열
const backgroundImages = [
    // 타입 1 배경 (텍스트 배치1, 흰색)
    'images/bible_background/back1-1.png',
    'images/bible_background/back1-2.png',
    'images/bible_background/back1-3.png',
    'images/bible_background/back1-4.png',
    // 타입 2 배경 (텍스트 배치2, 흰색)
    'images/bible_background/back2-1.png',
    'images/bible_background/back2-2.png',
    'images/bible_background/back2-3.png',
    'images/bible_background/back2-4.png',
    'images/bible_background/back2-5.png',
    // 타입 3 배경 (텍스트 배치1, 검정색)
    'images/bible_background/back3-1.png',
    'images/bible_background/back3-2.png',
    'images/bible_background/back3-3.png',
    'images/bible_background/back3-4.png',
    // 타입 4 배경 (텍스트 배치2, 검정색)
    'images/bible_background/back4-1.png',
    'images/bible_background/back4-2.png',
    'images/bible_background/back4-3.png',
    'images/bible_background/back4-4.png',
];

// 랜덤 요소 선택 함수
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 이미지 생성 함수
async function generateVerseImage() {
    const userName = localStorage.getItem('userName');
    const verses = await getBibleVerses();
    const randomVerse = getRandomElement(verses);
    const randomBackground = getRandomElement(backgroundImages);

    // Canvas 생성
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { 
        alpha: true,
        antialias: true // 안티앨리어싱 활성화
    });

    // 더 높은 해상도 설정
    canvas.width = 600;
    canvas.height = 945;

    // Canvas 초기화 - 완전 투명하게 설정
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경 이미지 로드 및 그리기
    const backgroundImg = new Image();
    backgroundImg.src = randomBackground;
    
    await new Promise((resolve) => {
        backgroundImg.onload = () => {
            // 부드러운 라운드 처리를 위한 설정
            ctx.save();
            ctx.beginPath();
            
            // 각 모서리에 대해 개별적으로 곡선 처리
            const radius = 20;
            ctx.moveTo(radius, 0);
            
            // 상단 오른쪽 모서리
            ctx.lineTo(canvas.width - radius, 0);
            ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
            
            // 하단 오른쪽 모서리
            ctx.lineTo(canvas.width, canvas.height - radius);
            ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
            
            // 하단 왼쪽 모서리
            ctx.lineTo(radius, canvas.height);
            ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
            
            // 상단 왼쪽 모서리
            ctx.lineTo(0, radius);
            ctx.quadraticCurveTo(0, 0, radius, 0);
            
            ctx.closePath();
            ctx.clip();
            
            // 이미지 스무딩 활성화
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // 배경 이미지 그리기
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

            
            // 라운드 처리를 위한 경로 생성
            ctx.beginPath();
            ctx.roundRect(0, 0, canvas.width, canvas.height, 20); // 라운드 반경 20px
            ctx.clip(); 

            // 배경 이미지 타입 확인
            const isType2Layout = randomBackground.includes('back2') || randomBackground.includes('back4');
            const isBlackText = randomBackground.includes('back3') || randomBackground.includes('back4');
            
            // 텍스트 색상 설정
            ctx.fillStyle = isBlackText ? '#000000' : '#FFFFFF';
            ctx.textAlign = 'center';
            
            if (isType2Layout) {
                // 타입 2 레이아웃 (타입 2, 4 배경용)
                // 연도
                ctx.font = 'bold 40px "Noto Sans KR"';
                ctx.fillText('2025', canvas.width/2, canvas.height/2 - 180);
                
                // 사용자 이름
                ctx.font = 'bold 30px "Noto Sans KR"';
                ctx.fillText(`${userName}님에게 주신 말씀`, canvas.width/2, canvas.height/2 - 130);
                
                // 성경 구절
                ctx.font = '24px "Noto Sans KR"';
                // '/'를 기준으로 줄 분리
                const lines = randomVerse.content.split('/').map(line => line.trim());
                
                const totalTextHeight = lines.length * 40;
                const startY = (canvas.height/2) + 40;
                
                lines.forEach((line, i) => {
                    ctx.fillText(line, canvas.width/2, startY + (i * 40));
                });
                
                // 구절 위치
                ctx.font = 'bold 24px "Noto Sans KR"';
                ctx.fillText(randomVerse.location, canvas.width/2, canvas.height * 0.9);
                
            } else {
                // 타입 1 레이아웃 (타입 1, 3 배경용)
                ctx.font = 'bold 40px "Noto Sans KR"';
                ctx.fillText('2025', canvas.width/2, 150);
                
                ctx.font = 'bold 30px "Noto Sans KR"';
                ctx.fillText(`${userName}님에게 주신 말씀`, canvas.width/2, 200);
                
                // 성경 구절
                ctx.font = '24px "Noto Sans KR"';
                const lines = randomVerse.content.split('/').map(line => line.trim());
                
                // 중앙 배치를 위한 계산
                const lineHeight = 40;
                const totalTextHeight = lines.length * lineHeight;
                const startY = (canvas.height/2) - (totalTextHeight/2);
                
                lines.forEach((line, i) => {
                    ctx.fillText(line, canvas.width/2, startY + (i * lineHeight));
                });
                
                // 몇장몇절
                ctx.font = 'bold 24px "Noto Sans KR"';
                ctx.fillText(randomVerse.location, canvas.width/2, canvas.height - 150);
            }
            
            ctx.restore();
            resolve();
        };
    });

    return canvas.toDataURL('image/png', 1.0);
}

// 로딩 페이지에서 실행될 코드 수정
if (window.location.pathname.includes('loading.html')) {
    // 저장된 사용자 이름 표시
    const userName = localStorage.getItem('userName');
    const userNameElement = document.getElementById('userName');
    if (userNameElement && userName) {
        userNameElement.textContent = userName;
    }

    // 이미지 생성 및 저장
    generateVerseImage().then(imageUrl => {
        localStorage.setItem('selectedImage', imageUrl);
        
        // 3초 후 결과 페이지로 이동
        setTimeout(() => {
            window.location.href = 'result.html';
        }, 3000);
    });
}

// 결과 페이지에서 실행될 코드
if (window.location.pathname.includes('result.html')) {
    const savedImage = localStorage.getItem('selectedImage');
    document.getElementById('randomImage').src = savedImage;
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

    html2canvas(resultCard, {
        backgroundColor: null, // 배경을 투명하게 설정
        useCORS: true,
        scale: 8,
        quality: 1.0
    }).then(canvas => {
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

// input 페이지 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('nameInput');
    const pickButton = document.getElementById('pickButton');
    
    if (nameInput && pickButton) {
        nameInput.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                pickButton.classList.add('active');
            } else {
                pickButton.classList.remove('active');
            }
        });
    }
});