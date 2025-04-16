import yaml from 'js-yaml';
import * as THREE from 'three';

/**
 * @description A simple asset manager for loading images and YAML files.
 */
export class AssetManager {
    private static instance: AssetManager;
    private images: Map<string, THREE.Texture>;

    /**
     * Made the AssetManager a singleton for ease of use
     * @returns - The singleton instance of AssetManager.
     */
    static getInstance(): AssetManager {
        if (!AssetManager.instance) {
            AssetManager.instance = new AssetManager();
        }
        return AssetManager.instance;
    }

    constructor() {
        this.images = new Map();
    }
    
    /**
     * @param fileName - The name of the YAML file to load.
     * @returns - The parsed YAML data as JSON.
     */
    async loadYaml(fileName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(`${fileName}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.statusText}`);
                    }
                    return response.text();
                })
                .then((yamlText) => {
                    try {
                        const jsonData = yaml.load(yamlText); // Convert YAML to JSON
                        resolve(jsonData);
                    } catch (error) {
                        reject(`Failed to parse YAML: ${error}`);
                    }
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Loads an image from a given file path + name.
     * @param name - Name of the image
     * @param filePath - Path to the image file
     * @returns - An image, if it loads =)
     */
    async loadImage(name: string, filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();

            loader.load(
                filePath,
                (texture) => {
                    this.images.set(name, texture); // Store the texture's image in the map
                    resolve();
                },
                (error) => {
                    reject(`Failed to load texture: ${filePath}\nError: ${error}`);
                }
            );
        });
    }

    /**
     * Load all data from the YAML file.
     * @param data - The JSON object containing the file names and paths for the cards.
     */
    async loadAll(data: { images: { name: string; path: string }[] }): Promise<void> {
        try {
            const promises = data.images.map((card) => {
                return this.loadImage(card.name, card.path);
            });
    
            await Promise.all(promises);
        } catch (error) {
            console.log('Failed to load images:', error);
            throw error;
        }
    }

    /**
     * @description Gets an image by its name.
     * @param name - The name of the image to retrieve.
     * @returns THREE.Texture | undefined - The image texture if found, otherwise undefined.
     */
    getImage(name: string): THREE.Texture | undefined {
        if (!this.images.has(name)) {
            console.log(`Image not found: ${name}`);
            return undefined;
        }
        return this.images.get(name);
    }

    /**
     * @description Gets all loaded images.
     * @returns - A map of all loaded images.
     */
    getAllImages(): Map<string, THREE.Texture> {
        return this.images;
    }

}