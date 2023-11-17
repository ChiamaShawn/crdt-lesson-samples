interface Vertex {
  x: number;
  y: number;
}

class OperationBasedPolygon {
  private vertices: Vertex[] = [];
  private operations: Array<{ type: 'add' | 'remove', vertex: Vertex, timestamp: number }> = [];

  // Add a new vertex to the polygon
  addVertex(vertex: Vertex, timestamp: number): void {
    this.operations.push({ type: 'add', vertex, timestamp });
    this.updateVertices();
  }

  // Remove a vertex from the polygon
  removeVertex(vertex: Vertex, timestamp: number): void {
    this.operations.push({ type: 'remove', vertex, timestamp });
    this.updateVertices();
  }

  // Calculate the current vertices based on all applied operations
  private updateVertices(): void {
    // Sort operations based on timestamps
    this.operations.sort((a, b) => a.timestamp - b.timestamp);

    // Apply operations to create the current set of vertices
    this.vertices = this.operations.reduce((currentVertices, op) => {
      if (op.type === 'add') {
        return [...currentVertices, op.vertex];
      } else if (op.type === 'remove') {
        return currentVertices.filter(v => !(v.x === op.vertex.x && v.y === op.vertex.y));
      }
      return currentVertices;
    }, [] as Vertex[]);
  }

  // Merge with another replica
  merge(other: OperationBasedPolygon): void {
    // Merge operations from both replicas
    this.operations = [...this.operations, ...other.operations];
    // Recalculate the vertices
    this.updateVertices();
  }

  // Get the current vertices of the polygon
  getVertices(): Vertex[] {
    return this.vertices;
  }
}

// Example usage
const replicaA = new OperationBasedPolygon();
const replicaB = new OperationBasedPolygon();

replicaA.addVertex({ x: 0, y: 0 }, Date.now());
replicaB.addVertex({ x: 1, y: 1 }, Date.now() + 1000); // Simulating a later timestamp for B

// Merge replicas
replicaA.merge(replicaB);

console.log('Final Polygon Vertices:', replicaA.getVertices());