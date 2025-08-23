export default function AboutPage() {
  return (
    <section>
      <h1>About</h1>
      <p><strong>Name:</strong> Abdinafi Mohamed</p>
      <p><strong>Student Number:</strong> 22206653</p>

      <h2 style={{ marginTop: 16 }}>Video: How to use this website</h2>
      {/* Replace with your video source when ready */}
      <video controls width={560} style={{ maxWidth: "100%" }}>
        <source src="/demo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
}
