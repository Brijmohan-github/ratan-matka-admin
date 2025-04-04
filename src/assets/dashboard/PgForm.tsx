// interface IconPropTypes {
//   type?: string;
// }
// const getIconColor = () => {
//   switch (type) {
//     case "hover":
//       return "#ffffff";
//     default:
//       return "#ffffff";
//   }
// };
// onMouseEnter={(e) => {
//         (e.target as svgElement).style.stroke = "#fff"; // Change stroke color on hover
//       }}
//       onMouseLeave={(e) => {
//         (e.target as svgElement).style.stroke ="#98A2B3"; // Reset stroke color on leave

//       }}

function PgForm() {
  return (
    <>
      <svg
        width="24"
        height="24"
        fill="transparent"
        className="hover:stroke-white"
      >
        <path
          d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8M9 2H15C15.5523 2 16 2.44772 16 3V5C16 5.55228 15.5523 6 15 6H9C8.44772 6 8 5.55228 8 5V3C8 2.44772 8.44772 2 9 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </>
  );
}

export default PgForm;
