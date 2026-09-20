import Phaser from 'phaser';

export class ArtisanCharacter extends Phaser.GameObjects.Container {
  private head: Phaser.GameObjects.Image;
  private torso: Phaser.GameObjects.Image;
  private leftArm: Phaser.GameObjects.Image;
  private rightArm: Phaser.GameObjects.Image;
  private leftLeg: Phaser.GameObjects.Image;
  private rightLeg: Phaser.GameObjects.Image;
  private bundle: Phaser.GameObjects.Image;

  private walkTweens: Phaser.Tweens.Tween[] = [];
  public baseY: number;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.baseY = y;

    // Bundle (heavy burden)
    this.bundle = scene.add.image(-15, -5, 'artisan_bundle');
    this.bundle.setAngle(-15);

    // Right Arm (back)
    this.rightArm = scene.add.image(0, -10, 'artisan_limb_back');
    this.rightArm.setOrigin(0.5, 0.1);

    // Right Leg (back)
    this.rightLeg = scene.add.image(0, 30, 'artisan_limb_back');
    this.rightLeg.setOrigin(0.5, 0.1);

    // Torso (Kurta)
    this.torso = scene.add.image(0, 10, 'artisan_torso');
    
    // Left Leg (front)
    this.leftLeg = scene.add.image(0, 30, 'artisan_limb_front');
    this.leftLeg.setOrigin(0.5, 0.1);

    // Left Arm (front)
    this.leftArm = scene.add.image(0, -10, 'artisan_limb_front');
    this.leftArm.setOrigin(0.5, 0.1);

    // Head with Turban
    this.head = scene.add.image(0, -35, 'artisan_head');

    this.add([this.bundle, this.rightArm, this.rightLeg, this.torso, this.leftLeg, this.leftArm, this.head]);
    
    scene.add.existing(this);
    
    this.setSad();
  }

  public setSad() {
    this.stopWalk();
    this.scene.tweens.add({
      targets: this.head,
      x: 10,
      y: -25,
      duration: 500,
      ease: 'Sine.easeInOut'
    });
    this.scene.tweens.add({
      targets: this.torso,
      angle: 15,
      duration: 500
    });
    this.scene.tweens.add({
      targets: [this.leftArm, this.rightArm],
      angle: 15,
      duration: 500
    });
    this.bundle.setAlpha(1);
  }

  public setHappy() {
    this.stopWalk();
    this.scene.tweens.add({
      targets: this.head,
      x: 0,
      y: -40,
      duration: 500,
      ease: 'Back.easeOut'
    });
    this.scene.tweens.add({
      targets: this.torso,
      angle: 0,
      duration: 500
    });
    this.scene.tweens.add({
      targets: [this.leftArm, this.rightArm],
      angle: -150, // Arms raised
      duration: 500,
      ease: 'Back.easeOut'
    });
    
    // Bundle disappears eventually
    this.scene.tweens.add({
      targets: this.bundle,
      alpha: 0,
      duration: 1000
    });
  }

  public setProud() {
    this.stopWalk();
    this.scene.tweens.add({
      targets: this.head,
      x: -5,
      y: -35,
      duration: 500
    });
    this.scene.tweens.add({
      targets: this.torso,
      angle: -5,
      duration: 500
    });
    this.scene.tweens.add({
      targets: this.leftArm,
      angle: -30, // hand on hip
      duration: 500
    });
    this.scene.tweens.add({
      targets: this.rightArm,
      angle: 20,
      duration: 500
    });
    this.bundle.setAlpha(0);
  }

  public walk() {
    this.stopWalk();
    
    // Normalize posture
    this.scene.tweens.add({
      targets: [this.head, this.torso],
      angle: 5,
      x: 0,
      duration: 200
    });

    const duration = 400;

    // Legs
    this.leftLeg.angle = -30;
    this.rightLeg.angle = 30;
    
    const t1 = this.scene.tweens.add({
      targets: this.leftLeg,
      angle: 30,
      duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    const t2 = this.scene.tweens.add({
      targets: this.rightLeg,
      angle: -30,
      duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Arms
    this.leftArm.angle = 30;
    this.rightArm.angle = -30;
    
    const t3 = this.scene.tweens.add({
      targets: this.leftArm,
      angle: -30,
      duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    const t4 = this.scene.tweens.add({
      targets: this.rightArm,
      angle: 30,
      duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Bobbing body
    const t5 = this.scene.tweens.add({
      targets: this,
      y: this.baseY - 10,
      duration: duration / 2,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.walkTweens.push(t1, t2, t3, t4, t5);
  }

  public stopWalk() {
    this.walkTweens.forEach(t => t.stop());
    this.walkTweens = [];
    this.scene.tweens.add({
      targets: [this.leftLeg, this.rightLeg, this.leftArm, this.rightArm],
      angle: 0,
      duration: 200
    });
    this.scene.tweens.add({
      targets: this,
      y: this.baseY,
      duration: 200
    });
  }
}
