import { ToggleButton } from "../SmallReusableComponents/Action";
import { useSearchContext } from "../Context api/Context";
import axios from "axios";
import { useEffect, useState } from "react";
import { server } from "../../server";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Box,
  HStack,
} from "@chakra-ui/react";

import ReactPaginate from "react-paginate";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import "./Table.css";
import { BiEdit } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";
import { useRouter } from "next/router";
import { HiOutlineEye } from "react-icons/hi";

const deleteUser = (id) => {
  axios
    .delete(server + `users/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
};

const changeActiveStatus = (id) => {
  axios
    .put(server + `users/${id}/active`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.error(err);
    });
};

const TableTemplate = ({ data, text, columns, itemsPerPage }) => {
  var num = 0;
  itemsPerPage = itemsPerPage || 10;
  const [currentPage, setCurrentPage] = useState(0);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const slicedData = data?.slice(startIndex, endIndex);
  const { searchQuery } = useSearchContext();
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const handleNavigation = (to, router) => {
    router.push(to);
  };

  const Actions = ({ item }) => {
    const columnId = item.id;
    console.log(columnId);
    const router = useRouter();
    return (
      <HStack align={"center"} justifyContent={"space-between"}>
        <Box onClick={() => handleNavigation("/Admin/VideoDetails", router)}>
          <HiOutlineEye cursor={"pointer"} size={25} />
        </Box>
        <AiOutlineDelete cursor={"pointer"} size={25} />
        <ToggleButton columnId={columnId} data={item} cursor={"pointer"} />
      </HStack>
    );
  };

  const totalPages = Math.ceil(data?.length / itemsPerPage);

  return (
    <>
      <TableContainer
        mt={"1rem"}
        borderRadius={"10px"}
        borderWidth={"2px"}
        borderColor={"blackAlpha.600"}
        bg={"#232323"}
        p={4}
      >
        <Table>
          {text ? <TableCaption>{text}</TableCaption> : null}
          <Thead bg={"#181818"}>
            <Tr>
              {columns.map((c) => (
                <Th
                  textAlign={"center"}
                  maxWidth={"10rem"}
                  px={"10px"}
                  borderRight={"1px"}
                  borderColor={"blackAlpha.600"}
                  color="white"
                  key={c}
                >
                  {c}
                </Th>
              ))}
              {Actions ? (
                <Th
                  textAlign={"center"}
                  borderRight={"1px"}
                  borderColor={"blackAlpha.600"}
                  color="white"
                >
                  Actions
                </Th>
              ) : null}
            </Tr>
          </Thead>

          <Tbody>
            {slicedData?.map((item, index) => {
              num++;

              return (
                <Tr
                  style={
                    num % 2 === 0
                      ? { background: "#232323" }
                      : { background: "#323232" }
                  }
                  key={index}
                >
                  {columns.map((column) => {
                    return (
                      <Td
                        textAlign={"center"}
                        borderRight={"1px"}
                        borderBottom={0}
                        borderColor={"blackAlpha.600"}
                        key={column}
                      >
                        {item[column]}
                      </Td>
                    );
                  })}
                  {Actions ? (
                    <Td
                      textAlign={"center"}
                      borderBottom={0}
                      borderRight={"1px"}
                      borderColor={"blackAlpha.600"}
                    >
                      {" "}
                      <Actions item={item} columnId={item.id} />{" "}
                    </Td>
                  ) : null}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      {itemsPerPage >= 10 ? (
        <>
          <ReactPaginate
            previousLabel={
              currentPage === 0 ? (
                <Button
                  bg={"#232323"}
                  leftIcon={<ChevronLeftIcon />}
                  onClick={() => handlePageClick({ selected: currentPage - 1 })}
                  isDisabled
                ></Button>
              ) : (
                <Button
                  bg={"#232323"}
                  _hover={{ bg: "#323232" }}
                  leftIcon={<ChevronLeftIcon />}
                  onClick={() => handlePageClick({ selected: currentPage - 1 })}
                ></Button>
              )
            }
            nextLabel={
              currentPage === totalPages - 1 ? (
                <Button
                  bg={"#232323"}
                  rightIcon={<ChevronRightIcon />}
                  onClick={() => handlePageClick({ selected: currentPage + 1 })}
                  isDisabled
                ></Button>
              ) : (
                <Button
                  bg={"#232323"}
                  _hover={{ bg: "#323232" }}
                  rightIcon={<ChevronRightIcon />}
                  onClick={() => handlePageClick({ selected: currentPage + 1 })}
                ></Button>
              )
            }
            breakLabel={"..."}
            pageCount={Math.ceil(data?.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </>
      ) : null}
    </>
  );
};

const VideoTableColumns = [
  "id",
  "name",
  "views",
  "creator_name",
  "rented_amount",
  "purchasing_amount",
  "createdAt",
];

export default function VideoTable() {
  const { searchQuery, isFilter } = useSearchContext();
  const [videoData, setVideoData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${server}users/videos`, {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        });
        const modifiedData = await response.data.videos.map((item) => {
          const datePart = item.createdAt.split("T")[0];
          return {
            ...item,
            createdAt: datePart,
          };
        });
        setVideoData(modifiedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  videoData?.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  console.log(videoData);

  const filterData = () => {
    if (searchQuery) {
      return videoData.filter(
        (data) =>
          data.Video_ID.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.Video_Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.Creator_Name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return videoData;
  };
  return (
    <TableTemplate
      data={searchQuery?.length > 1 && isFilter ? filterData() : videoData}
      columns={VideoTableColumns}
    />
  );
}