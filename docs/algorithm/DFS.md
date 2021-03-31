<a name="JEG5i"></a>
# 深度优先搜索
**深度优先搜索算法**（英语：Depth-First-Search，DFS）是一种用于遍历或搜索树或图的算法。这个算法会尽可能深的搜索树的分支。当节点v的所在边都己被探寻过，搜索将回溯到发现节点v的那条边的起始节点。这一过程一直进行到已发现从源节点可达的所有节点为止。如果还存在未被发现的节点，则选择其中一个作为源节点并重复以上过程，整个进程反复进行直到所有节点都被访问为止。 ——维基百科
<a name="1oTMG"></a>
## 实际应用
<a name="Fyhgy"></a>
## 具体例子
<a name="R54zx"></a>
### 1. 平衡二叉树（剑指Offer-55）
![image.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1594195370004-3076b770-26ba-49c5-8b35-dead99b56b30.png#align=left&display=inline&height=296&margin=%5Bobject%20Object%5D&name=image.png&originHeight=397&originWidth=848&size=25183&status=done&style=none&width=633)<br />**解法一：自底而上**
```javascript
var isBalanced = function(root) {
  return DFS(root) !== -1
};
function DFS(root) {
  if (!root) return 0
  let leftDeep = DFS(root.left)
  if (leftDeep === -1) return -1
  let rightDeep = DFS(root.right)
  if (rightDeep === -1 || Math.abs(leftDeep - rightDeep) > 1) return -1
  return Math.max(leftDeep, rightDeep) + 1
}
```
**解法二：自顶向下**
```javascript
var isBalanced = function(root) {
  if (!root) return true
  let left = getHeight(root.left)
  let right = getHeight(root.right)
  if(Math.abs(left- right) > 1) {
    return false
  }
  return isBalanced(root.left) && isBalanced(root.right)
};

function getHeight(root) {
  if (!root) return 0
  let leftDeep = getHeight(root.left)
  let rightDeep = getHeight(root.right)
  return Math.max(leftDeep, rightDeep) + 1
}
```
<a name="H6oS6"></a>
### 2. 叶子相似的树（LeetCode-872）
![image.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1594198442821-03f083d7-1d84-4f98-b893-fdfb9bb62857.png#align=left&display=inline&height=245&margin=%5Bobject%20Object%5D&name=image.png&originHeight=490&originWidth=821&size=72772&status=done&style=none&width=410.5)<br />**<br />**解法：**
```javascript
var leafSimilar = function(root1, root2) {
  let arr1 = [], arr2 = []
  DFS(root1, arr1)
  DFS(root2, arr2)
  return arr1.join() === arr2.join()
};
function DFS(root, ans) {
  if (!root.left && !root.right) ans.push(root.val)
  if (root.left) DFS(root.left, ans)
  if (root.right) DFS(root.right, ans)
}
```
<a name="mwYl4"></a>
### 3. N叉树的最大深度（LeetCode-559）
![image.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1594206618031-b77d161c-26b6-41f5-89c4-bb2b2d4a263b.png#align=left&display=inline&height=245&margin=%5Bobject%20Object%5D&name=image.png&originHeight=490&originWidth=815&size=36330&status=done&style=none&width=407.5)<br />
<br />**解法一：DFS递归**
```javascript
var maxDepth = function(root) {
  return DFS(root)
};
function DFS(root) {
  if (!root) return 0
  let count = 1
  root.children.forEach((item) => {
    count = Math.max(count, DFS(item) + 1)
  })
  return count 
}
```
**解法二：迭代**
```javascript
var maxDepth = function(root) {
  if (!root) return 0
  if (!root.children) return 1

  var stack = [{
    node: root,
    deep: 1
  }]
  var depth = 0
  while(stack.length) {
    var item = stack.pop()
    if (!item) return
    var node = item.node
    var prevDeep = item.deep
    depth = Math.max(prevDeep, depth)
    for (var i = node.children.length - 1; i >= 0; i --) {
      stack.push({
        node: node.children[i],
        deep: prevDeep + 1
      })
    }
  }
  return depth
}
```
<a name="PmxjZ"></a>
### 4. 路径总和
![image.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1594211567358-31c36426-09cb-4d1e-90a0-bc7f0511c728.png#align=left&display=inline&height=209&margin=%5Bobject%20Object%5D&name=image.png&originHeight=417&originWidth=860&size=32802&status=done&style=none&width=430)<br />**解法一：**
```javascript
var hasPathSum = function(root, sum) {
  let flag = false
  DFS(root, sum)
  function DFS(root, sum) {
    if (!root || flag) return 
    if (sum - root.val === 0 && !root.left && !root.right) return flag = true
    DFS(root.left, sum - root.val)
    DFS(root.right, sum - root.val)
  }
  return flag
};

// 更简写法
var hasPathSum = function(root, sum) {
 if (!root) return false
 if (!root.left && !root.right) {
   return sum === root.val
 }
 sum = sum - root.val
 return hasPathSum(root.left, sum) || hasPathSum(root.right, sum)
};
```
<a name="NQnGS"></a>
### 5. 相同的树（LeetCode-100）
![image.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1594219342896-7f5c42df-17cb-4d41-8b31-51ab96c4be8f.png#align=left&display=inline&height=434&margin=%5Bobject%20Object%5D&name=image.png&originHeight=868&originWidth=846&size=40953&status=done&style=none&width=423)<br />**解法一：**
```javascript
var isSameTree = function(p, q) {
  let pArr = DFS(p, [])
  let qArr = DFS(q, [])
  return qArr.toString() === pArr.toString()
};
function DFS(root, ans) {
  if (!root) return ans.push(null)
  ans.push(root.val)
  DFS(root.left, ans)
  DFS(root.right, ans)
  return ans
}


// 简化版
var isSameTree = function(p, q) {
  if (!p && !q) return true;
  if (!p || !q) return false;
  if (p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};
```
<a name="anHwL"></a>
### 6. 颜色填充（LeetCode-面试题 08.10）
![image.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1594263190981-2d8824c9-6fb3-4a1a-ba9d-e876af1e8bd3.png#align=left&display=inline&height=340&margin=%5Bobject%20Object%5D&name=image.png&originHeight=679&originWidth=854&size=66144&status=done&style=none&width=427)<br />
<br />**解法一：**
```javascript
var floodFill = function(image, sr, sc, newColor) {
  const len1 = image.length
  const len2 = image[sr].length
  const originColor = image[sr][sc]
 function DFS(x, y) {
   // 避免原数字和新数字相同
   if (x < 0 || y < 0 || x >= len1 || y >= len2 || image[x][y] !== originColor || image[x][y] === newColor) return ''
    image[x][y] = newColor
    DFS(x + 1, y)
    DFS(x - 1, y)
    DFS(x, y + 1)
    DFS(x, y - 1)
 }
 DFS(sr, sc)
  return image
};
```
<a name="hbMDg"></a>
### 7. 二叉树的所有路径（LeetCode-257）
![image.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1594265978544-464b9931-9c45-4147-a53c-affdd2d02ba7.png#align=left&display=inline&height=227&margin=%5Bobject%20Object%5D&name=image.png&originHeight=453&originWidth=858&size=23822&status=done&style=none&width=429)<br />**解法一：**
```javascript
var binaryTreePaths = function(root) {
  const ans = []
  function DFS(root, result) {
    result = result.concat(root.val)
    if (!root.left && !root.right) {
      ans.push(result.join('->'))
      return 
    }
    root.left && DFS(root.left, result)
    root.right && DFS(root.right, result)
  }
  root && DFS(root, [])
  return ans
};
```
<a name="EanRK"></a>
### 8. 二叉树的最大深度
![image.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1594266475456-80db1fb9-fda3-452a-8d6f-fa65fba98636.png#align=left&display=inline&height=195&margin=%5Bobject%20Object%5D&name=image.png&originHeight=389&originWidth=860&size=25738&status=done&style=none&width=430)<br />**解法一：DFS**
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
  if (!root) return 0
  if (!root.left && !root.right) return 1
  let left = root.left ? maxDepth(root.left) : 0
  let right = root.right ? maxDepth(root.right) : 0
  return Math.max(left, right) + 1
};
```
**解法二：BFS**
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
  if (!root) return 0
  const stack = []
  let deep = 0
  stack.push({
    tree: root,
    deep: 1
  })
  while(stack.length) {
    let item = stack.shift()
    deep = item.deep
    item.tree.left && stack.push({
      tree: item.tree.left,
      deep: item.deep + 1
    })
    item.tree.right && stack.push({
      tree: item.tree.right,
      deep: item.deep + 1
    })
  }
  return deep
};

```
<a name="NsLwG"></a>
### 9. 对称二叉树（LeetCode-101）

<br />**解法一：**
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
  if (!root) return true
  let flag = true
  const left = DFS(root.left, 'left')
  const right = DFS(root.right)
  return left.toString() === right.toString()
};
function DFS(root, dic) {
  if (!root) return [null]
  let ans = []
  ans.push(root.val)
  if (dic === 'left') {
    ans.push(...DFS(root.left, dic))
    ans.push(...DFS(root.right, dic))
  } else {
    ans.push(...DFS(root.right, dic))
    ans.push(...DFS(root.left, dic))
  }
  return ans
}

// 更简写法
var isSymmetric = function(root) {
  return checkTree(root, root)
};
function checkTree(root1, root2) {
  if (!root1 && !root2) return true
  if (!root1 || !root2) return false
  return root1.val === root2.val && checkTree(root1.left, root2.right) && checkTree(root1.right, root2.left)
}
```
<a name="9Dpe0"></a>
### 10. 递增顺序查找树（LeetCode-897）
![image.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1594272374483-bf084e11-e6bc-4232-97f2-331c528886f4.png#align=left&display=inline&height=470&margin=%5Bobject%20Object%5D&name=image.png&originHeight=940&originWidth=838&size=40601&status=done&style=none&width=419)<br />
<br />**解法一：生成新树**
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var increasingBST = function(root) {
  let ans = current = null
  DFS(root)
  function DFS(root) {
    if (!root) return
    root.left && DFS(root.left)
    if (!ans) {
      ans = new TreeNode(root.val)
      current = ans
    } else {
      current.right = new TreeNode(root.val)
      current = current.right
    }
    root.right && DFS(root.right)
  } 
  return ans
};
```
**解法二：更改树的连接方式**
```javascript
var increasingBST = function(root) {
  let ans = current = null
  ans = new TreeNode(0)
  current = ans
  inorder(root)
  function inorder(node) {
    if (!node) return
    inorder(node.left)
    node.left = null
    current.right = node
    current = node
    inorder(node.right)
  }
  return ans.right
};
```
