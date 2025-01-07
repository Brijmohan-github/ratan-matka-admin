import { fetchData, formatDate, updateData } from "@/api/ClientFunction";
import { Table } from "antd";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { TiCancelOutline } from "react-icons/ti";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { toast } from "react-toastify";
import Spinner from "@/components/Spinner";
import { useNavigate } from "react-router-dom";
import SearchInput from "@/components/SearchInput";
import { FaWhatsapp } from "react-icons/fa6";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";

import downloadExcel from "@/api/ClientFunction";

export default function Users() {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [userSearch2, setUserSearch2] = useState("");

  async function ChangeShowStatus(status, userId) {
    if (!status || !userId) {
      toast.error("userId or show not persent");
    }
    const res = await updateData(`admin/showusergame?userid=${userId}`, {
      show: status,
    });
    if (res.success || res.status) {
      toast.success(res.message);
      mutate(`admin/getalluser?page=${currentPage}&limit=${pageSize}&search=${userSearch}`);
    }
  }
  const columns = [
    {
      title: "User Name",
      key: "username",
      width: 200,
      className: "font-inter",
      render: (_, data) => (
        <div
          className="flex items-center gap-3  text-blue-500 cursor-pointer"
          onClick={() => navigate(`/userdetail/${data._id}`)}
        >
          <span className="font-500 font-inter">{data?.name}</span>
        </div>
      ),
    },
    {
      title: "Phone",
      width: 200,
      key: "phone",
      className: "font-inter",
      render: (_, data) => (
        <div className="flex items-center gap-2 font-500 font-inter">
          {data?.phone}
          <a
            href={`https://wa.me/+91${data.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
          >
            <FaWhatsapp size={20} color="green" />
          </a>
        </div>
      ),
    },
    // {
    //   title: "Email",
    //   key: "email",
    //   width: 300,
    //   className: "font-inter",
    //   render: (_, data) => (
    //     <div className="font-500 font-inter">{data.email}</div>
    //   ),
    // },
    {
      title: "Password",
      key: "password",
      width: 180,
      className: "font-inter",
      render: (_, data) => (
        <div className="font-500 font-inter">{data?.password}</div>
      ),
    },
    {
      title: "Money",
      key: "money",
      width: 180,
      className: "font-inter",
      render: (_, data) => (
        <div className="font-600 font-inter text-purple-600">{data?.money}</div>
      ),
    },

    {
      title: "Status",
      key: "status",
      width: 200,
      className: "font-inter",
      render: (_, data) => (
        <div
          className={`font-500 font-inter ${
            data?.status == "Approved" ? "text-green-600" : "text-red-600"
          }`}
        >
          {data?.status}
        </div>
      ),
    },
    {
      title: "Date",
      key: "date",
      width: 200,
      className: "font-inter",
      render: (_, data) => (
        <div className="font-500 font-inter">{formatDate(data?.createdAt)}</div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
      className: "font-inter",
      render: (_, data) => (
        <div className="w-[50px] flex items-center gap-3">
          {data?.status == "Approved" && (
            <button
              className="font-primary text-red-600 cursor-pointer bg-transparent border border-red-600 py-2 px-4 rounded hover:bg-red-600 hover:text-white font-medium transition-colors duration-300"
              title="Reject"
              onClick={() => handleChangeStatus("Rejected", data._id)}
            >
              Reject
            </button>
          )}
          {data?.status == "Rejected" && (
            <button
              className="font-primary text-green-600 cursor-pointer bg-transparent border border-green-600 py-2 px-4 rounded hover:bg-green-600 hover:text-white font-medium transition-colors duration-300"
              title="Reject"
              onClick={() => handleChangeStatus("Approved", data._id)}
            >
              Approve
            </button>
          )}

          {data?.show == true && (
            <button
              className="font-primary text-purple-600 cursor-pointer bg-transparent border border-purple-600 py-2 px-4 rounded hover:bg-purple-600 hover:text-white transition-colors duration-300"
              title="Hide"
              onClick={() => ChangeShowStatus("no", data._id)}
            >
              Hide
            </button>
          )}
          {data?.show == false && (
            <button
              className="font-primary text-yellow-600 cursor-pointer bg-transparent border border-yellow-600 py-2 px-4 rounded hover:bg-yellow-600 hover:text-white transition-colors duration-300"
              title="Show"
              onClick={() => ChangeShowStatus("yes", data._id)}
            >
              Show
            </button>
          )}
        </div>
      ),
    },
  ];
  const [userData, setuserData] = useState([]);


  const navigate = useNavigate();
  const { data, error, isLoading } = useSWR(`admin/getalluser?page=${currentPage}&limit=${pageSize}&search=${userSearch}`, fetchData);
  useEffect(() => {
    if (data && data?.data?.allUser) {
      setuserData(data?.data?.allUser);
      setCurrentPage(data?.data?.pagination?.currentPage);
      setTotalPage(data?.data?.pagination?.totalPages);
      setTotalCount(data?.data?.pagination?.totalCount);
    }
  }, [data]);
  async function handleChangeStatus(status, id) {
    const res = await updateData("admin/changeuserstatus", {
      status: status,
      id: id,
    });
    if (res.status) {
      toast.success(res.message);
      mutate(`admin/getalluser?page=${currentPage}&limit=${pageSize}&search=${userSearch}`);
    } else {
      toast.error(res.message ? res.message : "Something went wrong");
    }
  }


  if (isLoading) return <Spinner />;
  const filterUserData = (userData, searchTerm) => {
    if (!searchTerm.trim()) return userData;
    const searchLower = searchTerm.toLowerCase();
    return userData.filter((user) => {
      const moneyString = user.money.toString();
      const dateString = new Date(user.createdAt)
        .toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
        .toLowerCase();

      return (
        user?.name?.toLowerCase().includes(searchLower) ||
        user?.phone?.toString().includes(searchLower) ||
        // user?.email?.toLowerCase().includes(searchLower) ||
        moneyString?.includes(searchLower) ||
        user?.status?.toLowerCase().includes(searchLower) ||
        dateString?.includes(searchLower)
      );
    });
  };

  const handleTableChange = (pagination) => {


    setCurrentPage(pagination);

  };
  return (
    <>
      <div className="flex flex-col gap-4 items-center sm:flex-row">

      <SearchInput searchText={userSearch2} setSearchText={setUserSearch2} />
        <button
          className="font-primary cursor-pointer bg-green-600 border border-green-600 py-2 px-8  rounded hover:bg-green-600 hover:text-white text-white font-medium transition-colors duration-300"
          title="Reject"
          onClick={() => setUserSearch(userSearch2)}
        >
          Search
        </button>
    </div>
      <button
        onClick={() => downloadExcel(userData)}
        style={{
          backgroundColor: "#228be6", // Green background
          color: "white", // White text
          padding: "10px 20px", // Padding around the text
          border: "none", // No border
          borderRadius: "5px", // Rounded corners
          cursor: "pointer", // Pointer cursor on hover
          fontSize: "16px", // Font size
          margin: "10px", // Margin around the button
        }}
      >
        Download as Excel
      </button>


      <Table
        columns={columns}
        dataSource={userData}
        pagination={{
          current: currentPage,
          pageSize,
          total: totalCount,
          showSizeChanger: false,
          onChange: handleTableChange,

        }}
        rowKey="_id"
      />
    </>
  );
}



// import { fetchData, formatDate, updateData } from "@/api/ClientFunction";
// import { Table } from "antd";
// import { useEffect, useState } from "react";
// import useSWR, { mutate } from "swr";
// import { toast } from "react-toastify";
// import Spinner from "@/components/Spinner";
// import { useNavigate } from "react-router-dom";
// import SearchInput from "@/components/SearchInput";
// import { FaWhatsapp } from "react-icons/fa6";
// import downloadExcel from "@/api/ClientFunction";

// export default function Users() {
//   const [currentPage, setCurrentPage] = useState(1);  // Changed to 1 to start from first page
//   const [totalPage, setTotalPage] = useState(0);
//   const [pageSize, setPageSize] = useState(25);
//   const [totalCount, setTotalCount] = useState(0);
//   const [userSearch, setUserSearch] = useState("");
//   const [triggerSearch, setTriggerSearch] = useState(false);  // New state to trigger search

//   async function ChangeShowStatus(status, userId) {
//     if (!status || !userId) {
//       toast.error("userId or show not present");
//       return;
//     }
//     const res = await updateData(`admin/showusergame?userid=${userId}`, {
//       show: status,
//     });
//     if (res.success || res.status) {
//       toast.success(res.message);
//       mutate(`admin/getalluser?page=${currentPage}&limit=${pageSize}&search=${userSearch}`);
//     }
//   }

//   const columns = [
//     {
//       title: "User Name",
//       key: "username",
//       width: 200,
//       className: "font-inter",
//       render: (_, data) => (
//         <div
//           className="flex items-center gap-3  text-blue-500 cursor-pointer"
//           onClick={() => navigate(`/userdetail/${data._id}`)}
//         >
//           <span className="font-500 font-inter">{data?.name}</span>
//         </div>
//       ),
//     },
//     {
//       title: "Phone",
//       width: 200,
//       key: "phone",
//       className: "font-inter",
//       render: (_, data) => (
//         <div className="flex items-center gap-2 font-500 font-inter">
//           {data?.phone}
//           <a
//             href={`https://wa.me/+91${data.phone}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             title="Chat on WhatsApp"
//           >
//             <FaWhatsapp size={20} color="green" />
//           </a>
//         </div>
//       ),
//     },
//     {
//       title: "Password",
//       key: "password",
//       width: 180,
//       className: "font-inter",
//       render: (_, data) => (
//         <div className="font-500 font-inter">{data?.password}</div>
//       ),
//     },
//     {
//       title: "Money",
//       key: "money",
//       width: 180,
//       className: "font-inter",
//       render: (_, data) => (
//         <div className="font-600 font-inter text-purple-600">{data?.money}</div>
//       ),
//     },
//     {
//       title: "Status",
//       key: "status",
//       width: 200,
//       className: "font-inter",
//       render: (_, data) => (
//         <div
//           className={`font-500 font-inter ${data?.status == "Approved" ? "text-green-600" : "text-red-600"
//             }`}
//         >
//           {data?.status}
//         </div>
//       ),
//     },
//     {
//       title: "Date",
//       key: "date",
//       width: 200,
//       className: "font-inter",
//       render: (_, data) => (
//         <div className="font-500 font-inter">{formatDate(data?.createdAt)}</div>
//       ),
//     },
//     {
//       title: "Action",
//       dataIndex: "action",
//       key: "action",
//       width: 150,
//       className: "font-inter",
//       render: (_, data) => (
//         <div className="w-[50px] flex items-center gap-3">
//           {data?.status == "Approved" && (
//             <button
//               className="font-primary text-red-600 cursor-pointer bg-transparent border border-red-600 py-2 px-4 rounded hover:bg-red-600 hover:text-white font-medium transition-colors duration-300"
//               title="Reject"
//               onClick={() => handleChangeStatus("Rejected", data._id)}
//             >
//               Reject
//             </button>
//           )}
//           {data?.status == "Rejected" && (
//             <button
//               className="font-primary text-green-600 cursor-pointer bg-transparent border border-green-600 py-2 px-4 rounded hover:bg-green-600 hover:text-white font-medium transition-colors duration-300"
//               title="Approve"
//               onClick={() => handleChangeStatus("Approved", data._id)}
//             >
//               Approve
//             </button>
//           )}

//           {data?.show == true && (
//             <button
//               className="font-primary text-purple-600 cursor-pointer bg-transparent border border-purple-600 py-2 px-4 rounded hover:bg-purple-600 hover:text-white transition-colors duration-300"
//               title="Hide"
//               onClick={() => ChangeShowStatus("no", data._id)}
//             >
//               Hide
//             </button>
//           )}
//           {data?.show == false && (
//             <button
//               className="font-primary text-yellow-600 cursor-pointer bg-transparent border border-yellow-600 py-2 px-4 rounded hover:bg-yellow-600 hover:text-white transition-colors duration-300"
//               title="Show"
//               onClick={() => ChangeShowStatus("yes", data._id)}
//             >
//               Show
//             </button>
//           )}
//         </div>
//       ),
//     },
//   ];

//   const [userData, setUserData] = useState([]);
//   const navigate = useNavigate();

//   // Only call SWR when triggerSearch is true, i.e., when the search button is pressed
//   const { data, error, isLoading } = useSWR(
//     triggerSearch ? `admin/getalluser?page=${currentPage}&limit=${pageSize}&search=${userSearch}` : `admin/getalluser?page=${currentPage}&limit=${pageSize}`,
//     fetchData
//   );

//   useEffect(() => {
//     if (data && data?.data?.allUser) {
//       setUserData(data?.data?.allUser);
//       setCurrentPage(data?.data?.pagination?.currentPage);
//       setTotalPage(data?.data?.pagination?.totalPages);
//       setTotalCount(data?.data?.pagination?.totalCount);
//       setTriggerSearch(false)
//     }
//   }, [data]);

//   async function handleChangeStatus(status, id) {
//     const res = await updateData("admin/changeuserstatus", {
//       status: status,
//       id: id,
//     });
//     if (res.status) {
//       toast.success(res.message);
//       mutate(`admin/getalluser?page=${currentPage}&limit=${pageSize}&search=${userSearch}`);
//     } else {
//       toast.error(res.message ? res.message : "Something went wrong");
//     }
//   }

//   // Handle search button click
//   const handleSearch = () => {
//     setTriggerSearch(true);
//   };

//   const handleTableChange = (pagination) => {
//     setCurrentPage(pagination);
//   };

//   if (isLoading) return <Spinner />;

//   return (
//     <>
//       <div className="flex flex-col  items-center sm:flex-row">
//         <SearchInput searchText={userSearch} setSearchText={setUserSearch} />
//         <button
//           onClick={handleSearch}  // Search is triggered when the button is clicked
//           style={{
//             backgroundColor: "#228be6", // Button color
//             color: "white",
//             padding: "10px 20px",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           Search
//         </button>
//       </div>
//       <button
//         onClick={() => downloadExcel(userData)}
//         style={{
//           backgroundColor: "#228be6", // Green background
//           color: "white", // White text
//           padding: "10px 20px", // Padding around the text
//           border: "none", // No border
//           borderRadius: "5px", // Rounded corners
//           cursor: "pointer", // Pointer cursor on hover
//           fontSize: "16px", // Font size
//           margin: "10px", // Margin around the button
//         }}
//       >
//         Download as Excel
//       </button>
//       <Table
//         columns={columns}
//         dataSource={userData}
//         pagination={{
//           current: currentPage,
//           pageSize,
//           total: totalCount,
//           showSizeChanger: false,
//           onChange: handleTableChange,
//         }}
//         rowKey="_id"
//       />
//     </>
//   );
// }
