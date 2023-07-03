import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import Stats from 'three/examples/jsm/libs/stats.module'

var camera, scene, renderer, controls;
var container, stats;
var points;

var material;
var intensity_max = 100;
var pcd_file = './data/points/1677099933_997488842.pcd';
var points_name = "plot_points";
//var pcd_file = './data/model/simple.pcd';

init();
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 5000 );
    //camera.position.set ( 0, -10, 5);
    camera.position.x = -10;
    camera.position.y = 0;
    camera.position.z = 5;
    camera.up.set(0, 0, 1);

    scene.add( camera );

    renderer = new THREE.WebGLRenderer( {antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild( renderer.domElement);

    const hemisphereLight = new THREE.HemisphereLight(
      /* sky color = */ 0x51a8dd,
      /* ground color = */ 0xe83015
    );
    scene.add(hemisphereLight);

    loadPCD(pcd_file);

    container = document.createElement('div');
    document.body.appendChild( container );
    container.appendChild( renderer.domElement );

    controls = new OrbitControls( camera, document.body);
    //controls = new TrackballControls( camera, renderer.domElement );
    //controls.rotateSpeed = 2.0;
    //controls.zoomSpeed = 0.3;
    //controls.panSpeed = 0.05;
    //controls.staticMoving = true;
    //controls.minDistance = 0.3;
    //controls.maxDistance = 3 * 100;

    stats = new Stats();
    container.appendChild(stats.dom);



    window.addEventListener( 'resize', onWindowResize, false);
    window.addEventListener( 'keypress', keyboard);

}

function loadPCD(pcd_filename){

    var loader = new PCDLoader();
    loader.load( 
            pcd_file, 
            function (points){
                //points.geometry.center();
                //points.geometry.rotateX( Math.PI);
                material = new THREE.PointsMaterial( { 
                            size: 1, 
                            sizeAttenuation: false, 
                            alphaTest: 0.5, 
                            transparent: true ,
                            vertexColors: true
                        } );
                //material.color.setHSL( 0.8, 0.5, 0.5);
                //points.material = material;

                var points_size = points.geometry.attributes.intensity.count;

                console.log(points_size);
                const colors = [];
                const color = new THREE.Color();
                const positions = points.geometry.getAttribute('position');
                const intensities = points.geometry.getAttribute('intensity');
                const normals = points.geometry.getAttribute('normal');
                const geometry = new THREE.BufferGeometry();
                for(let i=0; i < points_size; i++)
                {
                    var intensity = intensities.array[i];
                    if(intensity > intensity_max)
                    {
                        intensity = intensity_max;
                    }

                    intensity = 1.0 - intensity / intensity_max;
                    color.setHSL(intensity, 1.0, 0.5);
                    //color.setHSL(0.5, 0.5, 0.5);
                    colors.push(color.r, color.g, color.b);
                    
                    //console.log(intensity);
                    //points.geometry.attributes.color.
                }
                geometry.setAttribute('position', new THREE.Float32BufferAttribute( positions.array, 3));
                geometry.setAttribute('intensity', new THREE.Float32BufferAttribute(intensities.array, 1));
                geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals.array, 3));
                geometry.setAttribute('color', new THREE.Float32BufferAttribute( colors, 3));
                geometry.computeBoundingSphere();
                points = new THREE.Points(geometry, material);
                points.name = points_name;

                scene.add(points);
                var center = points.geometry.boundingSphere.center;
                controls.target.set( center.x, center.y, center.z);
                console.log("Add pointcloud from pcd file");
                console.log(points);

                const gui = new GUI();
                gui.add( points.material, 'size', 0.1, 10.0);
                //gui.add( points.material, 'size', 0.001, 1.0).onChange( renderer.render );
                //gui.addColor( points.material, 'color').onChange(renderderer.render);
                gui.open();

                //render();

            }//,
            //function ( xhr ){
            //    console.log( ( xhr.loaded / xhr.total * 100) + '% loaded');
            //},
            //function(error){
            //    console.log('An error happend');
            //}
    );
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
	controls.handleResize();

}


//function render(){
//    renderer.render( scene, camera);
//}

function keyboard( ev ) {

	var points = scene.getObjectByName( points_name );

	switch ( ev.key || String.fromCharCode( ev.keyCode || ev.charCode ) ) {

		case '+':
			points.material.size *= 1.2;
			points.material.needsUpdate = true;
			break;

		case '-':
			points.material.size /= 1.2;
			points.material.needsUpdate = true;
			break;

		case 'c':
			points.material.color.setHex( Math.random() * 0xffffff );
			points.material.needsUpdate = true;
			break;

	}

}

function animate() {

	requestAnimationFrame( animate );
	controls.update();

	renderer.render( scene, camera );
	stats.update();

}

