const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function testUpload() {
  try {
    // Создаем тестовый файл
    const testImagePath = 'test-image.jpg';
    const testImageBuffer = Buffer.from('fake-jpeg-data', 'utf8');
    fs.writeFileSync(testImagePath, testImageBuffer);

    // Создаем FormData
    const form = new FormData();
    form.append('file', fs.createReadStream(testImagePath), {
      filename: 'test-image.jpg',
      contentType: 'image/jpeg'
    });

    console.log('Testing file upload...');
    
    const response = await axios.post('http://localhost:3030/images/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 10000
    });

    console.log('Upload successful:', response.data);
    
    // Удаляем тестовый файл
    fs.unlinkSync(testImagePath);
    
  } catch (error) {
    console.error('Upload failed:', error.response?.data || error.message);
    
    // Удаляем тестовый файл в случае ошибки
    try {
      fs.unlinkSync('test-image.jpg');
    } catch (e) {
      // Игнорируем ошибку удаления
    }
  }
}

testUpload(); 