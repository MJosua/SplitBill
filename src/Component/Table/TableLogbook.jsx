import CardFilterSearch from "../Function/CardFilterSearch"
import { useLocation } from "react-router-dom"
import axios from "axios";

import { API_URL } from "../../config";
import { useEffect, useState } from "react";

import Filter from "../Pagination/Filter";
import PageNumber from "../Pagination/PageNumber";
import { Input } from "@chakra-ui/react";
import CardInput from "../Function/CardInput";

function TableLogBook() {
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState("");
    const [category, setCategory] = useState("");

    const [startingdate, setStartingDate] = useState("");
    const [endingdate, setEndingDate] = useState("");

    const [limit, setLimit] = useState(10);
    const handleLimitChange = (value) => {
        setLimit(value);
        setPage(1);
    }


    const [dataLog, setDataLog] = useState([]);
    const getDataLog = async (e) => {
        const response = await
            axios.get(
                `${API_URL}/log/data?id=${e}&searchTerm=${searchTerm}&category=${category}`
                +
                `&startDate=${startingdate}&endDate=${endingdate}`
                +
                `&limit=${limit}&offset=${(page - 1) * limit}`
            );
        setDataLog(response.data.data);
        setTotalPage(response.data.totalPage)

    }


    const [totalPage, setTotalPage] = useState(1);
    const pageIndices = [...Array(totalPage).keys()];
    const [page, setPage] = useState(1);

    const handlePageChange = (value) => {
        setPage(value)
    }

    const handlePageIncrement = () => {
        if (page != totalPage) {
            setPage(page + 1)
        }
    }

    const handlePageDecrement = () => {
        if (page != 1) {
            setPage(page - 1)
        }
    }



    const [dateLog, setDateLog] = useState([]);
    const getDatelog = async () => {
        const res = await
            axios.get(`${API_URL}/log/date`);
        setDateLog(res.data.rows)
    }


    const [dataCategory, setDataCategory] = useState([]);
    const getDataCategory = async () => {
        try {
            const response = await
                axios.get(`${API_URL}/inven/category`);
            setDataCategory(response.data)
        } catch (error) {
            console.error('error input data', error);
        }
    };

    useEffect(() => {
        getDataLog();
        getDatelog();
        getDataCategory();
    }, [searchTerm, category, startingdate, endingdate, limit, page])


    return (

        <div className="kartu-dalam mb-3 pt-4 pb-2 pe-3">
            <div className="row ">
                <CardFilterSearch
                    location={location}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setCategory={setCategory}
                    dateLog={dateLog}
                    startingdate={startingdate}
                    endingdate={endingdate}
                    setStartingDate={setStartingDate}
                    setEndingDate={setEndingDate}
                    dataCategory={dataCategory}
                    setDataCategory={setDataCategory}
                    handleLimitChange={handleLimitChange}
                    limit={limit}
                />
                <div className="col-12">
                   <CardInput
                   getData={getDataLog}
                   />
                </div>
                <div className="col-12 pe-3 ps-4 mt-1 px-0 ">
                    <div className="table-responsive ">
                        <table className="table table-bordered table-sm table-striped  px-0 ">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Info</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>

                                {dataLog.map((log, idx) => (
                                    <tr key={idx}
                                        className={
                                            log.id_status === 1 ? "table-success" :
                                                log.id_status === 2 ? "table-danger" :
                                                    log.id_status === 3 ? "table-warning" :
                                                        ""
                                        }
                                    >
                                        <td>
                                            {idx + 1}
                                        </td>
                                        <td>
                                            {log.Deskripsi}
                                        </td>
                                        <td>
                                            {log.event_date}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                    <PageNumber
                        totalPage={totalPage}
                        page={page}
                        pageIndices={pageIndices}
                        handlePageDecrement={handlePageDecrement}
                        handlePageIncrement={handlePageIncrement}
                        handlePageChange={handlePageChange}
                    />
                </div>

            </div>
        </div>
    )
}
export default TableLogBook