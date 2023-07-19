export function transListToTree(arr, parentId) {
  const list = []
  arr.forEach((item) => {
    if (item.parentId === parentId) {
      list.push(item)
      // 找item的子项
      const list1 = transListToTree(arr, item.deptId)
      if (list1.length > 0) {
        item.children = list1
      }
    }
  })
  return list
}
