export default function BackgroundVideo() {
  return (
    <video
      className="h-screen absolute max-h-screen -z-10 inset-0 w-full object-cover hidden sm:block"
      muted
      autoPlay
      loop
      playsInline
    >
      <source
        src="https://storage.googleapis.com/gweb-gemini-cdn/gemini/uploads/89e9004d716a7803fc7c9aab18c985af783f5a36.mp4"
        type="video/mp4"
      />
    </video>
  );
}
