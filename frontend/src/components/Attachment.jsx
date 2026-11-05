import { BASE_URL } from "../api";

export default function Attachment({ file, type, size = 48 }) {
  const style = { width: size, height: size };
  if (!file)
    return (
      <div className="att att-empty" style={style}>
        <i className="bi bi-paperclip"></i>
      </div>
    );
  const url = `${BASE_URL}/uploads/${file}`;
  if (type && type.startsWith("image/"))
    return (
      <a href={url} target="_blank" rel="noreferrer">
        <img src={url} alt="attachment" className="att att-img" style={style} />
      </a>
    );
  const ext = file.split(".").pop().slice(0, 4).toUpperCase();
  return (
    <a href={url} target="_blank" rel="noreferrer" className="att att-file" style={style} title={file}>
      <i className="bi bi-file-earmark-text"></i>
      <small>{ext}</small>
    </a>
  );
}
