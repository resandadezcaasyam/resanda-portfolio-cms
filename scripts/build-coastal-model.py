"""Run with Blender's Python module (bpy 4.2) or blender --background --python.
Creates the editable source and a compact, texture-free GLB for the website.
"""
import bpy
from math import radians
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, color):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Roughness'].default_value = .8
    return m

cream=material('Warm porcelain',(.92,.86,.71))
ink=material('Indigo roofs',(.15,.19,.34))
coral=material('Terracotta',(.85,.28,.16))
sea=material('Sea glass',(.34,.62,.65))
pink=material('Cherry blossom',(.94,.59,.61))
wood=material('Cedar',(.35,.22,.19))
gold=material('Window light',(.99,.73,.32))
stone=material('Lavender concrete',(.57,.57,.68))

def group(name):
    obj=bpy.data.objects.new(name,None)
    bpy.context.collection.objects.link(obj)
    return obj

def box(name,location,scale,mat,parent=None,bevel=.04):
    bpy.ops.mesh.primitive_cube_add(size=1,location=location)
    obj=bpy.context.object;obj.name=name;obj.dimensions=scale
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    obj.data.materials.append(mat)
    if bevel:
        mod=obj.modifiers.new('Soft edges','BEVEL');mod.width=bevel;mod.segments=2
        bpy.context.view_layer.objects.active=obj
        bpy.ops.object.modifier_apply(modifier=mod.name)
        obj.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
    obj.parent=parent
    return obj

box('Sea tile',(0,0,-.28),(5.3,3.6,.25),sea,bevel=.15)
box('Island',(0,.25,-.08),(4.7,2.6,.25),cream,bevel=.15)
for i in range(4):
    box('Water line '+str(i),(-1.6+i*.95,-1.48,-.14),(.45,.025,.02),cream,bevel=.01)

def house(name,x,y,width,height,mat):
    parent=group(name)
    box(name+' walls',(x,y,height/2),(width,.75,height),mat,parent)
    vertices=[(x-width*.62,y-.5,height),(x+width*.62,y-.5,height),(x-width*.62,y+.5,height),(x+width*.62,y+.5,height),(x-width*.62,y,height+.45),(x+width*.62,y,height+.45)]
    mesh=bpy.data.meshes.new(name+' roof mesh')
    mesh.from_pydata(vertices,[],[(0,1,5,4),(2,4,5,3),(0,4,2),(1,3,5),(0,2,3,1)])
    mesh.update()
    roof=bpy.data.objects.new(name+' roof',mesh);bpy.context.collection.objects.link(roof);roof.data.materials.append(ink);roof.parent=parent
    for dx in [-.22,.22]:
        box(name+' window',(x+dx,y-.383,height*.58),(.2,.026,.27),gold,parent,.01)
    box(name+' door',(x,y-.39,.19),(.18,.04,.36),wood,parent,.01)
    return parent

house('Studio',-1.35,.65,.88,.88,coral)
house('Library',-.1,.8,1.05,1.12,cream)
house('Workshop',1.23,.72,.86,.72,stone)
for x in [-1.8,-.7,.7,1.8]:
    box('Bridge pier',(x,-.62,.2),(.14,.3,.58),stone)
box('Railway viaduct',(0,-.62,.52),(4.65,.6,.16),stone)
for y in [-.8,-.44]:
    box('Steel rail',(0,y,.63),(4.65,.025,.03),ink,bevel=.01)
train=group('Train')
for x in [-.58,.12,.82]:
    box('Train carriage',(x,-.62,.82),(.66,.4,.37),cream,train,.085)
    box('Train stripe',(x,-.832,.78),(.57,.012,.06),coral,train,.01)
    for dx in [-.17,0,.17]:
        box('Train glass',(x+dx,-.828,.92),(.12,.018,.12),ink,train,.01)

grove=group('Blossoms')
for x,y in [(-2,.25),(2,.5),(.65,1.25)]:
    box('Tree trunk',(x,y,.5),(.085,.085,.9),wood,grove,.015)
    for dx,dy,dz in [(0,0,0),(-.18,.04,-.06),(.17,-.05,-.03)]:
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1,radius=.32,location=(x+dx,y+dy,1.03+dz))
        obj=bpy.context.object;obj.name='Blossom canopy';obj.data.materials.append(pink);obj.parent=grove

for x in [-2.1,2.1]:
    box('Rail pole',(x,-.96,1.04),(.035,.035,.94),ink,bevel=.008)
box('Overhead cable',(0,-.96,1.5),(4.25,.013,.013),ink,bevel=0)

bpy.context.scene.world.color=(.7,.7,.7)
(ROOT/'assets/models').mkdir(parents=True,exist_ok=True)
(ROOT/'public/models').mkdir(parents=True,exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/models/coastal-studio.blend'))
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/coastal-studio.glb'),export_format='GLB',export_apply=True,export_animations=False,export_yup=True,export_cameras=False,export_lights=False)
print('Saved editable Blender source and website GLB.')
