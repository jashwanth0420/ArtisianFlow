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

  // Smartphone (locked into the artisan's hand)
  private phone: Phaser.GameObjects.Image;

  public baseY: number;

  // Continuous mathematical walk cycle
  private isWalking: boolean = true;
  private walkTime: number = 0;
  private currentPose: 'sad' | 'proud' | 'happy' = 'sad';

  // Smooth lerp state variables (zero-jerk pose transitions)
  private curLeftArmUpper: number = 15;
  private curLeftForearm: number = 10;
  private curRightArmUpper: number = -15;
  private curRightForearm: number = -10;
  private curHeadAngle: number = 12;
  private curHeadY: number = -17;
  private curTorsoAngle: number = 8;
  private curTorsoY: number = -3;
  private curGamchaAngle: number = 6;
  private curPhoneAlpha: number = 0;

  // Target pose variables
  private targetLeftArmUpper: number = 15;
  private targetLeftForearm: number = 10;
  private targetRightArmUpper: number = -15;
  private targetRightForearm: number = -10;
  private targetHeadAngle: number = 12;
  private targetHeadY: number = -17;
  private targetTorsoAngle: number = 8;
  private targetTorsoY: number = -3;
  private targetGamchaAngle: number = 6;
  private targetPhoneAlpha: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.baseY = y;

    // ─── 1. Right (Back) Limbs ───
    this.rightLeg = scene.add.image(4, 20, 'artisan_leg');
    this.rightLeg.setOrigin(0.5, 0.1);
    this.rightFoot = scene.add.image(6, 36, 'artisan_foot');
    this.rightFoot.setOrigin(0.2, 0.5);

    this.rightArmUpper = scene.add.image(7, -6, 'artisan_upper_arm');
    this.rightArmUpper.setOrigin(0.5, 0.15);
    this.rightForearm = scene.add.image(7, 7, 'artisan_forearm');
    this.rightForearm.setOrigin(0.5, 0.15);

    // ─── 2. Torso & Traditional Attire ───
    this.dhoti = scene.add.image(0, 14, 'artisan_dhoti');
    this.dhoti.setOrigin(0.5, 0.1);

    this.torso = scene.add.image(0, -6, 'artisan_torso');
    this.torso.setOrigin(0.5, 0.5);

    this.gamcha = scene.add.image(-4, -6, 'artisan_gamcha');
    this.gamcha.setOrigin(0.5, 0.2);

    // ─── 3. Left (Front) Limbs ───
    this.leftLeg = scene.add.image(-4, 20, 'artisan_leg');
    this.leftLeg.setOrigin(0.5, 0.1);
    this.leftFoot = scene.add.image(-2, 36, 'artisan_foot');
    this.leftFoot.setOrigin(0.2, 0.5);

    this.leftArmUpper = scene.add.image(-7, -6, 'artisan_upper_arm');
    this.leftArmUpper.setOrigin(0.5, 0.15);
    this.leftForearm = scene.add.image(-7, 7, 'artisan_forearm');
    this.leftForearm.setOrigin(0.5, 0.15);

    // ─── 4. Head with Kudumi & Tilak ───
    this.head = scene.add.image(0, -22, 'artisan_head');
    this.head.setOrigin(0.5, 0.5);

    // ─── 5. Smartphone (firmly anchored in the artisan's hand) ───
    this.phone = scene.add.image(-7, 20, 'artisan_phone');
    this.phone.setOrigin(0.5, 0.5);
    this.phone.setAlpha(0);

    // Add children in proper depth order
    this.add([
      this.rightArmUpper,
      this.rightForearm,
      this.rightLeg,
      this.rightFoot,
      this.dhoti,
      this.torso,
      this.gamcha,
      this.leftLeg,
      this.leftFoot,
      this.head,
      this.leftArmUpper,
      this.leftForearm,
      this.phone
    ]);

    scene.add.existing(this);
    this.setSad();
  }

  /**
   * Continuous, Uninterrupted Mathematical Kinematic Walk Cycle
   * Zero garbage collection, 60fps fluid motion that never freezes or snaps
   */
  public updateWalk(delta: number) {
    if (!this.isWalking) return;

    this.walkTime += delta * 0.0075;
    const swing = Math.sin(this.walkTime) * 20;

    // Smooth lerp of pose parameters over ~300ms (zero jerk, silky transitions)
    const lerpFactor = Math.min(1, delta * 0.007);
    this.curLeftArmUpper = Phaser.Math.Linear(this.curLeftArmUpper, this.targetLeftArmUpper, lerpFactor);
    this.curLeftForearm = Phaser.Math.Linear(this.curLeftForearm, this.targetLeftForearm, lerpFactor);
    this.curRightArmUpper = Phaser.Math.Linear(this.curRightArmUpper, this.targetRightArmUpper, lerpFactor);
    this.curRightForearm = Phaser.Math.Linear(this.curRightForearm, this.targetRightForearm, lerpFactor);
    this.curHeadAngle = Phaser.Math.Linear(this.curHeadAngle, this.targetHeadAngle, lerpFactor);
    this.curHeadY = Phaser.Math.Linear(this.curHeadY, this.targetHeadY, lerpFactor);
    this.curTorsoAngle = Phaser.Math.Linear(this.curTorsoAngle, this.targetTorsoAngle, lerpFactor);
    this.curTorsoY = Phaser.Math.Linear(this.curTorsoY, this.targetTorsoY, lerpFactor);
    this.curGamchaAngle = Phaser.Math.Linear(this.curGamchaAngle, this.targetGamchaAngle, lerpFactor);
    this.curPhoneAlpha = Phaser.Math.Linear(this.curPhoneAlpha, this.targetPhoneAlpha, lerpFactor);

    // Legs continuous counter-swing
    this.leftLeg.angle = swing;
    this.rightLeg.angle = -swing;

    // Ankle flexion
    this.leftFoot.angle = swing * 0.35;
    this.rightFoot.angle = -swing * 0.35;

    // Torso and Head positions
    this.torso.setPosition(0, this.curTorsoY);
    this.torso.angle = this.curTorsoAngle;
    this.head.setPosition(0, this.curHeadY);
    this.head.angle = this.curHeadAngle;
    this.gamcha.angle = this.curGamchaAngle - swing * 0.15;
    this.dhoti.angle = swing * 0.1;

    // Determine arm swing additions based on current emotional pose
    let leftSwing = 0;
    let rightSwing = 0;
    if (this.currentPose === 'sad') {
      leftSwing = swing * 0.45;
      rightSwing = -swing * 0.45;
    } else if (this.currentPose === 'proud') {
      // Left arm holds phone steady with subtle breath motion, right arm swings naturally
      leftSwing = swing * 0.08;
      rightSwing = -swing * 0.6;
    } else if (this.currentPose === 'happy') {
      // Both arms wave high in celebration
      leftSwing = swing * 0.2;
      rightSwing = -swing * 0.2;
    }

    const degToRad = Math.PI / 180;

    // ─── FORWARD KINEMATICS: LEFT ARM & SMARTPHONE ───
    // Shoulder anchor (moves subtly with torso tilt)
    const lsX = -7;
    const lsY = this.curTorsoY - 3;
    const leftUpperRad = (this.curLeftArmUpper + leftSwing) * degToRad;
    const leftForearmRad = this.curLeftForearm * degToRad;
    const leftTotalRad = leftUpperRad + leftForearmRad;

    // Upper arm
    this.leftArmUpper.setPosition(lsX, lsY);
    this.leftArmUpper.rotation = leftUpperRad;

    // Elbow joint position
    const leX = lsX - Math.sin(leftUpperRad) * 13;
    const leY = lsY + Math.cos(leftUpperRad) * 13;
    this.leftForearm.setPosition(leX, leY);
    this.leftForearm.rotation = leftTotalRad;

    // Hand position (wrist joint at the end of the forearm)
    const lhX = leX - Math.sin(leftTotalRad) * 14;
    const lhY = leY + Math.cos(leftTotalRad) * 14;

    // Smartphone is locked into the artisan's hand
    this.phone.setPosition(lhX, lhY);
    this.phone.rotation = leftTotalRad - 0.2;
    this.phone.setAlpha(this.curPhoneAlpha);

    // ─── FORWARD KINEMATICS: RIGHT ARM (BACK LAYER) ───
    const rsX = 7;
    const rsY = this.curTorsoY - 3;
    const rightUpperRad = (this.curRightArmUpper + rightSwing) * degToRad;
    const rightForearmRad = this.curRightForearm * degToRad;
    const rightTotalRad = rightUpperRad + rightForearmRad;

    this.rightArmUpper.setPosition(rsX, rsY);
    this.rightArmUpper.rotation = rightUpperRad;

    const reX = rsX - Math.sin(rightUpperRad) * 13;
    const reY = rsY + Math.cos(rightUpperRad) * 13;
    this.rightForearm.setPosition(reX, reY);
    this.rightForearm.rotation = rightTotalRad;

    // Natural vertical bobbing while striding
    this.y = this.baseY - Math.abs(Math.sin(this.walkTime * 2)) * 4.5;
  }

  public walk() {
    this.isWalking = true;
  }

  public stopWalk() {
    this.isWalking = false;
  }

  /**
   * STOP 0: Burdened Walk Posture
   * Drooped head, stooped posture, arms hanging down tiredly
   */
  public setSad() {
    this.currentPose = 'sad';
    this.targetLeftArmUpper = 14;
    this.targetLeftForearm = 12;
    this.targetRightArmUpper = -12;
    this.targetRightForearm = -10;
    this.targetHeadAngle = 12;
    this.targetHeadY = -17;
    this.targetTorsoAngle = 8;
    this.targetTorsoY = -3;
    this.targetGamchaAngle = 6;
    this.targetPhoneAlpha = 0;
  }

  /**
   * STAGES 1-3: Digital Enablement & Pride
   * Standing tall, left arm holding up the smartphone, looking proudly at the screen
   */
  public setProud() {
    this.currentPose = 'proud';
    // Left arm bent forward and up, bringing phone in front of chest/face
    this.targetLeftArmUpper = -42;
    this.targetLeftForearm = -65;
    this.targetRightArmUpper = 15;
    this.targetRightForearm = 25;
    this.targetHeadAngle = -4;
    this.targetHeadY = -24;
    this.targetTorsoAngle = -2;
    this.targetTorsoY = -6;
    this.targetGamchaAngle = -3;
    this.targetPhoneAlpha = 1;
  }

  /**
   * STAGES 4-6: Global Triumph & Celebration
   * Both arms raised high in victory, waving proudly into the global market
   */
  public setHappy() {
    this.currentPose = 'happy';
    // Both arms raised triumphantly
    this.targetLeftArmUpper = -115;
    this.targetLeftForearm = -20;
    this.targetRightArmUpper = 115;
    this.targetRightForearm = 20;
    this.targetHeadAngle = 0;
    this.targetHeadY = -25;
    this.targetTorsoAngle = 0;
    this.targetTorsoY = -6;
    this.targetGamchaAngle = 0;
    this.targetPhoneAlpha = 1;
  }
}
