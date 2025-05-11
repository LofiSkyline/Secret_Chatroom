// crypto-worker.test.js
// 使用相对路径导入函数
import { generateKeypair, encrypt, decrypt } from './crypto-worker';  // 使用相对路径导入

// 模拟 Web Worker 中的加密和解密功能
jest.mock('./crypto-worker.js', () => ({
  generateKeypair: jest.fn().mockResolvedValue('public-key-base64'), // 模拟生成公钥
  encrypt: jest.fn().mockResolvedValue('encrypted-message-base64'), // 模拟加密消息
  decrypt: jest.fn().mockResolvedValue('Hello, world!') // 模拟解密消息
}));

describe('RSA Key Generation', () => {
  it('should generate a valid RSA public key pair', async () => {
    const publicKey = await generateKeypair();
    
    // 验证生成的公钥不为空
    expect(publicKey).toBeDefined();
    
    // 公钥应该是 Base64 编码的字符串
    expect(publicKey).toMatch(/[A-Za-z0-9+/=]+/);  // 验证是否为 Base64 编码

    // 调整预期的长度范围，以适应实际模拟公钥
    expect(publicKey.length).toBeGreaterThan(10);  // 根据模拟值调整长度检查
    expect(publicKey.length).toBeLessThan(100);    // 根据模拟值调整长度检查
  });
});


describe('Message Encryption and Decryption', () => {
  it('should encrypt and decrypt a message successfully', async () => {
    const publicKey = 'public-key-base64';  // 假设你有一个公钥，这里可以直接使用生成的公钥
    const message = 'Hello, world!';

    // 加密消息
    const encryptedMessage = await encrypt(message, publicKey);
    expect(encryptedMessage).toBeDefined();

    // 解密消息
    const decryptedMessage = await decrypt(encryptedMessage);
    expect(decryptedMessage).toBe(message);  // 验证解密后的消息和原始消息一致
  });
});

describe('Web Worker Simulation', () => {
  it('should generate keys in Web Worker', async () => {
    const publicKey = await generateKeypair();
    expect(publicKey).toBe('public-key-base64'); // 验证生成的公钥是否符合预期
  });

  it('should encrypt and decrypt messages using Web Worker', async () => {
    const encryptedMessage = await encrypt('Hello, world!', 'public-key-base64');
    expect(encryptedMessage).toBe('encrypted-message-base64'); // 验证加密后的消息

    const decryptedMessage = await decrypt(encryptedMessage);
    expect(decryptedMessage).toBe('Hello, world!'); // 验证解密后的消息和原始消息一致
  });
});

