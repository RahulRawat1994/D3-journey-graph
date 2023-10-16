/**
 * Defines drag behavior for creating and updating connections (edges) between nodes.
 * @type {Function}
 */
const dragLineListener = d3.drag()
  .on('drag', function (event) {
    // Get the starting point and the source node data.
    const start = d3.select(this);
    const point = start.datum();

    // Update the drag line path using the createPath function.
    dragLine.attr("d", createPath({
      source: { x: point.x, y: point.y },
      target: { x: event.x + Number(start.attr('cx')), y: event.y }
    }));
  })
  .on('end', function () {
    
    dragLine.attr('d', 'M0,0L0,0');
    // Check if a selected node and its properties exist.
    if (window.selectedNode && window.selectedNode.hasOwnProperty('id')) {
      // Get the source node data associated with the drag line.
      const sourceNode = d3.select(this).datum();

      // Ensure that the source and target nodes are different and meet connector and receiver criteria.
      if (sourceNode.id === window.selectedNode.id || !window.selectedNode.receiver || !sourceNode.connector) {
        return;
      }

      // Find the indices of the source and target nodes in the nodes array.
      let sourceIndex = nodes.findIndex(node => node.id === sourceNode.id);
      let targetIndex = nodes.findIndex(node => node.id === window.selectedNode.id);

      // Add a new edge (link) between the source and target nodes.
      links.push({
        source: nodes[sourceIndex],
        target: nodes[targetIndex]
      });

      // Call the 'restart' function to update the graph.
      restart();
    }
  });
