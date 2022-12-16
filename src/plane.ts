import * as THREE from "three";
import * as CANNON from "cannon-es";
import { threeToCannon, ShapeType } from "three-to-cannon";
import CannonUtils from "./utils";

export class Plane extends THREE.Object3D {
  cameraHolderX = new THREE.Object3D();
  cameraHolderY = new THREE.Object3D();
  keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    up: false,
    right: false,
    down: false,
    left: false,
    space: false,
  };
  body: CANNON.Body;
  bodyMaterial: CANNON.Material;
  constructor(planeModel: THREE.Group) {
    super();
    this.add(planeModel);
    planeModel.rotation.set(Math.PI / 2, Math.PI, -Math.PI / 2);
    this.bindKeys();

    this.bodyMaterial = new CANNON.Material();

    const shape = CannonUtils.CreateTrimesh(
      (planeModel.children[0] as THREE.Mesh).geometry
    );
    this.body = new CANNON.Body({
      // shape,
      material: this.bodyMaterial,
      // mass: 10,
    });

    this.body.position.set(0, 0, 0);
    // this.body.addEventListener("collide", (e) => console.log(e));
  }

  addCamera(camera: THREE.PerspectiveCamera) {
    this.cameraHolderY.add(this.cameraHolderX);
    this.cameraHolderX.add(camera);
    camera.position.z = 30;

    this.cameraHolderX.rotation.x = -Math.PI / 8;
    this.cameraHolderY.rotation.y = -Math.PI;
    return this.cameraHolderY;
  }

  bindKeys() {
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      up: false,
      right: false,
      down: false,
      left: false,
      space: false,
    };

    document.addEventListener("keydown", ({ key }) => {
      const keyId = key.toLowerCase().replace("arrow", "");
      if (Object.keys(this.keys).includes(keyId))
        this.keys[keyId as keyof typeof this.keys] = true;
      if (key === " ") this.keys.space = true;
    });

    document.addEventListener("keyup", ({ key }) => {
      const keyId = key.toLowerCase().replace("arrow", "");
      if (Object.keys(this.keys).includes(keyId))
        this.keys[keyId as keyof typeof this.keys] = false;
      if (key === " ") this.keys.space = false;
    });
  }

  update() {
    if (this.keys.left) this.cameraHolderY.rotation.y -= 0.025;
    if (this.keys.right) this.cameraHolderY.rotation.y += 0.025;
    if (this.keys.up) this.cameraHolderX.rotation.x -= 0.025;
    if (this.keys.down) this.cameraHolderX.rotation.x += 0.025;

    // @ts-ignore
    this.position.copy(this.body.position);
    // @ts-ignore
    this.quaternion.copy(this.body.quaternion);

    this.cameraHolderX.position.copy(this.position);
  }
}
