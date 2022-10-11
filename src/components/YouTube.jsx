export default function YouTube({ id }) {
  return (
    <div className="embedContainer">
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${id}?rel=0`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}
