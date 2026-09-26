import bpy
import math
import numpy as np
import os
import sys
from mathutils import Vector


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
ARGS = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else []
ARCHIVED_SOURCE = os.path.join(ROOT, "source-assets", "macbook_pro_14_inch_M5.glb")
SOURCE = next(
    (arg for arg in ARGS if arg.lower().endswith(".glb")),
    ARCHIVED_SOURCE if os.path.exists(ARCHIVED_SOURCE) else None,
)
PREVIEW = "--preview" in ARGS
CLOSED_PREVIEW = "--closed" in ARGS
START_FRAME = next((int(arg.split("=", 1)[1]) for arg in ARGS if arg.startswith("--start=")), 1)
THEME = next((arg.split("=", 1)[1] for arg in ARGS if arg.startswith("--theme=")), "dark")

if not SOURCE:
    raise SystemExit("Archive the source GLB in source-assets or pass its path after --")
if THEME not in {"light", "dark"}:
    raise SystemExit("Theme must be light or dark")


def point_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def descendants(root):
    items = []
    stack = list(root.children)
    while stack:
        item = stack.pop()
        items.append(item)
        stack.extend(item.children)
    return items


def bounds(objects):
    corners = [obj.matrix_world @ Vector(corner) for obj in objects if obj.type == "MESH" for corner in obj.bound_box]
    minimum = Vector((min(point.x for point in corners), min(point.y for point in corners), min(point.z for point in corners)))
    maximum = Vector((max(point.x for point in corners), max(point.y for point in corners), max(point.z for point in corners)))
    return minimum, maximum


bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=SOURCE)

# The supplied model stores its display artwork in this embedded texture. For
# the light render set, brighten only the artwork's sculpted ribbons while its
# backdrop stays deep blue. This keeps the display dimensional instead of
# turning its entire surface into a flat white panel.
# Keeping the texture on the model makes it follow the display perspective and
# hinge motion instead of behaving like a flat browser overlay.
if THEME == "light":
    wallpaper = bpy.data.images.get("BpRGnHiBWCtcdeB")
    if wallpaper is None:
        raise SystemExit("The expected display wallpaper was not found in the supplied GLB")
    pixels = np.empty(len(wallpaper.pixels), dtype=np.float32)
    wallpaper.pixels.foreach_get(pixels)
    rgba = pixels.reshape((-1, 4))
    luminance = rgba[:, :3].mean(axis=1)
    rgba[:, 0] = 0.015 + luminance * 0.96
    rgba[:, 1] = 0.025 + luminance * 0.95
    rgba[:, 2] = 0.055 + luminance * 0.93
    rgba[:, :3] = np.clip(rgba[:, :3], 0.0, 1.0)
    wallpaper.pixels.foreach_set(pixels)
    wallpaper.update()

model_meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
model_min, model_max = bounds(model_meshes)
model_center = (model_min + model_max) / 2

# The supplied model keeps the lower chassis and display as sibling branches.
# Reparent only the display branch to a world-space hinge while preserving all
# imported material and mesh transforms.
base_group = bpy.data.objects.get("EhCmdLAMoLoXcIA")
lid_root = bpy.data.objects.get("RcexTyyhpuJYATQ")
if not base_group or not lid_root:
    raise SystemExit("The expected display/base hierarchy was not found in the supplied GLB")

lid_meshes = [obj for obj in ([lid_root] + descendants(lid_root)) if obj.type == "MESH"]
lid_min, lid_max = bounds(lid_meshes)
base_meshes = [obj for obj in ([base_group] + descendants(base_group)) if obj.type == "MESH"]
base_min, base_max = bounds(base_meshes)

bpy.ops.object.empty_add(type="PLAIN_AXES", location=(model_center.x, base_max.y - 0.006, base_max.z + 0.006))
hinge = bpy.context.object
hinge.name = "MacBook display hinge"
world_matrix = lid_root.matrix_world.copy()
lid_root.parent = hinge
lid_root.matrix_world = world_matrix

# The imported open geometry leans slightly behind the hinge. A 116-degree turn
# brings its top edge forward onto the keyboard deck.
hinge.rotation_euler = (math.radians(116), 0, 0)
hinge.keyframe_insert(data_path="rotation_euler", frame=1)
hinge.keyframe_insert(data_path="rotation_euler", frame=12)
hinge.rotation_euler = (0, 0, 0)
hinge.keyframe_insert(data_path="rotation_euler", frame=62)
hinge.keyframe_insert(data_path="rotation_euler", frame=72)

# Camera keeps the whole device in frame throughout the hinge rotation.
bpy.ops.object.camera_add(location=(model_center.x, model_min.y - 0.78, model_center.z + 0.105))
camera = bpy.context.object
camera.name = "Product camera"
camera.data.lens = 58
camera.data.sensor_width = 36
point_at(camera, (model_center.x, model_center.y, model_center.z - 0.005))
bpy.context.scene.camera = camera

for name, location, energy, color, size in (
    ("Soft key", (model_center.x - 0.36, model_min.y - 0.24, model_max.z + 0.38), 10, (0.78, 0.87, 1.0), 0.32),
    ("Blue rim", (model_center.x + 0.34, model_max.y + 0.15, model_max.z + 0.25), 8, (0.05, 0.30, 1.0), 0.22),
    ("Front fill", (model_center.x, model_min.y - 0.34, model_center.z + 0.02), 3, (0.34, 0.48, 0.78), 0.24),
):
    bpy.ops.object.light_add(type="AREA", location=location)
    light = bpy.context.object
    light.name = name
    light.data.energy = energy
    light.data.color = color
    light.data.shape = "DISK"
    light.data.size = size
    point_at(light, model_center)

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.eevee.taa_render_samples = 8
scene.render.resolution_x = 960
scene.render.resolution_y = 540
scene.render.resolution_percentage = 100
scene.render.fps = 12
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGB"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.world.use_nodes = True
world_background = scene.world.node_tree.nodes.get("Background")
world_background.inputs["Color"].default_value = (0.0, 0.0, 0.0, 1.0)
world_background.inputs["Strength"].default_value = 0.01

if PREVIEW or CLOSED_PREVIEW:
    scene.frame_set(1 if CLOSED_PREVIEW else 72)
    name = "macbook-import-closed.png" if CLOSED_PREVIEW else "macbook-import-open.png"
    scene.render.filepath = os.path.join(PUBLIC, name)
    bpy.ops.render.render(write_still=True)
else:
    scene.frame_start = START_FRAME
    scene.frame_end = 72
    scene.render.image_settings.file_format = "WEBP"
    scene.render.image_settings.quality = 82
    frame_dir = os.path.join(PUBLIC, "laptop-frames", THEME)
    os.makedirs(frame_dir, exist_ok=True)
    scene.render.filepath = os.path.join(frame_dir, "laptop-")
    bpy.ops.render.render(animation=True)
