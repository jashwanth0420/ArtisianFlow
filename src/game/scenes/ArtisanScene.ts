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

  constructor() {
    super('ArtisanScene');
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    
    // 1. Create Parallax Backgrounds
    this.createBackgrounds(w, h);

    // 2. Create the literal Artisan Character
    // We place him at Stop 0 initially.
    this.artisan = new ArtisanCharacter(this, NODE_X_POSITIONS[0], h * 0.75);
    
    // Set camera origin to match React transform-origin
    this.cameras.main.setOrigin(0, 0);
    
    // Listen to React continuous scroll events
    EventBus.on('sync-scroll', this.handleSyncScroll, this);
    
    // Init state 0
    this.transitionToState(0);
    
    // Window resize
    this.scale.on('resize', this.handleResize, this);
  }
  
  private createBackgrounds(w: number, h: number) {
    // Parallax background (Far) - Abstract mountains/shapes
    this.bgFar = this.add.graphics();
    this.bgFar.setScrollFactor(0.2); // Moves slowly
    this.bgFar.fillStyle(0x1a1528, 1);
    this.bgFar.beginPath();
    this.bgFar.moveTo(0, h);
    this.bgFar.lineTo(0, h - 200);
    this.bgFar.lineTo(800, h - 400);
    this.bgFar.lineTo(1600, h - 150);
    this.bgFar.lineTo(2400, h - 500);
    this.bgFar.lineTo(3200, h - 200);
    this.bgFar.lineTo(4000, h);
    this.bgFar.fillPath();

    // Parallax background (Mid) - Transitioning to city/digital
    this.bgMid = this.add.graphics();
    this.bgMid.setScrollFactor(0.5); // Moves medium speed
    this.bgMid.fillStyle(0x2a2540, 1);
    
    // Draw some village huts near the start (X: 0 - 2000)
    for (let i = 0; i < 5; i++) {
      const bx = 200 + i * 400;
      this.bgMid.fillRect(bx, h - 100, 150, 100);
      this.bgMid.fillTriangle(bx - 20, h - 100, bx + 170, h - 100, bx + 75, h - 200);
    }

    // Draw some digital/city blocks near the end (X: 2000 - 6400)
    this.bgMid.fillStyle(0x3a3550, 1);
    for (let i = 0; i < 15; i++) {
      const bx = 2500 + i * 300;
      const bh = 150 + Math.random() * 300;
      this.bgMid.fillRect(bx, h - bh, 180, bh);
      // Window lights
      this.bgMid.fillStyle(0x8b5cf6, 0.5);
      this.bgMid.fillRect(bx + 20, h - bh + 20, 40, 40);
      this.bgMid.fillRect(bx + 100, h - bh + 80, 40, 40);
      this.bgMid.fillStyle(0x3a3550, 1);
    }
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
    this.artisan.baseY = gameSize.height * 0.75;
    this.artisan.y = this.artisan.baseY;
  }

  private handleSyncScroll(data: { stop: number, tx: number, progress: number, scale?: number }) {
    if (data.scale) {
      this.cameras.main.setZoom(data.scale);
    }
    
    // Sync Phaser camera with React horizontal translation
    this.cameras.main.scrollX = data.tx; // Not negative, scrollX is positive for moving right

    if (this.currentStop !== data.stop) {
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
    const targetX = NODE_X_POSITIONS[stop];

    // Make the artisan walk to the new node position
    const distance = Math.abs(targetX - this.artisan.x);
    if (distance > 10) {
      this.artisan.walk();
      this.tweens.add({
        targets: this.artisan,
        x: targetX,
        duration: Math.min(1500, distance * 2), // Walk speed
        ease: 'Sine.easeInOut',
        onComplete: () => {
          this.applyArtisanPose(stop);
        }
      });
    } else {
      this.applyArtisanPose(stop);
    }

    // Trigger state-specific environment effects (in world space)
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

  // --- States (Effects now spawn at the targetX in world space) ---
  
  private createState0(x: number, h: number) {
    // STOP 0: ARTISAN Struggle (Dust particles, dim light)
    const dustEmitter = this.add.particles(x, 0, 'particle_sparkle', {
      x: { min: -500, max: 500 },
      y: { min: 0, max: h },
      lifespan: 4000,
      speedY: { min: 5, max: 20 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.15, end: 0 },
      alpha: { start: 0.3, end: 0 },
      quantity: 1,
      blendMode: 'ADD'
    });
    this.activeEmitters.push(dustEmitter);
    
    const bgLight = this.add.circle(x, h/2, 400, 0xc87533, 0.05);
    this.tweens.add({
      targets: bgLight,
      alpha: 0.15,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    this.stateItems.push(bgLight);
  }
  
  private createState1(x: number, h: number) {
    // STOP 1: AI STUDIO (Scanner beam, sparkle burst)
    const scanner = this.add.rectangle(x, 0, 600, 6, 0x8b5cf6, 0.4);
    this.tweens.add({
      targets: scanner,
      y: h,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    const burstEmitter = this.add.particles(x, h*0.6, 'particle_sparkle', {
      speed: { min: 20, max: 100 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.8, end: 0 },
      lifespan: 1200,
      blendMode: 'ADD',
      frequency: 200,
      quantity: 4,
      tint: [0x8b5cf6, 0xc87533, 0xffffff]
    });
    
    this.stateItems.push(scanner);
    this.activeEmitters.push(burstEmitter);
  }
  
  private createState2(x: number, h: number) {
    // STOP 2: MULTILINGUAL AI (Pulsing sound waves)
    for (let i = 0; i < 4; i++) {
      const circle = this.add.circle(x, h*0.6, 40, 0x3b82f6, 0);
      circle.setStrokeStyle(1.5, 0x3b82f6);
      
      this.tweens.add({
        targets: circle,
        scale: 8,
        alpha: { from: 0.4, to: 0 },
        duration: 2500,
        delay: i * 625,
        repeat: -1
      });
      this.stateItems.push(circle);
    }
    
    const textStyle = { fontFamily: 'monospace', fontSize: '20px', color: '#6b6580', alpha: 0 };
    const texts = ["हस्तनिर्मित", "Handcrafted", "artisanat", "手作り"];
    
    texts.forEach((txt, i) => {
      const t = this.add.text(x + (Math.random()*300-150), h*0.6 + (Math.random()*200-100), txt, textStyle);
      t.setOrigin(0.5);
      this.tweens.add({
        targets: t,
        y: t.y - 80,
        alpha: { from: 0, to: 0.8, yoyo: true },
        duration: 2500,
        delay: i * 800,
        repeat: -1
      });
      this.stateItems.push(t);
    });
  }

  private createState3(x: number, h: number) {
    // STOP 3: CATALOG ENGINE
    const ring1 = this.add.circle(x, h*0.6, 200);
    ring1.setStrokeStyle(3, 0x10b981, 0.4);
    
    const ring2 = this.add.circle(x, h*0.6, 280);
    ring2.setStrokeStyle(1.5, 0x10b981, 0.2);
    
    this.tweens.add({ targets: ring1, scaleX: 0.1, duration: 2500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: ring2, scaleY: 0.1, duration: 3500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    
    const dataStream = this.add.particles(x, h*0.6, 'particle_sparkle', {
      speedY: { min: -50, max: -150 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.4, end: 0 },
      lifespan: 2000,
      quantity: 1,
      frequency: 100,
      tint: 0x10b981
    });
    
    this.stateItems.push(ring1, ring2);
    this.activeEmitters.push(dataStream);
  }

  private createState4(x: number, h: number) {
    // STOP 4: DISCOVERY & PRICING
    const barCount = 6;
    for(let i=0; i<barCount; i++) {
      const targetHeight = 60 + Math.random() * 180;
      const bar = this.add.rectangle(x - 200 + i*30, h*0.8, 16, 10, 0xf43f5e, 0.5);
      bar.setOrigin(0.5, 1);
      
      this.tweens.add({
        targets: bar,
        height: targetHeight,
        duration: 1200 + i*150,
        ease: 'Bounce.easeOut',
        yoyo: true,
        hold: 2000,
        repeat: -1
      });
      this.stateItems.push(bar);
    }
    
    const searchPulse = this.add.circle(x + 200, h*0.6, 30, 0x8b5cf6, 0.4);
    this.tweens.add({
      targets: searchPulse,
      scale: 6,
      alpha: 0,
      duration: 2000,
      repeat: -1
    });
    this.stateItems.push(searchPulse);
  }

  private createState5(x: number, h: number) {
    // STOP 5: DIGITAL MARKETPLACE
    this.orderCards = this.physics.add.group();
    
    this.cardSpawnTimer = this.time.addEvent({
      delay: 350,
      callback: () => {
        const cx = Phaser.Math.Between(x - 400, x + 400);
        const card = this.orderCards.create(cx, -50, 'order_card') as Phaser.Physics.Arcade.Sprite;
        card.setVelocity(Phaser.Math.Between(-10, 10), Phaser.Math.Between(80, 150));
        card.setAngularVelocity(Phaser.Math.Between(-30, 30));
        card.setTint(0x3b82f6);
        card.setAlpha(0.7);
        this.stateItems.push(card);
      },
      loop: true
    });
  }

  private createState6(x: number, h: number) {
    // STOP 6: MARKET ACCESS
    const confetti = this.add.particles(x, -50, 'particle_coin', {
      x: { min: -600, max: 600 },
      speedY: { min: 80, max: 200 },
      speedX: { min: -30, max: 30 },
      scale: { start: 0.4, end: 0.8 },
      rotate: { start: 0, end: 360 },
      lifespan: 6000,
      quantity: 2,
      frequency: 150,
      tint: [0xffd700, 0xc87533, 0xffffff, 0xf43f5e, 0x10b981]
    });
    
    const glow = this.add.circle(x, h/2, 500, 0xc87533, 0.1);
    this.tweens.add({
      targets: glow,
      scale: 1.3,
      alpha: 0.25,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    this.activeEmitters.push(confetti);
    this.stateItems.push(glow);
  }
}
