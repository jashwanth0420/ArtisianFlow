import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const graphics = this.add.graphics();

    // ─────────────────────────────────────────────────────────────
    // 1. PARTICLES & PROPS
    // ─────────────────────────────────────────────────────────────

    // Sparkle particle
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(4, 4, 4);
    graphics.generateTexture('particle_sparkle', 8, 8);
    graphics.clear();

    // Golden coin particle
    graphics.fillStyle(0xffd700, 1);
    graphics.fillCircle(6, 6, 6);
    graphics.lineStyle(2, 0xcda434, 1);
    graphics.strokeCircle(6, 6, 6);
    graphics.generateTexture('particle_coin', 12, 12);
    graphics.clear();

    // E-commerce Order card
    graphics.fillStyle(0x18142a, 0.95);
    graphics.fillRoundedRect(0, 0, 48, 68, 6);
    graphics.lineStyle(1.5, 0x3b82f6, 0.8);
    graphics.strokeRoundedRect(0, 0, 48, 68, 6);
    // Miniature lines on card
    graphics.fillStyle(0x3b82f6, 0.8);
    graphics.fillRect(6, 8, 20, 4);
    graphics.fillStyle(0xffffff, 0.6);
    graphics.fillRect(6, 18, 36, 3);
    graphics.fillRect(6, 26, 28, 3);
    graphics.fillStyle(0x10b981, 0.9);
    graphics.fillRect(6, 48, 18, 12);
    graphics.generateTexture('order_card', 48, 68);
    graphics.clear();

    // Traditional Handcrafted Brass Pot (Kudam / Kalash)
    graphics.fillStyle(0xd49b29, 1);
    graphics.fillEllipse(16, 22, 14, 12); // Round body
    graphics.fillStyle(0xf3c858, 1);
    graphics.fillEllipse(14, 18, 8, 6); // Highlight
    graphics.fillStyle(0xb37e1a, 1);
    graphics.fillRect(10, 8, 12, 6); // Neck
    graphics.fillEllipse(16, 8, 8, 3); // Rim
    graphics.generateTexture('artisan_brass_pot', 32, 36);
    graphics.clear();

    // Terracotta Clay Vase / Pot
    graphics.fillStyle(0xa65028, 1); // Rich clay terracotta
    graphics.fillEllipse(14, 20, 12, 14);
    graphics.fillStyle(0xc4693a, 1);
    graphics.fillEllipse(12, 16, 7, 7); // Soft highlight
    graphics.fillStyle(0x7e3818, 1);
    graphics.fillRect(9, 6, 10, 5);
    graphics.fillEllipse(14, 6, 6, 2.5);
    graphics.generateTexture('artisan_clay_pot', 28, 36);
    graphics.clear();

    // Cane/Wicker Basket with woven goods
    graphics.fillStyle(0x6e4a2a, 1);
    graphics.fillEllipse(18, 16, 16, 10);
    graphics.lineStyle(1.5, 0x93663b, 1);
    graphics.beginPath();
    graphics.moveTo(4, 14);
    graphics.lineTo(32, 14);
    graphics.moveTo(8, 18);
    graphics.lineTo(28, 18);
    graphics.strokePath();
    graphics.generateTexture('artisan_craft_basket', 36, 28);
    graphics.clear();

    // Smartphone prop (with glowing digital screen)
    graphics.fillStyle(0x1a1a24, 1);
    graphics.fillRoundedRect(0, 0, 10, 18, 2);
    graphics.fillStyle(0x38bdf8, 0.9);
    graphics.fillRect(1.5, 2.5, 7, 13);
    graphics.generateTexture('artisan_phone', 10, 18);
    graphics.clear();

    // ─────────────────────────────────────────────────────────────
    // 2. SOUTH INDIAN ARTISAN ANATOMY (Scaled for ~80px world-scale)
    // ─────────────────────────────────────────────────────────────
    const skinTone = 0x6d3e20; // Authentic deep olive/brown skin tone
    const skinHighlight = 0x824d29;
    const baniyanColor = 0xf2ece1; // Traditional off-white cotton vest
    const dhotiColor = 0xfcfbfa; // White cotton dhoti
    const goldZari = 0xd4af37; // Gold border on dhoti
    const gamchaColor = 0xd9532f; // Saffron/Red cotton towel drape

    // Head: Round jaw, oiled black hair bun/cut, red vermilion tilak
    graphics.fillStyle(skinTone, 1);
    graphics.fillCircle(10, 12, 7); // Face
    // Oiled dark hair
    graphics.fillStyle(0x120c08, 1);
    graphics.beginPath();
    graphics.arc(10, 10, 7.5, Math.PI, 0, false);
    graphics.fillPath();
    // Hair knot at back (traditional kudumi / tied hair)
    graphics.fillCircle(3, 8, 3.5);
    // Red tilak on forehead
    graphics.fillStyle(0xb91c1c, 1);
    graphics.fillRect(11, 8, 2, 3);
    graphics.generateTexture('artisan_head', 20, 22);
    graphics.clear();

    // Torso: Cotton Sleeveless Baniyan (Vest)
    graphics.fillStyle(baniyanColor, 1);
    graphics.beginPath();
    graphics.moveTo(3, 0);
    graphics.lineTo(17, 0);
    graphics.lineTo(16, 24);
    graphics.lineTo(4, 24);
    graphics.closePath();
    graphics.fillPath();
    // Subtle neck cut of baniyan
    graphics.fillStyle(skinTone, 1);
    graphics.fillEllipse(10, 0, 4, 3);
    // Shading on side
    graphics.fillStyle(0xd5cec2, 0.5);
    graphics.fillRect(3, 4, 3, 20);
    graphics.generateTexture('artisan_torso', 20, 25);
    graphics.clear();

    // Shoulder Gamcha (Saffron cloth draped over shoulder)
    graphics.fillStyle(gamchaColor, 0.95);
    graphics.beginPath();
    graphics.moveTo(0, 0);
    graphics.lineTo(5, 0);
    graphics.lineTo(6, 26);
    graphics.lineTo(1, 26);
    graphics.closePath();
    graphics.fillPath();
    graphics.fillStyle(0xfde047, 0.8); // Yellow edge stripe
    graphics.fillRect(4, 0, 1, 26);
    graphics.generateTexture('artisan_gamcha', 8, 28);
    graphics.clear();

    // Dhoti (Traditional wrapped unstitched white cloth with gold border)
    graphics.fillStyle(dhotiColor, 1);
    graphics.beginPath();
    graphics.moveTo(3, 0);
    graphics.lineTo(19, 0);
    graphics.lineTo(21, 22); // Flared drapery
    graphics.lineTo(1, 22);
    graphics.closePath();
    graphics.fillPath();
    // Fold lines on dhoti
    graphics.lineStyle(1, 0xddd7cc, 1);
    graphics.lineBetween(11, 0, 11, 22);
    graphics.lineBetween(7, 4, 6, 22);
    // Gold zari border at hem
    graphics.fillStyle(goldZari, 1);
    graphics.fillRect(1, 20, 20, 2);
    graphics.generateTexture('artisan_dhoti', 22, 24);
    graphics.clear();

    // Arms: Upper Arm (skin)
    graphics.fillStyle(skinTone, 1);
    graphics.fillRoundedRect(0, 0, 6, 16, 3);
    graphics.generateTexture('artisan_upper_arm', 6, 16);
    graphics.clear();

    // Forearm with hand
    graphics.fillStyle(skinHighlight, 1);
    graphics.fillRoundedRect(0, 0, 5, 14, 2.5);
    // Hand
    graphics.fillStyle(skinTone, 1);
    graphics.fillCircle(2.5, 15, 3);
    graphics.generateTexture('artisan_forearm', 6, 19);
    graphics.clear();

    // Legs: Lower bare leg (calf and ankle)
    graphics.fillStyle(skinTone, 1);
    graphics.fillRoundedRect(0, 0, 5, 18, 2.5);
    graphics.generateTexture('artisan_leg', 6, 18);
    graphics.clear();

    // Bare Foot
    graphics.fillStyle(skinHighlight, 1);
    graphics.beginPath();
    graphics.moveTo(1, 0);
    graphics.lineTo(5, 0);
    graphics.lineTo(9, 4);
    graphics.lineTo(0, 4);
    graphics.closePath();
    graphics.fillPath();
    graphics.generateTexture('artisan_foot', 10, 5);
    graphics.clear();

    // ─────────────────────────────────────────────────────────────
    // 3. SOUTH INDIAN VILLAGE & CITY ARCHITECTURAL TEXTURES
    // ─────────────────────────────────────────────────────────────

    // Coconut Palm Tree
    // Trunk
    graphics.fillStyle(0x4a321e, 1);
    graphics.beginPath();
    graphics.moveTo(6, 120);
    graphics.lineTo(10, 120);
    graphics.lineTo(8, 0);
    graphics.lineTo(5, 0);
    graphics.closePath();
    graphics.fillPath();
    // Palm Fronds
    graphics.fillStyle(0x2d5a27, 0.95);
    const fronds = [
      [-30, -10], [-35, 10], [-25, 25],
      [30, -10], [35, 10], [25, 25],
      [0, -25]
    ];
    fronds.forEach(([fx, fy]) => {
      graphics.beginPath();
      graphics.moveTo(7, 0);
      graphics.lineTo(7 + fx * 0.5, fy * 0.4);
      graphics.lineTo(7 + fx, fy);
      graphics.lineTo(7 + fx * 0.4, fy * 0.8);
      graphics.closePath();
      graphics.fillPath();
    });
    graphics.generateTexture('bg_palm_tree', 90, 130);
    graphics.clear();

    // South Indian Temple Gopuram Silhouette (Tiered pyramidal structure)
    graphics.fillStyle(0x281938, 0.9);
    const gopuramTiers = [
      { w: 70, h: 14, y: 110 },
      { w: 60, h: 14, y: 96 },
      { w: 50, h: 14, y: 82 },
      { w: 42, h: 14, y: 68 },
      { w: 34, h: 14, y: 54 },
      { w: 26, h: 12, y: 42 },
      { w: 18, h: 12, y: 30 },
      { w: 10, h: 10, y: 20 },
      { w: 4, h: 10, y: 10 }, // Kalasam pinnacles
    ];
    gopuramTiers.forEach(t => {
      graphics.fillRect(45 - t.w / 2, t.y, t.w, t.h);
      // Tier ridges
      graphics.fillRect(45 - (t.w + 6) / 2, t.y + t.h - 3, t.w + 6, 3);
    });
    graphics.generateTexture('bg_gopuram_silhouette', 90, 130);
    graphics.clear();

    // Traditional Village Terracotta Tiled Roof Hut
    // Mud wall (warm ochre / red oxide)
    graphics.fillStyle(0xb56338, 1);
    graphics.fillRect(15, 35, 70, 45);
    // Dark doorway
    graphics.fillStyle(0x26140c, 1);
    graphics.fillRect(42, 45, 16, 35);
    // Window with wooden bars
    graphics.fillStyle(0x1a0f0a, 1);
    graphics.fillRect(22, 48, 12, 14);
    graphics.fillStyle(0xd97736, 1);
    graphics.fillRect(27, 48, 2, 14);
    // Slanted Terracotta Tiled Roof
    graphics.fillStyle(0x943a1d, 1);
    graphics.fillTriangle(5, 35, 95, 35, 50, 8);
    // Tile ridge highlight lines
    graphics.lineStyle(1.5, 0xc2532d, 0.9);
    graphics.lineBetween(15, 35, 50, 8);
    graphics.lineBetween(32, 35, 50, 8);
    graphics.lineBetween(68, 35, 50, 8);
    graphics.lineBetween(85, 35, 50, 8);
    graphics.generateTexture('bg_village_hut', 100, 82);
    graphics.clear();

    // Village Street Lamp / Lantern Post
    graphics.lineStyle(2, 0x3d271d, 1);
    graphics.lineBetween(6, 0, 6, 60);
    graphics.fillStyle(0xf59e0b, 0.85); // Warm glowing lantern
    graphics.fillCircle(6, 6, 5);
    graphics.generateTexture('bg_lantern_post', 14, 62);
    graphics.clear();

    // Modern City Glass Skyscraper Block
    graphics.fillStyle(0x141b2d, 1);
    graphics.fillRect(0, 0, 80, 220);
    graphics.lineStyle(1.5, 0x223254, 1);
    graphics.strokeRect(0, 0, 80, 220);
    // Window grid with mixed warm yellow & electric cyan lights
    for (let r = 8; r < 200; r += 14) {
      for (let c = 8; c < 70; c += 14) {
        if (Math.random() > 0.4) {
          const winColor = Math.random() > 0.35 ? 0xfacc15 : 0x38bdf8;
          graphics.fillStyle(winColor, 0.65);
          graphics.fillRect(c, r, 8, 8);
        }
      }
    }
    graphics.generateTexture('bg_city_tower', 80, 220);
    graphics.clear();

    graphics.destroy();
  }

  create() {
    this.scene.start('ArtisanScene');
  }
}
