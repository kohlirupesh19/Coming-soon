"use client";

import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";

type AlgorithmId = "bubble" | "quick" | "dijkstra" | "bst";

type BarFrame = {
  kind: "bars";
  values: number[];
  activeIndices: number[];
  sortedIndices: number[];
  pivotIndex?: number;
  label: string;
  detail: string;
};

type GraphNode = {
  id: number;
  x: number;
  y: number;
};

type GraphEdge = {
  from: number;
  to: number;
  weight: number;
};

type GraphFrame = {
  kind: "graph";
  nodes: GraphNode[];
  edges: GraphEdge[];
  distances: number[];
  visited: number[];
  currentNode: number | null;
  activeEdge: [number, number] | null;
  pathNodes: number[];
  pathEdges: Array<[number, number]>;
  label: string;
  detail: string;
};

type BSTNode = {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
};

type TreeFrame = {
  kind: "tree";
  root: BSTNode | null;
  highlightedValues: number[];
  label: string;
  detail: string;
};

type AlgorithmFrame = BarFrame | GraphFrame | TreeFrame;

type AlgorithmDefinition = {
  id: AlgorithmId;
  title: string;
  subtitle: string;
  frames: AlgorithmFrame[];
};

const GRAPH_NODES: GraphNode[] = [
  { id: 0, x: 90, y: 80 },
  { id: 1, x: 260, y: 50 },
  { id: 2, x: 260, y: 175 },
  { id: 3, x: 460, y: 55 },
  { id: 4, x: 460, y: 180 },
  { id: 5, x: 650, y: 120 }
];

const GRAPH_EDGES: GraphEdge[] = [
  { from: 0, to: 1, weight: 4 },
  { from: 0, to: 2, weight: 2 },
  { from: 1, to: 2, weight: 1 },
  { from: 1, to: 3, weight: 5 },
  { from: 2, to: 3, weight: 8 },
  { from: 2, to: 4, weight: 10 },
  { from: 3, to: 4, weight: 2 },
  { from: 3, to: 5, weight: 6 },
  { from: 4, to: 5, weight: 2 }
];

function cloneTree(node: BSTNode | null): BSTNode | null {
  if (!node) {
    return null;
  }

  return {
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right)
  };
}

function insertNode(root: BSTNode | null, value: number): BSTNode {
  if (!root) {
    return { value, left: null, right: null };
  }

  if (value < root.value) {
    root.left = insertNode(root.left, value);
  } else if (value > root.value) {
    root.right = insertNode(root.right, value);
  }

  return root;
}

function findMin(node: BSTNode): BSTNode {
  let current = node;
  while (current.left) {
    current = current.left;
  }
  return current;
}

function deleteNode(root: BSTNode | null, value: number): BSTNode | null {
  if (!root) {
    return null;
  }

  if (value < root.value) {
    root.left = deleteNode(root.left, value);
    return root;
  }

  if (value > root.value) {
    root.right = deleteNode(root.right, value);
    return root;
  }

  if (!root.left) {
    return root.right;
  }

  if (!root.right) {
    return root.left;
  }

  const successor = findMin(root.right);
  root.value = successor.value;
  root.right = deleteNode(root.right, successor.value);
  return root;
}

function searchPath(root: BSTNode | null, target: number): number[] {
  const path: number[] = [];
  let current = root;

  while (current) {
    path.push(current.value);
    if (target === current.value) {
      break;
    }
    current = target < current.value ? current.left : current.right;
  }

  return path;
}

function createBubbleSortFrames(): BarFrame[] {
  const values = [42, 18, 31, 9, 27, 55, 13, 36, 22];
  const arr = [...values];
  const frames: BarFrame[] = [
    {
      kind: "bars",
      values: [...arr],
      activeIndices: [],
      sortedIndices: [],
      label: "Bubble Sort",
      detail: "Initial unsorted array"
    }
  ];

  for (let i = 0; i < arr.length - 1; i += 1) {
    for (let j = 0; j < arr.length - 1 - i; j += 1) {
      frames.push({
        kind: "bars",
        values: [...arr],
        activeIndices: [j, j + 1],
        sortedIndices: Array.from({ length: i }, (_, idx) => arr.length - 1 - idx),
        label: "Bubble Sort",
        detail: `Compare index ${j} and ${j + 1}`
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        frames.push({
          kind: "bars",
          values: [...arr],
          activeIndices: [j, j + 1],
          sortedIndices: Array.from({ length: i }, (_, idx) => arr.length - 1 - idx),
          label: "Bubble Sort",
          detail: `Swap ${arr[j + 1]} and ${arr[j]}`
        });
      }
    }
  }

  frames.push({
    kind: "bars",
    values: [...arr],
    activeIndices: [],
    sortedIndices: arr.map((_, i) => i),
    label: "Bubble Sort",
    detail: "Array sorted"
  });

  return frames;
}

function createQuickSortFrames(): BarFrame[] {
  const arr = [39, 12, 43, 7, 29, 58, 19, 24, 11];
  const frames: BarFrame[] = [];
  const sortedSet = new Set<number>();

  const pushFrame = (activeIndices: number[], detail: string, pivotIndex?: number) => {
    frames.push({
      kind: "bars",
      values: [...arr],
      activeIndices,
      sortedIndices: Array.from(sortedSet.values()),
      pivotIndex,
      label: "Quick Sort",
      detail
    });
  };

  const quickSort = (low: number, high: number) => {
    if (low > high) {
      return;
    }

    if (low === high) {
      sortedSet.add(low);
      pushFrame([low], `Single element at index ${low} is sorted`);
      return;
    }

    const pivotValue = arr[high];
    let i = low;
    pushFrame([high], `Choose pivot ${pivotValue} at index ${high}`, high);

    for (let j = low; j < high; j += 1) {
      pushFrame([j, high], `Compare ${arr[j]} with pivot ${pivotValue}`, high);
      if (arr[j] < pivotValue) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        pushFrame([i, j], `Move ${arr[i]} before pivot`, high);
        i += 1;
      }
    }

    [arr[i], arr[high]] = [arr[high], arr[i]];
    sortedSet.add(i);
    pushFrame([i], `Place pivot ${arr[i]} at sorted position`, i);

    quickSort(low, i - 1);
    quickSort(i + 1, high);
  };

  pushFrame([], "Initial unsorted array");
  quickSort(0, arr.length - 1);
  frames.push({
    kind: "bars",
    values: [...arr],
    activeIndices: [],
    sortedIndices: arr.map((_, index) => index),
    label: "Quick Sort",
    detail: "Array sorted"
  });

  return frames;
}

function createDijkstraFrames(): GraphFrame[] {
  const source = 0;
  const target = 5;
  const frames: GraphFrame[] = [];
  const distances = Array.from({ length: GRAPH_NODES.length }, () => Number.POSITIVE_INFINITY);
  const previous = Array.from({ length: GRAPH_NODES.length }, () => -1);
  const visited = new Set<number>();

  distances[source] = 0;

  const neighbors = new Map<number, GraphEdge[]>();
  GRAPH_NODES.forEach((node) => {
    neighbors.set(node.id, []);
  });

  GRAPH_EDGES.forEach((edge) => {
    neighbors.get(edge.from)?.push(edge);
    neighbors.get(edge.to)?.push({ from: edge.to, to: edge.from, weight: edge.weight });
  });

  const pushFrame = (
    label: string,
    detail: string,
    currentNode: number | null,
    activeEdge: [number, number] | null,
    pathNodes: number[] = [],
    pathEdges: Array<[number, number]> = []
  ) => {
    frames.push({
      kind: "graph",
      nodes: GRAPH_NODES,
      edges: GRAPH_EDGES,
      distances: [...distances],
      visited: Array.from(visited.values()),
      currentNode,
      activeEdge,
      pathNodes,
      pathEdges,
      label,
      detail
    });
  };

  pushFrame("Dijkstra", "Start from source node 0", source, null);

  while (visited.size < GRAPH_NODES.length) {
    let current = -1;
    let currentDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < distances.length; i += 1) {
      if (!visited.has(i) && distances[i] < currentDistance) {
        currentDistance = distances[i];
        current = i;
      }
    }

    if (current === -1) {
      break;
    }

    pushFrame("Dijkstra", `Visit node ${current}`, current, null);

    const adjacent = neighbors.get(current) ?? [];
    adjacent.forEach((edge) => {
      const next = edge.to;
      if (visited.has(next)) {
        return;
      }

      pushFrame("Dijkstra", `Check edge ${current} -> ${next} (w=${edge.weight})`, current, [current, next]);
      const nextDistance = distances[current] + edge.weight;
      if (nextDistance < distances[next]) {
        distances[next] = nextDistance;
        previous[next] = current;
        pushFrame("Dijkstra", `Update distance of node ${next} to ${nextDistance}`, current, [current, next]);
      }
    });

    visited.add(current);
    pushFrame("Dijkstra", `Node ${current} settled`, current, null);
  }

  const pathNodes: number[] = [];
  const pathEdges: Array<[number, number]> = [];
  let cursor = target;

  while (cursor !== -1) {
    pathNodes.unshift(cursor);
    const prev = previous[cursor];
    if (prev !== -1) {
      pathEdges.unshift([prev, cursor]);
    }
    cursor = prev;
  }

  pushFrame(
    "Dijkstra",
    `Shortest path 0 -> ${target}: ${pathNodes.join(" → ")}`,
    target,
    null,
    pathNodes,
    pathEdges
  );

  return frames;
}

function createBSTFrames(): TreeFrame[] {
  let tree: BSTNode | null = null;
  const frames: TreeFrame[] = [
    {
      kind: "tree",
      root: null,
      highlightedValues: [],
      label: "Binary Search Tree",
      detail: "Start with an empty tree"
    }
  ];

  const insertValues = [42, 24, 62, 12, 32, 54, 74];
  insertValues.forEach((value) => {
    tree = insertNode(tree, value);
    frames.push({
      kind: "tree",
      root: cloneTree(tree),
      highlightedValues: [value],
      label: "BST Insert",
      detail: `Insert node ${value}`
    });
  });

  const searchValue = 54;
  const path = searchPath(tree, searchValue);
  path.forEach((value, index) => {
    frames.push({
      kind: "tree",
      root: cloneTree(tree),
      highlightedValues: [value],
      label: "BST Search",
      detail: `Search ${searchValue}: step ${index + 1}`
    });
  });

  const deleteValue = 24;
  tree = deleteNode(tree, deleteValue);
  frames.push({
    kind: "tree",
    root: cloneTree(tree),
    highlightedValues: [32],
    label: "BST Delete",
    detail: `Delete node ${deleteValue}`
  });

  return frames;
}

function useAlgorithmDefinitions(): AlgorithmDefinition[] {
  return useMemo(
    () => [
      {
        id: "bubble",
        title: "Bubble Sort Animation",
        subtitle: "Repeatedly compare adjacent values and swap when needed.",
        frames: createBubbleSortFrames()
      },
      {
        id: "quick",
        title: "Quick Sort Visualization",
        subtitle: "Pick pivots, partition values, then recursively sort sections.",
        frames: createQuickSortFrames()
      },
      {
        id: "dijkstra",
        title: "Dijkstra Shortest Path",
        subtitle: "Expand the nearest node and relax weighted edges.",
        frames: createDijkstraFrames()
      },
      {
        id: "bst",
        title: "Binary Search Tree Operations",
        subtitle: "Insert, search, and delete nodes while preserving BST structure.",
        frames: createBSTFrames()
      }
    ],
    []
  );
}

type TreeLayoutNode = {
  value: number;
  x: number;
  y: number;
  parentX: number | null;
  parentY: number | null;
};

function layoutTree(
  node: BSTNode | null,
  minX: number,
  maxX: number,
  depth: number,
  parentX: number | null,
  parentY: number | null,
  out: TreeLayoutNode[]
): void {
  if (!node) {
    return;
  }

  const x = (minX + maxX) / 2;
  const y = 60 + depth * 92;

  out.push({
    value: node.value,
    x,
    y,
    parentX,
    parentY
  });

  layoutTree(node.left, minX, x, depth + 1, x, y, out);
  layoutTree(node.right, x, maxX, depth + 1, x, y, out);
}

function sortEdgeKey(a: number, b: number): string {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

export default function AlgorithmPlayground() {
  const algorithms = useAlgorithmDefinitions();
  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>("bubble");
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(2);

  const currentAlgorithm = useMemo(
    () => algorithms.find((item) => item.id === algorithmId) ?? algorithms[0],
    [algorithms, algorithmId]
  );

  const maxFrameIndex = currentAlgorithm.frames.length - 1;
  const currentFrame = currentAlgorithm.frames[frameIndex];

  useEffect(() => {
    setFrameIndex(0);
    setPlaying(false);
  }, [algorithmId]);

  useEffect(() => {
    if (!playing) {
      return;
    }

    if (frameIndex >= maxFrameIndex) {
      setPlaying(false);
      return;
    }

    const delay = Math.max(180, 900 - speed * 150);
    const timeout = window.setTimeout(() => {
      setFrameIndex((prev) => Math.min(prev + 1, maxFrameIndex));
    }, delay);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [playing, frameIndex, maxFrameIndex, speed]);

  const handleStep = () => {
    setPlaying(false);
    setFrameIndex((prev) => Math.min(prev + 1, maxFrameIndex));
  };

  const handleReset = () => {
    setPlaying(false);
    setFrameIndex(0);
  };

  return (
    <section id="algorithm-playground" className="section-divider py-24 md:py-28" aria-labelledby="algorithm-heading">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Playground</p>
          <h2 id="algorithm-heading" className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Algorithm Visualizer Playground
          </h2>
          <p className="mt-4 text-text-muted">
            Explore algorithms step-by-step with interactive controls and live visual feedback.
          </p>
        </div>

        <Card className="mt-10 border border-white/12 bg-black/40 p-5 md:p-6">
          <div className="flex flex-wrap gap-2">
            {algorithms.map((algorithm) => (
              <button
                key={algorithm.id}
                type="button"
                onClick={() => setAlgorithmId(algorithm.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors",
                  algorithm.id === algorithmId
                    ? "border-blue-300/45 bg-blue-400/15 text-blue-100"
                    : "border-white/20 bg-white/[0.03] text-text-muted hover:border-white/40"
                )}
              >
                {algorithm.title}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-lg font-semibold">{currentAlgorithm.title}</p>
              <p className="mt-1 text-sm text-text-muted">{currentAlgorithm.subtitle}</p>
              <p className="mt-2 text-sm text-blue-100/85">{currentFrame.label}: {currentFrame.detail}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaying((prev) => !prev)}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/25 bg-white/[0.05] px-4 text-sm text-white transition-colors hover:border-white/45"
              >
                {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
                {playing ? "Pause" : "Play"}
              </button>

              <button
                type="button"
                onClick={handleStep}
                disabled={frameIndex >= maxFrameIndex}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-4 text-sm text-text-muted transition-colors hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SkipForward size={15} aria-hidden="true" />
                Step
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-4 text-sm text-text-muted transition-colors hover:border-white/40"
              >
                <RotateCcw size={15} aria-hidden="true" />
                Reset
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label htmlFor="speed" className="text-xs uppercase tracking-[0.14em] text-text-muted">
              Speed
            </label>
            <input
              id="speed"
              type="range"
              min={1}
              max={5}
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              className="w-36 accent-blue-300"
              aria-label="Playback speed"
            />
            <span className="text-xs text-text-muted">{speed}x</span>
            <span className="ml-auto text-xs text-text-muted">
              Step {frameIndex + 1} / {maxFrameIndex + 1}
            </span>
          </div>

          <div className="mt-6 rounded-2xl border border-white/12 bg-[#070d1a] p-4 md:p-6">
            {currentFrame.kind === "bars" && (
              <div className="flex h-[260px] items-end gap-2 overflow-hidden rounded-xl bg-black/20 p-3">
                {currentFrame.values.map((value, index) => {
                  const isActive = currentFrame.activeIndices.includes(index);
                  const isSorted = currentFrame.sortedIndices.includes(index);
                  const isPivot = currentFrame.pivotIndex === index;

                  return (
                    <motion.div
                      key={`${index}-${value}-${algorithmId}`}
                      layout
                      transition={{ type: "spring", stiffness: 280, damping: 24 }}
                      className={cn(
                        "relative flex-1 rounded-t-md",
                        isPivot
                          ? "bg-blue-300/80"
                          : isActive
                            ? "bg-blue-400/70"
                            : isSorted
                              ? "bg-emerald-300/75"
                              : "bg-blue-900/50"
                      )}
                      style={{ height: `${Math.max(18, value * 3)}px` }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-text-muted">{value}</span>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {currentFrame.kind === "graph" && (
              <svg viewBox="0 0 740 250" className="h-[260px] w-full rounded-xl bg-black/20 p-2">
                {currentFrame.edges.map((edge) => {
                  const from = currentFrame.nodes.find((node) => node.id === edge.from);
                  const to = currentFrame.nodes.find((node) => node.id === edge.to);

                  if (!from || !to) {
                    return null;
                  }

                  const isActiveEdge =
                    currentFrame.activeEdge &&
                    sortEdgeKey(currentFrame.activeEdge[0], currentFrame.activeEdge[1]) ===
                      sortEdgeKey(edge.from, edge.to);

                  const isPathEdge = currentFrame.pathEdges.some(
                    (pair) => sortEdgeKey(pair[0], pair[1]) === sortEdgeKey(edge.from, edge.to)
                  );

                  return (
                    <g key={`${edge.from}-${edge.to}`}>
                      <line
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                        stroke={isPathEdge ? "#9be3ff" : isActiveEdge ? "#6ebdff" : "rgba(146,176,214,0.45)"}
                        strokeWidth={isPathEdge ? 4 : isActiveEdge ? 3 : 2}
                      />
                      <text
                        x={(from.x + to.x) / 2}
                        y={(from.y + to.y) / 2 - 6}
                        textAnchor="middle"
                        fontSize="12"
                        fill="rgba(203,220,243,0.85)"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}

                {currentFrame.nodes.map((node) => {
                  const isVisited = currentFrame.visited.includes(node.id);
                  const isCurrent = currentFrame.currentNode === node.id;
                  const isPath = currentFrame.pathNodes.includes(node.id);
                  const distance = currentFrame.distances[node.id];

                  return (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={22}
                        fill={
                          isCurrent
                            ? "#58b8ff"
                            : isPath
                              ? "#94dbff"
                              : isVisited
                                ? "#2f6ca8"
                                : "#10233d"
                        }
                        stroke="rgba(188,214,245,0.85)"
                        strokeWidth={isCurrent ? 3 : 2}
                      />
                      <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="13" fill="#f3f8ff">
                        {node.id}
                      </text>
                      <text x={node.x} y={node.y + 36} textAnchor="middle" fontSize="11" fill="rgba(190,214,243,0.9)">
                        {Number.isFinite(distance) ? distance : "∞"}
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}

            {currentFrame.kind === "tree" && (
              <svg viewBox="0 0 800 380" className="h-[260px] w-full rounded-xl bg-black/20 p-2">
                {(() => {
                  const nodes: TreeLayoutNode[] = [];
                  layoutTree(currentFrame.root, 40, 760, 0, null, null, nodes);

                  return (
                    <>
                      {nodes.map((node) => {
                        if (node.parentX === null || node.parentY === null) {
                          return null;
                        }

                        return (
                          <line
                            key={`edge-${node.value}`}
                            x1={node.parentX}
                            y1={node.parentY}
                            x2={node.x}
                            y2={node.y}
                            stroke="rgba(166, 198, 238, 0.45)"
                            strokeWidth={2}
                          />
                        );
                      })}

                      {nodes.map((node) => {
                        const highlighted = currentFrame.highlightedValues.includes(node.value);
                        return (
                          <g key={`node-${node.value}`}>
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r={21}
                              fill={highlighted ? "#6abfff" : "#113058"}
                              stroke="rgba(192,220,253,0.85)"
                              strokeWidth={highlighted ? 3 : 2}
                            />
                            <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13" fill="#f4f9ff">
                              {node.value}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            )}
          </div>
        </Card>
      </Container>
    </section>
  );
}
