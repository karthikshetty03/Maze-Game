const { Engine, Runner, Render, World, Bodies } = Matter;

const engine = Engine.create();
const { world } = engine;

const cells = 3;
const width = 600;
const height = 600;

const render = Render.create({
  element: document.body,
  engine,
  options: {
    width,
    height,
    wireframes: true,
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

//walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
  Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
  Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
  Bodies.rectangle(width, height / 2, 40, height, { isStatic: true }),
];

World.add(world, walls);

const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;

    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
};

const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);
//console.log(startRow, startColumn);

const stepThroughCell = (row, column) => {
  if (grid[row][column] == true) {
    return;
  }

  grid[row][column] = true;

  const neighbours = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);

  for (let neighbour of neighbours) {
    //console.log(neighbour);
    const [nextRow, nextColumn, direction] = neighbour;

    //console.log(nextColumn, nextRow, direction);

    if (grid[nextRow][nextColumn] == true) {
      return;
    }

    if (
      nextRow < 0 ||
      nextRow >= cells ||
      nextColumn < 0 ||
      nextColumn >= cells
    ) {
      continue;
    }

    if (direction == "left") {
      verticals[row][column - 1] = true;
    } else if (direction == "right") {
      verticals[row][column] = true;
    } else if (direction == "up") {
      horizontals[row - 1][column] = true;
    } else if (direction == "down") {
      horizontals[row][column] = true;
    }

    stepThroughCell(nextRow, nextColumn);
  }

};

stepThroughCell(startRow, startColumn);

//console.log(verticals);
//console.log(horizontals);

