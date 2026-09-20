import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { ArtisanScene } from './scenes/ArtisanScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  height: typeof window !== 'undefined' ? window.innerHeight : 800,
  parent: 'game-container',
  backgroundColor: 'transparent',
  transparent: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200, x: 0 },
      debug: false
    }
  },
  scene: [BootScene, ArtisanScene]
};

export const startGame = (parent: string | HTMLElement) => {
  return new Phaser.Game({ ...config, parent });
};
