/**
 * Function to handle entering edges
 * @param {Selection} enter - D3 selection for entering edges
 */
const edgeEnter = function (enter) {
  const group = enter
    .append('svg:g')
    .attr('transform', (d) => `translate(${d.x},${d.y})`)
    .attr('class', 'node')
    .attr('id', (d) => d.id);

  // Create and style a rectangular node
  const rect = group
    .append('rect')
    .attr('class', 'node')
    .attr('rx', 5)
    .attr('ry', 5)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', (d) => d.color);

  // Add label text to the node
  group
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', 80)
    .attr('dx', 30)
    .text((d) => d.label);

  // Add an image to the node
  group
    .append('image')
    .attr('xlink:href', (d) => d.image)
    .attr('x', 10)
    .attr('y', 10)
    .attr('width', 40)
    .attr('height', 40)
    .attr('class', 'grab');

  // Add actions, including Copy and Destroy
  const copy = group.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 6)
    .attr('fill', 'black')
    .attr('class', 'pointer')
    .attr('visibility', 'hidden')
    .attr('style', 'stroke:black;stroke-width:1px;opacity:0.8');

  const cross = group.append('g');
  cross.append('circle')
    .attr('cx', width)
    .attr('cy', 0)
    .attr('r', 6)
    .attr('class', 'pointer')
    .attr('fill', 'black')
    .attr('style', 'stroke:black;stroke-width:1px;opacity:0.8');
  cross.append('path')
    .attr('d', `M${width} 0 L${width + 3} 3 L${width - 3} -3 L60 0 L${width + 3} -3 L${width - 3} 3`)
    .attr('fill', 'none')
    .attr('class', 'pointer')
    .attr('stroke', 'white')
    .attr('stroke-width', '2');

  // Connector for "end"
  const end = group.append('circle')
    .attr('cx', 0)
    .attr('cy', height / 2)
    .attr('r', 5)
    .attr('fill', 'grey')
    .classed('hidden', (d) => !d.receiver)
    .attr('style', 'stroke:white;stroke-width:1px');

  // Connector for "start" with dragging functionality
  const start = group.append('circle')
    .attr('cx', width)
    .attr('cy', height / 2)
    .attr('r', 5)
    .attr('fill', 'grey')
    .attr('class', 'pointer')
    .classed('hidden', (d) => !d.connector)
    .attr('style', 'stroke:white;stroke-width:1px')
    .call(dragLineListener);

  // Handle destruction of nodes (cross)
  cross.on('click', function (event) {
    const data = event.target.__data__;
    nodes = nodes.filter((node) => node.id !== data.id);
    links = links.filter((link) => link.source.id !== data.id && link.target.id !== data.id);
    restart();
  });

  // Handle copying nodes (copy)
  copy.on('click', function (e) {
    const data = e.target.__data__;
    const node = { ...data, id: ++lastNodeId, y: data.y + 100 };
    nodes.push(node);
    restart();
  });

  // Handle node mouseover and mouseout events
  group
    .on('mouseover', function (d) {
      window.selectedNode = d3.select(this).datum();
      copy.attr('visibility', 'visible');
      cross.attr('visibility', 'visible');
    })
    .on('mouseout', () => {
      window.selectedNode = null;
      copy.attr('visibility', 'hidden');
      cross.attr('visibility', 'hidden');
    });

  // Animate the group for visual effect
  group
    .transition()
    .duration(200)
    .ease(d3.easeBounce)
    .attr('transform', (d) => `translate(${d.x - 5},${d.y - 5})`)
    .transition()
    .duration(200)
    .ease(d3.easeBounce)
    .attr('transform', (d) => `translate(${d.x + 5},${d.y + 5})`)
    .transition()
    .duration(200)
    .ease(d3.easeBounce)
    .attr('transform', (d) => `translate(${d.x},${d.y})`);

  return group;
};

/**
 * Updates the attributes of edge elements based on the node's data.
 * @param {Selection} update - D3 selection for updating edge elements.
 */
const edgeUpdate = function (update) {
  return update.attr('transform', (d) => `translate(${d.x},${d.y})`);
};

/**
 * Removes edge elements from the DOM.
 * @param {Selection} exit - D3 selection for exiting edge elements.
 */
const edgeExit = function (exit) {
  return exit.remove();
};

/**
 * Defines drag behavior for nodes, updating their positions.
 * @type {Function}
 */
const edgeDragging = d3.drag().on('drag', (event) => {
  // Find the index of the node being dragged in the nodes array.
  const index = nodes.findIndex((nd) => nd.id === event.subject.id);

  // If the index is not found, return early.
  if (index === -1) return;

  // Update the x and y coordinates of the dragged node.
  nodes[index].x = event.x;
  nodes[index].y = event.y;

  // Call the 'restart' function to re-render the graph.
  restart();
});