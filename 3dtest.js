// main.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
const clock = new THREE.Clock();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 5);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting (optional)
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

// Load GLB with animation
const loader = new GLTFLoader();
let mixer;
let action;
let duration = 0;

loader.load('scene.glb', function(gltf) {
  scene.add(gltf.scene);

  mixer = new THREE.AnimationMixer(gltf.scene);
  const clip = gltf.animations[0];
  action = mixer.clipAction(clip);
  duration = clip.duration;

  action.play();
  action.paused = true; // zastavit přehrávání, budeme řídit ručně
});

function animate() {
  requestAnimationFrame(animate);

  if (mixer) {
    // map scroll na čas animace
    const scrollProgress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    const animationTime = scrollProgress * duration;
    mixer.setTime(animationTime);
  }

  renderer.render(scene, camera);
}

animate();
