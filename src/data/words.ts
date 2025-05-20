// 单词数据
import { Word } from '../stores/modules/word'

// 幼儿园适用的简单英语单词列表
export const wordsList: Word[] = [
  // 动物类
  { id: 1, english: 'cat', chinese: '猫', phonetic: '[kæt]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 2, english: 'dog', chinese: '狗', phonetic: '[dɒɡ]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 3, english: 'bird', chinese: '鸟', phonetic: '[bɜːd]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 4, english: 'fish', chinese: '鱼', phonetic: '[fɪʃ]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 5, english: 'duck', chinese: '鸭子', phonetic: '[dʌk]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 6, english: 'pig', chinese: '猪', phonetic: '[pɪɡ]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 7, english: 'cow', chinese: '牛', phonetic: '[kaʊ]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 8, english: 'lion', chinese: '狮子', phonetic: '[ˈlaɪən]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 9, english: 'tiger', chinese: '老虎', phonetic: '[ˈtaɪɡə]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 10, english: 'monkey', chinese: '猴子', phonetic: '[ˈmʌŋki]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  
  // 水果类
  { id: 11, english: 'apple', chinese: '苹果', phonetic: '[ˈæpl]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 12, english: 'banana', chinese: '香蕉', phonetic: '[bəˈnɑːnə]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 13, english: 'orange', chinese: '橙子', phonetic: '[ˈɒrɪndʒ]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 14, english: 'grape', chinese: '葡萄', phonetic: '[ɡreɪp]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 15, english: 'pear', chinese: '梨', phonetic: '[peə]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 16, english: 'peach', chinese: '桃子', phonetic: '[piːtʃ]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 17, english: 'watermelon', chinese: '西瓜', phonetic: '[ˈwɔːtəmelən]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 18, english: 'strawberry', chinese: '草莓', phonetic: '[ˈstrɔːbəri]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  
  // 颜色类
  { id: 19, english: 'red', chinese: '红色', phonetic: '[red]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 20, english: 'blue', chinese: '蓝色', phonetic: '[bluː]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 21, english: 'green', chinese: '绿色', phonetic: '[ɡriːn]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 22, english: 'yellow', chinese: '黄色', phonetic: '[ˈjeləʊ]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 23, english: 'black', chinese: '黑色', phonetic: '[blæk]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 24, english: 'white', chinese: '白色', phonetic: '[waɪt]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 25, english: 'purple', chinese: '紫色', phonetic: '[ˈpɜːpl]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 26, english: 'pink', chinese: '粉色', phonetic: '[pɪŋk]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  
  // 数字类
  { id: 27, english: 'one', chinese: '一', phonetic: '[wʌn]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 28, english: 'two', chinese: '二', phonetic: '[tuː]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 29, english: 'three', chinese: '三', phonetic: '[θriː]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 30, english: 'four', chinese: '四', phonetic: '[fɔː]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 31, english: 'five', chinese: '五', phonetic: '[faɪv]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 32, english: 'six', chinese: '六', phonetic: '[sɪks]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 33, english: 'seven', chinese: '七', phonetic: '[ˈsevn]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 34, english: 'eight', chinese: '八', phonetic: '[eɪt]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 35, english: 'nine', chinese: '九', phonetic: '[naɪn]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 36, english: 'ten', chinese: '十', phonetic: '[ten]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  
  // 身体部位
  { id: 37, english: 'head', chinese: '头', phonetic: '[hed]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 38, english: 'eye', chinese: '眼睛', phonetic: '[aɪ]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 39, english: 'nose', chinese: '鼻子', phonetic: '[nəʊz]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 40, english: 'mouth', chinese: '嘴巴', phonetic: '[maʊθ]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 41, english: 'ear', chinese: '耳朵', phonetic: '[ɪə]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 42, english: 'hand', chinese: '手', phonetic: '[hænd]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 43, english: 'foot', chinese: '脚', phonetic: '[fʊt]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  
  // 家庭成员
  { id: 44, english: 'mom', chinese: '妈妈', phonetic: '[mɒm]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 45, english: 'dad', chinese: '爸爸', phonetic: '[dæd]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 46, english: 'sister', chinese: '姐妹', phonetic: '[ˈsɪstə]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 47, english: 'brother', chinese: '兄弟', phonetic: '[ˈbrʌðə]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 48, english: 'baby', chinese: '婴儿', phonetic: '[ˈbeɪbi]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  
  // 食物类
  { id: 49, english: 'bread', chinese: '面包', phonetic: '[bred]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 50, english: 'milk', chinese: '牛奶', phonetic: '[mɪlk]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 51, english: 'egg', chinese: '鸡蛋', phonetic: '[eɡ]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 52, english: 'water', chinese: '水', phonetic: '[ˈwɔːtə]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 53, english: 'cake', chinese: '蛋糕', phonetic: '[keɪk]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 54, english: 'candy', chinese: '糖果', phonetic: '[ˈkændi]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 55, english: 'ice cream', chinese: '冰淇淋', phonetic: '[ˌaɪs ˈkriːm]', difficulty: 'medium', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  
  // 玩具和物品
  { id: 56, english: 'ball', chinese: '球', phonetic: '[bɔːl]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 57, english: 'doll', chinese: '娃娃', phonetic: '[dɒl]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 58, english: 'book', chinese: '书', phonetic: '[bʊk]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 59, english: 'pen', chinese: '笔', phonetic: '[pen]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
  { id: 60, english: 'car', chinese: '汽车', phonetic: '[kɑː]', difficulty: 'easy', isMastered: false, reviewCount: 0, lastReviewTime: 0 },
]