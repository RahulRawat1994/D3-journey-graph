'use strict';

const DEFAULT_COLOR = '#03B6FC';
const width = 60;
const height = 60;

let nodes = [];
let lastNodeId = 0;
let links = [];

const svg = d3.select('#svg');

// Define arrow markers for graph links
svg
  .append('svg:defs')
  .append('svg:marker')
  .attr('id', 'arrow')
  .attr('viewBox', '0 0 12 12')
  .attr('refX', 6)
  .attr('refY', 6)
  .attr('markerUnits', 'strokeWidth')
  .attr('markerWidth', 5)
  .attr('markerHeight', 5)
  .attr('orient', 'auto')
  .append('svg:path')
  .attr('d', 'M2,2 L10,6 L2,10 Q4,6, 2,2')
  .attr('fill', '#000');

// Handles to link and node element groups
let path = svg.append('svg:g').selectAll('path');
let edge = svg.append('svg:g').selectAll('g');
const dragLine = svg
  .append('svg:path')
  .attr('class', 'link dragline ')
  .attr('marker-end', 'url(#arrow)')
  .attr('d', 'M0,0L0,0');

/**
 * Restart the visualization
 */
function restart() {
  edge = edge.data(nodes, d => d.id).join(edgeEnter, edgeUpdate, edgeExit);
  path = path.data(links).join(pathEnter, pathUpdate, pathExit);
  // Drag functionality
  edge.call(edgeDragging);
}

/**
 * Create a new edge based on user selection
 */
document.querySelector('.svg-sidebar').addEventListener('click', e => {
  if (e.target && e.target.getAttribute('data-workflow-element')) {
    // Insert a new node at the given point
    const label = e.target.text;
    const image = e.target.getAttribute('data-image');
    const type = e.target.getAttribute('data-type');
    const node = {
      id: ++lastNodeId,
      x: 600,
      y: 150,
      label,
      type,
      image,
      connector: true,
      receiver: true,
    };

    switch (type) {
      case 'trigger':
        node.color = '#03B6FC';
        node.receiver = false;
        break;
      case 'action':
        node.color = '#29993E';
        break;
      case 'filter':
        node.color = '#2127A5';
        break;
      case 'delay':
        node.color = '#EA1397';
        break;
      case 'end':
        node.connector = false;
        node.color = '#C22337';
        break;
      default:
        node.color = DEFAULT_COLOR;
        break;
    }

    nodes.push(node);
    restart();
  }
});
restart();
/**
 * The rest of your code...
 */
