import * as THREE from 'three';
import { AssetManager } from './managers/AssetManager';
import { StateManager, States } from './managers/StateManager';
import { Game } from './game/Game';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { BlackJackScence } from './ui/BlackJackScene';

const PATH_TO_CARDS = 'yaml/images.yaml';

export class BlackJackMain {
    private scene = new THREE.Scene();
    private camera = new THREE.OrthographicCamera(
      -1000, // Left
      1000,  // Right
      1000,  // Top
      -1000, // Bottom
      0.1,   // Near
      2000   // Far
    );
    private renderer = new THREE.WebGLRenderer();
    private uiRenderer = new CSS2DRenderer();
    
    constructor() {
      // Bind the animate function to the class instance
      this.animate = this.animate.bind(this);

      // Keep the renderer size in sync with the window size
      window.addEventListener('resize', () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.left = -window.innerWidth / 2;
        this.camera.right = window.innerWidth / 2;
        this.camera.top = window.innerHeight / 2;
        this.camera.bottom = -window.innerHeight / 2;
        this.camera.updateProjectionMatrix();

        this.uiRenderer.setSize(window.innerWidth, window.innerHeight);
      });
    }

    public init(): void {
        this.setupScene();
        this.loadAssets();
        this.animate();
        this.setupUIRenderer();
        // After init has been run, we move to the SetupState
        StateManager.getInstance().changeState(States.SETUP);
    }

    private setupScene(): void {
      // Set up the scene (with a green background), camera, and renderer
      this.scene.background = new THREE.Color(0x228B22);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);
      this.camera.position.set(0, 0, 500);
      this.camera.lookAt(0, 0, 0);
      this.camera.left = -window.innerWidth / 2;
      this.camera.right = window.innerWidth / 2;
      this.camera.top = window.innerHeight / 2;
      this.camera.bottom = -window.innerHeight / 2;
      this.camera.updateProjectionMatrix();

      // Set the scene for the game instance
      Game.getInstance().setScene(this.scene);
    }

    private setupUIRenderer(): void {
        this.uiRenderer.setSize(window.innerWidth, window.innerHeight);
        this.uiRenderer.domElement.style.position = 'absolute';
        this.uiRenderer.domElement.style.top = '0px';
        this.uiRenderer.domElement.style.left = '0px';
        this.uiRenderer.domElement.style.pointerEvents = 'none';
        document.body.appendChild(this.uiRenderer.domElement);
        // Create the initial ui container
        BlackJackScence.getInstance().init();
    }

    private animate() {
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
        this.uiRenderer.render(this.scene, this.camera);
      }

    private loadAssets(): void {
        AssetManager.getInstance().loadYaml(PATH_TO_CARDS).then((jsonData) => {
            AssetManager.getInstance().loadAll(jsonData).then(() => {
              console.log('All images loaded');
              document.dispatchEvent(new CustomEvent('customevent', { detail: 'imagesLoaded' }));
            }).catch((error) => {
              console.log('Error loading images:', error);
            });
        }).catch((error) => {
            console.log('Error loading YAML:', error);
        });
    }
}