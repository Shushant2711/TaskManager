const slug = (v) => v.replace(/\s+/g, "").toLowerCase();

export const PriorityBadge = ({ value }) => (
  <span className={`tag pri-${slug(value)}`}>
    <i className="bi bi-flag-fill"></i> {value}
  </span>
);

export const StatusBadge = ({ value }) => (
  <span className={`tag sta-${slug(value)}`}>
    <span className="dot"></span> {value}
  </span>
);

export const Avatar = ({ name }) => {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <span className="avatar" style={{ background: `hsl(${hue} 55% 92%)`, color: `hsl(${hue} 50% 30%)` }}>
      {initials}
    </span>
  );
};
