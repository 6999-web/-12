# 310 智能实验室 3D 场景交互与 Collider 开发规范

本文档用于说明 310 智能实验室数字孪生 3D 场景中，模型点击、Collider 点击热区、工位映射、WASD/QE 漫游等交互规则。

重点说明：

```txt
Collider 是点击热区，不是展示模型。
用户不应该看到 collider 实体。
WASD/QE 键盘漫游需要保留。
点击识别必须 collider-only。
```

## 1. 当前 3D 场景定位

当前 310 3D 场景是一个 Web 端数字孪生空间。

主要包含：

- 310 实验室空间结构
- 工位区
- 会议区
- 硬件工位区
- 成果展示墙
- 人员展示墙
- 设备状态展示
- 点击选中与信息卡
- WASD/QE 键盘漫游
- 鼠标 OrbitControls 视角控制

当前项目不是单纯的模型展示页面，而是：

```txt
GLB 模型层 + 前端交互层 + 业务数据层
```

## 2. Collider 的定位

Collider 的作用是：

```txt
帮助前端准确点击对象
```

Collider 不负责：

```txt
视觉展示
模型造型
材质效果
装饰效果
```

也就是说：

```txt
用户应该看到桌子、椅子、屏幕、设备。
用户不应该看到 collider 盒子。
```

如果页面上出现一堆实体透明盒、灰盒、蓝盒、黑盒，那就是错误表现。

## 3. 为什么需要 Collider

真实 GLB 模型通常包含很多复杂 Mesh，例如：

```txt
桌面
桌腿
椅子
椅脚
显示器
键盘
鼠标
杯子
设备
线缆
装饰件
```

如果前端直接 raycast 这些真实模型，会出现几个问题：

1. 性能差  
   Raycaster 会扫描大量 mesh，80 个工位会非常卡。

2. 点击不准确  
   用户点一个工位，可能命中桌腿、椅子、显示器，而不是工位整体。

3. 业务映射困难  
   真实模型的 mesh 名称不一定对应业务对象。

4. 高亮混乱  
   可能只高亮一个桌腿或一个显示器，而不是整个工位。

所以正确做法是：

```txt
真实模型负责显示
Collider 负责点击
Root 负责业务选中
```

## 4. 正确的点击结构

每个可交互对象建议有三层：

```txt
root      业务对象父级
mesh      真实显示模型
collider  点击热区
```

工位示例：

```txt
seat_r01_c01_root
├─ seat_r01_c01_desk
├─ seat_r01_c01_chair
├─ seat_r01_c01_device
└─ seat_r01_c01_collider
```

其中：

```txt
seat_r01_c01_root       工位业务对象
seat_r01_c01_desk       桌子模型
seat_r01_c01_chair      椅子模型
seat_r01_c01_device     电脑/设备模型
seat_r01_c01_collider   点击热区
```

前端点击时：

```txt
点击 collider
找到 root
高亮 root
显示 root 对应的信息卡
```

不要高亮 collider 本身。

## 5. 工位命名规范

工位 collider 命名：

```txt
seat_r01_c01_collider
seat_r01_c02_collider
seat_r02_c01_collider
```

对应 root 命名：

```txt
seat_r01_c01_root
seat_r01_c02_root
seat_r02_c01_root
```

命名规则：

```txt
seat_r{行号}_c{列号}_collider
seat_r{行号}_c{列号}_root
```

例如：

```txt
第 1 行第 1 列：
seat_r01_c01_collider
seat_r01_c01_root

第 5 行第 16 列：
seat_r05_c16_collider
seat_r05_c16_root
```

行列编号必须补零：

```txt
r01
c01
```

不要写成：

```txt
r1
c1
```

## 6. Collider 到 Root 的映射规则

从 collider 名称去掉：

```txt
_collider
```

即可得到对象 ID。

示例：

```txt
seat_r01_c01_collider
```

去掉 `_collider` 后：

```txt
seat_r01_c01
```

再拼接：

```txt
_root
```

得到：

```txt
seat_r01_c01_root
```

前端代码逻辑：

```ts
const collider = hit.object;
const id = collider.name.replace(/_collider$/, "");
const root = scene.getObjectByName(`${id}_root`);

select(root ?? collider.parent ?? collider);
```

最终：

```txt
点击 seat_r01_c01_collider
选中 seat_r01_c01_root
```

## 7. Raycaster 必须 Collider-only

错误写法：

```ts
raycaster.intersectObjects(scene.children, true);
```

这个写法会扫描整个场景，包括：

```txt
桌子
椅子
电脑
显示器
墙体
地板
灯带
装饰线
```

会导致：

```txt
性能下降
点击误判
选中错误对象
```

正确写法：

```ts
const colliders: THREE.Mesh[] = [];

scene.traverse((object) => {
  if (
    object instanceof THREE.Mesh &&
    object.name.endsWith("_collider") &&
    object.userData.selectable === true
  ) {
    colliders.push(object);
  }
});

const hits = raycaster.intersectObjects(colliders, false);
```

重点：

```txt
只检测 *_collider
intersectObjects 第二个参数用 false
不要递归扫描真实模型
```

## 8. Collider 可见性规则

Collider 不应该显示成实体。

错误做法：

```ts
collider.material = new THREE.MeshStandardMaterial({ color: "red" });
```

错误表现：

```txt
页面上看到一堆红盒子/蓝盒子/灰盒子
```

正确做法：

```ts
const colliderMaterial = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
});

collider.visible = true;
collider.material = colliderMaterial;
collider.userData.__isCollider = true;
collider.userData.selectable = true;
```

注意：

```txt
collider.visible = true
material.opacity = 0
```

不要直接：

```ts
collider.visible = false;
```

因为在部分 Three.js/Raycast 使用方式里，`visible = false` 的对象可能不会被命中。

所以正确理解是：

```txt
视觉上透明
逻辑上可点击
```

## 9. Blender 里 Collider 是 Empty 怎么办

如果 Blender 里做的是 Empty 空物体，需要注意：

```txt
Empty 没有几何体
Three.js Raycaster 不能直接点击 Empty
```

所以如果导出的是 Empty，有两种方案。

### 方案 A：Blender 中使用 Cube Mesh 做 Collider

在 Blender 中给每个工位放一个简单 Cube。

命名：

```txt
seat_r01_c01_collider
```

导出 GLB 后，前端把它设为透明材质。

优点：

```txt
点击区域最稳定
raycast 最简单
不需要前端生成几何体
```

缺点：

```txt
Blender 里会看到这些盒子
需要注意不要误删
```

### 方案 B：Blender 中使用 Empty，前端生成透明 Box Mesh

如果 Blender 里一定要用 Empty，则前端需要根据 Empty 的位置、旋转、缩放生成一个 BoxGeometry。

示例逻辑：

```ts
const empty = scene.getObjectByName("seat_r01_c01_collider");

const geometry = new THREE.BoxGeometry(1.4, 0.2, 1.0);
const mesh = new THREE.Mesh(geometry, colliderMaterial);

mesh.name = empty.name;
mesh.position.copy(empty.position);
mesh.rotation.copy(empty.rotation);
mesh.scale.copy(empty.scale);
mesh.userData.__isCollider = true;
mesh.userData.selectable = true;

empty.parent?.add(mesh);
```

重点：

```txt
Empty 本身不能点
必须生成可 raycast 的 Mesh
```

## 10. 推荐方案

当前项目更推荐：

```txt
Blender 中用 Cube Mesh 做 collider
前端加载后把 collider 透明
```

也就是：

```txt
方案 A
```

原因：

1. 最稳定
2. 前端逻辑简单
3. Raycaster 可以直接命中
4. 不依赖 Empty 的自定义尺寸解释
5. 适合 80 个工位统一管理

但必须注意：

```txt
前端不允许把 collider 显示出来
```

## 11. Collider 显示成实体时怎么修

如果当前页面已经把 collider 显示成实体，需要前端检查：

```ts
object.name.endsWith("_collider")
```

然后统一处理：

```ts
if (object instanceof THREE.Mesh && object.name.endsWith("_collider")) {
  object.visible = true;
  object.material = colliderMaterial;
  object.castShadow = false;
  object.receiveShadow = false;
  object.renderOrder = -1;
  object.userData.__isCollider = true;
  object.userData.selectable = true;
}
```

Collider 材质必须是：

```ts
new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
  depthWrite: false,
});
```

不要让它用 GLB 里原本的可见材质。

## 12. 选中高亮不要作用在 Collider 上

错误：

```txt
点击 collider
高亮 collider 盒子
```

正确：

```txt
点击 collider
映射到 root
高亮 root 或 root 的简化包围框
```

前端逻辑：

```ts
const id = collider.name.replace(/_collider$/, "");
const root = scene.getObjectByName(`${id}_root`);

setSelected(root);
```

如果 root 不存在，才降级：

```ts
setSelected(collider.parent ?? collider);
```

## 13. 工位与员工绑定建议

当前点击只能识别工位。

后续要绑定员工，需要一张数据表：

```ts
const workstationMap = {
  seat_r01_c01: {
    employeeId: "stu_001",
    employeeName: "张三",
    occupied: true,
    project: "AI 视觉识别",
    deviceStatus: "online",
  },
  seat_r01_c02: {
    employeeId: null,
    employeeName: null,
    occupied: false,
    project: null,
    deviceStatus: "idle",
  },
};
```

点击流程：

```txt
点击 seat_r01_c01_collider
得到 id = seat_r01_c01
找到 seat_r01_c01_root
查询 workstationMap["seat_r01_c01"]
显示员工/工位/设备状态
```

不要把员工信息写死在 GLB 里。

## 14. 无人时隐藏设备的建议

如果后续要实现：

```txt
没人时隐藏电脑
有人时显示电脑
```

不要在 Blender 里删除电脑模型。

推荐保留结构：

```txt
seat_r01_c01_root
├─ seat_r01_c01_desk
├─ seat_r01_c01_chair
├─ seat_r01_c01_device
└─ seat_r01_c01_collider
```

前端根据数据控制：

```ts
const device = scene.getObjectByName("seat_r01_c01_device");
device.visible = workstationMap["seat_r01_c01"].occupied;
```

这样以后状态变化时可以动态切换。

## 15. WASD/QE 键盘漫游必须保留

当前 3D 场景应支持键盘漫游。

按键规则：

```txt
W：前进
S：后退
A：左移
D：右移
E：上升
Q：下降
Shift：加速
```

如果当前页面没有 WASD/QE，说明前端可能删除或漏接了键盘控制组件。

需要恢复：

```tsx
<FlyKeyboardControls orbitControlsRef={orbitControlsRef} />
```

OrbitControls 需要 ref：

```tsx
const orbitControlsRef = useRef<OrbitControlsImpl>(null);

<OrbitControls
  ref={orbitControlsRef}
  target={[0, 0.55, 0]}
  enableDamping
/>

<FlyKeyboardControls orbitControlsRef={orbitControlsRef} />
```

## 16. WASD/QE 移动逻辑要求

WASD 只负责水平移动。

不要让 WASD 因镜头俯仰导致飞起来或钻地。

正确逻辑：

```ts
camera.getWorldDirection(forward);
forward.y = 0;
forward.normalize();
```

E/Q 单独控制高度：

```ts
if (keys.current.has("KeyE")) movement.y += VERTICAL_SPEED * delta;
if (keys.current.has("KeyQ")) movement.y -= VERTICAL_SPEED * delta;
```

移动时必须同步：

```txt
camera.position
OrbitControls.target
```

否则会出现：

```txt
移动卡顿
S 后退不明显
OrbitControls 把相机拉回去
视角抖动
```

推荐：

```ts
camera.position.add(moveVector);
controls.target.add(moveVector);
controls.update();
```

## 17. 键盘输入不要影响 UI 输入框

如果右下角编辑器中有 input，输入数字时不应该触发 WASD。

keydown 中建议判断：

```ts
const tag = document.activeElement?.tagName;

if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
  return;
}
```

否则用户在输入框里输入字母或数字时，场景可能跟着移动。

## 18. 摄像机边界

摄像机可以限制在实验室范围内。

但不要限制得太死，否则会出现：

```txt
S 后退没反应
移动到边缘卡住
用户感觉按键失效
```

建议开发调试阶段可以适当放宽边界。

例如：

```ts
const ROOM_PADDING = 0.2;
```

或者允许相机比房间边界多出一点点：

```ts
const EXTRA_MARGIN = 1.5;
```

## 19. 性能注意事项

为了保证 80 个工位不卡顿：

1. 不要 raycast 真实 mesh。
2. 不要每帧计算 Box3。
3. 不要让所有模型 castShadow。
4. 不要开启过重 Bloom / SSAO / ContactShadows。
5. 不要对复杂工位 root 每次生成大量 Edges。
6. 不要加载原始 449MB GLB。
7. 前端应该加载优化后的：

```txt
public/model/workstation_area.glb
```

当前工位模型已经做过去重优化，体积约：

```txt
5.42MB
```

## 20. 正确模型加载路径

当前前端应加载：

```txt
/model/workstation_area.glb
/model/meeting_area.glb
/model/hardware_area.glb
```

不要加载：

```txt
E:\工位优化版.glb
原始 449MB 模型
```

如果 Network 面板里看到几百 MB 的 GLB，说明加载错了。

## 21. 前端最终验收标准

### Collider

```txt
页面上看不到 collider 实体
collider 仍然可以参与点击
点击只检测 *_collider
点击后选中对应 *_root
```

### 工位点击

```txt
点击 seat_r01_c01_collider
选中 seat_r01_c01_root
信息卡显示工位 1-1
不会误选桌子、椅子、显示器
```

### 键盘漫游

```txt
W 前进
S 后退
A 左移
D 右移
E 上升
Q 下降
Shift 加速
OrbitControls 鼠标旋转仍然可用
```

### 性能

```txt
页面不卡顿
点击不卡顿
没有扫描整个 scene
没有加载原始大模型
```

## 22. 给前端的核心提醒

一句话：

```txt
Collider 是透明点击盒，不是实体模型；点击只 raycast *_collider，再映射到 *_root；WASD/QE 键盘漫游必须保留。
```

更具体一点：

```txt
不要显示 collider。
不要 raycast 真实模型。
不要删除 FlyKeyboardControls。
不要破坏 *_collider / *_root 命名。
不要加载 449MB 原始模型。
```
