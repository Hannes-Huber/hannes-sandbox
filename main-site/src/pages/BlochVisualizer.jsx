export default function BlochVisualizerPage({
  src = "/tools/quantencomputing/codex/index.html",
  title = "Interaktiver Bloch-Sphere Visualizer",
}) {
  return (
    <main className="bloch-fullscreen">
      <iframe title={title} src={src} />
    </main>
  );
}
