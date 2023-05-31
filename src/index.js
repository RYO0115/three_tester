import * as THREE from 'three';
//import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { ColladaLoader } from 'three/addons/controls/ColladaLoader.js';

//シーンの準備
const scene = new THREE.Scene();

// カメラの準備
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
);
camera.position.z = 20;

//レンダラーの準備
const renderer = new THREE.WebGLRenderer({atialias:true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x7fbfff, 1.0);

document.body.appendChild(renderer.domElement);

// ライトの準備
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(-1,1,1).normalize();
scene.add(directionalLight);

// Colladaファイルの読み込み

let truck;
const truck_loader = new ColladaLoader();

const collada = await truck_loader.loadAsync("./model/field/new_azpg_3d.dae", function (collada) {
    scene.add(collada.scene);
}, undefined, function (error){
    console.error(error);
}
);

const model = collada.scene;

scene.add(model);

renderer.render(scene, camera);

/*
const controls = new OrbitControls(camera, document.body);

function animate()
{
    requestAnimationFrame(animate);

    constrols.update();
        
    renderer.render(scene, camera);
}

animate();
*/


