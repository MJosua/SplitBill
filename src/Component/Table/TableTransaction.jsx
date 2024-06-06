import { useState } from "react";
import CardInput from "../Function/CardInput";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    InputGroup,
    InputRightAddon
} from '@chakra-ui/react';
import { API_URL } from "../../config";
import axios from "axios";

function TableTransaction() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [idTarget, setIdTarget] = useState()
    const [data, setData] = useState([]);
    const getData = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/inven/data?id=${id}`);
            if (response.data.length > 0) {
                setData(response.data);
            } else {
                setError("No data.");
            }
        } catch (error) {
            setError("An error occurred while fetching data.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const [errorInven, setErrorInven] = useState(null);
    const [inven, setInven] = useState([]);
    const getInven = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/inven/inven?id=${id}`);
            if (response.data.length > 0) {
                setInven(response.data);
                setNamaPanjang(response.data[0].panjang_product)
                setNamaDiameter(response.data[0].diameter_product)
                setMnf_date(response.data[0].mnf_date);
                setActive(response.data[0].active);
                setId_product(response.data[0].id_product);
                console.log("inven", response.data);
            } else {
                setErrorInven("No data.");
            }
        } catch (error) {
            setErrorInven("An error occurred while fetching data.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const {
        isOpen: isOpenAddItem,
        onOpen: onOpenAddItem,
        onClose: onCloseAddItem
    } = useDisclosure();

    const {
        isOpen: isOpenDeleteItem,
        onOpen: onOpenDeleteItem,
        onClose: onCloseDeleteItem
    } = useDisclosure();

    const [namaPanjang, setNamaPanjang] = useState("");
    const [namaDiameter, setNamaDiameter] = useState("");
    const [mnf_date, setMnf_date] = useState()
    const [active, setActive] = useState()
    const [id_product, setId_product] = useState()
    const handleClickUpdate = async () => {
        try {
            await axios.post(API_URL + '/inven/inven', {
                panjang_product: namaPanjang, // Use panjang instead of namaPanjang
                diameter_product: namaDiameter, // Use diameter instead of namaDiameter
                mnf_date: mnf_date, // Use nama_produk instead of namaProduk
                active: active,
                id_product: id_product

            });
            setNamaPanjang()
            setNamaDiameter()
            getInven(idTarget);
            onCloseAddItem();
        } catch (error) {
            console.error('error input data', error);
        }
    };

    const handleClickDelete = async () => {
        try {
            await axios.post(API_URL + '/inven/inven/deactive', {
                panjang_product: 0, // Use panjang instead of namaPanjang
                diameter_product: namaDiameter, // Use diameter instead of namaDiameter
                mnf_date: mnf_date, // Use nama_produk instead of namaProduk
                active: 'false',
                id_product: id_product

            });
            setNamaPanjang()
            setNamaDiameter()
            getInven(idTarget);
            onCloseDeleteItem();
        } catch (error) {
            console.error('error input data', error);
        }
    };


    return (
        <div className="kartu-dalam mb-4 py-4 pe-2">
            <div className="row">
                <div className="col-12 d-flex justify-content-center">
                    <CardInput
                        getData={getData}
                        getInven={getInven}
                        idTarget={idTarget}
                        setIdTarget={setIdTarget}
                    />
                </div>
                <div className="col-12 pe-3 ps-4 mt-2 px-0">
                    {loading ? (
                        <div className="d-flex fw-bold text-secondary justify-content-center align-items-center">
                            <p className="text-center">Loading data...</p>
                        </div>

                    ) : error ? (
                        <div className="d-flex fw-bold text-secondary justify-content-center align-items-center">
                            <p className="text-center"

                            >{error}</p>
                        </div>
                    ) : (data.length > 0) && (inven.length > 0) ? (
                        <div className={"card  "}>
                            <div className={"card-header px-0 " + (inven[0].active === 1 ? "bg-success" : "bg-danger")}>
                                <div className="container-fluid">
                                    <div className="row fw-bold">
                                        <div className={"col-md-9 col-6 "}>
                                            ITEM INFO
                                        </div>
                                        <div className="col-md-3 col-6 d-flex justify-content-end">
                                            {(inven[0].active === 1 || inven[0].active === undefined) && (
                                                <Button
                                                    size="xs"
                                                    colorScheme="yellow"
                                                    onClick={onOpenAddItem}
                                                    className="px-3"
                                                >
                                                    Update
                                                </Button>
                                            )}
                                            {(inven[0].active === 1 || inven[0].active === undefined) && (
                                                <Button
                                                    size="xs"
                                                    colorScheme="red"
                                                    onClick={onOpenDeleteItem}
                                                    className="px-3 ms-2"
                                                >
                                                    Dispose
                                                </Button>
                                            )}


                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="row py-2 px-3">

                                <div className="col-12  col-md-6">
                                    <div className="row">
                                        <div className="col-12 fw-bold"> {data[0].nama_produk}</div>
                                        <div className="col-7  col-md-4">Jenis</div>
                                        <div className="col-5  col-md-8">: {data[0].category_name}</div>
                                        <div className="col-7  col-md-4">Panjang Ori</div>
                                        <div className="col-5  col-md-8">: {data[0].panjang}</div>
                                        <div className="col-7  col-md-4">Diameter Ori</div>
                                        <div className="col-5  col-md-8">: {data[0].diameter}</div>
                                        <div className="col-7  col-md-4">Code</div>
                                        <div className="col-5 col-md-8">: {data[0].id_product}</div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6">
                                    <div className="row">
                                        <div className="col-7 col-md-4">Jumlah Pakai</div>
                                        <div className="col-5 col-md-8">: {inven ? (inven[0].total_count - 1) : errorInven} </div>
                                        <div className="col-7 col-md-4">Lokasi Simpan</div>
                                        <div className="col-5 col-md-8">: {data[0].lokasi_name}</div>
                                        <div className="col-7 col-md-4">Panjang Real</div>
                                        <div className="col-5 col-md-8">: {inven[0].panjang_product ? inven[0].panjang_product : errorInven}</div>
                                        <div className="col-7 col-md-4">Diameter Real</div>
                                        <div className="col-5 col-md-8">: {inven[0].panjang_product ? inven[0].diameter_product : errorInven}</div>
                                        <div className="col-7 col-md-4">Status </div>
                                        <div className="col-5 col-md-8">:  {(inven[0].active === 1 || inven[0].active === undefined) ? (
                                            "Active"
                                        ) :
                                            "Disposed"
                                        }</div>
                                    </div>
                                </div>
                            </div>

                            <Modal isOpen={isOpenAddItem} onClose={onCloseAddItem}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Update Data Historis</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <div className="container">
                                            <div className="row mb-2">
                                                <div className="col-5 d-flex align-items-center">Nama Item</div>
                                                <div className="col-7">
                                                    <Input isDisabled
                                                        value={data[0].nama_produk}
                                                        size="sm" />
                                                </div>
                                            </div>

                                            <div className="row mb-2">
                                                <div className="col-5 d-flex align-items-center">
                                                    Panjang Baru
                                                </div>
                                                <div className="col-7">
                                                    <InputGroup size="sm">
                                                        <Input
                                                            value={namaPanjang}
                                                            onChange={(event) => setNamaPanjang(event.target.value)}
                                                        />
                                                        <InputRightAddon className="user-select-none">
                                                            &nbsp;&nbsp;&nbsp; M
                                                        </InputRightAddon>
                                                    </InputGroup>
                                                </div>

                                            </div>

                                            <div className="row mb-2">
                                                <div className="col-5 d-flex align-items-center">
                                                    Diameter Baru
                                                </div>
                                                <div className="col-7">
                                                    <InputGroup size="sm">
                                                        <Input
                                                            value={namaDiameter}
                                                            onChange={(event) => setNamaDiameter(event.target.value)}
                                                        />
                                                        <InputRightAddon className="user-select-none">
                                                            &nbsp; CM
                                                        </InputRightAddon>
                                                    </InputGroup>
                                                </div>
                                            </div>


                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            variant="solid"
                                            size={"sm"}
                                            colorScheme="yellow"
                                            onClick={handleClickUpdate}
                                        >
                                            Update
                                        </Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>


                            <Modal isOpen={isOpenDeleteItem} onClose={onCloseDeleteItem}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Dispose Confirmation</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <div className="container">
                                            <div className="row mb-2">
                                                <div className="col-5 d-flex align-items-center">Nama Item</div>
                                                <div className="col-7">
                                                    <Input isDisabled
                                                        value={data[0].nama_produk}
                                                        size="sm" />
                                                </div>
                                            </div>




                                        </div>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            variant="solid"
                                            size={"sm"}
                                            colorScheme="red"
                                            onClick={handleClickDelete}
                                        >
                                            Dispose
                                        </Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>


                        </div>
                    ) : (
                        <div className="d-flex fw-bold text-secondary justify-content-center align-items-center">
                            <p>No data to display.</p>
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
}

export default TableTransaction;
