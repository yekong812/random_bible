// 이미지 경로 배열을 수정하여 PNG와 JPG 파일을 모두 포함
/*const images = [
    ...Array.from({length: 150}, (_, i) => `images/image${i + 1}.jpg`),  // JPG 이미지
    ...Array.from({length: 150}, (_, i) => `images/image${i + 151}.png`)  // PNG 이미지
];
*/
// 테스트용 5개 이미지 배열
const images = [
    'images/image1.jpg',
    'images/image2.jpg',
    'images/image3.jpg',
    'images/image4.png'
];

function startRandomPick() {
    const userName = document.getElementById('userName').value;
    if (!userName) {
        alert('이름을 입력해주세요!');
        return;
    }

    // 이름을 localStorage에 저장
    localStorage.setItem('userName', userName);

    // 첫 번째 페이지를 숨기고 두 번째 페이지(로딩)를 보여줌
    document.getElementById('namePage').style.display = 'none';
    document.getElementById('loadingPage').style.display = 'block';

     // 2초 후에 세 번째 페이지로 전환
    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * images.length);
        const selectedImage = images[randomIndex];
        const userName = localStorage.getItem('userName');

        document.getElementById('randomImage').src = selectedImage;
        document.querySelector('.user-name-label').textContent = userName;
        document.getElementById('loadingPage').style.display = 'none';
        document.getElementById('resultPage').style.display = 'block';
    }, 2000);
}

function saveImage() {
    const resultContainer = document.querySelector('.result-container');
    const randomImage = document.getElementById('randomImage');
    const fileExtension = randomImage.src.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
    
    captureAndSave(fileExtension);
}

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
}