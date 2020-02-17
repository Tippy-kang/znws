/**
 * 加密 && 解密
 * @param word 需要加密的内容
 * @returns {string}
 * @constructor
 */

import CryptoJS from 'crypto-js'

let key = CryptoJS.enc.Utf8.parse('abcdef0123456789')

function Encrypt (word) {
  var srcs = CryptoJS.enc.Utf8.parse(word)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

function Decrypt (word) {
  var decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

export {
  Encrypt,
  Decrypt
}
