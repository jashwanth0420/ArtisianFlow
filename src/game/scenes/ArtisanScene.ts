import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { ArtisanCharacter } from '../objects/ArtisanCharacter';

const NODE_X_POSITIONS = [
  400,  // Stop 0: N-00
  1200, // Stop 1: N-01
  2000, // Stop 2: N-02
  2900, // Stop 3: N-03
  3800, // Stop 4: N-04/05
  4700, // Stop 5: N-06
  5600  // Stop 6: N-07
];

export class ArtisanScene extends Phaser.Scene {
  private currentStop: number = 0;
  private isMobileMode: boolean = false;
  
  private artisan!: ArtisanCharacter;
  
  // Specific state graphics
  private stateItems: Phaser.GameObjects.GameObject[] = [];
  private activeEmitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
  
  // Physics group for order cards
  private orderCards!: Phaser.Physics.Arcade.Group;
  private cardSpawnTimer?: Phaser.Time.TimerEvent;

  // Background layers
  private bgFar!: Phaser.GameObjects.Graphics;
  private bgMid!: Phaser.GameObjects.Graphics;
  private groundGlow!: Phaser.GameObjects.Graphics;

  constructor() {
    super('ArtisanScene');
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    
    // 1. Create Parallax & Full-bleed Backgrounds
    this.createBackgrounds(w, h);

    // 2. Create the literal Artisan Character
    const initialX = this.isMobileMode ? (w / 2) : NODE_X_POSITIONS[0];
    const initialY = this.isMobileMode ? (h * 0.70) : (h * 0.75);
    this.artisan = new ArtisanCharacter(this, initialX, initialY);
    
    // Set camera origin to match React transform-origin
    this.cameras.main.setOrigin(0, 0);
    
    // Listen to React continuous scroll & mobile mode events
    EventBus.on('sync-scroll', this.handleSyncScroll, this);
    
    // Init state 0
    this.transitionToState(0);
    
    // Window resize
    this.scale.on('resize', this.handleResize, this);
  }
  
  private createBackgrounds(w: number, h: number) {
    // Parallax background (Far) - Abstract mountains/night horizon
    this.bgFar = this.add.graphics();
    this.bgFar.setScrollFactor(0.2);
    this.bgFar.fillStyle(0x130e22, 1);
    this.bgFar.beginPath();
    this.bgFar.moveTo(0, h);
    this.bgFar.lineTo(0, h * 0.65);
    this.bgFar.lineTo(800, h * 0.50);
    this.bgFar.lineTo(1600, h * 0.68);
    this.bgFar.lineTo(2400, h * 0.45);
    this.bgFar.lineTo(3200, h * 0.60);
    this.bgFar.lineTo(4800, h * 0.50);
    this.bgFar.lineTo(6400, h * 0.65);
    this.bgFar.lineTo(6400, h);
    this.bgFar.fillPath();

    // Parallax background (Mid) - Huts to modern digital structures
    this.bgMid = this.add.graphics();
    this.bgMid.setScrollFactor(0.5);
    this.bgMid.fillStyle(0x1e1732, 1);
    
    // Village huts near start
    for (let i = 0; i < 6; i++) {
      const bx = 150 + i * 380;
      this.bgMid.fillRect(bx, h * 0.70, 140, h * 0.30);
      this.bgMid.fillTriangle(bx - 20, h * 0.70, bx + 160, h * 0.70, bx + 70, h * 0.58);
    }

    // Digital/city buildings towards global marketplace
    this.bgMid.fillStyle(0x282042, 1);
    for (let i = 0; i < 18; i++) {
      const bx = 2400 + i * 260;
      const bh = 140 + (i % 5) * 45;
      this.bgMid.fillRect(bx, h * 0.78 - bh, 160, bh + h * 0.22);
      // Window matrix lights
      this.bgMid.fillStyle(0x8b5cf6, 0.4);
      this.bgMid.fillRect(bx + 20, h * 0.78 - bh + 25, 30, 30);
      this.bgMid.fillRect(bx + 85, h * 0.78 - bh + 65, 30, 30);
      this.bgMid.fillStyle(0x282042, 1);
    }

    // Ground platform layer to ensure no dark void at bottom
    this.groundGlow = this.add.graphics();
    this.groundGlow.setScrollFactor(0);
    this.groundGlow.fillStyle(0x0e091a, 0.95);
    this.groundGlow.fillRect(0, h * 0.74, w, h * 0.26);
    this.groundGlow.lineStyle(1.5, 0x8b5cf6, 0.35);
    this.groundGlow.lineBetween(0, h * 0.74, w, h * 0.74);
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
    const targetY = this.isMobileMode ? (gameSize.height * 0.70) : (gameSize.height * 0.75);
    this.artisan.baseY = targetY;
    this.artisan.y = targetY;
    if (this.isMobileMode) {
      this.artisan.x = gameSize.width / 2;
    }

    if (this.groundGlow) {
      this.groundGlow.clear();
      this.groundGlow.fillStyle(0x0e091a, 0.95);
      this.groundGlow.fillRect(0, gameSize.height * 0.74, gameSize.width, gameSize.height * 0.26);
      this.groundGlow.lineStyle(1.5, 0x8b5cf6, 0.35);
      this.groundGlow.lineBetween(0, gameSize.height * 0.74, gameSize.width, gameSize.height * 0.74);
    }
  }

  private handleSyncScroll(data: { stop: number, tx: number, progress: number, scale?: number, isMobile?: boolean }) {
    if (!this.cameras || !this.cameras.main) return;

    const isMobile = !!data.isMobile;
    const modeChanged = this.isMobileMode !== isMobile;
    this.isMobileMode = isMobile;

    if (isMobile) {
      // On mobile: frame directly within the phone viewport
      this.cameras.main.setZoom(1);
      this.cameras.main.scrollX = 0;
    } else {
      if (data.scale) {
        this.cameras.main.setZoom(data.scale);
      }
      this.cameras.main.scrollX = data.tx;
    }

    if (this.currentStop !== data.stop || modeChanged) {
      this.currentStop = data.stop;
      this.transitionToState(data.stop);
    }
  }

  private clearCurrentState() {
    this.stateItems.forEach(item => {
      if (item && item.destroy) item.destroy();
    });
    
    this.activeEmitters.forEach(emitter => {
      if (emitter) emitter.destroy();
    });
    
    if (this.cardSpawnTimer) {
      this.cardSpawnTimer.destroy();
      this.cardSpawnTimer = undefined;
    }
    
    this.stateItems = [];
    this.activeEmitters = [];
  }

  private transitionToState(stop: number) {
    this.clearCurrentState();
    
    const h = this.cameras.main.height;
    const w = this.cameras.main.width;
    const targetX = this.isMobileMode ? (w / 2) : NODE_X_POSITIONS[stop];
    const targetY = this.isMobileMode ? (h * 0.70) : (h * 0.75);

    // Artisan motion
    const distance = Math.abs(targetX - this.artisan.x);
    if (distance > 10 || this.isMobileMode) {
      this.artisan.walk();
      this.tweens.add({
        targets: this.artisan,
        x: targetX,
        y: targetY,
        duration: Math.min(1200, Math.max(450, distance * 2)),
        ease: 'Sine.easeInOut',
        onComplete: () => {
          this.applyArtisanPose(stop);
        }
      });
    } else {
      this.applyArtisanPose(stop);
    }

    // Add glowing ground pedestal under the artisan
    const pedestal = this.add.ellipse(targetX, targetY + 38, this.isMobileMode ? 140 : 180, 24, 0xc87533, 0.2);
    pedestal.setStrokeStyle(1.5, 0xc87533, 0.4);
    this.tweens.add({
      targets: pedestal,
      alpha: { from: 0.2, to: 0.45 },
      scaleX: { from: 0.95, to: 1.05 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    this.stateItems.push(pedestal);

    // Trigger state-specific environment effects
    switch(stop) {
      case 0: this.createState0(targetX, h); break;
      case 1: this.createState1(targetX, h); break;
      case 2: this.createState2(targetX, h); break;
      case 3: this.createState3(targetX, h); break;
      case 4: this.createState4(targetX, h); break;
      case 5: this.createState5(targetX, h); break;
      case 6: this.createState6(targetX, h); break;
    }
  }

  private applyArtisanPose(stop: number) {
    if (stop === 0) {
      this.artisan.setSad();
    } else if (stop >= 1 && stop <= 3) {
      this.artisan.setProud();
    } else {
      this.artisan.setHappy();
    }
  }

  // --- States ---
  
  private createState0(x: number, h: number) {
    // STOP 0: ARTISAN Struggle (Dust particles, dim copper lantern light)
    const dustEmitter = this.add.particles(x, 0, 'particle_sparkle', {
      x: { min: -250, max: 250 },
      y: { min: 0, max: h },
      lifespan: 4000,
      speedY: { min: 6, max: 22 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.16, end: 0 },
      alpha: { start: 0.35, end: 0 },
      quantity: 1,
      blendMode: 'ADD'
    });
    this.activeEmitters.push(dustEmitter);
    
    const bgLight = this.add.circle(x, h * 0.68, 220, 0xc87533, 0.08);
    this.tweens.add({
      targets: bgLight,
      alpha: 0.20,
      duration: 2400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    this.stateItems.push(bgLight);
  }
  
  private createState1(x: number, h: number) {
    // STOP 1: AI STUDIO (Laser scanner beam, sparkle bursts)
    const beamWidth = this.isMobileMode ? this.cameras.main.width * 0.9 : 550;
    const scanner = this.add.rectangle(x, 0, beamWidth, 5, 0x8b5cf6, 0.6);
    this.tweens.add({
      targets: scanner,
      y: h * 0.85,
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    const burstEmitter = this.add.particles(x, h * 0.66, 'particle_sparkle', {
      speed: { min: 25, max: 120 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.85, end: 0 },
      lifespan: 1200,
      blendMode: 'ADD',
      frequency: 220,
      quantity: 4,
      tint: [0x8b5cf6, 0xc87533, 0xffffff]
    });
    
    this.stateItems.push(scanner);
    this.activeEmitters.push(burstEmitter);
  }
  
  private createState2(x: number, h: number) {
    // STOP 2: MULTILINGUAL AI (Expanding voice acoustic waves)
    for (let i = 0; i < 4; i++) {
      const circle = this.add.circle(x, h * 0.68, 35, 0x3b82f6, 0);
      circle.setStrokeStyle(1.8, 0x3b82f6);
      
      this.tweens.add({
        targets: circle,
        scale: this.isMobileMode ? 6 : 8,
        alpha: { from: 0.45, to: 0 },
        duration: 2400,
        delay: i * 600,
        repeat: -1
      });
      this.stateItems.push(circle);
    }
    
    const textStyle = { fontFamily: 'monospace', fontSize: this.isMobileMode ? '16px' : '20px', color: '#88aaff', alpha: 0 };
    const texts = ["हस्तनिर्मित", "Handcrafted", "artisanat", "手作り"];
    
    texts.forEach((txt, i) => {
      const spread = this.isMobileMode ? 120 : 250;
      const t = this.add.text(x + (Math.random() * spread - spread / 2), h * 0.65 + (Math.random() * 80 - 40), txt, textStyle);
      t.setOrigin(0.5);
      this.tweens.add({
        targets: t,
        y: t.y - 70,
        alpha: { from: 0, to: 0.85, yoyo: true },
        duration: 2400,
        delay: i * 650,
        repeat: -1
      });
      this.stateItems.push(t);
    });
  }

  private createState3(x: number, h: number) {
    // STOP 3: CATALOG ENGINE (Rotating emerald holographic data rings)
    const ringRadius1 = this.isMobileMode ? 120 : 190;
    const ringRadius2 = this.isMobileMode ? 170 : 260;
    
    const ring1 = this.add.circle(x, h * 0.67, ringRadius1);
    ring1.setStrokeStyle(2.5, 0x10b981, 0.45);
    
    const ring2 = this.add.circle(x, h * 0.67, ringRadius2);
    ring2.setStrokeStyle(1.5, 0x10b981, 0.25);
    
    this.tweens.add({ targets: ring1, scaleX: 0.15, duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: ring2, scaleY: 0.15, duration: 3200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    
    const dataStream = this.add.particles(x, h * 0.72, 'particle_sparkle', {
      speedY: { min: -60, max: -160 },
      speedX: { min: -15, max: 15 },
      scale: { start: 0.45, end: 0 },
      lifespan: 1800,
      quantity: 2,
      frequency: 120,
      tint: 0x10b981
    });
    
    this.stateItems.push(ring1, ring2);
    this.activeEmitters.push(dataStream);
  }

  private createState4(x: number, h: number) {
    // STOP 4: DISCOVERY & PRICING (Dynamic price bars & search ripple)
    const barCount = 5;
    const offset = this.isMobileMode ? 90 : 180;
    
    for (let i = 0; i < barCount; i++) {
      const targetHeight = 45 + Math.random() * 120;
      const bar = this.add.rectangle(x - offset + i * (this.isMobileMode ? 16 : 26), h * 0.74, this.isMobileMode ? 10 : 15, 10, 0xf43f5e, 0.6);
      bar.setOrigin(0.5, 1);
      
      this.tweens.add({
        targets: bar,
        height: targetHeight,
        duration: 1100 + i * 140,
        ease: 'Bounce.easeOut',
        yoyo: true,
        hold: 1800,
        repeat: -1
      });
      this.stateItems.push(bar);
    }
    
    const searchPulse = this.add.circle(x + offset, h * 0.67, 24, 0x8b5cf6, 0.45);
    this.tweens.add({
      targets: searchPulse,
      scale: this.isMobileMode ? 4 : 6,
      alpha: 0,
      duration: 1800,
      repeat: -1
    });
    this.stateItems.push(searchPulse);
  }

  private createState5(x: number, h: number) {
    // STOP 5: DIGITAL MARKETPLACE (Falling order cards shower)
    this.orderCards = this.physics.add.group();
    const spread = this.isMobileMode ? this.cameras.main.width * 0.4 : 380;
    
    this.cardSpawnTimer = this.time.addEvent({
      delay: 360,
      callback: () => {
        const cx = Phaser.Math.Between(x - spread, x + spread);
        const card = this.orderCards.create(cx, -40, 'order_card') as Phaser.Physics.Arcade.Sprite;
        card.setVelocity(Phaser.Math.Between(-12, 12), Phaser.Math.Between(85, 160));
        card.setAngularVelocity(Phaser.Math.Between(-25, 25));
        card.setTint(0x3b82f6);
        card.setAlpha(0.75);
        this.stateItems.push(card);
      },
      loop: true
    });
  }

  private createState6(x: number, h: number) {
    // STOP 6: MARKET ACCESS (Golden celebratory confetti & victorious aura)
    const confetti = this.add.particles(x, -40, 'particle_coin', {
      x: { min: this.isMobileMode ? -this.cameras.main.width / 2 : -500, max: this.isMobileMode ? this.cameras.main.width / 2 : 500 },
      speedY: { min: 90, max: 220 },
      speedX: { min: -35, max: 35 },
      scale: { start: 0.35, end: 0.75 },
      rotate: { start: 0, end: 360 },
      lifespan: 5500,
      quantity: 2,
      frequency: 140,
      tint: [0xffd700, 0xc87533, 0xffffff, 0xf43f5e, 0x10b981]
    });
    
    const glow = this.add.circle(x, h * 0.68, 300, 0xc87533, 0.12);
    this.tweens.add({
      targets: glow,
      scale: 1.35,
      alpha: 0.28,
      duration: 2600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    this.activeEmitters.push(confetti);
    this.stateItems.push(glow);
  }
}
