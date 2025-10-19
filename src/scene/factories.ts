import * as THREE from 'three';
import { CubeObject, SceneObject, Vec3, WallObject } from '../store/appStore';

export const GRID = 0.1;
export const snapToGrid = (n: number, step = GRID) => Math.round(n / step) * step;
export const degToRad = (d: number) => (d * Math.PI) / 180;
export const radToDeg = (r: number) => (r * 180) / Math.PI;

export const makeId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2));

export function defaultVec3(): Vec3 {
  return { x: 0, y: 0, z: 0 };
}

export function createCubeObject(params?: Partial<CubeObject>): CubeObject {
  const width = params?.dims?.width ?? 1;
  const height = params?.dims?.height ?? 1;
  const depth = params?.dims?.depth ?? 1;

  const obj: CubeObject = {
    id: params?.id ?? makeId(),
    type: 'cube',
    name: params?.name ?? 'Cube',
    position: params?.position ?? { x: 0, y: height / 2, z: 0 },
    rotation: params?.rotation ?? defaultVec3(),
    scale: params?.scale ?? { x: 1, y: 1, z: 1 },
    dims: { width, height, depth },
  };
  return obj;
}

export function createCubeMesh(obj: CubeObject): THREE.Mesh {
  const geom = new THREE.BoxGeometry(obj.dims.width, obj.dims.height, obj.dims.depth);
  const mat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.1, roughness: 0.9 });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.userData.__id = obj.id;
  mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
  mesh.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
  mesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function updateCubeMeshFromObject(mesh: THREE.Mesh, obj: CubeObject) {
  // If geometry dimensions changed, recreate geometry
  const g = mesh.geometry as THREE.BoxGeometry;
  const needsGeom = !g || Math.abs(g.parameters.width - obj.dims.width) > 1e-6 || Math.abs(g.parameters.height - obj.dims.height) > 1e-6 || Math.abs(g.parameters.depth - obj.dims.depth) > 1e-6;
  if (needsGeom) {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(obj.dims.width, obj.dims.height, obj.dims.depth);
  }
  mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
  mesh.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
  mesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
}

export function createWallFromPoints(p1: THREE.Vector3, p2: THREE.Vector3, opts?: { thickness?: number; height?: number; id?: string; name?: string }): WallObject {
  const thickness = opts?.thickness ?? 0.1;
  const height = opts?.height ?? 2.4;
  const dir = new THREE.Vector2(p2.x - p1.x, p2.z - p1.z);
  const length = dir.length();
  const angle = Math.atan2(dir.x, dir.y); // rotation around Y to align Z->direction
  const mid = new THREE.Vector3((p1.x + p2.x) / 2, height / 2, (p1.z + p2.z) / 2);

  const obj: WallObject = {
    id: opts?.id ?? makeId(),
    type: 'wall',
    name: opts?.name ?? 'Wall',
    position: { x: mid.x, y: mid.y, z: mid.z },
    rotation: { x: 0, y: angle, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    wall: { thickness, height, length },
  };
  return obj;
}

export function createWallMesh(obj: WallObject): THREE.Mesh {
  const geom = new THREE.BoxGeometry(obj.wall.length, obj.wall.height, obj.wall.thickness);
  const mat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.05, roughness: 0.95 });
  const mesh = new THREE.Mesh(geom, mat);
  mesh.userData.__id = obj.id;
  mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
  mesh.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
  mesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function updateWallMeshFromObject(mesh: THREE.Mesh, obj: WallObject) {
  const g = mesh.geometry as THREE.BoxGeometry;
  const needsGeom = !g || Math.abs(g.parameters.width - obj.wall.length) > 1e-6 || Math.abs(g.parameters.height - obj.wall.height) > 1e-6 || Math.abs(g.parameters.depth - obj.wall.thickness) > 1e-6;
  if (needsGeom) {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(obj.wall.length, obj.wall.height, obj.wall.thickness);
  }
  mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
  mesh.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
  mesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
}

export function createMeshForObject(obj: SceneObject): THREE.Mesh {
  if (obj.type === 'cube') return createCubeMesh(obj);
  if (obj.type === 'wall') return createWallMesh(obj);
  const geom = new THREE.BoxGeometry(1, 1, 1);
  const mat = new THREE.MeshNormalMaterial();
  const mesh = new THREE.Mesh(geom, mat);
  mesh.userData.__id = obj.id;
  return mesh;
}

export function updateMeshFromObject(mesh: THREE.Mesh, obj: SceneObject) {
  if (obj.type === 'cube') return updateCubeMeshFromObject(mesh, obj);
  if (obj.type === 'wall') return updateWallMeshFromObject(mesh, obj);
  mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
  mesh.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
  mesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
}
