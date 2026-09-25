import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { ArtisanCharacter } from '../objects/ArtisanCharacter';
import { playMultilingualShowcase, stopMultilingualSpeech } from '@/lib/multilingual-audio';

const NODE_X_POSITIONS = [
  400,  // Stop 0: N-00 (Village Dusk)
  1200, // Stop 1: N-01 (Village AI Studio)
  2000, // Stop 2: N-02 (Town Transition)
  2900, // Stop 3: N-03 (Semi-Urban Cataloguer)
  3800, // Stop 4: N-04/05 (Urban Pricing & Discovery)
  4700, // Stop 5: N-06 (Modern Metro Marketplace)
  5600  // Stop 6: N-07 (Global Dawn of Access)
];

const CANONICAL_GROUND_Y = 600;
const ARTISAN_WORLD_Y = 545;

export class ArtisanScene extends Phaser.Scene {
  private currentStop: number = 0;
  private isMobileMode: boolean = false;
  
  private artisan!: ArtisanCharacter;
  
  // Specific state graphics & particle emitters
  private stateItems: Phaser.GameObjects.GameObject[] = [];
  private activeEmitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
  
  // Physics group for order cards
  private orderCards!: Phaser.Physics.Arcade.Group;
  private cardSpawnTimer?: Phaser.Time.TimerEvent;

  // 5-Layer Parallax Environment
  private skyLayer!: Phaser.GameObjects.Graphics;
  private bgFar!: Phaser.GameObjects.Graphics;
  private bgMid!: Phaser.GameObjects.Graphics;
  private bgNear!: Phaser.GameObjects.Graphics;
  private groundPlane!: Phaser.GameObjects.Graphics;

  // Phase ambient wash overlay
  private ambientOverlay!: Phaser.GameObjects.Graphics;

  constructor() {
    super('ArtisanScene');
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    
    // 1. Build the 5-Layer Panoramic World
    this.createRealisticEnvironment(w, h);

    // 2. Instantiate South Indian Artisan Character as a prominent figure
    const initialX = NODE_X_POSITIONS[0];
    const initialY = ARTISAN_WORLD_Y;
    this.artisan = new ArtisanCharacter(this, initialX, initialY);
    this.artisan.setScale(2.05); // Prominent large figure
    this.artisan.setDepth(5); // Ensure artisan renders proudly in foreground
    
    // 3. Ambient lighting wash overlay
    this.ambientOverlay = this.add.graphics();
    this.ambientOverlay.setScrollFactor(0);
    this.ambientOverlay.setDepth(2);

    // Set camera origin to match React transform-origin
    this.cameras.main.setOrigin(0, 0);
    
    // Listen to React continuous scroll & mobile mode events
    EventBus.on('sync-scroll', this.handleSyncScroll, this);
    
    // Init state 0
    this.transitionToState(0);
    
    // Window resize
    this.scale.on('resize', this.handleResize, this);
  }

  update(time: number, delta: number) {
    if (this.artisan) {
      this.artisan.updateWalk(delta);
    }
  }
  
  /**
   * Builds the 5-Layer Panoramic South Indian Village to Global Metro Environment
   */
  private createRealisticEnvironment(w: number, h: number) {
    const WORLD_W = 6400;
    const groundY = CANONICAL_GROUND_Y;

    // ─────────────────────────────────────────────────────────────
    // LAYER 1: SKY COLOR GRADIENTS (Dusk/Sunset → Night → Dawn Gold)
    // ─────────────────────────────────────────────────────────────
    this.skyLayer = this.add.graphics();
    this.skyLayer.setScrollFactor(0.08); // Very subtle slow drift

    // Zone 1: Rural Sunset / Dusk (X: 0 - 1800)
    // Warm amber-orange horizon with rich indigo zenith
    this.skyLayer.fillGradientStyle(0x1a0f28, 0x221338, 0x8a3818, 0xd96b27, 1);
    this.skyLayer.fillRect(0, 0, 1800, groundY + 40);

    // Sun / Dusk glow halo at village horizon
    this.skyLayer.fillStyle(0xf59e0b, 0.25);
    this.skyLayer.fillCircle(500, groundY - 60, 140);
    this.skyLayer.fillStyle(0xfbbf24, 0.4);
    this.skyLayer.fillCircle(500, groundY - 60, 60);

    // Zone 2: Semi-Urban Twilight Blue (X: 1800 - 3600)
    this.skyLayer.fillGradientStyle(0x0e1428, 0x161e38, 0x1e2e4a, 0x3b5278, 1);
    this.skyLayer.fillRect(1800, 0, 1800, groundY + 40);

    // Zone 3: Modern Metro Deep Night (X: 3600 - 5200)
    this.skyLayer.fillGradientStyle(0x080914, 0x0c0e1e, 0x141832, 0x202446, 1);
    this.skyLayer.fillRect(3600, 0, 1600, groundY + 40);

    // Zone 4: Global Dawn of Success (X: 5200 - 6400)
    // Radiant golden sunrise celebrating global market access
    this.skyLayer.fillGradientStyle(0x161c33, 0x24244a, 0x9a5822, 0xeb9c34, 1);
    this.skyLayer.fillRect(5200, 0, 1200, groundY + 40);
    // Golden dawn sun halo
    this.skyLayer.fillStyle(0xfde047, 0.3);
    this.skyLayer.fillCircle(5800, groundY - 80, 160);
    this.skyLayer.fillStyle(0xfffbeb, 0.6);
    this.skyLayer.fillCircle(5800, groundY - 80, 50);

    // ─────────────────────────────────────────────────────────────
    // LAYER 2: FAR SILHOUETTES (Rolling Hills, Palms, Temple Gopuram)
    // ─────────────────────────────────────────────────────────────
    this.bgFar = this.add.graphics();
    this.bgFar.setScrollFactor(0.2);

    // South Indian Western-Ghats style rolling hills in the background
    this.bgFar.fillStyle(0x381f1d, 0.7); // Warm dusky hills
    this.bgFar.beginPath();
    this.bgFar.moveTo(0, groundY);
    this.bgFar.lineTo(0, groundY - 120);
    this.bgFar.lineTo(400, groundY - 180);
    this.bgFar.lineTo(900, groundY - 100);
    this.bgFar.lineTo(1500, groundY - 200);
    this.bgFar.lineTo(2200, groundY - 80);
    this.bgFar.lineTo(2200, groundY);
    this.bgFar.fillPath();

    // Distant Coconut Palms (village side)
    for (let i = 0; i < 9; i++) {
      const px = 180 + i * 210;
      this.add.image(px, groundY - 60, 'bg_palm_tree')
        .setScrollFactor(0.2)
        .setScale(0.65)
        .setAlpha(0.6)
        .setDepth(0);
    }

    // Traditional South Indian Temple Gopuram Silhouette in distance
    this.add.image(750, groundY - 65, 'bg_gopuram_silhouette')
      .setScrollFactor(0.2)
      .setScale(0.9)
      .setAlpha(0.75)
      .setDepth(0);

    this.add.image(1650, groundY - 65, 'bg_gopuram_silhouette')
      .setScrollFactor(0.2)
      .setScale(0.7)
      .setAlpha(0.5)
      .setDepth(0);

    // Distant City Skyline Silhouettes (city side: X 3800 - 6400)
    this.bgFar.fillStyle(0x131728, 0.85);
    for (let i = 0; i < 22; i++) {
      const bx = 3600 + i * 130;
      const bh = 90 + ((i * 37) % 130);
      this.bgFar.fillRect(bx, groundY - bh, 90, bh);
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 3: MID STRUCTURES (Mud Huts, Town Stores, Skyscraper Towers)
    // ─────────────────────────────────────────────────────────────
    this.bgMid = this.add.graphics();
    this.bgMid.setScrollFactor(0.5);

    // Rural South Indian Terracotta Tiled Mud Huts (X: 100 - 1800)
    for (let i = 0; i < 5; i++) {
      const hx = 240 + i * 360;
      this.add.image(hx, groundY - 40, 'bg_village_hut')
        .setScrollFactor(0.5)
        .setScale(1.1)
        .setDepth(0);

      // Village street lantern beside house
      this.add.image(hx + 70, groundY - 30, 'bg_lantern_post')
        .setScrollFactor(0.5)
        .setScale(1)
        .setDepth(0);
    }

    // Semi-urban brick buildings & utility poles (X: 1900 - 3400)
    this.bgMid.fillStyle(0x2d2438, 1);
    for (let i = 0; i < 6; i++) {
      const bx = 2000 + i * 240;
      const bh = 80 + (i % 3) * 30;
      this.bgMid.fillRect(bx, groundY - bh, 140, bh);
      // Small town shop shutter
      this.bgMid.fillStyle(0x483d54, 1);
      this.bgMid.fillRect(bx + 15, groundY - 35, 110, 35);
      // Signboard
      this.bgMid.fillStyle(0x8b5cf6, 0.7);
      this.bgMid.fillRect(bx + 15, groundY - 46, 110, 8);
      this.bgMid.fillStyle(0x2d2438, 1);
    }

    // Modern Metro Glass Skyscrapers (X: 3600 - 6400)
    for (let i = 0; i < 14; i++) {
      const tx = 3700 + i * 190;
      const tower = this.add.image(tx, groundY - 110, 'bg_city_tower')
        .setScrollFactor(0.5)
        .setScale(1.1)
        .setDepth(0);
      
      // Alternate slight tint for depth variation
      if (i % 2 === 0) {
        tower.setTint(0x38bdf8);
      }
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 4: NEAR GROUND DETAILS (Stones, Streetlamps, Curbs)
    // ─────────────────────────────────────────────────────────────
    this.bgNear = this.add.graphics();
    this.bgNear.setScrollFactor(0.85);

    // Warm lantern light pools on village dirt ground (X: 0 - 1800)
    for (let i = 0; i < 5; i++) {
      const lx = 310 + i * 360;
      this.bgNear.fillStyle(0xf59e0b, 0.12);
      this.bgNear.fillEllipse(lx, groundY + 12, 110, 22);
    }

    // Streetlight poles with cool white glow in metro zone (X: 3800 - 6400)
    for (let i = 0; i < 8; i++) {
      const sx = 3900 + i * 310;
      this.bgNear.lineStyle(2.5, 0x64748b, 0.9);
      this.bgNear.lineBetween(sx, groundY, sx, groundY - 90);
      this.bgNear.lineBetween(sx, groundY - 90, sx + 18, groundY - 90);
      // Lamp head
      this.bgNear.fillStyle(0x38bdf8, 0.9);
      this.bgNear.fillCircle(sx + 18, groundY - 88, 4);
      // Light pool on road
      this.bgNear.fillStyle(0x38bdf8, 0.1);
      this.bgNear.fillEllipse(sx + 18, groundY + 14, 130, 24);
    }

    // ─────────────────────────────────────────────────────────────
    // LAYER 5: CONTINUOUS GROUND PLANE (Red Earth → Pavement → Asphalt)
    // ─────────────────────────────────────────────────────────────
    this.groundPlane = this.add.graphics();
    this.groundPlane.setScrollFactor(1.0); // Exact world scroll pace

    const groundH = 400;

    // Rural South Indian Red Earth / Terracotta Clay Ground (X: 0 - 2000)
    this.groundPlane.fillStyle(0x73381a, 1);
    this.groundPlane.fillRect(0, groundY, 2000, groundH);
    // Upper dirt texture layer
    this.groundPlane.fillStyle(0x8f4621, 1);
    this.groundPlane.fillRect(0, groundY, 2000, 8);

    // Semi-urban Paved Stone Ground (X: 2000 - 3800)
    this.groundPlane.fillStyle(0x383442, 1);
    this.groundPlane.fillRect(2000, groundY, 1800, groundH);
    this.groundPlane.fillStyle(0x4a4556, 1);
    this.groundPlane.fillRect(2000, groundY, 1800, 6);

    // Modern Metro Smooth Asphalt Road (X: 3800 - 6400)
    this.groundPlane.fillStyle(0x161822, 1);
    this.groundPlane.fillRect(3800, groundY, 2600, groundH);
    // Road curb line
    this.groundPlane.lineStyle(2, 0x38bdf8, 0.4);
    this.groundPlane.lineBetween(3800, groundY, 6400, groundY);
    // Yellow lane dashes
    this.groundPlane.lineStyle(2, 0xfacc15, 0.5);
    for (let x = 3850; x < 6350; x += 60) {
      this.groundPlane.lineBetween(x, groundY + 18, x + 30, groundY + 18);
    }

    // Traditional Handmade Craft Pottery Display at Village Porch (Stop 0: X: 350 - 450)
    this.add.image(350, groundY - 14, 'artisan_craft_basket').setScrollFactor(1).setScale(1.3).setDepth(4);
    this.add.image(330, groundY - 18, 'artisan_clay_pot').setScrollFactor(1).setScale(1.2).setDepth(4);
    this.add.image(440, groundY - 18, 'artisan_brass_pot').setScrollFactor(1).setScale(1.2).setDepth(4);
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
    const w = gameSize.width;
    const h = gameSize.height;
    const isMobile = w < 768;
    this.isMobileMode = isMobile;

    if (isMobile) {
      const targetScrollX = Math.max(0, Math.min(6400 - w, NODE_X_POSITIONS[this.currentStop] - (w / 2)));
      const targetScrollY = CANONICAL_GROUND_Y - (h * 0.38);
      this.cameras.main.scrollX = targetScrollX;
      this.cameras.main.scrollY = targetScrollY;
      this.artisan.setScale(1.75);
    } else {
      this.cameras.main.scrollY = 0;
      this.artisan.setScale(2.05);
    }
  }

  private handleSyncScroll(data: { stop: number, tx: number, progress: number, scale?: number, isMobile?: boolean }) {
    if (!this.cameras || !this.cameras.main || !this.artisan) return;

    const isMobile = !!data.isMobile;
    const modeChanged = this.isMobileMode !== isMobile;
    this.isMobileMode = isMobile;

    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // Calculate the continuous smooth world X position of the artisan from overall progress
    const totalNodes = NODE_X_POSITIONS.length;
    const floatNode = data.progress * (totalNodes - 1);
    const intNode = Math.floor(floatNode);
    const frac = floatNode - intNode;
    const currentArtisanX = intNode >= totalNodes - 1 
      ? NODE_X_POSITIONS[totalNodes - 1] 
      : NODE_X_POSITIONS[intNode] + (NODE_X_POSITIONS[intNode + 1] - NODE_X_POSITIONS[intNode]) * frac;

    // The artisan glides forward in continuous, uninterrupted walking motion
    this.artisan.x = currentArtisanX;
    this.artisan.y = ARTISAN_WORLD_Y;

    if (isMobile) {
      this.cameras.main.setZoom(1);
      // Smoothly and continuously track the artisan on mobile with zero lag
      const targetScrollX = Math.max(0, Math.min(6400 - w, currentArtisanX - (w / 2)));
      const targetScrollY = CANONICAL_GROUND_Y - (h * 0.38);
      this.cameras.main.scrollX = targetScrollX;
      this.cameras.main.scrollY = targetScrollY;
    } else {
      if (data.scale) {
        this.cameras.main.setZoom(data.scale);
      }
      this.cameras.main.scrollX = data.tx;
      this.cameras.main.scrollY = 0;
    }

    if (this.currentStop !== data.stop || modeChanged) {
      this.currentStop = data.stop;
      this.transitionToState(data.stop, currentArtisanX);
    }
  }

  private clearCurrentState(immediate: boolean = false) {
    const oldItems = [...this.stateItems];
    const oldEmitters = [...this.activeEmitters];
    this.stateItems = [];
    this.activeEmitters = [];

    if (this.cardSpawnTimer) {
      this.cardSpawnTimer.destroy();
      this.cardSpawnTimer = undefined;
    }

    if (immediate) {
      oldEmitters.forEach(emitter => { if (emitter && emitter.destroy) emitter.destroy(); });
      oldItems.forEach(item => { if (item && item.destroy) item.destroy(); });
      return;
    }

    // Gracefully fade out previous emitters and items
    oldEmitters.forEach(emitter => {
      if (emitter) {
        emitter.stop();
        this.time.delayedCall(450, () => {
          if (emitter && emitter.destroy) emitter.destroy();
        });
      }
    });

    oldItems.forEach(item => {
      if (item && item.scene) {
        this.tweens.add({
          targets: item,
          alpha: 0,
          duration: 350,
          ease: 'Sine.easeOut',
          onComplete: () => {
            if (item && item.destroy) item.destroy();
          }
        });
      }
    });
  }

  /**
   * Transitions environment lighting, artisan posture, and particle effects per phase
   */
  private transitionToState(stop: number, currentX?: number) {
    this.clearCurrentState(false);
    
    const h = this.cameras.main.height;
    const w = this.cameras.main.width;
    const targetX = currentX ?? NODE_X_POSITIONS[stop];

    this.artisan.setScale(this.isMobileMode ? 1.75 : 2.05);

    // Update ambient wash overlay for emotional atmosphere with gentle transition
    this.updateAmbientOverlay(stop, w, h);

    // Multilingual audio sound trigger
    if (stop === 2) {
      playMultilingualShowcase();
    } else {
      stopMultilingualSpeech();
    }

    // Apply posture without interrupting the smooth continuous walk!
    this.applyArtisanPose(stop);

    // Trigger state-specific particle & holographic effects
    switch(stop) {
      case 0: this.createState0(targetX, CANONICAL_GROUND_Y); break;
      case 1: this.createState1(targetX, CANONICAL_GROUND_Y); break;
      case 2: this.createState2(targetX, CANONICAL_GROUND_Y); break;
      case 3: this.createState3(targetX, CANONICAL_GROUND_Y); break;
      case 4: this.createState4(targetX, CANONICAL_GROUND_Y); break;
      case 5: this.createState5(targetX, CANONICAL_GROUND_Y); break;
      case 6: this.createState6(targetX, CANONICAL_GROUND_Y); break;
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

  /**
   * Ambient atmospheric color tint overlay per phase with smooth crossfade
   */
  private updateAmbientOverlay(stop: number, w: number, h: number) {
    if (!this.ambientOverlay) return;

    const tints: { color: number; alpha: number }[] = [
      { color: 0xc87533, alpha: 0.05 }, // 0: Warm dusk terracotta
      { color: 0x8b5cf6, alpha: 0.06 }, // 1: Studio violet
      { color: 0x3b82f6, alpha: 0.05 }, // 2: Multilingual blue
      { color: 0x10b981, alpha: 0.05 }, // 3: Catalog emerald
      { color: 0xf43f5e, alpha: 0.05 }, // 4: Pricing rose
      { color: 0x3b82f6, alpha: 0.06 }, // 5: Marketplace electric blue
      { color: 0xf59e0b, alpha: 0.08 }, // 6: Dawn golden celebration
    ];

    const current = tints[stop] || tints[0];
    this.tweens.add({
      targets: this.ambientOverlay,
      alpha: 0,
      duration: 250,
      onComplete: () => {
        if (!this.ambientOverlay) return;
        this.ambientOverlay.clear();
        this.ambientOverlay.fillStyle(current.color, current.alpha);
        this.ambientOverlay.fillRect(0, 0, w, h);
        this.tweens.add({
          targets: this.ambientOverlay,
          alpha: 1,
          duration: 350
        });
      }
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PHASE SPECIFIC PARTICLES & EFFECTS
  // ─────────────────────────────────────────────────────────────

  private createState0(x: number, groundY: number) {
    // STOP 0: ARTISAN STRUGGLE (Ambient dusk dust motes & gentle lantern flicker)
    const dustEmitter = this.add.particles(x, 0, 'particle_sparkle', {
      x: { min: -220, max: 220 },
      y: { min: groundY - 300, max: groundY },
      lifespan: 4000,
      speedY: { min: 4, max: 18 },
      speedX: { min: -8, max: 8 },
      scale: { start: 0.14, end: 0 },
      alpha: { start: 0.35, end: 0 },
      quantity: 1,
      blendMode: 'ADD'
    });
    this.activeEmitters.push(dustEmitter);
    
    // Warm copper glow around unsold brass pot & artisan
    const lanternGlow = this.add.circle(x, groundY - 30, 200, 0xd97706, 0.12);
    this.tweens.add({
      targets: lanternGlow,
      alpha: { from: 0.08, to: 0.18 },
      scale: { from: 0.95, to: 1.05 },
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    this.stateItems.push(lanternGlow);
  }
  
  private createState1(x: number, groundY: number) {
    // STOP 1: AI STUDIO (Computer Vision Scanning Laser & AI Polish Burst)
    const beamW = this.isMobileMode ? 320 : 520;
    const scanner = this.add.rectangle(x, groundY - 180, beamW, 4, 0x8b5cf6, 0);
    this.tweens.add({ targets: scanner, alpha: 0.7, duration: 400 });
    this.tweens.add({
      targets: scanner,
      y: groundY - 10,
      duration: 2200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    const burstEmitter = this.add.particles(x, groundY - 45, 'particle_sparkle', {
      speed: { min: 25, max: 110 },
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
  
  private createState2(x: number, groundY: number) {
    // STOP 2: MULTILINGUAL AI (Expanding speech soundwave rings & floating Indian regional scripts)
    for (let i = 0; i < 4; i++) {
      const circle = this.add.circle(x, groundY - 50, 30, 0x3b82f6, 0);
      circle.setStrokeStyle(1.8, 0x3b82f6);
      
      this.tweens.add({
        targets: circle,
        scale: this.isMobileMode ? 5 : 8,
        alpha: { from: 0.5, to: 0 },
        duration: 2400,
        delay: i * 600,
        repeat: -1
      });
      this.stateItems.push(circle);
    }
    
    const textStyle = { fontFamily: 'monospace', fontSize: this.isMobileMode ? '14px' : '18px', color: '#93c5fd', alpha: 0 };
    const texts = ["கைவினை", "హస్తకళ", "हस्तनिर्मित", "ಕರಕುಶಲ", "Handcrafted"];
    
    texts.forEach((txt, i) => {
      const spread = this.isMobileMode ? 140 : 260;
      const t = this.add.text(x + (Math.random() * spread - spread / 2), groundY - 60 + (Math.random() * 60 - 30), txt, textStyle);
      t.setOrigin(0.5);
      this.tweens.add({
        targets: t,
        y: t.y - 60,
        alpha: { from: 0, to: 0.85, yoyo: true },
        duration: 2400,
        delay: i * 500,
        repeat: -1
      });
      this.stateItems.push(t);
    });
  }

  private createState3(x: number, groundY: number) {
    // STOP 3: CATALOG ENGINE (Rotating emerald holographic data rings)
    const ringRadius1 = this.isMobileMode ? 95 : 180;
    const ringRadius2 = this.isMobileMode ? 140 : 250;
    
    const ring1 = this.add.circle(x, groundY - 50, ringRadius1);
    ring1.setStrokeStyle(2.5, 0x10b981, 0.45);
    ring1.setAlpha(0);
    this.tweens.add({ targets: ring1, alpha: 1, duration: 400 });
    
    const ring2 = this.add.circle(x, groundY - 50, ringRadius2);
    ring2.setStrokeStyle(1.5, 0x10b981, 0.25);
    ring2.setAlpha(0);
    this.tweens.add({ targets: ring2, alpha: 1, duration: 400 });
    
    this.tweens.add({ targets: ring1, scaleX: 0.15, duration: 2400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: ring2, scaleY: 0.15, duration: 3200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    
    const dataStream = this.add.particles(x, groundY - 30, 'particle_sparkle', {
      speedY: { min: -50, max: -150 },
      speedX: { min: -12, max: 12 },
      scale: { start: 0.45, end: 0 },
      lifespan: 1800,
      quantity: 2,
      frequency: 120,
      tint: 0x10b981
    });
    
    this.stateItems.push(ring1, ring2);
    this.activeEmitters.push(dataStream);
  }

  private createState4(x: number, groundY: number) {
    // STOP 4: DISCOVERY & PRICING (Dynamic profit margin chart bars & buyer search radar pulse)
    // Offset smoothly to the side of the artisan so bars don't overlap his body
    const barCount = 5;
    const offset = this.isMobileMode ? 100 : 160;
    
    for (let i = 0; i < barCount; i++) {
      const targetHeight = 45 + Math.random() * 80;
      const bar = this.add.rectangle(x - offset + i * (this.isMobileMode ? 14 : 22), groundY, this.isMobileMode ? 9 : 12, 10, 0xf43f5e, 0);
      bar.setOrigin(0.5, 1);
      this.tweens.add({ targets: bar, alpha: 0.7, duration: 400 });
      
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
    
    const searchPulse = this.add.circle(x + offset, groundY - 50, 22, 0x8b5cf6, 0.45);
    this.tweens.add({
      targets: searchPulse,
      scale: this.isMobileMode ? 4 : 6,
      alpha: 0,
      duration: 1800,
      repeat: -1
    });
    this.stateItems.push(searchPulse);
  }

  private createState5(x: number, groundY: number) {
    // STOP 5: DIGITAL MARKETPLACE (Falling order cards shower in modern city)
    this.orderCards = this.physics.add.group();
    const spread = this.isMobileMode ? 180 : 380;
    
    this.cardSpawnTimer = this.time.addEvent({
      delay: 350,
      callback: () => {
        const cx = Phaser.Math.Between(x - spread, x + spread);
        const card = this.orderCards.create(cx, groundY - 260, 'order_card') as Phaser.Physics.Arcade.Sprite;
        card.setVelocity(Phaser.Math.Between(-12, 12), Phaser.Math.Between(80, 150));
        card.setAngularVelocity(Phaser.Math.Between(-25, 25));
        card.setAlpha(0.85);
        this.stateItems.push(card);
      },
      loop: true
    });
  }

  private createState6(x: number, groundY: number) {
    // STOP 6: YEAR-ROUND MARKET ACCESS (Golden celebratory confetti & radiant victory aura)
    const confetti = this.add.particles(x, groundY - 260, 'particle_coin', {
      x: { min: this.isMobileMode ? -180 : -550, max: this.isMobileMode ? 180 : 550 },
      speedY: { min: 80, max: 200 },
      speedX: { min: -35, max: 35 },
      scale: { start: 0.35, end: 0.75 },
      rotate: { start: 0, end: 360 },
      lifespan: 5500,
      quantity: 2,
      frequency: 140,
      tint: [0xffd700, 0xc87533, 0xffffff, 0xf43f5e, 0x10b981]
    });
    
    const glow = this.add.circle(x, groundY - 50, 260, 0xf59e0b, 0);
    this.tweens.add({
      targets: glow,
      scale: 1.35,
      alpha: 0.25,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    this.activeEmitters.push(confetti);
    this.stateItems.push(glow);
  }
}
