// import "./console";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import * as CANNON from "cannon-es";
import { Plane } from "./plane";

console.log("hello world");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const light = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(light);
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

scene.add(new THREE.GridHelper(1000, 1000));

// const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

const loadGLTF = async (
  key: string,
  url: string,
  onprogress: (event: ProgressEvent<EventTarget>) => void = () => {}
) => {
  const loader = new GLTFLoader();
  // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://threejs.org/examples/js/libs/draco/");
  loader.setDRACOLoader(dracoLoader);
  return {
    name: key,
    model: await loader.loadAsync(url, onprogress),
  };
};

const loadWorld = false;
const physics = new CANNON.World({
  gravity: new CANNON.Vec3(0, -10, 0), // m/s²
});

const groundMaterial = new CANNON.Material();
const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  material: groundMaterial,
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up
physics.addBody(groundBody);

const radius = 1; // m
const sphereBody = new CANNON.Body({
  mass: 5, // kg
  shape: new CANNON.Sphere(radius),
});
sphereBody.position.set(0, 20, 0.1); // m
physics.addBody(sphereBody);
const sphereGeometry = new THREE.SphereGeometry(radius);
const sphereMaterial = new THREE.MeshNormalMaterial();
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphereMesh);

const box = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
  mass: 5,
});
// physics.addBody(box);
const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), sphereMaterial);
// scene.add(boxMesh);
box.position.set(0, 10, 0);
console.log(box);

const planeBody = new CANNON.Body({
  mass: 3,
});
// physics.addBody(planeBody);
const tube = new THREE.Mesh(
  new THREE.CylinderGeometry(1.6, 1.6, 28, 32, 10),
  sphereMaterial
);
tube.position.y = 0.5;
// tube.position.y = 5;
tube.rotation.x = -Math.PI / 2;
tube.position.z = 3;
const tubeBody = new CANNON.Body({
  shape: new CANNON.Cylinder(1.6, 1.6, 20),
  // material:,
  mass: 1,
  type: CANNON.Body.DYNAMIC,
});
tubeBody.position.copy(tube.position);
tubeBody.quaternion.copy(tube.quaternion);
physics.addBody(tubeBody);
// scene.add(tube);
planeBody.addShape(
  new CANNON.Cylinder(1.6, 1.6, 28)
  // new CANNON.Vec3(0, 0.5, 3),
  // new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0)
);
console.log(planeBody);
const wingLeft = new THREE.Mesh(
  new THREE.BoxGeometry(17.5, 1, 4),
  sphereMaterial
);
wingLeft.position.x = -8;
wingLeft.position.z = 5;
wingLeft.rotation.z = -0.06;
wingLeft.rotation.y = 0.6;
// scene.add(wingLeft);
const wingLeftBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(17.5 / 2, 1 / 2, 4 / 2)),
  mass: 1,
});
wingLeftBody.position.copy(wingLeft.position);
wingLeftBody.quaternion.copy(wingLeft.quaternion);
physics.addBody(wingLeftBody);
const wingLeftConstraint = new CANNON.LockConstraint(tubeBody, wingLeftBody);
physics.addConstraint(wingLeftConstraint);
const wingRight = new THREE.Mesh(
  new THREE.BoxGeometry(17.5, 1, 4),
  sphereMaterial
);
wingRight.position.x = 8;
wingRight.position.z = 5;
wingRight.rotation.z = 0.06;
wingRight.rotation.y = -0.6;
// scene.add(wingRight);
const wingRightBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(17.5 / 2, 1 / 2, 4 / 2)),
  mass: 1,
});
wingRightBody.position.copy(wingRight.position);
wingRightBody.quaternion.copy(wingRight.quaternion);
physics.addBody(wingRightBody);
const wingRightConstraint = new CANNON.LockConstraint(tubeBody, wingRightBody);
physics.addConstraint(wingRightConstraint);
const finTop = new THREE.Mesh(new THREE.BoxGeometry(0.2, 7, 3), sphereMaterial);
finTop.rotation.x = 0.7;
finTop.position.z = 14;
finTop.position.y = 3;
// scene.add(finTop);
const finTopBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(0.2 / 2, 7 / 2, 3 / 2)),
  mass: 1,
});
finTopBody.position.copy(finTop.position);
finTopBody.quaternion.copy(finTop.quaternion);
physics.addBody(finTopBody);
const finTopConstraint = new CANNON.LockConstraint(tubeBody, finTopBody);
physics.addConstraint(finTopConstraint);
const finLeft = new THREE.Mesh(
  new THREE.BoxGeometry(7, 0.2, 2),
  sphereMaterial
);
finLeft.position.z = 15;
finLeft.position.y = 1.6;
finLeft.position.x = -2.4;
finLeft.rotation.y = 0.6;
// scene.add(finLeft);
const finLeftBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(7 / 2, 0.2 / 2, 2 / 2)),
  mass: 1,
});
finLeftBody.position.copy(finLeft.position);
finLeftBody.quaternion.copy(finLeft.quaternion);
physics.addBody(finLeftBody);
const finLeftConstraint = new CANNON.LockConstraint(tubeBody, finLeftBody);
physics.addConstraint(finLeftConstraint);
const finRight = new THREE.Mesh(
  new THREE.BoxGeometry(7, 0.2, 2),
  sphereMaterial
);
finRight.position.z = 15;
finRight.position.y = 1.6;
finRight.position.x = 2.4;
finRight.rotation.y = -0.6;
// scene.add(finRight);
const finRightBody = new CANNON.Body({
  shape: new CANNON.Box(new CANNON.Vec3(7 / 2, 0.2 / 2, 2 / 2)),
  mass: 1,
});
finRightBody.position.copy(finRight.position);
finRightBody.quaternion.copy(finRight.quaternion);
physics.addBody(finRightBody);
const finRightConstraint = new CANNON.LockConstraint(tubeBody, finRightBody);
physics.addConstraint(finRightConstraint);

const loadModels = async (
  images: { [key: string]: string },
  onProgress: (loaded: number, total: number) => void = () => {}
) => {
  const loadedNumbers = Object.keys(images).map(() => 0);
  const totalNumbers = Object.keys(images).map(() => 1);
  const imgs = Object.keys(images).map((key, idx) =>
    loadGLTF(key, images[key], ({ loaded, total }) => {
      loadedNumbers[idx] = loaded;
      totalNumbers[idx] = total;
      onProgress(
        loadedNumbers.reduce((a, b) => a + b),
        totalNumbers.reduce((a, b) => a + b)
      );
    })
  );
  const loadedImgs = await Promise.all(imgs);
  console.log(loadedImgs);
  const finishedImgs: { [key: string]: GLTF } = {};
  loadedImgs.forEach(({ name, model }) => {
    finishedImgs[name] = model;
  });
  console.log(finishedImgs);
  return finishedImgs;
};
loadModels(
  loadWorld
    ? {
        plane: "./models/plane_small.glb",
        world: "./models/island.glb",
      }
    : {
        plane: "./models/plane_small.glb",
      },
  (loaded, total) => {
    (document.querySelector(".load") as HTMLDivElement).style.width =
      ((loaded / total) * 100).toString() + "%";
  }
)
  .then(({ plane: airplane, world }) => {
    (document.querySelector(".load-outer") as HTMLDivElement).style.display =
      "none";
    const { scene: planeModel } = airplane;
    planeModel.scale.set(0.01, 0.01, 0.01);
    planeModel.rotation.x = -Math.PI / 2;
    const plane = new Plane(planeModel);
    scene.add(planeModel);
    scene.add(plane.addCamera(camera));

    physics.addBody(plane.body);
    physics.addContactMaterial(
      new CANNON.ContactMaterial(groundMaterial, plane.bodyMaterial, {
        restitution: 0.6,
      })
    );
    sphereBody.material = plane.bodyMaterial;

    if (loadWorld) {
      const { scene: worldModel } = world;
      scene.add(worldModel);
    }
    window.plane = plane.body;

    const render = () => {
      // controls.update();
      physics.fixedStep();

      // @ts-ignore
      sphereMesh.position.copy(sphereBody.position);
      // @ts-ignore
      sphereMesh.quaternion.copy(sphereBody.quaternion);

      // @ts-ignore
      boxMesh.position.copy(box.position);
      boxMesh.quaternion.copy(box.quaternion);
      // console.log(box.velocity.z);
      // @ts-ignore
      boxMesh.quaternion.copy(box.quaternion);

      // @ts-ignore
      tube.position.copy(tubeBody.position);
      // @ts-ignore
      tube.quaternion.copy(tubeBody.quaternion);
      // @ts-ignore
      wingLeft.position.copy(wingLeftBody.position);
      // @ts-ignore
      wingLeft.quaternion.copy(wingLeftBody.quaternion);
      // @ts-ignore
      wingRight.position.copy(wingRightBody.position);
      // @ts-ignore
      wingRight.quaternion.copy(wingRightBody.quaternion);
      // @ts-ignore
      finTop.position.copy(finTopBody.position);
      // @ts-ignore
      finTop.quaternion.copy(finTopBody.quaternion);
      // @ts-ignore
      finLeft.position.copy(finLeftBody.position);
      // @ts-ignore
      finLeft.quaternion.copy(finLeftBody.quaternion);
      // @ts-ignore
      finRight.position.copy(finRightBody.position);
      // @ts-ignore
      finRight.quaternion.copy(finRightBody.quaternion);

      planeModel.position.copy(tubeBody.position);
      planeModel.quaternion.copy(tubeBody.quaternion);
      planeModel.rotateZ(Math.PI / 2);
      planeModel.translateZ(-1);
      planeModel.translateX(3);

      plane.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
  })
  .catch((e) => console.error(e));

renderer.domElement.addEventListener("wheel", ({ deltaY }) => {
  camera.position.z += deltaY / 100;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
