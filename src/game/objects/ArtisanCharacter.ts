import Phaser from 'phaser';

export class ArtisanCharacter extends Phaser.GameObjects.Container {
  // Anatomy parts
  private head: Phaser.GameObjects.Image;
  private torso: Phaser.GameObjects.Image;
  private gamcha: Phaser.GameObjects.Image;
  private dhoti: Phaser.GameObjects.Image;
  
  // Right Limbs (back layer)
  private rightArmUpper: Phaser.GameObjects.Image;
  private rightForearm: Phaser.GameObjects.Image;
  private rightLeg: Phaser.GameObjects.Image;
  private rightFoot: Phaser.GameObjects.Image;

  // Left Limbs (front layer)
  private leftArmUpper: Phaser.GameObjects.Image;
  private leftForearm: Phaser.GameObjects.Image;
  private leftLeg: Phaser.GameObjects.Image;
  private leftFoot: Phaser.GameObjects.Image;

  // Craft Props & Smartphone
  private brassPot: Phaser.GameObjects.Image;
  private clayPot: Phaser.GameObjects.Image;
  private basket: Phaser.GameObjects.Image;
  private phone: Phaser.GameObjects.Image;

  public baseY: number;

  // Silky smooth mathematical walk cycle state
  private isWalking: boolean = false;
  private walkTime: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.baseY = y;

    // ─── 1. Props on the ground beside him (Stop 0) ───
    this.basket = scene.add.image(-28, 22, 'artisan_craft_basket');
    this.clayPot = scene.add.image(-38, 20, 'artisan_clay_pot');
    this.brassPot = scene.add.image(28, 20, 'artisan_brass_pot');

    // ─── 2. Right (Back) Limbs ───
    this.rightLeg = scene.add.image(4, 20, 'artisan_leg');
    this.rightLeg.setOrigin(0.5, 0.1);
    this.rightFoot = scene.add.image(6, 36, 'artisan_foot');
    this.rightFoot.setOrigin(0.2, 0.5);

    this.rightArmUpper = scene.add.image(8, -6, 'artisan_upper_arm');
    this.rightArmUpper.setOrigin(0.5, 0.15);
    this.rightForearm = scene.add.image(8, 6, 'artisan_forearm');
    this.rightForearm.setOrigin(0.5, 0.15);

    // ─── 3. Torso & Traditional Attire ───
    this.dhoti = scene.add.image(0, 14, 'artisan_dhoti');
    this.dhoti.setOrigin(0.5, 0.1);

    this.torso = scene.add.image(0, -6, 'artisan_torso');
    this.torso.setOrigin(0.5, 0.5);

    this.gamcha = scene.add.image(-4, -6, 'artisan_gamcha');
    this.gamcha.setOrigin(0.5, 0.2);

    // ─── 4. Left (Front) Limbs ───
    this.leftLeg = scene.add.image(-4, 20, 'artisan_leg');
    this.leftLeg.setOrigin(0.5, 0.1);
    this.leftFoot = scene.add.image(-2, 36, 'artisan_foot');
    this.leftFoot.setOrigin(0.2, 0.5);

    this.leftArmUpper = scene.add.image(-8, -6, 'artisan_upper_arm');
    this.leftArmUpper.setOrigin(0.5, 0.15);
    this.leftForearm = scene.add.image(-8, 6, 'artisan_forearm');
    this.leftForearm.setOrigin(0.5, 0.15);

    // ─── 5. Head with Kudumi & Tilak ───
    this.head = scene.add.image(0, -22, 'artisan_head');
    this.head.setOrigin(0.5, 0.5);

    // ─── 6. Smartphone (in hand during digital stages) ───
    this.phone = scene.add.image(-10, 16, 'artisan_phone');
    this.phone.setOrigin(0.5, 0.5);
    this.phone.setAlpha(0);

    // Add children in proper depth order
    this.add([
      this.basket,
      this.clayPot,
      this.brassPot,
      this.rightArmUpper,
      this.rightForearm,
      this.rightLeg,
      this.rightFoot,
      this.dhoti,
      this.torso,
      this.gamcha,
      this.leftLeg,
      this.leftFoot,
      this.leftArmUpper,
      this.leftForearm,
      this.phone,
      this.head
    ]);

    scene.add.existing(this);
    this.setSad();
  }

  /**
   * High-Performance Mathematical Walk Cycle
   * Zero garbage collection, zero tween-engine overload, 60fps fluid motion
   */
  public updateWalk(delta: number) {
    if (!this.isWalking) return;

    this.walkTime += delta * 0.0075;
    const swing = Math.sin(this.walkTime) * 22;

    // Legs counter-swing
    this.leftLeg.angle = swing;
    this.rightLeg.angle = -swing;

    // Ankle flexion
    this.leftFoot.angle = swing * 0.35;
    this.rightFoot.angle = -swing * 0.35;

    // Arms natural counter-swing
    this.leftArmUpper.angle = -swing * 0.8;
    this.rightArmUpper.angle = swing * 0.8;
    this.leftForearm.angle = -swing * 0.5;
    this.rightForearm.angle = swing * 0.5;

    // Subtle cloth flow
    this.dhoti.angle = swing * 0.12;
    this.gamcha.angle = -swing * 0.22;

    // Natural vertical spring / bobbing
    this.y = this.baseY - Math.abs(Math.sin(this.walkTime * 2)) * 5;
  }

  public walk() {
    this.isWalking = true;

    // Hide heavy grounded craft goods while traveling
    this.scene.tweens.add({ targets: [this.brassPot, this.clayPot, this.basket], alpha: 0, duration: 200 });

    // Slight forward torso lean for natural momentum
    this.scene.tweens.add({
      targets: [this.torso, this.head],
      angle: 5,
      duration: 180
    });
  }

  public stopWalk() {
    this.isWalking = false;

    this.scene.tweens.killTweensOf([
      this.leftLeg, this.rightLeg, this.leftFoot, this.rightFoot,
      this.leftArmUpper, this.rightArmUpper, this.leftForearm, this.rightForearm,
      this.gamcha, this.dhoti, this
    ]);

    this.scene.tweens.add({
      targets: [
        this.leftLeg, this.rightLeg, this.leftFoot, this.rightFoot,
        this.leftArmUpper, this.rightArmUpper, this.leftForearm, this.rightForearm,
        this.gamcha, this.dhoti
      ],
      angle: 0,
      duration: 160,
      ease: 'Sine.easeOut'
    });

    this.scene.tweens.add({
      targets: this,
      y: this.baseY,
      duration: 160
    });
  }

  /**
   * STOP 0: Struggle & Burden
   * Squats / stoops down beside his unsold craft pots, head lowered, tired posture
   */
  public setSad() {
    this.stopWalk();

    // Show traditional handcrafted pots & basket
    this.scene.tweens.add({ targets: [this.brassPot, this.clayPot, this.basket], alpha: 1, duration: 400 });
    this.phone.setAlpha(0);

    // Stooped torso & downcast head
    this.scene.tweens.add({
      targets: this.head,
      x: 3,
      y: -15,
      angle: 16,
      duration: 500,
      ease: 'Sine.easeInOut'
    });

    this.scene.tweens.add({
      targets: this.torso,
      angle: 12,
      y: -2,
      duration: 500,
      ease: 'Sine.easeInOut'
    });

    this.scene.tweens.add({
      targets: this.gamcha,
      angle: 8,
      duration: 500
    });

    // Arms hanging limp
    this.scene.tweens.add({
      targets: [this.leftArmUpper, this.leftForearm],
      angle: 20,
      duration: 500
    });
    this.scene.tweens.add({
      targets: [this.rightArmUpper, this.rightForearm],
      angle: 15,
      duration: 500
    });

    this.scene.tweens.add({
      targets: this,
      y: this.baseY + 4,
      duration: 500
    });
  }

  /**
   * STAGES 1-3: Digital Enablement & Pride
   * Stands tall, holds smartphone glowing with AI catalog, proud stance
   */
  public setProud() {
    this.stopWalk();

    // Pots fade down as he transitions into digital enterprise
    this.scene.tweens.add({ targets: [this.brassPot, this.clayPot, this.basket], alpha: 0, duration: 400 });
    this.scene.tweens.add({ targets: this.phone, alpha: 1, duration: 400 });

    // Upright head, looking slightly upward
    this.scene.tweens.add({
      targets: this.head,
      x: 0,
      y: -24,
      angle: -4,
      duration: 400,
      ease: 'Back.easeOut'
    });

    this.scene.tweens.add({
      targets: this.torso,
      angle: -2,
      y: -6,
      duration: 400
    });

    this.scene.tweens.add({
      targets: this.gamcha,
      angle: -4,
      duration: 400
    });

    // Left hand holding up phone
    this.scene.tweens.add({
      targets: this.leftArmUpper,
      angle: -35,
      duration: 400
    });
    this.scene.tweens.add({
      targets: this.leftForearm,
      angle: -75,
      duration: 400
    });
    this.scene.tweens.add({
      targets: this.phone,
      x: -14,
      y: -2,
      angle: -10,
      duration: 400
    });

    // Right arm on waist
    this.scene.tweens.add({
      targets: this.rightArmUpper,
      angle: 25,
      duration: 400
    });
    this.scene.tweens.add({
      targets: this.rightForearm,
      angle: 40,
      duration: 400
    });

    this.scene.tweens.add({
      targets: this,
      y: this.baseY,
      duration: 350
    });
  }

  /**
   * STAGES 4-6: Global Triumph & Celebration
   * Upright victory stance, arms open with phone, full smile & confidence
   */
  public setHappy() {
    this.stopWalk();

    this.scene.tweens.add({ targets: [this.brassPot, this.clayPot, this.basket], alpha: 0, duration: 300 });
    this.scene.tweens.add({ targets: this.phone, alpha: 1, duration: 400 });

    // Confident uplifted head
    this.scene.tweens.add({
      targets: this.head,
      x: 0,
      y: -26,
      angle: 0,
      duration: 400,
      ease: 'Back.easeOut'
    });

    this.scene.tweens.add({
      targets: this.torso,
      angle: 0,
      y: -7,
      duration: 400
    });

    // Both arms raised in triumph
    this.scene.tweens.add({
      targets: this.leftArmUpper,
      angle: -120,
      duration: 400,
      ease: 'Back.easeOut'
    });
    this.scene.tweens.add({
      targets: this.leftForearm,
      angle: -30,
      duration: 400,
      ease: 'Back.easeOut'
    });
    this.scene.tweens.add({
      targets: this.phone,
      x: -18,
      y: -28,
      angle: 15,
      duration: 400
    });

    this.scene.tweens.add({
      targets: this.rightArmUpper,
      angle: 120,
      duration: 400,
      ease: 'Back.easeOut'
    });
    this.scene.tweens.add({
      targets: this.rightForearm,
      angle: 30,
      duration: 400,
      ease: 'Back.easeOut'
    });

    // Gentle celebration bounce
    this.scene.tweens.add({
      targets: this,
      y: this.baseY - 4,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
}
