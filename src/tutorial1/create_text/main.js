import * as THREE from 'three';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();

// load a texture, set wrap mode to repeat
const texture = new THREE.TextureLoader().load( "textures/water.jpg" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 4, 4 );

//const loader = new FontLoader();
//
//loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
//
//	const geometry = new TextGeometry( 'Hello three.js!', {
//		font: font,
//		size: 80,
//		height: 5,
//		curveSegments: 12,
//		bevelEnabled: true,
//		bevelThickness: 10,
//		bevelSize: 8,
//		bevelOffset: 0,
//		bevelSegments: 5
//	} );
//} );


animate()