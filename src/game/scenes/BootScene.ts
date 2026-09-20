import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // We will generate procedural textures here so we don't need external assets
    const graphics = this.add.graphics();
    
    // 1. Sparkle particle
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('particle_sparkle', 8, 8);
    graphics.clear();
    
    // 2. Coin particle
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(6, 6, 6);
    graphics.lineStyle(2, 0xcda434, 1);
    graphics.strokeCircle(6, 6, 6);
    graphics.generateTexture('particle_coin', 12, 12);
    graphics.clear();
    
    // 3. Order card (for stop 5)
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRoundedRect(0, 0, 40, 60, 4);
    graphics.lineStyle(2, 0x3b82f6, 1);
    graphics.strokeRoundedRect(0, 0, 40, 60, 4);
    graphics.generateTexture('order_card', 40, 60);
    graphics.clear();
    
    // 4. Artisan body parts (Realistic rounded shapes)
    const color = 0xc87533; // Copper
    
    // Head with Turban
    graphics.fillStyle(color, 1);
    graphics.fillCircle(16, 25, 12); // Face
    graphics.fillEllipse(16, 12, 18, 14); // Turban main
    graphics.fillEllipse(24, 15, 10, 8); // Turban knot
    graphics.generateTexture('artisan_head', 32, 40);
    graphics.clear();
    
    // Torso (Kurta)
    graphics.fillStyle(color, 1);
    graphics.beginPath();
    graphics.moveTo(5, 0);
    graphics.lineTo(25, 0);
    graphics.lineTo(30, 45); // Flared bottom
    graphics.lineTo(0, 45);
    graphics.closePath();
    graphics.fillPath();
    graphics.generateTexture('artisan_torso', 30, 50);
    graphics.clear();
    
    // Limb (Arm/Leg) - Rounded capsule
    graphics.fillStyle(color - 0x111111, 1); // Slightly darker for depth
    graphics.fillRoundedRect(0, 0, 10, 45, 5);
    graphics.generateTexture('artisan_limb_back', 10, 45);
    graphics.clear();

    graphics.fillStyle(color, 1);
    graphics.fillRoundedRect(0, 0, 10, 45, 5);
    graphics.generateTexture('artisan_limb_front', 10, 45);
    graphics.clear();
    
    // Bundle
    graphics.fillStyle(0x5a3e2b, 1);
    graphics.fillEllipse(25, 30, 25, 30);
    graphics.generateTexture('artisan_bundle', 50, 60);
    graphics.clear();
    
    graphics.destroy();
  }

  create() {
    this.scene.start('ArtisanScene');
  }
}
