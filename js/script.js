// 페이지 히스토리 관리
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('index.html')) {
        history.pushState(null, null, location.href);
        window.onpopstate = function() {
            window.location.replace('about:blank');
        };
    }
});

// ! --------------- index.html 페이지 --------------- !




// ! --------------- input.html 페이지 --------------- !
if (window.location.pathname.includes('input.html')) {
    const nameInput = document.getElementById('nameInput');
    const charCounter = document.getElementById('currentLength');
    if (nameInput && charCounter) {
        // 입력창 글자수 카운트
        nameInput.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCounter.textContent = currentLength;
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
    window.location.replace('loading.html');
}


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

// ! --------------- loading.html 페이지 --------------- !
// 로딩 아이콘 배열
const loadingIcons = [
    'images/loading_icon1.svg',
    'images/loading_icon2.svg',
    'images/loading_icon3.svg',
    'images/loading_icon4.svg',
    'images/loading_icon5.svg'
];

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
            window.location.replace('result.html');
        }, 4000);
    }).catch(error => {
        console.error('이미지 생성 중 오류 발생:', error);
        // 오류 발생 시 처리
        alert('오류가 발생했습니다. 다시 시도해주세요.');
        window.location.replace('index.html');
    });
}

// ! --------------- result.html 페이지 --------------- !

// 성경 구절 파싱 함수
async function getBibleVerses() {
    try {
        const response = await fetch('./data/bible.txt');
        const text = await response.text();
        
        // 정규식을 사용하여 큰따옴표로 둘러싸인 부분을 추출
        const verses = text.match(/"([^"]*)"/g)
            .map(verse => {
                // 따옴표 제거 및 쉼표로 구절과 위치 분리
                const [content, location] = verse.slice(1, -1).split('|').map(s => s.trim());
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
    // 타입 1 배경 (텍스트 배치2(로고o), 흰색)
    'images/bible_background/1-1.png',
    'images/bible_background/1-2.png',
    'images/bible_background/1-3.png',
    'images/bible_background/1-4.png',
    'images/bible_background/1-5.png',
    'images/bible_background/1-6.png',
    'images/bible_background/1-7.png',
    'images/bible_background/1-8.png',
    'images/bible_background/1-9.png',
    'images/bible_background/1-10.png',
    'images/bible_background/1-11.png',
    
    // 타입 2 배경 (텍스트 배치2(로고o), 검정색)
    'images/bible_background/2-1.png',
    'images/bible_background/2-2.png',
    'images/bible_background/2-3.png',
    'images/bible_background/2-4.png',
    
    // 타입 3 배경 (텍스트 배치1(로고x), 흰색)
    'images/bible_background/3-1.png',
    'images/bible_background/3-2.png',
    'images/bible_background/3-3.png',
    'images/bible_background/3-4.png',
    'images/bible_background/3-5.png',
    'images/bible_background/3-6.png',
    'images/bible_background/3-7.png',
    
    // 타입 4 배경 (텍스트 배치1(로고x), 검정색)
    'images/bible_background/4-1.png',
    'images/bible_background/4-2.png',
    'images/bible_background/4-3.png',
    'images/bible_background/4-4.png',
    'images/bible_background/4-5.png',
    'images/bible_background/4-6.png',
    'images/bible_background/4-7.png',
    'images/bible_background/4-8.png',
];

// 랜덤 요소 선택 함수
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// 배경 이미지 타입 확인 함수 수정
function getBackgroundType(backgroundPath) {

    if (backgroundPath.includes('1-')) {
        return { isType2Layout: true, isBlackText: false };  // 타입 1: 로고o, 흰색
    } else if (backgroundPath.includes('2-')) {
        return { isType2Layout: true, isBlackText: true };   // 타입 2: 로고o, 검정색
    } else if (backgroundPath.includes('3-')) {
        return { isType2Layout: false, isBlackText: false }; // 타입 3: 로고x, 흰색
    } else if (backgroundPath.includes('4-')) {
        return { isType2Layout: false, isBlackText: true };  // 타입 4: 로고x, 검정색
    }
    return { isType2Layout: false, isBlackText: false }; // 기본값
}

// 이미지 생성 함수
async function generateVerseImage() {
    const userName = localStorage.getItem('userName');
    const verses = await getBibleVerses();
    const randomVerse = getRandomElement(verses);
    const randomBackground = getRandomElement(backgroundImages);

    localStorage.setItem('selectedBackground', randomBackground);
    localStorage.setItem('selectedVerse', JSON.stringify(randomVerse));

    // Canvas 생성
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { 
        alpha: true,
        antialias: true // 안티앨리어싱 활성화
    });

    canvas.width = 528;
    canvas.height = 832;

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
            const radius = 30;
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
            ctx.roundRect(0, 0, canvas.width, canvas.height, 30); // 라운드 반경 20px
            ctx.clip(); 
            
            // 배경 이미지 타입 확인
            const { isType2Layout, isBlackText } = getBackgroundType(randomBackground);
           
            // 텍스트 색상 설정
            ctx.fillStyle = isBlackText ? '#000000' : '#FFFFFF';
            ctx.textAlign = 'center';
            
            if (isType2Layout) {
                // 로고 O
                
                // 연도
                ctx.font = '24px "Pretendard"';
                ctx.fillText('2025', canvas.width/2, canvas.height/2 - 170);
                
                // 사용자 이름
                ctx.font = '24px "Pretendard"';
                ctx.fillText(`${userName}에게 주신 말씀`, canvas.width/2, canvas.height/2 - 130);
                
                // 성경 구절
                ctx.font = '24px "Pretendard"';
                const lines = randomVerse.content.split('/').map(line => line.trim());
                const lineHeight = 40;
                const startY = (canvas.height/2);
                
                lines.forEach((line, i) => {
                    ctx.fillText(line, canvas.width/2, startY + (i * lineHeight));
                });
                
                // 구절 위치
                ctx.font = '24px "Pretendard"';
                ctx.fillText(randomVerse.location, canvas.width/2, canvas.height - 150);
                
            } else {
                // 로고 X

                // 연도
                ctx.font = '24px "Pretendard"';
                ctx.fillText('2025', canvas.width/2, 150);
                
                // 사용자 이름
                ctx.font = '24px "Pretendard"';
                ctx.fillText(`${userName}에게 주신 말씀`, canvas.width/2, 200);
                
                // 성경 구절
                ctx.font = '24px "Pretendard"';
                const lines = randomVerse.content.split('/').map(line => line.trim());
                
                // 중앙 배치를 위한 계산
                const lineHeight = 40;
                const totalTextHeight = (lines.length-1) * lineHeight;
                const centerY = canvas.height / 2;
                const startY = centerY - (totalTextHeight / 2) + 30;
                
                
                lines.forEach((line, i) => {
                    ctx.fillText(line, canvas.width/2, startY + (i * lineHeight));
                });
                
                // 몇장몇절
                ctx.font = '24px "Pretendard"';
                ctx.fillText(randomVerse.location, canvas.width/2, canvas.height - 150);
            }
            
            ctx.restore();
            resolve();
        };
    });

    return canvas.toDataURL('image/png', 1.0);
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
    window.location.replace('index.html');
}

// 이미지 저장 버튼 함수
function saveImage() {    
    window.location.replace('save.html');
}

// ! --------------- save.html 페이지 --------------- !

// 이미지 저장 페이지에서 실행될 코드
if (window.location.pathname.includes('save.html')) {
    // 이전에 선택된 구절과 배경 가져오기
    const verse = JSON.parse(localStorage.getItem('selectedVerse'));
    const backgroundPath = localStorage.getItem('selectedBackground');
    const userName = localStorage.getItem('userName');
    
    console.log('Original background:', backgroundPath);
    
    if (verse && backgroundPath && userName) {
        // -bg 버전의 배경 이미지 경로 생성
        const highResBackground = backgroundPath.replace('.png', '-bg.png');
        console.log('High-res background:', highResBackground);
        
        // Canvas 생성
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 1500;
        canvas.height = 3248;
        
        // 배경 이미지 로드
        const backgroundImg = new Image();
        backgroundImg.src = highResBackground;
        
        backgroundImg.onload = () => {
            // 배경 이미지 그리기
            ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
            
            // 배경 타입에 따른 텍스트 스타일 설정
            const { isType2Layout, isBlackText } = getBackgroundType(backgroundPath);
            
            // 텍스트 색상 설정
            ctx.fillStyle = isBlackText ? '#000000' : '#FFFFFF';
            ctx.textAlign = 'center';
            
            if (isType2Layout) {
                // 로고(o)

                // 연도
                ctx.font = 'bold 60px "Pretendard"';
                ctx.fillText('2025', canvas.width/2, canvas.height/2 - 640);
                
                // 사용자 이름
                ctx.font = 'bold 60px "Pretendard"';
                ctx.fillText(`${userName}에게 주신 말씀`, canvas.width/2, canvas.height/2 - 520);
                
                // 성경 구절
                ctx.font = 'bold 60px "Pretendard"';
                const lines = verse.content.split('/');
                const lineHeight = 100;
                const startY = (canvas.height/2);
                
                lines.forEach((line, i) => {
                    ctx.fillText(line.trim(), canvas.width/2, startY + (i * lineHeight));
                });
                
                // 몇장몇절
                ctx.font = 'bold 60px "Pretendard"';
                ctx.fillText(verse.location, canvas.width/2, canvas.height - 800);
                
            } else {
                // 로고(x)

                // 연도
                ctx.font = 'bold 60px "Pretendard"';
                ctx.fillText('2025', canvas.width/2, 700);
                
                // 사용자 이름
                ctx.font = 'bold 60px "Pretendard"';
                ctx.fillText(`${userName}에게 주신 말씀`, canvas.width/2, 820);
                
                // 성경 구절
                ctx.font = 'bold 60px "Pretendard"';
                const lines = verse.content.split('/');
                const lineHeight = 100;
                const totalTextHeight = lines.length * lineHeight;
                const startY = (canvas.height/2) - (totalTextHeight/2);
                
                lines.forEach((line, i) => {
                    ctx.fillText(line.trim(), canvas.width/2, startY + (i * lineHeight));
                });
                
                // 몇장몇절
                ctx.font = 'bold 60px "Pretendard"';
                ctx.fillText(verse.location, canvas.width/2, canvas.height - 800);
            }
            
            // 생성된 이미지를 화면에 표시
            document.getElementById('saveImage').src = canvas.toDataURL('image/png', 1.0);
        };
        
        // 이미지 로드 실패 시 에러 처리
        backgroundImg.onerror = () => {
            console.error('Failed to load background image:', highResBackground);
        };
    }
}

/*
// 최종 이미지 저장 함수
function downloadFinalImage() {
    const saveImage = document.getElementById('saveImage');
    const link = document.createElement('a');
    link.href = saveImage.src;
    link.download = 'final_verse.png';
    link.click();
}*/