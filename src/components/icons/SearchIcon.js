export default function SearchIcon(props) {
  // Below: Hard-coding this one here because for some reason the "path" portions of the SVG image
  // actually get filled in with colour (they should be empty) when importing it as the source
  // inside an <img> tag.
  return (
    <svg width="36" height="33" viewBox="0 0 36 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.0449 20.8022C24.5047 21.6574 23.8716 22.4479 23.1598 23.1598L33 33L35.1213 30.8787L25.0449 20.8022Z"
        fill={props.disabled ? "black" : "var(--light-grey)"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5667 24.1333C19.4025 24.1333 24.1333 19.4025 24.1333 13.5667C24.1333 7.73086 19.4025 3 13.5667 3C7.73086 3 3 7.73086 3 13.5667C3 19.4025 7.73086 24.1333 13.5667 24.1333ZM13.5667 27.1333C21.0593 27.1333 27.1333 21.0593 27.1333 13.5667C27.1333 6.074 21.0593 0 13.5667 0C6.074 0 0 6.074 0 13.5667C0 21.0593 6.074 27.1333 13.5667 27.1333Z"
        fill={props.disabled ? "black" : "var(--light-grey)"}
      />
    </svg>
  );
}