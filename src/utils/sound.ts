// 音效工具模块

// 音效类型
export type SoundType = 'correct' | 'wrong' | 'levelComplete' | 'click' | 'bgm'

// 音效管理器
class SoundManager {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map()
  private enabled: boolean = true
  private bgmEnabled: boolean = true
  private speechSynthesis: SpeechSynthesis | null = null
  
  constructor() {
    this.init()
    
    // 初始化时预加载语音列表
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // 强制触发语音加载
      window.speechSynthesis.getVoices();
    }
  }
  
  // 初始化音效
  private init() {
    // 从本地存储加载设置
    const settings = localStorage.getItem('gameSettings')
    if (settings) {
      const { soundEnabled, musicEnabled } = JSON.parse(settings)
      this.enabled = soundEnabled !== undefined ? soundEnabled : true
      this.bgmEnabled = musicEnabled !== undefined ? musicEnabled : true
    }
    
    // 初始化语音合成
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.speechSynthesis = window.speechSynthesis
      
      // 确保语音列表加载完成
      if (this.speechSynthesis.onvoiceschanged !== undefined) {
        this.speechSynthesis.onvoiceschanged = () => {
          console.log('语音列表已加载');
        };
      }
    }
    
    // 预加载音效
    this.preloadSounds()
  }
  
  // 预加载音效
  private preloadSounds() {
    // 正确答案音效
    this.loadSound('correct', '/sounds/correct.mp3')
    this.loadSound('wrong', '/sounds/wrong.mp3')
    this.loadSound('levelComplete', '/sounds/level-complete.mp3')
    this.loadSound('click', '/sounds/click.mp3')
    this.loadSound('bgm', '/sounds/bgm.mp3')
  }
  
  // 加载单个音效
  private loadSound(type: SoundType, url: string) {
    const audio = new Audio(url)
    this.sounds.set(type, audio)
  }
  
  // 播放音效
  public play(type: SoundType) {
    // 如果音效已禁用，则不播放
    if (!this.enabled && type !== 'bgm') return
    if (!this.bgmEnabled && type === 'bgm') return
    
    const sound = this.sounds.get(type)
    if (sound) {
      // 重置音效，以便可以连续播放
      if (type !== 'bgm') {
        sound.currentTime = 0
      }
      sound.play().catch(err => {
        console.warn('音效播放失败:', err)
      })
    }
  }
  
  // 播放单词发音
  public speakWord(word: string) {
    if (!this.enabled || !this.speechSynthesis) return
    
    // 停止当前正在播放的语音
    this.speechSynthesis.cancel()
    console.log('准备播放单词:', word);
    
    // 创建语音合成实例
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US' // 设置为英语发音
    utterance.rate = 0.8 // 稍微放慢语速，适合幼儿园小朋友
    
    try {
      // 获取可用的语音
      let voices = this.speechSynthesis.getVoices();
      
      // 如果语音列表为空，可能是因为尚未加载完成，尝试延迟执行
      if (voices.length === 0) {
        console.log('语音列表为空，尝试延迟加载...');
        // 使用setTimeout延迟100ms再次尝试
        setTimeout(() => {
          this.speakWordWithVoices(word);
        }, 100);
        return;
      }
      
      // 正常播放
      this.speakWordWithVoices(word);
    } catch (error) {
      console.error('语音播放失败:', error);
    }
  }
  
  // 使用已加载的语音播放单词
  private speakWordWithVoices(word: string) {
    if (!this.speechSynthesis) return;
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    
    // 获取可用的语音
    const voices = this.speechSynthesis.getVoices();
    const englishVoices = voices.filter(voice => voice.lang.includes('en-US'));
    console.log('可用的英语语音列表:', englishVoices);
    
    // 设置英语语音
    if (englishVoices.length > 0) {
      utterance.voice = englishVoices[0];
      console.log('已选择语音:', utterance.voice.name);
    }
    
    // 添加错误处理
    utterance.onerror = (event) => {
      console.error('语音合成错误:', event);
    };
    
    // 添加播放完成回调
    utterance.onend = () => {
      console.log('单词播放完成');
    };
    
    // 播放语音
    this.speechSynthesis.speak(utterance);
  }
  
  // 停止音效
  public stop(type: SoundType) {
    const sound = this.sounds.get(type)
    if (sound) {
      sound.pause()
      sound.currentTime = 0
    }
  }
  
  // 停止所有音效
  public stopAll() {
    this.sounds.forEach(sound => {
      sound.pause()
      sound.currentTime = 0
    })
  }
  
  // 设置音效开关
  public setEnabled(enabled: boolean) {
    this.enabled = enabled
    this.saveSettings()
    
    // 如果禁用音效，停止所有非背景音乐的音效
    if (!enabled) {
      this.sounds.forEach((sound, type) => {
        if (type !== 'bgm') {
          sound.pause()
          sound.currentTime = 0
        }
      })
    }
  }
  
  // 设置背景音乐开关
  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled
    this.saveSettings()
    
    // 根据设置播放或停止背景音乐
    if (enabled) {
      const bgm = this.sounds.get('bgm')
      if (bgm) {
        bgm.loop = true
        bgm.play().catch(err => console.error('播放背景音乐失败:', err))
      }
    } else {
      this.stop('bgm')
    }
  }
  
  // 保存设置到本地存储
  private saveSettings() {
    const settings = {
      soundEnabled: this.enabled,
      musicEnabled: this.bgmEnabled
    }
    localStorage.setItem('gameSettings', JSON.stringify(settings))
  }
}

// 创建单例实例
const soundManager = new SoundManager()

// 导出便捷方法
export const playSound = (type: SoundType) => soundManager.play(type)
export const playWordSound = (word: string) => soundManager.speakWord(word)
export const stopSound = (type: SoundType) => soundManager.stop(type)
export const stopAllSounds = () => soundManager.stopAll()
export const setSoundEnabled = (enabled: boolean) => soundManager.setEnabled(enabled)
export const setBgmEnabled = (enabled: boolean) => soundManager.setBgmEnabled(enabled)