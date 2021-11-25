import './style.css'
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
const canvas = document.querySelector('.webgl')

class NewScene{
    constructor(){
        this._Init()
    }
    
    _Init(){
        this.scene = new THREE.Scene()
        this.clock = new THREE.Clock()
        this.InitShader()
        this.InitCamera()
        this.InitLights()
        this.InitRenderer()
        this.InitControls()
        this.Update()
        window.addEventListener('resize', () => {
            this.Resize()
        })
    }

    InitShader(){
        this.geometry = new THREE.BoxBufferGeometry(3, 3, 3, 20, 20, 20)
        this.material = new THREE.ShaderMaterial({
                    side: THREE.DoubleSide,
                    vertexShader: vertex,
                    fragmentShader: fragment,
                    uniforms: {
                        u_time: { value: 0.0},
                        u_resolution: { value: new THREE.Vector2() },
                        u_mouse: { value: new THREE.Vector2() }
                    },
                    //transparent: true,
                    depthTest: false,
                    depthWrite: false,
                    blending: THREE.AdditiveBlending
                })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
        this.fontLoader = new THREE.FontLoader()
        this.fontLoader.load(
            './font.json',
            (font) => {
                this.textParameters = {
                    font: font,
                    size: 0.3,
                    height: 0.1,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                }
                this.textGeometry = new THREE.TextGeometry(
                    'Wake up, Neo...',
                    this.textParameters
                )
                
                this.textGeometry.computeBoundingBox()
                this.textGeometry.center()
                this.text = new THREE.Mesh(this.textGeometry, new THREE.MeshStandardMaterial({color: 0x191919 }))
                this.text.position.set(0, 0 , -2)
                this.scene.add(this.text)        
            }
        ) 
    }

    InitCamera(){
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 100)
        this.camera.position.set(0, 0.25, 1.25)
        this.scene.add(this.camera)
    }

    InitLights(){
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        this.scene.add(this.ambientLight)
        this.pointLight = new THREE.PointLight(0x00ff00, 10.5)
        this.scene.add(this.pointLight)
        this.pointLight.position.set(0, 0, 2)
    }

    InitRenderer(){
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
        })
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.render(this.scene, this.camera)
    }

    InitControls(){
        this.controls = new OrbitControls(this.camera, canvas)
        this.controls.enableDamping = true
        this.controls.update()
        this.controls.enableZoom = false
        this.controls.enablePan = false
    }

    Resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    Update(){
        requestAnimationFrame(() => { 
            //console.log(this.material.uniforms.u_time.value) 
            this.material.uniforms.u_time.value = this.clock.getElapsedTime()   
            this.renderer.render(this.scene, this.camera)
            this.controls.update()
            this.Update()
        })  
    }
}

let _APP = null

window.addEventListener('DOMContentLoaded', () => {
    _APP = new NewScene()
})
