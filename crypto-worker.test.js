import { generateKeypair } from './crypto-worker';  // 假设你的 generateKeypair 函数在 'crypto-worker.js' 文件中

describe('RSA Key Generation', () => {
  it('should generate a valid RSA public key pair', async () => {
    // 调用密钥对生成函数
    const publicKey = await generateKeypair();
    
    // 验证生成的公钥不为空
    expect(publicKey).toBeDefined();
    
    // 公钥应该是 Base64 编码的字符串
    expect(publicKey).toMatch(/[A-Za-z0-9+/=]+/);  // 验证是否为 Base64 编码

    // 进一步验证公钥长度：RSA-2048 的公钥长度一般为 451 字符左右
    expect(publicKey.length).toBeGreaterThan(400);  // 根据公钥长度进行简单验证
    expect(publicKey.length).toBeLessThan(500);    // 根据公钥长度进行简单验证
  });
});
import { encrypt, decrypt } from './crypto-worker';  // 假设你的 encrypt 和 decrypt 函数在 'crypto-worker.js' 文件中

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

global.Worker = class {
  constructor() {}
  postMessage = jest.fn((message) => {
    if (message[0] === 'generate-keys') {
      // 模拟 generateKeypair 返回值
      return Promise.resolve('public-key-base64');
    }
    if (message[0] === 'encrypt') {
      // 模拟加密操作
      return Promise.resolve('encrypted-message-base64');
    }
    if (message[0] === 'decrypt') {
      // 模拟解密操作
      return Promise.resolve('Hello, world!');
    }
  });
};

describe('Web Worker Simulation', () => {
  it('should generate keys in Web Worker', async () => {
    const publicKey = await generateKeypair();
    expect(publicKey).toBe('public-key-base64');
  });

  it('should encrypt and decrypt messages using Web Worker', async () => {
    const encryptedMessage = await encrypt('Hello, world!', 'public-key-base64');
    expect(encryptedMessage).toBe('encrypted-message-base64');

    const decryptedMessage = await decrypt(encryptedMessage);
    expect(decryptedMessage).toBe('Hello, world!');
  });
});
