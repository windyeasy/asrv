interface Point {
  x: number
  y: number
  z?: number
}

function printPoint(point: Point) {
  console.log(`x: ${point.x}, y: ${point.y}`)
}

printPoint({ x: 1, y: 2 })

console.log('hello world')
console.log('hello world2')

export {
  printPoint,
}
