import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls, TransformControls } from 'three-stdlib';
import { useAppStore } from '../store/appStore';
import {
  createMeshForObject,
  snapToGrid,
  updateMeshFromObject,
  createWallFromPoints,
} from '../scene/factories';

export const Viewport: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0d10);

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(6, 6, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const grid = new THREE.GridHelper(20, 20, 0x4b5563, 0x1f2937);
    const axes = new THREE.AxesHelper(1.5);
    grid.position.y = 0;
    scene.add(grid);
    scene.add(axes);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(5, 10, 5);
    dir.castShadow = true;
    scene.add(ambient);
    scene.add(dir);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.target.set(0, 0, 0);

    const tControls = new TransformControls(camera, renderer.domElement);
    tControls.setSpace('world');
    tControls.size = 0.9;
    scene.add(tControls);

    tControls.addEventListener('dragging-changed', (e: any) => {
      orbit.enabled = !e.value;
    });

    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    const meshById = new Map<string, THREE.Mesh>();

    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y=0

    const getIntersections = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(objectsGroup.children, true);
      return hits as THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[];
    };

    const getPlanePoint = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const point = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, point);
      return point;
    };

    // Sync objects from store to scene
    const syncObjects = (objects: ReturnType<typeof useAppStore.getState>['objects']) => {
      const ids = new Set(objects.map((o) => o.id));
      for (const [id, mesh] of Array.from(meshById.entries())) {
        if (!ids.has(id)) {
          objectsGroup.remove(mesh);
          if (mesh.geometry) mesh.geometry.dispose();
          if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
          else (mesh.material as THREE.Material).dispose();
          meshById.delete(id);
        }
      }
      for (const obj of objects) {
        const existing = meshById.get(obj.id);
        if (!existing) {
          const mesh = createMeshForObject(obj);
          objectsGroup.add(mesh);
          meshById.set(obj.id, mesh);
        } else {
          updateMeshFromObject(existing, obj);
        }
      }
    };

    const selectByEvent = (event: PointerEvent) => {
      const hits = getIntersections(event);
      const setSelection = useAppStore.getState().setSelection;
      if (hits.length > 0) {
        const hit = hits[0].object as THREE.Mesh;
        const root = hit as any;
        const id = root.userData?.__id as string | undefined;
        if (id) {
          setSelection([id], event.ctrlKey || event.metaKey);
        }
      } else {
        setSelection([]);
      }
    };

    let wallStart: THREE.Vector3 | null = null;

    const onPointerDown = (e: PointerEvent) => {
      const { activeTool } = useAppStore.getState().ui;
      if (activeTool === 'select') {
        // If clicking on gizmo, let transform controls handle it
        selectByEvent(e);
      } else if (activeTool === 'addWall') {
        const p = getPlanePoint(e);
        if (!p) return;
        p.x = snapToGrid(p.x);
        p.y = 0; // on ground
        p.z = snapToGrid(p.z);
        if (!wallStart) {
          wallStart = p.clone();
        } else {
          const wallObj = createWallFromPoints(wallStart, p);
          useAppStore.getState().addObject(wallObj, { pushHistory: true });
          useAppStore.getState().setSelection([wallObj.id]);
          wallStart = null;
          // Switch back to select after creating a wall
          useAppStore.getState().setActiveTool('select');
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);

    // Subscribe to store updates
    const unsubObjects = useAppStore.subscribe((s) => s.objects, (objects) => {
      syncObjects(objects);
      const sel = useAppStore.getState().selection.selectedIds;
      const id = sel[0];
      const mesh = id ? meshById.get(id) ?? null : null;
      if (mesh && tControls.object !== mesh) {
        tControls.attach(mesh);
      }
      if (!mesh) tControls.detach();
    });

    const unsubSelection = useAppStore.subscribe((s) => s.selection.selectedIds, (ids) => {
      const id = ids[0];
      const mesh = id ? meshById.get(id) ?? null : null;
      if (mesh) tControls.attach(mesh);
      else tControls.detach();
    });

    const applyToolMode = () => {
      const tool = useAppStore.getState().ui.activeTool;
      const selectedId = useAppStore.getState().selection.selectedIds[0];
      const mesh = selectedId ? meshById.get(selectedId) ?? null : null;
      if (tool === 'move' || tool === 'rotate' || tool === 'scale') {
        if (mesh) tControls.attach(mesh);
        tControls.visible = !!mesh;
        tControls.setMode(tool === 'move' ? 'translate' : tool === 'rotate' ? 'rotate' : 'scale');
      } else {
        tControls.visible = false;
        tControls.detach();
      }
    };

    const unsubTool = useAppStore.subscribe((s) => s.ui.activeTool, () => applyToolMode());

    const applySnap = () => {
      const snap = useAppStore.getState().ui.snap;
      tControls.setTranslationSnap(snap.translate);
      tControls.setRotationSnap((snap.rotate * Math.PI) / 180);
      tControls.setScaleSnap(snap.scale);
    };

    const unsubSnap = useAppStore.subscribe((s) => s.ui.snap, () => applySnap());

    // Transform controls -> store sync
    let transforming = false;
    tControls.addEventListener('mouseDown', () => {
      transforming = true;
      useAppStore.getState().pushHistorySnapshot();
    });
    tControls.addEventListener('mouseUp', () => {
      transforming = false;
    });
    tControls.addEventListener('objectChange', () => {
      const obj = tControls.object as THREE.Mesh | null;
      if (!obj) return;
      const id = (obj as any).userData?.__id as string | undefined;
      if (!id) return;
      const state = useAppStore.getState();
      const next = state.objects.find((o) => o.id === id);
      if (!next) return;
      state.updateObject(
        id,
        {
          position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
          rotation: { x: obj.rotation.x, y: obj.rotation.y, z: obj.rotation.z },
          scale: { x: obj.scale.x, y: obj.scale.y, z: obj.scale.z },
        },
        { pushHistory: false }
      );
    });

    applyToolMode();
    applySnap();

    let raf = 0;
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      orbit.update();
      renderer.render(scene, camera);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) useAppStore.getState().redo();
        else useAppStore.getState().undo();
      } else if (mod && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        useAppStore.getState().redo();
      }
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKeyDown);
    onResize();
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKeyDown);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      unsubObjects();
      unsubSelection();
      unsubTool();
      unsubSnap();
      orbit.dispose();
      tControls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="viewport" ref={containerRef}>
      <div className="overlay">Y-up • meters • Orbit: Right/drag</div>
    </div>
  );
};
