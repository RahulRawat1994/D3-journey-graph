/**
 * Creates a new path element when a link enters the selection.
 *
 * @param {Selection} enter - The selection of entering link elements.
 */
const pathEnter = function (enter) {
  return enter.append('svg:path')
    .attr('class', 'link')
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrow)")
    .attr('d', (d) => createPath(d));
}

/**
 * Updates the path elements with new data.
 *
 * @param {Selection} update - The selection of link elements to update.
 */
const pathUpdate = function (update) {
  return update.attr('d', (d) => createPath(d));
}

/**
 * Removes the path elements when a link exits the selection.
 *
 * @param {Selection} exit - The selection of exiting link elements.
 */
const pathExit = function (exit) {
  return exit.remove();
}

/**
 * Creates a path description for the link between source and target nodes.
 *
 * @param {Object} d - The link data containing source and target nodes.
 * @returns {string} - The path description string.
 */
const createPath = (d) => {
  const sourceX = d.source.x + width;
  const sourceY = d.source.y + height / 2;
  const targetX = d.target.x;
  const targetY = d.target.y + height / 2;

  return `M${sourceX},${sourceY} L${sourceX + 30},${sourceY} L ${targetX - 35},${targetY} L${targetX - 10},${targetY}`;
}
