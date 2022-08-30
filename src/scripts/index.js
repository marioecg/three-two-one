import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import planeVertex from './glsl/plane.vert'
import planeFragment from './glsl/plane.frag'

import { Random, random_hash } from './utils'

import { Pane } from 'tweakpane'

/* -------------------------------------------------------------------------- */
/*                                    PRNG                                    */
/* -------------------------------------------------------------------------- */
let tokenData = {
    hash: random_hash(),
    tokenId: '123000456',
}

let R = new Random(tokenData.hash)

/* -------------------------------------------------------------------------- */
/*                                     GUI                                    */
/* -------------------------------------------------------------------------- */
let PARAMS = {
    freq: 0,
    amp: 0,
    progress: 0,
}

let pane = new Pane()

pane.addInput(PARAMS, 'freq', { label: 'frequency', min: 0, max: 1, step: 0.1 })
pane.addInput(PARAMS, 'amp', { label: 'amplitude', min: 0, max: 1, step: 0.1 })
pane.addInput(PARAMS, 'progress', { label: 'progress', min: 0, max: 1, step: 0.1 })

/* -------------------------------------------------------------------------- */
/*                               Sketch settings                              */
/* -------------------------------------------------------------------------- */
let SCL = 0.5
let WIDTH = 1000 * SCL
let HEIGHT = 1000 * SCL
let PIXEL_RATIO = Math.max(window.devicePixelRatio, 2)

/* -------------------------------------------------------------------------- */
/*                                  Graphics                                  */
/* -------------------------------------------------------------------------- */
let canvas = document.querySelector('#gl')
let camera, scene, renderer
let planeGeometry, planeMaterial, plane
let controls, clock, time

let uniforms = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(WIDTH, HEIGHT) },
}

init()
requestAnimationFrame(render)

function init() {
    /* -------------------------------- Renderer -------------------------------- */
    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    })
    renderer.setClearColor(0xffffff, 1)
    renderer.setPixelRatio(PIXEL_RATIO)

    /* --------------------------------- Camera --------------------------------- */
    camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)
    camera.position.z = 5

    /* ---------------------------------- Scene --------------------------------- */
    scene = new THREE.Scene()

    /* ---------------------------------- Plane --------------------------------- */
    planeGeometry = new THREE.PlaneBufferGeometry(2, 2)
    planeMaterial = new THREE.ShaderMaterial({
        vertexShader: planeVertex,
        fragmentShader: planeFragment,
        uniforms: {
            uTime: uniforms.uTime,
            uResolution: uniforms.uResolution,
            uFreq: { value: PARAMS.freq },
            uAmp: { value: PARAMS.amp },
            uProgress: { value: PARAMS.progress },
        }
    })
    plane = new THREE.Mesh(planeGeometry, planeMaterial)

    scene.add(plane)

    /* ------------------------------- Scene utils ------------------------------ */
    controls = new OrbitControls(camera, canvas)
    clock = new THREE.Clock()

    /* --------------------------------- Events --------------------------------- */
    resize()
    window.addEventListener('resize', resize, false)
}

function resize() {
    camera.aspect = WIDTH / HEIGHT
    camera.updateProjectionMatrix()

    renderer.setSize(WIDTH, HEIGHT)
}

function render() {
    requestAnimationFrame(render)

    time = clock.getElapsedTime()

    uniforms.uTime.value = time

    planeMaterial.uniforms.uFreq.value = PARAMS.freq
    planeMaterial.uniforms.uAmp.value = PARAMS.amp
    planeMaterial.uniforms.uProgress.value = PARAMS.progress

    renderer.render(scene, camera)
}